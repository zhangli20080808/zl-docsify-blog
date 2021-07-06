#!/usr/bin/env node

// /usr/local/bin/cli-test -> /usr/local/lib/node_modules/cli-test/bin/index.js
// /usr/local/lib/node_modules/cli-test -> /Users/zl/wpt/cli-test

/**
 * 和yargs的不同，默认情况下就能支持 -V -h 去调用帮助和版本号
 */
 const commander = require('commander');
const pkg = require('../package.json');

// 获取的 commander 的单例
// const { program } = commander;

// 手动实例化一个 commander 实例
const program = new commander.Command();
program
  .name(Object.keys(pkg.bin)[0])
  .usage('<command> [options]')
  .version(pkg.version)
  .option('-d, --debug', '是否开启调试模式')
  .option('-e, --env <envName>', '获取环境变量名称');

// program.outputHelp()
// const options = program.opts()
// if(options.debug){
//   console.log(options.debug); // true
// }
// if(options.env){
//   console.log(options); // { debug: true, env: 'xxx' }
// }
// 注册命令的两种方法
//  program.command() 返回的是另一个对象 不是 program
//  cli-test clone aaa -f
const clone = program.command('clone <source> [destination]');
clone
  .description('clone a resp')
  // 当前路径下已经有文件的时候，是否能允许拷贝
  .option('-f , --force', '是否强制clone')
  .action((source, destination, cmdObj) => {
    //
    console.log(source, destination, cmdObj.force); // aaa undefined true
  });

// addCommand 子命令
const service = new commander.Command('service');

// cli-test service start 9000
service
  .command('start [port]')
  .description('start a service at some port')
  .action((port) => {
    console.log('start a port', port); // start a port 9000
  });

//  cli-test service stop
service
  .command('stop')
  .description('stop service')
  .action(() => {
    console.log('stop service');
  });

program.addCommand(service);

// program
//   .command('install [name]', 'install package', {
//     // 多个脚手架之间的串行操作
//     // executableFile:'zhangli-cli-dev', // cli-test install init -> imooc-cli init
//     // isDefault: true
//     // hidden: true 隐藏该条command命令
//   })
//   .alias('i');
// Error: 'cli-test-install' does not exist 注意

// 出了上述配置的 参数  所有配置的都会被 通过 arguments 的方式要求用户必须传入一个参数
// program
//   .arguments('<cmd> [options]')
//   .description('test command', {
//     cmd: 'command to run',
//     options: 'options from command',
//   })
//   .action((cmd, options) => {
//     console.log(cmd, options);
//   });

// 高级定制 help信息 2种方式  helpInformation / on
program.helpInformation = function () {
  return '';
};
// 如何返回我们自己的 help信息呢   program本身是继承自 EvenEmitter 默认就支持事件监听的机制
// program.on('--help', function () {
//   console.log('your help information');
// });

// 高级定制2 实现debug 模式 命令执行的过程中使用  执行之前是不行的
program.on('option:debug', function () {
  console.log('debug', program.debug);
  if (program.debug) {
    process.env.LOG_EVEL = 'verbose';
  }
  console.log(process.env.LOG_EVEL);
});

// 高级定制3 对未知命令的监听  cli-test aaa bbb
program.on('command:*', function (obj) {
  // console.log(obj);
  console.error('未知的命令', obj[0]);
  const availableCommands = program.commands.map((cmd) => cmd.name());
  // console.log(availableCommands); // [ 'clone', 'service' ]
  console.log('可用的命令',availableCommands.join(','));
});
program.parse(process.argv);