---
layout: post
title:  第76天：Scrapy 模拟登陆
category: python
copyright: python
---

by 闲欢

想爬取网站数据？先登录网站！对于大多数大型网站来说，想要爬取他们的数据，第一道门槛就是登录网站。下面请跟随我的步伐来学习如何模拟登陆网站。
<!--more-->

## 为什么进行模拟登陆？

互联网上的网站分两种：需要登录和不需要登录。（这是一句废话！）

那么，对于不需要登录的网站，我们直接获取数据即可，简单省事。而对于需要登录才可以查看数据或者不登录只能查看一部分数据的网站来说，我们只好乖乖地登录网站了。（除非你直接黑进人家数据库，黑客操作请慎用！）

所以，对于需要登录的网站，我们需要模拟一下登录，一方面为了获取登陆之后页面的信息和数据，另一方面为了拿到登录之后的 cookie ，以便下次请求时使用。


## 模拟登陆的思路

一提到模拟登陆，大家的第一反应肯定是：切！那还不简单？打开浏览器，输入网址，找到用户名密码框，输入用户名和密码，然后点击登陆就完事！

这种方式没毛病，我们的 selenium 模拟登陆就是这么操作的。

除此之外呢，我们的 Requests 还可以直接携带已经登陆过的 cookies 进行请求，相当于绕过了登陆。

我们也可以利用 Requests 发送 post 请求，将网站登录需要的信息附带到 post 请求中进行登录。

以上就是我们常见的三种模拟登陆网站的思路，那么我们的 Scrapy 也使用了后两种方式，毕竟第一种只是 selenium 特有的方式。

Scrapy 模拟登陆的思路：

> 1、直接携带已经登陆过的 cookies 进行请求  
2、将网站登录需要的信息附带到 post 请求中进行登录

## 模拟登陆实例

### 携带 cookies 模拟登陆
每种登陆方式都有它的优缺点以及使用场景，我们来看看携带 cookies 登陆的应用场景：

> 1、cookie 过期时间很长，我们可以登录一次之后不用担心登录过期问题，常见于一些不规范的网站。  
2、我们能在 cookie 过期之前把我们需要的所有数据拿到。  
3、我们可以配合其他程序使用，比如使用 selenium 把登录之后的 cookie 获取保存到本地，然后在 Scrapy 发送请求之前先读取本地 cookie 。

下面我们通过模拟登录被我们遗忘已久的人人网来讲述这种模拟登陆方式。

我们首先创建一个 Scrapy 项目：

```
> scrapy startproject login
```

为了爬取顺利，请先将 settings 里面的 robots 协议设置为 False ：

```
ROBOTSTXT_OBEY = False
```

接着，我们创建一个爬虫：

```
> scrapy genspider renren renren.com
```
我们打开 spiders 目录下的 renren.py ，代码如下：

```
# -*- coding: utf-8 -*-
import scrapy


class RenrenSpider(scrapy.Spider):
    name = 'renren'
    allowed_domains = ['renren.com']
    start_urls = ['http://renren.com/']

    def parse(self, response):
        pass

```

我们知道，`start_urls` 存的是我们需要爬取的第一个网页地址，这是我们爬数据的初始网页，假设我需要爬取人人网的个人中心页的数据，那么我登录人人网后，进入到个人中心页，网址是：`http://www.renren.com/972990680/profile` ，如果我直接将这个网址放到 `start_urls`  里面，然后我们直接请求，大家想一下，可不可以成功？

不可以，对吧！因为我们还没有登录，根本看不到个人中心页。

那么我们的登录代码加到哪里呢？

我们能确定的是我们必须在框架请求 `start_urls` 中的网页之前登录。

我们进入 Spider 类的源码，找到下面这一段代码：

```
def start_requests(self):
        cls = self.__class__
        if method_is_overridden(cls, Spider, 'make_requests_from_url'):
            warnings.warn(
                "Spider.make_requests_from_url method is deprecated; it "
                "won't be called in future Scrapy releases. Please "
                "override Spider.start_requests method instead (see %s.%s)." % (
                    cls.__module__, cls.__name__
                ),
            )
            for url in self.start_urls:
                yield self.make_requests_from_url(url)
        else:
            for url in self.start_urls:
                yield Request(url, dont_filter=True)

    def make_requests_from_url(self, url):
        """ This method is deprecated. """
        return Request(url, dont_filter=True)

```

我们从这段源码中可以看到，这个方法从 `start_urls` 中获取 URL ，然后构造一个 Request 对象来请求。既然这样，我们就可以重写 `start_requests` 方法来做一些事情，也就是在构造 `Request` 对象的时候把 cookies 信息加进去。

重写之后的 `start_requests` 方法如下：

```
# -*- coding: utf-8 -*-
import scrapy
import re

class RenrenSpider(scrapy.Spider):
    name = 'renren'
    allowed_domains = ['renren.com']
    # 个人中心页网址
    start_urls = ['http://www.renren.com/972990680/profile']

    def start_requests(self):
        # 登录之后用 chrome 的 debug 工具从请求中获取的 cookies
        cookiesstr = "anonymid=k3miegqc-hho317; depovince=ZGQT; _r01_=1; JSESSIONID=abcDdtGp7yEtG91r_U-6w; ick_login=d2631ff6-7b2d-4638-a2f5-c3a3f46b1595; ick=5499cd3f-c7a3-44ac-9146-60ac04440cb7; t=d1b681e8b5568a8f6140890d4f05c30f0; societyguester=d1b681e8b5568a8f6140890d4f05c30f0; id=972990680; xnsid=404266eb; XNESSESSIONID=62de8f52d318; jebecookies=4205498d-d0f7-4757-acd3-416f7aa0ae98|||||; ver=7.0; loginfrom=null; jebe_key=8800dc4d-e013-472b-a6aa-552ebfc11486%7Cb1a400326a5d6b2877f8c884e4fe9832%7C1575175011619%7C1%7C1575175011639; jebe_key=8800dc4d-e013-472b-a6aa-552ebfc11486%7Cb1a400326a5d6b2877f8c884e4fe9832%7C1575175011619%7C1%7C1575175011641; wp_fold=0"
        cookies = {i.split("=")[0]:i.split("=")[1] for i in cookiesstr.split("; ")}

        # 携带 cookies 的 Request 请求
        yield scrapy.Request(
            self.start_urls[0],
            callback=self.parse,
            cookies=cookies
        )

    def parse(self, response):
        # 从个人中心页查找关键词"闲欢"并打印
        print(re.findall("闲欢", response.body.decode()))
```

我先用账号正确登录人人网，登录之后用 chrome 的 debug 工具从请求中获取一个请求的 cookies ，然后在 `Request` 对象中加入这个 cookies 。接着我在 `parse` 方法中查找网页中的“闲欢”关键词并打印输出。

我们运行一下这个爬虫：

```
>scrapy crawl renren
```

在运行日志中我们可以看到下面这几行：

```
2019-12-01 13:06:55 [scrapy.core.engine] DEBUG: Crawled (200) <GET http://www.renren.com/972990680/profile?v=info_timeline> (referer: http://www.renren.com/972990680/profile)
['闲欢', '闲欢', '闲欢', '闲欢', '闲欢', '闲欢', '闲欢']
2019-12-01 13:06:55 [scrapy.core.engine] INFO: Closing spider (finished)
```
我们可以看到已经打印了我们需要的信息了。

我们可以在 settings 配置中加 `COOKIES_DEBUG = True` 来查看 cookies 传递的过程。

加了这个配置之后，我们可以看到日志中会出现下面的信息：

```
2019-12-01 13:06:55 [scrapy.downloadermiddlewares.cookies] DEBUG: Sending cookies to: <GET http://www.renren.com/972990680/profile?v=info_timeline>
Cookie: anonymid=k3miegqc-hho317; depovince=ZGQT; _r01_=1; JSESSIONID=abcDdtGp7yEtG91r_U-6w; ick_login=d2631ff6-7b2d-4638-a2f5-c3a3f46b1595; ick=5499cd3f-c7a3-44ac-9146-60ac04440cb7; t=d1b681e8b5568a8f6140890d4f05c30f0; societyguester=d1b681e8b5568a8f6140890d4f05c30f0; id=972990680; xnsid=404266eb; XNESSESSIONID=62de8f52d318; jebecookies=4205498d-d0f7-4757-acd3-416f7aa0ae98|||||; ver=7.0; loginfrom=null; jebe_key=8800dc4d-e013-472b-a6aa-552ebfc11486%7Cb1a400326a5d6b2877f8c884e4fe9832%7C1575175011619%7C1%7C1575175011641; wp_fold=0; JSESSIONID=abc84VF0a7DUL7JcS2-6w
```

### 发送 post 请求模拟登陆

我们通过模拟登陆 GitHub 网站为例，来讲述这种模拟登陆方式。

我们首先创建一个爬虫 github ：

```
> scrapy genspider github github.com
```

我们要用 post 请求模拟登陆，首先需要知道登陆的 URL 地址，以及登陆所需要的参数信息。我们通过 debug 工具，可以看到登陆的请求信息如下：

![](http://www.justdopython.com/assets/images/2019/python/github_login_request.png)

从请求信息中我们可以找出登陆的 URL 为：`https://github.com/session` ，登陆所需要的参数为：

```
commit: Sign in
utf8: ✓
authenticity_token: bbpX85KY36B7N6qJadpROzoEdiiMI6qQ5L7hYFdPS+zuNNFSKwbW8kAGW5ICyvNVuuY5FImLdArG47358RwhWQ==
ga_id: 101235085.1574734122
login: xxx@qq.com
password: xxx
webauthn-support: supported
webauthn-iuvpaa-support: unsupported
required_field_f0e5: 
timestamp: 1575184710948
timestamp_secret: 574aa2760765c42c07d9f0ad0bbfd9221135c3273172323d846016f43ba761db
```

这个请求的参数真是够多的，汗！

除了我们的用户名和密码，其他的都需要从登陆页面中获取，这其中还有一个 `required_field_f0e5` 参数需要注意一下，每次页面加载这个名词都不一样，可见是动态生成的，但是这个值始终传的都是空，这就为我们省去了一个参数，我们可以不穿这个参数。

其他的参数在页面的位置如下图：

![](http://www.justdopython.com/assets/images/2019/python/github_login_params.png)

我们用 xpath 来获取各个参数，代码如下（我把用户名和密码分别用 `xxx` 来代替了，大家运行的时候请把自己真实的用户名和密码写上去）：

```
# -*- coding: utf-8 -*-
import scrapy
import re

class GithubSpider(scrapy.Spider):
    name = 'github'
    allowed_domains = ['github.com']
    # 登录页面 URL
    start_urls = ['https://github.com/login']

    def parse(self, response):
        # 获取请求参数
        commit = response.xpath("//input[@name='commit']/@value").extract_first()
        utf8 = response.xpath("//input[@name='utf8']/@value").extract_first()
        authenticity_token = response.xpath("//input[@name='authenticity_token']/@value").extract_first()
        ga_id = response.xpath("//input[@name='ga_id']/@value").extract_first()
        webauthn_support = response.xpath("//input[@name='webauthn-support']/@value").extract_first()
        webauthn_iuvpaa_support = response.xpath("//input[@name='webauthn-iuvpaa-support']/@value").extract_first()
        # required_field_157f = response.xpath("//input[@name='required_field_4ed5']/@value").extract_first()
        timestamp = response.xpath("//input[@name='timestamp']/@value").extract_first()
        timestamp_secret = response.xpath("//input[@name='timestamp_secret']/@value").extract_first()

        # 构造 post 参数
        post_data = {
            "commit": commit,
            "utf8": utf8,
            "authenticity_token": authenticity_token,
            "ga_id": ga_id,
            "login": "xxx@qq.com",
            "password": "xxx",
            "webauthn-support": webauthn_support,
            "webauthn-iuvpaa-support": webauthn_iuvpaa_support,
            # "required_field_4ed5": required_field_4ed5,
            "timestamp": timestamp,
            "timestamp_secret": timestamp_secret
        }

        # 打印参数
        print(post_data)

        # 发送 post 请求
        yield scrapy.FormRequest(
            "https://github.com/session", # 登录请求方法
            formdata=post_data,
            callback=self.after_login
        )

    # 登录成功之后操作
    def after_login(self, response):
        # 找到页面上的 Issues 字段并打印
        print(re.findall("Issues", response.body.decode()))
```

我们使用 `FormRequest` 方法发送 post 请求，运行爬虫之后，报错了，我们来看下报错信息：

```
2019-12-01 15:14:47 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://github.com/login> (referer: None)
{'commit': 'Sign in', 'utf8': '✓', 'authenticity_token': '3P4EVfXq3WvBM8fvWge7FfmRd0ORFlS6xGcz5mR5A00XnMe7GhFaMKQ8y024Hyy5r/RFS9ZErUDr1YwhDpBxlQ==', 'ga_id': None, 'login': '965639190@qq.com', 'password': '54ithero', 'webauthn-support': 'unknown', 'webauthn-iuvpaa-support': 'unknown', 'timestamp': '1575184487447', 'timestamp_secret': '6a8b589266e21888a4635ab0560304d53e7e8667d5da37933844acd7bee3cd19'}
2019-12-01 15:14:47 [scrapy.core.scraper] ERROR: Spider error processing <GET https://github.com/login> (referer: None)
Traceback (most recent call last):
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/utils/defer.py", line 102, in iter_errback
    yield next(it)
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/core/spidermw.py", line 84, in evaluate_iterable
    for r in iterable:
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/spidermiddlewares/offsite.py", line 29, in process_spider_output
    for x in result:
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/core/spidermw.py", line 84, in evaluate_iterable
    for r in iterable:
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/spidermiddlewares/referer.py", line 339, in <genexpr>
    return (_set_referer(r) for r in result or ())
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/core/spidermw.py", line 84, in evaluate_iterable
    for r in iterable:
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/spidermiddlewares/urllength.py", line 37, in <genexpr>
    return (r for r in result or () if _filter(r))
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/core/spidermw.py", line 84, in evaluate_iterable
    for r in iterable:
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/spidermiddlewares/depth.py", line 58, in <genexpr>
    return (r for r in result or () if _filter(r))
  File "/Users/cxhuan/Documents/python_workspace/scrapy_projects/login/login/spiders/github.py", line 40, in parse
    callback=self.after_login
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/http/request/form.py", line 32, in __init__
    querystr = _urlencode(items, self.encoding)
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/http/request/form.py", line 73, in _urlencode
    for k, vs in seq
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/http/request/form.py", line 74, in <listcomp>
    for v in (vs if is_listlike(vs) else [vs])]
  File "/Applications/anaconda3/lib/python3.7/site-packages/scrapy/utils/python.py", line 107, in to_bytes
    'object, got %s' % type(text).__name__)
TypeError: to_bytes must receive a unicode, str or bytes object, got NoneType
2019-12-01 15:14:47 [scrapy.core.engine] INFO: Closing spider (finished)
```

看这个报错信息，好像是参数值中有一个参数取到 `None` 导致的，我们看下打印的参数信息中，发现 `ga_id` 是 `None` ，我们再修改一下，当 `ga_id` 为 `None` 时，我们传空字符串试试。

修改代码如下：

```
ga_id = response.xpath("//input[@name='ga_id']/@value").extract_first()
if ga_id is None:
    ga_id = ""
```

再次运行爬虫，这次我们来看看结果：

```
Set-Cookie: _gh_sess=QmtQRjB4UDNUeHdkcnE4TUxGbVRDcG9xMXFxclA1SDM3WVhqbFF5U0wwVFp0aGV1UWxYRWFSaXVrZEl0RnVjTzFhM1RrdUVabDhqQldTK3k3TEd3KzNXSzgvRXlVZncvdnpURVVNYmtON0IrcGw1SXF6Nnl0VTVDM2dVVGlsN01pWXNUeU5XQi9MbTdZU0lTREpEMllVcTBmVmV2b210Sm5Sbnc0N2d5aVErbjVDU2JCQnA5SkRsbDZtSzVlamxBbjdvWDBYaWlpcVR4Q2NvY3hwVUIyZz09LS1lMUlBcTlvU0F0K25UQ3loNHFOZExnPT0%3D--8764e6d2279a0e6960577a66864e6018ef213b56; path=/; secure; HttpOnly

2019-12-01 15:25:18 [scrapy.core.engine] DEBUG: Crawled (200) <GET https://github.com/> (referer: https://github.com/login)
['Issues', 'Issues']
2019-12-01 15:25:18 [scrapy.core.engine] INFO: Closing spider (finished)
```

我们可以看到已经打印了我们需要的信息，登录成功。


Scrapy 对于表单请求，`FormRequest` 还提供了另外一个方法 `from_response` 来自动获取页面中的表单，我们只需要传入用户名和密码就可以发送请求。

我们来看下这个方法的源码：

```
@classmethod
    def from_response(cls, response, formname=None, formid=None, formnumber=0, formdata=None,
                      clickdata=None, dont_click=False, formxpath=None, formcss=None, **kwargs):

        kwargs.setdefault('encoding', response.encoding)

        if formcss is not None:
            from parsel.csstranslator import HTMLTranslator
            formxpath = HTMLTranslator().css_to_xpath(formcss)

        form = _get_form(response, formname, formid, formnumber, formxpath)
        formdata = _get_inputs(form, formdata, dont_click, clickdata, response)
        url = _get_form_url(form, kwargs.pop('url', None))

        method = kwargs.pop('method', form.method)
        if method is not None:
            method = method.upper()
            if method not in cls.valid_form_methods:
                method = 'GET'

        return cls(url=url, method=method, formdata=formdata, **kwargs)
```

我们可以看到这个方法的参数有好多，都是有关 form 定位的信息。如果登录网页中只有一个表单， Scrapy 可以很容易定位，但是如果网页中含有多个表单呢？这个时候我们就需要通过这些参数来告诉 Scrapy 哪个才是登录的表单。

当然，这个方法的前提是需要我们网页的 form 表单的 action 里面包含了提交请求的 url 地址。

在 github 这个例子中，我们的登录页面只有一个登录的表单，因此我们只需要传入用户名和密码就可以了。代码如下：

```
# -*- coding: utf-8 -*-
import scrapy
import re

class Github2Spider(scrapy.Spider):
    name = 'github2'
    allowed_domains = ['github.com']
    start_urls = ['http://github.com/login']

    def parse(self, response):
        yield scrapy.FormRequest.from_response(
            response, # 自动从response中寻找form表单
            formdata={"login": "xxx@qq.com", "password": "xxx"},
            callback=self.after_login
        )
    # 登录成功之后操作
    def after_login(self, response):
        # 找到页面上的 Issues 字段并打印
        print(re.findall("Issues", response.body.decode()))
```

运行爬虫后，我们可以看到和之前一样的结果。

这种请求方式是不是简单了许多？不需要我们费力去找各种请求参数，有没有觉得 Amazing ？


## 总结

本文向大家介绍了 Scrapy 模拟登陆网站的几种方法，大家可以自己运用文中的方法去实践一下。当然，这里没有涉及到有验证码的情况，验证码是一个复杂并且难度很高的专题，以后有时间再给大家介绍。


> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)