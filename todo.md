```
TODO for Sudoku:
unit tests for App.js
unit tests for GameBoard.js
create themes: desert, mountains, forest, beach, lake, snow, etc\
    each theme will have color scheme, background image, and font style
create user login system
create additional difficulty level: extreme
add notes functionality
add a timer
add en error counter
add a pause/start button
use an erase button instead of clear cell
refactor code to have a utils folder
change winning message to be rotating through different messages
add points functionality
add user score tracking


buttons to include:
    pause/start
    erase/undo
    note mode


how I want the cell interactions to work:
    initial board ->
        numbers are locked
    I selected a number on the board ->
        highlights other of same number on board
        highlights row and column
    selecting a number from the number panel only adds that number to the cell
    I cannot erase an inital number from the board
    when in notes mode ->
        select number once from number panel, adds note to cell
        select number again, it remove the note from a cell
    selecting erase ->
        will erase all notes in a cell
        will erase the number in a cell
    when I place an incorrect number on the board ->
        the incorrect number is red
        if its doubled in a column, row, or sub grid, those have red background, black font
    undo -> undoes last action
```