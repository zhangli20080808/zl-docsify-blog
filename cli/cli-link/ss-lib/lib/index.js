module.exports = {
  sum(a, b, c) {
    return a + b + c;
  },
  init({ option, param }) {
    console.log('执行init流程', option, param);
  },
};
