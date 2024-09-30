/*

跟到这个函数（__int64 sub_7BAC()），作者通过后缀被加了.so，猜测分段加了东西，猜测是linker另一个so
感觉有点草率
后作者认为，在自实现linker的时候，完成linker之后肯定是需要dlopen去加载这个so的，那么我们hook一下dlopen验证一下猜想
*/

function hook_android_dlopen_ext(){
    var android_dlopen_ext = Module.getExportByName("libdl.so","android_dlopen_ext")
    Interceptor.attach(android_dlopen_ext,{
        onEnter:function(args){
            console.warn("[android_dlopen_ext]-> ", args[0].readCString());

        },onLeave:function(){

        }
    })

}

function hook_dlopen(){

    var dlopen = Module.getExportByName("libdl.so","dlopen");
    Interceptor.attach(dlopen,{
        onEnter:function(args){
            console.log("[dlopen]-> " ,args[0].readCString())

        },onLeave:function(){

        }
    })



}
function main(){
    hook_dlopen()
    hook_android_dlopen_ext()
}
setImmediate(main)

/*
Spawned `com.swdd.txjgtest`. Resuming main thread!
[Pixel 4::com.swdd.txjgtest ]-> 
[android_dlopen_ext]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/oat/arm64/base.odex
[android_dlopen_ext]->  /data/data/com.swdd.txjgtest/.jiagu/libjiagu_64.so
[dlopen]->  liblog.so
[dlopen]->  libz.so
[dlopen]->  libc.so
[dlopen]->  libm.so
[dlopen]->  libstdc++.so
[dlopen]->  libdl.so
[dlopen]->  libjiagu_64.so
[dlopen]->  libjiagu_64.so
[dlopen]->  libart.so
[dlopen]->  libjiagu_64.so
[dlopen]->  libjiagu_64.so
[dlopen]->  libjiagu_64.so
[android_dlopen_ext]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/oat/arm64/base.odex
[dlopen]->  libjiagu_64.so
[dlopen]->  libjiagu_64.so
[dlopen]->  libjiagu_64.so
[android_dlopen_ext]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/lib/arm64/libjgdtc.so
[android_dlopen_ext]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/lib/arm64/libtxjgtest.so
[android_dlopen_ext]->  /vendor/lib64/hw/gralloc.msmnile.so
[dlopen]->  libEGL_adreno.so
[dlopen]->  libGLESv2_adreno.so
[dlopen]->  libGLESv1_CM_adreno.so
[android_dlopen_ext]->  /vendor/lib64/hw/android.hardware.graphics.mapper@3.0-impl-qti-display.so
[dlopen]->  libadreno_utils.so


作者说：流程说明了一切，直接实锤了自定义linker加固so，接下来要把另一个elf分离出来
自定义linker so加固的大部分思路其实就是分离出program header等内容进行单独加密，然后再link的时候补充soinfo

我没看出流程说明了自定义linker了哪个so，恕我愚钝
*/