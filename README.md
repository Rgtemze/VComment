# VComment (Under Development)

Add descriptions to your variables so that you can remember what they are for.

## Installation

> Note that the extension is still under development. Hence, it is not available in the VS Code extensions page.

1. Make sure you have VS Code installed.

2. Clone this repo

3. Open command line inside the clone.

4. Type `code .` which will open the VS Code in the current directory.

5. Press `F5` wich will open VS Code with the extension.

6. Press `Ctrl + Shift + P` and type `VComment` to activate the extension.

## Features

Description can be added by adding a comment above the variable you want to describe along with @ (at) character followed by the description itself.

```js
// @Array of indices to specify in which order the vertices will be processed
var indices = [0, 1, 2, 0];
```

For the first time, variable to be described should be selected [1].

Then, when the variable selected (hovering is not enough [3]), its description will be available on the pop-up.

![Demo](/images/demo.png)

## Known Issues & Drawbacks

1. Currently, I detect if a variable has a description associated with it by looking the line above the 'selected' variable. Hence, for the first time to add a description the variable which has description above it should be selected. I should be able to do it without needing to selection.

2. Multiple declaration (i.e. var x, y) is not supported.

3. I could not get the hovered text from VS Code API. Hence, I again resorted to selection to show variable description.

