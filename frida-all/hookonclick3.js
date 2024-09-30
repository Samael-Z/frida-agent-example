






Java.perform(() => {
    //选择类
        const Mainactivity = Java.use("com.example.junior.CalculatorActivity")
        //选择onclick方法
        const onClick = Mainactivity.onClick
        onClick.implementation = function (v) {
    
            //函数被调用的时候打印一条消息
            send('onClick')
            //调用原始的onclick方法
            onClick.call(this,v)
            //调完之后修改值
    
            ///....
            ///...
            ///frida控制它打印结果
            //hook结束
    
            var inputText = onClick.inputText
            console.log('inputText    ',  inputText)
          
        }
    
    })








