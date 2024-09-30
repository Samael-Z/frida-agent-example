
function callsub(a,b){
    
    Java.perform(function(){
        var Arith = Java.use("com.example.junior.util.Arith")
        var jstring = Java.use("java.lang.String")
        var result = Arith.sub(jstring.$new(a),jstring.$new(b))
    
        console.log(a,"-",b, " = ",result)
        //send(a,"-",b, " = ",result)
    
    })
}

rpc.exports ={
    sub : callsub,
}; 


