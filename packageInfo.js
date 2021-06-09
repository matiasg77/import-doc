const pkgDir = require('pkg-dir')
const { getPackageVersion, parseJson } = require('./utils')



const getDocInfo = async (pkg) => {
    console.log('pkg :', pkg);
    const extensionVersion = getPackageVersion(pkg)
    console.log('extensionVersion :', extensionVersion);
    return extensionVersion
}

module.exports = {
    getDocInfo
}