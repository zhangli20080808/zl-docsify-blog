# 概念
  Webpack可以看做是模块打包机：它做的事情是，分析你的项⽬结构，找
  到JavaScript模块以及其它的⼀些浏览器不能直接运⾏的拓展语⾔（Scss，
  TypeScript等），并将其打包为合适的格式以供浏览器使⽤。

  只认识js、json的一些模块，除了js之外的呢，css模块啊，字体，ts，图片啊这些js默认是不认识的，只能通过loader来进行处理

# Webpack 编译流程的简单实现


## ES6 模块化 语法 浏览器都不支持 压缩代码整合代码，让网页加载更快

1. ES6 Module 常用语法。譬如 export 导出模块接口 | import 倒入模块| export default 语法糖
2. Node.js 模块常用。譬如 module.exports | require
3. ES6 模块与 commonjs 模块的区别（静态编译与动态加载 | 值得引用与值的拷贝）

思考几个问题？

1. export default 为什么是语法糖
2. require 一个 ES6 Module

default 关键字 说白了，就是别名(as)的语法糖

```js
function a(){}
export {a}
----------
export default function() {}

// 等效于：
function a() {};
export {a as default};

-----
import a from './d';
等效于，或者说就是下面这种写法的简写，是同一个意思
import {default as a} from './d'
```

这个语法糖的好处就是 import 的时候，可以省去花括号{}。
简单的说，如果 import 的时候，你发现某个变量没有花括号括起来（没有\*号），那么你在脑海中应该把它还原成有花括号的 as 语法。
本质上依旧是结构赋值呀，只不过我们写的更为简便，假装花括号消失了罢了

# 如何 require 一个 ES6 Module

require 和 require.default...当在 node 中处理 ES6 模块(export default mycomponent)导入的时候，导出的模块格式为

```js
{
  "default": mycomponent
}
```

import 语句正确地为你处理了这个问题，然而你必须自己执行 require("./mycomponent").default. HMR(热更新模块)不在 inline 模式工作的情况下，接口代码不能使用 import ，如果你想避免，使用 module.exports 而不是 export default;

上文提到过，export 关键字是导出一个对象，对象内存在一个属性(我们要暴露的)，export default 则是 export 语法糖，import 一个 export default 暴露出来的模块包含了解构赋值的步骤，所以在 node 中使用 require 去请求一个 export default 的模块需要我们通过.语法去取出对象中的属性(因为 require 木有解构赋值)，清晰明了。
换个说法，如果 require 的 commonjs 规范的模块，即：

```js
// a.js 导出
module.exports = {
  a:'helloworld'
}

// b.js 导入
var m = require('./a.js');
console.log(m.a); // helloworld

这样就显得非常清晰，我们 module.exports 的是啥，require 的就是啥

但export default包装了一层语法糖，让我们看得不甚清晰

const a = 'helloworld';
export default a;
其实导出的是

{
  "default": a
}
而并非 a 这个变量，这就是我为什么之前要强调语法糖了，如果你将 export default 还原为
const a = 'helloworld';
export {a as default}

```

## 模块化概念 export import

但是import则不同，它是编译时的（require是运行时的），它必须放在文件开头，而且使用格式也是确定的，不容置疑。它不会将整个模块运行后赋值给某个变量，而是只选择import的接口进行编译，这样在性能上比require好很多。

我们在node中使用babel支持ES6，也仅仅是将ES6转码为ES5再执行，import语法会被转码为require。这也是为什么在模块导出时使用module.exports，在引入模块时使用import仍然起效，因为本质上，import会被转码为require去执行

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
- 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

下面是编译流程的代码实现：

```
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');

let ID = 0;

// 读取内容并提取它的依赖关系
function createAsset(filename) {
  // 以字符串的形式读取文件
  const content = fs.readFileSync(filename, 'utf-8');

  // 转换字符串为ast抽象语法树
  const ast = parser.parse(content, {
    sourceType: 'module'
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
    presets: ['@babel/preset-env']
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
  let modules = '';

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
const graph = createGraph('./example/entry.js');

const result = bundle(graph);

console.log(result);
```
