## 如何用 class 实现继承

本质上类似于一个模板，我们可以通过这个模板去构造一些东西

1. constructor
2. 属性
3. 方法

```js
class People {
  constructor(name) {
    this.name = name;
  }
  eating() {
    console.log('我是你爸爸');
  }
}
class Student extends People {
  constructor(name, number) {
    // this 当前构造的实例
    super(name);
    this.number = number;
  }
  sayHigh() {
    console.log(`我叫${this.name},学号是${this.number}`);
  }
}

class Teacher extends People {
  constructor(name, major) {
    super(name);
    this.major = major;
  }
  teach() {
    console.log(`我是老师${this.name},教大家${this.major}`);
  }
}
const xiaohong = new Student('zl', 333);
const xiaoming = new Student('xiaoming', 555);
const lis = new Teacher('missLi', 'English');
xiaohong.sayHigh(); //我叫zl,学号是333
xiaoming.eating(); //我是你爸爸
lis.teach(); //我是老师missLi,教大家English
```

# instanceof

1. 可以判断引用类型
2. Object 是所有人的一个父类
3. instanceof 是基于原型链实现的

   instanceof 判断这个类型到时属于哪个 class 或者属于哪个构造函数

```js
// 判断是不是数组 https://blog.csdn.net/qq_39207948/article/details/81052154
instanceof 前面这个变量顺着 xiaohong 隐式原型 往上找 能不能找到 第二个操作数 对应的显式原型
我们 xiaohong 顺着隐式原型一层一层往上找 能不能对应到 class 的显示原型 如果能对应到，instanceof 成立

console.log(xiaohong instanceof Student); //true
console.log(xiaohong instanceof People); // true
console.log(xiaohong instanceof Object); //true
console.log([] instanceof Object, {} instanceof Object); // true true
```

4. 实现

```js
// console.log([] instanceof Array)
// console.log([] instanceof Object)
//
// console.log([].__proto__ === Array.prototype)
// console.log([].__proto__.__proto__ === Object.prototype)

class A {}

let a = new A();
// 不能判断自定义类型
console.log(Object.prototype.toString.call(a));

function instanceOf(C, D) {
  D = D.prototype;
  C = C.__proto__;

  while (true) {
    if (C === null) {
      return false;
    }
    if (C === D) {
      return true;
    }
    C = C.__proto__;
  }
}

console.log(instanceOf(a, Array));
// 缺陷 如果是原始类型就不能检验了
let str = '123';
console.log(str instanceof String);
// 等价写法
console.log(String[Symbol.hasInstance](str));

class ValidateStr {
  //重写这方方法
  static [Symbol.hasInstance](x) {
    return typeof x === 'string';
  }
}

console.log(ValidateStr[Symbol.hasInstance]('hello'));
console.log('hello' instanceof ValidateStr);
```

# 谈谈你对原型链的理解

这个问题关键在于两个点，⼀个是原型对象是什么，另⼀个是原型链是如何形成的

## 原型对象

绝⼤部分的函数(少数内建函数除外)都有⼀个 prototype 属性,这个属性是原型对象⽤来创建新对象实例,⽽所有被创建的 对象都会共享原型对象,因此这些对象便可以访问原型对象的属性。

例如 hasOwnProperty() ⽅法存在于 Obejct 原型对象中,它便可以被任何对象当做⾃⼰的⽅法使⽤

```js
var person = { name: 'Messi', age: 29, profession: 'football player' };
console.log(person.hasOwnProperty('name')); //true
console.log(person.hasOwnProperty('hasOwnProperty')); //false
console.log(Object.prototype.hasOwnProperty('hasOwnProperty')); //true
// 由以上代码可知, hasOwnProperty() 并不存在于 person 对象中,但是 person 依然可以拥有此⽅法
// 所以 person 对象是如何找到 Object 对象中的⽅法的呢?靠的是原型链。
```
## 原型链
原因是每个对象都有 __proto__ 属性，此属性指向该对象的构造函数的原型。
对象可以通过 __proto__ 与上游的构造函数的原型对象连接起来，⽽上游的原型对象也有⼀个 __proto__ ，这样就形成 了原型链。
```js
1. class 实际上是函数，可见是语法糖 typeof Student;  //function
2. 隐式原型 __proto__ 和 显式原型 prototype

   简单理解 : 其实原型链就是多个对象通过 __proto__ 的方式连接了起来。
   为什么 obj 可以访问到 valueOf 函数，就是因为 obj 通过原型链找到了 valueOf 函数。

1. Object 是所有对象的爸爸，所有对象都可以通过 __proto__ 找到它
2. Function 是所有函数的爸爸，所有函数都可以通过 __proto__ 找到它
3. 函数的 prototype 是一个对象
4. 对象的 __proto__ 属性指向原型， __proto__ 将对象和原型连接起来组成了原型链

console.log(xiaohong.__proto__);
console.log(Student.prototype);
console.log(xiaohong.__proto__  === Student.prototype); // 引用的是一个内存地址

我们 class 一个 Student 的时候 会把 sayHigh 等一系列方法放到  Student.prototype上面
这个 sayHigh 我们是通过这个 隐式原型 来去指向  Student.prototype 获取

原型关系
1. 每个class都有显示原型 prototype
2. 每个实例都有隐式原型  __proto__
3. 实例的 __proto__ 指向对应 class 的显示原型 prototype

基于原型的执行规则 也就是属性查找法则
1. 获取属性 xiaohong.name 或执行 sayHigh方法时
2. 先在自身属性和方法寻找
3. 如果找不到就去 __proto__ 中查找

原型链  我们也可以把 People.prototype 理解成一个对象 是通过 people 实例化的
console.log(Student.prototype.__proto__);
console.log(People.prototype);
console.log(Student.prototype.__proto__ === People.prototype);  // true

怎么去判断是不是自己的属性呢
xiaohong.hasOwnProperty('name') // true
lis.hasOwnProperty('teach') //false 这个 teach 是对应 Teacher.prototype里的方法

Object.prototype上面有很多属性  toString hasOwnProperty
console.log(People.prototype.__proto__);
console.log(Object.prototype);
console.log(People.prototype.__proto__ === Object.prototype); //true
console.log(Object.prototype.__proto__ );   //null

v8 引擎就是 chrome 内置的一个 js 引擎，即用它来执行 js 代码。
js 说白了就是一堆字符串，得有一个环境去执行它，它才能作为一个代码来处理逻辑。v8 就是干这个的。
```

![](../static/img/prototype.png)

简易版 jquery

```js
jQuery-demo
class jQuery {
  constructor(selector) {
    // 伪数组
    const result = document.querySelector(selector);
    const length = result.length;
    for (let i = 0; i < result.length; i++) {
      this[i] = result[i];
    }
    this.length = length;
    this.selector = selector;
  }
  get(index) {
    return this[index];
  }
  each(fn) {
    for (let i = 0; i < this.length; i++) {
      const element = this[i];
      fn(element);
    }
  }
  on(type, fn) {
    return this.each(element => {
      element.addEventListener(type, fn, false);
    });
  }
}
考虑拓展性
插件
jQuery.prototype.dialog = function(info) {
  alert(info);
};
复写 造轮子
class myJquery extends jQuery {
  constructor(selector) {
    super(selector);
  }
  // 拓展自己的新方法
  addClass(className) {}
  style(data) {}
}
const $p = new jQuery('p')
$p.get(0)
$p.each((elem)=>console.log(elem.nodeName))
$p.on('click',()=>alert('11'))

```
