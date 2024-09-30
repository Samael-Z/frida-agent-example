var enable_deep_search = false;
//var globalId = null;//计时器Id
var globalDexs = null;
var classArr = [];//从dex里面获取的类名
var dumpMethodName = [];//每个类里面的方法
var ArtMethod_invoke_replace = null;//保存ArtMethod_invoke
var DexBase = null;
var DexSize = null;
var globalStartTime = null;//记录每次的开始时间
var globalCurTime = null;//当前时间
var globalDexIndex = 0;
var globalPrvDexIndex = -1;
var globalClassIndex = 0;
var globalPrvClassIndex = -1;
var globalMethodIndex = 0;
const EXEC_TIME = 3000;//Exec 函数执行 3 秒后,开始下一次执行
var globalSumMethodCount = 0;//所有函数的总数
const PRINT_DEX_INDEX = true;
const PRINT_DEX_INFO = true;
const PRINT_CLASSARR_LEN = true;
const PRINT_OTHER_INFO = true;
var globalFinished = false;
var globalTimeoutId = null;
var globaCurClassName = null;
var globalStepClassNams = [];

globalTimeoutId = setTimeout(Exec2,0); 

function Exec2(){
    
    if (globalFinished && globalTimeoutId!=null) {
        clearTimeout(globalTimeoutId);
    } else {
        
        Exec();
        globalTimeoutId = setTimeout(Exec2,0); 
    }

}

function Exec() {

    globalStartTime = new Date().getTime();
    if (globalDexs != null) {

        outer:
        for (;globalDexIndex < globalDexs.length; globalDexIndex++) {

            if (PRINT_OTHER_INFO) {
                console.log("├─globalDexIndex:", globalDexIndex);    
            }
            
            //如果开始分析下一个 dex 就重新填充 classArr
            if (globalDexIndex != globalPrvDexIndex) {
                initClassArr(globalDexs[globalDexIndex].addr,globalDexs[globalDexIndex].size);
                globalPrvDexIndex = globalDexIndex;
                globalClassIndex = 0;
                globalPrvClassIndex = -1;
            }

            //遍历每个 dex 里面的 class
            for (;globalClassIndex < classArr.length;globalClassIndex++) {
                
                if (PRINT_OTHER_INFO) {
                    console.log("│  ├─globalClassIndex:", globalClassIndex, " name:", classArr[globalClassIndex]);    
                }

                //如果开始分析下一个 class 就重新填充 dumpMethodName
                if (globalClassIndex != globalPrvClassIndex) {
                    //InitdumpMethodName(classArr[globalClassIndex]);
                    globaCurClassName = classArr[globalClassIndex];
                    Java.perform(InitdumpMethodName);
                    globalPrvClassIndex = globalClassIndex;
                    globalMethodIndex = 0;
                }

                for (;globalMethodIndex < dumpMethodName.length; globalMethodIndex++) {
                    if (PRINT_OTHER_INFO) {
                        console.log("│  │  ├─globalMethodIndex:", globalMethodIndex, " name:",dumpMethodName[globalMethodIndex]);    
                    }
                    //PrintMethodName();
                    globalSumMethodCount++;
                    globalCurTime = new Date().getTime();

                    //如果运行超过3秒就结束
                    if ((globalCurTime - globalStartTime)>EXEC_TIME) {
                        console.log("Time reached, start another loop...");
                        globalMethodIndex++;
                        break outer;
                    }
                }

            }
        
        }

        if (globalDexIndex >= globalDexs.length) {
            console.log(globalSumMethodCount,"Method Exec Finished!");
            globalFinished = true;
        } 
    
    } else {
        globalDexs = scandex();
        if (globalDexs != null) {console.log("~~~~~~~  Dex Count: ", globalDexs.length, " ~~~~~~");}
    }

}

function PrintMethodName() {
    console.log(dumpMethodName[globalMethodIndex]);
}

function verify_by_maps(dexptr, mapsptr) {
    var maps_offset = dexptr.add(0x34).readUInt();
    var maps_size = mapsptr.readUInt();
    for (var i = 0; i < maps_size; i++) {
        var item_type = mapsptr.add(4 + i * 0xC).readU16();
        if (item_type === 4096) {
            var map_offset = mapsptr.add(4 + i * 0xC + 8).readUInt();
            if (maps_offset === map_offset) {
                return true;
            }
        }
    }
    return false;
}

function verify(dexptr, range, enable_verify_maps) {

    if (range != null) {
        var range_end = range.base.add(range.size);
        // verify header_size
        if (dexptr.add(0x70) > range_end) {
            return false;
        }

        // verify file_size
        var dex_size = dexptr.add(0x20).readUInt();
        if (dexptr.add(dex_size) > range_end) {
            return false;
        }

        if (enable_verify_maps) {
            var maps_offset = dexptr.add(0x34).readUInt();
            if (maps_offset === 0) {
                return false
            }

            var maps_address = dexptr.add(maps_offset);
            if (maps_address > range_end) {
                return false
            }

            var maps_size = maps_address.readUInt();
            if (maps_size < 2 || maps_size > 50) {
                return false
            }
            var maps_end = maps_address.add(maps_size * 0xC + 4);
            if (maps_end < range.base || maps_end > range_end) {
                return false
            }
            return verify_by_maps(dexptr, maps_address)
        } else {
            return dexptr.add(0x3C).readUInt() === 0x70;
        }
    }


}

function dumpFile(name, base, size) {
	var file_path = "/sdcard/" + name + "_" + base + "_" + ptr(size) + ".dump";
    var file_handle = new File(file_path, "wb");
    if (file_handle && file_handle != null) {
        Memory.protect(ptr(base), size, 'rwx');
        var libso_buffer = ptr(base).readByteArray(size);
        file_handle.write(libso_buffer);
        file_handle.flush();
        file_handle.close();
        console.log("[dump]:", file_path);
    }
}

function scandex() {
    var result = [];
    Process.enumerateRanges('r--').forEach(function (range) {
        try {
            Memory.scanSync(range.base, range.size, "64 65 78 0a 30 ?? ?? 00").forEach(function (match) {

                if (range.file && range.file.path
                    && (// range.file.path.startsWith("/data/app/") ||
                        range.file.path.startsWith("/data/dalvik-cache/") ||
                        range.file.path.startsWith("/system/"))) {
                    return;
                }

                if (verify(match.address, range, false)) {
                    var dex_size = match.address.add(0x20).readUInt();
                    result.push({
                        "addr": match.address,
                        "size": dex_size
                    });
                }
            });

            if (enable_deep_search) {
                Memory.scanSync(range.base, range.size, "70 00 00 00").forEach(function (match) {
                    var dex_base = match.address.sub(0x3C);
                    if (dex_base < range.base) {
                        return
                    }
                    if (dex_base.readCString(4) != "dex\n" && verify(dex_base, range, true)) {
                        var dex_size = dex_base.add(0x20).readUInt();
                        result.push({
                            "addr": dex_base,
                            "size": dex_size
                        });
                    }
                })
            } else {
                if (range.base.readCString(4) != "dex\n" && verify(range.base, range, true)) {
                    var dex_size = range.base.add(0x20).readUInt();
                    result.push({
                        "addr": range.base,
                        "size": dex_size
                    });
                }
            }

        } catch (e) {
        }
    });

    return result;
}

function HookArtInvoke() {
		var libart = Process.findModuleByName("libart.so");
		var symbols = libart.enumerateSymbols();
		var symbol_name = null;
		var addr_ArtMethod_invoke = null;
		for(var index=0; index < symbols.length; index++) {
			var symbol = symbols[index];
        	var symbol_name = symbol.name;
			if (symbol_name.indexOf("_ZN3art9ArtMethod6InvokeEPNS_6ThreadEPjjPNS_6JValueEPKc") >= 0 ) {
	            addr_ArtMethod_invoke = symbol.address;
	            console.log("addr_ArtMethod_invoke:",addr_ArtMethod_invoke);
	            var addr_ArtMethod_invoke_replace = addr_ArtMethod_invoke;
		        ArtMethod_invoke_replace = new NativeFunction(
			        addr_ArtMethod_invoke_replace, 'void', ['pointer', 'pointer', 'pointer', 'uint32', 'pointer','pointer']
		        ); 
		        //console.log(ArtMethod_invoke_replace);
	    		Interceptor.attach(addr_ArtMethod_invoke, {
		        	onEnter: function (args) {
		            try {
		            	//console.log("DexBase is :",DexBase);
		            	//console.log(222);
		             
		                return;
		         
		      
		            } catch (error) {
		                console.log(error);
		            }

			        }, onLeave: function (retval) {
			        
			        }
			    });

			}
		}
}


function initClassArr(base, size){
    if (PRINT_DEX_INDEX) {
        console.log("****** Dex: ", globalDexIndex, " ******");
    }
    
    classArr = [];

    if (PRINT_DEX_INFO) {
        console.log("├─ base:",base,"\tsize:",size.toString(16));
    }

    DexBase = base;
    DexSize = size;
    //dump_dex("init.dex");
    // console.log("DexBase:",hexdump(base));
    var string_ids_size = DexBase.add(0x38).readU32();
    var string_ids_off = DexBase.add(0x3c).readU32();

    if (PRINT_DEX_INFO) {
        console.log("├─ uint string_ids_size:",string_ids_size); //.toString(16)
        console.log("├─ uint string_ids_off:",string_ids_off);
    }

    var type_ids_size = ptr(DexBase).add(0x40).readU32();
    var type_ids_off = ptr(DexBase).add(0x44).readU32();

    if (PRINT_DEX_INFO) {
        console.log("├─ uint type_ids_size:",type_ids_size);
        console.log("├─ uint type_ids_off:",type_ids_off);
    }

    var class_idx = ptr(DexBase).add(0x60).readU32();
    var class_defs_off = ptr(DexBase).add(0x64).readU32();
    if (PRINT_DEX_INFO) {
        console.log("├─ uint class_idx:",class_idx);
        console.log("├─ uint class_defs_off:",class_defs_off);
    }

    // var offsetStrEnd = DexBase.add(type_ids_off);
    // 有些str会超出
    // console.log("offsetStrEnd:",offsetStrEnd);
    for(var i=0; i<class_idx; i++){
        var offsetClass = DexBase.add(class_defs_off+i*0x20);
        // console.log("offsetClass:",offsetClass);
        var type_idx = offsetClass.readU32();
        // console.log("type_idx:",type_idx);
        var descriptor_idx = DexBase.add(type_ids_off+type_idx*0x4).readU32();
        // console.log("descriptor_idx:",descriptor_idx);
        var offsetStr = DexBase.add(string_ids_off + descriptor_idx*4).readU32();
        // console.log("offsetStr:",offsetStr);
        if(offsetStr > size){
            console.log("offsetStr > size:",offsetStr,">",size);
            break;
        }
        var addrStr =  DexBase.add(offsetStr);
        // console.log("addrStr:", hexdump(addrStr));
        // console.log("addrStr.readU32:",);
        var classNameLen =  addrStr.readU8();
        if(classNameLen > 0x7f){
            //这里类名都没超过0x7F
            console.log("ClassName Len > 0x7f:",addrStr);
            var lebdtl = DecodeUnsignedLeb128(addrStr);
            addrStr = addrStr.add(lebdtl[1]);
        }else{
            addrStr = addrStr.add(1);
        }
        // console.log("addrStr:",addrStr);
        // 读utf16有错误
        // var str = addrStr.readUtf16String();
        var str = addrStr.readUtf8String();
        // console.log(i,":", str);
        // console.log(hexdump(addrStr));
        // break;
        str = str.replace(/L([^;]+);/,"$1").replace(/\//g,'.');
        //console.log(i,":",str);
        classArr.push(str);
    }
    if (PRINT_CLASSARR_LEN) {
        console.log("------classArr.length:",classArr.length,"------");
    }    
}

function hook_java(){
    console.log("--------------------Start Invoke:",new Date().getTime());
    
    for(var i=0; i<classArr.length; i++ ){
        //console.log("class:",classArr[i]);
        loadClassAndInvoke(classArr[i]);
    }    
    console.log("--------------------End Invoke:",new Date().getTime());
}


function InitdumpMethodName() {
    try {
        var className = globaCurClassName;
        if (className in globalStepClassNams) {
            console.log("Step class :", className);
        }
        var classResult = Java.use(className).class;
        if(!classResult) return;

        var methodArr = classResult.getDeclaredConstructors();
        methodArr = methodArr.concat(classResult.getDeclaredMethods());
        
        dumpMethodName = [];
        for(var i=0;i<methodArr.length;i++){
            var  methodName = methodArr[i].toString();
            dumpMethodName.push(methodName);
        } 
        if (PRINT_OTHER_INFO) {
            console.log("│  │  ├─Method Count:",methodArr.length);
        }
    } catch (error) { 
        console.log("InitdumpMethodName error:[",className,"]",error);
    }
}

function loadClassAndInvokeEx() {
    Java.perform(function(){
        try {
            var classResult = Java.use(className).class;
            if(!classResult) return;

            var methodArr = classResult.getDeclaredConstructors();
            methodArr = methodArr.concat(classResult.getDeclaredMethods());
            
            dumpMethodName = [];
            
            for(var i=0;i<methodArr.length;i++){
                var  methodName = methodArr[i].toString();
                
                //如果已经存进去了就跳过
                if(methodName in dumpMethodName){
                    continue;
                }
                // console.log("methodName:",methodName);
                // c++层调用
                if(ArtMethod_invoke_replace){
                    //每次都会报错,但是我还没找到更方便的
                    try{
                        dumpMethodName.push(methodName);
                        // console.log("getArtMethod:", hexdump(ptr(methodArr[i].getArtMethod())));
                        
                        //console.log("invoking Class " + " :" + classArr[globalClassCount] + " ~" 
                          //  + globalFunCount + ":" + methodName);
                        
                        //ArtMethod_invoke_replace(ptr(methodArr[i].getArtMethod()), ptr(0), ptr(0), 6, invokeSize, invokeStr);
                        console.log("invok finished!");
                    } catch(error){
                        console.log("invok Error!");
                        // console.log("ArtMethod_invoke error:[",className,"]",error);
                    }
                }
            }
        } catch (error) { 
            console.log("loadClassAndInvoke error:[",className,"]",error);
        }
    });
}



