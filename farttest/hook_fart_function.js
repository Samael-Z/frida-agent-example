function hook_fart(){

    var libartaddr = Process.getModuleByName("libart.so")

    var Exports = libartaddr.enumerateExports();
    for(var i = 0; i < Exports.length; i++) {
        if(Exports[i].name.indexOf("ooxx") != -1){
                    //函数类型
        //console.log("type:",Exports[i].type);
        //函数名称
        console.log("name:",Exports[i].name);
        //函数地址
       // console.log("address:",Exports[i].address);

       /*
        name: ooxxMethodLoadMethod
        name: ooxxMethodExecute
        name: myooxxInvoke
        name: _ZN3art10ooxxMethodEPNS_9ArtMethodE
       */
        }

     }

}



function main(){

}
setImmediate(main)