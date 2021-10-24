# react 原理解析

[react 原理解析](https://yuchengkai.cn/react/)

# jsx

不能说 jsx 就是 react 元素？
jsx= react.createElement
在浏览器执行的时候，createElement 的返回值才是 react 元素=虚拟 DOM
是一种语法，打包的时候会进行编译，编译成 react.createElement,createElement 只是创建 react 元素的方法，
react 元素=虚拟 dom，也就是一个普通的 jsx 对象，描述了 dom 真实的样子

# 核心 api

createElement、Component、render 三个 api

## 创建 kreact：实现 createElement 并返回 vdom

```js
import initVNode from './kdom';
import { isFunc } from './util';

/**
 * 什么时候用对象 什么时候用类
 * 单例 对象就够了 需要很多对象的时候用类
 * 定义更新队列 所有组件共用一个 updateQueue
 */
export const updateQueue = {
  updaters: [], // 更新器数组
  // 是否处于批量更新模式 默认 非批量更新 粗暴比如点击事件之前设置为true结束设置为false 手动指定 源码 自动指定
  isBatchingUpdate: false,
  add(updater) {
    // 增加一个更细器
    this.updaters.push(updater);
  },
  batchUpdate() {
    // 强制批量更新组件更新
    this.updaters.forEach((update) => update.updateComponent());
    this.isBatchingUpdate = false;
  },
};

// 更新器会有多个 不断去创建实例

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; // 类组件的实例
    this.pendingStates = []; //等待更新的状态
  }

  addState(partialState) {
    // 先将这个分状态添加到 pendingStates 数组中去
    this.pendingStates.push(partialState);
    // 如果当前处于批量更新模式，也就是异步更新模式 把当前实例放到 updateQueue 里
    // 如果是非批量更新 也就是同步更新 则调用 updateComponent 直接更新
    updateQueue.isBatchingUpdate
      ? updateQueue.add(this)
      : this.updateComponent();
  }

  updateComponent() {
    let { classInstance, pendingStates } = this;
    if (pendingStates.length > 0) {
      // 拿到组件的老状态和数组中的新状态数组进行合并
      classInstance.state = this.getState();
      // 让组件强制更新
      classInstance.forceUpdate();
    }
  }

  /**
   * 根据老状态和等待生效的新状态，得到最后新状态
   * @returns { state } 获取最新state
   */
  getState() {
    let { classInstance, pendingStates } = this;
    let state = classInstance.state; // 组件XXX.state
    // 需要更新   拿到组件的老状态和数组中的新状态数组进行合并
    if (pendingStates.length > 0) {
      pendingStates.forEach((newState) => {
        if (isFunc(newState)) {
          // 如果势函数
          newState = newState(state);
        }
        state = { ...state, ...newState }; // 新状态覆盖老状态
      });
      pendingStates.length = 0; //清空
    }
    return state;
  }
}

/**
 *
 * @param type 元素的类型 可能是一个字符串(原生组件)，也可能是函数
 * @param config 配置的对象,一般来说是属性对象
 * @param children 第一个儿子
 * @returns {{vType: number, type, props}} 虚拟dom，也就是我们的react元素
 */
export function createElement(type, config, children) {
  // console.log( children) // 虚拟dom的创建是由内向外的
  if (config) {
    delete config._owner;
    delete config._store;
  }
  // 返回虚拟DOM
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2);
  }
  // children 可能是数组(多于一个儿子) 也有可能是字符串、数子 或者 null 也可能是个react元素
  let props = { ...config };
  props.children = children;
  // 能够区分组件类型：  因为后续的dom操作要根据类型去做
  // vType: 1-原生标签；2-函数组件；3-类组件
  let vType;
  if (typeof type === 'function') {
    // class组件
    if (type.isReactComponent) {
      vType = 3;
    } else {
      // 函数组件
      vType = 2;
    }
  } else if (typeof type === 'string') {
    //原始标签
    vType = 1;
  }

  return {
    vType,
    type,
    props,
  };
}

// 每个类组件都会实现自己的render方法 约定 实例化的时候去调用生成vnode
class Component {
  //标识符 区分class和函数组件
  static isReactComponent = true;

  constructor(props) {
    this.props = props;
    this.state = {};
    //  我们为每一个组件实例 配一个 updater实例
    this.updater = new Updater(this);
  }

  /**
   * 同步更新逻辑
   * @param partialState
   */
  setState(partialState) {
    // this.state = { ...this.state, ...partialState }
    // let renderVNode = this.render() // 重新调用render方法得到虚拟dom
    // updateClassInstance(this, renderVNode)

    // 我们的组件不再直接负责更新了
    this.updater.addState(partialState);
  }

  forceUpdate() {
    let renderVNode = this.render();
    updateClassComponent(this, renderVNode);
  }
}

function updateClassComponent(classInstance, renderVNode) {
  // 机械替换 后续换成diff
  let oldDom = classInstance.dom;
  let newDom = initVNode(renderVNode); // 真实dom
  oldDom.parentNode.replaceChild(newDom, oldDom);
  classInstance.dom = newDom;
}
```

## 创建 kreact-dom：实现 render，能够将 kvdom 返回的 dom 追加至 container

```js
import initVNode from './kdom';
/**
 * 虚拟Dom转换为真实Dom,并插入到容器里
 * @param vNode 虚拟dom
 * @param container 插入的容器
 */
function render(vNode, container) {
  // container.innerHTML = `<pre>${JSON.stringify(vNode, null, 2)}</pre>`
  const dom = initVNode(vNode);
  container.appendChild(dom);
}

export default { render };
```

## 创建 kvdom：实现 initVNode，能够将 vdom 转换为 dom

```js
/**
 * 把虚拟dom变成真实dom
 * @param vnode null 数字 字符串 react元素 不能是数组
 * @returns {Text|any}
 */
import ReactDom from './kreact-dom';
import { addEvent } from './event';

export default function initVNode(vnode) {
  if (!vnode) {
    return '';
  }
  // 如果textContent是一个字符串或者数字的话，创建一个文本的节点返回
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode);
  }
  // 负责就是要给react元素
  let { vType } = vnode;
  if (!vType) {
    //文本节点
    return document.createTextNode(vnode);
  }
  // vType: 1-原生标签；2-函数组件；3-类组件
  if (vType === 1) {
    //原生标签
    return createNativeElement(vnode);
  } else if (vType === 2) {
    //函数组件
    return createFuncComp(vnode);
  } else {
    //类组件
    return createClassComp(vnode);
  }
}

function createNativeElement(vnode) {
  const { type, props } = vnode;
  //'div'  {id:'demo',children:[],key,ref，style: { color: 'red' }}
  const node = document.createElement(type); // span div
  updateProps(node, props); // 更新属性 把虚拟Dom上的属性设置到真实Dom上
  // 处理子节点 如果子节点就是一个单节点 并且是字符串或者数字
  if (
    typeof props.children === 'string' ||
    typeof props.children === 'number'
  ) {
    node.textContent = props.children; // node.textContent = 'hello'
    // 说明是一个单 react 元素
  } else if (typeof props.children === 'object' && props.children.type) {
    ReactDom.render(props.children, node);
    // 如果儿子是一个数组，说明有多个节点
  } else if (typeof Array.isArray(props.children)) {
    reconcileChildren(props.children, node);
  } else {
    // 如果出现其他的以为情况 null 就是空串
    node.textContent = props.children ? props.children.toString() : '';
  }
  return node;
}

/**
 * 把虚拟Dom对象中的属性设置到真实Dom元素上
 * @param node dom元素
 * @param props 属性对象
 */
function updateProps(node, props) {
  const { key, children, ...rest } = props;
  Object.keys(rest).forEach((item) => {
    // 需特殊处理的htmlFor，className,style
    if (item === 'className') {
      node.setAttribute('class', rest[item]);
    } else if (item === 'htmlFor') {
      node.setAttribute('for', rest[item]);
    } else if (item === 'style') {
      const styleObj = rest[item];
      Object.keys(styleObj).forEach((cur) => {
        node.style[cur] = styleObj[cur]; // node.style.color = 'red'
      });
      // 点击事件 onClick
    } else if (item.startsWith('on')) {
      // node.onclick = onclick函数
      // node[item.toLocaleLowerCase()] = props[item]
      addEvent(node, item.toLocaleLowerCase(), rest[item]);
    } else {
      node.setAttribute(item, rest[item]);
    }
  });
}

/**
 * 把子节点从虚拟dom全部转成真实Dom并且插入到父节点去
 * @param children 子节点的虚拟Dom数组
 * @param parentNode 父节点的真实Dom
 */
function reconcileChildren(children, parentNode) {
  //递归子元素Node
  children.forEach((childrenVNode) => {
    ReactDom.render(childrenVNode, parentNode);
  });
}

/**
 * 函数组件的渲染过程
 * @param vnode
 * @returns {string|Text|any|string}
 * 1. 定义一个React元素，也就是虚拟dom，他的type 是函数 比如 Welcome
 * 2. render方法会执行这个 Welcome 函数，并传入props对象，返回虚拟dom
 * 3. 把返回的虚拟dom转成真实dom，插入到页面中去
 * function Welcome(props) { return <h1>{hello, props.name}</h1> }
 * vnode {type: Welcome ,props: { name :'zl'}}
 * newVNode { type: 'h1', props :{ children: { hello,zl }} }
 */
function createFuncComp(vnode) {
  const { type, props } = vnode;
  // function   此处type是一个函数 newVNode 可能是一个原生虚拟dom，也可能是一个组件虚拟dom
  const newVNode = type(props);
  return initVNode(newVNode);
}

/**
 *
 * @param
 * @returns {string|Text|any|Text|string}
 * 1. vnode 我们的vnode也可能是一个 类(组件)
 * 2. 在定义组件元素的时候，会把jsx所有的属性封装成一个props传递给组件
 * 3. 组件的名称一定要首字母大写 react是通过首字母来区分是原生还是自定义组件
 * 4. 先定义，再使用
 * 5. 组件要返回只能返回一个react根元素
 *
 * 类组件是如何渲染的？
 * 1. 定义一个类组件元素
 * 2. render
 *    1> 先创建类组件的实例，new XXX(props) this.props = props
 *    2> 调动实例的render方法(想想我们平常写的render方法和return)得到一个react元素
 *    3> 把返回的虚拟dom转成真实dom，插入到页面中去
 */
function createClassComp(vnode) {
  const { type, props } = vnode;
  // class xxx  此处type是一个class
  const comp = new type(props); // new Welcome({name:'zl'})
  //vNode 如何得到？ 调用组件自身的 render方法
  const newVNode = comp.render();
  //一定要记住 要转化成真实节点 让类组件实例上挂载一个dom，指向类组件的真实dom ->  组件更新的时候会用到
  const dom = initVNode(newVNode);
  comp.dom = dom;
  return dom;
}
```

## 合成事件

```js
/**
 * 合成事件
 * 1. 我们的事件对象是一个临时对象 用完就销毁掉了 实现一个共享对象的效果，节约内存 方便回收
 * 2. 为了批量更新  updateQueue
 * event 不是dom原生的 是经过react封装的 事件委托->document 在react17 绑定到根节点了
 */
handleClick = (event) => {
// event.persist() // persist 把这个event持久化  事件执行后不销毁
setTimeout(() => {
    console.log(event)
}, 1000)
// updateQueue.isBatchingUpdate = true
this.setState({ number: this.state.number + 1 })
console.log(this.state.number) // 0
this.setState({ number: this.state.number + 1 })
console.log(this.state.number)  // 0
setTimeout(() => {
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)  // 2
    this.setState({ number: this.state.number + 1 })
    console.log(this.state.number)  // 3
})
// updateQueue.batchUpdate()
}
-----------------------------------------------------------------
import { updateQueue } from './kreact';

/**
 * 给哪个dom元素绑定哪种类型的事件
 * @param dom 给哪个dom元素绑定事件 button 真实dom元素
 * @param eventType 事件类型 onClick
 * @param listener 事件处理函数 fn
 */
export function addEvent(dom, eventType, listener) {
  // 给dom增加一个store属性，值是一个空对象
  let store = dom.store || (dom.store = {});
  store[eventType] = listener; // store.onclick = handleClick
  if (!document[eventType]) {
    // 有可能会覆盖用户的赋值操作 也有可能会被用户赋值覆盖掉
    document[eventType] = dispatchEvent; // document.onclick = dispatchEvent
  }
}

let syntheticEvents = {};

/**
 * 为什么需要合成事件 作用是什么
 * 1. 可以实现批量更新
 * 2. 可以实现事件对象的缓存和回收
 * @param event
 */
function dispatchEvent(event) {
  // event是原生事件DOM对象
  let { target, type } = event; // type-> click target-> 事件源 button
  let eventType = `on${type}`; // onclick
  // 异步更新
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);

  while (target) {
    let { store } = target;
    // 调用事件 store存储过了
    let listener = store && store[eventType];
    // 包装事件 绑定了事件我们再去执行 不然点击没有绑定的区域会有问题
    // 自己实现事件冒泡
    listener && listener.call(target, syntheticEvent);
    target = target.parentNode;
  }
  for (const key in syntheticEvent) {
    syntheticEvents[key] = null;
  }
  updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  for (const key in nativeEvent) {
    syntheticEvents[key] = nativeEvent[key];
  }
  return syntheticEvents;
}
```

## ref

1. refs 提供了一种方式，允许我们访问 dom 节点或者在 render 方法中创建的 react 元素
2. 在 react 渲染声明周期时，表单上的 value 值将会覆盖 dom 节点中的值，在非受控组件中，我们希望 react 能赋予组件一个初始值，但是不去控制后续的更新，在这种情况下，可以指定一个 defaultValue，而不是 value

- ref 的值是一个字符串
-

# setState 原理

1. setState 批量行为：React 会合并多次 setState 操作为一次执行

```js
getState() {
    // 实例， 待更新状态  pendingStates要更新的状态
    let {instance, pendingStates} = this
    // 从组件实例中拿出现有之前的 state和props
    let {state, props} = instance
    if (pendingStates.length) {
        state = {...state}
        // setState({foo:'bla', bar:'lala'})
        // setState({foo:'dfdf', bar:'dfdfdf'})
        // setState((ns)=>({foo:ns.foo+'dfdf', bar:'dfdfdf'}))
        pendingStates.forEach(nextState => {
            // 如果是数组则做替换
            let isReplace = _.isArr(nextState)
            if (isReplace) {
                nextState = nextState[0]
            }
            // 如果传递的是函数
            if (_.isFn(nextState)) {
                nextState = nextState.call(instance, state, props)
            }
            // replace state 替换操作
            if (isReplace) {
                state = {...nextState}
            } else {
                state = {...state, ...nextState}
            }
        })
        pendingStates.length = 0
    }
    return state
}
```

2. 异步：setState 调用后，会调用其 updater.addState，最终调用 updateQueue.add 将任务添加到队列等待系统批量更新 batchUpdate

# react 事务的理解

![react事务的理解](./imgs/transction.png)

```js
// 先执行一个开始的逻辑，再执行这个函数体，然后再执行结束的逻辑，这个步骤，所以说
// react在底层执行函数的时候，都是按照这个机制去执行的，结合我们的 batchUpdate 思考
class Transaction {
  // 对一个方法进行多次改造 在方法之前之后增加一些逻辑
  perform(anyMethod, wrappers) {
    wrappers.forEach((wrapper) => wrapper.initialize());
    anyMethod();
    wrappers.forEach((wrapper) => wrapper.close());
  }
}
let transaction = new Transaction();
let oldFunc = () => {
  console.log('原有的方法');
};
// 当然也可以增加数组 增加好几层条件 wrapper1 wrapper2
transaction.perform(oldFunc, [
  {
    initialize() {
      console.log('初始化');
    },
    // close() {
    //   console.log('关闭');
    // },
  },
  {
    // initialize() {
    //   console.log('初始化');
    // },
    close() {
      console.log('关闭');
    },
  },
]);
```

# 组件渲染和更新过程

- props、state
- 执行 render -> 返回 vnode
- 执行 patch 函数 patch(container,vnode)
- setState(newState) -> dirtyComponent(可能有子组件)
- 遍历所有的 dirtyComponent render 生成一个新的 newVnode,再执行更新 patch(vnode,newVnode)

# batchUpdate 机制 - isBatchingUpdate

![batchUpdate](./imgs/batch.png)
![batchUpdate](./imgs/demo.png)

react 内部的机制，在函数开始执行的时候，设置 isBatchingUpdate 为 true，结束会置为 false，这个设置不是在函数中的，你可以理解人认为是在函数中，同步更新的时候看图，执行定时器的时候已经是 false 了。异步更新的时候，会去 更新 DC 中的所有组件，重新更新和渲染

1.  同步还是异步呢？

- setState 无所谓异步还是同步
- 主要是看是否能命中 batchUpdate 机制，依据就是判断 isBatchingUpdate

2.  哪些能命中 batchUpdate 机制呢？

- 生命周期(和调用他的函数)
- react 中注册的事件，和它调用的函数
- react 可以管理的入口 - 比如生命周期，onClick,onChange 事件等都可以命中

3.  哪些不能命中 batchUpdate 机制呢？

- setTimeout、setInterval(和它调用的函数)
- 自定义 dom 事件(和它调用的函数)
- react 管不到的入口

# 虚拟 DOM 原理剖析

1. diff 策略

同级比较，Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。

2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
   例如：div->p, CompA->CompB

3. 对于同一层级的一组子节点，通过唯一的 key 进行区分。

element diff

差异类型：

1. 替换原来的节点，例如把 div 换成了 p，Comp1 换成 Comp2
2. 移动、删除、新增子节点， 例如 ul 中的多个子节点 li 中出现了顺序互换。
3. 修改了节点的属性，例如节点类名发生了变化。
4. 对于文本节点，文本内容可能会改变。

5. 重排（reorder）操作：INSERT_MARKUP（插入）、MOVE_EXISTING（移动）和 REMOVE_NODE（删除）。

6. INSERT_MARKUP，新的 component 类型不在老集合里， 即是全新的节点，需要对新节点执行插入操作。

7. MOVE_EXISTING，在老集合有新 component 类型，且 element 是可更新的类型，

generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 DOM 节点。

8. REMOVE_NODE，老 component 类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，
   需要执行删除操作，或者老 component 不在新集合里的，也需要执行删除操作。
