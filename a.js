let obj = {
  name: { name: 1, age: 2, c: { c: 1 } },
};
function update() {
  console.log('更新');
}
let handler = {
  // 兼容性不好
  set(target, key, value, receiver) {
    // reflect
    update();
    const result = Reflect.set(target, key, value, receiver); // proxy reflect 都是es6
    return result; // 是否设置成功
  },
  get(target, key, receiver) {
    if (typeof target[key] === 'object') {
      return new Proxy(target[key], handler);
    } 
    // 只处理本身 非原型属性
    Reflect.ownKeys()
    return Reflect.get(target, key, receiver);
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key);
    console.log('deleteProperty', key);
    console.log('result', result);
    return result; // 是否删除成功
  },
};
let proxy = new Proxy(obj, handler);
