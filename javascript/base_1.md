# 值类型 和 引用类型的区别

值类型 undefined Number 数值类型 字符串 布尔值 Symbol
引用类型 对象 数组 null--特殊引用类型，指针指向空数组 函数--特殊引用类型，但不用于存储数据，所以没有拷贝复制函数这一说

# typeOf 运算符

1.判断所有值类型 2.能判断函数 3.能识别引用类型(但不能继续识别)

# 深拷贝

拷贝之后保持原始对象的值不变
思考？ object.assign 是深拷贝还是浅拷贝

因为 Object.assign()拷贝的是属性值。假如源对象的属性值是一个对象的引用，那么它也只指向那个引用。也就是说，如果对象的属性值为简单类型（如 string， number），通过 Object.assign({},srcObj);得到的新对象为深拷贝；如果属性值为对象或其它引用类型，那对于这个对象而言其实是浅拷贝的

实现深拷贝的几种方法

1. JSON.stringify 和 JSON.parse
   用 JSON.stringify 把对象转换成字符串，再用 JSON.parse 把字符串转换成新的对象。如果对象中包含 function 或 RegExp 这些就不能用这种方法了

```
function deepClone(obj) {
  let _obj = JSON.stringify(obj);
  let objClone = JSON.parse(_obj);
  return objClone;
}
```

2. Object.assign()拷贝 当对象中只有一级属性，没有二级属性的时候，此方法为深拷贝，但是对象中有对象的时候，此方法，在二级属性以后就是浅拷贝。

3. lodash.cloneDeep()实现深拷贝

```
let _ = require('lodash');
let obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
let obj2 = _.cloneDeep(obj1);
```

4. 通过 jQuery 的 extend 方法实现深拷贝

```
let $ = require('jquery');
let obj1 = {
   a: 1,
   b: {
     f: {
       g: 1
     }
   },
   c: [1, 2, 3]
};
let obj2 = $.extend(true, {}, obj1);
```

5. 使用递归的方式实现深拷贝

```
/**
 * 深拷贝
 */
const obj = {
  name: 'zhangli',
  age: 20,
  address: {
    city: 'beijing'
  },
  arr: [1, 2, 3]
};
/**
 * 深拷贝
 * @param {*} obj  要拷贝的对象
 */
function deepClone(obj = {}) {
  //如果不是对象或者数组 直接返回F
  if (typeof obj !== 'object' || typeof obj == null) {
    return obj;
  }
  //初始化结果
  let result;
  if (obj instanceof Array) {
    result = [];
  } else {
    result = {};
  }
  for (let key in obj) {
    //保证key不是原型的属性
    if (obj.hasOwnProperty(key)) {
      //递归调用
      result[key] = deepClone(obj[key]);
    }
  }
  return result;
}
const obj2 = deepClone(obj);
obj2.address.city = 'gansu';
obj2.arr[0] = 'a3'
console.log(obj.address.city); //beijing
console.log(obj.arr[0]); // a3
```

# 变量计算-类型转换

- 字符串拼接
- ==
- if 语句 逻辑判断

```
const b = 100 + '10'
console.log(b); // 10010  100+ parseInt('10)

// 除了 == null 其他地方都用 ===
const obj = { x: 100 };
if (obj.a == null) {}
//相当于 if(obj) if (obj.a === null || obj.a === undefined) {}

truely变量：  !!a === true 的变量
falsely变量：  !!a === false 的变量 比如 !!0 undefined null '' false NaN

我们if语句里面其实判断的就是 truely变量 或者 falsely变量 并不是判断 true/false
```
