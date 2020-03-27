# DOM 本质

从 html 语言或者文件解析出来的一颗 dom 树

# DOM 节点操作

获取节点
setAttribute 修改的是节点 html 的属性 会改变 html 结构
property 可以获取 dom 元素修改对象属性，不会体现到 html 中 通过 js 的方式去操作这些属性 修改的是标签的属性
两者都有可能引起 dom 重新渲染

```
const pList = document.querySelector('p'); //集合
const p = pList[0];
p.style.width = '100px';
p.className = 'p1';

const pList = document.querySelector('p'); //集合
const p = pList[0];
p.style.width = '100px'; //设置宽度
p.className = 'p1'; // 添加类名
p.setAttribute('data-name', 'zl');
p.getAttribute('data-name');
p.setAttribute('style', 'font-size:30px');
p.getAttribute('style');
```

# DOM 结构操作

1. 新增插入节点

```
const div = document.getElementById('div1');
//添加新节点
const p1 = document.createElement('p');
p1.innerHTML = '我被添加了';
div.appendChild(p1); //添加新创建元素
// 移动已有节点
const p2 = document.getElementById('p2');
div.appendChild(p2);
```

2. 获取子元素列表，获取父元素

```
console.log(p2.parentNode); //获取父元素节点
const divChildrenNodes = div.childNodes; // 获取子元素节点 p
// node  nodeType nodeName 我们需要正常的一个节点 不需要text
const divChildrenP = Array.prototype.slice(divChildrenNodes).filter(child => {
  if (child.nodeType === 1) {
    return true;
  }
  return false;
});
```

3. 删除子节点

```
const div = document.getElementById('div1');
const child = div.childNodes;
div.removeChild(child[0]);
```

# DOM 性能

DOM 非常昂贵，避免频繁操作 dom 占用 cpu 更会 可能导致浏览器重绘重排
对 dom 查询做缓存
将频繁操作改为一次性操作(比如我们打个包一次性的扔进去)

```
// 不缓存dom查询结果
for (let i = 0; i < document.getElementsByTagName('p').length; i++) {
  //每次循环 都会计算length，频繁进行dom查询
}
// 缓存dom查询结果
const pList = document.getElementsByTagName('p');
const length = pList.length;
for (let i = 0; i < length; i++) {
  //缓存length，只进行一次查询
}

const listNode = document.getElementById('div');
// 创建一个文档片段
const frag = document.createDocumentFragment();
for (let i = 0; i < 10; i++) {
  const li = document.createElement('li');
  li.innerHTML = '我被插入了' + i;
  frag.appendChild(li);
}
// 都完成后再插入到 dom树中
listNode.appendChild(frag);
```
