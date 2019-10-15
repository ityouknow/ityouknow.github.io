---
layout: post
title:  第13天：Python 输入输出
category: python
copyright: python
---

> by 程序员野客

在前几篇文章中，我们其实已经接触了 Python 的输入输出功能，本篇文章中我们再来详细学习一下。

<!--more-->

## 1 格式化输出

Python 输出值的方式有两种：表达式语句和 print 函数（文件对象的输出使用 write 方法，标准文件输出可以参考 sys.stdout ，[详细文档](https://docs.python.org/zh-cn/3/faq/extending.html#how-do-i-catch-the-output-from-pyerr-print-or-anything-that-prints-to-stdout-stderr)）。

如果我们想要将输出的值转成字符串，可以使用 repr() 或 str() 函数来实现，其中 repr() 函数产生一个解释器易读的表达形式，str() 函数返回一个用户易读的表达形式。

如果我们不只是想打印使用空格分隔的值，而是想对输出进行格式化控制，可以采用两种方式：一种是自己处理整个字符串，另一种是采用 str.format() 方式，下面介绍下 str.format() 的使用。

1）基本使用

```
>>> print('{}网址： "{}!"'.format('Python技术', 'www.justdopython.com'))
Python技术网址： "www.justdopython.com!"
```

括号及其里面的字符 (称作格式化字段) 将会被 format() 中的参数替换

2）在括号中的数字用于指向传入对象在 format() 中的位置

```
>>> print('{0} 和 {1}'.format('Hello', 'Python'))
Hello 和 Python
>>> print('{0} {1}'.format('Hello', 'Python'))
Hello Python
>>> print('{1} {0}'.format('Hello', 'Python'))
Python Hello
```

3）如果在 format() 中使用了关键字参数，那么它们的值会指向使用该名字的参数

```
>>> print('{name}网址： {site}'.format(name='Python技术', site='www.justdopython.com'))
Python技术网址： www.justdopython.com
```

4）位置及关键字参数可以任意的结合

```
>>> print('电商网站 {0}, {1}, {other}。'.format('淘宝', '京东', other='拼多多'))
电商网站 淘宝, 京东, 拼多多。
```

5）用 ** 标志将字典以关键字参数的方式传入

```
>>> "repr() shows quotes: {!a}; str() doesn't: {!s}".format('test1', 'test2')
"repr() shows quotes: 'test1'; str() doesn't: test2"
```

6）字段名后允许可选的 : 和格式指令

```
# 将 PI 转为三位精度
>>> import math
>>> print('The value of PI is approximately {0:.3f}.'.format(math.pi))
The value of PI is approximately 3.142.
```

7）在字段后的 : 后面加一个整数会限定该字段的最小宽度

```
>>> table = {'Sjoerd': 123, 'Jack': 456, 'Dcab': 789}
>>> for name, phone in table.items():print('{0:10} ==> {1:10d}'.format(name, phone))
Jack       ==>       456
Dcab       ==>       789
Sjoerd     ==>       123
```

8）如果有个很长的格式化字符串，不想分割它可以传入一个字典，用中括号( [] )访问它的键；

```
>>> table = {'Sjoerd': 123, 'Jack': 456, 'Dcab': 789789789789}
>>> print('Jack: {0[Jack]:d}; Sjoerd: {0[Sjoerd]:d}; ' 'Dcab: {0[Dcab]:d}'.format(table))
Jack: 456; Sjoerd: 123; Dcab: 789789789789
```

还可以用 ** 标志将这个字典以关键字参数的方式传入。

```
>>> table = {'Sjoerd': 123, 'Jack': 456, 'Dcab': 789789789789}
>>> print('Jack: {Jack:d}; Sjoerd: {Sjoerd:d}; Dcab: {Dcab:d}'.format(**table))
Jack: 456; Sjoerd: 123; Dcab: 789789789789
```


## 2 读取键盘输入

Python 提供了 input() 内置函数从标准输入读入一行文本，默认的标准输入是键盘，input() 可以接收一个 Python 表达式作为输入，并将运算结果返回。示例如下：
```
>>> str = input("请输入：");
>>> print ("输入的内容是: ", str)
请输入：Hello Python
你输入的内容是:  Hello Python
```

## 3 文件读写

函数 open() 返回文件对象，通常的用法需要两个参数：open(filename, mode)。

第一个参数 filename 是要访问的文件名，第二个参数 mode 是描述如何使用该文件（可取值主要包括：'r' 读取文件；'w' 只是写入文件，已经存在的同名文件将被删掉；'a' 打开文件进行追加，自动添加到末尾；'r+' 打开文件进行读取和写入；'rb+' 以二进制格式打开一个文件用于读写...），mode 参数是可选的，默认为 'r'。

### 3.1 文件对象方法

* **read()**

要读取文件内容，调用 read(size) ，size为可选参数。

```
>>> f = open('tmp.txt', 'r')
>>> str = f.read(5)
>>> print(str)
>>> f.close()
Hello
```

* **readline()**

读取一行，换行符为 \n 。

```
>>> f = open('tmp.txt', 'r')
>>> str = f.readline()
>>> print(str)
>>> f.close()
```

* **readlines()**

读取文件中包含的所有行，可设置可选参数 size 。

```
>>> f = open('tmp.txt', 'r')
>>> str = f.readlines(1)
>>> print(str)
>>> f.close()
['Hello Python']
```

* **write()**

write(string) 将 string 的内容写入文件。

```
>>> f = open('tmp.txt', 'w')
>>> num = f.write('Hello Python')
>>> print(num)
>>> f.close()
12
```

* **seek()**

seek(offset, from_what) 改变文件当前的位置。offset 移动距离；from_what 起始位置，0 表示开头，1 表示当前位置，2 表示结尾，默认值为 0 ，即开头。 

```
>>> f = open('tmp.txt', 'rb+')
>>> f.write(b'0123456789abcdef')
# 移动到文件的第 6 个字节
>>> f.seek(5)
>>> print(f.read())
b'56789abcdef'
```

* **tell()**

tell() 返回文件对象当前所处的位置，它是从文件开头开始算起的字节数。

```
>>> f = open('tmp.txt', 'r')
>>> f.seek(5)
>>> print(f.tell())
5
```

* **close()**

当你处理完一个文件后，调用 close() 来关闭文件并释放系统的资源。也可以使用 with 关键字处理文件对象，实现文件用完后自动关闭。

```
>>> with open('tmp.txt', 'r') as f: 
...     read_data = f.read()
>>> print(f.closed)
True
```

### 3.2 操作 json 格式数据

* **json.dumps(obj)** 序列化，obj 转换为 json 格式的字符串；

* **json.dump(obj, fp)** 序列化，将 obj 转换为 json 格式的字符串，将字符串写入文件；

* **json.loads(str)** 反序列化，将 json 格式的字符串反序列化为一个 Python 对象；

* **json.load(fp)** 反序列化，从文件中读取含 json 格式的数据，将之反序列化为一个 Python 对象。

```
>>> import json
>>> data = {'id':'1', 'name':'jhon', 'age':12}
>>> with open('t.json', 'w') as f:
...    json.dump(data, f)
>>> with open("t.json", 'r') as f:
...    d = json.load( f)
>>> print(d)
{'id': '1', 'name': 'jhon', 'age': 12}
```

## 总结

本节给大家介绍了 Python 输入输出，对 Python 工程师提供了支撑，能够根据实际情况选择合适的输入输出方式。

> 示例代码：[Python-100-days-day013](https://github.com/JustDoPython/python-100-day/tree/master/day-013)

参考：

[https://docs.python.org/zh-cn/3/library/string.html#formatspec](https://docs.python.org/zh-cn/3/library/string.html#formatspec)

[https://docs.pythontab.com/python/python3.5/inputoutput.html#tut-files](https://docs.pythontab.com/python/python3.5/inputoutput.html#tut-files)



