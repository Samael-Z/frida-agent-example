

var ishook_libart = null
var addrGetCodeItemLength =null
var funcGetCodeItemLength = null
var addrBase64_encode = null
var funcBase64_encode = null
var addrFreeptr = null
var funcFreeptr = null
var addrLoadMethod = null
var savepath = "/data/data/com.zj.wuaipojie/file"
var nCount = 0

var dex_maps = {};
var artmethod_maps = {};

//函数区

function DexFile(start, size) {
    this.start = start;
    this.size = size;
}


function ArtMethod(dexfile, artmethodptr) {
    this.dexfile = dexfile;
    this.artmethodptr = artmethodptr;
}

//函数区
function hookart() {
    if (ishook_libart === true) {
        return;
    }
    var module_libext = null;
    if (Process.arch === "arm64") {
        module_libext = Module.load("/data/app/fart64.so");
    } else if (Process.arch === "arm") {
        module_libext = Module.load("/data/app/fart.so");
    }
    if (module_libext != null) {
        addrGetCodeItemLength = module_libext.findExportByName("GetCodeItemLength");
        funcGetCodeItemLength = new NativeFunction(addrGetCodeItemLength, "int", ["pointer"]);
        addrBase64_encode = module_libext.findExportByName("Base64_encode");
        funcBase64_encode = new NativeFunction(addrBase64_encode, "pointer", ["pointer", "int", "pointer"]);
        addrFreeptr = module_libext.findExportByName("Freeptr");
        funcFreeptr = new NativeFunction(addrFreeptr, "void", ["pointer"]);
    }
    /* test

    var encode_str = Memory.allocUtf8String("hello")
    var encode_length = 5
    var base64lengthptr = Memory.alloc(8);
    var strbase = funcBase64_encode(ptr(encode_str),encode_length,ptr(base64lengthptr))
    var b64content = ptr(strbase).readCString();
    console.log("base64 encode hello  = ", b64content)
    */
    var symbols = Module.enumerateSymbolsSync("libart.so");
    for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        if(symbol.name.indexOf("LoadMethod") >= 0 && symbol.name.indexOf("ArtMethod") >= 0){
            console.log(symbol.name);
        }
        //Android8 _ZN3art11ClassLinker10LoadMethodERKNS_7DexFileERKNS_21ClassDataItemIteratorENS_6HandleINS_6mirror5ClassEEEPNS_9ArtMethodE
        // if (symbol.name.indexOf("ClassLinker") >= 0
        //     && symbol.name.indexOf("LoadMethod") >= 0
        //     && symbol.name.indexOf("DexFile") >= 0
        //     && symbol.name.indexOf("ClassDataItemIterator") >= 0
        //     && symbol.name.indexOf("ArtMethod") >= 0) {
                
        //     addrLoadMethod = symbol.address;
        //     break;
        // }

        // Android12 _ZN3art11ClassLinker10LoadMethodERKNS_7DexFileERKNS_13ClassAccessor6MethodENS_6HandleINS_6mirror5ClassEEEPNS_9ArtMethodE
        if (symbol.name.indexOf("ClassLinker") >= 0
            && symbol.name.indexOf("LoadMethod") >= 0
            && symbol.name.indexOf("DexFile") >= 0
            && symbol.name.indexOf("ArtMethod") >= 0) {
                
            addrLoadMethod = symbol.address;
            
            break;
        }
    }

    //console.log("addrLoadMethod = ",addrLoadMethod)
    //spawn启动才会触发这个注入
    if (addrLoadMethod != null) {
        Interceptor.attach(addrLoadMethod, {
            onEnter: function (args) {
                this.dexfileptr = args[1];
                this.artmethodptr = args[4];
                
            },
            onLeave: function (retval) {
                var dexfilebegin = null;
                var dexfilesize = null;
                if (this.dexfileptr != null) {
                    //只有成员变量占用内存空间，函数不占用、如果有虚函数，虚表指针会占用一个指针字节大小
                    dexfilebegin = Memory.readPointer(ptr(this.dexfileptr).add(Process.pointerSize * 1));
                    dexfilesize = Memory.readU32(ptr(this.dexfileptr).add(Process.pointerSize * 2));
                    var dexfile_path = savepath + "/" + dexfilesize + "_loadMethod.dex";
                    var dexfile_handle = null;
                    
                    try {
                        //文件存在，关闭文件
                        dexfile_handle = new File(dexfile_path, "r");
                        if (dexfile_handle && dexfile_handle != null) {
                            dexfile_handle.close()
                        }

                    } catch (e) {
                        //文件不存在，读写模式打开文件，异常由文件不存在触发
                        dexfile_handle = new File(dexfile_path, "a+");
                        if (dexfile_handle && dexfile_handle != null) {
                            var dex_buffer = ptr(dexfilebegin).readByteArray(dexfilesize);
                            dexfile_handle.write(dex_buffer);
                            dexfile_handle.flush();
                            dexfile_handle.close();
                            console.log("[dumpdex]:", dexfile_path);
                        }
                    }
                }
                
                var dexfileobj = new DexFile(dexfilebegin, dexfilesize);
                if (dex_maps[dexfilebegin] == undefined) {
                    dex_maps[dexfilebegin] = dexfilesize;
                    console.log("got a dex:", dexfilebegin, dexfilesize);
                }
                if (this.artmethodptr != null) {
                    var artmethodobj = new ArtMethod(dexfileobj, this.artmethodptr);
                    if (artmethod_maps[this.artmethodptr] == undefined) {
                        artmethod_maps[this.artmethodptr] = artmethodobj;
                    }
                }
            }
        });
    }
    ishook_libart = true;
}
function dealwithClassLoader(classloaderobj) {
    if (classloaderobj.$className.toString().indexOf("java.lang.BootClassLoader") >= 0) {
        return
    }
    if (Java.available) {
        Java.perform(function () {
            try {
                var dexfileclass = Java.use("dalvik.system.DexFile");
                var BaseDexClassLoaderclass = Java.use("dalvik.system.BaseDexClassLoader");
                var DexPathListclass = Java.use("dalvik.system.DexPathList");
                var Elementclass = Java.use("dalvik.system.DexPathList$Element");
                var basedexclassloaderobj = Java.cast(classloaderobj, BaseDexClassLoaderclass);
                var pathlistobj = Java.cast(basedexclassloaderobj.pathList.value, DexPathListclass);
                
                for(var i = 0; i < pathlistobj.dexElements.value.length; i++){
                    var dexElementobj = Java.cast(pathlistobj.dexElements.value[i], Elementclass);
                    
                    if (dexElementobj.dexFile.value) {
                        var dexfileobj = Java.cast(dexElementobj.dexFile.value, dexfileclass);
                        const enumeratorClassNames = dexfileobj.entries();
                        
                        while (enumeratorClassNames.hasMoreElements()) {
                            var className = enumeratorClassNames.nextElement().toString();
                            console.log("start loadclass->", className);
                            var loadclass = classloaderobj.loadClass(className);
                            //console.log("after loadclass->", loadclass);

                        }

                    }
                    
                }
            } catch (e) {
                console.error(e)
            }

        });
    }


}

function fart() {
    if (Java.available) {
        Java.perform(function () {
            
         
            //上面是利用被动调用进行函数粒度的dump，对app正常运行过程中自己加载的所有类函数进行dump
            Java.enumerateClassLoaders({
                onMatch: function (loader) {
                    try {
                        console.log("startdealwithclassloader:", loader, '\n');
                        dealwithClassLoader(loader)
                    } catch (e) {
                        console.log("error", e);
                    }

                },
                onComplete: function () {
                    //console.log("find  Classloader instance over");
                }
            });
          
            //上面为对当前ClassLoader中的所有类进行主动加载，从而完成ArtMethod中的CodeItem的dump
        });
    }
}
function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    console.log("load " + path);
                }
            }
        }
    );
}
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

// 定义一个函数，用于重定向并修改maps文件内容，以隐藏特定的库和路径信息
function mapsRedirect() {
    // 定义伪造的maps文件路径
    var FakeMaps = "/data/data/org.samael.extrashell/maps";
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

function replace_str() {
    var pt_strstr = Module.findExportByName("libc.so", 'strstr');
    var pt_strcmp = Module.findExportByName("libc.so", 'strcmp');
 
    Interceptor.attach(pt_strstr, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("gdbus") !== -1 ||
                str2.indexOf("pool-frida") !== -1||
                str2.indexOf("linjector") !== -1) {
                //console.log("strcmp-->", str1, str2);
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
            if (str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("gdbus") !== -1 ||
                str2.indexOf("pool-frida") !== -1||
                str2.indexOf("linjector") !== -1) {
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


function main(){
   


}
setImmediate(main);


/*
class DexFile {



    vTabPtr sizeof(Pointer)


    const uint8_t* const begin_;

    const size_t size_;

    // The base address of the data section (same as Begin() for standard dex).
    const uint8_t* const data_begin_;

    // The size of the data section.
    const size_t data_size_;

    // Typically the dex file name when available, alternatively some identifying string.
    //
    // The ClassLinker will use this to match DexFiles the boot class
    // path to DexCache::GetLocation when loading from an image.
    const std::string location_;

    const uint32_t location_checksum_;

    // Points to the header section.
    const Header* const header_;
    const dex::StringId* const string_ids_;
    const dex::TypeId* const type_ids_;
    const dex::FieldId* const field_ids_;
    const dex::MethodId* const method_ids_;
    const dex::ProtoId* const proto_ids_;
    const dex::ClassDef* const class_defs_;
    const dex::MethodHandleItem* method_handles_;
    size_t num_method_handles_;
    const dex::CallSiteIdItem* call_site_ids_;
    size_t num_call_site_ids_;
    const dex::HiddenapiClassData* hiddenapi_class_data_;

    // If this dex file was loaded from an oat file, oat_dex_file_ contains a
    // pointer to the OatDexFile it was loaded from. Otherwise oat_dex_file_ is
    // null.
    mutable const OatDexFile* oat_dex_file_;

    // Manages the underlying memory allocation.
    std::unique_ptr<DexFileContainer> container_;

    // If the dex file is a compact dex file. If false then the dex file is a standard dex file.
    const bool is_compact_dex_;

    // The domain this dex file belongs to for hidden API access checks.
    // It is decleared `mutable` because the domain is assigned after the DexFile
    // has been created and can be changed later by the runtime.
    mutable hiddenapi::Domain hiddenapi_domain_;


};
*/