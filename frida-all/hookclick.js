function OnClickListenter(){

    Java.perform(function (){
        //以spawn启动进程的模式来注入的话
        Java.use("android.view.View").setOnClickListener.implementation = function (listener){
            if(listener != null){
                watch(listener , 'onClick')
            }

            console.log("spawn android.view.View")
            return this.setOnClickListener(listener)
        }

        //如果以frida以attach来注入的话
        Java.choose("android.view.View$ListenerInfo", {
            onMatch: function (instance) {
                instance = instance.mOnClickListener.value;
                if (instance) {
                    //console.log("mOnClickListener name is :" + getObjClassName(instance));
                  //  watch(instance, 'onClick');
                }
            },
            onComplete : function (){
                console.log("complete")
            }
        })

    } )

}


setImmediate(OnClickListenter)