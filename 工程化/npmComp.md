# 开源一个 npm 包组件
工作中有时会遇到不同仓库但是同框架的项目中会用到同一个业务组件，那么可以将这个组件封装成 npm 包，发到私服上，供其他同学使用，提高复用降低工作量。业务组件的构建打包和开发项目的配置会有些不一样，有三种方式可选：
  - webpack: externals
  - babel: 直接 babel 编译（babel-cli）
  - rollup：  
善用 deerDependencies 。

本地测试：npm link / npm unlink

一个 react 业务组件脚手架看[这里](https://github.com/lvbowen/react-business-component-template)

参考：
  - [从工程化角度讨论如何快速构建可靠 React 组件](http://www.alloyteam.com/2017/03/from-an-engineering-point-of-view-discusses-how-to-construct-reliable-components-react/)
  - [如何从零开源一个React组件](https://zhuanlan.zhihu.com/p/73605806)
