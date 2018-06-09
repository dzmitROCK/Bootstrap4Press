const b4pConf = {
		LocalhostUrl: 'http://localhost/bootstrap4press.loc',
		PATH: {
				src: './src',
				prod: './dist',
		},
		sassInclude: [
				'./node_modules/bootstrap/scss',
				'./node_modules/@fortawesome/fontawesome-free-webfonts/scss'
		],
		prefixBrowser: ['last 2 versions', 'ie >= 9', 'ios >= 7'],
}

module.exports = b4pConf;
