function dynmic01(){

        Java.perform(function (){


            Java.choose("com.example.junior.CalculatorActivity",{
                    onMatch : function(instance) {

                        console.log(Java.use("android.util.Log")
                        .getStackTraceString(Java.use("java.lang.Throwable")
                        .$new()))




                        console.log("found instance => ", instance)
                        console.log("instance showText is  = >", instance.clear("666"))
                        console.log("instance showText is  => ", instance.showText.value)


                    } , onComplete : function () {
                        console.log("Search complete")
                    }

            })


        })

}

setImmediate(dynmic01)