const { getPackageVersion, getRepositoryURL, getHomepageURL } = require('./utils')

const getDocInfo = async (pkg) => {
    const npmURL = 'https://www.npmjs.com/package/'
    const googleSearchURL = 'https://www.google.com/search?q=node+js+'
    const version = getPackageVersion(pkg)

    pkg['version'] = version
    pkg['npmURL'] = npmURL + pkg.name + '/v/' + version
    pkg['repositoryURL'] = getRepositoryURL(pkg)
    pkg['homepageURL'] = getHomepageURL(pkg)
    pkg['googleSearch'] = googleSearchURL + pkg.name
    return pkg
}

module.exports = {
    getDocInfo
}