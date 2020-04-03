// 页面初次加载 获取 pathname
document.addEventListener('DOMContentLoaded', () => {
  console.log('load', location.pathname);
});

// 打开一个新路由
// 注意 用pushState
document.getElementById('btn1').addEventListener('click', function() {
  const state = { name: 'page1' };
  console.log('切换路由到', 'page1');
  history.pushState(state, '', 'page1'); //只要到了page1 这个state就会带过来
});

// 监听浏览器 前进 后退  我们只有监听到路由切换到什么地方 我们才能 在这个时机去触发相应界面的更新
window.onpopstate = event => {
  console.log('onpopstate', event.state, location.pathname);
};
