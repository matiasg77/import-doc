// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { window, workspace, commands, languages } = require('vscode');
const { JAVASCRIPT, TYPESCRIPT, VUE, SVELTE } = require('./parser');
const { importDoc } = require('./importLinks')
const hover = require('./hover')

const DOC_SELECTOR = [
	{ language: JAVASCRIPT},
    { language: TYPESCRIPT },
    { language: VUE },
    { language: SVELTE }
]

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let isActive = true

let pkgs

/**
 * @param {ExtensionContext} context
 * @param {TextDocument} document
 */
function activate(context) {

	workspace.onDidChangeTextDocument(ev => isActive && processActiveFile(ev.document))
	window.onDidChangeActiveTextEditor(ev => ev && isActive && processActiveFile(ev.document))

	if (window.activeTextEditor && isActive) {
		processActiveFile(window.activeTextEditor.document);
	}

	context.subscriptions.push(
		languages.registerHoverProvider(DOC_SELECTOR, {
			provideHover(document, position, token) {
                return hover.provideAddressActionHover(document, position, token, pkgs);
            }
        })
    )


}

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
