//需要解决的问题：
//frida遍历Classloader，类，类函数，并以此调用
//hook函数运行流程某一处，获取当时dex中函数的代码并保存



/**
 * 不管是frida脚本的编写，还是Xposed插件的开发，ClassLoader都是绕不开的必须掌握的知识点。
 * 而对于dex中类列表的获取，最根本的还是通过获取到DexFile对象以后，自行解析其中的类列表，这就需要对dex文件的结构有着非常清楚的认识。
 * 在脱壳的过程中，对于任何ART支持的Android系统，只要知道了ArtMethod对象是贯穿app中的java类函数的加载和执行生命周期过程中的最为关键的成员，
 * 对于app的脱壳就会有非常深入的认识，接下来就可以再去参考下诸如Xposed以及frida等hook框架是如何对java函数进行hook的了
 * 
 * 
 * 
 */
function hook_java(){
    Java.perform(function(){
        console.log("-------Java.enumerateClassLoaders")
        Java.enumerateClassLoaders({
            onMatch:function(cl){
                fartwithClassloader(cl)

            },onComplete:function(){

            }
        })
    })
}
var TestClass = "com.sup.android.superb"
//$className 是一个特殊的属性，它返回当前 Java 类的全类名（包括包路径）。
function fartwithClassloader(cl){

    Java.perform(function(){
        
        var clstr = cl.$className.toString();
        if(clstr.indexOf("java.lang.BootClassLoader") >= 0){
            return
        }
        console.log("|-------",cl.$className)
        var class_BaseDexClassLoader = Java.use("dalvik.system.BaseDexClassLoader");
        var pathcl = Java.cast(cl,class_BaseDexClassLoader);
        console.log(".pathList " , pathcl.pathList.value)

        var class_DexPathList = Java.use("dalvik.system.DexPathList")
        var dexPathList = Java.cast(pathcl.pathList.value, class_DexPathList)
        console.log(".dexElements:" ,dexPathList.dexElements.value.length)

        var class_DexFile = Java.use("dalvik.system.DexFile")
        var class_DexPathList_Element = Java.use("dalvik.system.DexPathList$Element")
        for(var i = 0; i < dexPathList.dexElements.value.length; i++){
            var dexPathList_Element = Java.cast(dexPathList.dexElements.value[i],class_DexPathList_Element)
            console.log(".dexFile:" ,dexPathList_Element.dexFile.value)
            if(dexPathList_Element.dexFile.value){
                //可能为空
                var dexFile = Java.cast(dexPathList_Element.dexFile.value, class_DexFile)
                var mCookie = dexFile.mCookie.value
                console.log(".mCookie",mCookie)
                if(dexFile.mInternalCookie.value){
                    console.log(".mInternalCookie ", dexFile.mInternalCookie.value)
                    mCookie = dexFile.mInternalCookie.value

                }
                var classnameArr = dexPathList_Element.dexFile.value.getClassNameList(mCookie)
                console.log("dexFile.getClassNameList.length ", classnameArr.length)
                console.log("       |---------- Enumerate ClassName Start")
                for(var i = 0; i < classnameArr.length; i++){
                    
                    if(classnameArr[i].indexOf(TestClass) >= -1){
                        //过滤指定包名的类，打印所有的类的名称，下面就是主动调用了
                        console.log("       ", classnameArr[i])
                        loadClassAndInvoke(cl,classnameArr[i])

                    }
                }
                console.log("       |---------- Enumerate ClassName end")

            }
        }


    })

}
var dumpMethodName = []
var TestFunction = ""
function loadClassAndInvoke(cl,className){
    /*

    var classResult = Java.use(className).class
    if(!className){
        return
    }
    var methodArr = classResult.getDeclaredConstructors()
    methodArr = methodArr.concat(classResult.getDeclaredMethods())
    console.log("           ****************************************************** methodArr constructors methods :" ,methodArr)
    */

    Java.perform(function(){
        try{
            var classResult = Java.use(className).class
            if(!className){
                return
            }
            var methodArr = classResult.getDeclaredConstructors()
            methodArr = methodArr.concat(classResult.getDeclaredMethods())
            console.log("********** " , className,"\t", methodArr.length," **********")
            for(var i = 0; i < methodArr.length; i++){
                var methodName = methodArr[i].toString()
                if(methodName.indexOf(TestFunction) >= -1){
                    if(methodName in dumpMethodName){
                        continue;

                    }
                    console.log("methodName: " , methodName)
                    //c++层调用
                    if(artMethod_invoke_replace){
                        //每次都会报错，但是没找到更方便的
                        dumpMethodName.push(methodName)
                        artMethod_invoke_replace(ptr(methodArr[i].getArtMethod()),ptr(0),ptr(0),6 ,invokeSize,invokeStr);
                    }
                }

            }

        }catch(e){

        }
    })
}
function artMethod_invoke_replace(){

}

setImmediate(hook_java)






































