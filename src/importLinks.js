const { getPackages } = require('./parser')
const { EventEmitter } = require('events')
const { getDocInfo } = require('./packageInfo')

const importDoc = (fileName, text, language) => {
    const emitter = new EventEmitter()
    setTimeout(async () => {
        try {
            const imports = getPackages(fileName, text, language)
            const cleanImports = imports.filter((packageInfo) => !packageInfo.name.startsWith('.'))
            const promises = cleanImports.map((packageInfo) => getDocInfo(packageInfo))

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