const fs = require('fs');
const path = require('path');
const pkgDir = require('pkg-dir');
const { buildInModules } = require('./buildInModules')

const npmURL = 'https://www.npmjs.com/package/'
const googleSearchURL = 'https://www.google.com/search?q=node+js+'

function parseJson(dir) {
  const pkg = path.join(dir, 'package.json');
  return JSON.parse(fs.readFileSync(pkg, 'utf-8'));
}

function getPackageName(pkg) {
  const pkgParts = pkg.name.split('/');
  let pkgName = pkgParts.shift();
  if (pkgName.startsWith('@')) {
    pkgName = path.join(pkgName, pkgParts.shift());
  }
  return pkgName;
}

/**
 * @param {Object} pkg
 * @returns {string} The location of a node_modules folder containing this package.
 */
function getPackageModuleContainer(pkg) {
  let currentDir = path.dirname(pkg.fileName);
  let foundDir = '';
  const pkgName = getPackageName(pkg);

  while (!foundDir) {
    const projectDir = pkgDir.sync(currentDir);
    if (!projectDir) {
      throw new Error(`Package directory not found [${pkg.name}]`);
    }
    const modulesDirectory = path.join(projectDir, 'node_modules');
    if (fs.existsSync(path.resolve(modulesDirectory, pkgName))) {
      foundDir = modulesDirectory;
    } else {
      currentDir = path.resolve(currentDir, '..');
    }
  }
  return foundDir;
}

/**
 * @param {Object} pkg
 * @returns {string} The actual location on-disk for this package.
 */
function getPackageDirectory(pkg) {
  const pkgName = getPackageName(pkg);

  const tmp = getPackageModuleContainer(pkg);
  return path.resolve(tmp, pkgName);
}

function getPackageVersion(pkg) {
  return !buildInModules.includes(pkg.name) ? getPackageJson(pkg).version : null
}

function getRepositoryURL(pkg) {
  const repoURLfromPackageJson = !buildInModules.includes(pkg.name) ? getPackageJson(pkg).repository.url : false
  let repoURL = repoURLfromPackageJson && repoURLfromPackageJson.match(/\bhttps?:\/\/\S+/gi)
  return (Array.isArray(repoURL) && repoURL.length > 0) ? repoURL[0] : null
}

function getHomepageURL(pkg) {
  return !buildInModules.includes(pkg.name) ? getPackageJson(pkg).homepage : getBuildInModuleDocURL(pkg)
}

function getPackageJson(pkg) {
  return parseJson(getPackageDirectory(pkg));
}

function getBuildInModuleDocURL(pkg) {
  return 'https://nodejs.org/api/' + pkg.name + '.html'
}

function getNPMURL(pkg) {
console.log('pkg :', pkg.name);
  
  return !buildInModules.includes(pkg.name) ? npmURL + pkg.name + '/v/' + getPackageVersion(pkg) : null
}

function getGoogleSearchURL(pkg) {
  return googleSearchURL + pkg.name 
}


module.exports = {
  getPackageJson,
  getPackageModuleContainer,
  getPackageDirectory,
  getPackageVersion,
  parseJson,
  getRepositoryURL,
  getHomepageURL,
  getNPMURL,
  getGoogleSearchURL
};
