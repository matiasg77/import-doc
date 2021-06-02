// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
//import {ExtensionContext, TextDocument, window, workspace, commands} from 'vscode';
const { ExtensionContext, TextDocument, window, workspace, commands } = require('vscode');
const { getPackages, JAVASCRIPT, TYPESCRIPT, VUE, SVELTE } = require('./parser');
const { hello } = require('./hello')


//import {JAVASCRIPT, TYPESCRIPT, VUE, SVELTE} from './parser'


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let isActive = true

/**
 * @param {ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "original" is now active!');

	workspace.onDidChangeTextDocument(ev => isActive && processActiveFile(ev.document))
	window.onDidChangeActiveTextEditor(ev => ev && isActive && processActiveFile(ev.document))

	if (window.activeTextEditor && isActive) {

		processActiveFile(window.activeTextEditor.document);
	}


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = commands.registerCommand('importDocLink.toggle', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		window.showInformationMessage('Hello World from original!');
	});

	context.subscriptions.push(disposable);
}

//const processActiveFile = (doc) => console.log('bien: ', doc)

// this method is called when your extension is deactivated
function deactivate() { }

let emitters = {};
/**
 * @param {TextDocument} document
 */
function processActiveFile(document) {
	console.log("Process: ", JAVASCRIPT)


	if (document) {
		const { fileName } = document
		setTimeout(async () => {
			try {
				//const imports = getPackages(fileName, document.getText(), 'javascript').filter((packageInfo) => !packageInfo.name.startsWith('.'));
				const imports = getPackages(fileName, document.getText(), 'javascript')
				const cleanImports = imports.filter((packageInfo) => !packageInfo.name.startsWith('.'))
				console.log('imports :', cleanImports);

			} catch (error) {
				//console.log('error****:', error);
			}
		}, 0)
	}

	/* 
	if (document && language(document)) {
	  const {fileName} = document;
	  if (emitters[fileName]) {
		emitters[fileName].removeAllListeners();
	  }
	  const {timeout} = vscode.workspace.getConfiguration('importCost');
	  emitters[fileName] = importCost(fileName, document.getText(), language(document), {concurrent: true, maxCallTime: timeout});
	  emitters[fileName].on('error', e => logger.log(`importCost error: ${e}`));
	  emitters[fileName].on('start', packages => flushDecorations(fileName, packages));
	  emitters[fileName].on('calculated', packageInfo => calculated(packageInfo));
	  emitters[fileName].on('done', packages => flushDecorations(fileName, packages)); 
	}*/
}

/* function language({ fileName, languageId }) {
	if (languageId === 'Log') {
		return;
	}
	const configuration = workspace.getConfiguration('importCost');
	const typescriptRegex = new RegExp(configuration.typescriptExtensions.join('|'));
	const javascriptRegex = new RegExp(configuration.javascriptExtensions.join('|'));
	const vueRegex = new RegExp(configuration.vueExtensions.join('|'));
	const svelteRegex = new RegExp(configuration.svelteExtensions.join('|'));
	if (languageId === 'svelte' || svelteRegex.test(fileName)) {
		return SVELTE;
	} else if (languageId === 'vue' || vueRegex.test(fileName)) {
		return VUE;
	} else if (languageId === 'typescript' || languageId === 'typescriptreact' || typescriptRegex.test(fileName)) {
		return TYPESCRIPT;
	} else if (languageId === 'javascript' || languageId === 'javascriptreact' || javascriptRegex.test(fileName)) {
		return JAVASCRIPT;
	} else {
		return undefined;
	}
} */

module.exports = {
	activate,
	deactivate
}
