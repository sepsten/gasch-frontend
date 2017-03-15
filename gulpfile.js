var gulp = require("gulp"),
    browserify = require("browserify"),
    reactify = require("reactify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename");

// Tasks for each Gasch component
// ------------------------------

var components = ["browser", "editor"];

components.map(function(component) {
  gulp.task(component+"-static", function() {
    return gulp.src("./"+component+"/static/*")
      .pipe(gulp.dest("./public/"+component));
  });

  gulp.task(component+"-scripts", function() {
    return browserify("./"+component+"/js/index.js", {
      debug: true
    })
      .bundle()
      .pipe(source(component+".js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("./public/js/"));
  });

  gulp.task(component+"-sass", function() {
    return gulp.src("./"+component+"/scss/index.scss")
      .pipe(sass().on('error', sass.logError))
      .pipe(rename(component+".css"))
      .pipe(gulp.dest("./public/css"));
  });

  gulp.task(component, [component+"-static", component+"-scripts",
    component+"-sass"]);
});

gulp.task("watch", function() {
  components.map(function(component) {
    gulp.watch("./"+component+"/static/*", [component+"-static"]);
    gulp.watch("./"+component+"/js/*", [component+"-scripts"]);
    gulp.watch("./"+component+"/scss/*", [component+"-sass"]);
  });
});

gulp.task("default", components);
