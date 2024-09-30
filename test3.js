//练习简单的js代码

console.log("当前正在运行的安卓版本：",Java.androidVersion)
//枚举当前类
//callbacks有一个对象执行，onMatch(name,handle):调用每个加载的类，name可以传递该类use()以获取javascript包装器，你也可以java.cast()到handle。java.lang.class
//onComplete()枚举所有类调用
Java.enumerateLoadedClasses(callbacks)
Java.enumerateClassLoadersSync()  //同步版本
enumerateLoadedClasses()    //返回数组中的类名


//枚举 java VM中存在的类加载器，其中callbacks是一个对象，指定：
//onMatch(loader)：为每个类加载器调用loader
//一个特定的包装器java.lang.classloader
//onComplete：枚举所有类加载器调用 
Java.enumerateClassLoaders(callbacks)   

Java.scheduleOnMainThread(fn) //在VM的主线程上运行
Java.perform(fn) //确保当前线程附加到VM并调用fn，这在java回调中不是必须的，fn如果应用程序的类加载不可用，则推迟调用
Java.use().