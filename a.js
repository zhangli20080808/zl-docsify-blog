const fs = require('fs');
const parser = require('@babel/parser');
const fenximokuai = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8');
  const Ast = parser.parse(content, {
    sourceType: 'module',
  });
  console.log(Ast.program.body);
  const dependencies = [];
  //分析ast抽象语法树，根据需要返回对应数据，
  //根据结果返回对应的模块，定义⼀个数组，接受⼀下node.source.value的值
  traverse(Ast, {
    ImportDeclaration({ node }) {
      console.log(node);
      dependencies.push(node.source.value);
    },
  });
  console.log(dependencies);
};
fenximokuai('./index.js');
