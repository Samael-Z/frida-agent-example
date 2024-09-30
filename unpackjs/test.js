function dump_dex(){

    console.log("test 创建文件！")
    var file = new File("/sdcard/Download/samle/dex_size2.dex" ,"wb");
    file.flush();
    file.close();
}

setImmediate(dump_dex)