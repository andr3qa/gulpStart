import browserSync from "browser-sync";
import fileInclude from "gulp-file-include";
import typograf from "gulp-typograf";
import bemValidator from "gulp-html-bem-validator";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import { htmlValidator } from "gulp-w3c-html-validator";

export const htmlInclude = () => {
  return (
    app.gulp
      .src([`${app.paths.base.src}/*.html`])
      .pipe(
        plumber(
          notify.onError({
            title: "HTML",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(
        fileInclude({
          prefix: "@",
          basepath: "@file",
          maxRecursion: 100,
        })
      )
      // .pipe(
      //   typograf({
      //     locale: ["ru", "en-US"],
      //   })
      // )
      .pipe(bemValidator())
      // .pipe(htmlValidator.analyzer())
      // .pipe(htmlValidator.reporter())
      .pipe(app.gulp.dest(app.paths.base.build))
      .pipe(browserSync.stream())
  );
};
