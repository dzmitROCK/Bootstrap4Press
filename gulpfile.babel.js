'use strict';

const b4pConf = require('./gulpfile.config');

import plugins from 'gulp-load-plugins';
import yargs from 'yargs';
import browser from 'browser-sync';
import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
var del = require('del');

const $ = plugins();

const PRODUCTION = !!(yargs.argv.production);

console.log(b4pConf.PATH.src);

gulp.task('plug', () => {
	console.log($);
});


gulp.task('browser-sync', () => {
	//watch files
	var files = [
		'./**/*.php',
		// './assets/js/*.js',
	];

	//initialize browser
	browser.init(files, {
		//browser with a php server
		proxy: b4pConf.LocalhostUrl,
		notify: false
	});
});


function sass() {
	return gulp.src(`${b4pConf.PATH.src}/scss/app.scss`)
		.pipe($.if(!PRODUCTION, $.sourcemaps.init()))
		.pipe($.sass({
			includePaths: b4pConf.sassInclude,
		})
			.on('error', $.notify.onError({
				message: "<%= error.message %>",
				title: "Sass Error"
			}))
		)
		.pipe($.autoprefixer({
			browsers: b4pConf.prefixBrowser
		}))
		.pipe($.if(PRODUCTION, $.cleanCss({
			compatibility: 'ie9',
			level: {
				1: {
					specialComments: false
				}
			}
		})))
		.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
		.pipe(gulp.dest(`${b4pConf.PATH.prod}/css`))
		.pipe(browser.reload({ stream: true }))
}


function js() {
	return gulp.src(`${b4pConf.PATH.src}/js/app.js`)
		.pipe(webpackStream({
			mode: PRODUCTION ? 'production' : 'development',
			output: {
				filename: 'app.js'
			},
			module: {
				rules: [{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['env', 'es2015', 'stage-0']
						}
					}
				}]
			},
			devtool: PRODUCTION ? false : 'eval',
			plugins: [
				new UglifyJsPlugin({
					extractComments: { banner: false },
					warningsFilter: (src) => true,
				}),
			],
			externals: {
				jquery: 'jQuery'
			},
		}, webpack))
		.on('error', $.notify.onError({
			message: "<%= error.message %>",
			title: "JavaScript Error"
		}))
		.pipe(gulp.dest(`${b4pConf.PATH.prod}/js`))
}

function images() {
	return gulp.src(`${b4pConf.PATH.src}/images/**/*.{png,jpg,jpeg,gif,svg}`)
		.pipe($.cache($.imagemin([
			$.imagemin.gifsicle({ interlaced: true }),
			$.imagemin.optipng({ optimizationLevel: 5 }),
			$.imagemin.svgo({
				plugins: [
					{ removeViewBox: true },
					{ cleanupIDs: false }
				]
			})
		], {
				progressive: true,
				verbose: true
			})))
		.pipe(gulp.dest(`${b4pConf.PATH.prod}/images`))
}

function reload(done) {
	browser.reload();
	done();
}

function copyJquery() {
	return gulp.src('node_modules/jquery/dist/jquery.min.js')
		.pipe(gulp.dest(`${b4pConf.PATH.prod}/js`))
}

function copyFontAwesome() {
	return gulp.src('node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/**/*')
		.pipe(gulp.dest(`${b4pConf.PATH.prod}/webfonts`))
};


function cleanCache(done) {
	return $.cache.clearAll(done);
};

gulp.task('clean', () => {
	return del(['dist'])
});

gulp.task('build',
	gulp.series('clean', cleanCache, gulp.parallel([sass, js, images, copyJquery, copyFontAwesome]))
);

function watch() {
	var files = [
		'./**/*.php',
	];

	browser.init(files, {
		proxy: b4pConf.LocalhostUrl,
		notify: false
	});

	gulp.watch(`${b4pConf.PATH.src}/js/app.js`, js).on('change', reload);
	gulp.watch(`${b4pConf.PATH.src}/scss/**/*.scss`, sass);
	gulp.watch(`${b4pConf.PATH.src}/images/**/*.{png,jpg,jpeg,gif,svg}`, gulp.series(images, reload));
}

gulp.task('default', gulp.series('build', watch));
