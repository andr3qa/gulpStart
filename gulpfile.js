const {src, dest, series, watch} = require('gulp');

const { readFileSync }  = require('fs');
const { htmlValidator } = require('gulp-w3c-html-validator');

const autoprefixer  = require('gulp-autoprefixer');
const babel         = require('gulp-babel');
const cleanCSS      = require('gulp-clean-css');
const uglify        = require('gulp-uglify-es').default;
const del           = require('del');
const browserSync   = require('browser-sync').create();
const sass          = require('gulp-sass')(require('sass'));
const svgSprite     = require('gulp-svg-sprite');
const fileInclude   = require('gulp-file-include');
const sourcemaps    = require('gulp-sourcemaps');
const rev           = require('gulp-rev');
const revRewrite    = require('gulp-rev-rewrite');
const revDel        = require('gulp-rev-delete-original');
const htmlmin       = require('gulp-htmlmin');
const gulpif        = require('gulp-if');
const notify        = require('gulp-notify');
const image         = require('gulp-image');
const concat        = require('gulp-concat');
const groupMedia    = require('gulp-group-css-media-queries');
const webp          = require('gulp-webp');
const webphtml      = require('gulp-webp-in-html');
const webpCss       = require('gulp-webp-css');
const bemValidator  = require('gulp-html-bem-validator');

let isProd = false; // dev by default

const clean = () => {
    return del(['dist/*'])
}

const svgSprites = () => {
    return src('./app/img/svg/**.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                sprite: "../sprite.svg" //sprite file name
                }
            },
        }))
        .pipe(dest('./dist/img'));
}

const styles = () => {
    return src('./app/scss/**/*.scss')
        .pipe(gulpif(!isProd, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on("error", notify.onError()))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(webpCss()) // without "cleanCSS" it gives an error
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(dest('./dist/css/'))
        .pipe(browserSync.stream());
}

const stylesBackend = () => {
    return src('./app/scss/**/*.scss')
        .pipe(sass().on("error", notify.onError()))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(webpCss())
        .pipe(dest('./dist/css/'))
};

const scripts = () => {
    src('./app/js/vendor/**.js')
        .pipe(concat('vendor.js'))
        .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
        .pipe(dest('./dist/js/'))
    return src(
        ['./app/js/components/**/*.js', './app/js/main.js'])
        .pipe(gulpif(!isProd, sourcemaps.init()))
            .pipe(babel({
                presets: ['@babel/env']
            }))
        .pipe(concat('main.js'))
        .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(dest('./dist/js'))
        .pipe(browserSync.stream());
}

const scriptsBackend = () => {
    src('./app/js/vendor/**.js')
        .pipe(concat('vendor.js'))
        .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
        .pipe(dest('./dist/js/'))
    return src(['./app/js/components/**/*.js', './app/js/main.js'])
        .pipe(dest('./dist/js'))
};

const resources = () => {
    return src('./app/resources/**')
        .pipe(dest('./dist'))
}

const images = () => {
    return src('./app/img/src/**/*')
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest('./dist/img'))
        .pipe(src('./app/img/src/**/*'))
        .pipe(gulpif(isProd, image()))
        .pipe(dest('./dist/img'))
};

const htmlInclude = () => {
    return src('./app/html/*.html')
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file'
        }))
        .pipe(webphtml())
        .pipe(htmlValidator.analyzer())
        .pipe(htmlValidator.reporter())
        .pipe(bemValidator())
        .pipe(dest('./dist'))
        .pipe(browserSync.stream());
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "./dist",
        },
        notify: false,
        online: true
    });

    watch('./app/scss/**/*.scss', styles);
    watch('./app/js/**/*.js', scripts);
    watch('./app/html/**/*.html', htmlInclude);
    watch('./app/resources/**', resources);
    watch('./app/img/*.{jpg,jpeg,png,webp,svg}', images);
    watch('./app/img/**/*.{jpg,jpeg,png,webp}', images);
    watch('./app/img/svg/**.svg', svgSprites);
}

const cache = () => {
    return src('dist/**/*.{css,js,svg,png,jpg,jpeg,webp,woff2}', {
        base: 'dist'})
        .pipe(rev())
        .pipe(revDel())
        .pipe(dest('dist'))
        .pipe(rev.manifest('rev.json'))
        .pipe(dest('dist'));
};

const rewrite = () => {
    const manifest = readFileSync('dist/rev.json');
        src('dist/css/*.css')
        .pipe(revRewrite({
            manifest
        }))
        .pipe(dest('dist/css'));
    return src('dist/**/*.html')
        .pipe(revRewrite({
            manifest
        }))
        .pipe(dest('dist'));
}

const htmlMinify = () => {
    return src('dist/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest('dist'));
}

const toProd = (done) => {
    isProd = true;
    done();
};

exports.default = series(clean, htmlInclude, scripts, styles, resources, images, svgSprites, watchFiles);

exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, svgSprites, htmlMinify);

exports.cache = series(cache, rewrite);

exports.backend = series(toProd, clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, svgSprites);