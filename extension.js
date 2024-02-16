//todo Make org/lang/res hierarchical
//todo Support resource containers
//todo Detect difs of zips and folders to minimize downloading unchanged files
//todo Finish ingest
//todo Add webview privateGPT client

//* Note: 

// Import the module and reference it with the alias vscode in your code below
  const vscode     = require( 'vscode' );  // The module 'vscode' contains the VS Code extensibility API
  const decompress = require( 'decompress' );
  const https      = require( 'https' );
  const fs         = require( 'fs' );
  const path       = require( 'path' );
//const privateGPTbase = "/mnt/c/SpidelTech/Projects/privateGPT/source_documents/"

/**
 * @param {vscode.ExtensionContext} context
 * 
 * This method is called when extension is activated
 * extension is activated the very first time the command is executed
 * Use the console to output diagnostic information (console.log) and errors (console.error)
 * This line of code will only be executed once when your extension is activated
*/
async function activate( context ) {
  myLog( 'Congratulations, your extension "vs-dcs" is now active!', "" );

//* get a list of common resource types and their tags
  const recs = [ 
//  { label: 'All (*)'                      , code: '*'   },
    { label: 'Literal Text (ULT)'           , code: 'ult' },
		{ label: 'Simplified Text (UST)'        , code: 'ust' },
		{ label: 'Open Bible Stories (OBS)'     , code: 'obs' },
    { label: 'Book Package (bp)'            , code: 'bp'  },
    { label: 'Repo List (zip)'              , code: 'zip' },
		{ label: 'Translation Academy (tA)'     , code: 'ta'  },
		{ label: 'Translation Notes (tN)'       , code: 'tn'  },
		{ label: 'Translation Words (tW)'       , code: 'tw'  },
		{ label: 'Translation Word Lists (tWl)' , code: 'twl' },
		{ label: 'Translation Questions (tQ)'   , code: 'tq'  }
  ];
  
  let resources = [];
    recs.map( ( ( {label} ) => resources.push( label ) ) );

  let codes = [];
    recs.map( ( ( {code} ) => codes.push( code ) ) );

//* Construct a list of all document Stages    
  const stages = [ /* 'All',*/ 'latest', 'prod', 'preprod' ];

//* position in local file system  
  const project = "/mnt/c/SpidelRoot/Projects/vs-dcs/";       //TODO replace this with your project folder
  const base = project + "resources/sources/";
  
  fs.lstat( base, err => {  // Verify resource and sources folders exist
    if( err ) {
      try {
        fs.mkdirSync( base );
      } catch( e ) {
        myLog( "Could not create local folder: " + base, e );
      }
    } else {
      myLog( "It seams that " + base, " already exists. Continuing." );
    }
  } );

  let orgsDta = {};
  let langsDta = {};
  let res = 0;
  let orgs  = [ /* 'All' */ ];
  let langs = [ /* 'All' */ ];

//* prefetch a list of all organizations
  myLog( 'get Organizations', "" );
  
  await getDCS( "/orgs?sort=lc" )
    .then( data => {
	    orgsDta = data; 
      orgsDta.map( ( ( { name } ) => orgs.push( name ) ) );
	  })
    .catch( error => console.log( "trapped error: ", error.message ) );
 
//* prefetch a list of all languages  
  myLog( 'get Languages', "" );

  await getDCS( "/languages/langnames.json?gw=true&sort=ang" )
    .then( data => {
	    langsDta = data; 
      langsDta.map( ( ( { ang, lc } ) => langs.push( ang + ", " + lc ) ) );
	  })
    .catch( error => console.log( "trapped error", error.message ) );

//* acquire repos	
  // The command is defined in the package.json file
  // The commandId parameter must match the command field in package.json
  let disposable_get_dcs = vscode.commands.registerCommand( 'vs-dcs.get-dcs', async function () {		
    let isZip = false;
    let zipfile = "";
    let dcsDta = {};

//* Select an Org
    myLog( `pick organization`, "" );
	  let org  = await vscode.window.showQuickPick( orgs, {  placeHolder: "Select Organization. Type to filter." } );
    myLog( `User picked organization: ${org}`, "" );
    let orgFilter = "";

    if( org != "All" ) {
      orgFilter = `&owner=${org}` 
    }

//* Select a language    
	  let lan = await vscode.window.showQuickPick( langs, { placeHolder: "Select Language. Type to filter." } );
	  myLog( `User picked language: ${lan}`, "" );
    let resFilter = "";
    let langFilter = "";
    let lang = "All";

    if( lan != "All" ) {
      let langParts = lan.split( ", " );
      lang = langParts[1].trim(); 
      langFilter = `&lang=${lang}`
    }
    
//* Select a resource    
     let repoObjAry = [];

    let resource = await vscode.window.showQuickPick( resources, { placeHolder: "Select Resource." } );
    myLog( `User picked resource: ${resource}`, "" );

    let idx = resources.indexOf( resource );
    res = codes[ idx ];
 
    if( res == "zip" ) {
      await getDCS( `/repos/search?&limit=500${orgFilter}${resFilter}` ) // DCS DEBUG
        .then( data => {
          dcsDta = data.data; 

           console.log( "dcsData: ", dcsDta );

          for( let row of dcsDta ) {
            console.log( "row: ", row );
            const flattened = flattenObj( row );
            console.log( "flattened: ", flattened  );
            
            if( flattened.hasOwnProperty( "catalog.latest.zipball_url" ) ) {
              repoObjAry.push( flattened["catalog.latest.zipball_url"] );
            }
          }

          console.log( "repoObjAry: ", repoObjAry );
        });

      zipfile  = await vscode.window.showQuickPick( repoObjAry, {  placeHolder: "Directly Select zip file. Type to filter." } );  
      isZip = true;
    }

    if( res != '*' && lang != "All" ) {
      resFilter = `&q=${lang}_${res}`;
    }

    if( ! isZip ) {
//* Select a document Stage (maturity) 
      let stage  = await vscode.window.showQuickPick( stages, { placeHolder: "Select Document development Stage" } );
      myLog( `User picked stage: ${stage}`, "" );
	    let stageFilter = "";

      if( stage != "All" ) {
        stageFilter = `&stage=${stage}`
      }

	    myLog( `get resource: ${resource}, language: ${lang}, org: ${org}, stage: ${stage} `, "" )

//* get owners
//  const owner =  vscode.window.showQuickPick(owners)

//* get all the repos
      await getDCS( `/repos/search?limit=500${langFilter}${orgFilter}${stageFilter}${resFilter}` )
       .then( data => dcsDta = data );

	    myLog( `got response: `, dcsDta );
//    let zipfiles = [];

	    try {
//      dcsDta.data.catalog.latest.map( ( ( { zipball_url } ) => zipfiles.push( zipball_url ) ) );
        zipfile = dcsDta.data[0].catalog.latest.zipball_url;
        myLog( "zipfile: ", zipfile);
	    } catch(e) { 
	      myLog( `Could not find: ${stage} ${resource} in: ${lang} in organization: ${org}`, "" ); 
	      return;
	    }
  }

	  myLog( `zip file name: ${zipfile}`, "" );

    //* download zip file
	    const zip  = `${base}${lang}_${res}.zip`;
	    const dir  = `${base}${res}`;
	    const fd   = fs.createWriteStream( zip );

	    const request = await https.get( zipfile, function( response ) {
	      response.pipe( fd );

	      fd.on( "finish", () => {
		      fd.close();
		      myLog( `Decompressing zip: ${zip} into dir: ${dir}. Please wait... `, "" );
	        //myLog( `Decompressing zip: ${zip} into dir: ${dir}. Please wait... `, "" );

          decompress( zip, dir ).then( () => { 
		        myLog( "Decompression Complete.", "" );		
		        //myLog( "Decompression Complete.", "" );
//TODO	    fs.unlink( zip ); 
		      });
		    });		  
		  });

		  request.on( 'error', err => {
		    fs.unlink( zip, () => myLog( "Error: ", err.message ) )	
		  });	   

    context.subscriptions.push(disposable_get_dcs);
	});


//* ingest  content. This will be split into a separate extension as gpt may be separate from repo aquizition
  let disposable_ingest_dcs = vscode.commands.registerCommand('vs-dcs.ingest-dcs', async function() {
    const configFile = project + "vs-dcs-ingest.json";
    const gptFolder = "/mnt/c/SpidelRoot/Projects/privateGpt/local_data/"
//    try {
      const file = fs.readFileSync( configFile, "utf8" )
//    console.log( "file: ", file );
      const folderList = JSON.parse( file );
//    console.log( "folderList: ", folderList );

      process.cwd( project );

      for( const folder of folderList ) {             // each folder in config
        for await( const f of walk( folder )) {  // each file in folder
          console.log( "f: ", f);
          // flatten name
          const target = gptFolder + f.replace( "/", "-" ); 
          // move to source documents folder
          fs.copyFile( f, target, err => {
            if( err ) {
              myLog( `Cannot copy ${f} to ${target}`)
            }
         } )
        }
      }
//    } catch( e ) {
//      myLog( `Cannot open config file ${configFile}`, "" );
//      return
//    }
   
/*  let user specify file to ingest  
    const folderPath = await vscode.window.showInputBox({
      prompt: 'Enter folder path',
      placeHolder: 'e.g. /home/user/folder'
    });
    myLog("🚀 ~ letdisposable_ingest_dcs=vscode.commands.registerCommand ~ folderPath:", folderPath)
*/   

// /mnt/c/SpidelRoot/Projects/vs-dcs/resources/sources

/*
    myLog( "folderPath: ", folderPath );

    if( folderPath ) {
      const folderUri = vscode.Uri.file( folderPath );
      myLog( `folderUri: ${folderUri}`, "" );
      const folderTree = await getFolderTree( folderUri );
      myLog( "folderTree: ", folderTree );
      const checkedItems = await showFolderTree( folderTree );
      myLog( "checkedItems: ", checkedItems );

      for( const item in checkedItems ) {
        const target = privateGPTbase + item.basename();
myLog( `Copy from: ${item} to ${target} `);

        fs.copyFile( item, target, err => {
            if( err ) {
              myLog( `Cannot copy ${item} to ${target}`)
            }
         } )
      }
    }
*/

  context.subscriptions.push(disposable_ingest_dcs);
   });
}

/*
async function getFolderTree( folderUri ) {
  //myLog( "folderUri", folderUri );

  const folderTree = {
    uri: folderUri,
    label: path.basename( folderUri.fsPath ),
    collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
    checked: false,
    children: []
  };

  const children = await vscode.workspace.fs.readDirectory(folderUri);
  //myLog( "children: ", children );

  for (const child of children) {
  //  myLog( "child", child );
//    const childUri = vscode.Uri.joinPath(folderUri, children[child]);
    if( children.length > 0 ) { 
    const childUri = vscode.Uri.joinPath(folderUri, child[0]);
    const childTree = {
      uri: childUri,
      label: child[0],
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      checked: false,
      children: []
    };

    if( child[1] === vscode.FileType.Directory ) {
      childTree.children = await getFolderTree(childUri);
    }

    folderTree.children.push(childTree);
  }
}
  return folderTree;
}


async function showFolderTree( folderTree ) {
  const checkedItems = [];

  async function showTreeItem( treeItem ) {
    const checked = await vscode.window.showQuickPick(['Check', 'Uncheck'], { placeHolder: 'Select an action', canPickMany: false });

    if( checked === 'Check' ) {
      treeItem.checked = true;
      checkedItems.push(treeItem.uri.fsPath);
    } else if( checked === 'Uncheck' ) {
      treeItem.checked = false;
      checkedItems.splice( checkedItems.indexOf( treeItem.uri.fsPath ), 1 );
    }

    for( const child of treeItem.children ) {
      await showTreeItem( child );
    }
  }

  await showTreeItem( folderTree );

  return checkedItems;
}
*/
/*
  vscode.commands.registerCommand('vs-dcs.ingest-dcs', (fullPath) => {
    myLog( "fullPath: ", fullPath );
//	let disposable2 = vscode.commands.registerCommand( , async function () {
		myLog( "", "Select resources for ingestion" );	
//    folderList = [];/
//		walk( base );
//		myLog( "folderList", folderList[0] );
//	vscode.window.showQuickPick( folderList, { placeHolder: "Select Resources to ingest" } )
//function createCheckableTree(folderPath) {
    const item = treeDataProvider.getChildren().find((item) => item.label === path.basename(fullPath));
    item.checked = !item.checked;
    const treeView = vscode.window.createTreeView('checkableTree', { treeDataProvider });

    treeView.refresh();
  });

  const treeDataProvider = {
    getChildren: (element) => {
      if (!element) {
        return Promise.resolve(fs.readdirSync(folderPath).map((name) => {
          const fullPath = path.join(folderPath, name);
          const isDirectory = fs.statSync(fullPath).isDirectory();
          return {
            label: name,
            collapsibleState: isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
            command: {
              title: 'Check Item',
              command: 'checkItem',
              arguments: [fullPath],
            },
          };
        }));
      }
      return Promise.resolve([]);
    },
    getTreeItem: (element) => {
      return element;
    },
  };


  return new Promise((resolve) => {
    vscode.commands.registerCommand('returnCheckedItems', () => {
      const checkedItems = treeDataProvider.getChildren().filter((item) => item.checked).map((item) => item.label);
      resolve(checkedItems);
    });
  });
*/
//	context.subscriptions.push( disposable_ingest_dcs );
//	context.subscriptions.push( disposable_get_dcs );
//}


async function getDCS( endpoint ) { //* access DCS API to get some endpoint
  const dcs = "https://git.door43.org/api/v1";
  const uri = dcs + endpoint ;
  myLog( `getDCS: uri: ${uri}`, "" );
  let dta = ""; 

  await fetch( uri, {
	  method: "GET",
	  mode:   "cors",
	  headers: { "Content-Type": "application/json" }
  } )
  .then( response => response.json() )
  .then( data => dta = data)
  .catch( error => myLog( `getDCS result: ${error.message}`, "" ) );

  return dta;
}


async function* walk( dir ) {
  for await( const d of await fs.promises.opendir( dir ) ) {
      const entry = path.join( dir, d.name );
      
      if( d.isDirectory() ) {
        yield* await walk( entry );
      } else if( d.isFile() ) {
        yield entry;
      }
  }
}


/*
function walk( dir ) {                    // a simple walk method
  fs.readdir( dir, ( e, items ) => {            // get the contents of dir
    items.forEach( ( item ) => {                // for each item in the contents
      let itemPath = path.join( dir, item );    // get the item path

      fs.stat( itemPath, ( e, stats ) => {      // get the stats of the item
        if (stats.isDirectory() ) {             // for now just use stats to find out if the current item is a dir
//        myLog( "folder: ", itemPath );          // Just myLog the item path for now
          folderList.push( itemPath );
//        myLog( "lst: ", folderList );
          walk( itemPath );                     // if so walk that too, by calling this method recursively     }
        }
      });
    });
  });
}
*/

function flattenObj( ob ) {
  console.log( "toFlatten ob: ", ob );
  let result = {};
  
  for( const i in ob ) {
    // We check the type of the i using typeof() function and recursively
    // call the function again

    if( ( typeof ob[i] ) === 'object' && !Array.isArray( ob[i] ) ) {
      const temp = flattenObj( ob[i] );

      for( const j in temp ) {            
          result[i + '.' +  j] = temp[j]; // Store temp in result
      }
    } else {  // store ob[i] in result directly
      result[i] = ob[i];
    }
  }

  return result;
}


function myLog( con, txt ) {
  vscode.window.showInformationMessage( con );
  console.log( con, txt );
}


// This method is called when extension is deactivated
function deactivate() {}


module.exports = {
	activate,
	deactivate
}
