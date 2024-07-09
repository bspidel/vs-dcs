# vs-dcs README

This is the beginnings of a vscode extension that accesses resources in DCS via its API.
It mostly serves as an example of how to construct DCS queries in a vscode context.

It does this by:
- Requesting that a user select an organization containing translation resources
- Selecting a Language for the resource
- Selecting a Resource type
- Selecting a document maturity stage: latest, prod or preprod
- The extension constructs a query to get the Repo containing the relevant Resource
- It queries a zip file of all the resource files of the selected type.
- It extracts the resources into a local directory: __./resources/sources/<resourceType>/\<language\>/\<files\>__
- The extracted files are in a structure as if the resource were developed locally in a repository.
- Care is taken to ensure that resource types in different languages do not "clobber" each other.

## Features

- Lists each selection in a "showQuickPick" list
- Can support multiple resource languages in separate spaces.

## Requirements

This extension does NOT require DCS credentials to read resource repositories.

## Extension Settings

None

## Known Issues

Here are some known issues or next steps
-  Make org/lang/res hierarchical
-  Support resource containers
-  Detect difs of zips and folders to minimize downloading unchanged files
-  Finish ingest
-  Add webview privateGPT client
-  use owners instead of orgs  catalog/list/owners

## Release Notes

This is 1/4 baked. Serves to show How to access DCS

### 1.0.0

Initial release of vs-dcs
