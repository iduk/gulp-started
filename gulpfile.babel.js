import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import autoPrefixer from "gulp-autoprefixer";
import minCss from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";

sass.compiler = require("node-sass");

const routes = {
	pug: {
		watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build" // destination (목적지)
	},
	img: {
		src: "src/img/*",
		dest: "build/img"
	},
	scss: {
		watch: "src/scss/**/*.scss",
		src: "src/scss/style.scss",
		dest: "build/css"
	},
	js: {
		watch: "src/js/**/*.js",
		src: "src/js/main.js",
		dest: "build/js"
	}
};

// 
const pug = () =>
	gulp
		.src(routes.pug.src)
		.pipe(gpug())
		.pipe(gulp.dest(routes.pug.dest));
      
const clean = () => del(["build/"]);
const webserver = () =>
	gulp
		.src('build')
		.pipe(ws({ livereload: true, open: true }));

const img = () =>
	gulp
		.src(routes.img.src)
		.pipe(image({
			svgo: true
		}))
		.pipe(gulp.dest(routes.img.dest));

const styles = () =>
	gulp
		.src(routes.scss.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(
			autoPrefixer({
				config: ['last 2 versions']
			})
		)
		.pipe(minCss())
		.pipe(gulp.dest(routes.scss.dest));

const js = () => gulp.src(routes.js.src)
	.pipe(
		bro({
			transform:
				[babelify.configure({ presets: ["@babel/preset-env"] }),
				["uglifyify", { global: true }]
				]
		})
	)
	.pipe(gulp.dest(routes.js.dest));

const watch = () => {
	gulp.watch(routes.pug.watch, pug);
	gulp.watch(routes.img.src, img);
	gulp.watch(routes.scss.watch, styles);
	gulp.watch(routes.js.watch, js);
};


// 할일 정돈하기
const prepare = gulp.series([clean]);
const assets = gulp.series([pug, img, styles, js]);
const postDev = gulp.parallel([webserver, watch]); // task를 여러개 병행 할 땐 'parallel'

export const dev = gulp.series([prepare, assets, postDev]);