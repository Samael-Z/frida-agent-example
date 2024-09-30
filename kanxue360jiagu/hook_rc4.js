//hook rc4的密钥

function hook_RC4(){



    var module = Process.findModuleByName("libjiagu_64.so");
    Interceptor.attach(module.base.add(0x571c),{
        onEnter:function(args){
            console.log("参数1：",hexdump(args[0],{
                offset:0,
                length:0x30,
                header:true,
                ansi:true
            }));
            /*
            console.log("参数2：",hexdump(args[1],{
                offset:0,
                length:0x10,
                header:true,
                ansi:true
            }));
            */
            console.log("参数3：",hexdump(args[2],{
                offset:0,
                length:0x10,
                header:true,
                ansi:true
            }));

        },onLeave:function(retval){
            
        }
    })

}

function hook_android_dlopen_ext(){

    var android_dlopen_ext = Module.getExportByName("libdl.so","android_dlopen_ext");
    Interceptor.attach(android_dlopen_ext,{
        onEnter:function(args){
           
            if(args[0].readCString().indexOf("libjiagu") != -1){
                this.is_can_hook = true;
            }

        },onLeave:function(retval){
           if(this.is_can_hook){
            hook_RC4()

           }
        }
    })

}

setImmediate(hook_android_dlopen_ext)