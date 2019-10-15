---
layout: post
title:  第23天：Python 标准库概览1
category: python
copyright: python
---

>  by 潮汐 


- Python 的标准库非常广泛，提供了各种各样的工具。该库包含内置模块（用C编写），可以访问系统功能，例如 Python 程序员无法访问的文件 I / O，以及用 Python 编写的模块，这些模块为许多问题提供标准化解决方案。其中一些模块明确地旨在通过将平台特定的内容抽象为平台中立的 API 来鼓励和增强 Python 程序的可移植性。
- Python 的标准库(standard library) 是 Python 的一个组成部分，也是 Python 的利器，它可以让编程事半功倍。
- 本章节就 Python3 的标准库作一个轮廓概览，后续章节将对每个标准库模块进行详细 讲解

## 1、操作系统接口

### 1.1 os 模块简介

os 模块提供了很多与操作系统相关联的函数，这使得程序员们在编程的时候能利用函数便携操作,如果你希望你的程序能够与平台无关的话，运用这个模块中的功能就尤为重要。在使用 os 模块前，需要先 import os 引入模块。以下方法只做介绍，具体的应用可以使用 help(os) 查看帮助文档，最重要的是实际操作。

<!--more--> 

### 1.1.1  操作系统相关调用和操作

```
  os.name                        获取操作系统平台
  os.environ                    一个 dictionary 包含环境变量的映射关系
  print(os.environ)             输出环境变量值
  os.system()                   用来运行shell命令
  os.chdir(dir)                 改变当前目录 
  os.chdir(‘F:\WprkSpace’)      注意符号转义
  os.getegid()                  得到有效组id
  os.getgid()                   得到组id
  os.getuid()                   得到用户id
  os.geteuid()                  得到有效用户id
  os.setegid os.setegid() os.seteuid() os.setuid()  设置id
  os.getgruops()                得到用户组名称列表
  os.getlogin()                 得到用户登录名称
  os.getenv                     得到环境变量
  os.putenv                     设置环境变量
  os.umask                      设置umask
  os.system(cmd)                利用系统调用，运行cmd命令
```

### 1.1.2  文件目录相关操作

```
  os.getcwd()                   # 获取现在的工作目录
  os.listdir()                  获取某个目录下的所有文件名
  os.remove()                   删除某个文件
  os.path.exists()              检验给出的路径是否真地存在
  os.path.isfile()              判断是否为文件;若是，返回值为真
  os.path.isdir()               判断是否为文件夹;若是，返回值为真
  os.path.abspath(name)         获得绝对路径
  os.path.splitext()            分离文件名与扩展名
  os.path.split()               把一个路径拆分为目录+文件名的形式
  os.path.join(path,name)       连接目录与文件名或目录
  os.path.basename(path)        返回文件名
  os.path.dirname(path)         返回文件路径
```

### 1.2 shutil 模块-高级文件操作

shutil 是高级的文件，文件夹，压缩包处理模块。常用方法如下：

```
# 将文件内容拷贝到另一个文件中
shutil.copyfileobj(fsrc, fdst[, length])

# 拷贝文件
shutil.copyfile(src, dst, *, follow_symlinks=True)

# 仅拷贝权限。内容、组、用户均不变
shutil.copymode(src, dst)

# 仅拷贝状态信息，包括：mode bits, atime, mtime, flags
shutil.copystat(src, dst)

# 拷贝文件和权限
shutil.copy(src, dst)

# 拷贝文件和状态信息
shutil.copy2(src, dst)

# 递归的去拷贝文件夹
shutil.ignore_patterns(*patterns)
shutil.copytree(src, dst, symlinks=False, ignore=None)

# 递归删除文件夹
shutil.rmtree(path[, ignore_errors[, onerror]])

# 递归的去移动文件，它类似mv命令，其实就是重命名。
shutil.move(src, dst)

# 创建压缩包并返回文件路径，例如：zip、tar
shutil.make_archive(base_name, format,...)

```

## 2、命令行参数

### 2.1 sys 模块

通用实用程序脚本通常需要处理命令行参数。这些参数作为列表存储在 sys 模块的 argv 属性中

### 2.2 argparse 模块

argparse 模块提供了一种处理命令行参数的机制。 它应该总是优先于直接手工处理 sys.argv。

## 3、文件通配符 glob 

 glob 模块提供了一个在目录中使用通配符搜索创建文件列表的函数

## 4、错误输出重定向和程序终止

 错误输出重定向和终止程序使用 sys 模块，sys 模块还具有 stdin ， stdout 和 stderr 的属性。后者对于发出警告和错误消息非常有用，即使在 stdout 被重定向后也可以看到它们。

```
sys.stderr.write('Warning, log file not found starting a new one\n')
Warning, log file not found starting a new one
```

**终止脚本：**

```
sys.exit()
```

## 5、字符串模式匹配

###  5.1 正则表达式

字符串模式匹配通常也称为正则表达式，使用 Python 中的 re 标准库，re 模块为高级字符串处理提供正则表达式工具。对于复杂的匹配和操作，正则表达式提供简洁，优化的解决方案，具体的用法后续的文章会单独做详细操作介绍。
 

## 6、数学 

### 6.1 math 模块

数学的计算与应用使用 math 模块，math 模块提供了对浮点数学的底层函数访问；

### 6.2 random 模块

random 模块提供了进行随机选择的工具

### 6.3 statistics 

statistics 模块计算数值数据的基本统计属性（均值，中位数，方差等）

## 7、互联网访问

有许多模块可用于访问互联网和处理互联网协议。

- urllib.request 用于从URL检索数据
- smtplib 用于发送邮件

## 8、时间和日期

datetime 模块提供了以简单和复杂的方式操作日期和时间的类。虽然支持日期和时间算法，但实现的重点是有效的成员提取以进行输出格式化和操作。该模块还支持可感知时区的对象。


## 9、数据压缩

Python 中常见的数据存档和压缩格式由模块直接支持，包括：zlib, gzip, bz2, lzma, zipfile 和 tarfile。

## 10、性能测试

一些 Python 用户对了解同一问题的不同方法的相对性能产生了浓厚的兴趣。 Python 提供了一种可以立即回答这些问题的测量工具。

例如，元组封包和拆包功能相比传统的交换参数可能更具吸引力。timeit 模块可以快速演示在运行效率方面一定的优势

```
>>> from timeit import Timer
>>> Timer('t=a; a=b; b=t', 'a=1; b=2').timeit()
0.57535828626024577
>>> Timer('a,b = b,a', 'a=1; b=2').timeit()
0.54962537085770791
```

与 timeit 的精细粒度级别相反， profile 和 pstats 模块提供了用于在较大的代码块中识别时间关键部分的工具。

## 11、质量控制

开发高质量软件的一种方法是在开发过程中为每个函数编写测试，并在开发过程中经常运行这些测试。

### 11.1 doctest

doctest 模块提供了一个工具，用于扫描模块并验证程序文档字符串中嵌入的测试。测试构造就像将典型调用及其结果剪切并粘贴到文档字符串一样简单。这通过向用户提供示例来改进文档，并且它允许doctest模块确保代码保持对文档的真实

### 11.2 unittest 

unittest 模块不像 doctest 模块那样易于使用，但它允许在一个单独的文件中维护更全面的测试集

## 12、自带电池

Python 有“自带电池”的理念。Python 自带电池指的是 Python 内置的模块，通过其包的复杂和强大功能可以最好地看到这一点。例如:

- xmlrpc.client 和 xmlrpc.server 
 模块使远程过程调用实现了几乎无关紧要的任务。尽管有模块名称，但不需要直接了解或处理XML。
- email 包是一个用于管理电子邮件的库，包括MIME和其他：基于 RFC 2822 的邮件文档。与 smtplib 和 poplib 实际上发送和接收消息不同，电子邮件包具有完整的工具集，用于构建或解码复杂的消息结构（包括附件）以及实现互联网编码和标头协议。
- json 包为解析这种流行的数据交换格式提供了强大的支持。
- csv 模块支持以逗号分隔值格式直接读取和写入文件，这些格式通常由数据库和电子表格支持。 
- sqlite3 模块是SQLite数据库库的包装器，提供了一个可以使用稍微非标准的SQL语法更新和访问的持久数据库。

## 总结

本节给大家介绍了 Python 常用标准库的基本概念，在后续的文章中将对具体的模块作详细介绍，更好的对 Python 工程师使用标准库提供支撑。
