var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var watchPath = require('gulp-watch-path');
var combiner = require('stream-combiner2');
var gutil = require('gulp-util')
var del = require('del')

//构建工程，只在发布上线时用
let distDir = 'dist/';
if (gutil.env.build === true) {
  distDir = '../kafeibei/mui-app-build/dist/'
}

//启动本地服务器，需要配置host: 127.0.0.1 app_new.hjx.com
//另外监听scss、html文件
gulp.task('serve', ['sass'], function() {
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
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', function (event) {
      var paths = watchPath(event, 'src/js', 'dist/js/')
  		gulp.src(paths.srcPath)
    		.pipe(babel())
  	    // .pipe(uglify())
    		.pipe(gulp.dest(paths.distDir));
    })
    gulp.watch('src/pages/**/*.html', function (event) {
        var paths = watchPath(event, 'src/pages', distDir + 'pages/')
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            gulp.dest(paths.distDir)
        ])
    });
    gulp.watch('dist/pages/**/*.html').on('change', reload);
    gulp.watch('src/assets/**/*', function (event) {
       var paths = watchPath(event,'src/assets/', 'dist/assets/')
       gulp.src(event.path)
        .pipe(gulp.dest(paths.distDir))
    })
});

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
    .pipe(gulp.dest(distDir + 'css'));
});
//本地开发时候用
gulp.task('watch', ['serve']);

var version = +new Date();

var filter = require('gulp-filter');
var htmlfilter = filter(['src/pages/**/*.html'], {restore: true});

gulp.task('clean', () => {
  del([distDir + '/**'], {
    force: true
  }).then(() => {
      console.log('项目初始化清理完成...');
  })
})

gulp.task('distjs', () => {
  gulp.src(['src/js/**/*.js'])
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest(distDir + 'js'))
})

gulp.task('disttemplates', () => {
  gulp.src('src/pages/**/*.html')
  .pipe(htmlfilter)
  .pipe(require('gulp-just-replace')([{
    search: /\$VERSION/g,
    replacement: version
  }
  ]))
  .pipe(htmlfilter.restore)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(distDir + 'pages'))
})

gulp.task('distimage', function () {
  gulp.src('src/assets/**/*')
      .pipe(imagemin({progressive: true}))
      .pipe(gulp.dest(distDir + 'assets'))
})

gulp.task('distjson', function () {
    gulp.src('src/json/*')
    .pipe(gulp.dest(distDir + 'json'))
});


gulp.task('babel', ['distjs', 'distimage', 'sass', 'distjson', 'disttemplates'])
