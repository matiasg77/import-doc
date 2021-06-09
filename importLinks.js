const { getPackages } = require('./parser')
const { EventEmitter } = require('events')
const { getDocInfo } = require('./packageInfo')

const importDoc = (fileName, text, language, config = { maxCallTime: Infinity, concurrent: true }) => {
    const emitter = new EventEmitter()
    setTimeout(async () => {
        try {
            //const imports = getPackages(fileName, document.getText(), 'javascript').filter((packageInfo) => !packageInfo.name.startsWith('.'));
            const imports = getPackages(fileName, text, language)
            const cleanImports = imports.filter((packageInfo) => !packageInfo.name.startsWith('.'))
            emitter.emit('start', cleanImports)
            const promises = cleanImports.map((packageInfo) => getDocInfo(packageInfo))

            promises.map((promise) =>
                promise.then((packageInfo) => {
                    emitter.emit('calculated', packageInfo)
                    console.log('packageInfo :', packageInfo);
                    return packageInfo
                })
            )
            console.log('imports :', cleanImports);

            const packages = (await Promise.all(promises)).filter((x) => x)
            emitter.emit('done', packages)
        } catch (e) {
            //console.log('error****:', error);
            //emitter.emit('error', e)
        }
    }, 0)
    return emitter
}

module.exports = {
    importDoc
}