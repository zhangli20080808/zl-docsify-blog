# DOM 本质

从 html 语言或者文件解析出来的一颗 dom 树

# DOM 节点操作

1. 获取节点
* document.getElementById
* context.getElementsByTagName(TAGNAME) ->把指定容器中子子孙孙辈分的所有标签名为TAGNAME的都获取到了
* context.getElementsByClassName(CLASSNAME) ->在IE6~8下不兼容 也是子孙
* document.getElementsByName() ->在IE浏览器中只对表单元素的name起作用
* document.body || document.documentElement
* context.querySelector/context.querySelectorAll ->在IE6~8下不兼容 通过这个获取的节点集合不存在DOM映射

2. 描述节点和节点之间关系的属性 (在标准浏览器中会把空格和换行当做文本节点处理)
* childNodes 
* children ->在IE6~8下获取的结果和标准浏览器获取的结果不一致
* parentNode  |   previousSibling(上一个哥哥节点) | previousElementSibling(兼容:上一个哥哥元素节点) | nextSibling(下一个弟弟节点) | nextElementSibling(兼容) | lastChild | firstChild

注意:  最常用四种节点 元素(nodeType:1) 文本(nodeType:3) 注释(nodeType:8) document(nodeType:9)对应有nodeName nodeValue

setAttribute 修改的是节点 html 的属性 会改变 html 结构
property 可以获取 dom 元素修改对象属性，不会体现到 html 中 通过 js 的方式去操作这些属性 修改的是标签的属性
两者都有可能引起 dom 重新渲染

```js
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

createElement/createDocumentFragment/appendChild/insertBefore/cloneNode(true/false)/replaceChild/removeChild/get/set/removeAttribute

1. 新增插入节点  

```js
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

```js
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

```js
const div = document.getElementById('div1');
const child = div.childNodes;
div.removeChild(child[0]);
```

# DOM 性能

DOM 非常昂贵，避免频繁操作 dom 占用 cpu 更会 可能导致浏览器重绘重排
对 dom 查询做缓存
将频繁操作改为一次性操作(比如我们打个包一次性的扔进去)

```js
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

```js
//->接下来写的所有的方法在jQuery中的作用和方法名一模一样
//->function chlidren ->获取某一个容器中所有的元素子节点(还可以筛选出指定标签名的)
//->getElementsByClass ->通过元素的样式类名获取一组元素(兼容所有的浏览器) (jQuery中没有这个方法名,但是jQuery的一部分选择器也是基于这个方法的原理来实现的)
//->获取上一个哥哥元素节点(prev)、获取下一个弟弟元素节点(next)、获取所有的哥哥元素节点(prevAll)、获取所有的弟弟元素节点(nextAll)、获取相邻的两个元素节点(sibling)、获取所有的兄弟元素节点(siblings)
//->获取第一个元素子节点(firstChild)、获取最后一个元素子节点(lastChild) 这两个方法jQuery中也没有
//->index获取当前元素的索引

//append
//prepend ->和appendChild对应 增加到某一个容器的开头
//insertBefore
//insertAfter ->和insertBefore对应 增加到容器中某一个元素后面

//addClass 增加样式类名
//removeClass 删除样式类名
//hasClass 判断是否存在某一个样式类名

//->jQuery:css
//getCss
//setCss
//setGroupCss

//->基于内置类的原型扩展一些我们常用的方法
```
## 新建、插入、移动
```js
const div1 = document.getElementById('div1');
const div2 = document.getElementById('div2');
// 新建节点
const newP = document.createElement('p');
newP.innerHTML = 'this is newP';
// 插入节点
div1.appendChild(newP);
// 移动节点
const p1 = document.getElementById('p1');
div2.appendChild(p1);

// 获取父元素
console.log(p1.parentNode);
// 获取子元素列表
const div1ChildNodes = div1.childNodes;
console.log(div1.childNodes);
const div1ChildNodesP = Array.prototype.slice
  .call(div1.childNodes)
  .filter((child) => {
    if (child.nodeType === 1) {
      return true;
    }
    return false;
  });
console.log('div1ChildNodesP', div1ChildNodesP);
div1.removeChild(div1ChildNodesP[0]);
```

# 单利模式工具类总结

```js
var utils = (function () {
    var flag = "getComputedStyle" in window;

    //->listToArray:把类数组集合转换为数组
    function listToArray(likeAry) {
        if (flag) {
            return Array.prototype.slice.call(likeAry, 0);
        }
        var ary = [];
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
        return ary;
    }

    //->formatJSON:把JSON格式字符串转换为JSON格式对象
    function formatJSON(jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }

    //->offset:获取页面中任意元素距离BODY的偏移
    function offset(curEle) {
        var disLeft = curEle.offsetLeft, disTop = curEle.offsetTop, par = curEle.offsetParent;
        while (par) {
            if (navigator.userAgent.indexOf("MSIE 8") === -1) {
                disLeft += par.clientLeft;
                disTop += par.clientTop;
            }
            disLeft += par.offsetLeft;
            disTop += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: disLeft, top: disTop};
    }

    //->win:操作浏览器的盒子模型信息
    function win(attr, value) {
        if (typeof value === "undefined") {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }

    //->getCss:获取元素的样式值
    function getCss(curEle, attr) {
        var val = null, reg = null;
        if (flag) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {
            if (attr === "opacity") {
                val = curEle.currentStyle["filter"];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        reg = /^(-?\d+(\.\d+)?)(px|pt|em|rem)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }

    //->children:获取所有的元素子节点
    function children(curEle, tagName) {
        var ary = [];
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
            }
            nodeList = null;
        } else {
            ary = this.listToArray(curEle.children);
        }
        if (typeof tagName === "string") {
            for (var k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(k, 1);
                    k--;
                }
            }
        }
        return ary;
    }


    //->prev:获取上一个哥哥元素节点
    //->首先获取当前元素的上一个哥哥节点,判断是否为元素节点,不是的话基于当前的继续找上面的哥哥节点...一直到找到哥哥元素节点为止,如果没有哥哥元素节点,返回null即可
    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    //->next:获取下一个弟弟元素节点
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    //->prevAll:获取所有的哥哥元素节点
    function prevAll(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    //->nextAll:获取所有的弟弟元素节点
    function nextAll(curEle) {
        var ary = [];
        var nex = this.next(curEle);
        while (nex) {
            ary.push(nex);
            nex = this.next(nex);
        }
        return ary;
    }
    
    //->sibling:获取相邻的两个元素节点
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var ary = [];
        pre ? ary.push(pre) : null;
        nex ? ary.push(nex) : null;
        return ary;
    }

    //->siblings:获取所有的兄弟元素节点
    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }

    //->index:获取当前元素的索引
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    //->firstChild:获取第一个元素子节点
    function firstChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[0] : null;
    }

    //->lastChild:获取最后一个元素子节点
    function lastChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    }

    //->append:向指定容器的末尾追加元素
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    //->prepend:向指定容器的开头追加元素
    //->把新的元素添加到容器中第一个子元素节点的前面,如果一个元素子节点都没有,就放在末尾即可
    function prepend(newEle, container) {
        var fir = this.firstChild(container);
        if (fir) {
            container.insertBefore(newEle, fir);
            return;
        }
        container.appendChild(newEle);
    }

    //->insertBefore:把新元素(newEle)追加到指定元素(oldEle)的前面
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    //->insertAfter:把新元素(newEle)追加到指定元素(oldEle)的后面
    //->相当于追加到oldEle弟弟元素的前面,如果弟弟不存在,也就是当前元素已经是最后一个了,我们把新的元素放在最末尾即可
    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }


    //->hasClass:验证当前元素中是否包含className这个样式类名
    function hasClass(curEle, className) {
        // -> 'bg'  / +bg +/
        // -> 'box'  /^box +/
        // -> 'border'  / +bg$/
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(curEle.className);
    }

    //->addClass:给元素增加样式类名
    function addClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (!this.hasClass(curEle, curName)) {
                // 原理
                curEle.className += " " + curName;
            }
        }
    }

    //->removeClass:给元素移除样式类名    "box bg border".replace(/(^| +)bg( +|$)/g, " ")
    function removeClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0, len = ary.length; i < len; i++) {
            var curName = ary[i];
            if (this.hasClass(curEle, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
                curEle.className = curEle.className.replace(reg, " ");
            }
        }
    }

    //->getElementsByClass:通过元素的样式类名获取一组元素集合 只要包含
    function getElementsByClass(strClass, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        //->IE6~8
        var ary = [], strClassAry = strClass.replace(/(^ +| +$)/g, "").split(/ +/g);
        var nodeList = context.getElementsByTagName("*");
        for (var i = 0, len = nodeList.length; i < len; i++) {
            var curNode = nodeList[i];
            var isOk = true;
            for (var k = 0; k < strClassAry.length; k++) {
                var reg = new RegExp("(^| +)" + strClassAry[k] + "( +|$)");
                if (!reg.test(curNode.className)) {
                    isOk = false;
                    break;
                }
            }
            if (isOk) {
                ary[ary.length] = curNode;
            }
        }
        return ary;
    }


    //->把外界需要使用的方法暴露给utils
    return {
        win: win,
        offset: offset,
        listToArray: listToArray,
        formatJSON: formatJSON,
        getCss: getCss,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass
    }
})();
```

