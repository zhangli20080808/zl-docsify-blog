# XMLHttpRequest

```
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

1. 2xx 请求成功
2. 3xx 需求重定向，浏览器直接跳转 301(永远重定向 配合location，浏览器自动处理 浏览器会记住，我下次访问的时候直接取访问新的网址，比如域名到期了，或者我想换域名了，老的域名就能返回一个301的状态，location一个新的域名，让浏览器记住了这件事情，不会再去访问老的域名了) 302(临时重定向 配合location，浏览器自动处理 比如 下次访问还是会去访问老的地址 ) 304(资源未改变，刚才的资源请求过了，服务端有可能返回给你一个304，没有过期，你可以接着使用缓存，资源在本地还有效) // 服务端告诉你你来这不行，你需要去别的地方  比如我们百度的搜索引擎
3. 4xx 客户端错误 403 没权限 404
4. 5xx 服务端报错  504网关超时(比如能访问到第一台服务器，但在连接其他服务器的时候，超时了)
6. 1xx 服务器收到请求

# Restful api
传统的Api设计，把每个url当一个功能
Restful Api设计，把每个url当成一个资源（标识 id）

如何设计成一个资源呢？
1. 尽量不用url参数
 传统？/api/getList?pageIndex=2
 restful Api  /api/getList/2  

# 跨域 同源策略 跨域解决方案

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

```
页面事先声明好了 callBack 函数abc 再次加载到 js 返回值的时候 会自动调用 callBack abc 得到数据
window.abc = function(data){
  // 这个使我们跨域得到的数据
  console.log(data);
}
<script src='https://www.baidu.com/getData.js?username=xxx& callback=abc'></script>
// 后台会返回一个abc包裹一段方法
//将返回 abc({x:100,y:200})
```

3. cors 服务器设置 http header

```
// 第二个参数填写允许跨域的名称
response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8001');
response.setHeader('Access-Control-Allow-Headers', 'X-Request-With');
response.setHeader(
  'Access-Control-Allow-Methods',
  'PUT,GET,POST,DELETE,OPTIONS'
);
// 接受跨域的cookies
response.setHeader('Access-Control-Allow-Credentials', 'true');

```
