# 盒子模型

JS 盒子模型指的是通过 JS 中提供的一系列的属性和方法,获取页面中元素的样式信息值

内容的宽度和高度:我们设置的 width/height 这两个样式就是内容的宽和高;
如果没有设置 height 值,容器的高度会根据里面内容自己进行适应,这样获取的值就是真实内容的高;
如果设置固定的高度了,不管内容是多了还是少了,其实我们内容的高度指的都是设定的那个值;
真实内容的宽度和高度:这个代指的是实际内容个的宽高(和我们设置的 height 没有必然的联系)
例如:我设置高度为 200px,如果内容有溢出,那么真实内容的高度是要把溢出内容的高度也要加进来的

1. client 系列

   - clientWidth/clientHeight:内容的宽度/高度+左右/上下填充 (和内容溢出没有关系)
   - clientLeft:左边框的宽度 clientTop:上边框的高度 (border[Left/Top]Width)

2. offset 系列

   - offsetWidth/offsetHeight:clientWidth/clientHeight+左右/上下边框 (和内容是否溢出也是没有任何的关系的)
   - offsetParent:当前元素的父级参照物
   - offsetLeft/offsetTop:当前元素的外边框距离父级参照物的内边框的偏移量

3. scroll 系列

   - scrollWidth/scrollHeight:和我们的 clientWidth/clientHeight 一模一样(前提是：容器中的内容没有溢出的情况下)

   - 如果容器中的内容有溢出,我们获取的结果是如下规则:
     - scrollWidth:真实内容的宽度(包含溢出)+左填充
     - scrollHeight:真实内容的高度(包含溢出)+上填充
       获取到的结果都是"约等于"的值,因为:同一个浏览器,我们是否设置 overflow='hidden'对于最终的结果是有影响的;在不同的浏览器中我们获取到的结果也是不相同的;
     - scrollLeft/scrollTop:滚动条卷去的宽度/高度

4. 关于 JS 盒子模型属性取值的问题
   我们通过这 13 个属性值获取的结果永远不可能出现小数,都是整数;浏览器获取结果的时候,在原来真实结果的基础上进行四舍五入;

5. 关于操作浏览器本身的盒子模型信息
   - clientWidth/clientHeight 是当前浏览器可视窗口的宽度和高度(一屏幕的宽度和高度)
   - scrollWidth/scrollHeight 是当前页面的真实宽度和高度(所有屏加起来的宽度和高度~但是是一个约等于的值
   - 我们不管哪些属性,也不管是什么浏览器,也不管是获取还是设置,想要都兼容的话,需要写两套
     document.documentElement[attr]||document.body[attr]; //->必须 document.documentElement 在前

```
    [获取] document.documentElement.clientWidth||document.body.clientWidth
    [设置也需要写两套]
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;

    win:编写一个有关于操作浏览器盒子模型的方法
    如果只传递了attr没有传递value,默认的意思是“获取”
    如果两个参数都传递了,意思是“设置”
    不严谨的来说这就是有关于"类的重载":同一个方法,通过传递参数的不同实现了不同的功能
    function win(attr, value) {
        if (typeof value === "undefined") {//->没有传递value值->"获取"
            return document.documentElement[attr] || document.body[attr];
        }
        //->"设置"
        document.documentElement[attr] = value;
        document.body[attr] = value;
    }
    console.log(win("clientHeight"));
    win("scrollTop", 0);
```

# 获取元素的样式

1. 元素.style.属性名 需要我们把元素的样式都写在行内样式上才可以(写在样式表中是不管用的)

2. 使用 window.getComputedStyle 这个方法获取所有经过浏览器计算过的样式
   - 所有经过浏览器计算过的样式:只要当前的元素标签可以在页面中呈现出来,那么它的所有的样式都是经过浏览器计算过的(渲染过的)->哪怕有些样式你没有写,我们也可以获取到
   - window.getComputedStyle(当前要操作的元素对象, 当前元素的伪类[一般我们不用伪类写 null])
   - 获取的结果是 CSSStyleDeclaration 这个类的一个实例:包含了当前元素的所有样式属性和值
     console.log(window.getComputedStyle);//->function getComputedStyle() { [native code] }
     console.log(window.getComputedStyle(box, null)["height"]);
3. getCss
   获取当前元素所有经过浏览器计算过的样式中的[attr]对应的值
   curEle:[object]当前要操作的元素对象
   attr:[string]我们要获取的样式属性的名称

```js
    function getCss(curEle, attr) {
        var val = null, reg = null;
        if ("getComputedStyle" in window) {
            val = window.getComputedStyle(curEle, null)[attr];
        } else {//->IE6~8
            //->如果传递进来的结果是opacity,说明我想获取到的是透明度,但是在IE6~8下获取透明度需要使用filter
            if (attr === "opacity") {
                val = curEle.currentStyle["filter"];//->"alpha(opacity=10)" 把获取到的结果进行剖析,获取里面的数字,让数字乘以100才和标准的浏览器保持了一致 i-忽略大小写
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
                val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }
        }
        reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;
        return reg.test(val) ? parseFloat(val) : val;
    }
    console.log(getCss(box, "opacity"));
```

# 偏移量

1. parentNode:父亲节点 HTML 结构层级关系中的上一级元素
2. offsetParent:父级参照物 在同一个平面中,最外层的元素是里面所有元素的父级参照物(和 HTML 层级结构没有必然的联系)
   一般来说一个页面中所有元素的父级参照物都是 body
   outer.offsetParent //->body
   document.body.offsetParent //->null
   想要改变父级参照物需要通过 position 定位来进行改变:absolute、relative、fixed 任意一个值都可以把父级参照物进行修改

   ```js
       outer.style.position = "relative";
       console.log(center.offsetParent);//->outer
       console.log(inner.offsetParent);//->outer
       console.log(outer.offsetParent);//->body

       outer.style.position = "relative";
       inner.style.position = "relative";
       console.log(center.offsetParent);//->inner
       console.log(inner.offsetParent);//->outer
       console.log(outer.offsetParent);//->body
   ```

3. offsetTop/offsetLeft:当前元素(外边框)距离其父级参照物(内边框)的偏移距离

   ->offset:等同于 jQuery 中的 offset 方法,实现获取页面中任意一个元素,距离 body 的偏移(包含左偏移和上偏移),不管当前元素的父级参照物是谁
   ->获取的结果是一个对象{left:距离 BODY 的左偏移,top:距离 BODY 的上偏移}
   ->在标准的 IE8 浏览器中,我们使用 offsetLeft/offsetTop 其实是把父级参照物的边框已经算在内了,所以我们不需要自己在单独的加边框了

```js
      function offset(curEle) {
        var totalLeft = null,
          totalTop = null,
          par = curEle.offsetParent;
        //->首先把自己本身的进行累加
        totalLeft += curEle.offsetLeft;
        totalTop += curEle.offsetTop;

        //->只要没有找到body,我们就把父级参照物的边框和偏移也进行累加
        while (par) {
          if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
            //->不是标准的IE8浏览器,我们才进行累加边框
            //->累加父级参照物的边框
            totalLeft += par.clientLeft;
            totalTop += par.clientTop;
          }

          //->累加父级参照物本身的偏移
          totalLeft += par.offsetLeft;
          totalTop += par.offsetTop;

          par = par.offsetParent;
        }
        return { left: totalLeft, top: totalTop };
      }

      console.log(offset(center).left);
```

# 滚动条卷去的宽度和高度

1. 之前我们学习的 JS 盒子模型中:client 系列/offset 系列/scrollWidth/scrollHeight 都是"只读"属性->只能通过属性获取值,不能通过属性修改元素的样式

2. scrollTop/scrollLeft:滚动条卷去的高度/宽度(这两个属性是唯一"可读写"属性) box.scrollTop = 0;//->直接回到了容器的顶部

3. 我们的 scrollTop 的值是存在边界值(最大和最小值的),我们设置的值比最小值小或者比最大值大都没用,起到效果的依然是边界的值

```
[最小值是零]
    box.scrollTop = -1000;//->直接回到了容器的顶部,没有超出
    console.log(box.scrollTop);//->0

[最大值是=真实的高度-当前容器一屏幕的高度]
    var maxTop = box.scrollHeight - box.clientHeight;
    console.log(maxTop);
```

4. 回到顶部
   - 总时间(duration):500ms
   - 频率(interval):多长时间走一步 10ms
   - 总距离(target):当前的位置(当前的 scrollTop 值)-目标的位置(0)
   - 步长(step):每一次走的距离 target/duration->每 1ms 走的距离\*interval->每一次走的距离

```js
开始GO按钮是不显示的,只有当浏览器卷去的高度超过一屏幕的高度的时候在显示,反之隐藏->只要浏览器的滚动条在滚动,我们就需要判断GO显示还是隐藏
浏览器的滚动条滚动:拖动滚动条、数遍滚轮、键盘上下键或者pageDown/pageUp键、点击滚动条的空白处或者箭头(自主操作的行为)...我们还可以通过JS控制scrollTop的值实现滚动条的滚动
window.onscroll不管怎么操作,只要滚动条动了就会触发这个行为

window.onscroll = computedDisplay;
function computedDisplay() {
var curTop =
    document.documentElement.scrollTop || document.body.scrollTop;
var curHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
goLink.style.display = curTop > curHeight ? 'block' : 'none';
}
goLink.onclick = function () {
//当点击的时候让当前的GO消失
this.style.display = 'none';
//光这样还不行:我们往回走的时候又把window.onscroll行为触发了,让GO又显示了->我们需要在点击后,把window.onscroll绑定的事件取消掉
window.onscroll = null;

var duration = 500,
    interval = 10,
    target =
    document.documentElement.scrollTop || document.body.scrollTop;
var step = (target / duration) * interval;
var timer = window.setInterval(function () {
    var curTop =
    document.documentElement.scrollTop || document.body.scrollTop;
    if (curTop === 0) {
    window.clearInterval(timer);
    window.onscroll = computedDisplay; //->当动画结束后还需要把对应的方法重新绑定给window.onscroll
    return;
    }
    curTop -= step;
    document.documentElement.scrollTop = curTop;
    document.body.scrollTop = curTop;
}, interval);
```

# 伪类补充

在一个元素标签的前面或者后面,创建一个新的虚拟的标签,我们可以给这个虚拟的标签增加样式,也可以增加内容等  :before :after

```
获取伪类的内容
var boxP = document.getElementById('boxP');
console.log(window.getComputedStyle(boxP, 'before').content);
console.log(window.getComputedStyle(boxP, 'after').height);
```

# 单张图片懒加载

```js
window.onscroll = function () {
    if (banner.isLoad) {//->已经加载过了
        return;
    }
    var A = banner.offsetHeight + utils.offset(banner).top;
    var B = utils.win("clientHeight") + utils.win("scrollTop");
    if (A < B) {
        //->当条件成立,我们加载真实的图片,第一次加载完成后,我们在让页面继续滚动的过程中,A<B一直成立,又从新的执行了下面的操作,导致了重复给一个容器中的图片进行加载
        var oImg = new Image;
        oImg.src = imgFir.getAttribute("trueImg");
        oImg.onload = function () {
            imgFir.src = this.src;
            imgFir.style.display = "block";
            oImg = null;
        };
        banner.isLoad = true;//->设置一个自定义属性,告诉浏览器我已经把图片加载完了(不管是否正常的加载,只要处理过一次以后都不在处理了)
    }
};
```
# 多张图片懒加载

```js
//->实现渐现的效果  透明度从0到1 500ms 10ms走一次
function fadeIn(curImg) {
var duration = 500,
    interval = 10,
    target = 1;
var step = (target / duration) * interval;
var timer = window.setInterval(function () {
    var curOp = utils.getCss(curImg, 'opacity');
    if (curOp >= 1) {
    curImg.style.opacity = 1;
    window.clearInterval(timer);
    return;
    }
    curOp += step;
    curImg.style.opacity = curOp;
}, interval);
}
 imgList = news.getElementsByTagName('img');

//->循环处理每一张图片
function handleAllImg() {
for (var i = 0, len = imgList.length; i < len; i++) {
    var curImg = imgList[i];

    //->当前的图片处理过的话,就不需要在重新的进行处理了
    if (curImg.isLoad) {
    continue;
    }

    //->只有A<B的时候在进行处理:当前图片是隐藏的,我们计算的A的值其实是计算它父亲(容器)的值
    var curImgPar = curImg.parentNode;
    var A = utils.offset(curImgPar).top + curImgPar.offsetHeight,
    B = utils.win('clientHeight') + utils.win('scrollTop');
    if (A < B) {
    lazyImg(curImg);
    }
}
}
//4、开始的时候(过500ms加载第一屏幕的图片)、滚动条滚动的时候加载其它图片
window.setTimeout(handleAllImg, 500);
window.onscroll = handleAllImg;
```