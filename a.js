let reducers = {
  user,
  count: counterReducer,
};
function combineReducers(reducers) {
  return function combination(state, action) {
    let nextState = {};
    for (let key in reducers) {
      nextState[key] = reducers[key](state[key], action);
    }
    return nextState;
  };
}
