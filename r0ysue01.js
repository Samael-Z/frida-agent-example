setTimeout(
    function(){
        Java.perform(function(){
            console.log("hello frida!")
        })
    }
)

//settimeout 几毫秒后调用function执行