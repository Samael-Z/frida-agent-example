


//全局数据区
var DexBase = null
var DexSize = null
var DexSizeBegin = 0x880000
var DexSizeEnd = 0x890000

var classArr = []

var packageName = "/data/data/com.sup.android.superb/files/"
var TestClass = "com.sup.android.superb.SplashActivity"
var TestFunction = "com.sup.android.superb.SplashActivity";//.android.MainActivity .app.e.b(android.content.Context)
var dumpMethodName = [] 

var invokeSize = Memory.alloc(0x10).writeU32(6);
var invokeStr = Memory.alloc(0x100).writeUtf8String("fart");
var allocPrettyMethod = Memory.alloc(0x100);
var allocPrettyMethodInit = []

for(var i = 0; i < 0x100; i++){
    allocPrettyMethodInit[i] = 0x0
}

var ArtMethod_invoke_replace = null


var sizeU32 = 4
var sizeShort = 2
var sizePointer = 8
var sizePointer32 = 4

var fileName = Memory.allocUtf8String("/data/data/com.sup.android.superb/files/error.log"); //= Memory.allocUtf8String(filename);
var openName = Memory.allocUtf8String("a+");

function CodeItemEnd(addr){
    //这个方法可能会有bug，主要因为js的int类型
    var lebdtl = DecodeunsignedLeb128(addr)
    addr = addr.add(lebdtl[1])
    var  numList = lebdtl[0]
    if(numList > 256){
        //异常，一般都是1，2
        console.log("numList: ", numList, "addr:" , addr , "add: " ,lebdtl[1])
        return addr.sub(lebdtl[1])
    }
    for(; numList > 0 ; numList--){
        lebdtl = DecodeSignedLeb128(addr)
        addr = addr.add(lebdtl[1])
        var numHandle = lebdtl[0]
        console.log("numHandle:" , numHandle)
        var num = numHandle
        if(num <= 0){
            num = -numHandle
        }
        for(; num > 0 ; num--){
            var lebdtl = DecodeUnsignedLeb128(addr)
            addr = addr.add(lebdtl[1])
            
        }
        if(numHandle <= 0 ){
            var lebdtl = DecodeunsignedLeb128(addr)
            addr = addr.add(lebdtl[1])
        }

    }

    return addr

}
function write_file_log(str){

    try{
        var file = fopen(fileName,openName)
        var buffer = Memory.allocUtf8String(str)
        var ret = fputs(buffer,file)
        fclose(file);

    }catch(err){
        console.error("write_file_log is error " , err)
    }

}
function loadClassAndInvoke(className){
    Java.perform(function(){
        try{
            //console.log("className " ,className)
            var classResult = Java.use(className).class
            if(!classResult){
                console.log("classResult false")
                return
            }
            var methodArr = classResult.getDeclaredConstructors()
            methodArr = methodArr.concat(classResult.getDeclaredMethods())
    
            console.log(className , "\t function length " , methodArr.length)
            for(var i = 0 ; i < methodArr.length; i++){
                var methodName = methodArr[i].toString()
                if(methodName.indexOf(TestFunction) >= 0){
                    if(methodName in dumpMethodName){
                        continue
    
                    }
                    //c++层调用
                    if(ArtMethod_invoke_replace){
                        try{
                            //每次都报错，但是还没找到更方便的
                            dumpMethodName.push(methodName)
                            ArtMethod_invoke_replace(ptr(methodArr[i].getArtMethod()) , ptr(0) , ptr(0) ,6, invokeSize ,invokeStr)
    
                        }catch(e){

                            console.error("ArtMethod_invoke_replace error:[ " , className ," ]  ", err," ")
                        }
                    }
    
    
                }
            }

        }catch(err){
            console.error("loadClassAndInvoke error:[ " , className ," ]  ", err," ")
        }



    })

}
//还原抽取指令
//找到指定classloader所有的类，依次调用
//classArr类字符串数组

function hook_java(){
    console.log("---------------------------start invoke :" , new Date().getTime())

    for(var i = 0; i < classArr.length; i++ ){

        //console.log("enter hook_java")
        //主动调用
        if(classArr[i].indexOf(TestClass) >= 0){
            console.log(" class zhudong invoke ", classArr[i])
            loadClassAndInvoke(classArr[i])
        }

    }


    console.log("---------------------------End invoke :" ,  new Date().getTime())

    //dump修复完成的dex文件
    dump_dex("fixed.dex")
}
//内部函数
function dump_dex(fileName){
    if(DexBase){

        if(fileName == ""){
            fileName = "dump.dex"
        }
        var dex_path = packageName + fileName
        //console.log("dex_path" , dex_path)
        var fd = new File(dex_path,"wb")
        if(fd && fd != null){
            var dex_buffer = ptr(DexBase).readByteArray(DexSize)
            fd.write(dex_buffer)
            fd.flush()
            fd.close()
            console.log("dump dex path ", dex_path)

        }
    }

}
function DecodeunsignedLeb128(addr){
    //readU32会有些报权限错误
    var result  = addr.readU8()

    var offset = 1
    if(result > 0x7f){
        offset++;
        var cur = addr.add(offset).readU8()
        result = (result & 0x7f) | ((cur & 0x7f) << 7)
        if(cur > 0x7f){
            offset++
            cur = addr.add(offset).readU8()
            result |= (cur & 0x7f) << 14

            if(cur > 0x7f){
                offset++
                cur = addr.add(offset).readU8()
                result |= (cur & 0x7f) << 21

                if(cur > 0x7f){
                    offset++
                    cur = addr.add(offset).readU8()
                    result |= cur << 28
            
                }
            
            }

        }
    }

    return [result,offset]


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

//abdroid10 defineclass导出符号：
// 64 _ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS_3dex8ClassDefE
// 32 _ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcjNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS_3dex8ClassDefE
///// _ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS9_8ClassDefE
function hook_native(){


    if(Process.arch !== "arm64" && Process.arch !== "arm"){
        console.log("仅支持android10 arm，arm64版本");
        return;
        
    }
    
    var addr_Method_invoke = null;
    var addr_ArtMethod_invoke = null;
    var addr_ArtMethod_prettyMethod = null;
    var addr_ClassLinker_DefineClass = null;
    var libart = Process.getModuleByName("libart.so")
    console.warn("[测试] libart load path = " , libart.path);
    var symlibart = libart.enumerateSymbols()
    console.log("libart.so enumerateSymbols length: " , symlibart.length)

    var Method_invoke_SymbolName = "_ZN3artL13Method_invokeEP7_JNIEnvP8_jobjectS3_P13_jobjectArray"
    var ArtMethod_Invoke_SymbolName = "_ZN3art9ArtMethod6InvokeEPNS_6ThreadEPjjPNS_6JValueEPKc"
    var ArtMethod_Invoke_PrettyMethod_SymbokName = "_ZN3art9ArtMethod12PrettyMethodEb"

    if(Process.arch === "arm64"){

        var classLinker_DefineClass_SymbolName = "_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcmNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS_3dex8ClassDefE"       
    }
    else if( Process.arch === "arm"){
        var classLinker_DefineClass_SymbolName = "_ZN3art11ClassLinker11DefineClassEPNS_6ThreadEPKcjNS_6HandleINS_6mirror11ClassLoaderEEERKNS_7DexFileERKNS_3dex8ClassDefE"
    
    }
    for(var i = 0; i < symlibart.length; i++){

        if(symlibart[i].name.indexOf(Method_invoke_SymbolName) != -1){

            addr_Method_invoke = symlibart[i].address

        }
        if(symlibart[i].name.indexOf(ArtMethod_Invoke_SymbolName) != -1){

            addr_ArtMethod_invoke = symlibart[i].address

        }
        if(symlibart[i].name.indexOf(ArtMethod_Invoke_PrettyMethod_SymbokName) != -1){

            addr_ArtMethod_prettyMethod = symlibart[i].address

        }
        if(symlibart[i].name.indexOf(classLinker_DefineClass_SymbolName) != -1){

            addr_ClassLinker_DefineClass = symlibart[i].address
        }

    }

  //  console.log("addr_Method_invoke: ",addr_Method_invoke,
   //     "\naddr_ArtMethod_invoke: ",addr_ArtMethod_invoke,
    //    "\naddr_ArtMethod_prettyMethod: ",addr_ArtMethod_prettyMethod,
     //   "\naddr_ClassLinker_DefineClass: ",addr_ClassLinker_DefineClass)

    if(!(classLinker_DefineClass_SymbolName && addr_Method_invoke  && addr_ArtMethod_invoke && addr_ArtMethod_prettyMethod)){
        console.log("defineclass导出符号获取失败,退出")
        return
    }
   //已经拿到所有需要的导出符号地址

    Interceptor.attach(addr_ClassLinker_DefineClass,{
        onEnter:function(args){
            if(DexBase){
                return
            }

            //开始获取DexBase地址
            var dex_file = args[5]
            var base = ptr(dex_file).add(Process.pointerSize).readPointer()
            var size = ptr(dex_file).add(Process.pointerSize * 2).readUInt()
            //搞不明白size是从哪个结构体拿到的
            /*
            console.log("base : " , hexdump(base,{
                offset:0,
                length:0x30,
                header:true,
                ansi:true
            }))
            console.log("size " ,size, " pointersize " , Process.pointerSize )
            console.log("dex_file : " , hexdump(dex_file,{
                offset:0,
                length:48,
                header:true,
                ansi:true
            }))
            */
           //找到真正的dex
           if(size > DexSizeBegin && size < DexSizeEnd){
            console.log("base: ",base,"\t size: " , size.toString(16) )
            DexBase = base
            DexSize = size
            dump_dex("init.dex")
            var string_ids_size = DexBase.add(0x38).readU32()
            var string_ids_off  = DexBase.add(0x3c).readU32();

            
            var type_ids_size = DexBase.add(0x40).readU32()
            var type_ids_off  = DexBase.add(0x44).readU32();

            
            var proto_ids_size = DexBase.add(0x48).readU32()
            var proto_ids_off  = DexBase.add(0x4c).readU32();
            
            var class_idx = DexBase.add(0x60).readU32()
            var class_defs_off  = DexBase.add(0x64).readU32();
            
            //console.log("string_ids_size: ",string_ids_size,
              //  "\nstring_ids_off: ",string_ids_off,
                //"\ntype_ids_size: ",type_ids_size,
                //"\ntype_ids_off: ",type_ids_off,
                //"\nproto_ids_size: ",proto_ids_size,
                //"\nproto_ids_off: ",proto_ids_off,
                //"\nclass_idx: ",class_idx,
                //"\nclass_defs_off: ",class_defs_off,
            //)
            for(var i = 0; i < class_idx; i++){
                var offsetClass = DexBase.add(class_defs_off + i * 0x20)
                var type_idx = offsetClass.readU32()
                var descriptor_idx = DexBase.add(type_ids_off + type_idx * 0x4).readU32()
                var offsetStr = DexBase.add(string_ids_off + descriptor_idx * 0x4).readU32()

                if(offsetStr > size){
                    //有些字符串的偏移会超出dex大小
                    console.warn("offsetStr 大于 size")
                    break;
                }

                var addrStr = DexBase.add(offsetStr)
                //uleb128类型字符串
                var classNameLen = addrStr.readU8()
                if(classNameLen > 0x7f){
                    var lebdtl = DecodeunsignedLeb128(addrStr)
                    addrStr = addrStr.add(lebdtl[1])
                }else{
                    addrStr = addrStr.add(1)
                }
                var str = addrStr.readUtf8String()
                //console.log("解析dex class_def str " , str)
                str = str.replace(/L([^;]+);/,"$1").replace(/\//g,'.');
                classArr.push(str);
                //console.log("解析dex class_def str " , str)

            }
            console.log("classArr length = ",classArr.length)
            //hook_java()

           }
        },onLeave:function(retval){

        }
    })

    //准备开始主动调用

    var module_libext = null
    //获取ArtMethod Name

    if(Process.arch === "arm64"){
        module_libext = Module.load("/data/app/libext64.so")
    }else if (Process.arch === "arm"){
        module_libext = Module.load("/data/app/libext.so")
    }
    console.log("module_libextr: " ,module_libext.base)
    if(module_libext != null){
        var addr_PrettyMethod = module_libext.getExportByName("PrettyMethod")
        var PrettyMethod = new NativeFunction(addr_PrettyMethod,"void",["pointer","pointer","pointer" , "int"])

        var addr_ArtMethod_invoke_replace = addr_ArtMethod_invoke
        ArtMethod_invoke_replace = new NativeFunction(addr_ArtMethod_invoke_replace, "void",['pointer', 'pointer', 'pointer', 'uint32', 'pointer','pointer'])
        console.warn("Interceptor.attach(addr_ArtMethod_invoke");
        Interceptor.attach(addr_ArtMethod_invoke,{
            onEnter:function(args){

                try{
                    return
                    
                    if(args[1].toString() != "0x0"){
                        //console.log("args[1].toString() != 0x0")
                        return
                    }
                    allocPrettyMethod.writeByteArray(allocPrettyMethodInit)
                    PrettyMethod(addr_ArtMethod_prettyMethod,args[0],allocPrettyMethod,0x100)
                    var methodName = allocPrettyMethod.readCString()
                    console.log("allocPrettyMethod methodName = ",methodName )
                    if(methodName in dumpMethodNameInvoke){
                        return
                    }
                    if(methodName.indexOf(TestFunction) > -1 ){

                        var dex_code_item_offset_ = args[0].add(sizeU32 * 2 ).readU32()
                        var dex_method_index_ = args[0].add(sizeU32 * 3)
                        if(dex_code_item_offset_ <= 0){
                            console.error("dex_code_item_offset_ error " , dex_code_item_offset_) 
                            return
                        }

                        if(DexBase){
                            var addrCodeOffset = DexBase.add(dex_code_item_offset_)
                            var tries_size = addrCodeOffset.add(sizeShort * 3 ).readU16()
                            var insns_size = addrCodeOffset.add(sizeU32 * 3).readU16()
                            if(tries_size > 256){
                                console.error("tries_size err ", tries_size.toString(16))
                                console.error("insns_size err ", insns_size.toString(16))
                                return
                            }
                            var codeLen = 16 + insns_size * 2
                            if(tries_size > 0 ){
                                var  addrTryStart = addrCodeOffset.add(codeLen)
                                if(codeLen % 4 != 0){
                                    addrTryStart = addrTryStart.add(0x2)

                                }
                                var addrTryEnd = addrTryStart.add(sizePointer * tries_size)
                                var addrCodeEnd = CodeItemEnd(addrTryEnd)
                                codeLen = addrCodeEnd - addrCodeOffset


                            }
                            var allins = ""
                            for(var i = 0; i < codeLen; i++){
                                var u8data = addrCodeOffset.add(i).readU8()
                                if(u8data < 0xF){
                                    allins += "0"
                                }
                                allins += u8data.toString(16)


                            }
                            var codedtl = "{name:"+methodName+
                                        ",method_idx:"+dex_method_index_+
                                        ",offset:"+dex_code_item_offset_+
                                        ",code_item_len:"+codeLen+
                                        ",ins:"+allins+
                                            "};"
                            console.log(codedtl)
                            write_file_log(codedtl)
                            dumpMethodNameInvoke.push(methodName)

                        }else{
                            console.warn("DexBase is  " , DexBase)
                        }

                    }


                }catch(err){
                    console.error("Interceptor.attach(addr_ArtMethod_invoke error = " ,err)
                }

            },onLeave:function(retval){

            }

        })

    }
 

}


//入口函数
function main(){
    hook_native();
    //hook_java()

}

setImmediate(main)

/**
struct DexFile {
    
    const DexOptHeader* pOptHeader;
    const DexHeader*    pHeader;
    const DexStringId*  pStringIds;
    const DexTypeId*    pTypeIds;
    const DexFieldId*   pFieldIds;
    const DexMethodId*  pMethodIds;
    const DexProtoId*   pProtoIds;
    const DexClassDef*  pClassDefs;
    const DexLink*      pLinkData;
    const DexClassLookup* pClassLookup;
    const void*         pRegisterMapPool;       // RegisterMapClassPool
    const u1*           baseAddr;
    int                 overhead;
};
struct DexOptHeader {
    u1  magic[8];           

    u4  dexOffset;          
    u4  dexLength;
    u4  depsOffset;        
    u4  depsLength;
    u4  optOffset;          
    u4  optLength;

    u4  flags;             
    u4  checksum;         

   
};

base :             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
ba68e000  64 65 78 0a 30 33 35 00 a7 d6 b5 56 f6 7a 38 ac  dex.035....V.z8.
ba68e010  40 9b 81 e1 b0 ea c2 c8 d5 2e c0 3d c0 a6 9e 5d  @..........=...]
ba68e020  f4 7e 64 00 70 00 00 00 78 56 34 12 00 00 00 00  .~d.p...xV4.....
size  6586100  pointersize  4
dex_file : 0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
ea62c950  40 f6 3f ea 00 e0 68 ba f4 7e 64 00 00 e0 68 ba  @.?...h..~d...h.
ea62c960  f4 7e 64 00 51 00 00 00 46 00 00 00 70 24 c1 e0  .~d.Q...F...p$..
ea62c970  a7 d6 b5 56 00 e0 68 ba 70 e0 68 ba 08 eb 6b ba  ...V..h.p.h...k.
base :             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
ba68e000  64 65 78 0a 30 33 35 00 a7 d6 b5 56 f6 7a 38 ac  dex.035....V.z8.
ba68e010  40 9b 81 e1 b0 ea c2 c8 d5 2e c0 3d c0 a6 9e 5d  @..........=...]
ba68e020  f4 7e 64 00 70 00 00 00 78 56 34 12 00 00 00 00  .~d.p...xV4.....
size  6586100  pointersize  4
dex_file :             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
ea62c950  40 f6 3f ea 00 e0 68 ba f4 7e 64 00 00 e0 68 ba  @.?...h..~d...h.
ea62c960  f4 7e 64 00 51 00 00 00 46 00 00 00 70 24 c1 e0  .~d.Q...F...p$..
ea62c970  a7 d6 b5 56 00 e0 68 ba 70 e0 68 ba 08 eb 6b ba  ...V..h.p.h...k.
base :             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
bb123000  64 65 78 0a 30 33 35 00 95 6c 4b 47 8e f5 ca 51  dex.035..lKG...Q
bb123010  1d a9 e5 aa b3 1e 48 d8 5c a5 d8 08 99 85 c0 c4  ......H.\.......
bb123020  78 a9 48 00 70 00 00 00 78 56 34 12 00 00 00 00  x.H.p...xV4.....
size  4761976  pointersize  4
dex_file :             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
bcd40db0  40 f6 3f ea 00 30 12 bb 78 a9 48 00 00 30 12 bb  @.?..0..x.H..0..
bcd40dc0  78 a9 48 00 51 00 00 00 46 00 00 00 90 85 d1 bc  x.H.Q...F.......
bcd40dd0  95 6c 4b 47 00 30 12 bb 70 30 12 bb e0 43 14 bb  .lKG.0..p0...C..

G:\android\抽取壳\android10so>G:\android\unpackProject\objdump.exe -TC *.so | findstr "PrettyMethod"
00000000      DF *UND*  00000000              art::DexFile::PrettyMethod(unsigned int, bool) const
00000000      DF *UND*  00000000              art::ArtMethod::PrettyMethod(bool)
00000000      DF *UND*  00000000              art::ArtMethod::PrettyMethod(art::ArtMethod*, bool)
001da8a0 g    DF .text  00000012              .protected art::HGraph::PrettyMethod(bool) const
00000000      DF *UND*  00000000              art::DexFile::PrettyMethod(unsigned int, bool) const
000e1118 g    DF .text  00000026              .protected art::ArtMethod::PrettyMethod(art::ArtMethod*, bool)
000e0104 g    DF .text  00000158              .protected art::ArtMethod::PrettyMethod(bool)
00000000      DF *UND*  00000000              art::DexFile::PrettyMethod(unsigned int, bool) const
000e1118 g    DF .text  00000026              .protected art::ArtMethod::PrettyMethod(art::ArtMethod*, bool)
000e0104 g    DF .text  00000158              .protected art::ArtMethod::PrettyMethod(bool)
00019698 g    DF .text  000003a4              .protected art::DexFile::PrettyMethod(unsigned int, bool) const
00000000      DF *UND*  00000000              art::DexFile::PrettyMethod(unsigned int, bool) const
00000724 g    DF .text  00000048              PrettyMethod
00000000      DF *UND*  00000000              art::ArtMethod::PrettyMethod(bool)
00000000      DF *UND*  00000000              art::DexFile::PrettyMethod(unsigned int, bool) const
00000000      DF *UND*  00000000              art::DexFile::PrettyMethod(unsigned int, bool) const

*/