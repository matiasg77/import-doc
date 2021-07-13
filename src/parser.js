const cheerio = require('cheerio')
const {getPackagesJS}  = require('./babelParser')

const TYPESCRIPT = 'typescript'
const JAVASCRIPT = 'javascript'
const VUE = 'vue'
const SVELTE = 'svelte' 


function extractScriptFromHtml(html) {
	try {
		const $ = cheerio.load(html);
		const code = $('script').html();
		return code;
	} catch (e) {
		console.error(`ERR`, e);
		return '';
	}
}

function getScriptTagLineNumber(html) {
	const splitted = html.split('\n');
	for (let i = 0; i < splitted.length; i++) {
		if (/\<script/.test(splitted[i])) {
			return i;
		}
	}
	return 0;
}

function getPackages(fileName, source, language) {
	if ([SVELTE, VUE].some((l) => l === language)) {
		const scriptSource = extractScriptFromHtml(source);
		const scriptLine = getScriptTagLineNumber(source);
		return getPackagesJS(fileName, scriptSource, TYPESCRIPT, scriptLine);
	} else if ([TYPESCRIPT, JAVASCRIPT].some((l) => l === language)) {
		return getPackagesJS(fileName, source, language);
	} else {
		return [];
	}
}

module.exports = {
	getPackages,
    TYPESCRIPT,
    JAVASCRIPT,
    VUE,
    SVELTE
}



