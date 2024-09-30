/**
 * 
 * 确实使用了open去打开classed，并且实锤了是通过处理maps隐藏了内存映射
 * 
*/



function hookopen(){


    var fakemaps = "/data/data/com.swdd.txjgtest/files/maps";
    var openPtr = Module.getExportByName(null,"open");
    const open = new NativeFunction(openPtr,"int",["pointer","int"]);

    var readPtr = Module.getExportByName(null,"read")
    const read = new NativeFunction(readPtr,"int",["int","pointer","int"])
    var MapsBuffer = Memory.alloc(512)
    var mapsFile = new File(fakemaps,"w");

    Interceptor.replace(openPtr,new NativeCallback(function(fileNamePtr,flag){

            var fd = open(fileNamePtr,flag);
            var fileName = fileNamePtr.readCString();
            //console.warn("[fileName]->  ",fileName);
            if(fileName.indexOf("maps") >= 0){
                console.warn("[warning]-> mapsReadirect success");


                var mapsfilePath = Memory.allocUtf8String(fakemaps);
                //console.log('RegisterNatives called from:\n' + Thread.backtrace(this.context, Backtracer.FUZZY).map(DebugSymbol.fromAddress).join('\n') + '\n');
                return open(mapsfilePath,flag);
            }

            if(fileName.indexOf("dex") != -1){

                console.info("[opendex]-> " ,fileName);
                //打印open classes dex时候的调用栈信息，通过栈回溯可以看到so从哪个偏移处调用了open函数
                console.log('RegisterNatives called from:\n' + Thread.backtrace(this.context, Backtracer.FUZZY).map(DebugSymbol.fromAddress).join('\n') + '\n');
                
                //console.log("RegisterNative called from:\n" + Thread.backtrace(this.context,Backtracer.FUZZY).
                //map(DebugSymbol.fromAddress).join("\n") + "\n")
            }
            return fd;
    }, "int",["pointer","int"]));


}

function hook_dlopen(){
        Interceptor.attach(Module.getExportByName("libdl.so","android_dlopen_ext"),{

            onEnter:function(args){
                var loadfileName = args[0].readCString();

                if(loadfileName.indexOf("libjiagu") != -1){
                    this.is_can_hook = true;

                }


            },onLeave:function(){
                if(this.is_can_hook){ 

                    hookopen()
                   // console.info("[hookopen() ]-> " );   
                }
            }
        })
}


setImmediate(hook_dlopen)


/*
// 定义一个函数，用于重定向并修改maps文件内容，以隐藏特定的库和路径信息
function mapsRedirect() {
    // 定义伪造的maps文件路径
    var FakeMaps = "/data/data/com.zj.wuaipojie/maps";
    // 获取libc.so库中'open'函数的地址
    const openPtr = Module.getExportByName('libc.so', 'open');
    // 根据地址创建一个新的NativeFunction对象，表示原生的'open'函数
    const open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
    // 查找并获取libc.so库中'read'函数的地址
    var readPtr = Module.findExportByName("libc.so", "read");
    // 创建新的NativeFunction对象表示原生的'read'函数
    var read = new NativeFunction(readPtr, 'int', ['int', 'pointer', "int"]);
    // 分配512字节的内存空间，用于临时存储从maps文件读取的内容
    var MapsBuffer = Memory.alloc(512);
    // 创建一个伪造的maps文件，用于写入修改后的内容，模式为"w"（写入）
    var MapsFile = new File(FakeMaps, "w");
    // 使用Interceptor替换原有的'open'函数，注入自定义逻辑
    Interceptor.replace(openPtr, new NativeCallback(function(pathname, flag) {
        // 调用原始的'open'函数，并获取文件描述符（FD）
        var FD = open(pathname, flag);
        // 读取并打印尝试打开的文件路径
        var ch = pathname.readCString();
        if (ch.indexOf("/proc/") >= 0 && ch.indexOf("maps") >= 0) {
            console.log("open : ", pathname.readCString());
            // 循环读取maps内容，并写入伪造的maps文件中，同时进行字符串替换以隐藏特定信息
            while (parseInt(read(FD, MapsBuffer, 512)) !== 0) {
                var MBuffer = MapsBuffer.readCString();
                MBuffer = MBuffer.replaceAll("/data/local/tmp/re.frida.server/frida-agent-64.so", "FakingMaps");
                MBuffer = MBuffer.replaceAll("re.frida.server", "FakingMaps");
                MBuffer = MBuffer.replaceAll("frida-agent-64.so", "FakingMaps");
                MBuffer = MBuffer.replaceAll("frida-agent-32.so", "FakingMaps");
                MBuffer = MBuffer.replaceAll("frida", "FakingMaps");
                MBuffer = MBuffer.replaceAll("/data/local/tmp", "/data");
                // 将修改后的内容写入伪造的maps文件
                MapsFile.write(MBuffer);
            }
            // 为返回伪造maps文件的打开操作，分配UTF8编码的文件名字符串
            var filename = Memory.allocUtf8String(FakeMaps);
            // 返回打开伪造maps文件的文件描述符
            return open(filename, flag);
        }
        // 如果不是目标maps文件，则直接返回原open调用的结果
        return FD;
    }, 'int', ['pointer', 'int']));
}
*/