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
import ghPages from "gulp-gh-pages-with-updated-gift";


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

// Pug Compile
const pug = () =>
	gulp
		.src(routes.pug.src)
		.pipe(gpug())
		.pipe(gulp.dest(routes.pug.dest));

// Clean 
const clean = () => del(["build/", ".publish"]);

// Server
const webserver = () =>
	gulp
		.src('build')
		.pipe(ws({ livereload: true, open: true }));

// Images
const img = () =>
	gulp
		.src(routes.img.src)
		.pipe(image({
			svgo: true
		}))
		.pipe(gulp.dest(routes.img.dest));

// Scss, Css
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

// Js
const js = () => gulp.src(routes.js.src)
	.pipe(
		bro({
			transform:
				[babelify.configure({ presets: ["@babel/preset-env"] }), // react 사용시, 프리셋 추가
				["uglifyify", { global: true }]
				]
		})
	)
	.pipe(gulp.dest(routes.js.dest));

// Git 배포
const gh = () => gulp.src("build/**/*").pipe(ghPages());

// Watch
const watch = () => {
	gulp.watch(routes.pug.watch, pug);
	gulp.watch(routes.img.src, img);
	gulp.watch(routes.scss.watch, styles);
	gulp.watch(routes.js.watch, js);
};


// Task Groups
const cleaning = gulp.series([clean]);
const assets = gulp.series([pug, img, styles, js]);
const live = gulp.parallel([webserver, watch]); // task를 여러개 병행 할 땐 'parallel'
// Export
export const build = gulp.series([cleaning, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, cleaning]);