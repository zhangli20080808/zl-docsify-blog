# 后端返回的 excel 文件流如何下载
工作中我们时常会遇到导出 excel 的功能，后端返回有两种情况，一是返回文件的链接地址（cdn 或者自己服务器地址），直接 location.href = excelUrl 就可以下载到本地；二是返回二进制流文件，这种前端该如何下载呢，这就是本文要讲的内容。对服务端而言，第二种方法要比第一种好，因为不用生成文件占用资源而且工作量也更小。

## 下载二进制流文件
假设导出接口是 /api/exportExcel?id=123

### 方法一
通过 location.href = 接口地址，可以获取到文件并下载到本地。
```js
location.href = '/api/exportExcel?id=123';
```
缺点：只能是 get 请求。

### 方法二
通过 [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象处理，英文全称是 Binary Large Object，翻译成汉语是二进制大型对象，用于存储二进制数据。  
代码如下
```js
request('/api/exportExcel', {
  method: 'GET',
  params: {
    id: '123',
  },
  responseType: 'blob',
}).then((res) => {
  const blob = new Blob([res], { type: res.type });
  const elink = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  elink.href = href;
  elink.download = '文件名.xlsx'; // 下载后文件名
  elink.style.display = 'none';
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
  window.URL.revokeObjectURL(href); // 释放blob对象
})
```
- 首先，将字符串生成一个 Blob 对象
- 然后通过 URL.createObjectURL 方法生成一个对应 Blob 对象的 URL
- URL 以 blob: 开头，其后是一串标识符，唯一标识内存中的指定 Blob 对象
- 点击动态生成的链接，即可实现下载功能，用到了 HTML5 新增的 download 属性

同样的道理，也可以将图片转换为 Blob 对象，然后再使用 URL.createObjectURL 方法生成一个地址。
