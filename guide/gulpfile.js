var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
/*var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegtran = require('imagemin-jpegtran');*/

//编译less
gulp.task('less', function() {
	return gulp.src('less/*.less') //选择less文件夹下所有less文件
		.pipe(plugins.less()) //编译less为css
		.pipe(plugins.autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
			cascade: false,
		})) //自动补全兼容
		.pipe(gulp.dest('./css')); //输出到css文件夹
});

//压缩合并css
gulp.task('css', function() {
	return gulp.src(['./css/style.css','./css/temp_wb.css','./css/timely.css']) //选择css文件夹下的所有css文件
		.pipe(plugins.sourcemaps.init()) //初始map地图
		.pipe(plugins.concat("main.css")) //合并所有css文件为main.css
		.pipe(plugins.cleanCss({ //压缩css文件
			advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
			compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
			keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
			keepSpecialComments: '*'
				//保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
		})) //压缩CSS
		.pipe(plugins.rename({ //重命名文件为main.min.css
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(plugins.sourcemaps.write('../maps')) //输出map地图到maps文件夹
		.pipe(plugins.rev()) //将main.min.css 转换为md5文件名

	.pipe(gulp.dest("./dist/css")) //将css文件输出到dist/css文件夹
		.pipe(plugins.rev.manifest()) //生成rev-manifest.json

	.pipe(gulp.dest("./dist/rev/css")); //将rev-manifest.json输出到dist/rev/css文件夹

});


//清除任务
gulp.task('clean', function() {
	return gulp.src(['./dist'], { read: false })
		.pipe(plugins.clean());
});


//合并 压缩JS
gulp.task('js', function() {
	return gulp.src(["./js/mobileFix.mini.js","./js/exif.js","./js/lrz.js","./js/myminpic.js","./js/timely.js","./js/flash.js","./js/md5.js"]) //
		.pipe(plugins.sourcemaps.init()) //开启地图
		//.pipe(plugins.jshint('.jshintrc')) //检查语法
		//.pipe(plugins.jshint.reporter('default')) // 对代码进行报错提示
		.pipe(plugins.concat("main")) //合并为main.js
		.pipe(plugins.uglify()) //混淆压缩
		.pipe(plugins.rename({ //重命名为main.min.js
			suffix: ".min",
			extname: ".js"
		}))
		.pipe(plugins.sourcemaps.write('../maps')) //输出地图
		.pipe(plugins.rev()) //md5改名

	.pipe(gulp.dest("./dist/js/")) //将压缩文件输出到dist/js目录
		.pipe(plugins.rev.manifest()) //生成rev-manifest.json

	.pipe(gulp.dest("./dist/rev/js")); //输出rev-manifest.json


});

//rev替换html中的文件地址
gulp.task('html', function() {
	return gulp.src(['./dist/rev/**/*.json', './index.html']) //选择所有rev下的替换对照文件，并选择需要替换的inex.html文件
		.pipe(plugins.revCollector({ //开始替换
			replaceReved: true
		}))
		.pipe(plugins.processhtml()) //替换html中的注释标签
		.pipe(gulp.dest('./dist')); //将index.html输出到dist目录
})


//图片压缩
gulp.task('img', function() {
	return gulp.src('./img/*.{png,jpg,gif,ico}') //选择images文件夹下所有的png,jpg,gif,ico图片文件
		.pipe(plugins.cache(
			plugins.imagemin()
		)) //只压缩有修改的图片
		.pipe(gulp.dest('dist/img'));
});
//复制文件
gulp.task('copy',function(){
	var fileList = [
		'./css/sm.min.css'
	];
	return gulp.src(fileList)
	.pipe(gulp.dest('dist/css'));
})

//打包zip
var date = new Date();
var aa = date.getFullYear()+"-"+date.getMonth()+"-"+(date.getDay()+1)+"-test.zip";
gulp.task('zip', function(){
    return gulp.src('./dist/**/**')//选择所有dist目录下的所有文件
        .pipe(plugins.zip(aa))//打包为yyyy-mm-dd-test.zip
        .pipe(gulp.dest('./'));//输出到项目根目
})

//主任务
gulp.task('default',function(cb){
    plugins.sequence('clean', ['css', 'js','img','copy'],'html', cb);
});

//监听less
gulp.task('watch', function(){
    gulp.watch("./less/**/*.less",["less"]);//当less文件有变化时，自动调用less任务进行编译
});