function tracedec(){
    var base = Process.getModuleByName("libjiagu_64.so").base.add(0x193868)
    var fileIndex = 0
    Interceptor.attach(base,{
        onEnter:function(args){
            console.log("tracedec arg[1]",hexdump(args[1],{
                offset:0,
                length:0x30,
                header:true,
                ansi:true
            }))
            //console.log("tracedec arg[0]",args[0])
            console.log("tracedec arg[2]",args[2]) 
            //console.log("tracedec arg[3]",args[3])
            //console.log("tracedec arg[4]",args[4])

            try{
                //保存dex到文件
                var length = args[2].toInt32();
                var data = Memory.readByteArray(args[1],length)
                var filePath = "/data/data/com.swdd.txjgtest/files/" + fileIndex + ".dex"
                var file_handle = new File(filePath,"wb")
                if(file_handle && file_handle != null){
                    file_handle.write(data)
                    file_handle.flush()
                    file_handle.close()
                    console.log("data written to " + filePath )
                    fileIndex++
                }else{
                    console.error("Failed to create file: " + filePath);
                }

            }catch(e){
                console.error("err " + e.message )
            }

        },onLeave:function(retval){

        }
    })
}

function hook_dlopen(){

    var once = true;
    var dlopen = Module.getExportByName(null,"dlopen")
    Interceptor.attach(dlopen,{
        onEnter:function(args){
            var loadfile = args[0].readCString();
            if(loadfile.indexOf("libjiagu") != -1){
                console.log("[load]-> ", loadfile)
                this.is_can_hook = true

            }

        },onLeave:function(retval){
            if(this.is_can_hook && once){
                tracedec()
                once = false

            }
        }
    })
}

setImmediate(hook_dlopen)