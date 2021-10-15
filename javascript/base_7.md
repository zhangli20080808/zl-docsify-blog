# XMLHttpRequest

```js
// 创建ajax引擎对象----所有操作都是由ajax引擎完成
const xhtHttp = new XMLHttpRequest();
// 为引擎对象绑定监听事件
xhtHttp.onreadystatechange = function() {
  //当状态变化时处理的事情
  if(xhtHttp.readyState === 4){
    if (xhtHttp.status === 200 ) {
      const data = xhtHttp.responseText;
      //输出
      console.log(JSON.parse(data), 22);
    }self{
      console.log('其他情况')
    }
  }
};
//3.绑定服务器地址
//第一个参数：请求方式GET/POST
//第二个参数：后台服务器地址
//第三个参数：是否是异步 true--异步   false--同步
xhtHttp.open('get', './test.json', false);
// 发送请求
const postDate = {name:'zl',age:'20'}
xhtHttp.send(JSON.stringify(postDate));

onreadystatechange ->0 未初始化 还没调用send方法  ->1 载入 已调用send方法，正在发送请求
->2 载入完成 send方法执行完成 已经接收到全部响应内容 ->3 交互 正在解析响应内容
```

# 状态码

静态服务实现 - https://github.com/zhangli20080808/static-server-zl

0. 1xx 服务器收到请求
1. 2xx 请求成功
2. 3xx 需求重定向，浏览器直接跳转 服务端告诉你你来这不行，你需要去别的地方 比如我们百度的搜索引擎

- 301(永远重定向 配合 location，浏览器自动处理 浏览器会记住，我下次访问的时候直接取访问新的网址，比如域名到期了，或者我想换域名了，老的域名就能返回一个 301 的状态，location 一个新的域名，让浏览器记住了这件事情，不会再去访问老的域名了)
- 302(临时重定向 配合 location,服务端返回 location 302，浏览器自动处理 比如 下次访问还是会去访问老的地址 短网址意思也差不多)
- 304(资源未改变，刚才的资源请求过了，我们再发一个请求，服务端有可能返回给你一个 304，没有过期，你可以接着使用缓存，资源在本地还有效)

```js
// 如果当前是手机端 就跳转到 百度
// 如果是pc端 我就挑转 腾讯
let http = require('http');
http
  .createServer((req, res) => {
    let agent = req.headers['user-agent'];
    res.statusCode = 302;
    if (agent.includes('iPhone')) {
      res.setHeader('Location', 'http://www.baidu.com');
    } else {
      res.setHeader('Location', 'http://www.qq.com');
    }
    res.end(); // 重定向的原理
  })
  .listen(8000);
```

3. 4xx 客户端错误 403 没权限 404

```js
499对应的是 “client has closed connection”，客户端请求等待链接已经关闭，这很有可能是因为服务器端处理的时间过长，客户端等得“不耐烦”了。还有一种原因是两次提交post过快就会出现499。
解决方法：

前端将timeout最大等待时间设置大一些
nginx上配置proxy_ignore_client_abort on;
```

4. 5xx 服务端报错 504 网关超时(比如能访问到第一台服务器，但在连接其他服务器的时候，超时了)

# Restful api

- 传统的 Api 设计，把每个 url 当一个功能
- Restful Api 设计，把每个 url 当成一个资源（标识 id）

如何设计成一个资源呢？

1. 尽量不用 url 参数
   传统？/api/getList?pageIndex=2
   restful Api /api/getList/2

# 跨域 同源策略 跨域解决方案

- ajax get post 区别
- get 主要用于查询 post 主要用于提交数据
- get 参数拼接在 url 上 post 放在请求体内(数据体积大)
- 安全性： post 易于防止 csrf

ajax 请求时 浏览器要求当前网页和 server 必须同源(安全)
同源 协议 端口 域名 三者必须一致
加载图片 css js 可无视同源策略
img 可用于统计打点 可使用第三方统计服务
script 可以实现 jsonp

所有的跨域 都必须经过 server 的允许和配合
为经 server 端允许就实现跨域，就说明浏览器有漏洞

1. script 可以越过跨域限制
2. 服务器可以任意动态拼接数据返回
   所以，script 就可以获得跨域的数据，只要服务端愿意返回

跨域解决方案 1. jsonp 2.cors

```js
// 页面事先声明好了 callBack 函数abc 再次加载到 js 返回值的时候 会自动调用 callBack abc 得到数据
function(data){
  // 这个使我们跨域得到的数据
  console.log(data);
}
<script src='https://www.baidu.com/getData.js?username=xxx& callback=abc'></script>
// 后台会返回一个abc包裹一段方法
//将返回 abc({x:100,y:200})   //所谓的jsonp，就是一句函数调用，数据都被包裹传递到参数中了，千万别穿个马甲就不认识了
```

3. cors 服务器设置 http header

cors - 跨域资款共享,允许浏览器向跨域服务器发出 XMLHttpRequest 请求，从而克服跨域问题，它需要浏览器和服务器的同时支持

```js
浏览器端会自动向请求头添加origin字段，表明当前请求来源
服务器端需要设置响应头的Access-Control-Allow-Methods，Access-Control-Allow-Headers，Access-Control-Allow-Origin等字段，指定允许的方法，头部，源等信息

请求分为简单请求和非简单请求，非简单请求会先进行一次OPTION方法进行预检，看是否允许当前跨域请求。

// 第二个参数填写允许跨域的名称
response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8001');
response.setHeader('Access-Co ntrol-Allow-Headers', 'X-Request-With');
response.setHeader(
  'Access-Control-Allow-Methods',
  'PUT,GET,POST,DELETE,OPTIONS'
);
// 接受跨域的cookies
response.setHeader('Access-Control-Allow-Credentials', 'true');

```

# JSONP 安全性问题

1. CSRF 攻击
   前端构造一个恶意页面，请求 JSONP 接口，收集服务端的敏感信息。如果 JSONP 接口还涉及一些敏感操作或信息（比如登录、删除等操作），那就更不安全了。
   解决方法：验证 JSONP 的调用来源（Referer），服务端判断 Referer 是否是白名单，或者部署随机 Token 来防御。
2. XSS 漏洞
   不严谨的 content-type 导致的 XSS 漏洞，想象一下 JSONP 就是你请求 http://youdomain.com?callback=douniwan, 然后返回 douniwan({ data })，那假如请求 http://youdomain.com?callback=<script>alert(1)</script> 不就返回 <script>alert(1)</script>({ data })了吗，如果没有严格定义好 Content-Type（ Content-Type: application/json ），再加上没有过滤 callback 参数，直接当 html 解析了，就是一个赤裸裸的 XSS 了。
   解决方法：严格定义 Content-Type: application/json，然后严格过滤 callback 后的参数并且限制长度（进行字符转义，例如<换成&lt，>换成&gt）等，这样返回的脚本内容会变成文本格式，脚本将不会执行。

# 简单请求

- 请求方法是以下三种方法之一：HEAD、GET、POST

- HTTP 的请求头信息不超出以下几种字段：
  Accept
  Accept-Language
  Content-Language
  Last-Event-ID
  Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain

- 后端的响应头信息：
  Access-Control-Allow-Origin：该字段是必须的。它的值要么是请求时 Origin 字段的值，要么是一个\*，表示接受任意域名的请求。
  Access-Control-Allow-Credentials：该字段可选。它的值是一个布尔值，表示是否允许发送 Cookie。
  Access-Control-Expose-Headers：该字段可选。CORS 请求时，XMLHttpRequest 对象的 getResponseHeader()方法只能拿到 6 个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在 Access-Control-Expose-Headers 里面指定。

# 非简单请求

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 PUT 或 DELETE，或者 Content-Type 字段的类型是 application/json。非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求（preflight）。

1.  Access-Control-Request-Method：该字段是必须的，用来列出浏览器的 CORS 请求会用到哪些 HTTP 方法，上例是 PUT
2.  Access-Control-Request-Headers：该字段是一个逗号分隔的字符串，指定浏览器 CORS 请求会额外发送的头信息字段，上例是 X-Custom-Header。
3.  如果浏览器否定了"预检"请求，会返回一个正常的 HTTP 回应，但是没有任何 CORS 相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被 XMLHttpRequest 对象的 onerror 回调函数捕获。

# JSONP 和 CORS 的对比

1.  JSONP 只支持 GET 请求，CORS 支持所有类型的 HTTP 请求
2.  JSONP 的优势在于支持老式浏览器，以及可以向不支持 CORS 的网站请求数据

# 存储

## cookie

浏览器和服务端用来通信，借用来做本地存储，缺点-最大存储 4kb，localStorage 最大 5m，针对域名来说
localStorage,sessionStorage,session,cookie,indexDB,cacheApi

1. cookie 不支持跨域 合理使用 cookie 否则会导致流量浪费 domain p
2. localStorage / sessionStorage 不会发送给服务器
3. IndexDB 浏览器中的非关系型数据库
   [http://www.ruanyifeng.com/blog/2018/07/indexeddb.html](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)
4. cacheApi 离线缓存
