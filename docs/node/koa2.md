# koa2

  - [koa 入门文档](https://koa.bootcss.com/)
  - [koa2 进阶学习笔记](https://chenshenhai.github.io/koa2-note/)

## 洋葱模型
Koa 的中间件和 Express 不同，Koa 选择了洋葱圈模型。所有的请求经过一个中间件的时候都会执行两次，Koa 的模型可以非常方便的实现后置处理逻辑。

![](../static/img/koa-middleware.png)

## koa-compress
koa 中间件执行顺序实现主要靠的就是源码中的 koa-compress.js。  
源码分析:
```js
module.exports = compose

function compose (middleware) {
  // 判断 middleware 是否是数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  // 请求进来的时候会调 handleRequest
  return function (context, next) {
    let index = -1
    return dispatch(0)  // 执行第一个中间件
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)  // 中间件中执行 next()，就会转移到执行下一个中间件（尾递归）
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
