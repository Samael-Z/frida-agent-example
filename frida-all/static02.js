function staticField(){

    Java.perform(function(){

        var divscale = Java.use("com.example.junior.util.Arith").DEF_DIV_SCALE.value

        console.log("divscale is ", divscale)

        Java.use("com.example.junior.util.Arith").DEF_DIV_SCALE.value = 20
        divscale = Java.use("com.example.junior.util.Arith").DEF_DIV_SCALE.value
        console.log("divscale2 is ", divscale)
    })
}

setImmediate(staticField)