# nginx 常用功能
以下面一份 nginx 配置（节选并做了适当修改）进行分析，不过具体配置请根据自己的需求设置，假设这台服务器ip是 172.16.101.170
```
user  root; # 配置用户或者组，默认为nobody
worker_processes  1;  # 允许生成的进程数，默认为1， 通常设置成和cpu的数量相等

#error_log  logs/error.log;  # 制定日志路径，日志级别: debug > info > notice > warn > error > crit > alert > emerg
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;   # 指定nginx进程运行文件存放地址

events {
  worker_connections  1024;   # 每个worker进程允许的最大并发连接数
}

keepalive_timeout 60;  # 请求超时时间 60s

http {

  ## 开启 giz 压缩 ##
  gzip  on;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  gzip_comp_level 2;
  gzip_types text/plain application/x-javascript application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary off;
  gzip_disable "MSIE [1-6]\.";

  ## 负载均衡 ##
  upstream web-ipaas {
    server ipaas.cai-inc.com;
    server 39.106.145.33;
  }
  upstream nodejs {
    least_conn;   #  优先分配最少连接数的服务器
    #ip_hash;   # 保持会话，保证同一客户端始终访问一台服务器
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3001 backup; # 标记为备份服务器，当主服务器不可用时，将传递与备份服务器的连接
    keepalive 32;
  }

  server {
    listen 80;

    ## 访问静态资源 ##
    location / {
      root /www/test/pc/
      if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') { # 同域名下适配pc和移动端
        root /www/test/pc/mobile/;
      }
      index  index.html index.htm;
      #try_files $uri $uri/ /index.html = 404;
    }

    location ~ ^/settle-front {   # 正则匹配，以/settle-front开头的请求定位到下面root指定的目录 
      root /opt/zcy/front/web-settle-front/;
      try_files $uri $uri/ /index.html = 404;
      access_log off;
    }

    location ~ ^/settle-assets/(.*)$ {
      root /opt/zcy/front/web-settle-front/;
      access_log off;
    }
  }

  server {
    listen 8006;

    ## 访问静态资源 ##
    location / {
      root /root/zcy-graph-guardians-front/dist;
      index  index.html index.htm;
    }

     ## 反向代理实现接口转发 ##
    location ~ ^/guardians/api {
      proxy_pass http://web-ipaas;  # 对应 upstream 映射的服务
      proxy_set_header      X-Real-IP $remote_addr;   # 以记录客户端的ip地址
      proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header      Host $http_host;    # 重写请求头中的 Host
      proxy_set_header      requestId $request_id;
    }
  }

  # 配置 HTTPS server 
  #
  #server {
  #    listen       443 ssl;
  #    server_name  localhost;

  #    ssl_certificate      cert.pem;   # 公钥文件，这两个指令比较重要
  #    ssl_certificate_key  cert.key;   # 私钥文件 

  #    ssl_session_cache    shared:SSL:1m;
  #    ssl_session_timeout  5m;

  #    ssl_ciphers  HIGH:!aNULL:!MD5;
  #    ssl_prefer_server_ciphers  on;

  #    location / {
  #        root   html;
  #        index  index.html index.htm;
  #    }
  #}

}
```

## 静态资源服务
通过配置 location 资源路径，然后可以访问到 root/alias 指定目录的文件，常用来搭建站点。  
比如访问 *http://172.16.101.170:80/*，则对应目录是 /www/test/pc；  
访问 *http://172.16.101.170:80/settle-front*，则对应目录是 /opt/zcy/front/web-settle-front；
> 例如我们这里 /opt/zcy/front/web-settle-front 目录下是个单页面项目（spa），通过访问 *http://172.16.101.170:80/settle-front/#/register*，可以找到该 spa 项目下路由是/register 的页面。我们可以通过在哈希和域名之间设置不同的路径(比如settle-front)，nginx 通过匹配路径分发到不同应用的目录，实现一种[微前端](https://zhuanlan.zhihu.com/p/96464401)架构。  

访问 *http://172.16.101.170:8006/*，则对应目录是 /root/zcy-graph-guardians-front/dist。  

**location 指令**

语法：
```
location [ = | ~ | ~* | ^~ ] uri { ... }
```
一个location关键字，后面跟着可选的修饰符，后面uri是要匹配的字符，花括号中是要执行的操作。  

| 修饰符 | 含义 |
| ----  | --- |
| <div style="width: 50px;">=</div> | 使用精确匹配并且终止搜索 |
| ^~    | 表示uri以某个常规字符串开头，理解为匹配url路径即可。它并非正则表达式匹配，目的是优于正则表达式匹配。这里匹配的是解码uri，例如uri中的“％20”将会匹配location的“ ”（空格）。|
| ~     | 区分大小写的正则表达式匹配 |
| ~*    | 不区分大小写的正则表达式匹配 |

多个 location 配置的情况下匹配顺序为（当有匹配成功时候，停止匹配，按当前匹配规则处理请求）：  
1、匹配＝  
2、匹配^~  <br />
3、按文件中正则出现的顺序匹配  
当有多个正则匹配时，选择正则表达式最长的配置执行。

比如配置中的  ~ ^/settle-front，走的是 ~ 修饰符，后面 ^/settle-front 属于正则表达式。  
具体 location 讲解可以看[这里](https://segmentfault.com/a/1190000013267839)

## 反向代理
**正向代理**：是⼀个位于客户端和原始服务器之间的服务器，为了从原始服务器取得内容，客户端向代理发送⼀个请求
并指定⽬标(原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。正向代理是为客户端服
务的，客户端可以根据正向代理访问到它本身⽆法访问到的服务器资源，⽐如我们可以通过VPN来访问⾕歌。  
**反向代理**：是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部⽹络上的服务器，并将从服务器上
得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为⼀个反向代理服务器。反向是为服务
端服务的，反向代理可以帮助服务器接收来⾃客户端的请求，帮助服务器做请求转发，负载均衡等。

反向代理主要通过 proxy_pass 来配置，比如上面的
```
  location ~ ^/guardians/api {
    proxy_pass http://web-ipaas;  # 对应 upstream 映射的服务
    proxy_set_header      X-Real-IP $remote_addr;   # 以记录客户端的ip地址
    proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header      Host $http_host;    # 重写请求头中的 Host
    proxy_set_header      requestId $request_id;
  }
```
当调 http://172.16.101.170/guardians/api/v1/userInfo 接口，就会转发到 web-ipaas 对应的服务下，实现了跨域请求。  

proxy_set_header：重写或增加请求头中的字段

## 负载均衡
通过 upstream 指令配置，将流量分配到多个后端服务器，比如
```
  # 轮询算法
  upstream web-ipaas {
    server ipaas.cai-inc.com;
    server 39.106.145.33;
  }
  # 最少连接数算法
  upstream nodejs {
    least_conn;   #  优先分配最少连接数的服务器
    #ip_hash;   # 保持会话，保证同一客户端始终访问一台服务器
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002 backup; # 标记为备份服务器，当主服务器不可用时，将传递与备份服务器的连接
    keepalive 32;
  }
```
server指令可选参数：    
  - weight: 设置一个服务器的访问权重，数值越高，收到的请求也越多
  - down：标记一个服务器不再接受任何请求
  - backup：一旦其他服务器宕机，那么有该标记的机器将会接收请求
  - max_fails：设置在fail_timeout时间之内尝试对一个服务器连接的最大次数，如果超过这个次数，那么服务器将会被标记为down
  - fail_timeout：在这个指定的时间内服务器必须提供响应，如果在这个时间内没有收到响应，那么服务器将会被标记为down状态

upstream模块能够使用3种负载均衡算法：轮询、IP哈希、最少连接数。  
  - 轮询：默认情况下使用轮询算法，不需要配置指令来激活它，它是基于在队列中谁是下一个的原理确保访问均匀地分布到每个目标服务器
  - IP哈希：通过ip_hash指令来激活，Nginx通过IPv4地址的前3个字节或者整个IPv6地址作为哈希键来实现，同一个IP地址总是能被映射到同一个目标服务器
  - 最少连接数：通过least_conn指令来激活，该算法通过选择一个活跃数最少的目标服务器进行连接。如果目标服务器处理能力不同，可以通过给server配置weight权重来说明，该算法将考虑到不同服务器的加权最少连接数。

## 开启gzip
最简单的 gzip 配置
```
http {
   .....
    gzip on;
    gzip_types text/plain application/javascript text/css;
   .....
}
```
  - gzip : 该指令用于开启或 关闭gzip模块。
  - gzip_buffers : 设置系统获取几个单位的缓存用于存储gzip的压缩结果数据流。
  - gzip_comp_level : gzip压缩比，压缩级别是1-9，1的压缩级别最低，9的压缩级别最高。压缩级别越高压缩率越大，压缩时间越长。
  - gzip_disable : 可以通过该指令对一些特定的User-Agent不使用压缩功能。
  - gzip_min_length:设置允许压缩的页面最小字节数，页面字节数从相应消息头的Content-length中进行获取。
  - gzip_http_version：识别HTTP协议版本，其值可以是1.1.或1.0.
  - gzip_proxied : 用于设置启用或禁用从代理服务器上收到相应内容gzip压缩。
  - gzip_vary : 用于在响应消息头中添加Vary：Accept-Encoding,使代理服务器根据请求头中的Accept-Encoding识别是否启用gzip压缩。

当响应头中 Content-Encoding 为gzip类型， 说明开启成功。

## 实战tips
  - 开启gzip时，最好显示设置 gzip_types
  - location中 alias 必须以 / 结尾, 否则会找不到资源
  - 可以不记录静态文件请求日志,避免 access_log 过大
  - 可以设置定时删除日志文件, 或者脚本切分
  - 可以编写启动脚本: sudo sh /usr/local/etc/nginx/startup.sh

## 扩展阅读
  - [Nginx配置杂记](https://wenjs.me/p/note-of-nginx-configure)
  - [Nginx 配置详解](https://www.runoob.com/w3cnote/nginx-setup-intro.html)