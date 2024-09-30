function dynmicField(){

    Java.perform(function () {
        Java.choose("com.example.junior.CalculatorActivity", 
            {
                onMatch : function (instance){

                    console.log("enter onMatch ---")

                    console.log("found instance => ",instance)
                    console.log("instance showText is => " , instance.showText.value)
                    instance.showText.value = "123"
                } , onComplete : function(){

                    console.log ("search complete")
                }
            }
        )
    })


}

setImmediate(dynmicField)