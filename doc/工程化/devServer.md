# 前端项目启动本地服务器的几种方法

## webpack-dev-server
[webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/) 是一个小型的 Node.js Express 服务器,它使用 webpack-dev-middleware 来服务于 webpack 的包。也就是说以前用 express + webpack-dev-middleware + webpack-hot-middleware + http-proxy-middleware 启动服务，现在可以直接一个 webpack-dev-server 插件搞定（不过前面的组合扩展性更好，更容易定制，所以根据自身项目需求选择）。npm scripts 中用命令启动，比如这样：  
```js
 "dev": "cross-env NODE_ENV=dev webpack-dev-server"
```
然后在 webpack.dev.js 配置 devServer 属性即可，比如：
```js
devServer: {
  port: 8080,
  contentBase: '',
  historyApiFallback: true,
  overlay: {
    errors: true,
    warnings: true,
  },
  open: true, // 服务启动后 打开浏览器
  openPage: '',
  hot: true,
  host: 'localhost',
  inline: true,
  hotOnly: true,
  before(app) {
    apiMocker(app, path.resolve('./mocker/index.js'),
    {
      proxy: {
        '/api/*': 'http://m.xxx.cn/',
      },
      changeHost: true,
    },
  }
}
```

## express
express + webpack-dev-middleware + webpack-hot-middleware

## http-server
npm scripts 命令行 `http-server -p 8000`

## anywhere

## live server 插件
如果用的是 vs code, 可以安装 live server 插件，默认支持热更新，自己学习或者本地测试用用，实际项目开发中不要用这个，不利于多人协作。