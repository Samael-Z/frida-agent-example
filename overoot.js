

//hook检测root函数，修改返回值

setImmediate(function(){

    console.log("[+] starting script")


    Java.perform(function(){

        console.log("[+] hooking calls to root detect")
        //1，修改a的返回值，是返回值为false
        //Java.use用于声明一个Java类 这里我们声明root检测的类
        var roota = Java.use("sg.vantagepoint.a.c")
        //类.函数.overload(参数类型).implementation = function(形参名称)

        roota.a.implementation  = function(){//这里我们需要hook的是rootDetect类中的a方法 a方法没有参数因此overload可以不用写

            console.log("[+] ----hook su finder------")
            var suFinder = this.a()
            console.log("su finder original return value is: ",suFinder.toString())

            suFinder = false
            console.log("su finder new return value is: ",suFinder.toString())
            
            return suFinder
        }

        
        roota.b.implementation  = function(){//这里我们需要hook的是rootDetect类中的a方法 a方法没有参数因此overload可以不用写

            console.log("[+] ----hook su finder------")
            var testKeysFinder  = this.b()
            console.log("su finder original return value is: ",testKeysFinder .toString())

            testKeysFinder  = false
            console.log("su finder new return value is: ",testKeysFinder .toString())
            
            return testKeysFinder
        }

        roota.c.implementation  = function(){//这里我们需要hook的是rootDetect类中的a方法 a方法没有参数因此overload可以不用写

            console.log("[+] ----hook su finder------")
            var superuserFileFinder  = this.c()
            console.log("su finder original return value is: ",superuserFileFinder .toString())

            superuserFileFinder  = false
            console.log("su finder new return value is: ",superuserFileFinder .toString())
            
            return superuserFileFinder
        }
    })


      //方法二 修改System.exit函数使app不退出 当app检测到android设备root时则会调用System.exit函数退出app
      //先注释掉
      /*
      Java.perform(function(){
        console.log("[+] alter system exit function starting")
        var exitclzz = Java.use("java.lang.System") 
        exitclzz.exit.implementation = function(){
            console.log("[+] ----hook exit------")
        }
      })
    */ 



      //verifyKey
//修改函数验证函数返回值为true即可
      Java.perform(function(){
        console.log("[+] alter verify function a")
        var aclazz = Java.use("sg.vantagepoint.uncrackable1.a") 
        aclazz.a.implementation = function(str){
            console.log("[+] ----hook a(string)------")
            var ret_value = this.a(str);
            ret_value = true
            return true
        }
      })

})