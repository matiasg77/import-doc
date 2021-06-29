const vscode = require('vscode')

function provideAddressActionHover(document, position, token, pkgs) {
    //console.log('token :', token);
    //console.log('position :', position.line + 1);
    //console.log(pkgs)
    //let word = editorGetAddressWordAtPosition(document, position, token);
    //console.log(position[0]._line)

    const checkLine = pkg => pkg.line === position.line + 1

    let index = pkgs.findIndex(checkLine)

    let addressHover = `🌎 [Google](${pkgs[index].googleSearch})
    |  [Homepage](${pkgs[index].homepageURL})
    `;

    const contents = new vscode.MarkdownString(addressHover);
    contents.isTrusted = true;
    return new vscode.Hover(contents);
}

module.exports = {
    provideAddressActionHover
}
