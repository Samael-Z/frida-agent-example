import sys

import frida


def on_message(message,data):  #js中执行send函数后要回调的函数

    base = message['payload']['base']
    size = int(message['payload']['base'])
    print(hex(base),size)


package = sys.argv[1]

print("dex 导出目录为：/data/data/%s"%(package))

device = frida.get_usb_device()  #得到设备并劫持进程com.example.testfrida（该开始用get_usb_device函数用来获取设备，但是一直报错找不到设备，改用get_remote_device函数即可解决这个问题）
pid = device.spawn(package)
session = device.attach(pid)

# 从此处开始定义用来Hook的javascript代码
src = """  
Interceptor.attach(Module.findExportByName("libdexfile.so", "_ZN3art13DexFileLoader10OpenCommonEPKhjS2_jRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPKNS_10OatDexFileEbbPS9_NS3_10unique_ptrINS_16DexFileContainerENS3_14default_deleteISH_EEEEPNS0_12VerifyResultE"), {
    onEnter: function (args) {


        console.log("my_frida_unpack.py is exec")
        var begin = args[1]

        console.log("magic : " + Memory.readUtf8String(begin))

        var address = parseInt(begin,16) + 0x20

        var dex_size = Memory.readInt(ptr(address))

        console.log("dex_size :" + dex_size)

        var file = new File("/data/data/%s/" + dex_size + ".dex", "wb")
        file.write(Memory.readByteArray(begin, dex_size))
        file.flush()
        file.close()

        var send_data = {}
        send_data.base = parseInt(begin,16)
        send_data.size = dex_size
        send(send_data)
    },
    onLeave: function (retval) {
        if (retval.toInt32() > 0) {
        }
    }
});
""" % (package)

script = session.create_script(src)  #创建js脚本
script.on("message" , on_message)

script.load()
device.resume(pid)
sys.stdin.read()