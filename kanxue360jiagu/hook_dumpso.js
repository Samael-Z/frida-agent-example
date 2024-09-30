
/*
function dump_so() {
    var soName = "libjiagu_64.so";
    var libSo = Process.getModuleByName(soName);
    var save_path = "/data/data/com.swdd.txjgtest/" + libSo.name + "_Dump";
    console.log("[Base]->", libSo.base);
    console.log("[Size]->", ptr(libSo.size));
    var handle = new File(save_path, "wb");
    Memory.protect(ptr(libSo.base), libSo.size, 'rwx');
    var Buffer = libSo.base.readByteArray(libSo.size);
    handle.write(Buffer);
    handle.flush();
    handle.close();
    console.log("[DumpPath->]", save_path);
 
}
setImmediate(dump_so);

*/



function dump_so(){

    var soName = "libjiagu_64.so";
    var libso = Process.getModuleByName(soName);
    var save_Path = "/data/data/com.swdd.txjgtest/dump_" + libso.name;
    console.log("[base]-> " ,libso.base);
    console.log("[size pointer]-> ",ptr(libso.size));
    console.log("[size]-> ",libso.size);
    var handle = new File(save_Path,"wb")
    Memory.protect(ptr(libso.base),libso.size,"rwx")
    var Buffer = libso.base.readByteArray(libso.size);
    handle.write(Buffer);
    handle.flush();
    handle.close();
    console.log("[dump path->] ",save_Path);


}


setImmediate(dump_so)

//在使用setImmediate时没有参数不用使用(),setImmediate(dump_so()) 汇报这个错误
//TypeError: cannot read property 'apply' of undefined
//at <anonymous> (frida/runtime/core.js:51)

/*

(frida16) G:\android\frida-agent-example\kanxue360jiagu>frida -U -F com.swdd.txjgtest -l hook_dumpso.js
     ____
    / _  |   Frida 16.4.10 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
   . . . .
   . . . .   Connected to Pixel 4 (id=9B211FFAZ004FG)
[base]->  0x6ed7e03000
[size pointer]->  0x27d000
[size]->  2609152
TypeError: not a function
    at dump_so (G:\android\frida-agent-example\kanxue360jiagu\hook_dumpso.js:13)
    at <eval> (G:\android\frida-agent-example\kanxue360jiagu\hook_dumpso.js:21)
[Pixel 4::txjgtest ]->

[Base]-> 0x6ed7e03000
[Size]-> 0x27d000
[DumpPath->] /data/data/com.swdd.txjgtest/libjiagu_64.so_Dump

20240910
[base]->  0x710fd03000
[size pointer]->  0x27d000
[size]->  2609152
[dump path->]  /data/data/com.swdd.txjgtest/dump_libjiagu_64.so
[Pixel 4::txjgtest ]->
*/