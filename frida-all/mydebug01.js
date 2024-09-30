
function empty(){

    Java.perform(function(){

        console.log("welcome  frida!!!")

    })

}
function main(){
    empty()
}

setImmediate(main)