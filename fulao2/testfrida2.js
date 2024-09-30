
function create_fake_pthread_create() {
    const fake_pthread_create = Memory.alloc(4096)
    Memory.protect(fake_pthread_create, 4096, "rwx")
    Memory.patchCode(fake_pthread_create, 4096, code => {
        const cw = new Arm64Writer(code, { pc: ptr(fake_pthread_create) })
        cw.putRet()
    })
    return fake_pthread_create
}
// 创建虚假pthread_create
var fake_pthread_create = create_fake_pthread_create()

function hook_dlsym() {
    var count = 0
    console.log("=== HOOKING dlsym ===")
    var interceptor = Interceptor.attach(Module.findExportByName(null, "dlsym"),
        {
            onEnter: function (args) {
                const name = ptr(args[1]).readCString()
                console.log("[dlsym]", name)
                if (name == "pthread_create") {
                    count++
                }
            },
            onLeave: function(retval) {
                if (count == 1) {
                    retval.replace(fake_pthread_create)
                }
                else if (count == 2) {
                    retval.replace(fake_pthread_create)
                    // 完成2次替换, 停止hook dlsym
                    interceptor.detach()
                }
            }
        }
    )
    return Interceptor
}
 
function hook_dlopen() {
    var interceptor = Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    console.log("[LOAD]", path)
                    if (path.indexOf("libappsec.so") > -1) {
                        hook_dlsym()
                    }
                }
            }
        }
    )
    return interceptor
}

function main(){

 

var dlopen_interceptor = hook_dlopen()

}
setImmediate(hook_dlopen)



/*
Connected to 127.0.0.1:12345 (id=socket@127.0.0.1:12345)
Spawned `com.X2uXsmr2f.k1MULKVZd`. Resuming main thread!
[Remote::com.X2uXsmr2f.k1MULKVZd ]-> [LOAD] /data/app/~~CaIMqdqt5XOPv7-hHMWWhA==/com.X2uXsmr2f.k1MULKVZd--ZHWlE1Pjk9MX35QugLxmA==/oat/x86/base.odex
[LOAD] /data/app/~~CaIMqdqt5XOPv7-hHMWWhA==/com.X2uXsmr2f.k1MULKVZd--ZHWlE1Pjk9MX35QugLxmA==/lib/arm/libAppGuard-x86.so
[LOAD] libframework-connectivity-jni.so
[LOAD] /data/app/~~CaIMqdqt5XOPv7-hHMWWhA==/com.X2uXsmr2f.k1MULKVZd--ZHWlE1Pjk9MX35QugLxmA==/lib/arm/libappsec.so
[LOAD] /system/lib/arm/nb/libtcb.so
*/