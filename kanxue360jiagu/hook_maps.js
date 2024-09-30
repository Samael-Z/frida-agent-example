/**
 * 多次打开maps文件，那么我们知道该文件包含了进程的内存映射信息，
 * 程序频繁读取是为了什么呢，其实猜测就是为了隐藏打开dex的操作，那么我们只需要重定向一下maps就可以了
 * hook open将打开open时如果存在扫描maps，就定向到自己的fakemaps。
 * 
*/

function hookopen(){

    var fakemaps = "/data/data/com.swdd.txjgtest/maps";
    var openPtr = Module.getExportByName(null,"open");
    const open = new NativeFunction(openPtr,"int",["pointer","int"]);
   // var readPtr = Module.getExportByName("libc.so","read");
    Interceptor.replace(openPtr,new NativeCallback(function(filenamePtr,flag){

        var fd = open(filenamePtr,flag);
        var fileName = filenamePtr.readCString();
        if(fileName.indexOf("maps") >= 0){
            console.warn("[warning]-> mapsReadirect success");
            var filename  = Memory.allocUtf8String(fakemaps);
            return open(filename,flag);
        }
        if(fileName.indexOf("dex") != -1){
            console.log("[opendex]-> ",fileName);

        }
        return fd;
    },'int',['pointer','int']))
}
function hook_dlopen(){

    Interceptor.attach(Module.getExportByName("libdl.so","android_dlopen_ext"),{

        onEnter:function(args){
            var loadFileName = args[0].readCString();
            if(loadFileName.indexOf("libjiagu") != -1){
                this.is_can_hook = true;
            }

        },onLeave:function(relval){
            if(this.is_can_hook){
                hookopen();
            }

        }

    })
}

setImmediate(hook_dlopen)
/**
 * 
 * Spawned `com.swdd.txjgtest`. Resuming main thread!
    [Pixel 4::com.swdd.txjgtest ]-> [warning]-> mapsReadirect success
    [warning]-> mapsReadirect success
    [warning]-> mapsReadirect success
    [warning]-> mapsReadirect success
    [warning]-> mapsReadirect success
    [warning]-> mapsReadirect success
    [warning]-> mapsReadirect success
    [opendex]->  /data/data/com.swdd.txjgtest/.jiagu/classes.dex
    [opendex]->  /data/data/com.swdd.txjgtest/.jiagu/classes2.dex
    [opendex]->  /data/data/com.swdd.txjgtest/.jiagu/classes3.dex
    Process crashed: Bad access due to invalid address

    ***
    *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
    Build fingerprint: 'google/flame/flame:10/QD1A.190821.011/5849216:user/release-keys'
    Revision: 'MP1.0'
    ABI: 'arm64'
    Timestamp: 2024-09-10 16:17:25+0800
    pid: 13857, tid: 13857, name: m.swdd.txjgtest  >>> com.swdd.txjgtest <<<
    uid: 10234
    signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x28
    Cause: null pointer dereference
        x0  0000000000000000  x1  00000071a4afe670  x2  0000000000000200  x3  00000071a388ec50
        x4  00000071a39d90c0  x5  0000007ff8c88812  x6  732e636f6162696c  x7  6f732e636f616269
        x8  0000000000000000  x9  0000000000000001  x10 0000000000004001  x11 0000000000000000
        x12 0000000000000009  x13 646e756f6620746f  x14 be41013c00000000  x15 6c2f6138762d3436
        x16 0000000000000000  x17 9ae16a3b2f90404f  x18 000000710df7261c  x19 0000000000000000
        x20 0000007ff8c89cd4  x21 00000071a357e680  x22 00000070b11b1523  x23 000000710df72360
        x24 00000071a375b020  x25 00000070b11fb000  x26 00000071a375b020  x27 00000070b11b1523
        x28 0000000000000000  x29 000000710ded0708
        sp  0000007ff8c89c50  lr  00000070b111dee8  pc  00000070b111def8

    backtrace:
        #00 pc 00000000000b2ef8  [anon:.bss]
    ***
    [Pixel 4::com.swdd.txjgtest ]->
*/