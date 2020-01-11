---
layout: post
title:  第102天： Python异步之aiohttp
category: python
copyright: python
---

by 某某白米饭

## aiohttp

什么是 aiohttp？一个异步的 HTTP 客户端\服务端框架，基于 asyncio 的异步模块。可用于实现异步爬虫，更快于 requests 的同步爬虫。
<!--more-->

### 安装

```
pip install aiohttp
```

### aiohttp 和 requests

#### requests 版爬虫

requests 同步方式连续 30 次简单爬取 `http://httpbin.org` 网站

```python
import requests
from datetime import datetime


def fetch(url):
    r = requests.get(url)
    print(r.text)

start = datetime.now()

for i in range(30):
    fetch('http://httpbin.org/get')

end = datetime.now()

print("requests版爬虫花费时间为：")
print(end - start)
```

示例结果

```
# 打印网站返回的内容
....
requests版爬虫花费时间为：
0:00:43.248761
```

从爬取结果可以看出，同步爬取30次网站将花费43秒左右的时间，耗时非常长。

#### aiohttp 版爬虫

使用 aiohttp 和 asyncio 异步方式简单爬取30次网站

```python
import aiohttp
import asyncio
from datetime import datetime


async def fetch(client):
    async with client.get('http://httpbin.org/get') as resp:
        assert resp.status == 200
        return await resp.text()


async def main():
    async with aiohttp.ClientSession() as client:
        html = await fetch(client)
        print(html)

loop = asyncio.get_event_loop()

tasks = []
for i in range(30):
    task = loop.create_task(main())
    tasks.append(task)

start = datetime.now()

loop.run_until_complete(main())

end = datetime.now()

print("aiohttp版爬虫花费时间为：")
print(end - start)
```

示例结果

```
# 打印网站返回的内容
....
aiohttp版爬虫花费时间为：
0:00:00.539416
```

从爬取时间可以看出，aiohttp 异步爬取网站只用了0.5秒左右的时间，比 requests 同步方式快了80倍左右，速度非常之快。

### 同一个 session

aiohttp.ClientSession() 中封装了一个 session 的连接池，并且在默认情况下支持 keepalives，官方建议在程序中使用单个 ClientSession 对象，而不是像上面示例中的那样每次连接都创建一个 ClientSession 对象，除非在程序中遇到大量的不同的服务。

将上面的示例修改为：

```python
import aiohttp
import asyncio
from datetime import datetime


async def fetch(client):
    print("打印 ClientSession 对象")
    print(client)
    async with client.get('http://httpbin.org/get') as resp:
        assert resp.status == 200
        return await resp.text()


async def main():
    async with aiohttp.ClientSession() as client:
       tasks = []
       for i in range(30):
           tasks.append(asyncio.create_task(fetch(client)))
       await asyncio.wait(tasks)

loop = asyncio.get_event_loop()

start = datetime.now()

loop.run_until_complete(main())

end = datetime.now()
print("aiohttp版爬虫花费时间为：")
print(end - start)
```

示例结果

```
# 重复30遍
打印 ClientSession 对象
<aiohttp.client.ClientSession object at 0x1094aff98>
aiohttp版爬虫花费时间为：
0:00:01.778045
```

从上面爬取的时间可以看出单个 ClientSession 对象比多个 ClientSession 对象多花了3倍时间。ClientSession 对象一直是同一个 0x1094aff98。

### 返回值

#### Json 串

在上面的示例中使用 response.text() 函数返回爬取到的内容，aiohttp 在处理 Json 返回值的时候，可以直接将字符串转换为 Json。

```python
async def fetch(client):
    async with client.get('http://httpbin.org/get') as resp:
        return await resp.json()
```

示例结果

```
{'args': {}, 'headers': {'Accept': '*/*', 'Accept-Encoding': 'gzip, deflate', 'Host': 'httpbin.org', 'User-Agent': 'Python/3.7 aiohttp/3.6.2'}, 'origin': '49.80.42.33, 49.80.42.33', 'url': 'https://httpbin.org/get'}
```

当返回的 Json 串不是一个标准的 Json 时，resp.json() 函数可以传递一个函数对json进行预处理，如：resp.json(replace(a, b))，replace()函数表示 a 替换为 b。


#### 字节流

aiohttp 使用 response.read() 函数处理字节流，使用 with open() 方式保存文件或者图片

```python
async def fetch(client):
    async with client.get('http://httpbin.org/image/png') as resp:
        return await resp.read()


async def main():
    async with aiohttp.ClientSession() as client:
        image = await fetch(client)
        with open("/Users/xxx/Desktop/image.png", 'wb') as f:
            f.write(image)
```

response.read() 函数可以传递数字参数用于读取多少个字节，如：response.read(3)读取前3个字节。

### 参数

aiohttp 可以使用3种方式在 URL 地址中传递参数

```python
async def fetch(client):
    params = [('a', 1), ('b', 2)]
    async with client.get('http://httpbin.org/get',params=params) as resp:
        return await resp.text()
```

示例URL地址

```
http://httpbin.org/get?a=1&b=2
```

```python
async def fetch(client):
    params = {"a": 1,"b": 2}
    async with client.get('http://httpbin.org/get',params=params) as resp:
        return await resp.text()
```

示例URL地址

```
http://httpbin.org/get?a=1&b=2
```

```python
async def fetch(client):
    async with client.get('http://httpbin.org/get',params='q=aiohttp+python&a=1') as resp:
        return await resp.text()
```

示例URL地址

```
http://httpbin.org/get?q=aiohttp+python&a=1
```

### 请求头

aiohttp 在自定义请求头时，类似于向 URL 传递参数的方式

```python
async def fetch(client):
    headers = {'content-type': 'application/json', 'User-Agent': 'Python/3.7 aiohttp/3.7.2'}
    async with client.get('http://httpbin.org/get',headers=headers) as resp:
        return await resp.text()
```

### COOKIES

cookies 是整个会话共用的，所以应该在初始化 ClientSession 对象时传递

```python
async def fetch(client):
    async with client.get('http://httpbin.org/get') as resp:
        return await resp.text()


async def main():
    cookies = {'cookies': 'this is cookies'}
    async with aiohttp.ClientSession(cookies=cookies) as client:
        html = await fetch(client)
        print(html)
```

### POST 方式

在前面的示例中都是以 GET 方式提交请求，下面用 POST 方式请求

```python
async def fetch(client):
    data = {'a': '1', 'b': '2'}
    async with client.post('http://httpbin.org/post', data = data) as resp:
        return await resp.text()
```

示例结果

```
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {
    "a": "1", 
    "b": "2"
  }, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Content-Length": "7", 
    "Content-Type": "application/x-www-form-urlencoded", 
    "Host": "httpbin.org", 
    "User-Agent": "Python/3.7 aiohttp/3.6.2"
  }, 
  "json": null, 
  "origin": "49.80.42.33, 49.80.42.33", 
  "url": "https://httpbin.org/post"
}

aiohttp版爬虫花费时间为：
0:00:00.514402
```

在示例结果中可以看到 form 中的内容就是模拟 POST 方式提交的内容

### 超时

在请求网站时，有时会遇到超时问题，aiohttp 中使用 timeout 参数设置，单位为秒数，aiohttp 默认超时时间为5分钟

```python
async def fetch(client):
    async with client.get('http://httpbin.org/get', timeout=60) as resp:
        return await resp.text()
```

### 总结

aiohttp 以异步的方式爬取网站耗时远小于 requests 同步方式，这里列举了一些 aiohttp 常用功能，希望对大家有所帮助。

### 代码地址


> 示例代码：[Python-100-day](https://github.com/JustDoPython/python-100-day/tree/master/day-102)