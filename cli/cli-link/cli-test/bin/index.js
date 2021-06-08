#!/usr/bin/env node

// 1. 注册一个命令 init
// 2. 实现参数解析 --version 和 init --name vue-test

const argv = require('process').argv;
const lib = require('ss-lib');
const command = argv[2];
// [ '/usr/local/bin/node', '/usr/local/bin/cli-test', 'init' ]
// argv [
//   '/usr/local/bin/node',
//   '/usr/local/bin/cli-test',
//   '--name',
//   'vue-test'
// ]
const options = argv.slice(3);

if (options.length > 1) {
  let [option, param] = options;
  option = option.replace('--', '');

  if (command) {
    if (lib[command]) {
      lib[command]({ option, param });
    } else {
      console.log('无效的命令');
    }
  } else {
    console.log('请输入命令');
  }
}

if (command.startsWith('--') || command.startsWith('-')) {
  let globalOption = command.replace(/--|-/g, '');
  console.log(globalOption);
  if (globalOption === 'version' || globalOption === 'V') {
    console.log('1.1.1');
  }
}
