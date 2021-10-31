# webpack_summary-

# 概念

Webpack 可以看做是模块打包机：它做的事情是，分析你的项⽬结构，找
到 JavaScript 模块以及其它的⼀些浏览器不能直接运⾏的拓展语⾔（Scss，
TypeScript 等），并将其打包为合适的格式以供浏览器使⽤。

# 原理

1. 识别入口文件
2. 通过逐层识别模块依赖(Commonjs、amd 或者 es6 的 import，webpack 都会对其进行分析，来获取代码的依赖)
3. webpack 做的就是分析代码，转换代码，编译代码，输出代码
4. 最终形成打包后的代码

# 安装

- npm install webpack webpack-cli --save-dev //-D
- npm info webpack//查看 webpack 的历史发布信息
- npm install webpack@x.xx webpack-cli -D

npx webpack -v// npx 帮助我们在项⽬中的 node_modules ⾥查找 webpack
./node_modules/.bin/webpack -v//到当前的 node_modules 模块⾥指定
webpack

# 小结

webpack 是⼀个模块打包⼯具，可以识别出引⼊模块的语法 ，早期
的 webpack 只是个 js 模块的打包⼯具，现在可以是 css，png，vue 的模块打
包⼯具

# 核⼼概念

1. entry
   指定 webpack 打包⼊⼝⽂件:Webpack 执⾏构建的第⼀步将从 Entry 开
   始，可抽象成输⼊

2. output
   打包转换后的⽂件输出到磁盘位置:输出结果，在 Webpack 经过⼀系列处
   理并得出最终想要的代码后输出结果。

3. mode
   ⽤来指定当前的构建环境
   开发阶段的开启会有利于热更新的处理，识别哪个模块变化
   ⽣产阶段的开启会有帮助模块压缩，处理副作⽤等⼀些功能

4. loader
   模块解析，模块转换器，⽤于把模块原内容按照需求转换成新内容。
   webpack 是模块打包⼯具，⽽模块不仅仅是 js，还可以是 css，图⽚或者其
   他格式
   但是 webpack 默认只知道如何处理 js 和 JSON 模块，那么其他格式的模块处
   理，和处理⽅式就需要 loader 了

5. moudle
   模块，在 Webpack ⾥⼀切皆模块，⼀个模块对应着⼀个⽂件。Webpack
   会从配置的 Entry 开始递归找出所有依赖的模块。
   当 webpack 处理到不认识的模块时，需要在 webpack 中的 module 处进⾏
   配置，当检测到是什么格式的模块，使⽤什么 loader 来处理。

6. ⽂件监听
   轮询判断⽂件的最后编辑时间是否变化，某个⽂件发⽣了变化，并不会⽴
   刻告诉监听者，先缓存起来
   webpack 开启监听模式，有两种

- .启动 webpack 命令式 带上--watch 参数，启动监听后，需要⼿动刷新浏览
  器

- 在配置⽂件⾥设置 watch:true

7.  Plugins
    plugin 可以在 webpack 运⾏到某个阶段的时候，帮你做⼀些事情，类似于
    ⽣命周期的概念
    扩展插件，在 Webpack 构建流程中的特定时机注⼊扩展逻辑来改变构建结
    果或做你想要的事情。
    作⽤于整个构建过程

8.  sourceMap
    源代码与打包后的代码的映射关系

        devtool:"cheap-module-eval-source-map",// 开发环境配置
        devtool:"cheap-module-source-map", // 线上⽣成配置

9.  WebpackDevServer
    每次改完代码都需要重新打包⼀次，打开浏览器，刷新⼀次，很麻烦
    我们可以安装使⽤ webpackdevserver 来改善这块的体验
    启动服务后，会发现 dist ⽬录没有了，这是因为 devServer 把打包后的模块
    不会放在 dist ⽬录下，⽽是放到内存中，从⽽提升速度

10. Hot Module Replacement (HMR:热模块替换)
    注意启动 HMR 后，css 抽离会不⽣效，还有不⽀持 contenthash，
    chunkhash

- 需要使⽤ module.hot.accept 来观察模块更新 从⽽更新

# 高级配置

- 多入口
- 抽离 css 文件
- 抽离公共代码
- 懒加载
- 处理 jsx
- 处理 vue

# module chunk bundle 的区别

- module -- 各个源码文件 webpack 中都是模块
- chunk -- 多模块合并成的 如生成 chunk 的方式有 entry import splitChunk,比如 index chunk 并不一定是 index.js 一个文件，也有可能是 index.js 中引入的其他文件
- bundle -- 最终输出文件

# 性能优化 -webpack总结

开发环境 -- 开发体验和效率，优化打包构建速度
[参考](https://blog.csdn.net/weixin_34406061/article/details/91456076)
1.  优化 babel-loader //开启缓存 只要 es6 代码没改 就不重新编译

```js
{
    test: /\.jsx?$/,
    // 排除范围
    // exclude: '/node_modules/', //记得要配置 提高js模块打包速度
    include: path.resolve(__dirname,'./src'), // 明确范围
    // use: {
    //   loader: 'babel-loader',
    // },
    loader: ['babel-loader?cacheDirectory'], //开启缓存 只要es6代码没改 就不重新编译
  },
```

2. IgnorePlugin - 避免引入无用模块
   - moment 默认会引入所有语言，代码过大
   - 如何只引用中文？

```js
import moment from 'moment'
import 'moment/local'
moment.local('zh-cn')
// 忽略 moment 下的 /locale 目录
new webpack.IgnorePlugin(/\.\/locale/, /moment/),
```

3. noParse - 避免重复打包

- IgnorePlugin 是直接不引入，代码中没有
- noParse 是引入了但不打包,比如 .min.js 结尾的文件，已经经过模块化处理了

4. happyPack - 多进程打包
   js 单线程，开启多进程打包 构建提高速度(多核心)

```js
{
  test: /\.jsx?$/,
  // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
  use: ['happypack/loader?id=babel'],
  exclude: '/node_modules/',
},
// happyPack 开启多进程打包
new HappyPack({
  // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
  id: 'babel',
  // 如何处理 .js 文件，用法和 Loader 配置中一样
  loaders: ['babel-loader?cacheDirectory'],
}),
```

5. ParallelUglifyPlugin - 多进程，并行压缩输出的 JS 代码

- webpack 内置 Uglify 工具压缩 JS
- JS 单线程，开启多进程压缩更快
- 和 happypack 同理

```js
// 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
// https://blog.csdn.net/meifannao789456/article/details/104793275/
new ParallelUglifyPlugin({
  // 传递给 UglifyJS 的参数
  // 还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
  uglifyJS: {
    output: {
      beautify: false, // 最紧凑的输出
      comments: false, // 删除所有的注释
    },
    compress: {
      // 删除所有的 `console` 语句，可以兼容ie浏览器
      drop_console: true,
      // 内嵌定义了但是只用到一次的变量
      collapse_vars: true,
      // 提取出出现多次但是没有定义成变量去引用的静态值
      reduce_vars: true,
    },
  },
}),
// 项目较大，打包较慢，开启多进程能提高速度
// 项目较小，打包很快，开启多进程会较低速度 - 进程开销
```

6. 自动刷新 - 一般配置了插件，就不用自己去开启了
7. 热更新
8. DllPlugin - 针对一些第三方比较大的库，没必要每次都打包，可以事先把第三方库打包好，做一个 dll，引用他

生产 -- 优化产出代码，产品性能

开发环境 自动化新 热更新 dll

## DllPlugin

- 前端框架，如 vue react 体积大，构建慢
- 稳定，不经常升级
- 同一个版本只构建一次，不用每次都重新构建
- webpack 已经内置了 DllPlugin 支持
- DllPlugin - 打包出 dll 文件
- DllReferencePlugin - 引用插件

```js
// "build:dll": "webpack --config ./webpack.dll.js",
// webpack.dll.js
const path = require('path');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash'],
    react: ['react', 'react-dom'],
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './dll'),
    //把打包生成的文件通过全局变量的形式暴露出来, 打包成第三方库我们一般会配置这个，比如'jQuery'
    library: '[name]',
  },
  plugins: [
    // 接入 DllPlugin
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, './dll/[name].manifest.json'),
    }),
  ],
};
// 此时npm run dev 不会再打包，在index.html中引入 
```

# es6 module 是静态引入，编译时引入

区别：es6 是静态引入，编译时执行，不能根据代码的一个变量来判断他是不是引用
commonjs 动态引入，执行时引入(执行的时候才发现引用的是什么)
只有 es6 静态引入，才能静态分析，实现 tree shaking(比如 webpack 打包的时候，只是一些静态的分析，编译，构建)

```js
commonjs
let api = require('./config/test.js')
if(isDev){
  <!-- 动态引入，执行是引入 -->
  api = require('./dev.js)
}

import apiList from './test'
if(isDev){
 <!-- 编译时报错 -->
 api = import apiList from './dev'
}

```

# scope Hosting

1. 代码体积会更小 ，个函数合并成一个
2. 创建函数作用域会更少
3. 代码可读性更好

# 优化产出代码

需要达到的效果？体积更小、合理分包，不重复加载、速度更快，内存使用更少

1. 小图片 base64
2. 提取公共代码 - 一些公共的代码没有必要在多个入口重复的打包进去
3. bundle 加 hash
4. 懒加载 - 大的文件异步加载，不打包进去
5. 使用cdn加速 - 1. 配置publicPath 2. 上传结果到cdn服务器
6. 使用 production
7. Scope Hosting - 改变打包的作用域，代码执行更快，内存占用更少
8. IgnorePlugin 

# 为什么要打包构建呢？

代码方面

1. 体积更小(tree-shaking 压缩 合并) ，加载更快
2. 编译高级语法(ts es6 模块化 scss)
3. 兼容性和错误检查(eslint postcss polyfill)
   流程方面
4. 统一高效的开发环境
5. 统一的构建流程和产出标准
6. 继承公司的构建规范(提测 上线)

# babel 和 webpack 的区别

1. babel 是 js 新语法的编译工具、不关心模块化
2. webpack 打包构建工具，是多个 loader 和 plugin 的集合

# loader 和 plugin 的区别

1. 在 webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。
2. loader 是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中

区别？对于 loader，它是一个转换器，将 A 文件进行编译形成 B 文件，这里操作的是文件，比如将 A.scss 转换为 A.css，单纯的文件转换过程
plugin 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务
理解 new 的过程
使用该 plugin 后，执行的顺序：

1. webpack 启动后，在读取配置的过程中会执行 new MyPlugin(options)初始化一个 MyPlugin 获取其实例
2. 在初始化 compiler 对象后，就会通过 compiler.plugin(事件名称，回调函数)监听到 webpack 广播出来的事件
3. 并且可以通过 compiler 对象去操作 webpack

https://blog.csdn.net/csm0912/article/details/88795369

# 如何产出一个 lib

library 给内部人使用的第三方类库 产出 lib 使用 babel-runtime

# 为何 proxy 不能被 polyfill

比如 class 通过 function 模拟 promise 可以通过 callback 模拟
但是 proxy 的功能不能用 Object.defineProperty 模拟

# webpack 如何实现懒加载

1. import 结合我们的 vue react 异步组件
2. 结合 vue-router react-router 异步加载路由

# webpack 常用插件

插件分内置（new webpack[pluginName]）和第三方，这里主要列列第三方的吧。

> new webpack.optimize[pluginName] 是内置的优化类插件，比如压缩 js

## webpack-dev-server

起本地服务器，重要。

## webpack-api-mocker

本地开发环境生成 mock 数据的插件，和 webpack-dev-server 配合使用，在 devServer 属性中配置。

## webpack-merge

合并 webpack 不同配置对象成一个，相同属性覆盖前面的对象，新增的属性则新增，同 Object.assign() 理。

## html-webpack-plugin

重构入口 html，动态添加 `<link>`和 `<script>`，在以 hash 命名的文件上非常有用，因为每次编译都会改变，很重要。

## mini-css-extract-plugin

抽取 css （原 extract-text-webpack-plugin 不再支持 webpack4）

## optimize-css-assets-webpack-plugin

压缩 css

## clean-webpack-plugin

清除文件或文件夹

## copy-webpack-plugin

复制文件

## webpack-bundle-analyzer

分析打包情况，可以看每个 js 大小和依赖关系

## http-proxy-middleware

用于把请求代理转发到其他服务器的中间件，如果接口转发不用 webpack-dev-server，那可能往往要用到 http-proxy-middleware 实现转发。

## webpack-dev-middleware

对更改的文件进行监控、重新编译, 一般和 webpack-hot-middleware 配合使用，实现热加载功能。
[源码解读](https://segmentfault.com/a/1190000018610275)

## webpackbar

启动本地环境时，用来在终端展示进度条，就是一个美化功能

# hash、chunkhash、contenthash三者区别

 