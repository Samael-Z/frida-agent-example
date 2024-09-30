function main(){



    console.log("starting exec junior01.js-------")
    Java.perform(function(){

        var Arith = Java.use("com.example.junior.util.Arith")
        Arith.sub.overload("java.lang.String","java.lang.String").implementation = function(str1 , str2){

            var result = this.sub(str1,str2)

            console.log("str1 + str2 = ",str1 , str2 , result)
            //打印java调用栈

            console.log(Java.use("android.util.Log")
            .getStackTraceString(Java.use("java.lang.Throwable")
            .$new()))

            return result

        }


    })
}

setImmediate(main)