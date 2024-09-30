Java.perform(function () {
    var MainActivity = Java.use('com.android.settings.MainActivity');
    MainActivity.foo.implementation = function (x) {
        console.log('Called foo with arg: ' + x);
        return this.foo(x);
    };
});

Java.perform(function(){ //当作主函数
    var Course=Java.use('com.busuu.android.api.course.model.ApiCourse'); //这句获取类
    Course.getLevels.implementation=function(){ //这里开始是Hook函数，前面的getLevels为要Hook的函数名
        console.log("Hook start");
        var level=this.getLevels(); //获取下返回值
        console.log(level.toString());
        return level; //返回函数执行结果，否则这就不是一个纯正的Hook了
    }
})