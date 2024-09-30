function encrpytStr(){
    Java.perform(function(){
        var a = Java.use("com.tianyu.util.a");
        a["a"].overload("java.lang.String").implementation = function(str){
            console.log(`a.a is called : str=${str}`);
            var result = this["a"](str);
            console.log(`a.a reulst = ${result}`);
    
            return result;
    
        }

    })


}
setImmediate(encrpytStr)


/*


a.a is called : str=q~tbyt>q``>QsdyfydiDxbuqt   a.a reulst = android.app.ActivityThread
a.a is called : str=sebbu~dQsdyfydiDxbuqt       a.a reulst = currentActivityThread
a.a is called : str=wudCicdu}S~duhd             a.a reulst = getSystemContext
a.a is called : str=q~tbyt>q``>QsdyfydiDxbuqt   a.a reulst = android.app.ActivityThread
a.a is called : str=sebbu~dQsdyfydiDxbuqt       a.a reulst = currentActivityThread
a.a is called : str=wud@bsucc^q}u               a.a reulst = getProcessName
a.a is called : str=s}>zw>rx>Bu`bdcDy}u         a.a reulst = com.jg.bh.ReportsTime






attachBaseContext
q~tbyt>s~du~d>`}>@qs{qwu@qbcub4@qs{qwu   result:android.content.pm.PackageParser$Package
q~tbyt>q``>QsdyfydiDxbuqt                  result:android.app.ActivityThread
sebbu~dQsdyfydiDxbuqt                        result:currentActivityThread
}Xyttu~Q`yGqb~y~wCxg~                      result:mHiddenApiWarningShown
onCreate
s}>zw>rx>Bu`bdcDy}u                       result:com.jg.bh.ReportsTime
BuwycdubQsdyfydiSq||Rqs{c                     result:RegisterActivityCallBacks

DtcLoader
q~tbyt>q``>QsdyfydiDxbuqt  result:android.app.ActivityThread
wudCicdu}S~duhd    result:getSystemContext
sebbu~dQsdyfydiDxbuqt    result:currentActivityThread


android 9 有特殊处理 "q~tb\u007fyt>s\u007f~du~d>`}>@qs{qwu@qbcub4@qs{qwu"  android.content.pm.PackageParser$Package

unicode转义字符
这个字符串是使用了Unicode转义序列的JavaScript字符串。在JavaScript中，`\u`后面跟随的四个数字是一个Unicode字符的编码。这种转义序列通常用于在字符串中嵌入特殊字符或者非ASCII字符。

在这个字符串中：

- `\u007f` 表示一个ASCII删除字符（DEL），其Unicode编码是 007F。
- `>` 是一个普通字符，表示大于号。
- `zw>rx>` 是普通的字符串序列。
- `Bu`` 是一个普通字符串，后面跟随的反引号 ` 是一个普通字符。
- `\u007f` 再次表示ASCII删除字符。
- `}u` 是普通的字符串序列。

将这些字符组合起来，我们得到的字符串是 `s}>zw>rx>Bu}`，其中 `` 是因为 `\u007f` 被渲染为一个不可打印的控制字符。

如果你想要看到这个字符串实际代表的内容，你可能需要在支持Unicode的编辑器或者环境中查看它，或者将其转换为一个可打印的字符序列。在大多数情况下，控制字符（如DEL）不会被直接显示。


*/