

function hook_dlopen(){


    Interceptor.attach(Module.getExportByName("libdl.so","dlopen"),{
        onEnter: function(args){

            console.log("Load -> ",args[0].readCString());

        },onLeave : function(retval){

        }
    })


}
setImmediate(hook_dlopen)
/*


function hook_dlopne() {
    Interceptor.attach(Module.findExportByName("libdl.so", "android_dlopen_ext"), {
        onEnter: function (args) {
            console.log("Load -> ", args[0].readCString());
        }, onLeave: function () {
 
        }
    })
}
 
setImmediate(hook_dlopne);
*/



/*
hook android_dlopen_ext
Spawned `com.swdd.txjgtest`. Resuming main thread!
[Pixel 4::com.swdd.txjgtest ]-> 
Load ->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/oat/arm64/base.odex
Load ->  /data/data/com.swdd.txjgtest/.jiagu/libjiagu_64.so
Load ->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/oat/arm64/base.odex
Load ->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/lib/arm64/libjgdtc.so
Load ->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/lib/arm64/libtxjgtest.so
Load ->  /vendor/lib64/hw/gralloc.msmnile.so
Load ->  /vendor/lib64/hw/android.hardware.graphics.mapper@3.0-impl-qti-display.so


hook dlopen
Spawned `com.swdd.txjgtest`. Resuming main thread!
[Pixel 4::com.swdd.txjgtest ]-> 
Load ->  liblog.so
Load ->  libz.so
Load ->  libc.so
Load ->  libm.so
Load ->  libstdc++.so
Load ->  libdl.so
Load ->  libjiagu_64.so
Load ->  libjiagu_64.so
Load ->  libart.so
Load ->  libjiagu_64.so
Load ->  libjiagu_64.so
Load ->  libjiagu_64.so
Load ->  libjiagu_64.so
Load ->  libjiagu_64.so
Load ->  libjiagu_64.so
Load ->  libEGL_adreno.so
Load ->  libGLESv2_adreno.so
Load ->  libGLESv1_CM_adreno.so
Load ->  libadreno_utils.so

*/