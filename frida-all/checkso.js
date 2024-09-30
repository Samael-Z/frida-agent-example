

function replace_str_maps(){

    var pt_strstr = Module.findExportByName("libc.so","strstr")
    var pt_strcmp = Module.findExportByName("libc.so","strstr")

    Interceptor.attach(pt_strstr, {
        onEnter: function (args){

            var str1 = args[0].readCString()
            var str2 = args[1].readCString()
            if(str2.indexOf("REJECT") !== -1  || str2.indexOf("frida") !== -1){
                this.hook = true
            }

        }, onLeave:function (retval){

            if(this.hook){
                retval.replace(0)
            }
        }
    })

    Java.perform(function(){
        var mainactivity = Java.use("com.zj.wuaipojie2024_2.MainActivity")

        mainactivity.checkPassword.implementation = function (a){
            console.log("enter checkPassword arg = ", a)
            var retval = this.checkPassword(a)
            console.log("retval = " ,retval)
            retval = true
            return retval

        }
        
    })
    






}

setImmediate(replace_str_maps)