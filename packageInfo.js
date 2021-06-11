const { getPackageVersion, getRepositoryURL, getHomepageURL, getNPMURL, getGoogleSearchURL } = require('./utils')
const memCache = require('./cache')

const getDocInfo = async (pkg) => {
    //TODO check cache for build in modules
    let pkgCache = memCache.get(pkg.name)

    pkg['version'] = pkgCache && pkgCache.version || getPackageVersion(pkg)
    pkg['homepageURL'] = pkgCache && pkgCache.homepageURL || getHomepageURL(pkg)
    pkg['npmURL'] = pkgCache && pkgCache.npmURL || getNPMURL(pkg)
    pkg['repositoryURL'] = pkgCache && pkgCache.repositoryURL || getRepositoryURL(pkg)
    pkg['googleSearch'] = pkgCache && pkgCache.googleSearch || getGoogleSearchURL(pkg)

    !pkgCache && memCache.set(pkg.name, pkg)
    return pkg
}

module.exports = {
    getDocInfo
}