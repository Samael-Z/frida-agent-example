
function hook_delete(){

    Java.perform(function(){

        //获取java.io.File类的引用
        var File = Java.use("java.io.File")
        //挂钩delete方法
        File.delete.implementation = function(){

            //打印尝试删除的文件路径
            console.log("Deleting File = " + this.getPath())

            return true
        }

    })
}



function hook_res(){

    Java.perform(function(){

        //获取android.content.res.Resources类的引用
        var Resources = Java.use("android.content.res.Resources")
        //挂钩getIntArray方法
        Resources.getIntArray.overload("int").implementation = function(id){
            //换成b方法的偏移
            var replacementArray = Java.array("int",[0,3,7908])
            //打印新的返回值
            console.log("replacing getIntarrray result whith:" +JSON.stringify(replacementArray))
            //返回新的数组替代原始的返回值
            return replacementArray
        }

    })
}

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

}

function test(){
    Java.enumerateClassLoaders({
        "onMatch": function (loader) {
            if (loader.toString().indexOf("dalvik.system.DexClassLoader") !== -1) {
                Java.classFactory.loader = loader;
                console.log(loader);
            }
        },
        "onComplete": function () {
            console.log("success");
        }
    });
}



function main(){
    Java.perform(function() {
        replace_str_maps()
        hook_delete()
        hook_res()
        test()

    })

}

setImmediate(main)