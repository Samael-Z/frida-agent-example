


var ishook_libart = null
var addrGetCodeItemLength =null
var funcGetCodeItemLength = null
var addrBase64_encode = null
var funcBase64_encode = null
var addrFreeptr = null
var funcFreeptr = null
var addrLoadMethod = null
var FakeMaps = "/data/data/com.X2uXsmr2f.k1MULKVZd/file"
var nCount = 0

/*


function replace_str() {
    var pt_strstr = Module.findExportByName("libc.so", 'strstr');
    var pt_strcmp = Module.findExportByName("libc.so", 'strcmp');
 
    Interceptor.attach(pt_strstr, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (
                str2.indexOf("REJECT") !== -1 ||
                str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("linjector") !== -1
            ) {
                if(str1.indexOf(str2)){
                    console.log("strstr-->", str1,"  ",  str2);


                    console.log('strstr called from FUZZY :\n' +
                        Thread.backtrace(this.context, Backtracer.FUZZY)
                        .map(DebugSymbol.fromAddress).join('\n') + '\n');
                        
                }
               
                this.hook = true;
            }
        }, onLeave: function (retval) {
            if (this.hook) {
                retval.replace(0);
            }
        }
    });
 
    Interceptor.attach(pt_strcmp, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (
                str2.indexOf("REJECT") !== -1 ||
                str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("linjector") !== -1
            ) {
                //console.log("strcmp-->", str1, str2);
                this.hook = true;
            }
        }, onLeave: function (retval) {
            if (this.hook) {
                retval.replace(0);
            }
        }
    })
 
}
function hook_libshell(){
    var shellary = Process.enumerateModules()
    for(var i = 0; i < shellary.length; i++){
        if(shellary[i].name.indexOf("libextrashell.so") != -1){
            console.log(shellary[i].addr)
            console.log(shellary[i].path)
        }
    }
   

}
function hook_open(){
    Interceptor.attach(Module.findExportByName(null, "fopen"), {
        onEnter: function (args) {
            var path = Memory.readUtf8String(args[0]);
            this.path = path;
            console.log("[fopen onEnter] path: " + path);
            if(path.indexOf("maps") != -1 || path.indexOf("task") != -1  || path.indexOf("stat") != -1  ){
                
                
            }
             
        },
        onLeave: function (retval) {

            if (retval != 0) {
                //console.log("[fopen onLeave] path: " + this.path);
    
            }
        }
    });

    Interceptor.attach(Module.findExportByName(null, "opendir"), {
        onEnter: function (args) {
            var path = Memory.readUtf8String(args[0]);
            this.path = path;
            console.log("[opendir onEnter] path: " + path);
           
        },
        onLeave: function (retval) {
            
            if (retval != 0) {
                //console.log("[opendir onLeave] path: " + this.path);
    
            }
        }
    });

    
}






*/

function main(){
    console.log("hello frida")
    hook_dlopen()
    replace_str()
    mapsRedirect()
}
setImmediate(hook_pthread)

// 定义一个函数，用于重定向并修改maps文件内容，以隐藏特定的库和路径信息
function mapsRedirect() {
    // 定义伪造的maps文件路径
    //var FakeMaps = "/data/data/org.samael.extrashell/maps";
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


        var fakemapsPath = "/data/data/com.X2uXsmr2f.k1MULKVZd/maps"


        // 读取并打印尝试打开的文件路径

        if (filename.indexOf("/proc/") >= 0 && filename.indexOf("maps") >= 0) {

            var fakemapsPathPtr = Memory.allocUtf8String(fakemapsPath);
            var fakeFd = open(fakemapsPathPtr, flag);
    
            // 如果不是目标maps文件，则直接返回原open调用的结果
            return fakeFd;
        }



        return open(filenamePtr,flag);
    },"int",['pointer','int']))


}

function hook_dlopen(){

    Interceptor.attach(Module.getExportByName("libdl.so","android_dlopen_ext"),{
        onEnter :function(args){
            var loadFileName = args[0].readCString();

            
            console.log("[LOAD]", loadFileName)
            if(loadFileName.indexOf("libAppGuard") != -1){
                this.is_can_hook = true;
            }

        },onLeave:function(retval){
                if(this.is_can_hook){
                    //hookopen();
                }
        }
    })
}

function hook_oepns() {
    const openPtr = Module.getExportByName('libc.so', 'open');
    const open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
    var readPtr = Module.findExportByName("libc.so", "read");
    var read = new NativeFunction(readPtr, 'int', ['int', 'pointer', "int"]);
    var fakePath = "//data/data/com.X2uXsmr2f.k1MULKVZd/maps";
    var file = new File(fakePath, "w");
    var buffer = Memory.alloc(512);
    Interceptor.replace(openPtr, new NativeCallback(function (pathnameptr, flag) {
        var pathname = Memory.readUtf8String(pathnameptr);
        var realFd = open(pathnameptr, flag);
        if (pathname.indexOf("maps") >= 0) {
            while (parseInt(read(realFd, buffer, 512)) !== 0) {
                var oneLine = Memory.readCString(buffer);
                if (oneLine.indexOf("tmp") === -1) {
                    file.write(oneLine);
                }
            }
            var filename = Memory.allocUtf8String(fakePath);
            return open(filename, flag);
        }
        var fd = open(pathnameptr, flag);
        return fd;
    }, 'int', ['pointer', 'int']));
  }
  function hook_pthread(){
        var interceptor = Interceptor.attach(Module.findExportByName(null, "pthread_create"),
        {
            onEnter: function (args) {
                var module = Process.findModuleByAddress(ptr(this.returnAddress))
                if (module != null) {
                    console.log("[pthread_create] called from", module.name, module.path)
                }
                else {
                    console.log("[pthread_create] called from", ptr(this.returnAddress))
                }
            },
        }
    )
  }

