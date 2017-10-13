const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const isThereLib = require('is-there');
const del = require('del');
const mkdirp = require('mkdirp');

gulp.task('build-dist', ['clean-dist'], function () {
	var pluginsLocal = getPluginsWithCheck();

	createDirSync('./dist');

	return gulp
		.src('./src/*.js')
		.pipe(pluginsLocal.concat('jquery.filterizr.min.js'))
		.pipe(pluginsLocal.uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('clean-dist', function () {
	return clean('./dist');
});

gulp.task('default', ['build-dist']);



function getPluginsWithCheck() {
    if(plugins) {
        return plugins;
    }

    console.error('The "plugins" variable is not set for using "gulp-load-plugins".');
    return null;
}

/**
 *
 * @param {String} path - Path or glob pattern for files to delete.
 * @param {Function} done - Callback function to execute when cleaning is done.
 */
function clean(path) {
	console.log("Cleaning: " + getPluginsWithCheck().util.colors.blue(path));

	//**** TJM - VERY IMPORTANT...make sure delete is sync
	del.sync(path);
}

/**
 * Creates the specified directory using "mkdirp" plugin.
 * 
 * @param {string} dirPath - Directory path to create
 */
function createDirSync(dirPath) {
	console.log('Creating directory: ' + dirPath);
    mkdirp.sync(dirPath);

	//TJM - we need to make sure our directory is actually there before proceeding. 
	//	We might not need this if everything we are doing is guaranteed to be sync, but I was running into strange errors and this seemed to be needed...
	//		I'm not sure but it at least is extra checking to make sure dir exists.
	waitUntil(function () {
		var isDirThere = isThereLib(dirPath);
		console.log('Checking if the directory path actually exists...: ' + (isDirThere ? 'yes' : 'no'));

		return isDirThere;
	});

	console.log('Directory should now be created: ' + dirPath);
}


/* Utilities */

function waitUntil(conditionFunc, conditionFuncContext, conditionFuncArgs) {
	if(typeof(conditionFunc) !== 'function') {
		return true;
	}
	if(!conditionFuncContext) {
		conditionFuncContext = this;
	}
	if(!conditionFuncArgs) {
		conditionFuncArgs = [];
	}

	while(!conditionFunc.apply(conditionFuncContext, conditionFuncArgs)) {

	}

	return true;
}