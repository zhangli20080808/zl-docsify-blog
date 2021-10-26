# babelrc

# Babel 处理 ES6

## 环境搭建和基本配置

- .babelrc 配置和 presets/plugins
- npm i babel-loader @babel/core @babel/preset-env -D @babel/cli
- babel-loader 是 webpack 与 babel 的通信桥梁，不会做把 es6 转成 es5 的
  ⼯作，这部分⼯作需要⽤到@babel/preset-env 来做

- babel 是编译 es6 的核心工具。babel-loader 是借用了 babel ，封装了一下，将 babel 用于 webpack 的打包流程。

- @babel/preset-env ⾥包含了 es6 转 es5 的转换规则,插件的集合

(很多转化都是通过 plugin 来处理，但是插件很多的话，写起来不方便，我们总体打个包，放到 babel/preset-env 里面，一堆 plugin 的集合 ，如果不满足我们的需求还可以去 plugin 中拓展)

通过上⾯的⼏步 还不够，Promise 等⼀些还有转换过来，这时候需要借助
@babel/polyfill，把 es 的新特性都装进来，来弥补低版本浏览器中缺失的特性

## @babel/polyfill
[](https://blog.csdn.net/weixin_44157964/article/details/107945951)
因为在使用preset_env 处理js代码时，无法将所有的ES6的语法全部转换成ES5语法，就比如promise、array.from以及实例方法都无法转换，这个时候需要加入垫片。

### 什么是 polyfill

1. @babel/polyfill 算是 core.js 和 regenerator 的一个集合
2. core.js 不支持一些特性。比如 yield 要区注入一些其他的库，比如还要引入 regenerator 库

注意：babel7.4 之后弃用了 babel/polyfill，推荐直接使用 core.js 和 regenerator
以全局变量的⽅式注⼊进来的。windows.Promise，它会造成全局对象的
污染

npm install --save @babel/polyfill

会发现打包的体积⼤了很多，这是因为 polyfill 默认会把所有特性注⼊进
来，假如我想我⽤到的 es6+，才会注⼊，没⽤到的不注⼊，从⽽减少打包
的体积，我们要配置 按需引入

存在问题？ 如果开发组件库
开发的是组件库，⼯具库这些场景的时候，polyfill 就不适合了，因
为 polyfill 是注⼊到全局变量，window 下的，会污染全局环境

3. @babel/runtime 不会污染全局环境
所以推荐闭包⽅式：@babel/plugin-transform-runtime

- npm install --save-dev @babel/plugin-transform-runtime
- npm install --save @babel/runtime

修改配置⽂件：注释掉之前的 presets，添加 plugins

useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配
置 @babel/polyfill 。

- entry: 需要
  在 webpack 的⼊⼝⽂件⾥ import "@babel/polyfill" ⼀次。 babel 会根
  据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。

- usage: 不需要 import ，全⾃动检测，但是要安装 @babel/polyfill 。
  （试验阶段）

- false: 如果你 import "@babel/polyfill" ，它不会排除
  掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)

注意 usage 的⾏为类似 babel-transform-runtime，不会造成全局污
染，因此也会不会对类似 Array.prototype.includes() 进⾏ polyfill。
```js
"presets": [
  [
    "@babel/preset-env",
    {
      "targets": {
        "chrome": "67"
      },
      "useBuiltIns: 'useage', // 这里配置了 可以删掉 require('@babel/polyfill')
      "corejs": 3
    }
  ],
  // 这样打包出来的东西都是 core-js按需引入的东西
```

12. tree Shaking
    webpack2.x 开始⽀持 tree shaking 概念，顾名思义，"摇树"，只⽀持 ES
    module 的引⼊⽅式

optimization: {
usedExports: true
}

开发模式设置后，不会帮助我们把没有引⽤的代码去掉

- "sideEffects":false 正常对所有模块进⾏ tree shaking
- "sideEffects":['*.css','@babel/polyfill'] 这样会避免摇掉.css 文件

13. 代码分割 code Splitting

假如我们引⼊⼀个第三⽅的⼯具库，体积为 1mb，⽽我们的业务逻辑代码也有
1mb，那么打包出来的体积⼤⼩会在 2mb

能不能剥离出去？形成单一的链接？

导致问题？
体积⼤，加载时间⻓
业务逻辑会变化，第三⽅⼯具库不会，所以业务逻辑⼀变更，第三⽅⼯具库也
要跟着变。

其实 code Splitting 概念 与 webpack 并没有直接的关系，只不过 webpack
中提供了⼀种更加⽅便的⽅法供我们实现代码分割

https://webpack.js.org/plugins/split-chunks-plugin/

14 优化

- 合理使用插件
- resolve 参数合理配置(一般 js jsx 就行 css 图片会有性能损耗)
  resolve: {
  extensions: ['.js', '.jsx']
  },
- 第三方模块 只在第一次打包的时候去分析 之后再去打包的话我们直接用
  上一次分析好的结果，理想的优化方式

1.  打包一次 ok
2.  使用？我们引入第三方文件的时候 要使用 dll.js 文件做映射
    分析我们打包的库 把库里面第三方的映射关系我们放到 mainfest.json 汇总

当 webpack 打包的时候，有了这个文件 [name].mainfest.json 我们再结合
全局变量 vendors 对我们的源代码进行分析 ，一旦分析出来我们使用的内容是在
dll 中，就会直接使用 vendors.dll.js 中的内容，就不回去 node_m
中引入我们的模块了

15. 多核打包
    parallel-webpack thread-loader happypack

### 懒加载

Lazy Loading 其实就是通过 import 来异步的加载一个模块 但是实际上什么时候去加载
是不一定的，真正执行 import 的时候，可以让我们的页面加载速度更快

是 ES 中的一个概念 webpack 只是识别这种代码 对代码进行分割

代码分割，和 webpack 无关

// webpack 中实现代码分割，两种方式
// 1. 同步代码： 只需要在 webpack.common.js 中做 optimization 的配置即可
// 2. 异步代码(import): 异步代码，无需做任何配置，会自动进行代码分割，放置到新的文件中

### chunk

- 打包生成的每一个 js 文件的就是一个 chunk
- 意义？
  minChunks:2 这个 chunk 被引入了几次 就是有两个以上的文件依赖 lodash 我们就需要对 lodash 进行代码分割

### 打包分析

c shift p coverage

### prefetch preload

比如我们的登录弹窗 异步加载可能会慢点 如何快点呢？
页面 js 加载完成 登录网络有空闲的时候 会帮我们预先加载好
注意: 书写 webpackPrefetch

import(/_ webpackPrefetch:"lodash" _/'./a.js')
我们再次点击触发弹窗的时候还会加载一次 但已经拿的是缓存了 看加载时间

区别 preload 和主业务逻辑一起加载

优化 ？ 考虑我们 js 代码利用率，有些交互之后才能用到的代码，写到异步组件中去
通过懒加载的形式让我们的代码加载进来 注意兼容性问题

前端缓存能优化的点是局限的，我们的重点应该放在代码利用率上面

## Babel 的原理是什么?

1. babel 的转译过程也分为三个阶段，这三步具体是： 解析 Parse: 将代码解析⽣成抽象语法树( 即 AST )，即词法分析与语法分析的过程
2. 转换 Transform: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在 此过程中进⾏添加、更新及移除等操作
3. ⽣成 Generate: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator

## 文件简单分析

在.babelrc 配置文件中，主要是对预设（presets）和插件（plugins）进行配置，因此不同的转译器作用不同的配置项，大致可分为以下三项：

- 语法转义器：主要对 js 最新的语法糖进行编译，并不负责转译 js 新增的 api 和全局对象。例如 let/const 就可以被编译，而 includes/Object.assign 等并不能被编译。常用到的转译器包有，babel-preset-env、babel-preset-es2015、babel-preset-es2016、babel-preset-es2017、babel-preset-latest 等。在实际开发中可以只选用 babel-preset-env 来代替余下的，但是还需要配上 js 的制作规范 babel-preset-stage-x 一起使用，同时也是官方推荐。
- 补丁转义器：主要负责转译 js 新增的 api 和全局对象，例如 babel-plugin-transform-runtime 或 babel-polyfill 这个插件能够编译 includes/Promise 等新的 api。
- jsx 和 flow 插件：这类转译器用来转译 JSX 语法和移除类型声明的，使用 Rect 的时候你将用到它，转译器名称为 babel-preset-react。

执行顺序：先执行 plugins 再执行 presets，plugins 里的插件是从前往后执行，presets 预设是从后往前执行。

> 预设（presets）是多个插件（plugins）的组合

@babel-/core @babel/preset-env babel-loader -D

下面是一份工作中的配置，加了点配置，解释见注释：

```
{
  "presets": [
    /**
    *  babel-preset-env: 对js最新的语法糖进行编译，默认并不负责转译js新增的api和全局对象，但是如果配置了 useBuiltIns 为 "usage" 则会启用 polyfill 功能 （不需要单独引入 babel-polyfill 插件了）
    */
    // ["@babel-preset-env"]
    ["env", {
      "targets": {
        "browsers": ["last 10 versions", "ie >= 9"]  // 指定需要兼容的浏览器类型和版本，通过指定更高的浏览器版可减少插件和 polyfill 的代码量
      },
      "useBuiltIns": "usage"   // 启用 polyfill 功能且按需加载
      "corejs": 3  // 版本号
    }],
    /**
    * babel-preset-react: 转义react语法
    */
    "react",
    /**
    *   babel-preset-stage-0: 处于标准草案提案阶段的功能
    */
    "stage-0"
  ],
  "plugins": [
    // babel-plugin-import: 编译过程中将 import 的写法自动转换为按需引入的方式
    ["import", {
      "libraryName": "doraemon",    // 设置组价库名称
      "style": true     // 按需引入样式
    }],
    // babel-plugin-transform-decorators-legacy: 转译装饰器语法
    "transform-decorators-legacy",
    // babel-plugin-transform-runtime: 转译js新增的api和全局对象，与babel-polyfill功能类似，但是不会污染全局环境
    "transform-runtime",
  ],
  "env": {
    //  development 是提前设置的环境变量，如果没有设置BABEL_ENV则使用NODE_ENV，如果都没有设置默认就是development
    "development": {
      "plugins": [
        "dva-hmr"
      ]
    }
  }
}

```

## 如何写⼀个 babel 插件?

Babel 解析成 AST，然后插件更改 AST，最后由 Babel 输出代码
那么 Babel 的插件模块需要你暴露⼀个 function，function 内返回 visitor

```js
module.export = function (babel) {
  return { visitor: {} };
};
// visitor是对各类型的AST节点做处理的地⽅，那么我们怎么知道Babel⽣成了的AST有哪些节点呢？
很简单，你可以把Babel转换的结果打印出来，或者这⾥有传送⻔: AST explorer https://astexplorer.net/

demo学习地址： https://cnodejs.org/topic/5a9317d38d6e16e56bb808d1
```
