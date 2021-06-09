const path = require('path')
const pkgDir = require('pkg-dir');
const fs = require('fs');

function getPackageVersion(pkg) {
	return `${getPackageName(pkg)}@${getPackageJson(pkg).version}`;
}
function getPackageName(pkg) {
	const pkgParts = pkg.name.split('/');
	let pkgName = pkgParts.shift();
	if (pkgName.startsWith('@')) {
		pkgName = path.join(pkgName, pkgParts.shift());
	}
	console.log('pkgName :', pkgName);
	return pkgName
}


function getPackageJson(pkg) {
	const pJson = parseJson(getPackageDirectory(pkg));
	console.log('pJson :', pJson);

	return parseJson(getPackageDirectory(pkg));
}

function parseJson(dir) {
	const pkg = path.join(dir, 'package.json');
	return JSON.parse(fs.readFileSync(pkg, 'utf-8'));
}

/**
* @param {Object} pkg
* @returns {string} The actual location on-disk for this package.
*/
function getPackageDirectory(pkg) {
	const pkgName = getPackageName(pkg);

	const tmp = getPackageModuleContainer(pkg);
 console.log('tmp :', tmp);
	return path.resolve(tmp, pkgName);
}

/**
 * @param {Object} pkg
 * @returns {string} The location of a node_modules folder containing this package.
 */
function getPackageModuleContainer(pkg) {
	let currentDir = path.dirname(pkg.fileName);
 console.log('currentDir :', currentDir);
	let foundDir = '';
	const pkgName = getPackageName(pkg);

	while (!foundDir) {
		const projectDir = pkgDir.sync(currentDir);
  console.log('projectDir :', projectDir);
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

const pkgInfo = {
	fileName: 'd:\\pruebas\\moduleLinks\\index.js',
	name: '@babel/traverse',
	string: "require('@babel/traverse')"
}

const axios = {
	fileName: 'd:\\pruebas\\moduleLinks\\index.js',
	name: 'axios',
	string: "require('axios')"
}

console.log(getPackageVersion(pkgInfo))