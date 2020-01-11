---
layout: post
title:  第95天：StringIO & BytesIO
category: python
copyright: python
---

by 吴刀钓鱼

上一篇中我们介绍了文件的基本读写操作，但是很多时候数据的读写并不一定都是在文件中，我们也可以在内存中读写数据，因此引出我们今天的主要内容，即 StringIO 和 BytesIO，让你学会在内存中进行数据的基本读写操作。

<!--more-->

## 1 前言-内存与硬盘

在正式介绍 StringIO 和 BytesIO 之前，我们先来了解一下内存和硬盘的差异，以便更好的理解硬盘中文件的基本操作与 StringIO 和 BytesIO 对数据的基本操作两者之间存在的意义。

内存与硬盘的差异：

差异点|内存|硬盘
:-:|:-:|:-:
形状|长条形，所以有内存条之称|四四方方的，内含盘片
容量(以 PC 机为例)|4G|1T
功能|存储任务管理器的进程|存储文档、软件等数据
运行速度|快|慢
特点|存放 CPU 运算的数据，一旦断电数据就会消失|可以永久存储数据

通俗点来讲，我们电脑里的 C 盘、D盘等都是硬盘，电脑关机后再次开机这些盘符里面的数据依然还在。但是我们电脑任务管理器里面跑的进程的数据都是存储在内存中的，电脑关机后进程里面的数据就不复存在了。

正是由于硬盘的读取数据比较慢，CPU 如果在运行程序的时候所有数据都直接从硬盘中读写，那么电脑的运行速度将会大打折扣。因此 CPU 会将运行软件时要用到的数据一次性从硬盘中调到运行速度很快的内存中，然后 CPU 再与内存进行数据交换。一个很明显的现象就是我们在打开一个软件时会有一段时间延迟，但是打开之后软件的运行速度就很快了。

好了，现在我们应该对在内存与硬盘上读取数据大概有一个了解，开始进入我们的正题。

## 2 StringIO 和 BytesIO

StringIO 和 BytesIO 的作用简单来说，就是在内存中虚拟一个文件的感觉，这个虚拟出来的文件操作方式与上一篇介绍的在硬盘中文件的基本操作类似。在 Python3 中，这两“兄弟”现在已经归入 IO 模块。

### 2.1 StringIO

要把 str 字符串写入内存中，我们需要创建一个 StringIO 对象，然后像文件一样对读取内容。其中 StringIO 中多了一个 getvalue() 方法，目的是用于获取写入后的 str。

示例 1：

```
# 定义一个 StringIO 对象，写入并读取其在内存中的内容
from io import StringIO

f = StringIO()

f.write('Python-100')
str = f.getvalue()
print('写入内存中的字符串为:%s' %str)

f.write('\n') # 追加写入内容
f.write('坚持100天')
str = f.getvalue()  # getvalue() 可以读取到 StringIO 中的所有内容
print('写入内存中的字符串为:\n%s' %str)

f.close() # 释放内存中的数据，后续不可再对该 StringIO 进行内容的读写操作

# 输出结果
# 写入内存中的字符串为:
# Python-100
# 写入内存中的字符串为:
# Python-100
# 坚持100天
```

示例 2:

```
# 当然也可以用 read()、readline() 等来读取 StringIO 中写入的字符串

from io import StringIO

str = 'Python-100' + '\n' + '坚持100天'

f = StringIO(str)

currentStr = f.read()
print('写入内存中的字符串为:\n%s' %currentStr)

f.close()
```

示例 3：

```
# 考虑一个场景，比如你需要对爬虫爬取到的数据进行操作，但是你不想把数据写入本地的硬盘上，这时候 StringIO 就派上用场了。

from io import StringIO

# 假设的爬虫数据输出函数 outputData()
def outputData():
    dataOne   = '我是 1 号爬虫数据\n'
    dataTwo   = '我是 2 号爬虫数据\n'
    dataThree = '我是 3 号爬虫数据'
    data = dataOne + dataTwo + dataThree
    return data

# dataStr 为爬虫数据字符串
dataStr = outputData()

# 1. 将 outputData() 函数返回的内容写入内存中
dataIO = StringIO(dataStr)

# 1.1 输出 StringIO 在内存中写入的数据
print('1.1内存中写入的数据为:\n%s' %dataIO.getvalue())

# 输出结果:
# 1.1内存中写入的数据为:
# 我是 1 号爬虫数据
# 我是 2 号爬虫数据
# 我是 3 号爬虫数据

# 1.2 按行输出写入的数据方式一
print('1.2按行输出写入的数据方式一:')
for data in dataIO.readlines():
    print(data.strip('\n')) # 去掉每行数据末尾的换行符

# 输出结果:
# 1.2按行输出写入的数据方式一:
# 我是 1 号爬虫数据
# 我是 2 号爬虫数据
# 我是 3 号爬虫数据

# 1.3 按行输出写入的数据方式二
# 由于上一步的操作，此时文件指针指向数据末尾(32)，我们需要将指针指向起始位置
print('由于上一步操作的输出，此时文件指针位置为:%d' %dataIO.tell())

# 将文件指针指向起始位置，方便下面的演示
dataIO.seek(0)
print('1.3按行输出写入的数据方式二:')
for data in dataIO:
    print(data.strip('\n'))

# 输出结果:
# 1.3按行输出写入的数据方式二:
# 我是 1 号爬虫数据
# 我是 2 号爬虫数据
# 我是 3 号爬虫数据

# 2. 采用 write() 的方法将字符串写入内存
dataWriteIO = StringIO()
dataWriteIO.write(dataStr)

# 2.1 输出内存中写入的数据
print('2.1内存中写入的数据为:\n%s' %dataIO.getvalue())

# 输出结果:
# 2.1内存中写入的数据为:
# 我是 1 号爬虫数据
# 我是 2 号爬虫数据
# 我是 3 号爬虫数据
 
# 2.2 按行输出写入的数据方式一
# 由于 write() 写入字符串后，文件指针会指向写入内容的结尾，需要将文件指针指向起始位置，否则未能输出内容
print('2.2按行输出写入的数据方式一:')
print('输出内容为空！')
for data in dataIO:
    print(data.strip('\n'))
print('输出内容为空！')

# 输出结果：
# 2.2按行输出写入的数据方式一:
# 输出内容为空！
# 输出内容为空！


# 2.3 按行输出写入的数据方式二
# 将指针指向起始位置重新按行输出
dataIO.seek(0)
print('2.3按行输出写入的数据方式:')
for data in dataIO.readlines():
    print(data.strip('\n'))

# 输出结果
# 2.3按行输出写入的数据方式:
# 我是 1 号爬虫数据
# 我是 2 号爬虫数据
# 我是 3 号爬虫数据
```

Tips: 
根据这个例子可以看出，当我们使用 StringIO(str) 方法向内存写入数据时，文件指针是指向起始位置的，比如示例 3 的 1.2 场景中 readlines() 可以读取到数据。当我们使用 write(str) 方法向内存写入数据时，文件指针会指向写入内容的结尾，读取数据时需要将指针移动到起始位置，比如示例 3 的 2.3 场景。

### 2.2 BytesIO

BytesIO，顾名思义，就是将字节流写入到内存中，其实它的操作方法与 StringIO 一样，区别就在于前者写入字节，后者写入字符串。这边就简单举个例子演示，不再具体介绍了。

示例：

```
# 定义一个 BytesIO 对象，写入并读取其在内存中的内容

from io import BytesIO

str = 'Python-100' + '\n' + '坚持100天'

f = BytesIO(str.encode('utf-8'))

print('写入内存的字节为:%s' %f.getvalue())

print('字节解码后内容为:\n%s' %f.getvalue().decode('utf-8'))
```

Tips:
根据示例可知，对于字节我们需要掌握其正确的编解码方式，比如有 'utf-8'、'gbk' 等。

## 3 总结

本节给大家介绍了 Python 中 StringIO 和 BytesIO 的基本使用方法，掌握在内存中存取数据的基本操作，同时介绍了内存与硬盘的区别，让大家明白在内存中存取数据的优势，助力您在爬虫的道路越走越远。

> 示例代码：[Python-100-days-day95](https://github.com/JustDoPython/python-100-day)

## 参考资料

[1] https://www.cnblogs.com/minseo/p/11164921.html

[2] https://www.liaoxuefeng.com/wiki/1016959663602400/1017609424203904
