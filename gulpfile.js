var gulp       	= require('gulp');
var browserify 	= require('browserify');
var watchify   	= require('watchify');
var connect    	= require('gulp-connect');
var vinylPaths 	= require('vinyl-paths');
var source     	= require('vinyl-source-stream');
var del        	= require('del');
var gulpif     	= require('gulp-if');
var gutil      	= require('gulp-util');
var sass 			 	= require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var deploy = require('gulp-gh-pages');

var conf = {
  src: ['**', '!js{,/**}', '!assets/scss{,/**}'],
  js:     ['src/js/*.js', 'src/js/**/*.js'],
  scss: ['src/assets/scss/**/*.scss'],
  entry: './src/js/main.js',
  dist:   './target/'
};

var isProd = true;

gulp.task('deploy', function () {
    return gulp.src(conf.dist + '**/*')
        .pipe(deploy());
});

gulp.task('clean', function () {
	return gulp.src(conf.dist)
    .pipe(vinylPaths(del))
    .on('error', gutil.log);
});

gulp.task('copy', function () {
  gulp.src(conf.src, {cwd: './src'})
    .pipe(gulp.dest(conf.dist))
    .pipe(connect.reload())
    .on('error', gutil.log);
});

gulp.task('css', function () {
  var dest = conf.dist + 'assets/css/';

	return gulp.src(conf.scss)
         .pipe(gulpif(!isProd, sourcemaps.init()))
         .pipe(sass({
           outputStyle: isProd ? 'compressed' : 'expanded',
           includePaths: [require('node-bourbon').includePaths]
         }))
         .pipe(gulpif(!isProd, sourcemaps.write()))
         .pipe(gulp.dest(dest))
         .pipe(connect.reload());
});

gulp.task('scripts', function () {
  var bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: false,
    paths: ['./src/js/libs'],
    entries: [conf.entry],
    debug: !isProd
  });

  var bundlee = function() {
    return bundler
      .bundle()
      .pipe(source('bundle.js'))
      //.pipe(jshint('.jshintrc'))
      //.pipe(jshint.reporter('default'))
      //.pipe(gulpif(!watching, streamify(uglify({outSourceMaps: false}))))
      .pipe(gulp.dest(conf.dist + 'js'))
      .pipe(connect.reload())
      .on('error', gutil.log);
  };

  if (!isProd) {
    bundler = watchify(bundler);
    bundler.on('update', function () {
    	gutil.log('Watchify Update')
    	bundlee(arguments);
    })
  }

  return bundlee();
});


gulp.task('connect', function () {
  connect.server({
    root: [conf.dist],
    port: 9000,
    livereload: true
  });
});

gulp.task('watch', function () {
	gulp.watch(conf.scss, ['css']);
  gulp.watch('./src/**/*.{html,png,jpeg,jpg,json}', ['copy']);
 // gulp.watch(conf.js, ['scripts']);
});

gulp.task('setdev', function () {
	isProd = false;
});


gulp.task('build', function(callback) {
  runSequence('clean', ['copy', 'css', 'scripts'], callback);
});

gulp.task('dev', ['setdev', 'connect', 'watch', 'build'])
gulp.task('default', ['build']);
