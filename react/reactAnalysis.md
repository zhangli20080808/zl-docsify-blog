# react 原理解析

[react 原理解析](https://yuchengkai.cn/react/)

# 核心 api

createElement、Component、render 三个 api

1. 创建 kreact：实现 createElement 并返回 vdom

```js
function createElement(type, props, ...children) {
    console.log(arguments) // 虚拟dom的创建是由内向外的
    // 返回虚拟DOM
    props.children = children
    // 能够区分组件类型：  因为后续的dom操作要根据类型去做
    // vtype: 1-原生标签；2-函数组件；3-类组件
    let vtype;
    if (typeof type === 'function') {
        // class组件
        if (type.isReactComponent) {
            vtype = 3
        } else {
            // 函数组件
            vtype = 2
        }
    } else if (typeof type === 'string') {
        //原始标签
        vtype = 1
    }

    return {
        vtype,
        type,
        props
    }
}

export class Component {
    //标识符 区分class和函数组件
    static isReactComponent = true

    constructor(props) {
        this.props = props
        this.state = {}
    }

    setState() {
    }

    forceUpdate() {
    }
}

export default {createElement}
```

2.  创建 kreact-dom：实现 render，能够将 kvdom 返回的 dom 追加至 container

```js
import initVNode from './kdom'

function render(vnode, container) {

    // container.innerHTML = `<pre>${JSON.stringify(vnode, null, 2)}</pre>`

    container.appendChild(initVNode(vnode))
}

export default {render}
```

3. 创建 kvdom：实现 initVNode，能够将 vdom 转换为 dom

```js
export default function initVNode(vnode) {
    let {vtype} = vnode
    if (!vtype) {
        //文本节点
        return document.createTextNode(vnode)
    }
    // vtype: 1-原生标签；2-函数组件；3-类组件
    if (vtype === 1) {
        //原生标签
        return createNativeElement(vnode)
    } else if (vtype === 2) {
        //函数组件
        return createFuncComp(vnode)
    } else {
        //类组件
        return createClassComp(vnode)
    }
}

function createNativeElement(vnode) {
    const {type, props} = vnode
    //'div'  {id:'demo',children:[],key,ref}
    const node = document.createElement(type);
    const {key, children, ...rest} = props
    Object.keys(rest).forEach(item => {
        // 需特殊处理的htmlFor，className
        if (item === 'className') {
            node.setAttribute('class', rest[item])
        } else if (item === "htmlFor") {
            node.setAttribute("for", rest[item])
        } else {
            node.setAttribute(item, rest[item])
        }
    })
    //递归子元素
    children.forEach(key => {
        node.appendChild(initVNode(key))
    });
    return node
}

function createFuncComp(vnode) {
    const {type, props} = vnode;
    // function   此处type是一个函数
    const newVNode = type(props);
    return initVNode(newVNode)
}

function createClassComp(vnode) {
    const {type, props} = vnode;
    // class xxx  此处type是一个class
    const comp = new type(props);
    //vnode 如何得到？ 调用组件自身的 render方法
    const newVNode = comp.render();
    //一定要记住 要转化成真实节点
    return initVNode(newVNode)
}
```

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

generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移
动操作，可以复用以前的 DOM 节点。

8. REMOVE_NODE，老 component 类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，
  需要执行删除操作，或者老 component 不在新集合里的，也需要执行删除操作。

# Hooks 原理

1. 将函数组件状态保存在外部作用域，类似链表的实现原理，由于有严格的顺序关系，所以函数组件中 useState 这些
   api 不能出现条件、循环语句中

```js
function FunctionalComponent() {
    const [state1, setState1] = useState(1)
    const [state2, setState2] = useState(2)
    const [state3, setState3] = useState(3)
}

hook1 => Fiber.memoizedState
state1 === hook1.memoizedState
hook1.next=>hook2
state2 === hook2.memoizedState
hook2.next=>hook3
state3 === hook2.memoizedState
```

2. Fibter

1. 为什么需要 fiber
1. 任务分解的意义
1. 增量渲染（把渲染任务拆分成块，匀到多帧）
1. 更新时能够暂停，终止，复用渲染任务
1. 给不同类型的更新赋予优先级
1. 并发方面新的基础能力
1. 更流畅


# Hooks学习总结