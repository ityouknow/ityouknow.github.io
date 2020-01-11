---
layout: post
title:  第88天： OAuth2.0 客户端实战
category: python
copyright: python
---

by 太阳雪

上一次课程，我们了解了 OAuth 认证是怎么回事，以及了解了四种认证方式，今天我们将以 Github 为例，了解一下如何用 Flask 第三方应用

<!--more-->

在之前的介绍 JWT 的时候，了解过 Authlib 库，Authlib 是集 JWT、OAuth1.0、OAuth2.0 于一身的终极 Python 认证框架，支持多种 Web 框架，例如 Django、requests、httpx，以及今天实践用的 Flask，还对 Django 和 Flask 做了专门的集成，让开发更简单

> Github OAuth 应用时支持 OAuth2.0 协议的，用授权码的模式颁发 `access_token`，即 授权码模式（authorization code）

## 注册 github 第三方应用

首先需要去 github 上注册我们的应用，[注册地址: https://github.com/settings/applications/new](https://github.com/settings/applications/new)

![github 应用申请注册](http://www.justdopython.com/assets/images/2019/python/python_web_oauth_01.png)

- Homepage URL 应用的主地址，这里可以填写 Flask 本地的默认地址
- Authorization callback URL: 认证完成后跳转的地址，可以根据项目具体情况填写

> 从申请配置上可以看到，github 支持任意的域名，不需要做额外的认证和证明，这也是选择 github 做演示的原因，如果要用 微信 作为认证，需要申请开通开发者资质，比较麻烦，不过开发方式和都是类似的

申请成功后，可以看到自己创建的应用配置页面:

![github 应用注册成功](http://www.justdopython.com/assets/images/2019/python/python_web_oauth_02.png)

从上图红色框的位置，可以得到 `client id`, 和 `client secret`，**必须妥善保管**

## 创建第三方应用

注册成功第三方应用，就可以来开发客户端了

### 安装 Authlib

使用 pip 安装

```bash
pip install Authlib
```

如果一切正常，可以导入 Authlib 模板，例如，引入 jwt :

```python
>>> from authlib.integrations.flask_client import OAuth
>>>
```

### 创建 Web 应用

创建一个 Flask 应用:

```python
from flask import Flask, session, render_template, url_for, redirect
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = '!secret'

oauth = OAuth(app)
```

- 引入可能用到的 Flask 框架模块和方法
- 引入 Authlib 的 Flask 客户端模块
- 创建 Flask 应用 app
- 设置 应用的 `secret_key`, 用于做跳转认证页的校验，是必须的，如果缺失，引导认证页会失败
- 用 Flask 应用实例化 OAuth

### 认证服务器配置

客户端需要做的是引导用户到认证页面，并且能能向认证服务器请求 access_token, OAuth 实例可以从应用的配置中读取

为了简便，将配置一同写入代码中，实际项目中建议使用单独的配置文件（后面 Flask 项目工程中会详细说明）:

```python
app.config["GITHUB_CLIENT_ID"] = '55ffa..<省略>...9e1fb3a'
app.config["GITHUB_CLIENT_SECRET"] = '692317a38d0..<省略>...d63f2d9f8c'
app.config["GITHUB_AUTHORIZE_URL"] = 'https://github.com/login/oauth/authorize'
app.config["GITHUB_AUTHORIZE_PARAMS"] = {
    'scope': 'user repo'
}
app.config["GITHUB_ACCESS_TOKEN_URL"] = 'https://github.com/login/oauth/access_token'
app.config["GITHUB_API_BASE_URL"] = 'https://api.github.com'
```

- 同一个客户端应用，连接多种认证服务器，配置时，用前缀来区分不同的认证服务器，前缀随意，只要同一个认证配置统一就行，例如这里用的前缀是 `GITHUB`
- `_CLIENT_ID`、`_CLIENT_SECRET`：注册应用成功后，由认证服务器提供
- `_AUTHORIZE_URL`：用户认证页面 URL，会在认证服务器文档中找到
- `_AUTHORIZE_PARAMS`：认证时提供的额外参数，通常用于指定授权范围，具体范围和格式参考认证服务器文档
- `_ACCESS_TOKEN_URL`：获取 `access_token` 的 URL
- `_API_BASE_URL`：资源服务器 api 根路径，具体查看资源服务器 api 文档

完成配置后，创建`认证服务器实例`:

```python
github = oauth.register('github')
```

- `register` 方法会根据配置创建认证服务器实例，参数同配置中的前缀，大小写随意
- 返回`认证服务器的实例`，也可以用 `oauth.github` 方式来获取`认证服务器实例`

### 设置 接入点(endpoint)

#### 登录

```python
@app.route('/login')
def login():
    redirect_uri = url_for('auth', _external=True)
    return github.authorize_redirect(redirect_uri)
```

- 用 `url_for` 函数得到 `auth` 视图函数的绝对访问路径，参数 `_external` 为 `True` 返回绝对路径
- `authorize_redirect` 方法接收一个 URL 作为参数，即获得授权后的回调地址。**注意：跳转地址必须和注册时的完全一致**
- `authorize_redirect` 方法会合成带参数的认证页 URL，并跳转过去

#### 认证回跳

```python
@app.route('/auth/redirect')
def auth():
    token = github.authorize_access_token()
    user = github.get('user').json()
    """
     可以在此保存 token 和 用户信息，例如存入数据库
    """
    session['user'] = user
    return redirect('/')
```

- 设置视图函数的接入点必须和注册时的回调保持一致，Flask 的接入点建议使用 `/` 结尾，能同时兼容不以 `/` 结尾请求，但是这里需要与注册时的保持一致，否则可能无法跳转到认证页
- `authorize_access_token` 方法用于从认证服务器获取 `access_token`，分装了交互细节
- `get` 方法用户获取用户的授权资源。参数为资源服务器 api 的名称，例如`user`、`user/repos`
- 获得用户基本信息后，存入 `session`, 以便下次访问时获得
- 最后跳转到首页上

> 实际应用中，可以在第一次获取用户信息后，引导用户用手机号或者邮箱注册，以便之后登录

#### 首页

```python
@app.route('/')
def homepage():
    user = session.get('user')
    return render_template('home.html', user=user)
```

- 作为演示，首页很简单，即从 `session` 中获得 `user` 对象，将其内容显示在页面上，如果 `user` 为空，则显示登录连接
- `home.html` 是模板，具体内容参考示例代码

#### 登出

```python
@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')
```

- 登出是客户端自身的功能，和认证服务器没关系，只要 `access_token` 有效，客户端就可以从资源服务器上获取用户的信息或资源
- 登出仅将 `user` 从 `session` 中删掉，跳转到首页

### 刷新 access_token

> github OAuth app 的 `access_token` 是长期的，不需要更新，这里用 Authlib 文档中的例子作为演示

OAuth2.0 协议中的 `access_token` 可以设置有效期，过期后需要用 `refresh_token` 重新获取

Authlib 提供了基于`信号`(类似于事件) 自动更新 `access_token` 的方法，会在合适的时间点，触发信号，执行更新函数

信号机制由 `blinker` 库，`blinker` 是一个简洁的，为 Python 对象之间提供广播式的信号机制的库，必须先安装:

```bash
pip install blinker
```

就不展开 `blinker` 了，只要知道它是自动更新 `access_token` 需要依赖的库就行

```python
from authlib.integrations.flask_client import token_update

@token_update.connect_via(app)
def on_token_update(sender, name, token, refresh_token=None, access_token=None):
    if refresh_token:
        item = OAuth2Token.find(name=name, refresh_token=refresh_token)
    elif access_token:
        item = OAuth2Token.find(name=name, access_token=access_token)
    else:
        return

    # 更新 access_token
    item.access_token = token['access_token']
    item.refresh_token = token.get('refresh_token')
    item.expires_at = token['expires_at']
    item.save()
```

- 先从 `flask_client` 包中引入 `token_update` 类
- 定义更新 `access_token` 的回调函数 `on_token_update`， 通过注解 `token_update.connect_via`，注册成监听 `access_token` 更新事件的回调函数
- 回调函数的参数
  - `sender` 是发出更新了 `access_token` 的实体，即认证服务器实例
  - `name` 就是注册认证服务器的名称，即 `oauth.register` 的第一个参数
  - `token` 为获得的新 `access_token` 对象
  - `refresh_token` 和 `access_token` 之前通过认证时获得的，`access_token` 是旧的
- 回调函数逻辑部分，通过 `refresh_token` 或 `access_token` 从查找之前的 `token` 记录，找到后，将新的 `token` 信息更新到记录中，并且保存。
- `OAuth2Token` 可以理解成库表对象，用来和库表交互，维护 `token` 对象

### 小试牛刀

启动 Flask 应用

```bash
python3 app.py
```

访问 `http://localhost:5000`，如果一切正常，将看到页面上有个 `login` 连接，点击此连接，将跳转到认证页面，登录 Github（如果当前浏览器中没登录 Github 的话），将看到授权页面，类似于:

![授权页面](http://www.justdopython.com/assets/images/2019/python/python_web_oauth_03.png)

> `http://127.0.0.1:5000` 也能访问，但是必须使用 `http://localhost:5000` 来访问，即保持和注册时的首页 URL 一致

## 总结

本节课程演示了 Flask 基于 Authlib 完成简单认证客户端的示例，是对前面 OAuth 理论的一次实践，主要需要了解客户端的结构和认证流程：

- 在认证服务器上注册客户端，得到 `client_id` 和 `client_secret`
- 设置登录、认证后回调的接入点（或叫做路由）
- 管理获得的认证信息，用认证信息获取用户授权的资源
- 设置刷新 `access_token` 的逻辑

总体来说，认证客户端的实现不复杂，主要是概念比较绕，建议下载示例代码，实践一下，加深理解

## 参考

- [blinker: https://pythonhosted.org/blinker/](https://pythonhosted.org/blinker/)
- [Authlib Flask: https://docs.authlib.org/en/latest/client/flask.html](https://docs.authlib.org/en/latest/client/flask.html)
- [http://www.ruanyifeng.com/blog/2019/04/github-oauth.html](http://www.ruanyifeng.com/blog/2019/04/github-oauth.html)


> 示例代码：[Python-100-days-day105](https://github.com/JustDoPython/python-100-day/tree/master/day-105)

