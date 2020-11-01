const {src, dest, parallel, series, watch} = require('gulp');
const autoprefixer  = require('gulp-autoprefixer');
const groupMedia    = require('gulp-group-css-media-queries');
const cleanCSS      = require('gulp-clean-css');
const uglify        = require('gulp-uglify-es').default;
const del           = require('del');
const browserSync   = require('browser-sync').create();
const sass          = require('gulp-sass');
const rename        = require('gulp-rename');
const gutil         = require('gulp-util');
const ftp           = require('vinyl-ftp');
const sourcemaps    = require('gulp-sourcemaps');
const notify        = require('gulp-notify');
const svgSprite     = require('gulp-svg-sprite');
const webpack       = require('webpack');
const webpackStream = require('webpack-stream');
const ttf2woff2     = require('gulp-ttf2woff2');
const fs            = require('fs');
const rev           = require('gulp-rev');
const revRewrite    = require('gulp-rev-rewrite');
const revdel        = require('gulp-rev-delete-original');
const imagemin      = require('gulp-imagemin');
const webp          = require('gulp-webp');
const webphtml      = require('gulp-webp-html');
const webpCss       = require('gulp-webp-css');
const pug           = require('gulp-pug');
const pugLinter     = require('gulp-pug-linter');
const htmlValidator = require('gulp-w3c-html-validator');
const bemValidator  = require('gulp-html-bem-validator');


const fonts = () => {
    return src('./app/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('./dist/fonts/'));
}

const checkWeight = (fontname) => {
    let weight = 400;
    switch (true) {
        case /Thin/.test(fontname):
            weight = 100;
            break;
        case /ExtraLight/.test(fontname):
            weight = 200;
            break;
        case /Light/.test(fontname):
            weight = 300;
            break;
        case /Regular/.test(fontname):
            weight = 400;
            break;
        case /Medium/.test(fontname):
            weight = 500;
            break;
        case /SemiBold/.test(fontname):
            weight = 600;
            break;
        case /Semi/.test(fontname):
            weight = 600;
            break;
        case /Bold/.test(fontname):
            weight = 700;
            break;
        case /ExtraBold/.test(fontname):
            weight = 800;
            break;
        case /Heavy/.test(fontname):
            weight = 700;
            break;
        case /Black/.test(fontname):
            weight = 900;
            break;
        default:
            weight = 400;
    }
    return weight;
}

const cb = () => {}

let srcFonts = './app/scss/_fonts.scss';
let appFonts = './dist/fonts/';

const fontsStyle = (done) => {
    let file_content = fs.readFileSync(srcFonts);

    fs.writeFile(srcFonts, '', cb);
    fs.readdir(appFonts, function (err, items) {
        if (items) {
            let c_fontname;
            for (var i = 0; i < items.length; i++) {
                let fontname = items[i].split('.');
                fontname = fontname[0];
                let font = fontname.split('-')[0];
                let weight = checkWeight(fontname);

                if (c_fontname != fontname) {
                    fs.appendFile(srcFonts, '@include font-face("' + font + '", "' + fontname + '", ' + weight + ');\r\n', cb);
                }

                c_fontname = fontname;
            }
        }
    })

    done();
}

const resources = () => {
    return src('./app/resources/**')
        .pipe(dest('./dist'))
}

const img = () => {
    return src('./app/img/src/**/*')
    .pipe(webp({
        quality: 70
    }))
    .pipe(dest('./dist/img/'))
    .pipe(src('./app/img/src/**/*'))
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3 // 0 to 7
    }))
    .pipe(dest('./dist/img/'))
}

const svgSprites = () => {
    return src('./app/img/svg/**.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
        }))
        .pipe(dest('./dist/img'));
}

const pug2html = () => {
    return src('./app/pages/*.pug')
    .pipe(pugLinter({ reporter: 'default' }))
    .pipe(pug({
        pretty: false // 'true' doesn't work with 'webphtml'
    }).on("error", notify.onError()))
    .pipe(webphtml())
    .pipe(htmlValidator())
    .pipe(bemValidator())
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
}

const styles = () => {
    return src('./app/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on("error", notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(groupMedia())
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(webpCss())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/css/'))
        .pipe(browserSync.stream());
}

const scripts = () => {
    return src('./app/js/main.js')
        .pipe(webpackStream({
            mode: 'development',
            output: {
                filename: 'main.js',
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            },
        }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })

        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/js'))
        .pipe(browserSync.stream());
}

const watchFiles = () => {
    browserSync.init({
        server: { baseDir: "./dist" },
        notify: false,
        online: true
    });

    watch('./app/pages/**/*.pug', pug2html);
    watch('./app/scss/**/*.scss', styles);
    watch('./app/js/**/*.js', scripts);
    watch('./app/resources/**', resources);
    watch('./app/img/src/**/*', img);
    watch('./app/img/svg/**.svg', svgSprites);
    watch('./app/fonts/**', fonts);
    watch('./app/fonts/**', fontsStyle);
}

const clean = () => {
    return del(['dist/*'])
}

exports.pug2html    = pug2html;
exports.styles      = styles;
exports.scripts     = scripts;
exports.img         = img;
exports.watchFiles  = watchFiles;
exports.fonts       = fonts;
exports.fontsStyle  = fontsStyle;

exports.default = series(clean, parallel(pug2html, scripts, fonts, resources, img, svgSprites), fontsStyle, styles, watchFiles);

// BUILD

const pug2htmlBuild = () => {
    return src('./app/pages/*.pug')
    .pipe(pug({ pretty: false }))
    .pipe(dest('./dist'))
}

const stylesBuild = () => {
    return src('./app/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on("error", notify.onError()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('./dist/css/'))
}

const scriptsBuild = () => {
    return src('./app/js/main.js')
        .pipe(webpackStream(

            {
                mode: 'development',
                output: {
                    filename: 'main.js',
                },
                module: {
                    rules: [{
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }]
                },
            }))
        .on('error', function (err) {
            console.error('WEBPACK ERROR', err);
            this.emit('end'); // Don't stop the rest of the task
        })
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest('./dist/js'))
}

const cache = () => {
    return src('dist/**/*.{css,js,svg,png,jpg,jpeg,woff2}', {
            base: 'dist'
        })
        .pipe(rev())
        .pipe(revdel())
        .pipe(dest('dist'))
        .pipe(rev.manifest('rev.json'))
        .pipe(dest('dist'));
};

const rewrite = () => {
    const manifest = src('dist/rev.json');

    return src('dist/**/*.html')
        .pipe(revRewrite({
            manifest
        }))
        .pipe(dest('dist'));
}

exports.cache = series(cache, rewrite);

exports.build = series(clean, parallel(pug2htmlBuild, scriptsBuild, fonts, resources, img, svgSprites), fontsStyle, stylesBuild);


// deploy
const deploy = () => {
    let conn = ftp.create({
        host: '',
        user: '',
        password: '',
        parallel: 10,
        log: gutil.log
    });

    let globs = [
        'dist/**',
    ];

    return src(globs, {
            base: './dist',
            buffer: false
        })
        .pipe(conn.newer('')) // only upload newer files
        .pipe(conn.dest(''));
}

exports.deploy = deploy;
