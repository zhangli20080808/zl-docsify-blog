Vue.component('router-link', {
  props: {
    to: String,
  },
  // 这个地方不能用 template 这种方式运行时打包的方式 根本没有编译器 只能写render
  render(h) {
    // h(tag,data,children)
    return h(
      'a',
      {
        attrs: {
          href: '#' + this.to,
        },
        class: 'router-link',
      },
      [this.$slots.default]
    );
  },
});
