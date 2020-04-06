# 识别浏览器类型

1. navigator
2. screen
3. history
4. location

# 分析拆解 url 各个部分

# 事件冒泡

事件冒泡流程
内层元素的点击事件 依次向外冒泡 在外层都能接收到这个事件

# 事件绑定

通用事件监听函数的编写

```
function bindEvent(elem, type, fn) {
  elem.addEventListener(type, fn);
}
const btn1 = document.getElementById('btn1');
bindEvent('btn1', 'click', function(){
  e.target // 获取出发元素
  e.preventDefault();
  alert(target.innerHTML)
});
```

# 事件代理

无限下拉的图片列表，如何监听每个图片的点击
子元素很多，无法一个个去做点击事件，代理给他的某个父元素，然后获取触发的元素做一些判断
减少浏览器内存  

```
const div1 = document.getElementById('div1');
bindEvent(div1,'click','a', function() {
  e.preventDefault();
   alert(target.innerHTML)
});

```
