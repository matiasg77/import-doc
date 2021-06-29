const { workspace, window, Range, Position, MarkdownString } = require('vscode')

/* import * as fileSize from 'filesize';
import console from './console'; */

const decorations = {};

function flushDecorations(fileName, packages) {
    //console.log(`Flushing decorations ${JSON.stringify(packages, null, 2)}`);
    decorations[fileName] = {};
    packages.forEach(packageInfo => {
        if (packageInfo.repositoryURL === undefined) {
            const configuration = workspace.getConfiguration('importDocLink');
            if (configuration.showCalculatingDecoration) {
                decorate('Calculating...', packageInfo);
            }
        } else {
            calculated(packageInfo);
        }
    });
    refreshDecorations(fileName);
}

function calculated(packageInfo) {
    const decorationMessage = getDecorationMessage(packageInfo);
    decorate(decorationMessage, packageInfo, getDecorationColor(packageInfo.size));
}

function getDecorationMessage(packageInfo) {
/*     let a = `home [Open](https://google.com) | npm | github | google | ↗`
    const contents = new MarkdownString(a) */
    return 'home | npm | github | google | ↗'
}

function getDecorationColor() {
    return "#f4f4f4"
}

function decorate(text, packageInfo, color = getDecorationColor()) {
    const { fileName, line } = packageInfo;
    //console.log(`Setting Decoration: ${text}, ${JSON.stringify(packageInfo, null, 2)}`);
    decorations[fileName][line] = {
        renderOptions: { after: { contentText: text, color } },
        range: new Range(new Position(line - 1, 1024), new Position(line - 1, 1024))
    };
    refreshDecorations(fileName);
}

const decorationType = window.createTextEditorDecorationType({ after: { margin: '0 0 0 1rem' } });
let decorationsDebounce;
function refreshDecorations(fileName, delay = 10) {
    clearTimeout(decorationsDebounce);
    decorationsDebounce = setTimeout(
        () =>
            getEditors(fileName).forEach(editor => {
                editor.setDecorations(
                    decorationType,
                    Object.keys(decorations[fileName]).map(x => decorations[fileName][x])
                );
            }),
        delay
    );
}

function getEditors(fileName) {
    return window.visibleTextEditors.filter(editor => editor.document.fileName === fileName);
}

function clearDecorations() {
    window.visibleTextEditors.forEach(textEditor => {
        return textEditor.setDecorations(decorationType, []);
    });
}

module.exports = {
    clearDecorations,
    calculated,
    flushDecorations

}