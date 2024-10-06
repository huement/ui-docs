# CLI TASKS

This area is in a state of transition.

Most of the scripts are not working, do to a simple file path issue or something silly.

## SCRIPTS

#### mojo.js
this script is the main action script that imports and calls the other remaining scripts. Right now it is mostly working for the _token.json_ generation.

-----------------

#### chords.js
part of the `mojo.js` script, this specifically handles the breakpoint design tokens, such as font-size line-height for each size.

-----------------

#### fonts.js
part of the `mojo.js` script, this file used to be important as it was converting `ttf` or `otf` files to web friendly formats. However as we have switched to **Variable** fonts, the future of this file is uncertain.

-----------------

#### colors.js
**WORKING 100%** part of the `mojo.js` script, loads in **color_tokens.json** and converts that into a full `SCSS` theme file. Its super cool and handy.

-----------------

#### persasstion.js
a simple conversion script that is rarely used or needed. Pass it two file paths, import and export, and it will transform CSS file to SCSS files. So backwards of what you typcially want. It goes a step further tho and validates the CSS before trying to convert it, ensuring you dont end up with trSCSSh [TM].

-----------------

#### jollybar.js
used in the debug toolbar. this parses a directory of local CSS files into a JSON list that can be loaded on the web-browser side later. Useful for switching between CSS files quickly to compare different things or what have you.

-----------------

#### climg.js
this is simple a debug file used for messing around with showing images on the command line and can mostly be ignored.
