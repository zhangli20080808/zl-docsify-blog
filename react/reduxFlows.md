# 从redux到react-redux再到dva

## redux
redux 设计思想很简单，就两句  
  - Web 应用是一个状态机，视图与状态是一一对应的。
  - 所有的状态，保存在一个对象里面。  

其工作流程：

![redux flow](../static/img/reduxFlow.jpg)

以一个计数器例子分析：
```js
import { createStore } from 'redux';

class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>增加</button>
      </div>
    )
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

const render = () => ReactDOM.render(
  <Counter
    value={store.getState().count}
    onIncreaseClick={() => store.dispatch(increaseAction)}
  />,
  document.getElementById('root')
)
render()
store.subscribe(render); // State 发生变化，就自动执行这个监听函数, 进而重新渲染，如果没有这个组件不会更新
```
  - 定义好 reducer 后， 通过 createStore 函数接收 reducer 创建好 store，一个应用只有 store;
  - 然后用户通过 store.dispatch(action) 发出 action，**此时 reducer 会自动触发，并返回新的 state**;
  - state 发生变化后，监听函数 store.subscribe(render) 会执行，上面传的是 render 函数，所以组件会重新渲染。  

完整代码看[这里](https://github.com/lvbowen/simplest-redux-example/blob/master/redux.js)  

**Reducer拆分**

如果项目比较复杂，必然会出现 reducer 函数过大的问题，这个时候需要进行拆分，可以根据业务模块分成对应的 reducer 文件，各自模块 initState 也可放在 reducer 里，这样 state 和 reducer 都分而治之了。  
```js
// reducer.js
import { combineReducers } from 'redux'
import { user } from './redux/user.redux'
import { detail } from './redux/detail.redux'
export default combineReducers({user, detail})

// index.js
import reducers from './reducer'
const store = createStore(reducers)
```
用 combineReducers 合并 reducer，再传给 createStore。

**redux-thunk 中间件**

reducer 计算 state 是同步，如何实现异步操作呢？这就需要用到 redux-thunk 中间件，该中间件的功能是让 dispatch() 可以接受函数作为 action。
```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

// Note: this API requires redux@>=3.1.0
const store = createStore(
  reducer,
  applyMiddleware(thunk)  // applyMiddleware 注册中间件
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
上面代码中，fetchPosts是一个Action Creator（动作生成器），返回一个函数。这个函数执行后，先发出一个Action（requestPosts(postTitle)），然后进行异步操作。拿到结果后，先将结果转成 JSON 格式，然后再发出一个 Action（ receivePosts(postTitle, json)）。  
总结异步操作：先使用 redux-thunk 中间件改造 store.dispatch，然后写出一个含异步操作的 Action Creator。

## react-redux
如果需要在 react 使用 redux，可以直接使用 react-redux 库（也是 redux 作者开发的），这样组件可以更方便拿到 state 和 发出 dispatch(action)，不用一层层传。也不用通过 store.subscribe 监听 render 函数去重新渲染，而是自动完成渲染。

**1、UI 组件和容器组件**  
React-Redux 将所有组件分成两大类：UI 组件和容器组件。  
UI 组件特点：
  - 只负责 UI 的呈现，不带有任何业务逻辑
  - 没有状态（即不使用this.state这个变量）
  - 所有数据都由参数（this.props）提供
  - 不使用任何 Redux 的 API  

容器组件特点（与 UI 组件相反）：
  - 负责管理数据和业务逻辑，不负责 UI 的呈现（**这点要理解**）
  - 带有内部状态
  - 使用 Redux 的 API

总之，只要记住一句话就可以了：UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。  
React-Redux 规定，所有的 UI 组件都由用户提供，_容器组件则是由 React-Redux 自动生成_。也就是说，用户负责视觉层，状态管理则是全部交给它。  

**2、connect()**  
React-Redux 提供connect方法，用于从 UI 组件生成容器组件。connect的意思，就是将这两种组件连起来。  
```js
import { connect } from 'react-redux'

// TodoList 是 UI 组件，VisibleTodoList 是容器组件
const VisibleTodoList = connect(   // 工作中一般的用的装饰器，@connect(mapStateToProps, mapDispatchToProps)
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```
上面代码中，connect 方法接受两个参数：mapStateToProps 和 mapDispatchToProps。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将 state 映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 dispatch(action)。  

**3、mapStateToProps 和 mapDispatchToProps**  
a、mapStateToProps  
是一个函数，一般返回一个对象。它的作用就是建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系。比如 mapStateToProps 返回对象 obj，则 UI 组件的 props = { ...this.props, ...obj }。  
mapStateToProps会订阅 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。  

b、mapDispatchToProps  
可以是一个函数，也可以是一个对象。用来建立 UI 组件的参数到store.dispatch方法的映射。

**4、Provider 组件**  
React-Redux 提供Provider组件，可以让容器组件拿到state。  
```js
let store = createStore(todoApp);
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```
上面代码中，Provider在根组件外面包了一层，这样一来，App的所有子组件就默认都可以拿到state了。  
它的原理是React组件的context属性，store放在了上下文对象context上面，子组件就可以从context拿到store。

**5、计数器例子**  
将前面 redux 里的例子用 react-redux 改造如下：
```js
class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>增加</button>
      </div>
    )
  }
}

// Reducer
function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'increase':
      const newState = Object.assign({}, state, { count: state.count + 1 });
      return newState;
    default:
      return state
  }
}

// Store
const store = createStore(counter)

// Action
const increaseAction = { type: 'increase' }

// Map Redux state to component props
function mapStateToProps(state) {
  return {
    value: state.count
  }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction)
  }
}

// Connected Component
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```
完整代码看[这里](https://github.com/lvbowen/simplest-redux-example/blob/master/react-redux.js)

## dva
[dva](https://dvajs.com/guide/) 首先是一个基于 redux 和 [redux-saga](https://redux-saga-in-chinese.js.org/) 的数据流方案，如果使用 dva 框架开发，可以更方便的使用 redux 功能，提高开发效率，推荐使用哦。  

修改 state 的逻辑都会放在 models 下 (定义model)：
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
    add(state, action) {   // action 对应的是 { type: 'add' } 对象
      return {
        ...state,
        count: state.count + 1,
      }
    },
  },
  // 订阅
  subscriptions: {
    set({ history }) {
      // 监听 history 变化
      return history.listen((res) => {
        console.log(res);
        if (window._dgt) {
          window._dgt.push(["track_SPA_view"]);
        }
      });
    }
  }
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
    console.log(this.props.count);  // { count: 0 }, 返回的就是对应 model 文件里的 state 对象。
    this.props.dispath({
      type: 'count/addAfter1Second',
      payload: {
        id: 123,
      }
    })
  }
  render() {}
}
```

##### dva数据流向
通过 dispatch 发起一个 action，如果是同步行为会直接通过 Reducers 改变 State ，如果是异步行为（副作用）会先触发 Effects 然后流向 Reducers 最终改变 State，所以在 dva 中，数据流向非常清晰简明。  

![dva](../static/img/dva.png)

## 扩展阅读
  - [Redux 中文文档](https://www.redux.org.cn/)
  - [Redux](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
  - [React-Redux](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)

