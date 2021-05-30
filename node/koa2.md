# koa2

思考？原生 http 的不足，令人困惑的 request 和 response，res.end 流是个什么东西
对复杂业务的描述（流程描述，切面 aop 描述） 没有给出一些解决方法，所以才引出了 koa

对于 request 和 response 他提供了一种上下文环境 context
对于 对复杂业务的描述 他引入了 中间件的机制

概述：Koa 是一个新的 web 框架， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更
健壮的基石

特点：
轻量，无捆绑
中间件架构
优雅的 API 设计
增强的错误处理

目标: koa 的目标是用更简单化、流程化、模块化的方式实现回调部分

- [koa 入门文档](https://koa.bootcss.com/)
- [koa2 进阶学习笔记](https://chenshenhai.github.io/koa2-note/)

# koa1 和 koa2 的区别

从 generator 到 async 和 await
中间件是如何知道来的是请求还是响应呢 不需要知道 以为请求肯定比响应早处理 分界其实就是 next()

```js
var mid = function () {
  return function* (next) {
    this.body = '123';
    yield next();
  };
};
```

## 洋葱模型

1. Koa 的中间件和 Express 不同，Koa 选择了洋葱圈模型。所有的请求经过一个中间件的时候都会执行两次，Koa 的模型可以非常方便的实现后置处理逻辑。

![](../static/img/koa-middleware.png)
![](../static/img/context.png)

2. 中间件
   Koa 中间件机制：Koa 中间件机制就是函数组合的概念，将一组需要顺序执行的函数复合为一个函数，外层函
   数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示这种机制，是源码中的精髓和难点

````js
/**
 * 每个中间件都是 async 的格式  中间件才是把整个http在koa中的运转串起来的一个非常核心的东西
  为什么能够按照use的方式 一个一个执行 为什么可以在依次执行的过程中暂停下来 走后面的流程 再回来继续执行
  总结
  application 就是提供了一种能力 通过new的实例 传入中间件 实例端口 生成的实例 能够在nodejs能通过拿到进来的http
  逐层过中间件数组 把生成的结果交给了 处理响应函数 具体返回内容
  1.  在koa中 一切的流程 都是中间件
  2.  我们的http请求进入koa中  都会流经配置好的中间件 middware
  3.  在中间件执行 的过程中  会通过koa-compose 把这些中间件组合在一起 一个一个的把数组中的函数依次执行
      通过一个next的回调函数 不断的将执行权向下传递
  4.  每一个中间件都会拿到请求的上下文 通过context可以访问到 req res 很多属性和方法
  5.  贯穿中间件的请求上下文 res req context 的相互引用 方便调用 还有我们的req res 专门扩展除了两个对象 并非是node原生对象

      最重要的是
      http协议 资源啊 网络通信相关的知识 前后端请求的策略设定 请求流程的性能优化 一些硬知识

  两个概念
  1. 纯函数  x->y 无副作用
  2. 伪递归
  ```
  // 调用 递归的时候 程序会保存当前方法的调用栈 调用tail(2)的时候 必须要记录是如何调用tail(1)的
  // 这样才能在执行完tail(2)之后 返回tail(1)的下一行代码 打印一下 这个1  缺点 记录了太多的状态和堆栈深度 执行的结果就是下一次的入参
  function tail(i) {
    if (i > 3) return;
    console.log('调用前', i);
    tail(i + 1);
    console.log('调用后', i);
  }
  tail(0);

  ```
 *  application 就是提供了一种能力 通过new的实例 传入中间件 实例端口 生成的实例 能够在nodejs能通过拿到进来的http
 * 逐层过中间件数组 把生成的结果交给了 处理响应函数 具体返回内容
 * http 上下文对象 context(ctx)
 * 1. 我们 new koa() 之后 其实并没有对网络层进行一个监听 任何的请求都没有进来 在listen之后我们会对特定的端口进行监听 到具体的某次http请求
 * 2. new koa -> 难理解的可能是 listen监听的回调函数 this.callback()
 * 3. koa在封装application的时候 对callback多做了一些事情
 * callback
 * -> 1. createContext (便于我们在各个中间件或者业务处理的时候拿到进来的request请求和响应 把request 和 responese上面的所有属性都给了context)
 * -> 2. handlerequest (调用整个中间件的数组 等全部结束之后，再调用封装的res f返回数据给客户端 有多种返回格式 1. buffer 2. string 3. stream pipe 4.json)
 */


## koa-compress

koa 中间件执行顺序实现主要靠的就是源码中的 koa-compress.js。
源码分析:

```
module.exports = compose;
// 把一个个不想关的中间件串到一起
function compose(middleware) {
  // 判断 middleware 是否是数组
  if (!Array.isArray(middleware))
    throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function')
      throw new TypeError('Middleware must be composed of functions!');
  }

  // 请求进来的时候会调 handleRequest  next 钩子函数 串联下一个中间件
  return function (context, next) {
    let index = -1;
    return dispatch(0); // 执行第一个中间件
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(
          fn(context, function next() {
            return dispatch(i + 1); // 中间件中执行 next()，就会转移到执行下一个中间件（尾递归）
          })
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
````

# 源码解读

context 上下文 基础 getter setter Object.create 对象继承

```js
// 测试代码，test-getter-setter.js
const zhangli = {
  info: { a: '1231' },
  get name() {
    return this.info.a;
  },
  set name(val) {
    console.log('new val');
    this.info.a = val;
  },
};
zhangli.name = '13';
console.log(zhangli.name);
```

1. context

- koa 为了能够简化 API，引入上下文 context 概念，将原始请求对象 req 和响应对象 res 封装并挂载到 context
  上，并且在 context 上设置 getter 和 setter，从而简化操作。
  app.use(ctx=>{ ctx.body = 'hehe' })

2. 封装 request、response 和 context
   [](https://github.com/koajs/koa/blob/master/lib/response.js)

```js
// request.js
module.exports = {
  get url() {
    return this.req.url;
  },
  get method() {
    return this.req.method.toLowerCase();
  },
};
// response.js
module.exports = {
  get body() {
    return this._body;
  },
  set body(val) {
    this._body = val;
  },
};
// context.js
module.exports = {
  get url() {
    return this.request.url;
  },
  get body() {
    return this.response.body;
  },
  set body(val) {
    this.response.body = val;
  },
  get method() {
    return this.request.method;
  },
};

```

模拟的 kkb 可以对复杂的对象进行简单的封装
[Object.create()和 new object()和{}的区别](https://www.cnblogs.com/bug-jin/p/10388672.html)

```js
  // 构建上下文, 把res和req都挂载到ctx之上，并且在ctx.req和ctx.request.req同时保存
  // 使用Object.create()是将对象继承到__proto__属性上
  // var test = Object.create({x:123,y:345}); __proto__ 上面有{x:123,y:345}
  // 对比 var test1 = new Object({x:123,y:345});  test1.__proto__.x undefined
  //var test2 = {x:123,y:345}; test2.__proto__.x);//undefined

const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class KKB {
  // 初始化中间件数组
  constructor() {
    this.middlewares = [];
  }
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      // 创建上下文
      let ctx = this.createContext(req, res);
      // this.callback(req,res)
      // this.callback(ctx)
      // 中间件合成
      const fn = this.compose(this.middlewares);
      // 执行合成函数并传入上下文
      await fn(ctx);
      // 响应
      res.end(ctx.body);
    });
    server.listen(...args);
  }
  // use(callback) {
  //     this.callback = callback
  // }
  use(middleware) {
    // 将中间件加到数组里
    this.middlewares.push(middleware);
  }
  // 构建上下文, 把res和req都挂载到ctx之上，并且在ctx.req和ctx.request.req同时保存
  createContext(req, res) {  //http中的req,res
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
  //合成函数
  compose(middlewares) {
    return function (ctx) {
      return dispatch(0);
      function dispatch(i) {
        let fn = middlewares[i];
        if (!fn) {
          return Promise.resolve();
        }
        return Promise.resolve(
          fn(ctx, function (next) {
            //执行下一个
            return dispatch(i + 1);
          })
        );
      }
    };
  }
}
module.exports = KKB;
```

# 高阶函数思想

1. 函数组合

```js
const add = (x, y) => x + y
const square = z => z * z
const fn = (x, y) => square(add(x, y))
console.log(fn(1, 2))

```

上⾯就算是两次函数组合调⽤，我们可以把他合并成⼀个函数

```js
const compose = (fn1, fn2) => (...args) => fn2(fn1(...args));
const fn = compose(add, square);

```

多个函数组合：中间件的数⽬是不固定的，我们可以⽤数组来模拟

```js
const compose = (...[first, ...other]) => (...args) => {
  let ret = first(...args);
  other.forEach((fn) => {
    ret = fn(ret);
  });
  return ret;
};
const fn = compose(add, square);
console.log(fn(1, 2));

```

异步中间件：上⾯的函数都是同步的，挨个遍历执⾏即可，如果是异步的函数呢，是⼀个
promise，我们要⽀持 async + await 的中间件，所以我们要等异步结束后，再执⾏下⼀个中间件。

```js
function compose(middlewares) {
  return function () {
    return dispatch(0);
    // 执⾏第0个
    function dispatch(i) {
      let fn = middlewares[i];
      if (!fn) {
        return Promise.resolve();
      }
      return Promise.resolve(
        // 执行fn 这个结果的过程中 我们要把下一个传进去
        fn(function next() {
          // promise完成后，再执⾏下⼀个
          return dispatch(i + 1);
        })
      );
    }
  };
}

async function fn1(next) {
  console.log('fn1');
  await next();
  console.log('end fn1');
}
async function fn2(next) {
  console.log('fn2');
  await delay();
  await next();
  console.log('end fn2');
}
function fn3(next) {
  console.log('fn3');
}
function delay() {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove();
    }, 2000);
  });
}

const middlewares = [fn1, fn2, fn3];
const finalFn = compose(middlewares);
finalFn();

```

# 常见 koa 中间件的实现

函数式编程 compose 异步 compose js 中间件对比学习 express koa redux 中间件重要原理 static router

1. koa 中间件的规范

- 一个 async 函数
- 接收 ctx 和 next 两个参数
- 任务结束需要执行 next

```js
const mid = async (ctx, next) => {
  // 来到中间件，洋葱圈左边
  next(); // 进入其他中间件
  // 再次来到中间件，洋葱圈右边
};

```

2. 中间件常见任务

- 请求拦截
- 路由
- 日志
- 静态文件服务

3. router 实现

```js
class Router {
  constructor() {
    this.stack = [];
  }
  register(path, methods, middleware) {
    let route = { path, methods, middleware };
    this.stack.push(route);
  }
  // 现在只支持get和post，其他的同理
  get(path, middleware) {
    this.register(path, 'get', middleware);
  }
  post(path, middleware) {
    this.register(path, 'post', middleware);
  }
  routes() {
    let stock = this.stack;
    return async function (ctx, next) {
      let currentPath = ctx.url;
      let route;
      for (let i = 0; i < stock.length; i++) {
        let item = stock[i];
        if (
          currentPath === item.path &&
          item.methods.indexOf(ctx.method.toLowerCase) >= 0
        ) {
          // 判断path和method
          route = item.middleware;
          break;
        }
      }
      if (typeof route === 'function') {
        route(ctx, next);
        return;
      }
      await next();
    };
  }
}
module.exports = Router;

```

4. 静态文件服务 koa-static

- 配置绝对资源目录地址，默认为 static
- 获取文件或者目录信息
- 静态文件读取
- 返回

```js
// static.js
const fs = require('fs');
const path = require('path');
module.exports = (dirPath = './public') => {
  return async (ctx, next) => {
    if (ctx.url.indexOf('/public') === 0) {
      // public开头 读取文件
      const url = path.resolve(__dirname, dirPath);
      const fileBaseName = path.basename(url);
      const filepath = url + ctx.url.replace('/public', '');
      // console.log(ctx.url);
      // console.log(url);
      // console.log(filepath, fileBaseName);

      try {
        // fs.statSync(fullPath).isDirectory() 判断文件目录是否存在
        // 不建议在调用 fs.open()、 fs.readFile() 或 fs.writeFile() 之前使用 fs.exists() 检查文件是否存在
        stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
          const dir = fs.readdirSync(filepath);
          // console.log(dir);  //[ 'a.html', 'index.html' ]
          const ret = ['<div style="padding-left:20px">'];
          dir.forEach((filename) => {
            // 简单认为不带小数点的格式，就是文件夹，实际应该用statSync
            if (filename.indexOf('.') > -1) {
              ret.push(
                `<p><a style="color:black" href="${ctx.url}/${filename}">${filename}</a></p>`
              );
            } else {
              // 文件
              ret.push(
                `<p><a href="${ctx.url}/${filename}">${filename}</a></p>`
              );
            }
          });
          ret.push('</div>');
          ctx.body = ret.join('');
        } else {
          console.log('文件');
          const content = fs.readFileSync(filepath);
          ctx.body = content;
        }
      } catch (e) {
        // 报错了 文件不存在
        ctx.body = '404, not found';
      }
    } else {
      // 否则不是静态资源，直接去下一个中间件
      await next();
    }
  };
};


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
