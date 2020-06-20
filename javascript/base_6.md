# 识别浏览器类型

1. navigator
2. screen
3. history
4. location

# 分析拆解 url 各个部分

# 事件冒泡

事件冒泡流程
内层元素的点击事件 依次向外冒泡 在外层都能接收到这个事件
基于事件 dom 树形结构，事件会顺着触发元素向上冒泡，应用场景：代理

# 事件绑定

通用事件监听函数的编写

```
function bindEvent (elem, type, selector, fn) {
  if (fn == null) {
    fn = selector
    selector = null
  }
  elem.addEventListener(type, event => {
    const target = event.target
    if (selector) {
      // 代理绑定  matches 判断一个dom元素是不是符合我们的css选择器
      if (target.matches(selector)) {
        fn.call(target, event)
      }
    } else {
      // 普通绑定
      fn.call(target, event)
    }
  })
}
const btn1 = document.getElementById('btn1');
bindEvent('btn1', 'click',function(){
  e.target // 获取出发元素
  e.preventDefault();
  alert(target.innerHTML)
});
```

# 事件代理

无限下拉的图片列表，如何监听每个图片的点击
子元素很多，无法一个个去做点击事件，代理给他的某个父元素，然后获取触发的元素做一些判断
减少浏览器内存  
事件代理 通过 event.target 获取出发元素，用 matches 判断元素是否是触发元素

```
const div1 = document.getElementById('div1');
bindEvent(div1,'click','a', function() {
  e.preventDefault();
   alert(target.innerHTML)
});

```
