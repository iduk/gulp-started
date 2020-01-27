import gulp from "gulp";
import gulpPug from "gulp-pug";

const routes = {
  pug: {
    src: "src/*.pug",
    dest: "build" // destination (목적지)
  }
};

export const pug = () =>
    gulp
      .src(routes.pug.src)
      .pipe(gulpPug())
      .pipe(gulp.dest(routes.pug.dest));

      
export const dev = gulp.series([pug]);