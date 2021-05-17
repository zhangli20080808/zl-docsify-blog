# 脚手架设计和框架搭建

## 必要性

1. 研发效能
   核心目的，提升前端研发效能
2. 核心价值
   将研发过程：

- 自动化：项目重复代码拷贝/git 操作/发布上线操作
- 标准化：项目创建/git flow/发布流程/回滚流程
- 数据化：研发过程系统化、数据化，使得研发过程可量化

3. 和自动化构建的区别
   问题：jenkins、travis 等自动化构建工具已经比较成熟了，为什么还需要自研脚手架？

- 不满足需求：jenkins、travis 通常在 git hooks 中触发，需要在服务端执行，无法覆盖研发人员本地的功能，如：创建项目自动化、本地 git 操作自动化等
- 定制复杂：jenkins、travis 定制过程需要开发插件，其过程较为复杂，需要使用 Java 语言，对前端同学不够友好

## 从使用角度来理解什么是脚手架

1. 脚手架简介
   脚手架本质是一个操作系统的客户端，它通过命令行执行，比如：
   <code>vue create vue-test-app</code>
   上面这条命令由 3 个部分组成：

- 主命令: vue
- command: create
- command 的 param: vue-test-app
  它表示创建一个 vue 项目，项目的名称为 vue-test-app ，以上是最一个较为简单的脚手架命令，但实际场景往往更加复杂，比如：
  当前目录已经有文件了，我们需要覆盖当前目录下的文件，强制进行安装

```js
vue create vue-test-app --force
```

这里的--force， 叫做 option，用来辅助脚手架确认在特定场景下用户的选择（可以理解为配置）。还有一种场景：
通过 vue create 创建项目时，会自动执行 npm i 帮用户安装依赖，如果我们希望使用淘宝源来安装，可以输入命令：

```js
vue create vue-test-app --force -r https://registry.npm.taobao.org
```

-r -> 也叫做 option,与 --force 不同的是 使用 -，并且使用简写，这里的-r 也可以替换成 --registry
--help -> 查看 vue create 支持的所有 options

-r https://registry.npm.taobao.org后面的 -r https://registry.npm.taobao.org 成为 option 的 param，
其实 --force 可以理解为: --force true,简写为: --force 或 -r

2. 脚手架执行原理
   ![脚手架执行原理](./img/cli1.png)
   执行原理如下

- 在终端输入 vue create vue-test-app
- 终端解析出 vue 命令
- 终端在环境变量中找到 vue 命令
- 终端根据 vue 命令链接到实际文件 vue.js
- 终端利用 node 执行 vue.js
- vue.js 解析 command / options
- vue.js 执行 command
- 执行完毕，退出执行

3. 从应用的角度看如何开发一个脚手架
   以 vue-cli 为例

- 开发 npm 项目，该项目中应包含一个 bin/vue.js,并发布到 npm
- 将 npm 项目安装到 node 的 lib/node_modules
- 在 node 的 bin 目录下配置 vue 软链接 指向 lib/node_modules/@vue/cli/bin/vue.js

这样我们在执行 <code>vue</code> 命令的时候 可以找到 vue.js 进行执行

4. 为什么全局安装 <code>@vue/cli</code> 后会添加的命令为 <code>vue</code>？
<code>npm install -g @vue/cli </code>
<p>全局安装 <code>@vue/cli</code> 时发生了什么？</p>
<p>为什么 <code>vue</code> 指向一个 <code>js</code> 文件，我们却可以直接通过 <code>vue</code> 命令直接去执行它？</p>

5. 脚手架原理进阶
* 为什么说脚手架本质是操作系统的客户端？它和我们在PC上安装的应用/软件有什么区别？
* 如何为 node  脚手架命令创建别名？
* 描述脚手架命令执行的全过程
   ![脚手架执行过程](./img/cli2.png)

   ```js
   #!/usr/bin/env node  // 在环境变量中查找 node
   #!/usr/bin/node  // 直接执行 usr/bin/ 目录 下面的node
   ```
