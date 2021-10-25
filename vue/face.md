#

# 为何在 v-for 中使用 key

- 必须用 key，且不能是 random 和 index
- diff 算法中通过 tag 和 key 来进行判断，是否是 sameNode
- 减少渲染次数，提升渲染性能

# 描述 Vue 组件生命周期(父子组件)

- 单组件生命周期
- 父子组件生命周期关系

# Vue 组件如何通信

- 父子组件 props,this.$emit
- 自定义事件 event.$on event.$off event.$emit
- vuex

# 描述组件渲染和更新的过程

# 双向数据绑定 v-model 的实现原理

- input 元素的 value = this.name
- 绑定 input 事件 this.name = $event.target.value
- data 更新触发 re-render

# 对 mvvm 的理解

# computed 有何特点

- 缓存，data 不变不会重新计算
- 提高性能

# 为何组件 data 必须是一个函数

export default 看上去是一个对象，实质上我们的.vue 文件是一个 class，在每个地方使用这个组件的时候，
是对这个组件进行实例化，实例化的时候执行这个 data，如果 data 不是函数，每个组件的实例都一样了，就共享了

# ajax 请求应该放在哪个生命周期

- mount 里面，因为 js 是单线程的，ajax 异步获取数据，放在 mounted 之前没有用，只会让逻辑更加混乱

# 如何将组件所有的 props 传递给子组件

-$props,<User v-bind="$props"/>

# 多个组件有相同的逻辑，如何抽离

# keep-alive

- 缓存组件，不需要重复渲染的时候，如多个静态 tab 页面的切换

react 版 -> https://github.com/StructureBuilder/react-keep-alive

# 何时使用异步加载

- 加载大组件，编辑器，图表，路由异步加载

# 何时使用 beforeDestory

- 解绑自定义事件 event.$off
- 清楚定时器
- 解绑自定义的 dom 事件，如 window scroll 事件等

# 作用域插槽

# vuex 中 action 和 mutation 有什么区别

- action 中处理异步，mutation 不可以
- mutation 做原子操作
- action 可以整个多个 mutation

# 如何配置 vue-route 异步加载

# 请用 vnode 描述一个 DOM 结构

# 监听 data 变化的核心 api

# vue 如何监听数组变化

# 描述响应式原理

- 监听 data 变化
- 更新渲染过程

# diff 算法的事件复杂度

- o(n)
- 在 o(n^3)上面做了调整，同 tag，同 key，等
- patch、patchNode、addVnodes、removeVnodes

# vue 常见性能优化

- 合理使用 v-show,v-if
- 合理使用 computed
- v-for 时加 key，以及避免和 v-if 同时使用，因为 v-for 优先级更高，每次循环都要 v-if，是对性能的一种浪费
- 自定义事件，dom 事件即时销毁
- 合理使用异步组件，keep-alive
- data 层级不要太深
- webpack 层面优化
- 通用优化，图片懒加载
- ssr

# Vue中的key到底有什么⽤？
* key 是为Vue中的vnode标记的唯⼀id,通过这个key,我们的diff操作可以更准确、更快速
* diff算法的过程中,先会进⾏新旧节点的⾸尾交叉对⽐,当⽆法匹配的时候会⽤新节点的 key 与旧节点进⾏⽐对,然后超出差异.

diff程可以概括为：oldCh和newCh各有两个头尾的变量StartIdx和EndIdx，它们的2个变量相互⽐较，⼀共有4种 ⽐较⽅式。如果4种⽐较都没匹配，如果设置了key，就会⽤key进⾏⽐较，在⽐较的过程中，变量会往中间靠， ⼀旦StartIdx>EndIdx表明oldCh和newCh⾄少有⼀个已经遍历完了，就会结束⽐较,这四种⽐较⽅式就是⾸、尾、 旧尾新头、旧头新尾.

![](./img/key.png)
