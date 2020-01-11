---
layout: post
title:  第74天：Python newspaper 框架
category: python
copyright: python
---

by 程序员野客

## 1 简介

newspaper 框架是一个主要用来提取新闻内容及分析的 Python 爬虫框架，更确切的说，newspaper 是一个 Python 库，但这个库由第三方开发。

<!--more-->

newspaper 主要具有如下几个特点：

* 比较简洁

* 速度较快

* 支持多线程

* 支持多语言

GitHub 链接：https://github.com/codelucas/newspaper

安装方法：`pip3 install newspaper3k`

## 2 基本使用

### 2.1 查看支持语言

```
import newspaper

print(newspaper.languages())
```

### 2.2 获取新闻

我们以环球网为例，如下所示：

```
import newspaper

hq_paper = newspaper.build("https://tech.huanqiu.com/", language="zh", memoize_articles=False)
```

默认情况下，newspaper 缓存所有以前提取的文章，并删除它已经提取的任何文章，使用 memoize_articles 参数选择退出此功能。

### 2.3 获取文章 URL

```
>>> import newspaper

>>> hq_paper = newspaper.build("https://tech.huanqiu.com/", language="zh", memoize_articles=False)
>>> for article in hq_paper.articles:
>>>     print(article.url)

http://world.huanqiu.com/gallery/9CaKrnQhXvy
http://mil.huanqiu.com/gallery/7RFBDCOiXNC
http://world.huanqiu.com/gallery/9CaKrnQhXvz
http://world.huanqiu.com/gallery/9CaKrnQhXvw
...
```

### 2.4 获取类别

```
>>> import newspaper

>>> hq_paper = newspaper.build("https://tech.huanqiu.com/", language="zh", memoize_articles=False)
>>> for category in hq_paper.category_urls():
>>>     print(category)

http://www.huanqiu.com
http://tech.huanqiu.com
http://smart.huanqiu.com
https://tech.huanqiu.com/
```

### 2.5 获取品牌和描述

```
>>> import newspaper

>>> hq_paper = newspaper.build("https://tech.huanqiu.com/", language="zh", memoize_articles=False)
>>> print(hq_paper.brand)
>>> print(hq_paper.description)

huanqiu
环球网科技，不一样的IT视角！以“成为全球科技界的一面镜子”为出发点，向关注国际科技类资讯的网民，提供国际科技资讯的传播与服务。
```

### 2.6 下载解析

我们选取其中一篇文章为例，如下所示：

```
>>> import newspaper

>>> hq_paper = newspaper.build("https://tech.huanqiu.com/", language="zh", memoize_articles=False)
>>> article = hq_paper.articles[4]
# 下载
>>> article.download()
# 解析
article.parse()
# 获取文章标题
>>> print("title=", article.title)
# 获取文章日期
>>> print("publish_date=", article.publish_date)
# 获取文章作者
>>> print("author=", article.authors)
# 获取文章顶部图片地址
>>> print("top_iamge=", article.top_image)
# 获取文章视频链接
>>> print("movies=", article.movies)
# 获取文章摘要
>>> print("summary=", article.summary)
# 获取文章正文
>>> print("text=", article.text)

title= “美丽山”的美丽传奇
publish_date= 2019-11-15 00:00:00
...
```

### 2.7 Article 类使用

```
from newspaper import Article

article = Article('https://money.163.com/19/1130/08/EV7HD86300258105.html')
article.download()
article.parse()
print("title=", article.title)
print("author=", article.authors)
print("publish_date=", article.publish_date)
print("top_iamge=", article.top_image)
print("movies=", article.movies)
print("text=", article.text)
print("summary=", article.summary)
```

## 2.8 解析 html

我们通过 requests 库获取文章 html 信息，用 newspaper 进行解析，如下所示：

```
import requests
from newspaper import fulltext

html = requests.get('https://money.163.com/19/1130/08/EV7HD86300258105.html').text
print('获取的原信息-->', html)
text = fulltext(html, language='zh')
print('解析后的信息', text)
```

## 2.9 nlp（自然语言处理）

我们看一下在 nlp 处理前后获取一篇新闻的关键词情况，如下所示：

```
>>> from newspaper import Article

>>> article = Article('https://money.163.com/19/1130/08/EV7HD86300258105.html')
>>> article.download()
>>> article.parse()
>>> print('处理前-->', article.keywords)
# nlp 处理
>>> article.nlp()
>>> print('处理后-->', article.keywords)

处理前--> []
处理后--> ['亚洲最大水秀项目成摆设', '至今拖欠百万设计费']
```

通过结果我们可以看出 newspaper 框架的 nlp 处理效果还算可以。

## 2.10 多任务

当我们需要从多个渠道获取新闻信息时可以采用多任务的方式，如下所示：

```
import newspaper
from newspaper import news_pool

hq_paper = newspaper.build('https://www.huanqiu.com', language="zh")
sh_paper = newspaper.build('http://news.sohu.com', language="zh")
sn_paper = newspaper.build('https://news.sina.com.cn', language="zh")

papers = [hq_paper, sh_paper, sn_paper]
# 线程数为 3 * 2 = 6
news_pool.set(papers, threads_per_source=2)
news_pool.join()
print(hq_paper.articles[0].html)
```

因获取内容较多，上述代码执行可能需要一段时间，我们要耐心等待。

## 3 词云实现

下面我们来看一下如何实现一个简单的词云。

### 需要的库

```
import newspaper
# 词频统计库
import collections  
# numpy 库
import numpy as np  
# 结巴分词
import jieba  
# 词云展示库
import wordcloud 
# 图像处理库
from PIL import Image  
# 图像展示库
import matplotlib.pyplot as plt  
```

第三方库的安装使用 pip install 即可，如：pip install wordcloud。

### 文章获取及处理

```
# 获取文章
article = newspaper.Article('https://news.sina.com.cn/o/2019-11-28/doc-iihnzahi3991780.shtml')
# 下载文章
article.download()
# 解析文章
article.parse()
# 对文章进行 nlp 处理
article.nlp()
# nlp 处理后的文章拼接
article_words = "".join(article.keywords)
# 精确模式分词(默认模式)
seg_list_exact = jieba.cut(article_words, cut_all=False)
# 存储分词结果
object_list = []
# 移出的词
rm_words = ['迎', '以来', '将']
# 迭代分词对象
for word in seg_list_exact:
    if word not in rm_words:
        object_list.append(word)
# 词频统计
word_counts = collections.Counter(object_list)
# 获取前 10 个频率最高的词
word_top10 = word_counts.most_common(10)
# 词条及次数
for w, c in word_top10:
    print(w, c)
```

### 生成词云

```
# 词频展示
# 定义词频背景
mask = np.array(Image.open('bg.jpg'))
wc = wordcloud.WordCloud(
    # 设置字体格式
    font_path='C:/Windows/Fonts/simhei.ttf',
    # 背景图
    mask=mask,
    # 设置最大显示的词数
    max_words=100,
    # 设置字体最大值
    max_font_size=120
)
# 从字典生成词云
wc.generate_from_frequencies(word_counts)
# 从背景图建立颜色方案
image_colors = wordcloud.ImageColorGenerator(mask)
# 显示词云
plt.imshow(wc)
# 关闭坐标轴
plt.axis('off')
plt.savefig('wc.jpg')
# 显示图像
plt.show()  
```

效果如图所示：

![](http://www.justdopython.com/assets/images/2019/newspaper/cloud.PNG)

## 总结

本文为大家介绍了 Python 爬虫框架 newspaper，让大家能够对 newspaper 有个基本了解以及能够上手使用。在使用的过程中，我们会发现 newspaper 框架还存在一些 bug，因此，我们在实际工作中需要综合考虑、谨慎使用。

> 示例代码：[Python-100-days-day074](https://github.com/JustDoPython/python-100-day/tree/master/day-074)

参考：

[https://newspaper.readthedocs.io/en/latest/user_guide/quickstart.html#performing-nlp-on-an-article](https://newspaper.readthedocs.io/en/latest/user_guide/quickstart.html#performing-nlp-on-an-article)

