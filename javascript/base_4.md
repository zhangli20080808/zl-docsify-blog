# 异步和单线程

1. 同步和异步的区别

   - js 是单线程语言，只能同时做一件事
   - 浏览器和 nodejs 已经支持 js 启动进程 ，如 web Worker
   - js 和 dom 渲染公用一个进程，因为 js 可修改 dom 结构(js 执行的过程中 dom 渲染必须 stop dom 渲染的时候 js 必须停止)
   - 遇到等待(网络请求，定时任务)，不能卡主
   - 异步 基于 callback 形式来调用
   - 基于 js 是单线程语言，异步不会阻塞代码执行 同步会阻塞代码执行

2. 手写 promise 加载一张图片

promise 解决了什么问题 回调地狱

```
function getImage(src) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      const err = new Error('图片加载失败');
      reject(err);
    };
    img.src = src;
  });
}
```

3. 前端使用异步场景
   网路请求，如 ajax 加载图片
   定时任务 如果没有定时任务，js 读不需要异步了

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

# JS 事件循环

- JS 是单线程语言：顺序执行
- 任务队列
  ![](../static/img/js-event.jpg)

```
//sleep为一个同步任务，10000为执行时间 执行的同时 task先被放到了event table 等三秒之后才会把他放到事件队列里面，因为是异步的
// 10s执行的时候 3s也在计数
setTimeout(() => {
  task(); // 10后执行
}, 3000);
sleep(10000);
```

注：即便主线程为空，0 毫秒实际上也是达不到的。根据 HTML 的标准，最低是 4 毫秒。

- Promise
  Promise 新建后就会立即执行。
  macro-task(宏任务)：整体代码 script，setTimeout，setInterval
  micro-task(微任务)： Promise
  注：在事件循环中，永远先执行可执行的微任务
  ![](../static/img/js-event2.jpg)

  ```
    console.log('11');
    setTimeout(function() {
        console.log('1');
    });

    new Promise(function(resolve) {
      console.log('2');
      for (var i = 0; i < 10000; i++) {
        i == 99 && resolve();
      }
    }).then(function() {
      console.log('3');
    });
    console.log('4');
  ```

  ```
  console.log('1');
  setTimeout(function() {
    console.log('2');
    new Promise(function(resolve) {
      console.log('3');
      resolve();
      //先执行.then 还是 setTimeout呢
    }).then(function() {
      console.log('4');
    });
  });
  new Promise(function(resolve) {
    console.log('5');
    resolve();
  }).then(function() {
    console.log('6');
  });
  setTimeout(function() {
    console.log('7');
    new Promise(function(resolve) {
      console.log('8');
      resolve();
    }).then(function() {
      console.log('9');
    });
  });

  ```

  # 函数柯里化

  1. 什么事函数柯里化？

  ```
  // 通过把一个多参函数转换成一系列嵌套的函数，每个函数依次接受一个参数，这就是函数柯里化。
  function multiply(a, b, c) {
  return a * b * c;
  }
  multiply(1, 2, 3); // 6
  // 柯里化后：
  function multiply(a) {
  return b => {
    return c => {
      return a * b * c;
    };
  };
  }
  multiply(1)(2)(3); // 6
  console.log(multiply(1)(2)(3));

  ```

  ```
  // length 是函数对象的一个属性值,指该函数有多少个必须要传入的参数,即形参的个数
    let _fn = curry(function(a, b, c, d, e) {
      console.log(a + b + c + d + e, '11');
    });

    function curry(fn, len = fn.length) {
      return _curry.call(this, fn, len);
    }

    function _curry(fn, len, ...args) {
      return function(...params) {
        console.log(params);
        let _args = [...args, ...params];
        console.log(_args);
        if (_args.length >= len) {
          return fn.apply(this, _args);
        } else {
          // 没达到五个参数 递归调用 和前面的参数进行拼接
          return _curry.call(this, fn, len, ..._args);
        }
      };
    }
    // 最终拼成了原始的 _fn(1,2,3,4,5)
    // _fn(1,2,3,4,5);    //15
    // _fn(1)(2)(3,4,5);  //15
    // _fn(1,2)(3,4)(5);  //15
    // _fn(1)(2)(3)(4)(5);  //15

  ```
