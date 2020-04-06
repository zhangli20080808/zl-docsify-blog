# 构建配置

## 抽取公共代码和第三方库（代码分割）

```js
optimization: {
  // 分割代码块
  splitChunks: {
    /*
    * initial: 入口 chunk, 不处理异步导入的文件
    * async: 异步 chunk, 只处理异步导入的文件
    * all：全部 chunk
    */
    chunks: 'all',  // 一般设置 all, 也可在缓存分组单独设置
    // 缓存分组
    cacheGroups: {
      // 第三方模块
      vendor: {
        name: 'vendor', // chunk 名称
        priority: 1, // 权限更高，优先抽离，重要!! 
        test: /node_modules/, // 引用的是 node_modules 中的就判断为第三方模块
        minSize: 0, // 大小限制
        minChunks: 1, // 最少复用过几次
        // chunks: 'all'
      },
      // 公共代码
      common: {
        name: 'common', // chunk 名称
        priority: 0, // 优先级
        minSize: 0, // 大小限制
        minChunks: 2, // 最少复用过几次
      },
    }
  },
}

// 引入 chunk
new HTMLWebpackPlugin({
  chunks: ['index', 'vendor', 'common']
})
```