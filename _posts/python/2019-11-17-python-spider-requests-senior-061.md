---
layout: post
title:  第61天：Requests的高级用法
category: python
copyright: python
---

by 闲欢

上一篇我们介绍了 Requests 库的基本用法，学会之后大家就可以应付一般的请求了。这一篇我们接着介绍 Requests 的高级用法，以便应付一些棘手的问题。
<!--more-->


## 会话维持

在 requests 中，直接使用 get() 或 post() 方法确实可以做到模拟网页的请求，但是这实际上是两个不同的会话，相当于用了两个浏览器打开不同的页面，而这两个页面是不共享 cookies 的。会话维持相当于打在原来的浏览器上新开了一个页面，这样就不用每次去设置 cookies 了——这就是Session对象。

```
s = requests.Session()
s.get('http://httpbin.org/cookies/set/sessioncookie/123456789')
r = s.get("http://httpbin.org/cookies")
print(r.text)

# 输出结果
{
  "cookies": {}
}
```

这里我们请求了一个测试网站，设置了一个 Cookie ，名称为 num ，内容为123456，之后又发起了请求，获取Cookies，结果并没有取到第一次请求的 Cookie。

试想一种常见的场景：我登录一个网站之后，点击里面某个功能的时候，是不需要再登录的，为什么？因为登录操作之后，浏览器与服务器之间就建立了一个 Session ，我在同一浏览器再次请求服务器的时候，共用的是这一个 Session ，所以不用再次登录。那么如果我使用代码去请求呢？按照上面的例子，我请求两次并不会共享 Session，那就没法实现这个场景功能。而 Requests 的会话可以实现这种场景功能。

我们再来看个例子：

```
session = requests.Session()
session.get('http://httpbin.org/cookies/set/num/123456')
res = session.get('http://httpbin.org/cookies')
print(res.text)

# 输出结果
{
  "cookies": {
    "num": "123456"
  }
}
```

这个例子中，我们使用 Session 对象请求，第一次请求设置的 Cookie ，在第二次请求中我们仍然可以获取到，说明两次请求在同一个 Session 中。

## 身份认证

在访问网站时，我们经常会遇到需要身份认证的页面，需要输入用户名和密码才能登录网站。这个时候我们可以使用 Requests 自带的身份认证功能。

```
import requests
from requests.auth import HTTPBasicAuth

#请将username和password替换成自己在该网站的登录用户名和密码
res = requests.get('http://www.baidu.com', auth=HTTPBasicAuth('username', 'password'))
print(res.status_code)

# 输出结果
200
```

如果用户名和密码都正确的话，就会成功，返回200状态码。否则返回401状态码。

## SSL证书验证

现在随处可见 https 开头的网站，Requests 可以为 HTTPS 请求验证 SSL 证书，就像 web 浏览器一样。要想检查某个主机的 SSL 证书，你可以使用 verify 参数：

```
import requests

r = requests.get('https://httpbin.org', verify=True)
print(r.text)
```

如果想检查验证某个主机的 SSL 证书，就将 verify 设置为 True ，如果证书无效，就会报 requests.exceptions.SSLError 的错误。如果想跳过检查，就将 verify 参数设置为 False。 verify 参数默认是 True ，所以如果需要的话，需要手动设置下这个变量。

## 代理设置

对于某些网站，如果请求几次，或许能正常获取内容。一旦开始爬取，对于大规模的频繁请求，网站可能会弹出验证码，或者跳转到登陆认证，或者封禁IP，导致一定时间内无法访问。此时，就需要设置代理还解决这个问题，就要用到 proxies 参数。

```
# 代理设置
proxies = {
    'http': 'http://127.0.0.1:9001',
    'https': 'https://127.0.0.2:9002'
}
requests.get('http://www.baidu.com', proxies=proxies)

```

这里的两个地址都是编的，仅做示例用。如果你想跑起来的话需要换成有效代理。

## SOCKS

除了基本的 HTTP 代理，Request 还支持 SOCKS 协议的代理。这是一个可选功能，若要使用， 你需要安装第三方库。你可以用 pip 获取依赖:

```
$ pip install requests[socks]
```

安装好依赖以后，使用 SOCKS 代理和使用 HTTP 代理一样简单：

```
proxies = {
    'http': 'socks5://user:pass@host:port',
    'https': 'socks5://user:pass@host:port'
}
```

## 超时设置

在 Rquests 的基本用法中，我们介绍了超时的用法，通过使用 timeout 参数来配置。例如：

```
r = requests.get('https://github.com', timeout=5)
```

我们知道，一个 HTTP 请求会有 connect 和 read 两部分时间，上面的例子中设置的是二者加起来的超时时间。如果要分别制定，我们需要传入一个元组：

```
r = requests.get('https://github.com', timeout=(3.05, 27))
```

如果远端服务器很慢，如果你想要 Request 一直等待服务器返回，那么可以给 timeout 赋值 None ：

```
r = requests.get('https://github.com', timeout=None)
```

## 总结

本文为大家讲述了几个 Requests 的高级特性，通过掌握这些特性，我们就基本上掌握了 Requests 的常用功能，也可以运用 Requests 去解决实际问题了。我们的 Requests 介绍也就告一段落了，剩下的靠大家去实践出真知了。

> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)