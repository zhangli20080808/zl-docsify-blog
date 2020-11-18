# 作用域

变量的合法使用范围
全局作用域 函数作用域 块级作用域

# 自由变量

一个变量在当前作用域没有定义，但被使用了 向上级作用域(父级作用域)层层查找，知道找到为止 如果到全局作用域还没有找到，那就是 not defined 属性查找机制

自由变量的查找，是在函数定义的地方，向上级作用域查找，不是在执行的地方！！！

# 闭包

作用域应用的特殊情况，有两种表现

1. 函数作为参数被传递
2. 函数作为返回值被返回

闭包的两大作用 1.保护私有变量不被外界干扰 2.利用他不销毁的原理存储一些值(单例)

注意？所有的自由变量的查找，是在函数定义的地方，向上级作用域查找，不是在执行的地方

如果按照我的理解 JavaScript 里面所有的函数都是闭包，因为有全局环境，所有的函数都可以访问全局变量。

```js
// 函数作为返回值
function A() {
  //a 就是 用 ES5 实现私有变量
  let a = 100;
  return function () {
    console.log(a); // 此处的a就是自由变量 没有定义 要从他定义的地方向父级作用域去查找
  };
}
const fn = A();
let a = 200;
fn(); //100
----------------// 函数作为参数
function print(fn) {
  let a = 300;
  fn();
};
let a = 200;
function fn() {
  console.log(a);
}
print(fn); //200   一定要注意 是在函数定义的时候的作用域的上级查找
```

简单点来讲 函数 A 内部有一个函数 B，函数 B 可以访问函数 A 中的变量，那么函数 B 就是闭包

```js
function A (){
  let a = 'zl'
  window.B = function(){
    console.log(a);
  }
}
A()
B()
对于闭包的解释可能是函数嵌套了函数，然后返回一个函数。其实这个解释是不完整的

循环中使用闭包解决 `var` 定义函数的问题

for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}

首先因为 setTimeout 是个异步函数，所以会先把循环全部执行完毕，这时候 i 就是 6 了，所以会输出一堆 6。

解决方式
1. 使用闭包的方式
for (var i = 1; i <= 5; i++) {
  ;(function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
}
我们首先使用了立即执行函数将 i 传入函数内部，这个时候值就被固定在了参数 j 上面不会改变，当下次执行 timer 这个闭包的时候，就可以使用外部函数的变量 j，从而达到目的

2. 使用 setTimeout 的第三个参数，这个参数会被当成 timer 函数的参数传入。
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j)
    },
    i * 1000,
    i
  )
}
3. 使用let
```

点击标签 依次弹出序号

```js
let i, a;
for (i = 0; i < 10; i++) {
  a = window.document.createElement('a');
  a.innerHTML = i + '<br>';
  a.addEventListener('click', function (e) {
    // 点击的时候执行
    e.preventDefault();
    alert(i);
  });
  document.body.appendChild(a);
}
// 这样没次点击 都会是10 为什么呢？ 因为 i 的作用域是全局 alert 的i 是自由变量 当我们开始点击的时候 事件循环早就结束了
// 改善  让每次循环的时候都去生成新的区块 i 就会不同
let a;
for (let i = 0; i < 10; i++) {
  a = window.document.createElement('a');
  a.innerHTML = i + '<br>';
  a.addEventListener('click', function (e) {
    e.preventDefault();
    alert(i);
  });
  document.body.appendChild(a);
}
```

# this 的几种赋值情况

1. 在 class 方法中调用
2. 箭头函数
   注意: this 取什么值 是在函数执行的时候确认的 不是在定义的时候 我们的 call 调用 是在执行的时候

```js
function fn1() {
  console.log(this);
}
fn1(); // 对于直接调用 foo 来说，不管 foo 函数被放在了什么地方，this 一定是 window  我们只需要记住，谁调用了函数，就是 this
fn1.call({ x: 200 }); //{ x: 200 }
const fn2 = fn1.bind({ x: 300 });
fn2(); // { x: 300 }
const c = new foo(); // 对于 new 的方式来说，this 被永远绑定在了 c 上面，不会被任何方式改变 this
```

注意 bind 也可以改变 this 的指向 只不过会返回一个新的函数去执行，要手动调用 call 不一样，直接调用就执行了 bind 不会立即调用,其他两个会立即调用

箭头函数的 this 永远取他上级的 this 不会产生执行上下文 取决于他的外部，
因为箭头函数没有自己的执行上下文，所以它会继承调用函数中的 this

```js
箭头函数其实是没有 this 的，只取决包裹箭头函数的第一个普通函数的 this
在这个例子中，因为包裹箭头函数的第一个普通函数是 a，所以此时的 this 是 window
function a() {
  return () => {
    return () => {
      console.log(this)
    }
  }
}
console.log(a()()())

注意 另外对箭头函数使用 bind 这类函数是无效的。 对于这些函数来说，this 取决于第一个参数，如果第一个参数为空，那么就是 window
思考？ 如果对一个函数多次bind 那么上下文是什么呢？

let a = {}
let fn = function () { console.log(this) }
fn.bind().bind(a)() // => ?

// fn.bind().bind(a) 等于
let fn2 = function fn1() {
  return function() {
    return fn.apply()
  }.apply(a)
}
fn2()
管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window

可能会发生多个规则同时出现的情况，这时候不同的规则之间会根据优先级最高的来决定 this 最终指向哪里
首先，new 的方式优先级最高，接下来是 bind 这些函数，然后是 obj.foo() 这种调用方式，最后是 foo 这种调用方式，同时，箭头函数的 this 一旦被绑定，就不会再被任何方式所改变。
```

```js
const zhangsan = {
  // 这个 setTimeout 的执行是 setTimeout 本身触发的执行 不是张三 zhagnsan.wait 这种方式执行
  wait() {
    setTimeout(function () {
      // window
      console.log(this);
    });
  },
};

const zhangsan = {
  sayHigh(){
    // 当前对象
    console.log(this)
  }
  wait() {
  // 这个地方箭头函数是被  setTimeout 触发的 this 永远取他上级的 this
    setTimeout(() => {
      // 指向当前对象
      console.log(this);
    });
  },
};

我们构造函数的这个this 指向的就是当前这个实例
```

相同点

1. call 和 apply 的第一个参数 thisArg，都是 func 运行时指定的 this，如果这个函数处于非严格模式下，则指定为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。
2. 都可以只传递一个参数。

```js
'use strict';
var doSth2 = function (a, b) {
  console.log(this);
  console.log([a, b]);
};
doSth2.call(0, 1, 2); // this 是 0 // [1, 2]
doSth2.apply('1'); // this 是 '1' // [undefined, undefined]
doSth2.apply(null, [1, 2]); // this 是 null // [1, 2]
```

this 的不同场景，如何取值
当做普通函数调用 使用 call apply bind 作为对象方法调用 在 class 方法中调用 箭头函数

```js
Function.prototype.bind1 = function (arguements) {
  // 接受很多参数 第一个 this  将arguements参数拆解为数组  伪数组->数组
  // call 通过  Array.prototype.slice执行的时候 将arguements赋值给其this
  // 1. call接受一些离散的值 apply接受数组 第一个参数 this
  // 2. 获取数组 this第一项
  // 3. 返回一个函数
  const args = Array.prototype.slice.call(arguements);
  const t = args.shift();
  // fn1.bind(...) 中的fn1  this 谁调用他了
  const self = this;
  return function () {
    return self.apply(t, args);
  };
};

function fn1(a, b, c) {
  console.log('this', this);
  s;
  console.log(a, b, c);
  return 'this is fn1';
}
const fn2 = fn1.bind1({ x: 100 }, 10, 20, 30);
fn2();
console.log(fn1.__proto__ === Function.prototype); //true
// 我们要重写 bind 就需要 Function.prototype
var args = Array.prototype.slice.call(arguments);
var args = [].slice.call(arguments);
// 将参数转换为真实的数组
var args = Array.from(arguments);
var args = [...arguments];
```

思路总结
函数定义在哪里 ?

1. call 是可以被所有方法调用的,所以毫无疑问的定义在 Function 的原型上!
2. 函数接收参数 ?
   绑定函数被调用时只传入第二个参数及之后的参数
3. 如何显式绑定 this ?
   如果调用者函数，被某一个对象所拥有，那么该函数在调用时，内部的 this 指向该对象。

- [手写 call 实现 1](https://www.cnblogs.com/web-chuan/p/11592261.html)
- [手写 call 实现 2](https://cloud.tencent.com/developer/article/1475924)

# 闭包的应用

1. 隐藏数据
2. 做一个简单的 cache 工具

```js
// 闭包隐藏数据，只提供 API
function createCache() {
  const data = {}; //闭包中的数据被隐藏，不被外界访问
  return {
    get(key) {
      return data[key];
    },
    set: function (key, value) {
      data[key] = value;
    },
  };
}

const a = createCache();
a.set('a', 200);
console.log(a.get('a')); // 200
```

jquery 闭包思想总结
先对立即执行函数做个总结
什么是立即执行函数 也是匿名函数 立即函数就是将函数定义和执行放在一起了。不需要调用，自动执行

```js
/*团队 成员1 --tab 组件*/
(function () {
  var name = '我的同位是好人';
  function fn() {
    console.log(name);
  }
  fn();
})();
传参(function (x, y) {
  alert(x + y);
})(3, 4);
将立即函数赋值给其他变量;
const rainman = (function (x, y) {
  return x + y;
})(2, 3);
特殊写方法;
~+-!(function () {
  alert('run!');
})();
~!(function () {
  alert('run!');
})();
(function () {
  alert('run!');
}.call());
(function () {
  alert('run!');
}.apply());
```

# 立即函数存在的问题

如果别人需要访问里面的多个函数或者变量 那么我们需要给 window 定义多个全局变量
呢么怎么做呢

1. 将我们需要获取的值赋值给 window 全局变量，使其成为 window 的一个属性
2. 定义一个含有闭包特性的匿名函数

```js
(function () {
  var name = 'SK';
  var sex = '男';
  function get1() {
    return name + ':' + sex;
  }
  function get2() {
    return name + ':' + sex;
  }
  var json = {
    name: name,
    sex: sex,
    get1: get1,
    get2: get2,
    on: function () {
      console.log('事件框架 - on');
    },
    html: function () {},
  };
  // 外界无法访问闭包中的函数，方法
  // 通过如下方式访问 相当于给全局对象扩充一个属性
  window.$$ = json;
})();
```

或者 将我们需要获取的值赋值给任意一个全局变量，使其成为这个全局变量的属性

```js
// window是默认系统全局面向，其实任何全局变量都可以，任何全局变量都可以
var o = new Object();
// 定义一个含有闭包特性的匿名函数
(function (w, obj) {
  var name = '书奎';
  var sex = '男';
  function get1() {
    return name + ':' + sex;
  }
  function get2() {
    return name + ':' + sex;
  }
  //        外界无法访问闭包中的函数，方法
  //        通过如下方式访问  相当于给全局对象扩充一个属性
  o.get = get1;
})();
console.log(o.get()); //书奎:男

/**
 * 1.必须将立即函数返回给另外一个变量 my
 * 2.在内部定义一个return {}
 * 3.通过my.get来访问立即函数中的变量
 */
const my = (function () {
  const name = '田佩瑶';
  const sex = '男';
  return {
    get: function () {
      return `${name}:${sex}`;
    },
  };
})();
console.log(my.get());
```

# 自己实现 自定义框架

```js
(function (w) {
  var zhangli = {
    add: function () {
      console.log('test');
    },
  };
  w.$$ = zhangli;
})(window);
$$.add();
```
