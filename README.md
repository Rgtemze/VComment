# VComment (Under Development)

Add descriptions to your variables so that you can remember what they are for when the variable names remain incapable.

## Installation

> Note that the extension is still under development. Hence, it is not available in the VS Code extensions page.

1. Make sure you have VS Code & Typescript installed.

2. Clone this repo

3. Open command line inside the clone.

4. Type `code .` which will open the VS Code in the current directory.

5. Press `F5` wich will open VS Code with the extension.

6. Press `Ctrl + Shift + P` and type `VComment` to run the extension.

## Features

> You should run the extension for every description addition and change using step 6 under Installation

Description can be added by adding a comment above the variable you want to describe along with @ (at) character followed by the description itself.

```js
// @Array of indices to specify in which order the vertices will be processed
var indices = [0, 1, 2, 0];
```

Then, when the variable is hovered, its description will be available on the pop-up.

> Variable comments are not shared between files.

## Known Issues & Drawbacks

1. Multiple declaration (i.e. var x, y) is not supported.

2. If a variable name repeats it saves the last one. Instead, it should be taking care of the scope.
