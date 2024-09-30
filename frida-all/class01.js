function class01(){

    Java.perform(function () {


        console.log("enter enumerating classes...")

        Java.enumerateLoadedClasses({

            onMatch: function(_calssname ){

                console.log("[*]  found instance of " + _calssname)
                

            },onComplete :function() {
                console.log("search complete")
            }
        })
    })
}

setImmediate(class01)