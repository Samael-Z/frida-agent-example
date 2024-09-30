function main(){

    Java.perform(function () {
        console.log("enter perform" )


        var clazz = Java.use("java.lang.Class")
        function inspectObject(obj){
            var obj_class = Java.cast(obj.getClass(),Class)
            var fields = obj_class.getDeclaredFields()
            var methods = obj_class.getDeclaredMethods()
            console.log("inspecting " + obj.getClass().toString())
            console.log("\t Fields:")
            for(var i in fields){
                console.log("\t\t  " + fields[i].toString())
            }
            console.log("\t methods:" )

            for(var i in methods){
                console.log("\t\t  " + methods[i].toString())
            }

        }
    })

}

setImmediate(main)