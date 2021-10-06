setImmediate(() => { // node中的宏任务，会立即执行，和setTimeout有什么区别呢？
  // 异步
  console.log('异步 -> setImmediate'); // node中的宏任务
});
setTimeout(() => {
  console.log('setTimeout');
}, 2);