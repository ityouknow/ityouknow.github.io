---
layout: post
title:  第67天：PyQuery 详解
category: python
copyright: python
---

by 闲欢

PyQuery 库是一个非常强大又灵活的网页解析库，如果你有前端开发经验，那么你应该接触过 jQuery ,那么 PyQuery 就是你非常绝佳的选择，PyQuery 是 Python 仿照 jQuery 的严格实现，语法与 jQuery 几乎完全相同。
<!--more-->

## 安装

跟安装其他库一样：

```
>>> pip3 install pyquery
```

安装了之后，在程序里面就可以引用了，引用方法跟其他库类似：

```
from pyquery import PyQuery as pq
```

## 初始化

PyQuery 可以将 HTML 字符串初始化为对象，也可以将 HTML 文件初始化为对象，甚至可以将请求的响应初始化为对象。下面我们一个个来介绍。

### 初始化字符串

对于一个标准的 HTML 字符串，PyQuery 可以直接初始化为对象：

```
html = """
<html>
    <head>
        我爱我的祖国
        <title>China</title>
    </head>
    <body>
        <ul id="container">
            <li class="li1">五星</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬</li>
        </ul>
    </body>
</html>
"""

doc = pq(html)
print(type(doc))
print(doc)

# 输出结果
<class 'pyquery.pyquery.PyQuery'>
<html>
    <head>
        我爱我的祖国
        <title>China</title>
    </head>
    <body>
        <ul id="container">
            <li class="li1">五星</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬</li>
        </ul>
    </body>
</html>
```

我们可以看到，HTML 字符串初始化后，打印出来的是一个 PyQuery 对象。

如果我们的字符串不是 HTML 格式内容，PyQuery 会自动加上段落标签将字符串内容包装成 HTML 内容。例如：

```
test = '''
this is a string
this is second row
'''

doc = pq(test)
print(type(doc))
print(doc)

# 输出结果
<class 'pyquery.pyquery.PyQuery'>
<p>this is a string
this is second row
</p>
```

### 初始化 HTML 文件

初始化文件，只需要加个 filename 参数，指明 文件路径即可：

```
#filename参数为html文件路径
test_html = pq(filename='test.html')
print(type(test_html))
print(test_html)

# 输出结果
<class 'pyquery.pyquery.PyQuery'>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>Title</title>
</head>
<body>

</body>
</html>
```

如果文件不是 HTML 文件，那么初始化的时候会自动加上 HTML 标签。例如：

```
#filename参数为html文件路径
test_txt = pq(filename='test.txt')
print(type(test_txt))
print(test_txt)

# 输出结果
<class 'pyquery.pyquery.PyQuery'>
<html><body><p>this is a txt</p></body></html>
```

我的 test.txt 文件中只有一行内容： this is a txt。初始化完后，自动添加了 HTML 标签。

### 初始化请求响应

我们可以把请求的网址内容初始化为 PyQuery 对象，只需要加个参数 url ，将网址赋值给它即可。例如：

```
response = pq(url='https://www.baidu.com')
print(type(response))
print(response)

# 输出结果
<class 'pyquery.pyquery.PyQuery'>
<html> <head><meta http-equiv="content-type" content="text/html;charset=utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=Edge"/><meta content="always" name="referrer"/><link
...
```

我们请求百度的首页，然后初始化为对象，后面内容较多，因此省略。

## 常用 CSS 选择器

PyQuery 里面 CSS 选择器的用法跟 jQuery 里面是一样的，例如，针对上面的 HTML 字符串内容，我们获取 id 为 container 的标签，然后打印出来：

```
doc = pq(html)
print(type(doc('#container')))
print(doc('#container'))

# 输出结果
<class 'pyquery.pyquery.PyQuery'>
<ul id="container">
            <li class="li1">五星</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬</li>
        </ul>
```

我们也可以用 class 选择器，例如：

```
print(type(doc('.li2')))
print(doc('.li2'))

# 输出结果
<class 'pyquery.pyquery.PyQuery'>
<li class="li2">红旗</li>
```

再复杂一点，我们可以使用多层选择器，例如：

```
print(doc('html #container'))

# 输出结果
<ul id="container">
            <li class="li1">五星</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬</li>
        </ul>
```

当然，我们同样可以根据 CSS 选择器修改 HTML 标签的内容：

```
li2 = doc('.li2')
li2.css('font-size', '18px')
print(li2)

# 输出结果
<li class="li2" style="font-size: 18px">红旗</li>
```

这里我们给 class 为“li2”的标签加了字体的大小，可以看到返回的内容中有了 style 属性。

虽然 PyQuery 有修改 HTML 内容的方法，但是我们一般不会用到，因为我们一般是解析 HTML 内容，而不是去修改它，大家了解一下即可。

## 伪类选择器

伪类（Pseudo-classes）是指在 HTML 中，同一个标签，根据其不同的状态，有不同的显示样式。详细的用法可以参考： https://www.runoob.com/css/css-pseudo-classes.html ，里面有详细的介绍。

我们主要应用伪类选择器来解析 HTML，获取我们所需的数据。例如：

```
pseudo_doc = pq(html)
print(pseudo_doc('li:nth-child(2)'))
#打印第一个li标签
print(pseudo_doc('li:first-child'))
#打印最后一个标签
print(pseudo_doc('li:last-child'))

# 输出结果
<li class="li2">红旗</li>
            
<li class="li1">五星</li>
            
<li class="li3">迎风飘扬</li>

```

我们也可以用 contains 方法来筛选内容，例如：

```
html = """
<html>
    <head>
        我爱我的祖国
        <title>China</title>
    </head>
    <body>
        <ul id="container">
            <li class="li1">五星啊</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬啊</li>
        </ul>
    </body>
</html>
"""

pseudo_doc = pq(html)

#找到含有Python的li标签
print(pseudo_doc("li:contains('五星')"))

#找到含有好的li标签
print(pseudo_doc("li:contains('红')"))

#找到含有啊的li标签
print(pseudo_doc("li:contains('啊')"))

# 输出结果
<li class="li1">五星啊</li>
            
<li class="li2">红旗</li>

<li class="li1">五星啊</li>
            <li class="li3">迎风飘扬啊</li>
```

我们可以看到，如果查找的结果有多条记录，那么结果会将多条记录拼在一起。当然，如果查找的内容不存在，就会返回空。


## 查找标签

我们可以按照条件在 Pyquery 对象中查找符合条件的标签，类似于 BeautifulSoup 中的 find 方法。
例如，我要查找 id 为 container 的标签：

```
#打印id为container的标签
print(doc.find('#container'))

# 输出结果
<ul id="container">
            <li class="li1">五星啊</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬啊</li>
        </ul>
```

我要查找 id 为 container 的标签的子标签，使用 children 方法就可以实现：

```
#打印id为container的标签的子标签
container = doc.find('#container')
print(container.children())

# 输出结果
<li class="li1">五星啊</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬啊</li>
```

查找父标签，我们可以用 parent 方法：

```
#打印id为container的标签的父标签
container = doc.find('#container')
print(container.parent())

# 输出结果
<body>
        <ul id="container">
            <li class="li1">五星啊</li>
            <li class="li2">红旗</li>
            <li class="li3">迎风飘扬啊</li>
        </ul>
    </body>
```

查找兄弟标签，我们用 siblings 方法：

```
#打印class为li2的标签的兄弟标签
li2 = doc.find('.li2')
print(li2.siblings())

# 输出结果
<li class="li1">五星啊</li>
            <li class="li3">迎风飘扬啊</li>
```

## 标签信息的提取

前面我们讲的都是怎么定位到标签，这只是我们解析数据的第一步，接下来我们需要从标签中提取我们需要的信息。

如果你需要提取标签的属性值，可以用 .attr() 方法，例如：

```
#获取li2的class属性值
print(doc('.li2').attr('class'))

# 输出结果
li2
```

如果你细腰提取标签内的文本，我们可以用 .text() 方法，例如：

```
#获取li2的文本
print(doc('.li2').text())

# 输出结果
红旗
```

如果要获取某个标签下面的所有文本（包含子标签的），怎么做？我们来看下个例子：

```
#获取html标签下面的所有文本
print(doc('html').text())

# 输出结果
我爱我的祖国
China
五星啊
红旗
迎风飘扬啊
```

很简单，我们只需要找到这个标签，使用 .text() 方法。

如果我们要获取某个标签下面的所有文本，但是要排除某些标签的文本，该怎么做？我们来看下个例子：

```
#排除部分标签文本
tag = doc('html')
tag.remove('title')
print(tag.text())

# 输出结果
我爱我的祖国
五星啊
红旗
迎风飘扬啊
```

我们可以用 .remove() 来删除某些标签，上面例子中可以看到，我们把 title 标签去掉了，title 标签对应的内容 China 也就去掉了。


## PyQuery 处理复杂的网址请求

前面我们介绍了 PyQuery 可以获取网址请求的 HTML 内容，并转化为对象。我们在请求 URL 时，或许会遇到需要附带一些参数的情况，这些自定义的参数在 PyQuery 请求时也是支持的，例如 cookies 和 headers，我们看例子：

```
cookies = {'Cookie':'cookie'}
headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'}

response = pq(url='https://www.baidu.com',headers=headers,cookies=cookies)
print(response)

#返回(省略)

<head>
    
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
...
```

## 总结

这篇文章给大家介绍了 PyQuery 的常见使用方法，大家如果用的熟练的话，还是可以极大地节约我们解析 HTML 网页内容的时间的。PyQuery 可以称得上是爬虫神器，还有一些用法由于篇幅有限，没有进行介绍。大家可以去官网详细查看，官网地址： https://pythonhosted.org/pyquery/ 。

> 文中示例代码：[Python-100-days-day067](https://github.com/JustDoPython/python-100-day/tree/master/day-067)