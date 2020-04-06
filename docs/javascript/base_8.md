# 上线之后在哪里运行

浏览器(本身也是 app，以浏览器功能为主 webView) server 端有 nodejs
下载网页代码，渲染出页面，期间会执行若干 js
针对这些过程做一些优化 下载速度 渲染速度 js 加载执行速度
保证代码在浏览器中 稳定高效

# 网页渲染过程

1. 从输入 url 到渲染出页面的整个过程

- 加载资源的形式
  html 代码 媒体文件 图片视频 javascript css
- 加载资源的过程
  DNS 解析 把域名解析成 ip 的过程 域名 -> ip
  浏览器根据 ip 地址向服务器发起 http 请求
  服务器处理 http 请求，并返回给浏览器
- 渲染页面的过程
  根据 html 代码生成 dom tree
  根据 css 代码生成 CSSOM 对象模型
  将 dom 树和 CSSOM 整合行程 -> render tree(框架和样式合并出来的一个结构)
  根据 render tree 渲染页面
  如果 遇到 script 则暂停渲染，优先加载并执行 js 代码，完成在继续 (因为 js 的进程和渲染进程是共用一个进程)

  因为我们的 js 中有可能会改变 dom 结构 改变我们当前渲染的结果 你再渲染的话就没用了
  只至把 render tree 渲染完

2. window.onLoad 和 DOMContentLoad 的区别

```
  window.addEventListener('load', function() {
  //页面的全部资源全部加载完才会执行，包括图片 视频
  });

  window.addEventListener('DOMContentLoaded', function() {
  // DOM 渲染完即可执行 此时图片 视频 可能还没加载完
  // 比如 jquery 一般都会监听这个事件 如果监听到 我们就默认网页加载结束了
  });
```

# 前端性能优化

1. 性能优化原则

- 多使用内存 缓存或其他方法
  静态文件资源加 hash 后缀，根据文件内容计算 hash 文件内容不变，则 hash 不变
  url 和文件不变，则会自动触发 http 缓存机制，返回 304
- 减少 cpu 计算量 减少网络耗时

1. 让加载更快 减少资源体积：压缩代码 服务器 gzip 压缩
2. 减少访问次数：合并代码(打包后的一个 js(webpack output->fileName :'bundle.[contenthash].js')) ssr 服务端渲染 缓存(命中) 比如雪碧图 很多图合称为一个 css 定位展示
3. 使用更快的网络：cdn (是根据区域来做一个服务器的处理) 用户与内容之间的物理距离缩短，用户的等待时间也得以缩短

```
Content Delivery Network，内容分发网络
CDN就是采用更多的缓存服务器（CDN边缘节点），布放在用户访问相对集中的地区或网络中。当用户访问网站时，利用全局负载技术，将用户的访问指向距离最近的缓存服务器上，由缓存服务器响应用户请求
有点像电商的本地仓

CDN并不是只能缓存视频内容，它还可以对网站的静态资源（例如各类型图片、html、css、js等）进行分发，对移动应用APP的静态内容（例如安装包apk文件、APP内的图片视频等）进行分发

CDN=更智能的镜像+缓存+流量导流

```

- [cdn 详解](https://blog.csdn.net/CSDN_bang/article/details/85110274)

让渲染更快

- css 放在 head js 放在 body 最下面
- 尽早开始执行 js，用 DOMContentLoaded 触发
- 懒加载(图片懒加载，上滑加载更多)

```
当浏览器判断到用户往上滑 图片露出屏幕的时候 我们把设置的真实 img-url 赋值给 img src
<img src="preview.png" data-trueUrl="a.png" alt="" id="img1" />;
const img = document.getElementById('img1');
img.src = img.getAttribute('data-trueUrl');

```

- 对 dom 查询做缓存
- 频繁操作 dom，合并到一起插入 dom 结构
- 节流 throttle debounce

4. 节流防抖

1. 防抖

```
防抖 用户在输入结束 或 暂停的时候我们开始请求 频繁操作，频繁输入最后触发
const input1 = document.getElementById('input1');
function debounce(fn, delay = 500) {
  let timer = null; // 此时timer是在闭包中的
  // 返回函数
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // fn() 这个函数可能会接受一些参数
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
input1.addEventListener(
  'keyup',
  debounce(function() {
    // 这里 注意this指向
    console.log(this); // <input type="text" id="input1">
    console.log(input1.value);
  }, 600)
);
```

2. 节流 保持一个频率连续触发

```
节流场景
1. 拖拽一个元素时，要随时拿到该元素被拖拽的位置
2. 直接用drag事件，则会频繁触发，很容易导致卡顿
3. 节流：无论拖拽速度多快，都会每隔100ms触发一次

const div1 = document.getElementById('div1');
div1.addEventListener(
  'drag',
  throttle(function(e) {
    console.log(e.offsetX, e.offsetY);
  }, 100)
);

function throttle(fn, delay = 100) {
  let timer; // 被拖拽的时候 timer 就有值了
  return function(...args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {ƒ
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
```

# 前端安全
