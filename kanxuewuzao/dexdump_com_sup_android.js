var FunMethod_invoke = null;
var ArtMethod_invoke_replace = null;
var DexBase = null;
var DexSize = null;
var TestCalss = "com.sup.android.superb.SplashActivity"; //.android.base
var TestFunction = "com.sup.android.superb.SplashActivity";//.android.MainActivity .app.e.b(android.content.Context)
var sizePointer = 8; //64位的,这里是8
// console.log("Process.pointerSize:",sizePointer);
var sizeU32 = 4;
// if(sizePointer == 16){
//     sizeU32 = sizePointer / 2;
// }
var sizeShort = 2;

var addr_fopen = Module.findExportByName("libc.so", "fopen");
var addr_fputs = Module.findExportByName("libc.so", "fputs");
var addr_fclose = Module.findExportByName("libc.so", "fclose");

var fopen = new NativeFunction(addr_fopen, "pointer", ["pointer", "pointer"]);
var fputs = new NativeFunction(addr_fputs, "int", ["pointer", "pointer"]);
var fclose = new NativeFunction(addr_fclose, "int", ["pointer"]);

var fileName = Memory.allocUtf8String("/sdcard/Test.bin"); //= Memory.allocUtf8String(filename);
var openName = Memory.allocUtf8String("a+");


var invokeSize = Memory.alloc(0x10).writeU32(6);
var invokeStr = Memory.alloc(0x100).writeUtf8String("fart");
var allocPrettyMethod = Memory.alloc(0x100);
var allocPrettyMethodInit = []

var dumpMethodNameInvoke = []
var dumpMethodName = []
for(var i=0;i<0x100;i++){
    allocPrettyMethodInit[i] = 0x0
}

var classArr = []

function hook_java(){
    console.log("--------------------Start Invoke:",new Date().getTime());
    for(var i=0; i<classArr.length; i++ ){
        if(classArr[i].indexOf(TestCalss) >= 0){
            console.log("class:",classArr[i]);
            loadClassAndInvoke(classArr[i]);
        }
    }
    console.log("--------------------End Invoke:",new Date().getTime());
    dump_dex("fixed.dex");
}

function loadClassAndInvoke(className) {
    Java.perform(function(){
        try {
            var classResult = Java.use(className).class;
            if(!classResult) return;

            var methodArr = classResult.getDeclaredConstructors();
            methodArr = methodArr.concat(classResult.getDeclaredMethods());

            console.log(className,"\t",methodArr.length);
            for(var i=0;i<methodArr.length;i++){
                var  methodName = methodArr[i].toString();
                if(methodName.indexOf(TestFunction) > -1){
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
                            ArtMethod_invoke_replace(ptr(methodArr[i].getArtMethod()), ptr(0), ptr(0), 6, invokeSize, invokeStr);
                        } catch(error){
                            // console.log("ArtMethod_invoke error:[",className,"]",error);
                        }
                    }
                }
            }
        } catch (error) { 
            console.log("loadClassAndInvoke error:[",className,"]",error);
        }
    });
}

function dump_dex(dexname){
    if(DexBase){
        if(dexname == ""){
            dexname = "dump.dex";
        }
        var dex_path = "/sdcard/"+dexname;
        var fd = new File(dex_path, "wb");
        if (fd && fd != null) {
            var dex_buffer = ptr(DexBase).readByteArray(DexSize);
            fd.write(dex_buffer);
            fd.flush();
            fd.close();
            console.log("[dump dex]:", dex_path);
        }
    }
}

function hook_native() {
    var addr_Method_invoke = null;
    var addr_ArtMethod_invoke = null;
    var addr_ArtMethod_PrettyMethod = null;
    var addr_ClassLinker_DefineClass = null;

    var libart = Process.findModuleByName("libart.so");
    var symbols = libart.enumerateSymbols();
    console.log("libart.so enumerateSymbols length:", symbols.length);
    var ClassLinker_DefineClass_SymbolName = "_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS9_8ClassDefE";
    if (Process.arch === "arm"){
        ClassLinker_DefineClass_SymbolName = "_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcjNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS9_8ClassDefE";
    }
    for(var index=0; index < symbols.length; index++) {
        //这里直接Android8.0写死的，可以自己看着改
        var symbol = symbols[index];
        var symbol_name = symbol.name;
        // console.log(symbol_name);
        if (symbol_name.indexOf("_ZN3artL13Method_invokeEP7_JNIEnvP8_jobjectS3_S3_") >= 0 ) {
            addr_Method_invoke = symbol.address;
            console.log("addr_Method_invoke:",addr_Method_invoke);
        }

        if (symbol_name.indexOf("_ZN3art9ArtMethod6InvokeEPNS_6ThreadEPjjPNS_6JValueEPKc") >= 0 ) {
            addr_ArtMethod_invoke = symbol.address;
            console.log("addr_ArtMethod_invoke:",addr_ArtMethod_invoke);
        }

        if (symbol_name.indexOf("_ZN3art9ArtMethod12PrettyMethodEb") >= 0 ) {
            addr_ArtMethod_PrettyMethod = symbol.address;
            console.log("addr_ArtMethod_PrettyMethod:",addr_ArtMethod_PrettyMethod);
        }

        if (symbol_name.indexOf(ClassLinker_DefineClass_SymbolName) >= 0 ) {
            addr_ClassLinker_DefineClass = symbol.address;
            console.log("addr_ClassLinker_DefineClass:",addr_ClassLinker_DefineClass);
        }
        if (symbol.name.indexOf("ClassLinker") >= 0
        && symbol.name.indexOf("DefineClass") >= 0
        && symbol.name.indexOf("ClassLoader") >= 0
        && symbol.name.indexOf("DexFile") >= 0) {
            
            addr_ClassLinker_DefineClass = symbol.address;
            console.log("addr_ClassLinker_DefineClass:",addr_ClassLinker_DefineClass);

        }
        
    }


    
    Interceptor.attach(addr_ClassLinker_DefineClass, {
        onEnter: function(args){
            if(DexBase) {
                //找到就不运行下面了
                return;
            }
            var dex_file = args[5];
            var base = ptr(dex_file).add(Process.pointerSize).readPointer();
            var size = ptr(dex_file).add(Process.pointerSize *2).readUInt();
            if(size > 0x880000 && size < 0x890000){
                console.log("base:",base,"\tsize:",size.toString(16));
                DexBase = base;
                DexSize = size;
                dump_dex("init.dex");
                // console.log("DexBase:",hexdump(base));
                var string_ids_size = DexBase.add(0x38).readU32();
                var string_ids_off = DexBase.add(0x3c).readU32();
                console.log("uint string_ids_size:",string_ids_size); //.toString(16)
                console.log("uint string_ids_off:",string_ids_off);

                var type_ids_size = ptr(DexBase).add(0x40).readU32();
                var type_ids_off = ptr(DexBase).add(0x44).readU32();
                console.log("uint type_ids_size:",type_ids_size);
                console.log("uint type_ids_off:",type_ids_off);
                
                var class_idx = ptr(DexBase).add(0x60).readU32();
                var class_defs_off = ptr(DexBase).add(0x64).readU32();
                console.log("uint class_idx:",class_idx);
                console.log("uint class_defs_off:",class_defs_off);
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
                    classArr.push(str);
                }
                console.log("classArr.length:",classArr.length);
                // hook_java();
            }
        },
        onLeave: function(retval) {
        }
    });

    var module_libext = null;
    // 获取ArtMethod Name
    if (Process.arch === "arm64") {
        module_libext = Module.load("/data/app/libext64.so");
    } else if (Process.arch === "arm") {
        module_libext = Module.load("/data/app/libext.so");
    }
    console.log("module_libext:",module_libext);
    if (module_libext != null) {
        var addr_PrettyMethod = module_libext.findExportByName("PrettyMethod");
        var PrettyMethod = new NativeFunction(addr_PrettyMethod, "void", ["pointer", "pointer", "pointer", "int"]);

        var addr_ArtMethod_invoke_replace = addr_ArtMethod_invoke;
        ArtMethod_invoke_replace = new NativeFunction(addr_ArtMethod_invoke_replace, 'void', ['pointer', 'pointer', 'pointer', 'uint32', 'pointer','pointer']); //'pointer',

       
        console.log("Interceptor.attach(addr_ArtMethod_invoke");
        Interceptor.attach(addr_ArtMethod_invoke, {
            onEnter: function (args) {
                try {
                    //这里就不进行hook,上面主动调用会使Dex全部恢复
                    return;
                    if(args[1].toString() != "0x0" ){
                        // console.log("args[1]:",args[1].toString());
                        return;
                    }
                    
                 
                    allocPrettyMethod.writeByteArray(allocPrettyMethodInit);
                    PrettyMethod(addr_ArtMethod_PrettyMethod, args[0], allocPrettyMethod, 0x100);
                    
                    var methodName = allocPrettyMethod.readCString();
                    if(methodName in dumpMethodNameInvoke){
                        return;
                    }
                    if(methodName.indexOf(TestFunction) > -1){
                        // console.log("addr_ArtMethod_invoke:",allocPrettyMethod.readCString());
                        
                        // console.log("args[0]:", args[0]);
                        // console.log("args[0]:",hexdump( args[0]));
                        var dex_code_item_offset_ = args[0].add(sizeU32*2).readU32();
                        var dex_method_index_ = args[0].add(sizeU32*3).readU32();
                        if(dex_code_item_offset_ <= 0){
                            //com.aipao.hanmoveschool.activity.StepDetector$OnSensorChangeListener.onChange 这个是0
                            console.log("dex_code_item_offset_ error:",dex_code_item_offset_);
                            return;
                        }
                        // console.log("dex_code_item_offset_:",dex_code_item_offset_.toString(16));
                        // console.log("dex_method_index_:",dex_method_index_.toString(16));
                        if(DexBase){
                            var addrCodeOffset = DexBase.add(dex_code_item_offset_);
                            // console.log("addrCodeOffset:",hexdump(addrCodeOffset));
                            var tries_size = addrCodeOffset.add(sizeShort*3).readU16(); 
                            var insns_size = addrCodeOffset.add(sizeU32*3).readU16(); 
                            if(tries_size > 256){
                                console.log("tries_size:",tries_size.toString(16));
                                console.log("insns_size:",insns_size.toString(16));
                                return;
                            }
                            // console.log("tries_size:",tries_size.toString(16));
                            // console.log("insns_size:",insns_size.toString(16));
                            var codeLen = 16 + insns_size*2;
                            if(tries_size > 0){
                                var addrTryStart = addrCodeOffset.add(codeLen);
                                // if(addrTryStart.readU16() == 0){ //padding
                                //     addrTryStart = addrTryStart.add(0x2);
                                // }
                                if(codeLen %4 != 0){ //padding
                                    addrTryStart = addrTryStart.add(0x2);
                                }
                                // console.log("addrTryStart:",hexdump(addrTryStart));
                                var addrTryEnd = addrTryStart.add(sizePointer*tries_size);
                                var addrCodeEnd = CodeItemEnd(addrTryEnd);
                                codeLen = addrCodeEnd - addrCodeOffset;
                            }
                            var allins = "";
                            for(var i=0;i<codeLen;i++){
                                var u8data = addrCodeOffset.add(i).readU8();
                                if(u8data <= 0xF){
                                    allins += "0";
                                }
                                allins += u8data.toString(16);
                            }
                            var codedtl = "{name:"+methodName+
                                ",method_idx:"+dex_method_index_+
                                ",offset:"+dex_code_item_offset_+
                                ",code_item_len:"+codeLen+
                                ",ins:"+allins+
                            "};";
                            console.log(codedtl);
                            write_file_log(codedtl);
                            dumpMethodNameInvoke.push(methodName);
                        }else{
                            console.log("DexBase is :",DexBase);
                        }
                   }
                } catch (error) {
                    console.log(error);
                }

            }, onLeave: function (retval) {
            
            }
        });
    }
}


function main(){
    hook_native();
    // hook_java();
}

setImmediate(main);



function CodeItemEnd(addr){
    //这个方法可能会有bug,主要是因为js的int类型
    // console.log("CodeItemEnd Enter:",hexdump(addr));
    var lebdtl = DecodeUnsignedLeb128(addr);
    addr = addr.add(lebdtl[1]);
    var numList = lebdtl[0];
    if(numList > 256){
        
        //异常，一般都是1，2
        console.log("numList:",numList," addr:",addr, " add:",lebdtl[1]);
        return addr.sub(lebdtl[1]);
    }
    for(; numList > 0 ; numList--){
        lebdtl = DecodeSignedLeb128(addr);
        addr = addr.add(lebdtl[1]);
        var numHandle = lebdtl[0];
        // console.log("numHandle:",numHandle);
        var num = numHandle;
        if(num <= 0){
            num = -numHandle;
        }
        for(; num > 0; num--){
            var lebdtl = DecodeUnsignedLeb128(addr);
            addr = addr.add(lebdtl[1]);
            // console.log("num:",num,"\t",lebdtl[0].toString(16));
            var lebdtl = DecodeUnsignedLeb128(addr);
            addr = addr.add(lebdtl[1]);
            // console.log("num:",num,"\t",lebdtl[0].toString(16));
        }
        if (numHandle <= 0) {
            var lebdtl = DecodeUnsignedLeb128(addr);
            addr = addr.add(lebdtl[1]);
            // console.log("numHandle<=0:",lebdtl[0].toString(16));
        }
    }
    return addr;
}

function DecodeUnsignedLeb128(addr){
    //readU32会有些权限报错
    var result = addr.readU8();
    var offset = 1;
    if(result > 0x7F){
        offset++;
        var cur = addr.add(offset).readU8();
        result = (result & 0x7f) | ((cur & 0x7f) << 7);
        if(cur > 0x7f) { 
            offset++;
            cur = addr.add(offset).readU8();
            result |= (cur & 0x7f) << 14;
            if(cur > 0x7f) { 
                offset++;
                cur = addr.add(offset).readU8();
                result |= (cur & 0x7f) << 21;
                if(cur > 0x7f){
                    offset++;
                    cur = addr.add(offset).readU8(); // & 0xFF
                    // cur = longval >> 32 & 0xFF;
                    result |= cur << 28;
                }
            }
        }
    }
    // console.log("DecodeUnsignedLeb128 result:",result,"\toffset:", offset);
    return [result,offset];
}

function DecodeSignedLeb128(addr){
    var result = addr.readU8();
    var offset = 1;
    if(result <= 0x7F){
        result = (result << 25) >> 25;
    } else {
        offset++;
        var cur = addr.add(offset).readU8();
        result = (result & 0x7f) | ((cur & 0x7f) << 7);
        if(cur <= 0x7f) { 
            result = (result << 18) >> 18;
        } else {
            offset++;
            cur = addr.add(offset).readU8();
            result |= (cur & 0x7f) << 14;
            if(cur <= 0x7F){
                result = (result << 11) >> 11;
            } else { 
                offset++;
                cur = addr.add(offset).readU8();
                result |= (cur & 0x7f) << 21;
                if(cur <= 0x7F){
                    result = (result << 4) >> 4;
                } else { 
                    offset++;
                    cur = addr.add(offset).readU8();
                    result |= cur << 28;
                }
            }
        }
    }
    // console.log("DecodeSignedLeb128 result:",result,"\toffset:", offset);
    return [result,offset];
}


function write_file_log(str) {
    try{
        var file = fopen(fileName, openName);
        // console.log("fopen file:", file);

        var buffer = Memory.allocUtf8String(str);
        var ret = fputs(buffer, file);
        // console.log("fputs ret:", ret);

        fclose(file);
    }
    catch(error){
        console.log("write_file_log error:",error);
    }
}

