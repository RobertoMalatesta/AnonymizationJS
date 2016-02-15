var gulp 				= require('gulp');
var clean 			= require('gulp-clean');
var mocha 			= require('gulp-mocha');
var ts 					= require('gulp-typescript');
var tdoc 				= require("gulp-typedoc");
var browserify 	= require('gulp-browserify');


//----------------------------
// PATHS
//----------------------------
var paths = {
	javascripts: ['src/**/*.js', 'test/**/*.js'],
	typescripts: ['src/**/*.ts', 'test/**/*.ts'],
	typesources: ['src/**/*.ts'],
	distsources: ['src/**/*.ts'],
	clean: ['src/**/*.js', 'test/**/*.js', 'test/io/test_output/*', 'build', 'dist', 'docs'],
	tests: ['test/**/*.js']
};


//----------------------------
// TASKS
//----------------------------
gulp.task('build', function () {
	return gulp.src(paths.typescripts, {base: "."})
						 .pipe(ts({
							 target: "ES5",
							 module: "commonjs",
							 removeComments: true
						 }))
						.pipe(gulp.dest('.'));
});

// Packaging - Node / Commonjs
gulp.task('dist', ['clean', 'tdoc'], function () {
	return gulp.src(paths.distsources)
						 .pipe(ts({
							 target: "ES5",
							 module: "commonjs",
							 removeComments: true
						 }))
						 .pipe(gulp.dest('dist'));
});

// Packaging - Browser
gulp.task('browserify', ['dist'], function() {
	// Single entry point to browserify 
	gulp.src('./index.js')
		.pipe(browserify({
		  insertGlobals : false
		}))
		.pipe(gulp.dest('./build/graphinius'))
});

// Documentation (type doc)
gulp.task("tdoc", function() {
    return gulp
        .src(paths.typesources)
        .pipe(tdoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "Graphinius"//,
						// theme: "minimal"
        }))
    ;
});

gulp.task('test', ['build'], function () {
	return gulp.src(paths.tests, {read: false})
						 .pipe(mocha({reporter: 'nyan',
						 							timeout: 5000}));
});

gulp.task('clean', function () {
	return gulp.src(paths.clean, {read: false})
						 .pipe(clean());
});

gulp.task('watch', function () {
	gulp.watch(paths.typescripts, ['test']);
});

gulp.task('default', ['watch']);
