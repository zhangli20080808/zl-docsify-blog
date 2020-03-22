# 值类型 和 引用类型的区别

值类型 undefined Number 数值类型 字符串 布尔值 Symbol
引用类型 对象 数组 null--特殊引用类型，指针指向空数组 函数--特殊引用类型，但不用于存储数据，所以没有拷贝复制函数这一说

# typeOf 运算符

1.判断所有值类型 2.能判断函数 3.能识别引用类型(但不能继续识别)

# 深拷贝 
拷贝之后保持原始对象的值不变

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
* 字符串拼接
* ==
* if语句 逻辑判断

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
