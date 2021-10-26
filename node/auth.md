# 客户端存储总结

1. cookie

- cookie 是 http 协议下，服务端或者脚本可以维护客户端信息的一种方式。本身用来浏览器和 server 通信，被借用到本地存储来

- koa 中 cookie 的使用

  - 储存 cookie 的值；

  ```
  ctx.cookies.set(name, value, [options]);
  ```

  - 获取 cookie 的值

  ```
  ctx.cookies.get(name, [options]);
  ```

  - options 常用设置

    - `maxAge` 一个数字表示从 Date.now() 得到的毫秒数
    - `expires` cookie 过期的 `Date`
    - `path` cookie 路径, 默认是`'/'`
    - `domain` cookie 域名
    - `secure` 安全 cookie 设置后只能通过 https 来传递 cookie
    - `httpOnly` 服务器可访问 cookie, 默认是 **true**
    - `overwrite` 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 **false**). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie

    - 客户端 cookie 使用方式；

  - 设置

    ```
    document.cookie = 'key=value';
    ```

    - key 和 value 是包含在一个字符串中

      - key 包含字段
        - [name] 这个 name 为自己取的 cookie 名称，同名的值会覆盖
        - domain 所属域名
        - path 所属路径
        - Expires/Max-Age 到期时间/持续时间 (单位是秒)
        - http-only 是否只作为 http 时使用，如果为 true，那么客户端能够在 http 请求和响应中进行传输，但时客户端浏览器不能使用 js 去读取或修改

    - 多个 key=value 使用 ; （分号）分隔

* 获取

  ```
  document.cookie;
  ```

  返回值是当前域名下的所有 cookie，并按照某种格式组织的字符串 ：key=value;key1=value1;......keyn=valuen

* 封装

  - 设置 cookie 封装

  ```
  //设置cookie
  function setCookie(name, value, options = {}) {
    let cookieData = `${name}=${value};`;
    for (let key in options) {
      let str = `${key}=${options[key]};`;
      cookieData += str;
    }
    document.cookie = cookieData;
  }
  ```

  - 获取 cookie

  ```js
  //获取Cookie
  function getCookie(name) {
    let arr = document.cookie.split('; ');
    for (let i = 0; i < arr.length; i++) {
      let [key, value] = arr[i].split('=');
      if (cur == name) {
        return value;
      }
    }
    return '';
  }
  ```

### 本地缓存 Storage

- localStorage 及 sessionStorage 使用

  - 设置

    setItem(key, value) 添加或更新（如果数据项中已存在该 key）数据项中指定 key 的 value

  - 获取

    getItem(key) 获取数据项中指定 key 对应的 value

  - 移出指定数据

    removeItem(key) 删除数据项中指定 key 的 value

  - 清空所有数据

    clear() 清空所有数据项

###本地存储异同

- 共同点

- localStorage 和 sessionStorage 和 cookie 共同点

  - 同域（同源策略）限制：同源策略：请求与响应的 协议、域名、端口都相同 则时同源，否则为 跨源/跨域
  - 存储的内容都会转为字符串格式
  - 都有存储大小限制

- localStorage 和 sessionStorage 共同点

  - API 相同
  - 存储大小限制一样基本类似 5M
  - 无个数限制

* 不同点
* localStorage
  - 没有有效期，除非删除，否则一直存在
  - 同域下页面共享
  - 支持 storage 事件
* sessionStorage

  - 浏览器关闭，自动销毁
  - 页面私有
  - 不支持 storage 事件

* cookie
  - 浏览器也会在每次请求的时候主动组织所有域下的 cookie 到请求头 cookie 中，发送给服务器端
  - 浏览器会主动存储接收到的 set-cookie 头信息的值
  - 可以设置 http-only 属性为 true 来禁止客户端代码（js）修改该值
  - 可以设置有效期 (默认浏览器关闭自动销毁)(不同浏览器有所不同)
  - 同域下个数有限制，最好不要超过 50 个(不同浏览器有所不同)
  - 单个 cookie 内容大小有限制，最好不要超过 4000 字节(不同浏览器有所不同)

# 鉴权

常见的三种鉴权方式

1. session/cookie
2. token
3. Oauth
4. sso

# session-cookie 方式

- Header Set-Cookie 负责设置 cookie
- 请求传递 Cookie

```
  res.setHeader(
    'Set-Cookie',
    `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`
  );
```

- session 的原理解释

[原理](![](../static/img/auth2.png)

1. 服务器在接受客户端首次访问时在服务器端创建 seesion，然后保存 seesion(我们可以将 seesion 保存在
   内存中，也可以保存在 redis 中，推荐使用后者)，然后给这个 session 生成一个唯一的标识字符串,然后在
   响应头中种下这个唯一标识字符串。
2. 签名。这一步通过秘钥对 sid 进行签名处理，避免客户端修改 sid。（非必需步骤）
3. 浏览器中收到请求响应的时候会解析响应头，然后将 sid 保存在本地 cookie 中，浏览器在下次 http 请求的
   请求头中会带上该域名下的 cookie 信息，
4. 服务器在接受客户端请求时会去解析请求头 cookie 中的 sid，然后根据这个 sid 去找服务器端保存的该客
   户端的 session，然后判断该请求是否合法。

```
  //解析 session
  const SESSION_DATA = {}
  let userId = req.cookie.userid;
  //是否需要设置session
  let needSetCookie = false;
  let saveSession = {};
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];
```

```
const session = {};
http
  .createServer((req, res) => {
    // 观察cookie存在
    console.log('cookie:', req.headers.cookie);
    const sessionKey = 'sid';
    const cookie = req.headers.cookie;
    if (cookie && cookie.indexOf(sessionKey) > -1) {
      res.end('Come Back ');
      // 简略写法未必具有通用性
      const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`);
      const sid = pattern.exec(cookie)[1];
      console.log('session:', sid, session, session[sid]);
    } else {
      const sid = (Math.random() * 99999999).toFixed();
      // 设置cookie
      res.setHeader('Set-Cookie', `${sessionKey}=${sid};`);
      session[sid] = { name: 'laowang' };
      res.end('Hello');
    }
    res.end('hello cookie!!');
  })
  .listen(3000);

```

# koa 中的 session 使用

```
const koa = require('koa');
const app = new koa();
const session = require('koa-session');
// 签名key keys作用 用来对cookie进行签名
app.keys = ['some secret'];
// 配置项
const SESS_CONFIG = {
  key: 'kkb:sess',
  // cookie键名 maxAge: 86400000,
  // 有效期，默认一天 httpOnly: true,
  // 仅服务器修改 signed: true,
  // 签名cookie
};
// 注册
app.use(session(SESS_CONFIG, app));
// 测试
app.use((ctx) => {
  if (ctx.path === '/favicon.ico') return;
  // 获取
  let n = ctx.session.count || 0;
  // 设置
  ctx.session.count = ++n;
  ctx.body = '第' + n + '次访问';
});

```

# 使用 redis 存储 session

```
// koa-redis
const redisStore = require('koa-redis');
const redis = require('redis');
const redisClient = redis.createClient(6379, 'localhost');
const wrapper = require('co-redis');
const client = wrapper(redisClient);
app.use(
  session(
    {
      key: 'kkb:sess',
      store: redisStore({ client }),
      // 此处可以不必指定client
    },
    app
  )
);
app.use(async (ctx, next) => {
  const keys = await client.keys('*');
  keys.forEach(async (key) => console.log(await client.get(key)));
  await next();
});

const session = require('koa-generic-session');
const redisStore = require('koa-redis');
// 路由之前  aap.keys 和 就是 secret
app.keys = ['ZL_S'];
app.use(
  session({
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: redisStore({
      all: '127.0.0.1:6379', //先写死本地的
    }),
  })
);

```

# token 验证

[验证](![](../static/img/token.png)

1. 客户端使用用户名跟密码请求登录
2. 服务端收到请求，去验证用户名与密码
3. 验证成功后，服务端会签发一个令牌(Token)，再把这个 Token 发送给客户端
4. 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
5. 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
6. 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据

```
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>

  <body>
    <div id="app">
      <div>
        <input v-model="username" />
        <input v-model="password" />
      </div>
      <div>
        <button v-on:click="login">Login</button>
        <button v-on:click="logout">Logout</button>
        <button v-on:click="getUser">GetUser</button>
      </div>
      <div>
        <button @click="logs=[]">Clear Log</button>
      </div>
      <!-- 日志 -->
      <ul>
        <li v-for="(log,idx) in logs" :key="idx">
          {{ log }}
        </li>
      </ul>
    </div>
    <script>
      axios.interceptors.request.use(
        (config) => {
          const token = window.localStorage.getItem('token');
          if (token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            // Bearer是JWT的认证头部信息
            config.headers.common['Authorization'] = 'Bearer ' + token;
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );

      axios.interceptors.response.use(
        (response) => {
          app.logs.push(JSON.stringify(response.data));
          return response;
        },
        (err) => {
          app.logs.push(JSON.stringify(response.data));
          return Promise.reject(err);
        }
      );
      var app = new Vue({
        el: '#app',
        data: {
          username: 'test',
          password: 'test',
          logs: [],
        },
        methods: {
          async login() {
            const res = await axios.post('/login-token', {
              username: this.username,
              password: this.password,
            });
            localStorage.setItem('token', res.data.token);
          },
          async logout() {
            localStorage.removeItem('token');
          },
          async getUser() {
            await axios.get('/getUser-token');
          },
        },
      });
    </script>
  </body>
</html>

```

```
const Koa = require('koa');
const router = require('koa-router')();
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const jwt = require('jsonwebtoken');
const jwtAuth = require('koa-jwt');

const secret = "it's a secret";
app.use(bodyParser());
app.use(static(__dirname + '/'));

router.post('/login-token', async (ctx) => {
  const { body } = ctx.request;
  //登录逻辑，略
  //设置session
  const userinfo = body.username;
  ctx.body = {
    message: '登录成功',
    user: userinfo,
    // 生成 token 返回给客户端
    token: jwt.sign(
      {
        data: userinfo,
        // 设置 token 过期时间，一小时后，秒为单位
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      secret
    ),
  };
});

router.get(
  '/getUser-token',
  jwtAuth({
    secret,
  }),
  async (ctx) => {
    // 验证通过，state.user
    console.log(ctx.state.user);

    //获取session
    ctx.body = {
      message: '获取数据成功',
      userinfo: ctx.state.user.data,
    };
  }
);

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(8010);

```

# JWT(JSON WEB TOKEN)原理解析

1. Bearer Token 包含三个组成部分：令牌头、payload、哈希
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWJjIiwicGFzc3dvcmQiOiIxMTExMTEifSwi
   ZXhwIjoxNTU3MTU1NzMwLCJpYXQiOjE1NTcxNTIxMzB9.pjGaxzX2srG_MEZizzmFEy7JM3t8tjkiu3yULgzFwUk

- 签名：默认使用 base64 对 payload 编码，使用 hs256 算法对令牌头、payload 和密钥进行签名生成哈希
- 验证：默认使用 hs256 算法对 hs256 算法对令牌中数据签名并将结果和令牌中哈希比对

```
const jsonwebtoken = require('jsonwebtoken');
const secret = '12345678';
const opt = {
  secret: 'jwt_secret',
  key: 'user',
};
const user = {
  username: 'abc',
  password: '111111',
};

const token = jsonwebtoken.sign(
  {
    data: user,
    // 设置 token 过期时间
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  },
  secret
);

console.log('生成token:' + token);
// 生成token:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiYWJjIiwicGFzc3dvcmQiOiIxMTExMTEifSwiZXhwIjoxNTQ2OTQyMzk1LCJpYXQiOjE1NDY5Mzg3OTV9.VPBCQgLB7XPBq3RdHK9WQMkPp3dw65JzEKm_LZZjP9Y
console.log('解码:', jsonwebtoken.verify(token, secret, opt));
// 解码: { data: { username: 'abc', password: '111111' },
//  exp: 1546942395,
//  iat: 1546938795
}

```

- HMAC SHA256 HMAC(Hash Message Authentication Code，散列消息鉴别码，基于密钥的 Hash 算法的认
  证协议。消息鉴别码实现鉴别的原理是，用公开函数和密钥产生一个固定长度的值作为认证标识，用这个标
  识鉴别消息的完整性。使用一个密钥生成一个固定大小的小数据块，即 MAC，并将其加入到消息中，然后传
  输。接收方利用与发送方共享的密钥进行鉴别认证等。
  BASE64 按照 RFC2045 的定义，Base64 被定义为：Base64 内容传送编码被设计用来把任意序列的 8 位字节描
  述为一种不易被人直接识别的形式。（The Base64 Content-Transfer-Encoding is designed to represent
  arbitrary sequences of octets in a form that need not be humanly readable.） 常见于邮件、http 加密，
  截取 http 信息，你就会发现登录操作的用户名、密码字段通过 BASE64 编码的
- Beare

- Beare 作为一种认证类型(基于 OAuth 2.0)，使用"Bearer"关键词进行定义

# OAuth(开放授权)

概述：三方登入主要基于 OAuth 2.0。OAuth 协议为用户资源的授权提供了一个安全的、开放而又简易的标
准。与以往的授权方式不同之处是 OAUTH 的授权不会使第三方触及到用户的帐号信息（如用户名与密码），
即第三方无需使用用户的用户名与密码就可以申请获得该用户资源的授权，因此 OAUTH 是安全的。

OAuth 登录 github 第三方授权

```
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  </head>

  <body>
    <div id="app">
      <button @click="oauth()">Login with Github</button>
      <div v-if="userInfo">
        Hello {{userInfo.name}}
        <img :src="userInfo.avatar_url" />
      </div>
    </div>
    <script></script>
    <script>
      axios.interceptors.request.use(
        (config) => {
          const token = window.localStorage.getItem('token');
          if (token) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            // Bearer是JWT的认证头部信息
            config.headers.common['Authorization'] = 'Bearer ' + token;
          }
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );

      axios.interceptors.response.use(
        (response) => {
          app.logs.push(JSON.stringify(response.data));
          return response;
        },
        (err) => {
          app.logs.push(JSON.stringify(response.data));
          return Promise.reject(err);
        }
      );
      var app = new Vue({
        el: '#app',
        data: {
          logs: [],
          userInfo: null,
        },
        methods: {
          async oauth() {
            window.open('/auth/github/login', '_blank');
            const intervalId = setInterval(() => {
              console.log('等待认证中..');
              if (window.localStorage.getItem('authSuccess')) {
                clearInterval(intervalId);
                window.localStorage.removeItem('authSuccess');
                this.getUser();
              }
            }, 500);
          },
          async getUser() {
            const res = await axios.get('/auth/github/userinfo');
            console.log('res:', res.data);
            this.userInfo = res.data;
          },
        },
      });
    </script>
  </body>
</html>


```

```
const Koa = require('koa');
const router = require('koa-router')();
const static = require('koa-static');
const app = new Koa();
const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const jwtAuth = require('koa-jwt');
const accessTokens = {};

const secret = "it's a secret";
app.use(static(__dirname + '/'));
const config = {
  client_id: 'fd3fc93e900303774fd4',
  client_secret: 'b50972d9e7205a21a61f5a4f7a68aaf5f054907b',
};

router.get('/auth/github/login', async (ctx) => {
  var dataStr = new Date().valueOf();
  //重定向到认证接口,并配置参数
  var path = `https://github.com/login/oauth/authorize?${querystring.stringify({
    client_id: config.client_id,
  })}`;

  //转发到授权服务器
  ctx.redirect(path);
});

router.get('/auth/github/callback', async (ctx) => {
  console.log('callback..');
  const code = ctx.query.code;
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: code,
  };
  let res = await axios.post(
    'https://github.com/login/oauth/access_token',
    params
  );
  const access_token = querystring.parse(res.data).access_token;
  const uid = Math.random() * 99999;
  accessTokens[uid] = access_token;

  const token = jwt.sign(
    {
      data: uid,
      // 设置 token 过期时间，一小时后，秒为单位
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    secret
  );
  ctx.response.type = 'html';
  console.log('token:', token);
  ctx.response.body = ` <script>window.localStorage.setItem("authSuccess","true");window.localStorage.setItem("token","${token}");window.close();</script>`;
});

router.get(
  '/auth/github/userinfo',
  jwtAuth({
    secret,
  }),
  async (ctx) => {
    // 验证通过，state.user
    console.log('jwt playload:', ctx.state.user);
    const access_token = accessTokens[ctx.state.user.data];
    res = await axios.get(
      'https://api.github.com/user?access_token=' + access_token
    );
    console.log('userAccess:', res.data);
    ctx.body = res.data;
  }
);

app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());
app.listen(8011);

```

# 单点登录 SSO

[原理](![](../static/img/sso.png)
