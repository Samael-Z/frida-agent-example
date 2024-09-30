if(addr_DefineClass){
    //Intercepts execution through inline hooking.
    //内联hook指定地址
    Interceptor.attach(addr_DefineClass,{
        onEnter: function(args) {

            var dex_file = args[5];
            //ptr(dex_file).add(Process.pointerSize) is "const uint8_t* const begin_;"
            //ptr(dex_file).add(Process.pointerSize + Process.poniterSize) is "const size_t size_ "

            //Short-hand for `new NativePointer(value)`.
            //将这个地址解析一个native指针
            /*
            DexFile::DexFile(const uint8_t* base,
                            size_t size,
                            const uint8_t* data_begin,
                            size_t data_size,
                            const std::string& location,
                            uint32_t location_checksum,
                            const OatDexFile* oat_dex_file,
                            std::unique_ptr<DexFileContainer> container,
                            bool is_compact_dex)
           
            */
            var base = ptr(dex_file).add(Process.pointerSize).readPointer();
            console.log("base = " , base);
            var size = ptr(dex_file).add(Process.pointerSize + Process.pointerSize).readUInt();
            console.log("szie = " , size);
            if(dex_maps[base] == undefined){
                dex_maps[base] = size;
                var magic = ptr(base).readCString();
                if(magic.indexOf("dex") == 0){
                    //找到dex文件头了
                    var process_name  = get_self_process_name();
                    if(process_name != "-1"){
                        var dex_dir_path = "/data/data/" + process_name + "/file/dump_dex_" + process_name;
                        mkdir(dex_dir_path);
                        var dex_path = dex_dir_path + "/class" + (dex_count == 1 ? "" : dex_count) + ".dex";
                        console.log("[find dex]: ", dex_path);
                        var fd = new File(dex_path,"wb");
                        if(fd && fd != null){
                            dex_count++;
                            var dex_buffer = ptr(base).readByteArray(size);
                            fd.write(dex_buffer);
                            fd.flush();
                            fd.close();
                            console.log("[dump dex]: ",dex_path);

                        }
                    }
                    
                }
            }

        },
        onLeave:function(retval) {}
    });
}




if (addr_DefineClass) {
    Interceptor.attach(addr_DefineClass, {
        onEnter: function(args) {
            var dex_file = args[5];
            //ptr(dex_file).add(Process.pointerSize) is "const uint8_t* const begin_;"
            //ptr(dex_file).add(Process.pointerSize + Process.pointerSize) is "const size_t size_;"
            var base = ptr(dex_file).add(Process.pointerSize).readPointer();
            var size = ptr(dex_file).add(Process.pointerSize + Process.pointerSize).readUInt();

            if (dex_maps[base] == undefined) {
                dex_maps[base] = size;
                var magic = ptr(base).readCString();
                if (magic.indexOf("dex") == 0) {

                    var process_name = get_self_process_name();
                    if (process_name != "-1") {
                        var dex_dir_path = "/data/data/" + process_name + "/files/dump_dex_" + process_name;
                        mkdir(dex_dir_path);
                        var dex_path = dex_dir_path + "/class" + (dex_count == 1 ? "" : dex_count) + ".dex";
                        console.log("[find dex]:", dex_path);
                        var fd = new File(dex_path, "wb");
                        if (fd && fd != null) {
                            dex_count++;
                            var dex_buffer = ptr(base).readByteArray(size);
                            fd.write(dex_buffer);
                            fd.flush();
                            fd.close();
                            console.log("[dump dex]:", dex_path);

                        }
                    }
                }
            }
        },
        onLeave: function(retval) {}
    });
}
