

function hookextractDataFromFile(){

    Java.perform(function(){
        console.log("enter perform")
        let YSQDActivity = Java.use("com.zj.wuaipojie2024_1.YSQDActivity");

        var flag = YSQDActivity.extractDataFromFile("/data/user/0/com.zj.wuaipojie2024_1/files/ys.mp4")

        console.log(flag)//flag{happy_new_year_2024}

        //第二题，objeciton直接强行跳转activity for honest players only： flag{52pj_HappyNewYear2024}
        //YSQDActivity["extractDataFromFile"].implementation = function (str) {
          //  console.log(`YSQDActivity.extractDataFromFile is called: str=${str}`);
          //  let result = this["extractDataFromFile"](str);
          //  console.log(`YSQDActivity.extractDataFromFile result=${result}`);
           // return result;
       // };
    })

}



setImmediate(hookextractDataFromFile)