// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { window, workspace, commands, languages, Hover } = require('vscode');
const { JAVASCRIPT, TYPESCRIPT, VUE, SVELTE } = require('./parser');
const { importDoc } = require('./importLinks')
const { flushDecorations } = require('./decorator')
const hover = require('./hover')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let isActive = true

let pkgs

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

	context.subscriptions.push(
		languages.registerHoverProvider('javascript', {
			provideHover(document, position, token) {
                return hover.provideAddressActionHover(document, position, token, pkgs);
            }
        })
    )


}

//const processActiveFile = (doc) => console.log('bien: ', doc)

// this method is called when your extension is deactivated
function deactivate() { }

let emitters = {};
/**
 * @param {TextDocument} document
 */
function processActiveFile(document) {

	if (document && language(document)) {
		const { fileName } = document
		if (emitters[fileName]) {
			emitters[fileName].removeAllListeners()
		}
		const { timeout } = workspace.getConfiguration('importCost');
		emitters[fileName] = importDoc(fileName, document.getText(), language(document), { concurrent: true, maxCallTime: timeout });
		emitters[fileName].on('done', packages => {
			console.log('Done: ', packages)
			pkgs = packages
			//flushDecorations(fileName, packages)
		});
	}
}

function language({ fileName, languageId }) {
	if (languageId === 'Log') {
		return;
	}
	const configuration = workspace.getConfiguration('importDocLink');
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
}

module.exports = {
	activate,
	deactivate
}

//emitters[fileName].on('error', e => console.log('onError: ', e)) //logger.log(`importCost error: ${e}`)
//emitters[fileName].on('start', packages => console.log('packages :', packages))
//emitters[fileName].on('calculated', packageInfo => console.log("calculate: ", packageInfo));