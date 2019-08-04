// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


const comments : {[variable: string]: string} = {};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vcomment" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.vcomment', () => {
		// The code you place here will be executed every time your command is executed
		var activeEditor = vscode.window.activeTextEditor;
		if (activeEditor !== undefined) {
		vscode.commands
			.executeCommand<vscode.DocumentSymbol[]>(
				'vscode.executeDocumentSymbolProvider', activeEditor.document.uri)
			.then(symbols => {
				if (symbols !== undefined) {
					for (const variable of findVars(symbols)) {
						console.log(variable.name);
						const sel = new vscode.Selection(variable.range.start.line - 1, 0, variable.range.start.line, 0);
						let text = activeEditor!.document.getText(sel);
						
						const index = text.indexOf("\n");
						if(index != -1)
							text = text.substr(0, index);
						const atPos = text.indexOf("@");
						if(atPos == -1){
							continue;
						}
						comments[variable.name] = text.substr(atPos + 1);
				}
				}
			});
		}
		
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerHoverProvider(
		'javascript',
		new class implements vscode.HoverProvider {
		  provideHover(
			_document: vscode.TextDocument,
			_position: vscode.Position,
			_token: vscode.CancellationToken
		  ): vscode.ProviderResult<vscode.Hover> {
			
			const editor = vscode.window.activeTextEditor;
			
			let contents = new vscode.MarkdownString(``);

			if(editor){
				const selData = editor.selection;
				const variable = _document.getText(selData);
				
				if(comments[variable] && _position.line == selData.anchor.line 
										&& _position.character >= selData.anchor.character
										&& _position.character <= selData.end.character ){
					contents = new vscode.MarkdownString(`${comments[variable]}`);
				}
			}
	
			// To enable command URIs in Markdown content, you must set the `isTrusted` flag.
			// When creating trusted Markdown string, make sure to properly sanitize all the
			// input content so that only expected command URIs can be executed
			contents.isTrusted = true;
	
			return new vscode.Hover(contents);
		  }
		}()
	  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

// Below function is acquired from https://stackoverflow.com/questions/57345173/getting-locations-of-the-variable-declarations

function findVars(symbols: vscode.DocumentSymbol[]): vscode.DocumentSymbol[] {
	var vars =
		symbols.filter(symbol => symbol.kind === vscode.SymbolKind.Variable);
	return vars.concat(symbols.map(symbol => findVars(symbol.children))
							.reduce((a, b) => a.concat(b), []));
}