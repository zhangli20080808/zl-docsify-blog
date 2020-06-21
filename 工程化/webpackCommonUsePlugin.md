# webpack_summary-

# 概念

Webpack 可以看做是模块打包机：它做的事情是，分析你的项⽬结构，找
到 JavaScript 模块以及其它的⼀些浏览器不能直接运⾏的拓展语⾔（Scss，
TypeScript 等），并将其打包为合适的格式以供浏览器使⽤。

# 原理
1. 识别入口文件
2. 通过逐层识别模块依赖(Commonjs、amd或者es6的import，webpack都会对其进行分析，来获取代码的依赖)
3. webpack做的就是分析代码，转换代码，编译代码，输出代码
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

11. Babel 处理 ES6

1. 环境搭建和基本配置 .babelrc 配置和 presets/plugins

- npm i babel-loader @babel/core @babel/preset-env -D
- babel-loader 是 webpack 与 babel 的通信桥梁，不会做把 es6 转成 es5 的
  ⼯作，这部分⼯作需要⽤到@babel/preset-env 来做

- babel 是编译 es6 的核心工具。babel-loader 是借用了 babel ，封装了一下，将 babel 用于 webpack 的打包流程。

- @babel/preset-env ⾥包含了 es6 转 es5 的转换规则 

(很多转化都是通过plugin来处理，但是插件很多的话，写起来不方便，我们总体打个包，放到babel/preset-env里面一堆plugin的集合 ，如果不满足我们的需求还可以去plugin中拓展)

通过上⾯的⼏步 还不够，Promise 等⼀些还有转换过来，这时候需要借助
@babel/polyfill，把 es 的新特性都装进来，来弥补低版本浏览器中缺失的
特性

2. @babel/polyfill
@babel/polyfill 算是 core.js和regenerator的一个集合 core.js不支持一些特性比如yield 要区注入一些其他的库
babel7.4之后启用了 babel/polyfill，推荐直接使用 core.js和regenerator
以全局变量的⽅式注⼊进来的。windows.Promise，它会造成全局对象的
污染

npm install --save @babel/polyfill

会发现打包的体积⼤了很多，这是因为 polyfill 默认会把所有特性注⼊进
来，假如我想我⽤到的 es6+，才会注⼊，没⽤到的不注⼊，从⽽减少打包
的体积，我们要配置 按需引入
 
存在问题？ 如果开发组件库
开发的是组件库，⼯具库这些场景的时候，polyfill 就不适合了，因
为 polyfill 是注⼊到全局变量，window 下的，会污染全局环境，所以推荐闭
包⽅式：@babel/plugin-transform-runtime

- @babel/plugin-transform-runtime

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

打包生成的每一个 js 文件的就是一个 chunk
意义？ minChunks:2 这个 chunk 被引入了几次 就是有两个以上的文件依赖 lodash
我们就需要对 lodash 进行代码分割

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

# 高级配置

多入口 抽离 css 文件 抽离公共代码 懒加载 处理 jsx 处理 vue

# module chunk bundle 的区别

module -- 各个源码文件 webpack 中都是模块
chunk -- 多模块合并成的 如 entry import splitChunk
bundle -- 最终输出文件

# 性能优化

开发环境 -- 开发体验和效率，优化打包构建速度

1.  优化 babel-loader //开启缓存 只要 es6 代码没改 就不重新编译
2.  IgnorePlugin // 避免引入无用模块 比如 moment 默认会引入所有语言，代码过大
3.  noParse // 避免重复打包 IgnorePlugin 是直接不引入，代码中没有 noParse 是引入了但不打包
4.  happyPack // 多进程打包 js 单线程 开启多进程打包 构建提高速度(多核心)
5.  ParallelUglifyPlugin //  并行压缩输出的 JS 代码
6.  自动刷新
7.  热更新
8.  DllPlugin
    生产 -- 优化产出代码，产品性能

开发环境 自动化新 热更新 dll



# es6 module 是静态引入，编译时引入

区别：es6 是静态引入，编译时执行，不能根据代码的一个变量来判断他是不是引用
commonjs 动态引入，执行时引入(执行的时候才发现引用的是什么)
只有 es6 静态引入，才能静态分析，实现 tree shaking(比如 webpack 打包的时候，只是一些静态的分析，编译，构建)

```
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

1. 代码体积会更小 多个函数合并成一个
2. 创建函数作用域会更少
3. 代码可读性更好

# 优化产出代码

1. 小图片 base64
2. 提取公共代码
3. bundle 加 hash
4. 懒加载
5. cdn
6. 使用 production
7. Scope Hosting

# 为什么要打包构建呢？
代码方面
1. 体积更小(tree-shaking 压缩 合并) ，加载更快
2. 编译高级语法(ts es6 模块化 scss)
3. 兼容性和错误检查(eslint postcss polyfill)
流程方面
4. 统一高效的开发环境
5. 统一的构建流程和产出标准
6. 继承公司的构建规范(提测 上线)

# babel和webpack的区别
1. babel是js新语法的编译工具、不关心模块化
2. webpack 打包构建工具，是多个loader和plugin的集合

# loader和plugin的区别
1. 在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。
2. loader是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中

区别？对于loader，它是一个转换器，将A文件进行编译形成B文件，这里操作的是文件，比如将A.scss转换为A.css，单纯的文件转换过程
plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务
理解new的过程
使用该plugin后，执行的顺序：

1. webpack启动后，在读取配置的过程中会执行new MyPlugin(options)初始化一个MyPlugin获取其实例
2. 在初始化compiler对象后，就会通过compiler.plugin(事件名称，回调函数)监听到webpack广播出来的事件
3. 并且可以通过compiler对象去操作webpack

https://blog.csdn.net/csm0912/article/details/88795369
# 如何产出一个lib
library 给内部人使用的第三方类库 产出lib使用babel-runtime

# 为何 proxy不能被 polyfill
比如 class通过function模拟 promise可以通过callback模拟
但是 proxy的功能不能用 Object.defineProperty模拟

# webpack如何实现懒加载
1. import 结合我们的vue react异步组件 
2. 结合vue-router react-router异步加载路由

# webpack常用插件
插件分内置（new webpack[pluginName]）和第三方，这里主要列列第三方的吧。
>new webpack.optimize[pluginName] 是内置的优化类插件，比如压缩js

## webpack-dev-server
起本地服务器，重要。

## webpack-api-mocker
本地开发环境生成 mock 数据的插件，和 webpack-dev-server 配合使用，在 devServer 属性中配置。

## webpack-merge
合并 webpack 不同配置对象成一个，相同属性覆盖前面的对象，新增的属性则新增，同 Object.assign() 理。

## html-webpack-plugin
重构入口html，动态添加 `<link>`和 `<script>`，在以hash命名的文件上非常有用，因为每次编译都会改变，很重要。

## mini-css-extract-plugin
抽取 css （原 extract-text-webpack-plugin 不再支持 webpack4）

## optimize-css-assets-webpack-plugin
压缩 css

## clean-webpack-plugin
清除文件或文件夹

## copy-webpack-plugin
复制文件

## webpack-bundle-analyzer
分析打包情况，可以看每个js大小和依赖关系

## http-proxy-middleware
用于把请求代理转发到其他服务器的中间件，如果接口转发不用 webpack-dev-server，那可能往往要用到 http-proxy-middleware 实现转发。

## webpack-dev-middleware
对更改的文件进行监控、重新编译, 一般和 webpack-hot-middleware 配合使用，实现热加载功能。
[源码解读](https://segmentfault.com/a/1190000018610275)

## webpackbar
启动本地环境时，用来在终端展示进度条，就是一个美化功能
