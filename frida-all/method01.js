//hook类的所有方法

/*
Java.perform(function () {

    var clazz = Java.use("com.example.junior.CalculatorActivity")
    var methods = clazz.class.getDeclaredMethods()
    for(var i = 0; i < methods.length; i++){

        var methodName = methods[i].getName()
        console.log(methodName)
    }
})
    */

function main(){


    Java.perform(function () {

        Java.enumerateLoadedClasses({

            onMatch : function(name , handle){

                //console.log(" enter onMatch")
                if(name.indexOf("com.example.junior.CalculatorActivity") != -1){
                    console.log(name ,handle)
                    //利用反射，获取类中的所有方法
                    var TargetClass = Java.use(name)
                    // return Method object list
                    var methodsList  = TargetClass.class.getDeclaredMethods()

                    for(var i = 0; i <  methodsList.length; i++){

                        console.log(methodsList[i].getName())
                    }
                }
            } ,onComplete : function(){

                console.log("search complete")
            }

        })

    })
}

setImmediate(main)