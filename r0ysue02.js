//hook fun函数并打印出fun函数的参数值

function main(){

    console.log("script loaded successfully")
    Java.perform(function(){

        console.log("Inside java perform function")
        var MainActivity = Java.use("com.example.demo3.MainActivity")
        console.log("java use.successfully") //定位类成功
        MainActivity.fun.implementation = function(x,y){
            console.log("x => " ,x + 20, "y => " ,y)
            var ret_value = this.fun(x,y)
            return ret_value
        }

    })

}

setImmediate(main)