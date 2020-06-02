# 从 redux 到 react-redux 再到 dva

## redux

目标 实现 redux react-redux 中间件 原理(react 中为什么会用 react-redux 因为原生的 redux 是一个通用库，放在 react 中不方便)

redux 设计思想很简单，就两句

- Web 应用是一个状态机，视图与状态是一一对应的。
- 所有的状态，保存在一个对象里面。

和 vuex 有什么区别呢 在我们的 react 中 其实是没有 vuex 中的那个 action 的 react 中的 reducer 相当 vuex 中的 mutation，是用来
改状态的函数 从思想上来说的话，遵循一个函数式编程的思想 就是说我们 reducer 中做操作的时候，不应该去改之前的值，而是返回一个修改
后的全新的值
我们只有一个提交 aciton 的方式去告诉 reducer 执行

我们 vuex 中和 react 中都是提交 action 但是 行为是不同的



vuex  设计思想

 思考？ 一般我们用传参的方式 去接受新的数据 这个地方我们用 vuex  以一种可预测的方式发生变化 集中式管理组件的所有状态
  设计思想
  vuex 设计思想
  所有组件的状态和数据放到同一个内存空间去管理，我们称之为state states上面的数据可以方便的映射到我们的组件上
  来渲染组件 当组件的一些数据发生变化  可以dispatch一个action action可以进行一些异步操作 之后commit一个mutations 这里也可
  直接commit 一个mutations 他是唯一一个可以修改state的途径 其他任何方式去修改这个state都是非法的
  设计目的
  让state状态的修改可以预测 修改后呢  又可以反应到我们的组件上  实现了一个闭环
  平常
  修改组件的数据 数据的变化会直接映射到dom上  但vuex里我们是不能直接修改这个数据的 必须通过 dispatch--action
  commit->mutations来修改数据 确实会让我们的修改路径变长

 使用场景

    1.多个组件的状态数据共享 如果应用比较复杂，有些数据是共享的 这些组件如果是一些兄弟组件 或者 关联度很低的组件 这个时候我们共享数据就会比较困难 eventbus 都是很费劲的

    2.路由间的复杂数据传递 我们遇到一些路由跳转场景  到传递的参数很复杂的时候 用vuex会是一个很好的方案 简单的数据不需要vuex


其工作流程：

![redux flow](../static/img/reduxFlow.jpg)

- createStore 创建 store
- reducer 初始化 修改状态函数
- getState 获取最新值
- dispatch 提交更新
- subscribe 变革订阅
  以一个计数器例子分析：

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
store.subscribe(render); // State 发生变化，就自动执行这个监听函数, 进而重新渲染，如果没有这个组件不会更新
```

- 定义好 reducer 后， 通过 createStore 函数接收 reducer 创建好 store，一个应用只有 store;
- 然后用户通过 store.dispatch(action) 发出 action，**此时 reducer 会自动触发，并返回新的 state**;
- state 发生变化后，监听函数 store.subscribe(render) 会执行，上面传的是 render 函数，所以组件会重新渲染。

**Reducer 拆分**

如果项目比较复杂，必然会出现 reducer 函数过大的问题，这个时候需要进行拆分，可以根据业务模块分成对应的 reducer 文件，各自模块 initState 也可放在 reducer 里，这样 state 和 reducer 都分而治之了。

```js
// reducer.js
import { combineReducers } from 'redux';
import { user } from './redux/user.redux';
import { detail } from './redux/detail.redux';
export default combineReducers({ user, detail });

// index.js
import reducers from './reducer';
const store = createStore(reducers);
```

用 combineReducers 合并 reducer，再传给 createStore。

**redux-thunk 中间件**

reducer 计算 state 是同步，如何实现异步操作呢？这就需要用到 redux-thunk redux-logger 中间件，该中间件的功能是让 dispatch() 可以接受函数作为 action。
先执行中间件函数 然后再去执行我们的 reducer

```
// 异步的返回的是函数
export const asyncAdd = (dispatch, getState) => (dispatch) => {
  // 异步调用在这里
  setTimeout(() => {
    dispatch({ type: 'add' });
  }, 1000);
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

## react-redux

如果需要在 react 使用 redux，可以直接使用 react-redux 库（也是 redux 作者开发的），这样组件可以更方便拿到 state 和 发出 dispatch(action)，不用一层层传。也不用通过 store.subscribe 监听 render 函数去重新渲染，而是自动完成渲染。

redux 每次都重新调用 render 和 getState 太 low 了 使用 react 方式 和订阅问题

1. provider 为后代组件提供 store
2. connect 为组件提供数据和变更方法(每一次数据只要变更，自动的帮助我们组件刷新，把最新的值传给我们，用属性的方式传)

**1、UI 组件和容器组件**  
React-Redux 将所有组件分成两大类：UI 组件和容器组件。  
UI 组件特点：

- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用 this.state 这个变量）
- 所有数据都由参数（this.props）提供
- 不使用任何 Redux 的 API

容器组件特点（与 UI 组件相反）：

- 负责管理数据和业务逻辑，不负责 UI 的呈现（**这点要理解**）
- 带有内部状态
- 使用 Redux 的 API

总之，只要记住一句话就可以了：UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。  
React-Redux 规定，所有的 UI 组件都由用户提供，_容器组件则是由 React-Redux 自动生成_。也就是说，用户负责视觉层，状态管理则是全部交给它。

**2、connect()**

React-Redux 提供 connect 方法，用于从 UI 组件生成容器组件。connect 的意思，就是将这两种组件连起来。

```js
import { connect } from 'react-redux';

// TodoList 是 UI 组件，VisibleTodoList 是容器组件
const VisibleTodoList = connect(
  // 工作中一般的用的装饰器，@connect(mapStateToProps, mapDispatchToProps)
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
```

上面代码中，connect 方法接受两个参数：mapStateToProps 和 mapDispatchToProps。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将 state 映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 dispatch(action)。

```
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

**3、mapStateToProps 和 mapDispatchToProps**  
a、mapStateToProps  
是一个函数，一般返回一个对象。它的作用就是建立一个从（外部的）state 对象到（UI 组件的）props 对象的映射关系。比如 mapStateToProps 返回对象 obj，则 UI 组件的 props = { ...this.props, ...obj }。  
mapStateToProps 会订阅 Store，每当 state 更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。

b、mapDispatchToProps  
可以是一个函数，也可以是一个对象。用来建立 UI 组件的参数到 store.dispatch 方法的映射。

**4、Provider 组件**  
React-Redux 提供 Provider 组件，可以让容器组件拿到 state。

```js
let store = createStore(todoApp);
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

上面代码中，Provider 在根组件外面包了一层，这样一来，App 的所有子组件就默认都可以拿到 state 了。  
它的原理是 React 组件的 context 属性，store 放在了上下文对象 context 上面，子组件就可以从 context 拿到 store。

**5、计数器例子**  
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

// Reducer
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

// Connected Component
const App = connect(mapStateToProps, mapDispatchToProps)(Counter);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

## dva

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

# 实现 redux

```

/*
 * 中间件理解  dispatch经过 applyMiddleWare 之后 -> SuperDispatch (对dispatch执行若干次高阶函数)
 * SuperDispatch会把所有中间件执行完后 再执行正常的 dispatch
 *
 * 函数复合 比如我想让这个数组顺序执行  [fn1,fn2,fn3]  -> fn3(fn2(fn1()))
 * */

export function createStore(reducer, enhancer) {
  // 如果存在enhancer
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }

  let currentState = undefined;
  const currentListeners = []; // 回调函数数组

  function getState() {
    return currentState;
  }
  // 更新状态
  function dispatch(action) {
    // 修改
    currentState = reducer(currentState, action);
    // 变更通知
    currentListeners.forEach(v => v());
    return action;
  }
  function subscribe(cb) {
    currentListeners.push(cb);
  }

  // 初始化状态
  dispatch({ type: "@IMOOC/KKB-REDUX" });

  return {
    getState,
    dispatch,
    subscribe
  };
}

export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    // 完成之前createStore工作
    const store = createStore(...args);
    // 原先dispatch
    let dispatch = store.dispatch;
    // 传递给中间件函数的参数
    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };
    // 将来中间件函数签名如下： funtion ({}) {}
    //[fn1(dispatch),fn2(dispatch)] => fn(diaptch)
    const chain = middlewares.map(mw => mw(midApi));
    // 强化dispatch,让他可以按顺序执行中间件函数
    dispatch = compose(...chain)(store.dispatch);
    // 返回全新store，仅更新强化过的dispatch函数
    return {
      ...store,
      dispatch
    };
  };
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  // 聚合函数数组为一个函数 [fn1,fn2] => fn2(fn1())
  return funcs.reduce((left, right) => (...args) => right(left(...args)));
}

```

#  实现 react-redux

1. 实现高阶函数工厂 connect 可以根据传入状态映射规则函数  和派发映射规则函数映射需要的属性 可以处理变更检测
2. 实现一个 Provider 组件可以传递 store

```
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from './kkb-redux';
export const connect = (
  mapStateToProps = (state) => state,
  mapDispatchToProps = {}
) => (WrapComponent) => {
  return class ConnectComponent extends React.Component {
    static contextTypes = { store: PropTypes.object };
    constructor(props, context) {
      super(props, context);
      this.state = { props: {} };
    }
    componentDidMount() {
      const { store } = this.context;
      store.subscribe(() => this.update());
      this.update();
    }
    update() {
      const { store } = this.context;
      const stateProps = mapStateToProps(store.getState());
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

// 添加一个bindActionCreators能转换actionCreator为派发函数，redux.js
// function bindActionCreator(creator, dispatch) {
//   return (...args) => dispatch(creator(...args));
// }

export function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = bindActionCreator(creators[item], dispatch);
    return ret;
  }, {});
}

```