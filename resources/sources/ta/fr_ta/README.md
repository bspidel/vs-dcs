# unfoldingWord translationAcademy

## Description

unfoldingWord translationAcademy is a modular handbook that provides a condensed explanation of Bible translation and checking principles that the global Church has implicitly affirmed define trustworthy translations. It enables translators to learn how to create trustworthy translations of the Bible in their own language.

## Downloading

If you want to download English translationAcademy to use, go here: [https://unfoldingword.bible/academy/](https://unfoldingword.bible/academy/). tA is also included in [tS](http://ufw.io/ts) and [tC](http://ufw.io/tc).

## Improving tA

Please use the [issue queue](https://git.door43.org/unfoldingWord/en_ta/issues) to provide feedback or suggestions for improvement.

If you want to make your suggested changes then you may use the online editor to do so. See the [protected branch workflow](https://forum.ccbt.bible/t/protected-branch-workflow/76) document for step by step instructions.

## Structure

The tA are written in a simple Markdown format and organized according to the [Resource Container Manual](https://resource-container.readthedocs.io/en/latest/container_types.html#manual-man) type.  See that link for more information but here is a quick summary.

Each manual has it's own directory in this repository (for example, the Checking Manual is in the [checking](https://git.door43.org/unfoldingWord/en_ta/src/branch/master/checking) directory). Each module has its own directory inside of these manual directories. Inside each of these are three files:

* `01.md` - This is the main body of the module
* `sub-title.md` - This file contians the question that the module is intended to answer.
* `title.md` - This contains the title of the module

There are also YAML formatted files in each manual's directory.  The `toc.yaml` file is for encoding the Table of Contents and the `config.yaml` file is for encoding dependencies between the modules.

## GL Translators

### tA Translation Philosophy

To learn the philosophy of how to translate the tA please see the [Translate translationAcademy](http://gl-manual.readthedocs.io/en/latest/gl_translation.html#translating-translationacademy) article in the [Gateway Language Manual](http://gl-manual.readthedocs.io/).

If you are translating online, please fork the [Door43-Catalog/en_ta](https://git.door43.org/Door43-Catalog/en_ta) repository, following this workflow: [Translate Content Online](https://forum.ccbt.bible/t/translate-content-online/75).

### Technical Information for Translating tA

* *Do not* rename any files or directories.  Only translate what is inside the files.
* The `config.yaml` and `toc.yaml` files do not need to be changed unless you add a new module. When you are finished translating, you may want to update the `title` fields in the `toc.yaml` file, but you shouldn't make any other changes in those files.
* Images that are included in tA should be no more than 600px wide. Leave the image links alone to use the original images.
* Hyperlinks (links to other articles or to other pages on the internet) follow this pattern: `[text to display](http://www.example.com)`. You can translate the "text to display" inside the square brackets but not the web address that follows inside the parentheses.

You are free to add additional modules. In order for the new modules to be included when tA is published, all of the following conditions need to be satisfied:

* You must create a directory in one of the manual directories (like the translate directory) that has the short name of the module you want to write.  For example, to create a new module on "testing" in the Translation Manual, you will want to put the file in "translate/testing/01.md".
* The file must be included in the table of contents, `toc.yaml` for the appropriate manual.
* The value of the slug in the `toc.yaml` file and the directory (without the extension) must be the same as the directory name (`testing` in this example).
* The slug must be unique, and not used in any of the other tA repositories. This is a requirement so that it is possible to create unambiguous links to articles in other tA manuals.

## License

See the [LICENSE](https://git.door43.org/unfoldingWord/en_ta/src/branch/master/LICENSE.md) file for licensing information.
