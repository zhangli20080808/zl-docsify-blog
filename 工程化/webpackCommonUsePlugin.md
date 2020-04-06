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
