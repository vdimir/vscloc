# vscloc

Count Lines of Code with [cloc](https://github.com/AlDanial/cloc) tool.

## Requirements

Install [cloc](https://github.com/AlDanial/cloc).

## Extension Settings

* `vscloc.format`: format string shown in status bar.
    - `%t` - total number of lines in file
    - `%s` - source code
    - `%b` - blank lines
    - `%c` - comments

* `vscloc.cmd`: command to run cloc. `%f` substituted with current file path
