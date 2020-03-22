# Webpack编译流程的简单实现

## 主要的概念
  - Entry：入口文件
  - Output：出口文件
  - Module：模块，对应编译前的一个文件，比如 js、css、图片等
  - Chunk：代码块，由多个模块组成的，用于代码的合并和分割，如 entry、splitChunks，对应编译后的一个文件
  - Bundle: 最终输出的文件
  - Loader：对模块内容根据需求进行转义
  - Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播出对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情。
  - AST：抽象语法树,它以树状的形式表现编程语言的语法结构

## 执行流程
  - 初始化参数：从配置文件中读取与合并参数，得出最终的参数；
  - 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
  - 确定入口：根据配置中的 entry 找出所有的入口文件；
  - 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
  - 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
  - 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
  - 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

下面是编译流程的代码实现：
```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

let ID = 0;

// 读取内容并提取它的依赖关系
function createAsset(filename) {
  // 以字符串的形式读取文件
  const content = fs.readFileSync(filename, "utf-8");

  // 转换字符串为ast抽象语法树
  const ast = parser.parse(content, {
    sourceType: "module"
 });

  const dependencies = [];

  // 遍历抽象语法树
  traverse(ast, {
    // 每当遍历到import语法的时候
    ImportDeclaration: ({ node }) => {
      // 把依赖的模块加入到数组中
      dependencies.push(node.source.value);
   }
 });
  // 模块id自增长
  // webpack5 中固定模块id，利用缓存增加效率
  const id = ID++;

  // loader转义 转换为浏览器可运行的代码
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"]
 });

  return {
    id,
    filename,
    dependencies,
    code
 };
}

// 从入口开始，分析所有依赖项，形成依赖图，采用深度优先遍历
function createGraph(entry) {
  const mainAsset = createAsset(entry);

  // 定义一个保存依赖项的数组
  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    // 定义一个保存子依赖项的属性
    asset.mapping = {};

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);

      const child = createAsset(absolutePath);

      // 给子依赖项赋值
      asset.mapping[relativePath] = child.id;

      // 将子依赖也加入队列中，循环处理
      queue.push(child);
   });
 }
  return queue;
}

// 根据生成的依赖关系图，生成浏览器可执行文件
function bundle(graph) {
  let modules = "";

  // 把每个模块中的代码放在一个作用域内,作用域隔离
  graph.forEach(mod => {
    modules += `${mod.id}:[
      function (require, module, exports){
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
 });

  // require, module, exports 不能直接在浏览器中使用，这里模拟了模块加载，执行，导出操作。
  const result = `
    (function(modules){
      // 创建一个require()函数: 它接受一个 模块ID 并在我们之前构建的模块对象查找它.
      function require(id){
        const [fn, mapping] = modules[id];

        function localRequire(relativePath){
          // 根据mapping的路径，找到对应的模块id
          return require(mapping[relativePath]);
        }

        const module = {exports:{}};

        // 执行转换后的代码，并输出内容。
        fn(localRequire,module,module.exports);

        return module.exports;
      }

      // 执行入口文件
      require(0);

    })({${modules}})
  `;

  return result;
}
// 设置入口文件
const graph = createGraph("./example/entry.js");

const result = bundle(graph);

console.log(result);
```
