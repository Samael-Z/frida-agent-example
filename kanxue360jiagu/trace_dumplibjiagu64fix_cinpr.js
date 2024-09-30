var func_addr = [0x23c0, 0x23d0, 0x23e0, 0x23f0, 0x2400, 0x2410, 0x2420, 0x2430, 0x2440, 0x2450, 0x2460, 0x2470, 0x2480, 0x2490, 0x24a0, 0x24b0, 0x24c0, 0x24d0, 0x24e0, 0x24f0, 0x2500, 0x2510, 0x2520, 0x2530, 0x2540, 0x2550, 0x2560, 0x2570, 0x2580, 0x2590, 0x25a0, 0x25b0, 0x25c0, 0x25d0, 0x25e0, 0x25f0, 0x2600, 0x2610, 0x2620, 0x2630, 0x2640, 0x2650, 0x2660, 0x2670, 0x2680, 0x2690, 0x26a0, 0x26b0, 0x26c0, 0x26d0, 0x26e0, 0x26f0, 0x2700, 0x2710, 0x2720, 0x2730, 0x2740, 0x2750, 0x2760, 0x2770, 0x2780, 0x2790, 0x27a0, 0x27b0, 0x27c0, 0x27d0, 0x27e0, 0x27f0, 0x2800, 0x280c, 0x28b0, 0x28c8, 0x28cc, 0x28ec, 0x28fc, 0x2920, 0x2934, 0x2948, 0x294c, 0x296c, 0x2978, 0x299c, 0x29b0, 0x29bc, 0x29c4, 0x2a14, 0x2a1c, 0x2a40, 0x2a60, 0x2a70, 0x2a84, 0x2a88, 0x2a8c, 0x2a90, 0x2ac0, 0x2ac4, 0x2b70, 0x2b8c, 0x2ce0, 0x2f54, 0x2f8c, 0x2fe4, 0x30a4, 0x30d8, 0x3148, 0x317c, 0x33bc, 0x34fc, 0x3538, 0x3674, 0x3a28, 0x3bdc, 0x4340, 0x440c, 0x4570, 0x468c, 0x47ac, 0x495c, 0x4b74, 0x4bb8, 0x4bfc, 0x4c40, 0x4c74, 0x4e4c, 0x5008, 0x51b8, 0x5304, 0x55ec, 0x5668, 0x571c, 0x583c, 0x5894, 0x58ec, 0x5994, 0x59dc, 0x5a28, 0x5a5c, 0x5abc, 0x5b1c, 0x5b54, 0x5bf0, 0x5c4c, 0x5cac, 0x5ce4, 0x5d38, 0x5df8, 0x5e44, 0x5f4c, 0x6028, 0x6120, 0x6154, 0x616c, 0x618c, 0x61c4, 0x6204, 0x6238, 0x6260, 0x6270, 0x62a8, 0x6310, 0x6344, 0x6360, 0x637c, 0x63b4, 0x6400, 0x641c, 0x64b8, 0x6524, 0x6554, 0x65b0, 0x6610, 0x6624, 0x6648, 0x6748, 0x684c, 0x6c60, 0x6cd4, 0x6d40, 0x6dfc, 0x6e48, 0x6f54, 0x70b0, 0x7218, 0x7250, 0x7288, 0x7490, 0x76b0, 0x76f8, 0x7af0, 0x7b4c, 0x7bac, 0x7cdc, 0x7dd0, 0x7e08, 0x7fdc, 0x86a8, 0x86fc, 0x8820, 0x8a84, 0x8bbc, 0x8dc8, 0x8e60, 0x906c, 0x925c, 0x9290, 0x93f4, 0x9450, 0x94b0, 0x94f0, 0x94f4, 0x9514, 0x9538, 0x954c, 0x957c, 0x95a4, 0x95d4, 0x95fc, 0x9600, 0x9604, 0x9608, 0x960c, 0x9610, 0x9614, 0x9618, 0x961c, 0x9620, 0x9640, 0x9674, 0x9754, 0x9780, 0x97d0, 0x9814, 0x9870, 0x98b4, 0x9910, 0x9988, 0x9a08, 0x9b90, 0x9c00, 0x9c04, 0x9f14, 0x9f60, 0xa0a0, 0xa374, 0xa648, 0xa848, 0xb400, 0xb460, 0xb800, 0xd400, 0xde4c, 0xe0b4, 0xe2f4, 0xf000, 0x10000, 0x10100, 0x10c8c, 0x13400, 0x14f28, 0x15058, 0x15148, 0x15238, 0x15314, 0x153b0, 0x1544c, 0x15654, 0x15670, 0x15694, 0x15728, 0x15800, 0x15818, 0x158d4, 0x15944, 0x159cc, 0x15a4c, 0x15e98, 0x160fc, 0x1668c, 0x167b4, 0x16ffc, 0x170b4, 0x170b8, 0x17134, 0x27d000, 0x27d008, 0x27d010, 0x27d018, 0x27d020, 0x27d028, 0x27d030, 0x27d038, 0x27d040, 0x27d048, 0x27d050, 0x27d058, 0x27d060, 0x27d068, 0x27d070, 0x27d078, 0x27d080, 0x27d088, 0x27d090, 0x27d098, 0x27d0a0, 0x27d0a8, 0x27d0b0, 0x27d0b8, 0x27d0c0, 0x27d0c8, 0x27d0d0, 0x27d0d8, 0x27d0e0, 0x27d0e8, 0x27d0f0, 0x27d0f8, 0x27d100, 0x27d108, 0x27d110, 0x27d118, 0x27d120, 0x27d128, 0x27d130, 0x27d138, 0x27d140, 0x27d148, 0x27d150, 0x27d158, 0x27d160, 0x27d168, 0x27d170, 0x27d178, 0x27d180, 0x27d188, 0x27d190, 0x27d198, 0x27d1a0, 0x27d1a8, 0x27d1b0, 0x27d1b8, 0x27d1c0, 0x27d1c8, 0x27d1d0, 0x27d1d8, 0x27d1e0, 0x27d1e8, 0x27d1f0, 0x27d1f8, 0x27d200];
var func_name = ["strcpy", "uncompress", "fmodf", "pthread_create", "snprintf", "syscall", "munmap", "__errno", "getenv", "_Znwm", "getpid", "fgets", "prctl", "memcpy", "j_interpreter_wrap_int64_t", "puts", "__cxa_finalize", "feof", "malloc", "vsnprintf", "select", "readdir", "isspace", "inotify_init", "dladdr", "lseek", "_ZdlPv", "mmap", "pthread_detach", "abort", "__stack_chk_fail", "strtol", "calloc", "kill", "dl_iterate_phdr", "j___aarch64_sync_cache_range", "fmod", "strstr", "__cxa_pure_virtual", "read", "strncmp", "dlopen", "strncpy", "setenv", "strtok", "sscanf", "isalpha", "sigaction", "dlsym", "strdup", "fopen", "memset", "_ZdaPv", "fclose", "time", "opendir", "strcmp", "inotify_add_watch", "_Znam", "atoi", "strlen", "open", "j__Z10__arm_a_20v", "mprotect", "closedir", "close", "raise", "free", "start", "sub_280C", "sub_28B0", "sub_28C8", "sub_28CC", "sub_28EC", "sub_28FC", "sub_2920", "sub_2934", "sub_2948", "sub_294C", "sub_296C", "sub_2978", "sub_299C", "sub_29B0", "sub_29BC", "sub_29C4", "sub_2A14", "sub_2A1C", "sub_2A40", "sub_2A60", "sub_2A70", "sub_2A84", "sub_2A88", "sub_2A8C", "sub_2A90", "j___stack_chk_fail", "sub_2AC4", "sub_2B70", "sub_2B8C", "sub_2CE0", "sub_2F54", "sub_2F8C", "sub_2FE4", "sub_30A4", "sub_30D8", "sub_3148", "sub_317C", "sub_33BC", "sub_34FC", "sub_3538", "sub_3674", "sub_3A28", "sub_3BDC", "sub_4340", "sub_440C", "sub_4570", "sub_468C", "sub_47AC", "sub_495C", "sub_4B74", "sub_4BB8", "sub_4BFC", "sub_4C40", "sub_4C74", "sub_4E4C", "sub_5008", "sub_51B8", "sub_5304", "sub_55EC", "sub_5668", "sub_571C", "sub_583C", "sub_5894", "sub_58EC", "sub_5994", "sub_59DC", "sub_5A28", "sub_5A5C", "sub_5ABC", "sub_5B1C", "sub_5B54", "sub_5BF0", "sub_5C4C", "sub_5CAC", "_ZN9__arm_c_19__arm_c_0Ev", "sub_5D38", "sub_5DF8", "sub_5E44", "sub_5F4C", "sub_6028", "sub_6120", "sub_6154", "sub_616C", "sub_618C", "sub_61C4", "sub_6204", "sub_6238", "sub_6260", "sub_6270", "sub_62A8", "sub_6310", "sub_6344", "sub_6360", "sub_637C", "sub_63B4", "sub_6400", "sub_641C", "sub_64B8", "sub_6524", "sub_6554", "sub_65B0", "sub_6610", "sub_6624", "_ZN10DynCryptor9__arm_c_0Ev", "sub_6748", "sub_684C", "sub_6C60", "sub_6CD4", "_Z10__arm_a_21v", "_Z10__arm_a_20v", "sub_6E48", "sub_6F54", "sub_70B0", "sub_7218", "sub_7250", "sub_7288", "sub_7490", "sub_76B0", "sub_76F8", "sub_7AF0", "_Z9__arm_a_2PcmS_Rii", "sub_7BAC", "sub_7CDC", "sub_7DD0", "sub_7E08", "sub_7FDC", "JNI_OnLoad", "sub_86FC", "sub_8820", "sub_8A84", "sub_8BBC", "sub_8DC8", "sub_8E60", "sub_906C", "sub_925C", "sub_9290", "_Z9__arm_a_1P7_JavaVMP7_JNIEnvPvRi", "sub_9450", "sub_94B0", "nullsub_2", "sub_94F4", "sub_9514", "sub_9538", "sub_954C", "sub_957C", "sub_95A4", "sub_95D4", "nullsub_6", "nullsub_5", "nullsub_4", "nullsub_3", "j__ZdlPv_3", "j__ZdlPv_2", "j__ZdlPv_1", "j__ZdlPv_0", "j__ZdlPv", "sub_9620", "sub_9640", "sub_9674", "sub_9754", "sub_9780", "sub_97D0", "sub_9814", "sub_9870", "sub_98B4", "sub_9910", "sub_9988", "sub_9A08", "sub_9B90", "nullsub_1", "sub_9C04", "sub_9F14", "sub_9F60", "sub_A0A0", "sub_A374", "sub_A648", "sub_A848", "sub_B400", "sub_B460", "sub_B800", "sub_D400", "sub_DE4C", "sub_E0B4", "sub_E2F4", "sub_F000", "sub_10000", "sub_10100", "sub_10C8C", "sub_13400", "interpreter_wrap_int64_t", "interpreter_wrap_float", "interpreter_wrap_double", "interpreter_wrap_int64_t_bridge", "interpreter_wrap_float_bridge", "interpreter_wrap_double_bridge", "sub_1544C", "sub_15654", "sub_15670", "sub_15694", "sub_15728", "sub_15800", "sub_15818", "sub_158D4", "sub_15944", "sub_159CC", "sub_15A4C", "sub_15E98", "sub_160FC", "sub_1668C", "sub_167B4", "sub_16FFC", "__clear_cache", "__aarch64_sync_cache_range", "_Z9__arm_a_0v", "__imp_strcpy", "__imp_uncompress", "__imp_fmodf", "__imp_pthread_create", "__imp_snprintf", "__imp_syscall", "__imp_munmap", "__imp___errno", "__imp_getenv", "__imp__Znwm", "__imp_getpid", "__imp_fgets", "__imp_prctl", "__imp_memcpy", "__imp_puts", "__imp___cxa_finalize", "__imp_feof", "__imp_malloc", "__imp_vsnprintf", "__imp_select", "__imp_readdir", "__imp_isspace", "__imp_inotify_init", "__imp_dladdr", "__imp_lseek", "__imp__ZdlPv", "__imp_mmap", "__imp_pthread_detach", "__imp_abort", "__imp___stack_chk_fail", "__imp_strtol", "__imp_calloc", "__imp_kill", "__imp_dl_iterate_phdr", "__imp_fmod", "__imp_strstr", "__imp___cxa_pure_virtual", "__imp_read", "__imp_strncmp", "__imp_dlopen", "__imp_strncpy", "__imp_setenv", "__imp_strtok", "__imp_sscanf", "__imp_isalpha", "__imp_sigaction", "__imp_dlsym", "__imp_strdup", "__imp_fopen", "__imp_memset", "__imp__ZdaPv", "__imp_fclose", "__imp_time", "__imp_opendir", "__imp_strcmp", "__imp_inotify_add_watch", "__imp__Znam", "__imp_atoi", "__imp_strlen", "__imp_open", "__imp_mprotect", "__imp_closedir", "__imp_close", "__imp_raise", "__imp_free"];
var so_name = "libjiagu_64.so";
/*
    @param print_stack
    是否输出堆栈信息,默认为false
*/
var print_stack = false;
/*
    @param print_stack_mode
    - FUZZY: 打印尽可能多的堆栈信息
    - ACCURATE: 打印尽可能准确的堆栈信息
    - MANUAL: 如果打印堆栈报错退出, 使用该选项手动打印地址
*/

var print_stack_mode = "FUZZY";
function addr_in_so(addr){
    var process_Obj_Module_Arr = Process.enumerateModules();
    for(var i = 0; i < process_Obj_Module_Arr.length; i++) {
        if(addr>process_Obj_Module_Arr[i].base && addr<process_Obj_Module_Arr[i].base.add(process_Obj_Module_Arr[i].size)){
            console.log(addr.toString(16),"is in",process_Obj_Module_Arr[i].name,"offset: 0x"+(addr-process_Obj_Module_Arr[i].base).toString(16));
        }
    }
}
function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    //console.log(path);
                    if (path.indexOf(so_name) >= 0) {
                        this.is_can_hook = true;
                    }
                }
            },
            onLeave: function (retval) {
                if (this.is_can_hook) {
                    //you can do any thing before stalker trace so
                    
                    trace_so();
                }
            }
        }
    );
}

function trace_so(){
    var times = 1;
    var module = Process.getModuleByName(so_name);
    var pid = Process.getCurrentThreadId();
    console.log("start Stalker!");
    Stalker.exclude({
        "base": Process.getModuleByName("libc.so").base,
        "size": Process.getModuleByName("libc.so").size
    })
    Stalker.follow(pid,{
        events:{
            call:false,
            ret:false,
            exec:false,
            block:false,
            compile:false
        },
        onReceive:function(events){
        },
        transform: function (iterator) {
            var instruction = iterator.next();
            do{
                if (func_addr.indexOf(instruction.address - module.base) !== -1) {
                    console.log("call" + times + ":" + func_name[func_addr.indexOf(instruction.address - module.base)])
                    times = times + 1
                    if (print_stack) {
                        if (print_stack_mode === "FUZZY") {
                            iterator.putCallout((context) => {
                                console.log("backtrace:\n"+Thread.backtrace(context, Backtracer.FUZZY).map(DebugSymbol.fromAddress).join('\n'));
                                console.log('---------------------')
                            });
                        }
                        else if (print_stack_mode === "ACCURATE") {
                            iterator.putCallout((context) => {
                                console.log("backtrace:\n"+Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n'));
                                console.log('---------------------')
                            })
                        }

                        else if (print_stack_mode === "MANUAL") {
                            iterator.putCallout((context) => {
                                console.log("backtrace:")
                                Thread.backtrace(context, Backtracer.FUZZY).map(addr_in_so);
                                console.log('---------------------')
                            })
                        }
                    }
                }
                iterator.keep();
            } while ((instruction = iterator.next()) !== null);
        },

        onCallSummary:function(summary){

        }
    });
    console.log("Stalker end!");
}

setImmediate(hook_dlopen,0);
/*
Spawned `com.swdd.txjgtest`. Resuming main thread!
[Pixel 4::com.swdd.txjgtest ]-> start Stalker!
Stalker end!
call1:JNI_OnLoad
call2:j_interpreter_wrap_int64_t
call3:interpreter_wrap_int64_t
call4:_Znwm
call5:_Znam
call6:sub_10C8C
call7:memset
call8:sub_9988
call9:sub_DE4C
call10:calloc
call11:malloc
call12:free
call13:sub_E0B4
call14:_ZdaPv
call15:sub_9538
call16:sub_9514
call17:sub_9674
call18:sub_15654
call19:sub_15E98
call20:sub_159CC
call21:sub_1668C
call22:sub_15A4C
call23:sub_15728
call24:sub_15694
call25:sub_94B0
call26:sub_906C
call27:dladdr
call28:strstr
call29:setenv
call30:_Z9__arm_a_1P7_JavaVMP7_JNIEnvPvRi
call31:sub_9A08
call32:sub_954C
call33:j__ZdlPv_1
call34:_ZdlPv
call35:sub_9290
call36:sub_7BAC
call37:strncpy
call38:sub_5994
call39:sub_5DF8
call40:sub_4570
call41:sub_59DC
call42:_ZN9__arm_c_19__arm_c_0Ev
call43:sub_9F60
call44:sub_957C
call45:sub_94F4
call46:sub_5D38
call47:sub_5E44
call48:memcpy
call49:sub_5F4C
call50:sub_583C
call51:sub_571C
call52:j__ZdlPv
call53:j__ZdlPv_0
call54:j__ZdlPv_2
call55:sub_9F14
call56:sub_9640
call57:sub_5894
call58:sub_58EC
call59:sub_9B90
call60:sub_2F54
call61:uncompress
call62:sub_440C
call63:sub_4BFC
call64:sub_4C74
call65:sub_5304
call66:sub_4E4C
call67:sub_5008
call68:mprotect
call69:strlen
call70:sub_3674
call71:dlopen
call72:sub_4340
call73:sub_3A28
call74:sub_3BDC
call75:sub_2F8C
call76:dlsym
call77:strcmp
call78:sub_5668
call79:sub_4C40
call80:sub_5BF0
call81:sub_7CDC
call82:sub_468C
call83:sub_7E08
call84:sub_86FC
call85:sub_8A84
call86:sub_7FDC
call87:interpreter_wrap_int64_t_bridge
call88:sub_9910
call89:sub_15944
call90:puts
Process crashed: java.lang.UnsatisfiedLinkError: JNI_ERR returned from JNI_OnLoad in "/data/data/com.swdd.txjgtest/.jiagu/libjiagu_64.so"

***
FATAL EXCEPTION: main
Process: com.swdd.txjgtest, PID: 18940
java.lang.UnsatisfiedLinkError: JNI_ERR returned from JNI_OnLoad in "/data/data/com.swdd.txjgtest/.jiagu/libjiagu_64.so"
        at java.lang.Runtime.load0(Runtime.java:938)
        at java.lang.System.load(System.java:1631)
        at com.stub.StubApp.attachBaseContext(SourceFile:134)
        at android.app.Application.attach(Application.java:351)
        at android.app.Instrumentation.newApplication(Instrumentation.java:1156)
        at android.app.LoadedApk.makeApplication(LoadedApk.java:1218)
        at android.app.ActivityThread.handleBindApplication(ActivityThread.java:6431)
        at android.app.ActivityThread.access$1300(ActivityThread.java:219)
        at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1859)
        at android.os.Handler.dispatchMessage(Handler.java:107)
        at android.os.Looper.loop(Looper.java:214)
        at android.app.ActivityThread.main(ActivityThread.java:7356)
        at java.lang.reflect.Method.invoke(Native Method)
        at com.android.internal.os.RuntimeInit$MethodAndArgsCaller.run(RuntimeInit.java:492)
        at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:930)
***
[Pixel 4::com.swdd.txjgtest ]->

Thank you for using Frida!
*/