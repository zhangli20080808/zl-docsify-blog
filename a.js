// 标准中间件写法
function logger(store) {
  return function (next) {
    return function (action) {
      console.log('prev', store.getState());
      next(action);
      console.log('next', store.getState());
    };
  };
}

function middleware(logger) {
  return function (createStore) { 
    return function (reducer) {
      let store = createStore(reducer);
      let oldDispatch = store.dispatch;
      store.dispatch = logger(store)(oldDispatch);
    };
  };
}
