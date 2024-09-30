



function stage1(){


    Java.perform(function(){


        //第一层解锁
        console.log("[+]  enter hooking 1")
        var javaString = Java.use("java.lang.String")

        for(var i = 1; i< 10000; i++){
            var i_str = javaString.$new(String(i))
            var recogCode = Java.use("com.shimeng.颜如玉.颜如玉QQ2693533893").get(i_str)
            var final_last9 = Java.use("com.shimeng.qq2693533893.MyServiceOne")
            .颜如玉(Java.use("com.shimeng.颜如玉.颜如玉QQ2693533893")
            .getSaltMD5(javaString.$new(String(i ^ 1288))))
            var final_final_last9 = javaString.$new(final_last9).replaceAll("\\D+","")
            if(recogCode == "❥●※"){
                console.log("i_str = ",i_str,
                    "recogCode =", recogCode, 
                    "final_last9 =  ",final_last9, 
                    "final_final_last9 = ",final_final_last9
                )
            }
            

        }

        console.log("[+]  enter hooking 2")





        var yry = null
        Java.choose("com.shimeng.颜如玉.颜如玉QQ2693533893",{
                onMatch : function(instance){
                    console.log("find instance",instance)
                    yry = instance
                },
                onComplete : function(){}

        })



        //md52
        for(var i=100;i<1000;i++){
            var i_str = javaString.$new(String(i));
            var md5 = yry.getTwiceMD5ofString(yry.hex_sha1(i_str));
            if (md5 == "8D4FF507DCDA63C201EB8B99D4170900"){ // 5147
                console.log("md5--->",md5,i_str);
            }
        }


    
        var i_str = javaString.$new(String(7681))
        var recogCode = Java.use("com.shimeng.颜如玉.颜如玉QQ2693533893").get(i_str)
        var v3 = yry.getTwiceMD5ofString(i_str)
        var v3_1 = yry.hex_sha1(v3)
        var v3_1_1 = javaString.$new(v3_1).replaceAll("\\D+","")
        console.log("i_str = ",i_str,
            "recogCode =", recogCode, 
            "v3_1 =  ",v3_1, 
            "v3_1_1 = ",v3_1_1
        )



        var ikey = javaString.$new(String(123456))
        var ikeySign = Java.use("com.shimeng.颜如玉.颜如玉QQ2693533893").hex_sha1(ikey)
        Java.choose("com.shimeng.qq2693533893.MyServiceOne",{
            onMatch:function(instance){
                console.log("found instance",instance)
                instance.坐等前往世界的尽头的小船.value = ikeySign;
            },onComplete(){console.log("search completed!")}
        })

    })

}



function md51(){
    Java.perform(function(){
        var javaString = Java.use('java.lang.String')

        for(var i=100;i<1000;i++){
            var i_str = javaString.$new(String(i));
            var mySevices = Java.use("com.shimeng.qq2693533893.MyServiceOne")
            var yryclass = Java.use("com.shimeng.颜如玉.颜如玉QQ2693533893")
            var sha1 = mySevices.颜如玉(i_str);
            var md5 = yryclass.getSaltMD5(sha1)
            if (md5 == "9DDEB743E935CE399F1DFAF080775366"){ // 5147
                console.log("md5--->",md5,i_str);
            }
        }

    })
}

function md52(){
    Java.perform(function(){
        var javaString = Java.use('java.lang.String')

        for(var i=100;i<1000;i++){
            var i_str = javaString.$new(String(i));
            var mySevices = Java.use("com.shimeng.qq2693533893.MyServiceOne")
            var yryclass = Java.use("com.shimeng.颜如玉.颜如玉QQ2693533893")
            var md5 = mySevices.破解死妈.getTwiceMD5ofString(yryclass.hex_sha1(i_str));
            if (md5 == "8D4FF507DCDA63C201EB8B99D4170900"){ // 5147
                console.log("md5--->",md5,i_str);
            }
        }

    })
}

setImmediate(stage1)