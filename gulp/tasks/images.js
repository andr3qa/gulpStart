import gulpif from 'gulp-if';
// import imagemin, {
//   gifsicle,
//   mozjpeg,
//   optipng,
//   svgo
// } from 'gulp-imagemin';
import newer from "gulp-newer";
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

export const images = () => {
  return app.gulp.src([`${app.paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`], {
      encoding: false
    })
    .pipe(plumber(
      notify.onError({
        title: "IMAGES",
        message: "Error: <%= error.message %>"
      })))
    .pipe(newer(app.paths.buildImgFolder))
    // .pipe(imagemin([
    //   gifsicle({
    //     interlaced: true
    //   }),
    //   mozjpeg({
    //     quality: 75,
    //     progressive: true
    //   }),
    //   optipng({
    //     optimizationLevel: 5
    //   }),
    // ]))
    .pipe(app.gulp.dest(app.paths.buildImgFolder))
};
