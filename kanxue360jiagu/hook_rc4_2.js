function hook_rc4_encrypt(){

    var module =Process.getModuleByName("libjiagu_64.so");
    Interceptor.attach(module.base.add(0x58ec),{
        onEnter:function(args){
            console.log("hook_rc4_encrypt arg0",hexdump(args[0],{
                offset:0,
                length:0x20,
                header:true,
                ansi:true
            }))
            console.log("hook_rc4_encrypt arg1",args[1])
            console.log("hook_rc4_encrypt arg2",hexdump(args[2],{
                offset:0,
                length:0x110,
                header:true,
                ansi:true
            }))

        },onLeave:function(retval){

        }
    })

}

function hook_rc4_init(){
    var module = Process.getModuleByName("libjiagu_64.so")
    Interceptor.attach(module.base.add(0x571c),{
        onEnter:function(args){
            console.log("hook_rc4_init arg0",hexdump(args[0],{
                offset:0,
                length:0x20,
                header:true,
                ansi:true
            }))
            console.log("hook_rc4_init arg1",args[1])


        },onLeave:function(retval){

        }
    })
}

function hook_android_dlopen_ext(){
    var android_dlopen_ext = Module.getExportByName("libdl.so","android_dlopen_ext")
    Interceptor.attach(android_dlopen_ext,{
        onEnter:function(args){
            var loadfile = args[0].readCString()
            if(loadfile.indexOf("libjiagu") != -1){
                this.is_can_hook = true
            }

        },onLeave:function(retval){
            if(this.is_can_hook){
               
                
                hook_rc4_init()
                hook_rc4_encrypt()

            }
        }
    })
}

setImmediate(hook_android_dlopen_ext)

/*
Spawned `com.swdd.txjgtest`. Resuming main thread!
[Pixel 4::com.swdd.txjgtest ]-> 
hook_rc4_init arg0              
            0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
71a35d99d0  76 56 57 34 23 91 23 53 56 74 00 00 00 00 00 00  vVW4#.#SVt......
71a35d99e0  20 c8 1e b2 70 00 00 00 00 00 00 00 00 00 00 00   ...p...........
hook_rc4_init arg1 0xa
hook_rc4_encrypt arg0              
            0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
710e253080  eb 57 7f bf a5 a0 33 14 04 2e e6 7b 77 78 29 37  .W....3....{wx)7
710e253090  56 4b 9c c5 f0 13 a1 86 b2 19 ac ca ea d0 72 09  VK............r.
hook_rc4_encrypt arg1 0xb9956
hook_rc4_encrypt arg2              
            0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
710df64cc0  76 ac 57 5d 84 1a 43 9d fb 5f f8 59 35 9c 05 36  v.W]..C.._.Y5..6
710df64cd0  cd d1 01 cc 39 49 b6 10 0e 5e 2e 2a 29 7f 72 88  ....9I...^.*).r.
710df64ce0  9f 13 2c 6f 44 9b 67 4a e0 ee 77 34 97 0b 68 0c  ..,oD.gJ..w4..h.
710df64cf0  4f cf 8f 95 83 52 ef 78 6a de 09 1d b5 48 a8 a1  O....R.xj....H..
710df64d00  46 85 02 e7 cb 41 b3 3e 71 b9 3b e4 53 c9 73 42  F....A.>q.;.S.sB
710df64d10  e5 30 25 75 f9 df 14 38 ae d2 0d 82 6c 93 6e be  .0%u...8....l.n.
710df64d20  5b 20 f3 47 d8 f1 8b 64 b1 ab ad f6 b8 7a 80 4d  [ .G...d.....z.M
710df64d30  b7 56 ec b0 66 18 c4 92 33 c8 60 4e 31 d9 5a 03  .V..f...3.`N1.Z.
710df64d40  e6 15 d3 a3 21 a7 1c c1 26 3c 1e 70 bf a2 c5 c3  ....!...&<.p....
710df64d50  a0 c2 c0 98 28 89 50 4b 90 6b e1 55 79 7c fd ff  ....(.PK.k.Uy|..
710df64d60  e3 aa 2b a4 bd 62 2f 16 b4 7e c6 fe 63 da 51 d6  ..+..b/..~..c.Q.
710df64d70  32 3a 11 c7 3f 8e d5 ea a5 ba ca ed 08 22 74 5c  2:..?........"t\
710df64d80  24 4c 7b bb a9 8d 96 91 1b f2 17 94 45 19 ce 06  $L{.........E...
710df64d90  8a 65 37 86 f5 12 9a 69 8c 87 d4 e8 6d eb 58 23  .e7....i....m.X#
710df64da0  00 40 1f af 99 dd 04 9e 7d 0a a6 81 f0 f7 3d e9  .@......}.....=.
710df64db0  db 0f bc 27 fa e2 fc f4 b2 d0 dc d7 54 07 2d 61  ...'........T.-a
710df64dc0  03 05 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
*/