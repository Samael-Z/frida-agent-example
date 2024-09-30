
//刚开始拿到这个ELF文件，无从下手，根据加固思路，先hook open函数，查看读取了哪些文件
function hookopen(){

    var openptr = Module.getExportByName(null,"open");
    const open = new NativeFunction(openptr,"int",['pointer','int'])
    Interceptor.replace(openptr,new NativeCallback(function(filenamePtr,flag)
    {
        var filename = filenamePtr.readCString();
        if(filename.indexOf("dex") != -1) {
            console.log("[open] [key:dex]-> " , filename);
        }
        console.log("[open]-> " , filename);

        return open(filenamePtr,flag);
    },"int",['pointer','int']))


}

function hook_dlopen(){

    Interceptor.attach(Module.getExportByName("libdl.so","android_dlopen_ext"),{
        onEnter :function(args){
            var loadFileName = args[0].readCString();
            if(loadFileName.indexOf("libjiagu") != -1){
                this.is_can_hook = true;
            }

        },onLeave:function(retval){
                if(this.is_can_hook){
                    hookopen();
                }
        }
    })
}
setImmediate(hook_dlopen)

/*

Spawned `com.swdd.txjgtest`. Resuming main thread!
[Pixel 4::com.swdd.txjgtest ]-> [open]->  /proc/self/maps
[open]->  /proc/self/maps
[open]->  /proc/self/maps
[open]->  /proc/self/maps
[open]->  /proc/self/maps
[open]->  /proc/self/maps
[open]->  /proc/self/maps
[open]->  /proc/self/maps
[open] [key:dex]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/oat/arm64/base.vdex
[open]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/oat/arm64/base.vdex
[open]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/base.apk
[open]->  /system/framework/arm64/boot.art
[open]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/base.apk
[open]->  /proc/self/cmdline
[open]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/lib/arm64/libjgdtc.so
[open]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/base.apk
[open]->  /system/lib64/libjgdtc.so
[open]->  /product/lib64/libjgdtc.so
[open]->  /apex/com.android.runtime/lib64/libjgdtc.so
[open]->  /vendor/lib64/libjgdtc.so
[open]->  /proc/self/cmdline
[open]->  /proc/10977/timerslack_ns
[open]->  /data/vendor/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/vendor/gpu/esx_config.txt
[open]->  /data/misc/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/misc/gpu/esx_config.txt
[open]->  /data/app/com.swdd.txjgtest-7JMUQ2n4niYcBiuTHNKseQ==/lib/arm64/libtxjgtest.so
[open]->  /data/vendor/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/vendor/gpu/esx_config.txt
[open]->  /data/misc/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/misc/gpu/esx_config.txt
[open]->  ./adreno_config.txt
[open]->  /data/vendor/gpu//adreno_config.txt
[open]->  /data/misc/gpu//adreno_config.txt
[open]->  ./yamato_panel.txt
[open]->  /data/vendor/gpu//yamato_panel.txt
[open]->  /data/misc/gpu//yamato_panel.txt
[open]->  /data/vendor/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/vendor/gpu/esx_config.txt
[open]->  /data/misc/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/misc/gpu/esx_config.txt
[open]->  /data/vendor/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/vendor/gpu/esx_config.txt
[open]->  /data/misc/gpu/esx_config_com.swdd.txjgtest.txt
[open]->  /data/misc/gpu/esx_config.txt
[open]->  /sys/devices/system/cpu/present
[open]->  /sys/devices/system/cpu/cpu0/cpu_capacity
[open]->  /sys/devices/system/cpu/cpu1/cpu_capacity
[open]->  /sys/devices/system/cpu/cpu2/cpu_capacity
[open]->  /sys/devices/system/cpu/cpu3/cpu_capacity
[open]->  /sys/devices/system/cpu/cpu4/cpu_capacity
[open]->  /sys/devices/system/cpu/cpu5/cpu_capacity
[open]->  /sys/devices/system/cpu/cpu6/cpu_capacity
[open]->  /sys/devices/system/cpu/cpu7/cpu_capacity
[open]->  /data/user_de/0/com.swdd.txjgtest/code_cache/com.android.skia.shaders_cache
[open]->  /data/user/0/com.swdd.txjgtest/files/profileinstaller_profileWrittenFor_lastUpdateTime.dat
[open]->  /data/user/0/com.swdd.txjgtest/files/profileInstalled

*/