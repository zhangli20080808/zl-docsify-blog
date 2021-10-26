# redux

## 概念
![](./imgs/connect.png)
Redux 是 JavaScript 应⽤的状态容器。它保证程序⾏为⼀致性且易于测试。

目标 实现 redux react-redux 中间件 原理(react 中为什么会用 react-redux 因为原生的 redux 是一个通用库，放在 react 中不方便) 如果要实现的话，其实 react 没有响应式的实现，其实是用了一个发布订阅模式，告诉你状态发生变更了，不用
react-redux 我们还要做一些额外的事情，1，常见一个上下文，把 store 从最顶层导下去 2.还要顶层的位置给我们的 store 加上一个订阅，这样我们才能发现他变化了，真的变化了，我们还要主动去激活它的重新渲染，不管是组件的强制更新还是 react-dom 的 render 重新渲染，都手动，挺不方便的

## redux 设计思想很简单，就两句

- Web 应用是一个状态机，视图与状态是一一对应的。
- 所有的状态，保存在一个对象里面。

- 你可以用在 vue,react,纯 js 都可以，官方定义说的他并不是一个全局状态管理工具，而是一个状态容器，因为 redux 并不是说一定要作为全局的状态管理工具，可以作为一个局部的状态容器来存在，帮助我们管理状态

和 vuex 有什么区别呢 在我们的 react 中 其实是没有 vuex 中的那个 action 的 react 中的 reducer 相当 vuex 中的 mutation，是用来
改状态的函数 从思想上来说的话，遵循一个函数式编程的思想 就是说我们 reducer 中做操作的时候，不应该去改之前的值，而是返回一个修改
后的全新的值
我们只有一个提交 aciton 的方式去告诉 reducer 去执行，直接改状态了 我们 dispatch 一个 action 相当于 vuex 中的 commit 操作

我们 vuex 中和 react 中都是提交 action 但是 行为是不同的

## vuex 设计思想

思考？ 一般我们用传参的方式 去接受新的数据 这个地方我们用 vuex 以一种可预测的方式发生变化 集中式管理组件的所有状态
设计思想
vuex 设计思想
所有组件的状态和数据放到同一个内存空间去管理，我们称之为 state states 上面的数据可以方便的映射到我们的组件上
来渲染组件 当组件的一些数据发生变化 可以 dispatch 一个 action action 可以进行一些异步操作 之后 commit 一个 mutations 这里也可
直接 commit 一个 mutations 他是唯一一个可以修改 state 的途径 其他任何方式去修改这个 state 都是非法的
设计目的
让 state 状态的修改可以预测 修改后呢 又可以反应到我们的组件上 实现了一个闭环
平常
修改组件的数据 数据的变化会直接映射到 dom 上 但 vuex 里我们是不能直接修改这个数据的 必须通过 dispatch--action
commit->mutations 来修改数据 确实会让我们的修改路径变长

使用场景

    1.多个组件的状态数据共享 如果应用比较复杂，有些数据是共享的 这些组件如果是一些兄弟组件 或者 关联度很低的组件 这个时候我们共享数据就会比较困难 eventbus 都是很费劲的

    2.路由间的复杂数据传递 我们遇到一些路由跳转场景  到传递的参数很复杂的时候 用vuex会是一个很好的方案 简单的数据不需要vuex

## redux 和 vuex 截然不同

同样是 dispatch 一个 action 尝试去改变状态，那么这个状态发生变更之后，其实在这个底层会有更新函数会做订阅，其实是用了一个发布订阅模式，然后会把这个更新函数直接订阅，通过订阅的方式，传给 redux，只要 redux 中的数据发生变化，就把刚才订阅的所有回调函数执行一遍，这点上 数据变更通知的方式 是截然不同的，相比 vuex

## redux与mobx的区别?
* redux将数据保存在单⼀的store中，mobx将数据保存在分散的多个store中 
* redux使⽤plain object保存数据，需要⼿动处理变化后的操作；
* mobx适⽤observable保存数据，数据变化后⾃动处理响应的操作 
* redux使⽤不可变状态，这意味着状态是只读的，不能直接去修改它，⽽是应该返回⼀个新的状态，同时使⽤纯函 数；mobx中的状态是可变的，可以直接对其进⾏修改 
* mobx相对来说⽐较简单，在其中有很多的抽象，mobx更多的使⽤⾯向对象的编程思维；redux会⽐较复杂，因为 其中的函数式编程思想掌握起来不是那么容易，同时需要借助⼀系列的中间件来处理异步和副作⽤ 
* mobx中有更多的抽象和封装，调试会⽐较困难，同时结果也难以预测；⽽redux提供能够进⾏时间回溯的开发⼯ 具，同时其纯函数以及更少的抽象，让调试变得更加的容易

## 场景使用
* mobx更适合数据不复杂的应⽤: mobx难以调试,很多状态⽆法回溯,⾯对复杂度⾼的应⽤时,往往⼒不从⼼. 
* redux适合有回溯需求的应⽤: ⽐如⼀个画板应⽤、⼀个表格应⽤，很多时候需要撤销、重做等操作，由于redux不可变 的特性，天然⽀持这些操作. 
* mobx适合短平快的项⽬: mobx上⼿简单,样板代码少,可以很⼤程度上提⾼开发效率. 当然mobx和redux也并不⼀定是⾮此即彼的关系,你也可以在项⽬中⽤redux作为全局状态管理,⽤mobx作为组件局部状态管理器来⽤.

## reducer 和 compose 实现

1. 因为只能有一个 store 仓库，仓库里面只能有一个状态，也只能一个 reducer，所以说，当有很多状态的
   时候，我们可以先分开写，然后再合并起来

reducer 就是⼀个纯函数，接收旧的 state 和 action，返回新的 state。
<code>;(previousState, action) => newState</code>
之所以将这样的函数称之为 reducer，是因为这种函数与被传⼊ Array.prototype.reduce(reducer, ?initialValue) ⾥的回调函数属于相同的类型。保持 reducer 纯净⾮常重要。永远不要在 reducer ⾥做这些操作：

- 修改传⼊参数；
- 执⾏有副作⽤的操作，如 API 请求和路由跳转；
- 调⽤⾮纯函数，如 Date.now() 或 Math.random()。
  [什么是 reducer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

  ```js
  const array1 = [1, 2, 3, 4];
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  // 1 + 2 + 3 + 4
  console.log(array1.reduce(reducer));
  // expected output: 10
  // 5 + 1 + 2 + 3 + 4
  console.log(array1.reduce(reducer, 5));
  // expected output: 15

  // 思考：有如下函数， 聚合成⼀个函数，并把第⼀个函数的返回值传递给下⼀个函数，如何处理。
  function f1(arg) {
    console.log('f1', arg);
    return arg;
  }
  function f2(arg) {
    console.log('f2', arg);
    return arg;
  }
  function f3(arg) {
    console.log('f3', arg);
    return arg;
  }
  // result
  function compose(...funcs) {
    if (funcs.length === 0) {
      return (arg) => arg;
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce(
      (a, b) =>
        (...args) =>
          a(b(...args))
    );
  }
  console.log(compose(f1, f2, f3)('omg'));
  ```

## 工作流程：

![redux flow](../static/img/reduxFlow.jpg)

- createStore 创建 store
- reducer 初始化 修改状态函数
- getState 获取最新值
- dispatch 提交更新
- subscribe 变更订阅

1. 需要⼀个 store 来存储数据 - createStore 创建 store
2. store ⾥的 reducer 初始化 state 并定义 state 修改规则 -reducer 初始化 修改状态函数
3. getState 获取最新值
4. 通过 dispatch ⼀个 action 来提交对数据的修改 - dispatch 提交更新
5. action 提交到 reducer 函数⾥，根据传⼊的 action 的 type，返回新的 state -subscribe 变更订阅

## eg: 以一个计数器例子分析：

```js
import { createStore } from 'redux';

class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props;
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>增加</button>
      </div>
    );
  }
}

// Reducer
function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'increase':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// Action
const increaseAction = { type: 'increase' };

// Store
const store = createStore(counter);

const render = () =>
  ReactDOM.render(
    <Counter
      value={store.getState().count}
      onIncreaseClick={() => store.dispatch(increaseAction)}
    />,
    document.getElementById('root')
  );
render();
// State 发生变化，或者派发dispatch,就自动执行这个监听函数, 进而重新渲染，如果没有这个组件不会更新
store.subscribe(render);
```

- 定义好 reducer 后， 通过 createStore 函数接收 reducer 创建好 store，一个应用只有 store;
- 然后用户通过 store.dispatch(action) 发出 action，**此时 reducer 会自动触发，并返回新的 state**;
- state 发生变化后，监听函数 store.subscribe(render) 会执行，上面传的是 render 函数，所以组件会重新渲染。

**Reducer 拆分**

如果项目比较复杂，必然会出现 reducer 函数过大的问题，这个时候需要进行拆分，可以根据业务模块分成对应的 reducer 文件，各自模块 initState 也可放在 reducer 里，这样 state 和 reducer 都分而治之了。

```js
// redux/count.redux
export const add = (num) => ({ type: 'add', payload: num }) // action creator
export const minus = () => ({ type: 'minus' }) // action creator

// 异步的返回的是函数
export const asyncAdd = (dispatch, getState) => (dispatch) => {
  // 异步调用在这里
  setTimeout(() => {
    dispatch({ type: 'add' })
  }, 1000)
}

export const counterReducer = function (state = 0, action) {
  const num = action.payload || 1
  switch (action.type) {
    case 'add':
      return state + num
    case 'minus':
      return state - num
    default:
      return state
  }
}
// reducer.js
import { combineReducers } from 'redux';
import user from './redux/user.redux';
import { counterReducer } from './redux/count.redux';

let reducers = {
  user,
  count: counterReducer
}
// 用 combineReducers 合并 reducer，再传给 createStore。
function combineReducers(reducers) { // 合并之后返回一个新的reducer
  return function combination(state, action) {
    let nextState = {};
    for (let key in reducers) {
      nextState[key] = reducers[key](state[key], action);
    }
    return nextState;
  };
}
export default combineReducers(reducers);

// index.js
import reducers from './reducer';
const store = createStore(reducers);
export default store
```

**redux-thunk 中间件**

reducer 计算 state 是同步，如何实现异步操作呢？这就需要用到 redux-thunk redux-logger 中间件，该中间件的功能是让 dispatch() 可以接受函数作为 action。
先执行中间件函数 然后再去执行我们的 reducer

thunk 增加了处理函数型 action 的能力
![中间件](./imgs/middle.png)
![中间件](./imgs/middle2.png)
```js
// 异步的返回的是函数
export const asyncAdd = (dispatch, getState) => (dispatch) => {
  // 异步调用在这里
  setTimeout(() => {
    dispatch({ type: 'add' });
  }, 1000);
};

// thunk实现
const thunk =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // thunk逻辑：处理函数action 或者 promise
    if (typeof action == 'function') {
      return action(dispatch, getState);
    }
    if(typeof action.then === 'function'){
      action.then(()=>{
        // 重新派发
        dispatch(action)
      })
    }
    // 不是函数直接跳过
    return next(action);
  };
```

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducers';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  reducer,
  applyMiddleware(thunk, logger) // applyMiddleware 注册中间件
);
```

然后发出一个有异步操作的 action：

```js
const fetchPosts = postTitle => (dispatch, getState) => {
  dispatch(requestPosts(postTitle));
  return fetch(`/some/API/${postTitle}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts(postTitle, json)));
  };
};

// 使用方法一
store.dispatch(fetchPosts('reactjs'));
// 使用方法二
store.dispatch(fetchPosts('reactjs')).then(() =>
  console.log(store.getState())
);
```

上面代码中，fetchPosts 是一个 Action Creator（动作生成器），返回一个函数。这个函数执行后，先发出一个 Action（requestPosts(postTitle)），然后进行异步操作。拿到结果后，先将结果转成 JSON 格式，然后再发出一个 Action（ receivePosts(postTitle, json)）。  
总结异步操作：先使用 redux-thunk 中间件改造 store.dispatch，然后写出一个含异步操作的 Action Creator。

# 实现 redux

## redux 实现，中间件理解和实现

```js
/*
 * 中间件理解  dispatch经过 applyMiddleWare 之后 -> SuperDispatch (对dispatch执行若干次高阶函数)
 * SuperDispatch会把所有中间件执行完后 再执行正常的 dispatch
 * 函数复合 比如我想让这个数组顺序执行  [fn1,fn2,fn3]  -> fn3(fn2(fn1()))
   store
   1. 获取仓库中的状态 store.getState
   2. 向仓库派发动作 store.dispatch
   3. 仓库收到动作后会把动作和老的状态传给 reducer(处理器或者计算器) 来计算新状态

一般来说，在组件挂载成功之后，会进行订阅，当组件卸载的之前会取消订阅
const store = createStore(
  combineReducers({ counter: counterReducer }),
  applyMiddleware(logger, thunk)
);
applyMiddleware(logger)(createStore)(combineReducers)
 * */

export function createStore(reducer, enhancer) {
  // 如果存在enhancer  enhancer实现中间件机制的核心 高阶函数
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  // 保存状态
  let currentState = undefined;
  const currentListeners = []; // 回调函数数组

  function getState() {
    return currentState;
  }
  // 更新状态
  function dispatch(action) {
    // 修改,传入老状态和action，计算出新的状态，更新新状态
    currentState = reducer(currentState, action);
    // 变更通知
    currentListeners.forEach((v) => v());
    return action;
  }
  // subscribe 我们的render函数，有 dispatch 动作，我们就执行
  function subscribe(cb) {
    currentListeners.push(cb);
    return function () {
      let index = currentListeners.indexOf(cb);
      currentListeners.splice(index, 1);
      // currentListeners = currentListeners.filter((item) => item !== cb);
    };
  }

  // 派发一个默认动作，为了给我们的 currentState 初始值
  dispatch({ type: '@IMOOC/KKB-REDUX' });

  return {
    getState,
    dispatch,
    subscribe,
  };
}
// 中间件实现  核⼼任务是实现函数序列执⾏ 目的  先去执行我们的 中间件 再去执行我们的 reducer 强化 dispatch
export function applyMiddleware(...middlewares) {
  // 返回强化以后函数
  return (createStore) =>
    (...args) => {
      // 完成之前createStore工作
      const store = createStore(...args);
      // 原先dispatch
      let dispatch = store.dispatch;
      // 传递给中间件函数的参数
      const midApi = {
        getState: store.getState,
        // args action 让midApi里面的 dispatch 方法指向改造后的  dispatch 方法
        dispatch: (...args) => dispatch(...args),  // 刚开始 默认 undefined
      };
      // 将来中间件函数签名如下： function ({}) {}   使中间件可以获取状态值派发action
      //[fn1(dispatch),fn2(dispatch)] => fn(dispatch)
      const chain = middlewares.map((mw) => mw(midApi));
      // 强化dispatch,让他可以按顺序执行中间件函数  最终还是要执行dispatch compose可以chain函数数组合成一个函数
      dispatch = compose(...chain)(store.dispatch);
      // 返回全新store，仅更新强化过的dispatch函数
      return {
        ...store,
        dispatch,
      };
    };
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  // 聚合函数数组为一个函数 [fn1,fn2] => fn2(fn1())
  return funcs.reduce(
    (left, right) =>
      (...args) =>
        right(left(...args))
  );
}
// 1. 能结构出  dispatch,getState 通过logger去改造我们的store
function logger({ dispatch, getState }) {
  // 返回真正中间件任务执行函数
  return (dispatch) => (action) => {
    // 执行中间件任务
    console.log(action.type + '执行了！！！');

    // 执行下一个中间件 dispatch(action）返回的还是一个action
    return dispatch(action);
  };
}
--------简写--------
function


```

## 异步

Redux 只是个纯粹的状态管理器，默认只⽀持同步，实现异
步任务 ⽐如延迟，⽹络请求，需要中间件的⽀持，⽐如我们
试⽤最简单的 redux-thunk 和 redux-logger 。
中间件就是⼀个函数，对 store.dispatch ⽅法进⾏改造，
在发出 Action 和执⾏ Reducer 这两步之间，添加了其他功
能。

# react-redux

如果需要在 react 使用 redux，可以直接使用 react-redux 库（也是 redux 作者开发的），这样组件可以更方便拿到 state 和 发出 dispatch(action)，不用一层层传。也不用通过 store.subscribe 监听 render 函数去重新渲染，而是自动完成渲染。

主要是可以将我们的 state 转换成组件中的状态，组件中的状态和普通变量不一样在哪里呢？就是我们组件中的状态改变的时候页面会自动渲染，react-redux 做的就是这件事情，作为一个桥梁，把我们 state 中的数据和我们的组件连接在一起

redux 每次都重新调用 render 和 getState 太 low 了 使用 react 方式 和订阅问题

1. provider 为后代组件提供 store
2. connect 为组件提供数据和变更方法(每一次数据只要变更，自动的帮助我们组件刷新，把最新的值传给我们，用属性的方式传)

## UI 组件和容器组件

React-Redux 将所有组件分成两大类：UI 组件和 容器组件。  
UI 组件特点：

- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用 this.state 这个变量）
- 所有数据都由参数（props）提供
- 不使用任何 Redux 的 API

容器组件特点（与 UI 组件相反）：

- 负责管理数据和业务逻辑，不负责 UI 的呈现（**这点要理解**）
- 带有内部状态
- 使用 Redux 的 API

总之，只要记住一句话就可以了：UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。  
React-Redux 规定，所有的 UI 组件都由用户提供，_容器组件则是由 React-Redux 自动生成_。
也就是说，用户负责视觉层，状态管理则是全部交给它。

## connect

```js
/**
组件和仓库的关系？
1. 输入 把仓库里的数据输入到组件中显示
2. 输出 组件派发动作，从而修改仓库里的状态
*/
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options]);
```

UI 组件和容器组件分离,React-Redux 提供 connect 方法，用于从 UI 组件生成容器组件。connect 的意思，就是将这两种组件连起来。

- 连接 React 组件与 Redux store
- 返回⼀个新的已与 Redux store 连接的组件类。

1. mapStateToProps(state, [ownProps]):stateProps
   该回调函数必须返回⼀个纯对象，这个对象会与组件的 props 合并。
   如果定义该参数，组件将会监听 Redux store 的变化，否则 不监听。
   ownProps 是当前组件⾃身的 props，如果指定了，那么只要组件接收到新的 props，mapStateToProps 就会被调
   ⽤，mapStateToProps 都会被重新计算，mapDispatchToProps 也会被调⽤。注意性能！

2. mapDispatchToProps(dispatch, [ownProps]): dispatchProps

```js
export default connect(
  mapStateToProps
  // 如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注⼊到你的组件 props 中。
);
```

- 如果传递的是⼀个对象，那么每个定义在该对象的函数都将被当作 Redux action creator，对象所定义的⽅法名将
  作为属性名；每个⽅法将返回⼀个新的函数，函数中 dispatch ⽅法会将 action creator 的返回值作为参数执
  ⾏。这些属性会被合并到组件的 props 中。
- 如果传递的是⼀个函数，该函数将接收⼀个 dispatch 函
  数，然后由你来决定如何返回⼀个对象。
  ownProps 是当前组件⾃身的 props，如果指定了，那么只
  要组件接收到新的 props，mapDispatchToProps 就会被
  调⽤。注意性能！

3. mergeProps(stateProps, dispatchProps,ownProps): props
   如果指定了这个参数，mapStateToProps() 与 mapDispatchToProps() 的执⾏结果和组件⾃身的 props 将传⼊到这个回调函数中。该回调函数返回的对象将作为 props 传递到被包装的组件中。你也许可以⽤这个回调函数，根据组件的 props 来筛选部分的 state 数据，或者把 props 中的某个特定变量与 action creator 绑定在
   ⼀起。如果你省略这个参数，默认情况下返回 Object.assign({}, ownProps, stateProps,dispatchProps) 的结果。

```js
import { connect } from 'react-redux';
// TodoList 是 UI 组件，VisibleTodoList 是容器组件  UI 组件和容器组件分离 非常经典的模式 hook的出现打破了这个模式
const VisibleTodoList = connect(
  // 工作中一般的用的装饰器，@connect(mapStateToProps, mapDispatchToProps)
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
```

上面代码中，connect 方法接受两个参数：mapStateToProps 和 mapDispatchToProps。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将 state 映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 dispatch(action)。

```js
// 参数1：mapStateToProps = (state) => {return {num: state}} 把状态映射到属性上
// 参数2：mapDispatchToProps = dispatch => {return {add:()=>dispatch({type:'add'})}}  把dispatch映射到属性上
// connect两个任务：
// 1.自动渲染
// 2.把值映射到组件属性
// connect 有个默认行为  如果用户不传第二个参数 默认就创建一个 dispatch
@connect(
  state => ({ num: state.counter }),
  {
    // 理解为vuex中的action
    add,  //add : (num) => ({ type: 'add', payload: num }); // action creator 返回我们的action对象
    minus,
    asyncAdd: (dispatch, getState)=> dispatch => {
      // 异步调用在这里
      setTimeout(() => {
        dispatch({ type: 'add' payload: num });
      }, 1000);
    }
  }
)
```

## mapStateToProps 和 mapDispatchToProps

1. mapStateToProps - 把状态中的状态变成组件的属性对象

```js
// 是一个函数，一般返回一个对象。
// 它的作用就是建立一个从（外部的）state 对象到（UI 组件的）props 对象的映射关系。比如
// mapStateToProps 返回对象 obj，则 UI 组件的 props = { ...this.props, ...obj }
function mapStateToProps(state) {
  return state.obj; // 当成组件的属性对象
}
```

2. mapStateToProps 会订阅 Store，每当 state 更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。

3. mapDispatchToProps  
   可以是一个函数，也可以是一个对象。用来建立 UI 组件的参数到 store.dispatch 方法的映射。

## Provider 组件 <Provider store>

```js
// React-Redux 提供 Provider 组件，可以让容器组件拿到 state。
// <Provider store> 使组件层级中的 connect() ⽅法都能够获得 Redux store。
// 正常情况下，你的根组件应该嵌套在<Provider> 中才能使⽤ connect() ⽅法
let store = createStore(todoApp);
render(
  //  把Provider放在根组件外层，使⼦组件能获得store
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

上面代码中，Provider 在根组件外面包了一层，这样一来，App 的所有子组件就默认都可以拿到 state 了。

- 它的原理是 React 组件的 context 属性，store 放在了上下文对象 context 上面，子组件就可以从 context 拿到 store。

## 计数器例子

将前面 redux 里的例子用 react-redux 改造如下：

```js
class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props;
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>增加</button>
      </div>
    );
  }
}
// Reducer state->老装填，action->动作
function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'increase':
      const newState = Object.assign({}, state, { count: state.count + 1 });
      return newState;
    default:
      return state;
  }
}
// Store
const store = createStore(counter);
// Action
const increaseAction = { type: 'increase' };
// Map Redux state to component props
function mapStateToProps(state) {
  return {
    value: state.count,
  };
}
// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction),
  };
}
// Connected Component  状态映射 mapStateToProps  派发事件映射 mapDispatchToProps
const App = connect(mapStateToProps, mapDispatchToProps)(Counter);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

## bindActionCreators 实现

![bindActionCreators简化dispatch操作](./imgs/bindCator.png)

```js
// 返回一个新的函数
// 添加一个bindActionCreator能转换actionCreator为派发函数，redux.js
function bindActionCreator(creator, dispatch) {
  // 页面使用 store.dispatch({type: 'add'})
  // ()=>({type:'add'}) -- creator
  return (...args) => dispatch(creator(...args));
}
// 批量绑定
// let actions = {add,minus}  let boundAction = bindActionCreators(actions,dispatch)
// 使用：boundAction.add
export function bindActionCreators(creators, dispatch) {
  // {add:()=>({type:'add'})}  从上面变下面
  // {add:(...args) => dispatch(creator(...args))} //执行dispatch {type:'add'}
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = bindActionCreator(creators[item], dispatch);
    return ret;
  }, {});
  // for in
  // let boundActionCreators = {};
  // for (const key in creators) {
  //   const actionCreator = creators[key];
  //   boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
  // }
  // return boundActionCreators;
}
```

## 详细使用

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// let boundAdd = bindActionCreators(add,store.dispatch)
//  bindActionCreators 帮助我们简化页面代码操作
// connect帮组⼦组件与store链接，其实就是⾼阶组件，这⾥返回的是⼀个新的组件
export default connect(
  // mapStateToProps Function (state, ownProps)
  (state) => ({ count: state }),
  // !谨慎使⽤ownProps，如果它发⽣变化，mapStateToProps就会执⾏，⾥⾯的state会被重新计算，容易影响性能
  // (state, ownProps) => {
  // console.log("ownProps", ownProps); //sylog
  // return {
  // count: state
  // };
  // }
  // mapDispatchToProps Object/Function 如果不定义 默认把props注⼊组件
  // 如果是对象的话，原版的dispatch就没有被注⼊了
  // {
  // add: () => ({type: "ADD"})
  // }
  // Function (dispatch,ownProps)
  // !谨慎使⽤ownProps，如果它发⽣变化，mapDispatchToProps就会执⾏，容易影响性能
  // (dispatch, ownProps) => {
  // console.log("ownProps", ownProps); //sylog
  (dispatch) => {
    let res = {
      add: () => ({ type: 'ADD' }),
      minus: () => ({ type: 'MINUS' }),
    };
    res = bindActionCreators(res, dispatch);
    return { dispatch, ...res };
  },

  // 常规
  // (dispatch, ownProps) => ({
  //    add: (mount) => dispatch({ type: 'ADD', payload: mount + ownProps.payload }),
  //    minus: () => dispatch({ type: 'MINUS' }),
  // })

  // mergeProps Function
  // 如果指定了这个参数，`mapStateToProps()` 与`mapDispatchToProps()` 的执⾏结果和组件⾃身的`props` 将传到这个回调函数中。
  (stateProps, dispatchProps, ownProps) => {
    console.log('mergeProps', stateProps, dispatchProps, ownProps); //sy-log
    return { omg: 'omg', ...stateProps, ...dispatchProps, ...ownProps };
  }
)(
  class ReactReduxPage extends Component {
    render() {
      console.log('props', this.props); //sylog
      const { count, dispatch, add, minus } = this.props;
      return (
        <div>
          <h3>ReactReduxPage</h3> <p>{count}</p>{' '}
          <button onClick={() => dispatch({ type: 'ADD' })}>
            add use dispatch
          </button>{' '}
          <button onClick={add}>add</button>{' '}
          <button onClick={minus}>minus</button>
        </div>
      );
    }
  }
);
```

## useSelector、useDispatch

```js
import { useContext } from 'react';
import ReactReduxContext from '../ReactReduxContext';

export const useDispatch = () => {
  const { store } = useContext(ReactReduxContext);
  return store.dispatch;
};

import { useContext, useLayoutEffect, useReducer } from 'react';

import ReactReduxContext from '../ReactReduxContext';
const equality = (a, b) => a === b; //可以自定义比较
function useSelectorWithState(selector, equality, store, subscription) {
  let storeState = store.getState();
  let selectedState = selector(storeState);
  const [, forceRender] = useReducer((x) => x + 1, 0); //更新状态，使用setState需要传参数，不方便
  useLayoutEffect(() => {
    subscription.subscribe(forceRender);
  });
  return selectedState;
}
const useSelector = (selector) => {
  const { store, subscription } = useContext(ReactReduxContext);
  const selectedState = useSelectorWithState(
    selector,
    equality,
    store,
    subscription
  );
  return selectedState;
};
export default useSelector;
```

## 实现 react-redux

1. 实现高阶函数工厂 connect 可以根据传入状态映射规则函数 和派发映射规则函数映射需要的属性 可以处理变更检测
2. 实现一个 Provider 组件可以传递 store

```js
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from './kkb-redux';
export const connect = (
  mapStateToProps = (state) => state,
  mapDispatchToProps = {}
) => (WrapComponent) => {
  return class ConnectComponent extends React.Component {
    // class组件中声明静态 contextTypes 可以获取上下文 context ,内部实现一定是从上级组件中传递下来的上下文
    <!-- 如果是类组件的话 会作为 构造函数的第二个参数 通过this.context访问 -->
    static contextTypes = { store: PropTypes.object };
    constructor(props, context) {
      super(props, context);
      this.state = { props: {} };
    }
    componentDidMount() {
      const { store } = this.context;
      this.unsubscribe = store.subscribe(() => this.update());
      this.update();
    }
    componentWillUnmount(){
      this.unsubscribe()
    }
    update() {
      const { store } = this.context;
      // state=>({num:state.counter})  mapStateToProps相当于去执行我们前面传进来的这个 把state穿进去了
      const stateProps = mapStateToProps(store.getState());
      // 返回一个action add:()=> ({type:'add'})
      const dispatchProps = bindActionCreators(
        mapDispatchToProps,
        store.dispatch
      );
      this.setState({
        props: { ...this.state.props, ...stateProps, ...dispatchProps },
      });
    }
    render() {
      return <WrapComponent {...this.state.props}></WrapComponent>;
    }
  };
};

export class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object,
  };
  getChildContext() {
    return { store: this.store };
  }
  constructor(props, context) {
    super(props, context);
    this.store = props.store;
  }
  render() {
    return this.props.children;
  }
}
```

## connect 实现 hook 版

```js
import React, { useState, useMemo, useLayoutEffect, useReducer } from 'react';

import ReactReduxContext from './ReactReduxContext';
import { bindActionCreators } from 'redux';
/**
 * HOC
 * @param {*} mapStateToProps 把仓库的状态映射为组件的属性对象
 * @param {*} mapDispatchToProps 把 dispatch 映射为组件的属性对象
 */
export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    return function (props) {
      // 组件props
      const { store } = React.useContext(ReactReduxContext);
      const { dispatch, getState, subscribe } = store;
      let prevState = getState(); // 获取最新状态
      const stateProps = useMemo(() => mapStateToProps(prevState), [prevState]);
      const dispatchProps = useMemo(() => {
        let dispatchProps;
        if (typeof mapDispatchToProps === 'object') {
          dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
        } else if (typeof mapDispatchToProps === 'function') {
          dispatchProps = mapDispatchToProps(dispatch, props);
        } else {
          dispatchProps = { dispatch };
        }
        return dispatchProps;
      }, [props, dispatch]);
      // 订阅
      // js代码执行，并非浏览器的渲染
      // const [state, forceUpdate] = useReducer((x) => x + 1, 0); // 会让组件刷新
      const [, setState] = useState(0);
      useLayoutEffect(() => {
        // return subscribe(() => forceUpdate(state + 1)); // 如果状态发生变更的话，就执行forceUpdate
        return subscribe(() => setState((x) => x + 1)); // 如果状态发生变更的话，就执行forceUpdate
      }, [subscribe]);
      return <OldComponent {...props} {...stateProps} {...dispatchProps} />;
    };
  };
}
```

# dva

[dva](https://dvajs.com/guide/) 首先是一个基于 redux 和 [redux-saga](https://redux-saga-in-chinese.js.org/) 的数据流方案，如果使用 dva 框架开发，可以更方便的使用 redux 功能，提高开发效率，推荐使用哦。

修改 state 的逻辑都会放在 models 下 (定义 model)：

```js
// models/count.js
export default {
  namespace: 'count',
  state: {
    count: 0,
  },
  // 副作用，底层是引入了 redux-saga 做异步流程控制
  effects: {
    *addAfter1Second({ payload }, { call, put }) {
      yield call(delay, payload); // delay 可以是个异步操作，payload 是组件传过来的 { id: 123 }
      yield put({ type: 'add' }); // 会触发 reducers 里的 add 方法
    },
  },
  reducers: {
    add(state, action) {
      // action 对应的是 { type: 'add' } 对象
      return {
        ...state,
        count: state.count + 1,
      };
    },
  },
  // 订阅
  subscriptions: {
    set({ history }) {
      // 监听 history 变化
      return history.listen((res) => {
        console.log(res);
        if (window._dgt) {
          window._dgt.push(['track_SPA_view']);
        }
      });
    },
  },
};
```

如何串联 model 和 UI component？也是通过 connect 方法，例如：

```js
import { connect } from 'dva';

@connect(({ count }) => ({
  // 这里面的属性都会加到组件的 props 上面去
  count,
}))
export default class Counter extends Component {
  componentDidMount() {
    console.log(this.props.count); // { count: 0 }, 返回的就是对应 model 文件里的 state 对象。
    this.props.dispath({
      type: 'count/addAfter1Second',
      payload: {
        id: 123,
      },
    });
  }
  render() {}
}
```

##### dva 数据流向

通过 dispatch 发起一个 action，如果是同步行为会直接通过 Reducers 改变 State ，如果是异步行为（副作用）会先触发 Effects 然后流向 Reducers 最终改变 State，所以在 dva 中，数据流向非常清晰简明。

![dva](../static/img/dva.png)

## 扩展阅读

- [Redux 中文文档](https://www.redux.org.cn/)
- [Redux](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
- [React-Redux](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)
