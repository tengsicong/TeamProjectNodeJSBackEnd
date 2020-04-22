module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es6': true
	},
	'extends': 'standard',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly',
		"describe": true,
		"beforeEach": true,
		"afterEach": true,
		"after": true,
		"it": true
	},
	'parserOptions': {
		'ecmaVersion': 2018
	},
	'rules': {
		"indent": [
			"error",
			4
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		"linebreak-style": "off"
	}
};
