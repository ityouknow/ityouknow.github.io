---
layout: post
title:  第93天：文件读写
category: python
copyright: python
---

by 吴刀钓鱼

文件操作中最基本的当然属于文件的读写操作。当我们利用爬虫抓取到一堆数据时，就需要进行文件写操作，将数据写入到文件当中；当我们需要对抓取到的文件内容进行筛选，获取有效信息时，需要对文件进行读操作。本文将介绍文件操作的一些基本内容，助您更高效的处理文件。

<!--more-->

## 1 打开和关闭文件

文件的打开模式多种多样，就像“条条道路通罗马”一样，每一种模式都可以用来打开文件，但是由于“道路”的不同，它们对于打开后文件内容的处理方式不一样。相比来说文件的关闭模式就简单得多了。

### 1.1 文件的打开模式

表格内列出了一些常见的文件打开模式以及它对于文件的作用。

模式|描述|
:-:|-|-
b|以二进制模式打开文件。
+|以读写模式打开一个文件。
r|以只读方式打开文件，打开后文件的指针将会放在文件的开头。
rb|以二进制格式打开一个文件用于只读，文件指针将会放在文件的开头。
r+|以读写模式打开一个文件，文件指针将会放在文件的开头。
rb+|以二进制格式打开一个文件用于读写，文件指针将会放在文件的开头。
w|以写模式打开一个文件，如果该文件已存在则打开文件，删除原有文件内容并从开头开始编辑，如果该文件不存在，则创建新文件。
wb|以二进制格式打开一个文件只用于写入，如果该文件已存在则打开文件，删除原有文件内容并从开头开始编辑，如果该文件不存在，则创建新文件。
w+|以读写模式打开一个文件，如果该文件已存在则打开文件，删除原有文件内容并从开头开始编辑，如果该文件不存在，则创建新文件。
wb+|以二进制格式打开一个文件用于读写，如果该文件已存在则打开文件，删除原有文件内容并从开头开始编辑，如果该文件不存在，则创建新文件。
a|以追加模式打开一个文件，如果该文件已存在，文件指针将会放在文件的结尾，将新内容写入到已有内容之后，如果该文件不存在，创建新文件进行写入。
ab|以二进制格式打开一个文件用于追加，如果该文件已存在，文件指针将会放在文件的结尾，将新内容写入到已有内容之后，如果该文件不存在，创建新文件进行写入。
a+|以追加模式打开一个文件，如果该文件已存在，文件指针将会放在文件的结尾，将新内容写入到已有内容之后，如果该文件不存在，创建新文件进行写入。
ab+|以二进制格式打开一个文件用于追加，如果该文件已存在，文件指针将会放在文件的结尾，将新内容写入到已有内容之后，如果该文件不存在，创建新文件进行写入。

简单总结起来就是： r (read)读取，w (write)写入，a (add)追加，配上 + 后可读可写。

### 1.2 文件的打开和关闭

#### 1.2.1 Python 内置文件打开和关闭函数

**open(file, mode=‘r’, buffering=-1, encoding=None)，文件打开函数，返回一个 file 对象，从而可以对文件进行读写操作。**

- file，要访问的文件名称，是一个字符串值，比如：'python-100.txt'，或者可以包含文件路径，即'C:\Users\Desktop\python-100.txt'。
- mode，决定了文件的打开模式，默认是 'r' 只读模式。
- buffering，如果 buffering 的值被设为 0，就不会有寄存。如果 buffering 的值取 1，访问文件时会寄存行。如果将 buffering 的值设为大于 1 的整数，表明了这就是的寄存区的缓冲大小。如果取负值，寄存区的缓冲大小则为系统默认。
- encoding，对文件的内容进行编码，比如采用 'utf-8' 编码方法。

**close()，文件关闭函数，没有返回值，用于关闭一个已打开的文件，关闭后的文件不能再进行读写操作。**

- close() 函数没有参数。

#### 1.2.1 open() + close() 模式

每一个文件打开 open() 函数必须搭配一个文件关闭函数 close()，这样养成一个良好的编码习惯。

示例：
```
# 打开 'python-100.txt' 文件，如果文件不存在会在程序文件 *.py 所在的目录下创建该文件。

file = open('python-100.txt', 'w')
print('测试1：python-100.txt 文件已打开。')

# 关闭已打开的 'python-100.txt' 文件

file.close()
print('测试1：python-100.txt 文件已关闭。')

# 打开 'C:\Users\Desktop\py' 路径下的 'python-100.txt' 文件。

file = open('C:\\\\Users\\\\Desktop\\\\py\\\\python-100.txt', 'w')
print('测试2：python-100.txt 文件已打开。')

# 关闭已打开的 'python-100.txt' 文件

file.close()
print('测试2：python-100.txt 文件已关闭。')
```

#### 1.2.2 with + open() 模式

这种模式下文件打开之后不需要写入文件关闭函数 close()，程序会在执行完 with 结构体中的程序后自动关闭打开的文件。

示例：
```
# 打开 'python-100.txt' 文件，如果文件不存在会在程序文件 *.py 所在的目录下创建该文件。

with open('python-100.txt', 'w') as f:

    print('测试1：python-100.txt 文件已打开。')

print('测试1：python-100.txt 文件已关闭。')

# 打开 'C:\Users\Desktop\py' 路径下的 'python-100.txt' 文件。

with open('C:\\\\Users\\\\Desktop\\\\py\\\\python-100.txt', 'w') as f:

    print('测试2：python-100.txt 文件已打开。')

print('测试2：python-100.txt 文件已关闭。')
```

## 2 读取和写入文件内容

### 2.1 文件读写方法

当我们打开一个文件之后，根据需要我们会对文件内容进行一些操作， Python 当然为我们提供了文件内容的读写方法。

以下表格内列出了一些常用的文件读写方法：

读写方法|描述|
:-:|-|-
read()|一次性将文件中的内容全部读取出来，缺点就是文件过大的话很容易导致内存崩溃。
read(n)|一次读取 n 个字符，如果再次读取，会在上一次读取过后的位置接着去读取而不是从头开始读取, 如果使用的是 rb 模式，则读取出来的是 n 个字节。
readline()|一次读取一行内容，每次读取出来的内容都以换行符 '\n' 结尾。
readlines()|一次读取打开文件的全部内容，返回一个列表，每一行内容作为元素放到一个列表中，缺点就是文件内容过大容易出现内存崩溃的问题。
write(s)|写入字符串 s，如果再次写入，会在上一次写入的位置末尾继续写入。
writelines(s)|写入字符串或列表 s，如果是列表的话列表中的所有元素必须为 string 类型，如果再次写入，会在上一次写入的位置末尾继续写入。

### 2.2 文件读应用

#### 2.2.1 read() 示例

```
# 以 r 模式打开本地建立的 python-100.txt 文件，以 'utf-8' 编码读取文件中的所有内容

with open('python-100.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    print(content)

# 输出结果
# Python-100
# 坚持100天
```

#### 2.2.2 read(n) 示例

```
# 1.以 r 模式打开本地建立的 python-100.txt 文件，每次读取 n 个字符

with open('python-100.txt', 'r', encoding='utf-8') as f:
    content = f.read(8)
    print(content)

    content = f.read(8)
    print(content)

# 输出结果(注意：每次读取到的换行符 '\n' 也是算一个字符的，换行符位于每行内容的末尾)
# Python-1
# 00
# 坚持100

# 2.以 rb 模式打开本地建立的 python-100.txt 文件，每次读取 n 个字节，注意是字节

with open('python-100.txt', 'rb') as f:
    content = f.read(8)
    print(content)

    content = f.read(8)
    print(content)

# 输出结果
# b'Python-1'
# b'00\r\n\xe5\x9d\x9a\xe6'
```

#### 2.2.3 readline() 示例

```
# 以 r 模式打开本地建立的 python-100.txt 文件，每次读取文件中的一行内容，利用 strip() 函数去掉每一行末尾的换行符

with open('python-100.txt', 'r', encoding='utf-8') as f:
    firstLine = f.readline().strip('\n')
    secondLine = f.readline().strip('\n')

    print(firstLine)
    print(secondLine)

# 输出结果
# Python-100
# 坚持100天
```

#### 2.2.4 readlines() 示例

```
# 以 r 模式打开本地建立的 python-100.txt 文件，读取文件中所有内容，以列表形式返回

with open('python-100.txt', 'r', encoding='utf-8') as f:
    content = f.readlines()
    print(content)

    for line in content:
        print(line.strip('\n'))

# 输出结果
# ['Python-100\n', '坚持100天']
# Python-100
# 坚持100天
```

#### 2.2.5 循环读取文件内容示例

```
# 每次读取一行内容，该方法较为实用

with open('python-100.txt', 'r', encoding='utf-8') as f:
    for line in f:
        print(line.strip('\n'))

# 输出结果
# Python-100
# 坚持100天
```

### 2.3 文件写应用

#### 2.3.1 write() 示例

```
# 以 r 模式打开本地建立的空文件 python-100.txt，向文件中写入内容并读取

f = open('python-100.txt', 'w', encoding='utf-8')

f.write('Python-100\n')
f.write('坚持100天')

f.close()

f = open('python-100.txt', 'r', encoding='utf-8')

print(f.read())

f.close()

# 输出结果
# Python-100
# 坚持100天
```

#### 2.3.2 writelines() 示例

```
# 以 r 模式打开本地建立的空文件 python-100.txt，向文件中写入内容并读取

f = open('python-100.txt', 'w', encoding='utf-8')

content = ['Python-100\n', '坚持100天']
f.writelines(content)

f.close()

f = open('python-100.txt', 'r', encoding='utf-8')
print(f.read())

f.close()

# 输出结果
# Python-100
# 坚持100天
```

## 3 文件内容定位

定位方法|描述|
:-:|-|-
tell()|返回当前文件读取指针在什么位置，按字节数来确定的。
seek(n)|用于移动文件读取指针到指定位置，移动的单位为字节。

**tell() 函数应用示例**

```
# 以 w 模式打开本地建立的空文件 python-100.txt，获取文件中读取指针的位置

f = open('python-100.txt', 'w', encoding='utf-8')

print('打开空文件时，指针位置为:', f.tell())
f.write('Python-100\n' + '坚持100天')  # 'utf-8'编码格式下，换行符占 2 个字节，汉字占 3 个字节
print('写入内容后，指针位置为:', f.tell())

f.close()

# 输出结果：
# 打开空文件时，指针位置为: 0
# 写入内容后，指针位置为: 24
```

**seek(offset, whence=0) 函数应用示例**

- offset，移动偏移的字节数，如果是负数表示从倒数第几位开始。
- whence，可选参数，默认值为 0。0 代表从文件开头开始算偏移量，1 代表从当前位置开始算，2 代表从文件末尾算起。

```
# 以 r 模式打开文件 python-100.txt，移动文件中读取指针的位置

f = open('python-100.txt', 'rb')

print("1.文件内容为:")
print(f.read().decode('utf-8'))

f.seek(6)
print('\n2.偏移量为 12 个字节时，输出内容为:')
print(f.read().decode('utf-8'))

f.seek(-12, 2)
print('\n3.偏移量为 -12 个字节时，输出内容为:')
print(f.read().decode('utf-8'))

print('\n4.在当前指针位置偏移:')
f.seek(12)
print('文件指针当前位置为：', f.tell())
f.seek(-6, 1)
print('文件指针当前位置为：', f.tell())
f.seek(6, 1)
print('文件指针当前位置为：', f.tell())
print(f.read().decode('utf-8'))

f.close()

# 输出结果:
# 1.文件内容为:
# Python-100
# 坚持100天
#
# 2.偏移量为 12 个字节时，输出内容为:
# -100
# 坚持100天
#
# 3.偏移量为 -12 个字节时，输出内容为:
# 坚持100天
# 
# 4.在当前指针位置偏移:
# 文件指针当前位置为： 12
# 文件指针当前位置为： 6
# 文件指针当前位置为： 12
# 坚持100天
```

## 4 总结

本节给大家介绍了 Python 中 文件操作的基本使用方法，主要是文件的读写操作，可以助您更高效的处理爬虫获取到的消息内容。

## 参考资料

[1] https://www.cnblogs.com/MayDayTime/p/9157432.html

[2] https://www.runoob.com/python/python-files-io.html

> 示例代码：[Python-100-days-day93](https://github.com/JustDoPython/python-100-day)