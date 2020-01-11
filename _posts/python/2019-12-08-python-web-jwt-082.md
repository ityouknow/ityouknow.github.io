---
layout: post
title:  第82天： JWT 简介
category: python
copyright: python
---

by 太阳雪

在之前的课程中,介绍过 Flask-Login 框架，它是基于 Session 和 Cookie 技术来实现用户授权和验证的，不过 Session 有很多的局限性，这一节介绍一种基于 token 的验证方式 —— JWT (JSON Web Token)，除了对 JWT 的概念讲解之外，还有在 Flask 中简单实践

<!--more-->

## session 的局限性

基于 Session 的验证过程大体是：服务器端有一个 Session 词典，当用户验证登录后，在词典中为该用户创建一个 Session 对象，在响应（ response ）中返回一个 Session id，当用户下次请求时，携带 Session id，服务器从 Session 词典中可以恢复出 Session 对象，以完成用户的验证，在用 Session id 从恢复出认证实体。

从 Session 验证过程可以看出一些局限性：

- 服务器横向扩展很困难：因为 Session 只能存活在一个服务实例中，将用户请求引导到其他服务器，将丢掉用户的登录状态
- 携带信息量少，恢复会话信息比较耗时：Session 认证后，客户端得到 Session ID, 服务器无法从 Session ID 中得到更多信息，需要从数据库、文件系统或缓存中取得用户信息，比较耗时
- 没有统一标准：Session 由各个服务器框架自己实现，没有统一标准，存在应用扩展困难的问题，特别加密方式，五花八门，有很大的安全隐患

## token 简介

为了解决 Session 的问题，有了 token 的验证方式。

token 可以理解成票据，或者凭证，当用户得到服务器的认证后，由服务器颁发，在之后的请求时携带，免去频繁登录。

token 不同于 Session 的地方：

- 可以独立于具体的服务器框架生成和校验
- 可以携带更多的信息，避免对持久层的查询操作
- 基于标准的算法可以由不同的节点完成验证

为了利用好 token 的验证机制，IEIT (互联网工程任务组)，制定了基于 JSON 数据结构的网络认证方式 JWA（JSON Web Algorithms），还针对不同应用场景提出了具体协议，如 JWS、JWE、JWK 等，他们可以统称为 JWT，即 Javascript Web Token。

## 理解 JWA

JWA 的全称是 JSON Web Algorithms

JSON 是 Javascript 的语言的文本对象表示法，是一种独立语言环境的数据结构表示，可以用网络数据传输，在前面 RESTful 章节中，对 API 调用的返回数据格式就是 JSON。

Algorithms 本义是算法的意思，这里特指加密算法，也就是用 JSON 表示的数据，经过加密后在在服务器端和客户段之间传输。

有了数据结构和加密算法的基础，根据不同的应用场景，定义出了具体实现：

- JWS（JSON Web Signature）对数据进行签名的，用于防止数据被篡改，传输不敏感数据的情况
- JWE（JSON Web Encryption）对数据做了加密的，用于传输敏感数据，具有更好的安全性
- JWK（JSON Web Key）是通过密钥对数据进行加密的方法，规定了相应的加密算法

JWT（JSON Web Token）上面 JWS、JWE 和 JWK 的总称。

## JWT 简介

JWT Wiki 上的定义是:
> JSON Web Token is an Internet standard for creating JSON-based access tokens that assert some number of claims.

大致意思是，JWT 是用基于 JSON 数据结构的生成包含了一些权限声明的网络访问凭证的网络标准

### 数据结构

JWT 由 `Header`、`Payload` 和 `Signature`，三部分组成，像这样的形式：

```python
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJBdXRobGliIiwic3ViIjoiMTIzIiwibmFtZSI6ImJvYiJ9.
cBo6e7Uss5__16mlqZECjHJSKJDdyisevDP5cUGvJms
```

> 换行符只是为了展示用，实际 token 中不包括换行符

#### Header

用于指定采用的加密算法，以及 JWT 采用的形式类型，例如：

```json
{
    "alg" : "HS256",
    "typ" : "JWT"
}
```

- `alg` 指定前面所用的算法，默认为 HmacSHA256 简写为 HS256，还有 HS384、RS256 等
- `typ` 是指令牌的类型，JWT 令牌的类型为 `JWT`

#### Payload

用于携带一些信息，例如用户名，过期时间 等等，例如:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

JWT 标准定义了 7 个字段：

|字段|说明|
|:-----|:----|
|iss|(issuer)：签发人|
|exp|(expiration time)：过期时间|
|sub|(subject)：主题|
|aud|(audience)：受众|
|nbf|(Not Before)：生效时间|
|iat|(Issued At)：签发时间|
|jti|(JWT ID)：编号|

这些字段有实现这自由选取，也可以加入其他自定义字段

#### Signature

首先，需要指定一个密钥（secret）。**密钥很重要，需要严格保密**

然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名:

```js
HMACSHA256(
  base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
  secret
)
```

即先将 `header` 和 `payload` 分别做 base64url 编码，
然后用 `.` 将他们连接成一个字符串，用加密算法，使用密钥 `secret`， 得到的加密结果就算签名

> Base64URL 编码字符集是 Base64 字符集的子集  
>`=` 被省略、`+` 替换成 `-`，`/` 替换成 `_`  
> 因为 token 可能通过 URL 进行传输，而 `=`、`+`、`/` 在 URL 中有特殊含义

### 验证

当客户端发送请求时将 token 送到服务器端，可以用和签名同样的方式，重新计算一次签名，如果和客户端送过来的签名一致，说明 token 没有被篡改，如果不一致，说明 token 已被篡改，不安全了。

由此可见，**用于做签名的密钥 secret 很重要，一旦泄漏，将无法鉴别 token 的真伪**

## JWT 应用

关于 Python 的 JWT 实现不止一个，不同的库，不同的实现方式层出不穷，今天要讲解的是 Python 的 Authlib 库，它是一个大而全的 Python Web 验证库支持多种 Python 框架

### Authlib 的 JWT

Authlib 是构建 OAuth 和 OpenID 安全连接服务器的终极 Python 库，包括了 JWS, JWE, JWK, JWA, JWT

Authlib 功能强大而丰富，今天我们只了解他的 JWT 部分，之后在介绍基于第三方认证的 OAuth 技术时还会进一步讲解

### 安装

使用 pip 安装

```bash
pip install Authlib
```

如果一切正常，可以导入 Authlib 模板，例如，引入 jwt :

```python
>>> from authlib.jose import jwt
>>>
```

### 小试牛刀

JWT 是服务器端的机制，所以可以在命令行中做测试

#### 生成 token

```python
>>> from authlib.jose import jwt
>>> header = {'alg': 'HS256'}
>>> payload = {'iss': 'Authlib', 'sub': '123', 'name': 'bob'}
>>> secret = '123abc.'
>>> token = jwt.encode(header, payload, secret)
>>> print(token)
b'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpc3MiOiJBdXRobGliIiwic3ViIjoiMTIzIiwibmFtZSI6ImJvYiJ9.
cBo6e7Uss5__16mlqZECjHJSKJDdyisevDP5cUGvJms'
```

- 导入 jwt 模块
- 定义 `header`，并且设置签名算法为 `HS256`
- 定义 `payload`，作为传输信息
- 定义 `secret`，注意这里只是方便演示，实际项目中最好是随机生成，并妥善保存
- 使用 jwt 的 `encode` 方法，生成 token，`encode` 方法一次性实现了所有关于 JWT 协议的定义
- 打印出 token，可见，被 `.` 分隔为三部分，前两部分是 `header` 和 `payload` 的 Base64Url 编码，最后一部分是 签名

#### 解码 token

接上面的环境：

```python
>>> claims = jwt.decode(token, secret)
>>> print(claims)
{'iss': 'Authlib', 'sub': '123', 'name': 'bob'}
>>> print(claims.header)
{'alg': 'HS256', 'typ': 'JWT'}
>>> claims.validate()
>>>
```

- 用 jwt 模块的 `decode` 方法，利用 `secret` 对 `token` 进行解码，如果签名正确，就会的到解码内容，解码对象是 `authlib.jose.JWTClaims` 类的实例
- 打印出解码内容，可以看到和生成 token 时的 `payload` 内容一致
- 打印出 `header`，可以看到 `typ` 为 `JWT`，即使用默认值
- `validate` 方法用于检验 token 的有效性，比如：是否过期、主题是否一致，是否每到生效时间等等，也可以争对每种情况单独做验证，例如 `validate_exp` 可用检验是否过期

虽然 JWT 理论很繁琐，但 Authlib 库提供了简洁的方法，让开发应用变得更高效

#### 与客户端交互

JWT 之所有流行，有个重要原因时可以支持多种客户端，例如 浏览器和 app，JWT 标准规定，一般情况下，客户端需要将 token 放在 Http 请求的 Header 中的 Authorization 字段中，据个例子：

```http
GET /resource HTTP/1.1
     Host: server.example.com
     Authorization: Bearer mF_9.B5f-4.1JqM
```

- 用 GET 方式请求 `/resource` ，在 Header 中添加了 `Authorization` 字段

- 不能直接将 token 作为 `Authorization` 的值，必须有类型声明，这里是 `Bearer`

> `Bearer` 表示这个 token 是有认证服务器生成的，用来做身份识别的，除此之外，IEIT 还定义了其他 认证类型，如 `Bisic`, `Digest`，可以简单理解成 `Bearer` 就是 JWT 的认证类型

除了通过 Http Header 类携带 token 之外，还可以通过 POST 请求主体，以及 URL 中的 querystring 来向服务器发送 token，这两种情况下，需要使用 access_token 字段来表示 token

> JWT 标准建议使用 Header 方式，除非 Header 无法使用时才考虑其他方式

## Flask JWT

Authlib 主要的用途在打造一个 OAuth 应用，对于单独做 JWT 的实践有些麻烦，因此我们用 flask-jwt 框架，做 JWT 的实践。

flask-jwt 和之前讲述的 flask-login 用法很像，是基于 JWT 的认证的框架，提供和很多方便实践的特性

### 安装 flask-jwt

```bash
pip install Flask-JWT
```

### 创建应用

为了简单，将所有代码放在 app.py 中:

```python
from flask import Flask
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

# User 类，用于模拟用户实体
class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

# User 实体集合，用于模拟用户对象的缓存
users = [
    User(1, 'user1', 'abcxyz'),
    User(2, 'user2', 'abcxyz'),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}

# 获取认证的回调函数，从 request 中得到登录凭证，返回凭证所代表的 用户实体
def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user

# 通过 token 获得认证主体的回调函数
def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret'

jwt = JWT(app, authenticate, identity)  # 用 JWT 初始化应用

@app.route('/protected', methods= ["GET", "POST"])  # 定义一个 endpoint
@jwt_required()  # 声明需要 token 才能访问
def protected():
    return '%s' % current_identity  # 验证通过返回 认证主体

if __name__ == '__main__':
    app.run()
```

运行:

```bash
$ python app.py
 * Serving Flask app "app" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 566-326-511
```

### 获取 access_token

flask-jwt 默认的获取 token 的路由是 `/auth`，请求方式是 POST，用 JSON 传送用户名密码给服务器，例如:

```bash
$ curl -X POST -H "Content-Type: application/json" localhost:5000/auth -d '{"username":"user1","password":"abcxyz"}'
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
  eyJleHAiOjE...<省略>...VudGl0eSI6MX0.
  M-shnDPAVdu...<省略>...LaH1EMIbrWjPto"
}
```

如果登录凭证正确，则返回 access_token，可以看到被 `.` 分隔成三部分，即 JWT 的结构

### 使用 access_token

flask-jwt 默认通过 Header 传送 token，为了和 OAuth 生成的 JWT 做区分，默认使用 `JWT` 作为 token 的类型，例如，用上面生成的 JWT 请求 `/protected`：

```bash
curl -H "Authorization: jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE...<省略>...VudGl0eSI6MX0.M-shnDPAVdu...<省略>...LaH1EMIbrWjPto" localhost:5000/protected
User(id='1')
```

如果 token 有效，则返回 token 对应的认证实体，这个例子中打印出了 user 实体

## 总结

本节课程讲解了基于 token 验证的 JWT，使用 Authlib 库对 JWT 做了实践练习，期望能帮助您更好的理解 JWT，最后通过 flask-jwt 模块，实践了 JWT 的验证方式，和使用方式。在后续的课程中还会对目前流行的第三方认证框架 OAuth 做介绍，敬请期待。

> 示例代码：[Python-100-days-day093](https://github.com/JustDoPython/python-100-day/tree/master/day-093)

参考

- [https://tools.ietf.org/html/rfc7515](https://tools.ietf.org/html/rfc7515)
- [https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
- [https://docs.authlib.org/en/stable/jose/jwt.html](https://docs.authlib.org/en/stable/jose/jwt.html)
- [https://en.wikipedia.org/wiki/JSON_Web_Token](https://en.wikipedia.org/wiki/JSON_Web_Token)
- [https://swagger.io/docs/specification/authentication/bearer-authentication/](https://swagger.io/docs/specification/authentication/bearer-authentication/)
