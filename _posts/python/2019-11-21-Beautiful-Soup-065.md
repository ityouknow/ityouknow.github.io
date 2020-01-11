---
layout: post
title:  第65天：爬虫利器 Beautiful Soup 之遍历文档
category: python
copyright: python
---

by 豆豆

## Beautiful Soup 简介

Beautiful Soup 是一个可以从 HTML 或 XML 文件中提取数据的 Python 库，它提供了一些简单的操作方式来帮助你处理文档导航，查找，修改文档等繁琐的工作。因为使用简单，所以 Beautiful Soup 会帮你节省不少的工作时间。

<!--more-->

## Beautiful Soup 安装

你可以使用如下命令安装 Beautiful Soup。二选一即可。

```shell
$ easy_install beautifulsoup4

$ pip install beautifulsoup4
```

Beautiful Soup 不仅支持 Python 标准库中的 HTML 解析器，还支持很多第三方的解析器，比如 lxml，html5lib 等。初始化 Beautiful Soup 对象时如果不指定解析器，那么 Beautiful Soup 将会选择最合适的解析器（前提是你的机器安装了该解析器）来解析文档，当然你也可以手动指定解析器。这里推荐大家使用 lxml 解析器，功能强大，方便快捷，而且该解析器是唯一支持 XML 的解析器。

你可以使用如下命令来安装 lxml 解析器。二选一即可。

```shell
$ easy_install lxml

$ pip install lxml
```

## Beautiful Soup 小试牛刀

Beautiful Soup 使用来起来非常简单，你只需要传入一个文件操作符或者一段文本即可得到一个构建完成的文档对象，有了该对象之后，就可以对该文档做一些我们想做的操作了。而传入的文本大都是通过爬虫爬取过来的，所以 Beautiful Soup 和 requests 库结合使用体验更佳。

```python
# demo 1
from bs4 import BeautifulSoup
# soup = BeautifulSoup(open("index.html"))
soup = BeautifulSoup("<html><head><title>index</title></head><body>content</body></html>", "lxml") # 指定解析器
print(soup.head)

# 输出结果
<head><title>index</title></head>
```

Beautiful Soup 将复杂的 HTML 文档转换成一个复杂的树形结构，每个节点都是 Python 对象，所有对象可以归纳为 4 种: Tag，NavigableString，BeautifulSoup，Comment。

Tag 就是 HTML 的一个标签，比如 div，p 标签等，也是我们用的最多的一个对象。

NavigableString 指标签内部的文字，直译就是可遍历的字符串。

BeautifulSoup 指一个文档的全部内容，可以当成一个 Tag 来处理。

Comment 是一个特殊的 NavigableString，其输出内容不包括注视内容。

为了故事的顺利发展，我们先定义一串 HTML 文本，下文的所有例子都是基于这段文本的。

```python
html_doc = """
<html><head><title>index</title></head>
<body>
<p class="title"><b>首页</b></p>
<p class="main">我常用的网站
<a href="https://www.google.com" class="website" id="google">Google</a>
<a href="https://www.baidu.com" class="website" id="baidu">Baidu</a>
<a href="https://cn.bing.com" class="website" id="bing">Bing</a>
</p>
<div><!--这是注释内容--></div>
<p class="content1">...</p>
<p class="content2">...</p>
</body>
"""
```

### 子节点

Tag 有两个很重要的属性，name 和 attributes。期中 name 就是标签的名字，attributes 是标签属性。标签的名字和属性是可以被修改的，注意，这种修改会直接改变 BeautifulSoup 对象。

```python
# demo 2
soup = BeautifulSoup(html_doc, "lxml");
p_tag = soup.p
print(p_tag.name)
print(p_tag["class"])
print(p_tag.attrs)

p_tag.name="myTag" # attrs 同样可被修改，操作同字典
print(p_tag)

#输出结果
p
['title']
{'class': ['title']}
<myTag class="title"><b>首页</b></myTag>
```

由以上例子我么可以看出，可以直接通过点属性的方法来获取 Tag，但是这种方法只能获取第一个标签。同时我们可以多次调用点属性这个方法，来获取更深层次的标签。

```python
# demo 3
soup = BeautifulSoup(html_doc, "lxml");
print(soup.p.b)

#输出结果
<b>首页</b>
```

如果想获得所有的某个名字的标签，则可以使用 find_all(tag_name) 函数。

```python
# demo 4
soup = BeautifulSoup(html_doc, "lxml");
a_tags=soup.find_all("a")
print(a_tags)

#输出结果
[<a class="website" href="https://www.google.com" id="google">Google</a>, <a class="website" href="https://www.baidu.com" id="baidu">Baidu</a>, <a class="website" href="https://cn.bing.com" id="bing">Bing</a>]
```

我们可以使用 .contents 将 tag 以列表方式输出，即将 tag 的子节点格式化为列表，这很有用，意味着可以通过下标进行访问指定节点。同时我们还可以通过 .children 生成器对节点的子节点进行遍历。

```python
# demo 5
soup = BeautifulSoup(html_doc, "lxml");
head_tag=soup.head
print(head_tag)
print(head_tag.contents)

for child in head_tag.children:
	print("child is : ", child)

#输出结果
<head><title>index</title></head>
[<title>index</title>]
child is :  <title>index</title>
```

.children 只可以获取 tag 的直接节点，而获取不到子孙节点，.descendants 可以满足你。

```python
# demo 6
soup = BeautifulSoup(html_doc, "lxml");
head_tag=soup.head
for child in head_tag.descendants:
	print("child is : ", child)

# 输出结果
child is :  <title>index</title>
child is :  index
```

### 父节点

通过 .parent 属性获取标签的父亲节点。 title 的父标签是 head，html 的父标签是 BeautifulSoup 对象，而 BeautifulSoup 对象的父标签是 None。

```python
# demo 7
soup = BeautifulSoup(html_doc, "lxml");
title_tag=soup.title

print(title_tag.parent)
print(type(soup.html.parent))
print(soup.parent)

# 输出结果
<head><title>index</title></head>
<class 'bs4.BeautifulSoup'>
None
```

同时，我们可以通过 parents 得到指定标签的所有父亲标签。

```python
# demo 8
soup = BeautifulSoup(html_doc, "lxml");
a_tag=soup.a

for parent in a_tag.parents:
    print(parent.name)

# 输出结果
p
body
html
[document]
```

### 兄弟节点

通过 .next_sibling 和 .previous_sibling 来获取下一个标签和上一个标签。

```python
# demo 9
soup = BeautifulSoup(html_doc, "lxml");
div_tag=soup.div

print(div_tag.next_sibling)
print(div_tag.next_sibling.next_sibling)

# 输出结果

<p class="content1">...</p>
```

你可能会纳闷，调用了两次 next_sibling 怎么只有一个输出呢，这方法是不是有 bug 啊。事实上是 div 的第一个 next_sibling 是**div 和 p 之间的换行符**。这个规则对于 previous_sibling 同样适用。

另外，我们可以通过 .next_siblings 和 .previous_siblings 属性可以对当前节点的兄弟节点迭代输出。在该例子中，我们在每次输出前加了前缀，这样就可以更直观的看到 dib 的第一个 previous_sibling 是换行符了。

```python
# demo 10
soup = BeautifulSoup(html_doc, "lxml");
div_tag=soup.div

for pre_tag in div_tag.previous_siblings:
	print("pre_tag is : ", pre_tag)

# 输出结果
pre_tag is :  

pre_tag is :  <p class="main">我常用的网站
<a class="website" href="https://www.google.com" id="google">Google</a>
<a class="website" href="https://www.baidu.com" id="baidu">Baidu</a>
<a class="website" href="https://cn.bing.com" id="bing">Bing</a>
</p>
pre_tag is :  

pre_tag is :  <p class="title"><b>首页</b></p>
pre_tag is :  
```

### 前进和后退

通过 .next_element 和 .previous_element 获取指定标签的前一个或者后一个被解析的对象，注意这个和兄弟节点是有所不同的，兄弟节点是指有相同父亲节点的子节点，而这个前一个或者后一个是按照文档的解析顺序来计算的。

比如在我们的文本 html_doc 中，head 的兄弟节点是 body（不考虑换行符），因为他们具有共同的父节点 html，但是 head 的下一个节点是 title。即```soup.head.next_sibling=title soup.head.next_element=title```。

```python
# demo 11
soup = BeautifulSoup(html_doc, "lxml");

head_tag=soup.head
print(head_tag.next_element)

title_tag=soup.title
print(title_tag.next_element)

# 输出结果
<title>index</title>
index
```

同时这里还需要注意的是 title 下一个解析的标签不是 body，而是 title 标签内的内容，因为 html 的解析顺序是打开 title 标签，然后解析内容，最后关闭 title 标签。

另外，我们同样可以通过 .next_elements 和 .previous_elements 来迭代文档树。由遗下例子我们可以看出，换行符同样会占用解析顺序，与迭代兄弟节点效果一致。

```python
# demo 12
soup = BeautifulSoup(html_doc, "lxml");
div_tag=soup.div
for next_element in div_tag.next_elements:
	print("next_element is : ", next_element)

# 输出结果
next_element is :  这是注释内容
next_element is :  

next_element is :  <p class="content1">...</p>
next_element is :  ...
next_element is :  

next_element is :  <p class="content2">...</p>
next_element is :  ...
next_element is :  

next_element is :  

```

## Beautiful Soup 总结

本章节介绍了 Beautiful Soup 的使用场景以及操作文档树节点的基本操作，看似很多东西其实是有规律可循的，比如函数的命名，兄弟节点或者下一个节点的迭代函数都是获取单个节点函数的复数形式。

同时由于 HTML 或者 XML 这种循环嵌套的复杂文档结构，致使操作起来甚是麻烦，掌握了本文对节点的基本操作，将有助于提高你写爬虫程序的效率。

## 代码地址

> 示例代码：https://github.com/JustDoPython/python-100-day/tree/master/day-065

## 参考内容

https://www.crummy.com/software/BeautifulSoup/bs4/doc/index.zh.html#
