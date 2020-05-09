# import 和 require 导入的区别

1. 前者是值的引用，后者是值的拷贝。
2. 前者编译时输出接口，后者运行时加载。

# 写一个 promise 重试函数，可以设置时间间隔和次数

function foo(fn, interval, times) {}
