var FunMethod_invoke = null;
var ArtMethod_invoke_replace = null;
var DexBase = null;
var TestCalss = "com.aipao.hanmoveschool"; //.activity.MainActivity
var TestFunction = "com.aipao.hanmoveschool"; //.activity .MainActivity.getFragments
var sizePointer = Process.pointerSize; //64位的,这里是8
var sizeU32 = sizePointer / 2;
var sizeShort = sizeU32 / 2;

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

var dumpMethodName = []
for(var i=0;i<0x100;i++){
    allocPrettyMethodInit[i] = 0x0
}

function hook_java(){
    Java.perform(function(){
        console.log("---------------Java.enumerateClassLoaders");
        Java.enumerateClassLoaders({
            onMatch: function(cl){
                fartwithClassloader(cl);
            },
            onComplete: function(){
            }
        });
    });
}

function fartwithClassloader(cl){
    Java.perform(function(){    
        var clstr = cl.$className.toString();
        if(clstr.indexOf("java.lang.BootClassLoader") >= 0 ){
            return
        }
        console.log("  |------------",cl.$className);

        var class_BaseDexClassLoader = Java.use("dalvik.system.BaseDexClassLoader");
        var pathcl = Java.cast(cl, class_BaseDexClassLoader);
        console.log(".pathList",pathcl.pathList.value);

        var class_DexPathList = Java.use("dalvik.system.DexPathList");
        var dexPathList = Java.cast(pathcl.pathList.value, class_DexPathList);
        console.log(".dexElements:",dexPathList.dexElements.value.length);

        var class_DexFile = Java.use("dalvik.system.DexFile");
        var class_DexPathList_Element = Java.use("dalvik.system.DexPathList$Element");
        for(var i=0;i<dexPathList.dexElements.value.length;i++){
            var dexPathList_Element = Java.cast(dexPathList.dexElements.value[i], class_DexPathList_Element);
            // console.log(".dexFile:",dexPathList_Element.dexFile.value);
            if(dexPathList_Element.dexFile.value){
                //可能为空
                var dexFile = Java.cast(dexPathList_Element.dexFile.value, class_DexFile);
                var mcookie = dexFile.mCookie.value;
                // console.log(".mCookie",dexFile.mCookie.value);
                if(dexFile.mInternalCookie.value){
                    // console.log(".mInternalCookie",dexFile.mInternalCookie.value);
                    mcookie = dexFile.mInternalCookie.value;
                }
                var classNameArr = dexPathList_Element.dexFile.value.getClassNameList(mcookie);
                console.log("dexFile.getClassNameList.length:",classNameArr.length);
                console.log("     |------------Enumerate ClassName Start");
                for(var i=0; i<classNameArr.length; i++){
                    // console.log("      ",classNameArr[i]);
                    if(classNameArr[i].indexOf(TestCalss) > -1){
                        loadClassAndInvoke(cl, classNameArr[i]);
                    }
                }
                console.log("     |------------Enumerate ClassName End");
            }
        }
    });
}

function loadClassAndInvoke(cl, className) {
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
                    console.log("   ",methodName);
                    // c++层调用
                    if(ArtMethod_invoke_replace){
                        //每次都会报错,但是我还没找到更方便的
                        try{
                            dumpMethodName.push(methodName);
                            ArtMethod_invoke_replace(ptr(methodArr[i].getArtMethod()), ptr(0), ptr(0), 6, invokeSize, invokeStr);
                        } catch(error){
                            // console.log("ArtMethod_invoke error:[",className,"]",error);
                        }
                    }


                    //Java层调用
                    //每个方法都要对应号参数，如果是对象类型，非常繁琐，不使用
                    // var argsTypes = methodArr[i].getParameterTypes();
                    // var args = []

                    // int类型
                    // var class_int = Java.use("java.lang.Integer");
                    // args[0] = class_int.$new(0x1);

                    // String类型
                    // var class_String = Java.use("java.lang.String");
                    // args[0] = class_String.$new("TEST");

                    // 例:android.os.Bundle类型，OnCreate
                    // var class_Bundle = Java.use("android.os.Bundle");
                    // args[0] = class_Bundle.$new();

                    // 参数列表
                    // var arr = Java.array("Ljava.lang.Object;",args);
                    // methodArr[i].setAccessible(true)
                    // console.log("invoke result:",methodArr[i].invoke(null,arr));

                    // 非静态需要this
                    // var class_MainActivity = Java.use("com.aipao.hanmoveschool.activity.MainActivity");
                    // class_MainActivity.$new();
                    // Java.choose("com.aipao.hanmoveschool.activity.MainActivity",{
                    //     onMatch: function(ins){
                    //         try {
                    //             console.log(methodArr[i].invoke(ins,arr)); //.overload('java.lang.Object', '[Ljava.lang.Object;')
                    //         } catch (error) {
                    //             console.log("Java.choose:[",methodArr[i].toString(),']',error);
                    //         }
                    //     },
                    //     onComplete: function(){
                    //     }
                    // });
                }
            }
            
        } catch (error) { 
            console.log("loadClassAndInvoke error:[",className,"]",error);
        }
    });
}

function hook_native() {
    var addr_Method_invoke = null;
    var addr_ArtMethod_invoke = null;
    var addr_ArtMethod_PrettyMethod = null;
    var addr_ClassLinker_DefineClass = null;

    var libart = Process.findModuleByName("libart.so");
    var symbols = libart.enumerateSymbols();
    console.log("libart.so enumerateSymbols length:", symbols.length);
    for(var index=0; index < symbols.length; index++) {
        //这里直接Android8.0写死的，可以自己看着改
        var symbol = symbols[index];
        var symbol_name = symbol.name;
        if (symbol_name.indexOf("_ZN3artL13Method_invokeEP7_JNIEnvP8_jobjectS3_S3_") >= 0 ) {
            addr_Method_invoke = symbol.address;
        }

        if (symbol_name.indexOf("_ZN3art9ArtMethod6InvokeEPNS_6ThreadEPjjPNS_6JValueEPKc") >= 0 ) {
            addr_ArtMethod_invoke = symbol.address;
        }

        if (symbol_name.indexOf("_ZN3art9ArtMethod12PrettyMethodEb") >= 0 ) {
            addr_ArtMethod_PrettyMethod = symbol.address;
        }

        if (symbol_name.indexOf("_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS9_8ClassDefE") >= 0 ) {
            addr_ClassLinker_DefineClass = symbol.address;
        }
        
    }

    Interceptor.attach(addr_ClassLinker_DefineClass, {
        onEnter: function(args){
            if(DexBase) {
                //找到就不运行下面了
                return;
            }
            console.log("addr_ClassLinker_DefineClass:",DexBase);
            var dex_file = args[5];
            var base = ptr(dex_file).add(Process.pointerSize).readPointer();
            var size = ptr(dex_file).add(Process.pointerSize *2).readUInt();
            console.log("base:",base,"\tsize:",size);
            if(size > 0x3b0000 && size < 0x3f0000){
                DexBase = base;
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
    if (module_libext != null) {
        var addr_PrettyMethod = module_libext.findExportByName("PrettyMethod");
        var PrettyMethod = new NativeFunction(addr_PrettyMethod, "void", ["pointer", "pointer", "pointer", "int"]);

        var addr_ArtMethod_invoke_replace = addr_ArtMethod_invoke;
        ArtMethod_invoke_replace = new NativeFunction(addr_ArtMethod_invoke_replace, 'void', ['pointer', 'pointer', 'pointer', 'uint32', 'pointer','pointer']); //'pointer',

        console.log("Interceptor.attach(addr_ArtMethod_invoke");
        Interceptor.attach(addr_ArtMethod_invoke, {
            onEnter: function (args) {
                try {
                    allocPrettyMethod.writeByteArray(allocPrettyMethodInit);
                    PrettyMethod(addr_ArtMethod_PrettyMethod, args[0], allocPrettyMethod, 0x100);
                    
                    if(allocPrettyMethod.readCString().indexOf(TestFunction) > -1){
                        console.log("addr_ArtMethod_invoke:",allocPrettyMethod.readCString());

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
                            var codedtl = "{name:"+allocPrettyMethod.readCString()+
                                ",method_idx:"+dex_method_index_+
                                ",offset:"+dex_code_item_offset_+
                                ",code_item_len:"+codeLen+
                                ",ins:"+allins+
                            "};";
                            console.log(codedtl);
                            write_file_log(codedtl);
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
    // var longval = addr.readU64() & 0xFFFFFFFFFF; 低位会清0
    var longval = addr.readU32();
    // longval = (longval << 8) |  addr.add(sizeU32).readU8(); //不行，会成负数
    // console.log("DecodeUnsignedLeb128 longval:",longval.toString(16));
    var offset = 1;
    var result = longval & 0xFF;
    if(result > 0x7F){
        offset++;
        var cur = longval >> 8 & 0xFF;
        result = (result & 0x7f) | ((cur & 0x7f) << 7);
        if(cur > 0x7f) { 
            offset++;
            var cur = longval >> 16 & 0xFF;
            result |= (cur & 0x7f) << 14;
            if(cur > 0x7f) { 
                offset++;
                var cur = longval >> 24 & 0xFF;
                result |= (cur & 0x7f) << 21;
                if(cur > 0x7f){
                    //不知道会不会报错
                    cur = addr.add(offset).readU8() & 0xFF;
                    // console.log("DecodeUnsignedLeb128 Byte5:",cur.toString(16));
                    offset++;
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
    // var longval = addr.readU64() & 0xFFFFFFFFFF; 低位会清0
    var longval = addr.readU32();
    // longval = (longval << 8) |  addr.add(sizeU32).readU8(); //不行，会成负数
    // console.log("DecodeSignedLeb128 longval:",longval.toString(16));
    var offset = 1;
    var result = longval & 0xFF;
    if(result <= 0x7F){
        result = (result << 25) >> 25;
    } else {
        offset++;
        var cur = longval >> 8 & 0xFF;
        result = (result & 0x7f) | ((cur & 0x7f) << 7);
        if(cur <= 0x7f) { 
            result = (result << 18) >> 18;
        } else {
            offset++;
            var cur = longval >> 16 & 0xFF;
            result |= (cur & 0x7f) << 14;
            if(cur <= 0x7F){
                result = (result << 11) >> 11;
            } else { 
                offset++;
                var cur = longval >> 24 & 0xFF;
                result |= (cur & 0x7f) << 21;
                if(cur <= 0x7F){
                    result = (result << 4) >> 4;
                } else { 
                    //不知道会不会报错
                    cur = addr.add(offset).readU8() & 0xFF;
                    offset++;
                    // cur = longval >> 32 & 0xFF;
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

