# 异步和单线程

1. 同步和异步的区别

   - js 是单线程语言，只能同时做一件事
   - 浏览器和 nodejs 已经支持 js 启动进程 ，如 web Worker
   - js 和 dom 渲染公用一个进程，因为 js 可修改 dom 结构(js 执行的过程中 dom 渲染必须 stop dom 渲染的时候 js 必须停止)
   - 遇到等待(网络请求，定时任务)，不能卡主
   - 异步 基于 callback 形式来调用
   - 基于 js 是单线程语言，异步不会阻塞代码执行

2. 手写 promise 加载一张图片

promise 解决了什么问题 回调地狱

3. 前端使用异步场景
   网路请求，如ajax加载图片
   定时任务 如果没有定时任务，js读不需要异步了 
```
console.log(1);
setTimeout(() => {
  console.log(2);
}, 1000);
console.log(3);
setTimeout(() => {
  console.log(4);
}, 0);
console.log(5);  // 1 3 5 4 2
```
