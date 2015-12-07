'use strict';

var appName = '${application.name}';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var beep = require('beepbeep');
var express = require('express');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');

/**
 * Fix:
 *
 * Due to WebKit issue #138038, assigning to a property on an object created with Object.create may result in the
 * error TypeError: Attempted to assign to readonly property.
 * This bug is known to affect iOS 8 users and is particularly likely to happen in recent versions of
 * Angular.js (at least version 1.4.2).
 *
 */
var webkitAssign = require('webkit-assign/gulp');
gulp.src('bower_components/angular/angular.js')
    .pipe(webkitAssign())
    .pipe(gulp.dest('bower_components/angular/webkitAssign'));

/**
 * Parse arguments
 */
var args = require('yargs')
    .alias('e', 'emulate')
    .alias('b', 'build')
    .alias('r', 'run')
    // remove all debug messages (console.logs, alerts etc) from release build
    .alias('release', 'strip-debug')
    .default('build', false)
    .default('port', 9555)
    .default('strip-debug', false)
    .argv;

var build = !!(args.build || args.emulate || args.run);
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var stripDebug = !!args.stripDebug;
var targetDir = path.resolve(build ? 'www' : '.tmp');

// if we just use emualate or run without specifying platform, we assume iOS
// in this case the value returned from yargs would just be true
if (emulate === true) {
    emulate = 'ios';
}
if (run === true) {
    run = 'ios';
}

// global error handler
var errorHandler = function(error) {
  if (build) {
    throw error;
  } else {
    beep(2, 170);
    plugins.util.log(error);
  }
};

// clean target dir
gulp.task('clean', function(done) {
  del([targetDir], done);
});

//precompile .scss
gulp.task('styles', function() {

  var options = build ? { style: 'compressed' } : { style: 'expanded' };

  var sassStream = gulp.src('app/styles/app.scss')
    .pipe(plugins.sass(options))
    .on('error', function(err) {
      console.log('err: ', err);
      beep();
    });

  return streamqueue({ objectMode: true }, sassStream)
    .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
    .pipe(plugins.concat('app.css'))
    .pipe(plugins.if(build, plugins.stripCssComments()))
    .pipe(plugins.if(build && !emulate, plugins.rev()))
    .pipe(gulp.dest(path.join(targetDir, 'styles')))
    .on('error', errorHandler);
});

//build templatecache, copy scripts.
//if build: concat, minsafe, uglify and versionize
gulp.task('scripts', function() {
var dest = path.join(targetDir, 'scripts');

var minifyConfig = {
 collapseWhitespace: true,
 collapseBooleanAttributes: true,
 removeAttributeQuotes: true,
 removeComments: true
};

// prepare angular template cache from html templates
// (remember to change appName var to desired module name)
var templateStream = gulp
 .src('**/*.html', { cwd: 'app/templates'})
 .pipe(plugins.angularTemplatecache('templates.js', {
   root: 'templates/',
   module: appName,
   htmlmin: build && minifyConfig
 }));

var scriptStream = gulp.src([
        'templates.js',
        'app.js',
        '**/*.js'
    ], { cwd: 'app/scripts' })
    .pipe(plugins.if(!build, plugins.changed(dest)));

return streamqueue({ objectMode: true }, scriptStream, templateStream)
 .pipe(plugins.if(build, plugins.ngAnnotate()))
 .pipe(plugins.if(stripDebug, plugins.stripDebug()))
 .pipe(plugins.if(build, plugins.concat('app.js')))
 .pipe(plugins.if(build, plugins.uglify()))
 .pipe(plugins.if(build && !emulate, plugins.rev()))
 .pipe(gulp.dest(dest))
 .on('error', errorHandler);
});

// copy fonts
gulp.task('fonts', function() {
  return gulp
    .src(['app/fonts/**/*.*'])
    .pipe(gulp.dest(path.join(targetDir, 'fonts')))
    .on('error', errorHandler);
});

// copy templates
gulp.task('templates', function() {
  return gulp.src('app/templates/**/*.*')
    .pipe(gulp.dest(path.join(targetDir, 'templates')))
    .on('error', errorHandler);
});

// copy images
gulp.task('images', function() {
  return gulp.src('app/images/**/*.*')
    .pipe(gulp.dest(path.join(targetDir, 'images')))
    .on('error', errorHandler);
});

// jscs task based on .jscs.json ruleset
gulp.task('jscs', function() {
    return gulp.src('app/scripts/**/*.js')
      .pipe(plugins.jscs())
      .pipe(plugins.jshint.reporter(stylish))
      .on('error', errorHandler);
      done();
});

// lint js sources based on .jshintrc ruleset
gulp.task('jsHint', function(done) {
  return gulp
    .src('app/scripts/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
    .on('error', errorHandler);
    done();
});

// concatenate and minify vendor sources
gulp.task('vendor', function() {
  var vendorFiles = require('./vendor.json');

  return gulp.src(vendorFiles)
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build, plugins.rev()))
    .pipe(gulp.dest(targetDir))
    .on('error', errorHandler);
});

//inject the files in index.html
gulp.task('index', ['jsHint', 'scripts'], function() {

  // build has a '-versionnumber' suffix
  var cssNaming = 'styles/*';

  // injects 'src' into index.html at position 'tag'
  var _inject = function(src, tag) {
    return plugins.inject(src, {
      starttag: '<!-- inject:' + tag + ':{{ext}} -->',
      read: false,
      addRootSlash: false
    });
  };

  // get all our javascript sources
  // in development mode, it's better to add each file seperately.
  // it makes debugging easier.
  var _getAllScriptSources = function() {
    var scriptStream = gulp.src([
            'scripts/app*.js',
            'scripts/**/*.js'
        ], { cwd: targetDir });
    return streamqueue({ objectMode: true }, scriptStream);
  };

  return gulp.src('app/index.html')
    // inject css
    .pipe(_inject(gulp.src(cssNaming, { cwd: targetDir }), 'app-styles'))
    // inject vendor.js
    .pipe(_inject(gulp.src('vendor*.js', { cwd: targetDir }), 'vendor'))
    // inject app.js (build) or all js files indivually (dev)
    .pipe(plugins.if(build,
      _inject(gulp.src('scripts/app*.js', { cwd: targetDir }), 'app'),
      _inject(_getAllScriptSources(), 'app')
    ))

    .pipe(gulp.dest(targetDir))
    .on('error', errorHandler)
});

// start local express server
gulp.task('serve', function() {
  express()
    .use(!build ? connectLr() : function(){})
    .use(express.static(targetDir))
    .listen(port);
});

// start watchers
gulp.task('watchers', function() {
  plugins.livereload.listen();
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**', ['fonts']);
  gulp.watch('app/icons/**', ['iconfont']);
  gulp.watch('app/images/**', ['images']);
  gulp.watch('app/scripts/**/*.js', ['index']);
  gulp.watch('./vendor.json', ['vendor']);
  gulp.watch('app/templates/**/*.html', ['index']);
  gulp.watch('app/index*.html', ['index']);
  gulp.watch(targetDir + '/**')
    .on('change', plugins.livereload.changed)
    .on('error', errorHandler);
});

// no-op = empty function
gulp.task('noop', function() {});

// our main sequence, with some conditional jobs depending on params
gulp.task('default', function(done) {
  runSequence(
    'clean',
    'tests',
    [
      'fonts',
      'templates',
      'styles',
      'images',
      'vendor'
    ],
    [
       'index'
    ],
    build ? 'noop' : 'watchers',
    build ? 'noop' : 'serve',
    done);
});

/**
 * Task for a combined run of all testing tasks
 */
gulp.task('tests', function() {
});

/**
 * Task for a combined run of all checkstyle tasks
 */
gulp.task('checkstyle', ['jsHint', 'jscs'], function() {
});
