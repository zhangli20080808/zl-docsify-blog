var test = Object.create({ x: 123, y: 345 }); // __proto__ 上面有{x:123,y:345}
// 对比
var test1 = new Object({ x: 123, y: 345 }); //test1.__proto__.x undefined
var test2 = { x: 123, y: 345 }; // test2.__proto__.x); //undefined
