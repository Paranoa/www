// 引入组件
var gulp = require('gulp'),
	concat = require('gulp-concat'),		//合并
	uglify = require('gulp-uglify'),		//压缩
	rename = require('gulp-rename');		//重命名

var path = ['public/js/*.js','public/js/*/*.js']

// 创建任务 scripts 合并path中的文件，输出到./dist  压缩后重命名为all.min.js 输出到./dist
gulp.task('scripts',function(){
	gulp.src(path)
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(gulp.dest('dist'));
});

// 默认任务, 监听，path中的文件变更时触发任务
gulp.task('watch',function(){
	gulp.watch(path,['scripts']);
})

//设置默认任务，开启watch并立刻执行一次scripts （即命令行输入 gulp = gulp default）
gulp.task('default',['watch','scripts']);