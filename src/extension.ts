// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


class Node{
	symbol: vscode.DocumentSymbol;
	comment: string;
	kind: vscode.SymbolKind;
	children: Node[]
	constructor(symbol: vscode.DocumentSymbol, kind: vscode.SymbolKind, comment: string){
		this.symbol = symbol;
		this.comment = comment;
		this.kind = kind;
		this.children = [];
	}
}

let allSymbols: {[documentId: string] :Node[]} = {};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vcomment" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	vscode.workspace.onDidChangeTextDocument(_ => {
		calculateVariables();
	});

	vscode.window.onDidChangeActiveTextEditor(_ => {
		calculateVariables();
	});

	let disposable = vscode.commands.registerCommand('extension.vcomment', () => {
		calculateVariables();
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerHoverProvider(
		'*',
		new class implements vscode.HoverProvider {
		  provideHover(
			_document: vscode.TextDocument,
			_position: vscode.Position,
			_token: vscode.CancellationToken
		  ): vscode.ProviderResult<vscode.Hover> {
			let contents = new vscode.MarkdownString(``);
			let range = _document.getWordRangeAtPosition(_position)!;
			let variable = _document.getText(range);

			let doc : vscode.TextDocument;

			const comment = findSymbol(allSymbols[_document.uri.fsPath], {range: range, name: variable}, null);
			if(variable && comment){
				console.log("findSymbol");
				contents = new vscode.MarkdownString(`${comment}`);
			}
	
			return new vscode.Hover(contents);
		  }
		}()
	  );
}

function rebuildSymbols(symbols: vscode.DocumentSymbol[]): Node[]{
	if(!symbols || symbols.length == 0){
		return [];
	}

	return symbols.map(symbol => {
		if(symbol.kind === vscode.SymbolKind.Variable){

			const activeEditor = vscode.window.activeTextEditor;

			if(symbol.range.start.line == 0){
				return new Node(symbol, symbol.kind, "");
			} else{
				const sel = new vscode.Selection(symbol.range.start.line - 1, 0, symbol.range.start.line, 0);
				let text = activeEditor!.document.getText(sel);
				
				console.log("text");
				console.log(text);
				const index = text.indexOf("\n");
				if(index != -1)
					text = text.substr(0, index);
				const atPos = text.indexOf("@");
				if(atPos != -1){
					return new Node(symbol, symbol.kind, text.substr(atPos + 1));
				}
			}
			return new Node(symbol, symbol.kind, "");
		} else {
			const newSymbol = new Node(symbol, symbol.kind, "B");
			newSymbol.children = rebuildSymbols(symbol.children);
			return newSymbol;
		}
	});
}


function findSymbol(nodes: Node[], target: {range: vscode.Range, name: string}, parentRange: null | vscode.Range): string | null{
	if(!target){
		return null;
	}

	if(!nodes || nodes.length == 0){
		return null;
	}

	for(const node of nodes){

		if(node.kind !== vscode.SymbolKind.Function){
			continue;
		}
		
		if(!parentRange || parentRange.contains(target.range)){
			let comment = findSymbol(node.children, target, node.symbol.range);
			if(comment){
				return comment;
			}
		}
	}

	for(const node of nodes){
		if(node.kind !== vscode.SymbolKind.Variable){
			continue;
		}
		if((!parentRange || parentRange.contains(target.range)) && node.symbol.name === target.name){
			return node.comment;
		}
	}

	return null;
}

// this method is called when your extension is deactivated
export function deactivate() {}

function calculateVariables(){
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor !== undefined) {
	vscode.commands
		.executeCommand<vscode.DocumentSymbol[]>(
			'vscode.executeDocumentSymbolProvider', activeEditor.document.uri)
		.then(symbols => {
			console.log("symbols");
			console.log(symbols);
			if (symbols !== undefined) {
				allSymbols[activeEditor.document.uri.fsPath] = rebuildSymbols(symbols);
			}
		});
	}
}
