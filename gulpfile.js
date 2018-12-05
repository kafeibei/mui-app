var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var jsbabel = require('gulp-babel');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');

//启动本地服务器，需要配置host: 127.0.0.1 app_new.hjx.com
//另外监听scss、html文件
gulp.task('sass', function() {
    var sass = require('gulp-sass');
    var autoprefixer = require('gulp-autoprefixer');
    var minifycss = require('gulp-clean-css');
    return gulp.src('src/sass/**/*.scss')
    .pipe(sass.sync())
    .pipe(minifycss())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('serve', gulp.series('sass', function() {
    var browserSync = require('browser-sync').create();
    var reload = browserSync.reload;
    browserSync.init({
        server: './',
        middleware: function (req, res, next) {
            var parsed = require('url').parse(req.url);
            var fs = require('fs');
            fs.access('./' + parsed.pathname, function(err){
                if(err){
                    res.setHeader('Content-Type', 'text/html');
                    res.end(fs.readFileSync('index.html').toString());
                    return false;
                } else {
                    next();
                }
            });
        },
        open: 'external',
        host: 'app_new.hjx.com',
        ui: false,
        index: 'index.html',
        logConnections: true,
        logFileChanges: false,
        notify: false
    });
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', function (event) {
      var paths = watchPath(event, 'src/js', 'dist/js/')
  		return gulp.src(paths.srcPath)
    		.pipe(jsbabel())
  	    // .pipe(uglify())
    		.pipe(gulp.dest(paths.distDir));
    })
    gulp.watch('src/pages/**/*.html', function (event) {
      var paths = watchPath(event, 'src/pages', 'dist/pages/')
      return combiner.obj([
          gulp.src(paths.srcPath),
          gulp.dest(paths.distDir)
      ])
    });
    gulp.watch('dist/pages/**/*.html').on('change', reload);
    gulp.watch('src/assets/**/*', function (event) {
       var paths = watchPath(event,'src/assets/', 'dist/assets/')
       return gulp.src(event.path)
        .pipe(gulp.dest(paths.distDir))
    })
}));

//本地开发时候用
gulp.task('watch', gulp.series('serve'));

//构建工程，只在发布上线时用
var distDir = 'dist/';
var version = +new Date();

var filter = require('gulp-filter');
var htmlfilter = filter(['src/pages/**/*.html'], {restore: true});

gulp.task('distjs', () => {
  return gulp.src(['src/js/**/*.js'])
  .pipe(jsbabel())
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
})

gulp.task('disttemplates', () => {
  return gulp.src('src/pages/**/*.html')
  .pipe(htmlfilter)
  .pipe(require('gulp-just-replace')([{
    search: /\$VERSION/g,
    replacement: version
  }
  ]))
  .pipe(htmlfilter.restore)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist/pages'))
})

gulp.task('distimage', function () {
  return gulp.src('src/assets/**/*')
      .pipe(imagemin({progressive: true}))
      .pipe(gulp.dest('dist/assets'))
})

gulp.task('distjson', function () {
    return gulp.src('src/json/*.json')
    .pipe(gulp.dest('dist/json'))
});


gulp.task('babel', gulp.parallel('distjs', 'distimage', 'sass', 'distjson', 'disttemplates'))
