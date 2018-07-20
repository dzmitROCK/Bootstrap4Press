import plugins from 'gulp-load-plugins';
import yargs from 'yargs';
import browser from 'browser-sync';
import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import yaml from 'js-yaml';
import fs from 'fs';
import log from 'fancy-log';
import colors from 'colors';

let del = require('del');

const $ = plugins();
const PRODUCTION = !!(yargs.argv.production);
const { DEVURL, PATH, SASSINCLUDE, COMPATIBILITY } = loadConfig();

/**
 * Gulp task - Check loaded modules
 */
gulp.task('plug', () => {
		console.log($);
});

/**
 * Check and load config file
 * @return {Object} or die
 */
function loadConfig() {
		log(colors.green('Loading config file...'));

		let defaultConf = 'gulp-default-config.yaml';
		let customProjectConf = 'gulp-config.yaml';

		if (checkFileExists(customProjectConf)) {
				// load custom project config
				log(`Ok. I'm load "${customProjectConf}" ...`.green);
				let ymlFile = fs.readFileSync(customProjectConf, 'utf8');
				return yaml.load(ymlFile);

		} else if (checkFileExists(defaultConf)) {
				// load default config
				log(`It's bad, man! I'm load "${defaultConf}!"`.red.underline.bold);
				log(`Please create a "${customProjectConf}". Copy everything from "${defaultConf}" to "${customProjectConf}". And set local link in "${customProjectConf}" file`.red.bold);
				let ymlFile = fs.readFileSync(defaultConf, 'utf8');
				return yaml.load(ymlFile);

		} else {
				// Exit if config.yml & config-default.yml do not exist
				log('Exiting process, no config file exists.'.red.underline);
				process.exit(1);
		}
}

/**
 * Check file
 * @param  {string} filepath
 * @return {boolean}
 */
function checkFileExists(filepath) {
		let flag = true;
		try {
				fs.accessSync(filepath, fs.F_OK);
		} catch (e) {
				flag = false;
		}
		return flag;
}


function sass() {
		return gulp.src(`${PATH.src}/scss/app.scss`)
				.pipe($.if(!PRODUCTION, $.sourcemaps.init()))
				.pipe($.sass({
								includePaths: SASSINCLUDE,
						})
						.on('error', $.notify.onError({
								message: "<%= error.message %>",
								title: "Sass Error"
						}))
				)
				.pipe($.autoprefixer({
						browsers: COMPATIBILITY
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
				.pipe(gulp.dest(`${PATH.prod}/css`))
				.pipe(browser.reload({ stream: true }))
}


function js() {
		return gulp.src(`${PATH.src}/js/app.js`)
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
														presets: ['es2015', 'stage-0']
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
				.pipe(gulp.dest(`${PATH.prod}/js`))
}

function images() {
		return gulp.src(`${PATH.src}/images/**/*.{png,jpg,jpeg,gif,svg}`)
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
				.pipe(gulp.dest(`${PATH.prod}/images`))
}

function reload(done) {
		browser.reload();
		done();
}

function copyJquery() {
		return gulp.src('node_modules/jquery/dist/jquery.min.js')
				.pipe(gulp.dest(`${PATH.prod}/js`))
}

function copyFontAwesome() {
		return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**/*.{eot,svg,ttf,woff,woff2}')
				.pipe(gulp.dest(`${PATH.prod}/fonts`))
};


function cleanCache(done) {
		return $.cache.clearAll(done);
};

gulp.task('clean', () => {
		return del(PATH.prod);
});

gulp.task(
		'build',
		gulp.series(
				'clean',
				PRODUCTION ? cleanCache : [],
				gulp.parallel(
						[sass, js, images, copyJquery, copyFontAwesome]
				)
		)
);

function watch() {
		var files = [
				'./**/*.php',
		];

		browser.init(files, {
				proxy: DEVURL,
				notify: false,
		});

		gulp.watch(`${PATH.src}/js/**/*.js`, gulp.series(js, reload));
		gulp.watch(`${PATH.src}/scss/**/*.scss`, sass);
		gulp.watch(`${PATH.src}/images/**/*.{png,jpg,jpeg,gif,svg}`, gulp.series(images, reload));
}

gulp.task('default', gulp.series('build', watch));
