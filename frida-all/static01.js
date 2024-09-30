function static01(){
    
    Java.perform(function (){ // 只要是java代码都要跑在java.perform里面


        console.log("function static() calls")
        Java.use("com.example.junior.util.Utils").dip2px.implementation == function (context,float){


            var result = this.dip2px(context,100)
            console.log("context ,float, result  ==>" , context, float , result)
            //打印栈
            console.log(
                Java.use("com.android.Log").getStackTraceString(
                    Java.use("java.lang.Throwable").$new()
                )
            )
            return 26
        }



    })
}

setImmediate(static01)
