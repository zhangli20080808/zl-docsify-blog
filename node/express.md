
#
# 于koa的相同点和不同点
```js
1. 相同点 - 使用概念基本一致，都有中间件概念
2. 不同点 
   express 内部使用的是构造函数方式， koa使用 promise async+await
   express 中异步处理都是回调函数 koa 是promise捕获
   express 都是内置了很多中间价，包括 路由，静态服务，模板引擎，koa打包很小
   express 是es一下语法 kao是es6
```
# express 原理

```js
const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
  constructor() {
    // 存放中间件列表 all 通过user注册的中间件  get 通过get注册的  post 通过post注册的
    this.routes = {
      all: [], // app.use(...)
      post: [], // app.post(...)
      get: [], // app.get(...)
    };
  }
  //通用注册方法
  register(path) {
    const info = {};
    if (typeof path === 'string') {
      info.path = path;
      // 从第二个参数开始 转化为数组 存入stack
      info.stack = slice.call(arguments, 1);
    } else {
      // 第一个参数没有  相当于我们访问 '/' 跟路径
      info.path = '/';
      // 从第一个参数开始 转化为数组 存入stack
      info.stack = slice.call(arguments, 0);
    }
    return info;
  }
  use() {
    // 通过  apply将当前函数所有的参数 传入 register 中
    const info = this.register.apply(this, arguments);
    this.routes.all.push(info);
  }
  get() {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);
  }
  post() {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }
  match(url, method) {
    let stack = [];
    if (url === '/favicon.ico') {
      return stack;
    }
    // 获取 routes 把能访问的我们集中起来
    let crueRoutes = [];
    crueRoutes = crueRoutes.concat(this.routes.all);
    crueRoutes = crueRoutes.concat(this.routes[method]);
    // console.log(crueRoutes,crueRoutes.length);
    crueRoutes.forEach((routeInfo) => {
      if (url.indexOf(routeInfo.path) === 0) {
        // url === '/api/getcookie'  且 routeInfo.path === '/'
        // url === '/api/getcookie'  且 routeInfo.path === '/api'
        // url === '/api/getcookie'  且 routeInfo.path === '/api/getcookie'
        stack = stack.concat(routeInfo.stack);
      }
    });
    return stack;
  }
  // 核心的 next机制
  handle(req, res, stack) {
    const next = () => {
      //拿到第一个匹配的中间件
      const middleWare = stack.shift();
      if (middleWare) {
        // 执行中间件函数
        middleWare(req, res, next);
      }
    };
    next();
  }
  callback() {
    return (req, res) => {
      res.json = (data) => {
        res.setHeader('Content-type', 'application/json');
        res.end(JSON.stringify(data));
      };
      const url = req.url;
      const method = req.method.toLowerCase();

      // 区分 哪些中间件访问 哪些不访问
      const resultList = this.match(url, method);
      // 再去执行 handle 处理这些函数的执行
      this.handle(req, res, resultList);
    };
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}
// 工厂函数
module.exports = () => {
  return new LikeExpress();
};
```
