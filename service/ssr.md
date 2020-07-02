# 理解 ssr

传统服务端渲染 SSR VS 单页面应用 SPA VS 服务端渲染 SSR

1. 传统 web 开发
   传统 web 开发，网页内容在服务端渲染完成，一次性传输到浏览器。
2. 单页应用 Single Page App
   单页应用优秀的用户体验，使其逐渐成为主流，页面内容由 JS 渲染出来，这种方式称为客户端渲染。

spa 缺点：

- seo
- 首屏内容到达时间

3. 服务端渲染 Server Side Render
   SSR 解决方案，后端渲染出完整的首屏的 dom 结构返回，前端拿到的内容包括首屏及完整 spa 结构，应
   用激活后依然按照 spa 方式运行，这种页面渲染方式被称为服务端渲染 (server side render)
