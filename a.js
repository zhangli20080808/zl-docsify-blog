vm._watchers = [];
const opts = vm.$options;
//初始化所有属性
if (opts.props) initProps(vm, opts.props);
// 初始化回调函数
if (opts.methods) initMethods(vm, opts.methods);
// 数据响应化
if (opts.data) {
  initData(vm);
} else {
  observe((vm._data = {}), true);
}
if (opts.computed) initComputed(vm, opts.computed);
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch);
}
