// Function.prototype.apply = function (context, args) {
//   context = context ? Object(context) : window;
//   context.fn = this;
//   if (!args) {
//     return context.fn();
//   }
//   let r = eval('context.fn(' + args + ')');
//   // Reflect.deleteProperty(context.fn);
//   delete context.fn;
//   return r;
// };

// function fn1(a, b, c) {
//   console.log('this', this);
//   console.log(a, b, c);
//   return 'this is fn1';
// }

// fn1.apply('hello', [1, 2, 3]);
