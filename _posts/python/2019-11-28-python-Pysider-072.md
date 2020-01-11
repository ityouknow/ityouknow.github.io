---
layout: post
title:  第72天： PySpider框架的使用
category: python
copyright: python
---

by 某某白米饭

## Pysider

Pysider 是一个国人用 Python 编写的、带有强大的 WebUI 的网络爬虫系统，它支持多种数据库、任务监控、项目管理、结果查看、URL去重等强大的功能。
<!-- more -->

### 安装

```python
pip3 install pysider
```

### 运行

命令行运行

```python
pyspider
```

![](http://www.justdopython.com/assets/images/2019/11/26/run1.png)

运行成功后，在浏览器地址中输入

```html
localhost:5000
```

进入 Pyspider 控制台

![](http://www.justdopython.com/assets/images/2019/11/26/webui.png)

### 从一个网站开始

选取一个新闻网站 "http://www.chinashina.com/rexinwen/" 作为学习 Pysider 的开始。

#### 创建项目

在创建表单中填写项目名和爬虫开始的 URL,点击 Create 按钮

![](http://www.justdopython.com/assets/images/2019/11/26/news_init.png)

下面是 xinwen 爬虫系统的初始化代码

![](http://www.justdopython.com/assets/images/2019/11/26/init.png)

我们来看一下，爬虫系统的入口函数

```python
def on_start(self):
    self.crawl('http://www.chinashina.com/rexinwen/',callback=self.index_page)
```

1. on_start() 函数爬虫系统的入口函数
2. crawl() 函数 Pyspider 抓取指定页面，然后使用 callback 函数对结果进行解析
3. @every(minutes=24 * 60) 装饰器，表示每过多久运行一次，是一个计划任务

点击 左窗口中的 run 按钮，会在 follows 安装上看到一个带红色的 1 ，这个表示抓取到了一个URL，点击它。这时会切换到 follows 面板，点击绿色播放按钮

![](http://www.justdopython.com/assets/images/2019/11/26/run.png)

#### 翻页和列表页面处理

在点击绿色播放按钮后，会发现 Pysider 已经抓取到了好多个 URL 地址，其中的一些地址已经做了去重复处理。在这些 URL 地址中大多数是不需要的，所以我们需要进一步的对这些 URL 过滤。

对页面的分析发现，翻页的 URL 都是带有 list_32_x.html 的地址。

```html
<div class="pagination-wrapper"> 
    <div class="pagination"> 
        <li><a>首页</a></li>
        <li class="thisclass"><a>1</a></li>
        <li><a href="list_32_2.html">2</a></li>
        <li><a href="list_32_3.html">3</a></li>
        ...
        <li><a href="list_32_7.html">7</a></li>
        <li><a href="list_32_2.html">下一页</a></li>
        <li><a href="list_32_7.html">末页</a></li>
        <li><span class="pageinfo">共 <strong>7</strong>页<strong>137</strong>条</span></li>
    </div> 
</div>
```

在 index_page() 函数中使用正则表达式，提取翻页URL，并编写一个 list_page() 函数解析列表页面的 URL，列表页面都是带有 plus/view.php?aid=x.html 的页面

```python
import re

@config(age=10 * 24 * 60 * 60)
def index_page(self, response):
    for each in response.doc('a[href^="http"]').items():
        if re.match(".*list_32_\d+\.html", each.attr.href, re.U):
            self.crawl(each.attr.href, callback=self.list_page)
    # 将第一页的抓取
    self.crawl(" http://www.chinashina.com/rexinwen/list_32_1.html",callback=self.list_page)

@config(age=10 * 24 * 60 * 60)       
def list_page(self, response):
    for each in response.doc('a[href^="http"]').items():
        if re.match(".*plus/view.php\?aid=\d+\.html", each.attr.href, re.U):
            self.crawl(each.attr.href, callback=self.detail_page)
```

1. age 表示在10天之内这些页面不需要再次抓取

#### 详情页处理

在详情页中需要提取新闻的标题、正文、来源、编辑者和时间，可以使用 Pysider 的 HTML 和 CSS 选择器提取数据。
在 Pysider 的 response.doc 中 内置了 PyQuery 对象，可以像 JQuery 一样操作 Dom 元素。

左窗口切换到 WEB 页面，然后点击 enable css selector helper 按钮，此时把鼠标放到左窗口的页面上，鼠标所在的标签变成了黄色，在它的上面可以看到当前标签的路径，点击向右箭将把路径复制到光标处

![](http://www.justdopython.com/assets/images/2019/11/26/css.png)

修改 detail_page() 函数

```python
@config(priority=2)
def detail_page(self, response):
    return {
        "title": response.doc('.news_title').text(),
        "other": response.doc('html > body > .clearfix > .main_lt > div > .news_about > p').text(),
        "body": response.doc('html > body > .clearfix > .main_lt > div > .news_txt').text()
    }
```

1. priority 是优先级的意思


点击 run 按钮

![](http://www.justdopython.com/assets/images/2019/11/26/result.png)

如果觉得 Pysider 提取的元素路径并不合适，也可以使用在 Google 浏览器中审查元素，提取一个适合的元素选择器。

#### 自动抓取

在 Dashboard 页面如下操作，将自动抓取页面

1. 将 status 修改为 DEBUG 或 RUNNING
2. 按 run 按钮

下面是自动抓取的结果

![](http://www.justdopython.com/assets/images/2019/11/26/r1.png)

点击 Dashboard 界面的 Results 按钮

![](http://www.justdopython.com/assets/images/2019/11/26/r3.png)

![](http://www.justdopython.com/assets/images/2019/11/26/r2.png)

### 保存到 Mysql

#### 重写 on_result() 函数

在 Pysider 抓取的结果保存到数据库，必须重写 on_result() 函数。on_result() 函数在每个函数结束都会被调用，所以必须判断 result 参数是不是空的。

```python
from pyspider.database.mysql.crawlerdb import crawlerdb

def on_result(self,result):
    if not result:
        return
    sql = crawlerdb()
    sql.insert(result)
```

#### 自定义保存模块

crawlerdb 模块是一个把结果保存到 Mysql 数据库的自定义模块，模块存放的地址每个人的路径都不相同，我的是在 /Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/pyspider/database/mysql 下。

```python
#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import mysql.connector
import pymysql

from pyspider.result import ResultWorker


class crawlerdb:
    conn = None
    cursor = None

    def __init__(self):
        self.conn = pymysql.connect("127.0.0.1", "root", "12345678", "crawler")
        self.cursor = self.conn.cursor()


    def insert(self, _result):
        sql = "insert into info(title,body,editorial,ctime) VALUES('{}','{}','{}','{}')"
        try:
            sql = sql.format(pymysql.escape_string(_result.get('title')), pymysql.escape_string(_result.get('body')), _result.get('editorial'),_result.get('ctime'))
            self.cursor.execute(sql)
            self.conn.commit()
            return True
        except mysql.connector.Error:
            print('插入失败')
            return False
```


### 运行问题

#### async 关键字问题

```
File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/site-packages/pyspider/fetcher/tornado_fetcher.py", line 81
    def __init__(self, inqueue, outqueue, poolsize=100, proxy=None, async=True):
                                                                        ^
SyntaxError: invalid syntax
```

这个问题主要是因为在 Python3 中 async 变成了一个关键字，解决的方法就是打开 出错的文件（ tornado_fetcher.py ）将出错的 async 改为其他变量名

### 总结

在学会了 Pysider 框架后，在抓取页面中，主要的工作将放在在解析页面上，不需要关注抓取任务的定时计划和 URL 去重，超级方便、快捷，是 Python 人必学的框架之一。

## 代码地址

> 示例代码：[Python-100-days-day072](https://github.com/JustDoPython/python-100-day/tree/master/day-072)
