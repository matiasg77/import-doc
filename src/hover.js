const vscode = require('vscode')

function provideAddressActionHover(document, position, token, pkgs) {
    const checkLine = pkg => pkg.line === position.line + 1
    let index = pkgs.findIndex(checkLine)

    let addressHover = ''
    addressHover += pkgs[index].homepageURL ? `[Homepage](${pkgs[index].homepageURL}) | ` : ''
    addressHover += pkgs[index].npmURL ? `[NPM](${pkgs[index].npmURL}) | ` : ''
    addressHover += pkgs[index].repositoryURL ? `[${isGithub(pkgs[index].repositoryURL) ? 'Github' : 'Repository'}](${pkgs[index].repositoryURL}) | ` : ''
    addressHover += pkgs[index].googleSearch ? `🌎 [Google](${pkgs[index].googleSearch}) | ` : ''

    if (addressHover) {
        addressHover = addressHover.slice(0, -3)
    } else {
        return
    }

    const contents = new vscode.MarkdownString(addressHover);
    contents.isTrusted = true;
    return new vscode.Hover(contents);
}

const isGithub = (repoURL) => {
    return repoURL.includes('github.com')
}

module.exports = {
    provideAddressActionHover
}
