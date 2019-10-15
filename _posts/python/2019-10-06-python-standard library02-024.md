---
layout: post
title:  第24天：Python 标准库概览2 
category: python
copyright: python
---

>  by 潮汐

- Python 的标准库非常广泛，提供了各种各样的工具。该库包含内置模块（用C编写），可以访问系统功能，例如 Python 程序员无法访问的文件 I / O，以及用 Python 编写的模块，这些模块为许多问题提供标准化解决方案。其中一些模块明确地旨在通过将平台特定的内容抽象为平台中立的 API 来鼓励和增强 Python 程序的可移植性。
- Python 的标准库(standard library) 是 Python 的一个组成部分，也是 Python 的利器，它可以让编程事半功倍。
- Python 标准库第二部分涵盖的模块是包含在 Python 高级编程中，这一部分所涉及的模块很少运用在脚本中
  
<!--more--> 

## 13、格式化输出

### 13.1 reprlib 模块

reprlib 模块提供了一个定制化版本的 repr() 函数，用于缩略显示大型或深层嵌套的容器对象，将容器中的对象按照一定的规律输出
reprlib 模块包含了一个类、一实例对象、一方法

1. class reprlib.Repr 
   >  Repr类,
    该类提供格式化服务，对于实现与内置的 repr() 类似的函数很有用;添加了不同对象类型的大小限制，以避免生成过长的表示。
2. reprlib.aRepr  
   > Repr 类的实例，用于提供下面描述的 Repr() 函数。更改此对象的属性将影响 repr() 和 Python 调试器使用的大小限制。
3. reprlib.repr(obj)
   > 这是 aRepr 的 repr() 方法。它返回一个与内置同名函数返回的字符串类似的字符串，但对大多数大小都有限制
4. @reprlib.recursive_repr(fillvalue="...")   
   > 方法的装饰器，用于检测同一线程中的递归调用。如果执行递归调用，则返回fillvalue，否则执行通常的调用。

例如:

```
# 导入模块
from reprlib import recursive_repr
class MyList(list):
    @recursive_repr()
    def __repr__(self):
        return '<' + '|'.join(map(repr, self)) + '>'
m = MyList('abc')
m.append(m)
m.append('x')
print(m)
```

输出结果为：

```
<'a'|'b'|'c'|...|'x'>
```


**Repr 对象具有的属性**

- Repr.maxlevel --- 递归表示的深度限制，默认是6
- Repr.maxdict
- Repr.maxlist
- Repr.maxtuple
- Repr.maxset
- Repr.maxfrozenset
- Repr.maxdeque
- Repr.maxarray  ----命名对象类型的条目数限制，maxdict是4，maxarray是5，其它是6
- Repr.maxlong   ---- 表示一个整数最大字符数，默认40
- Repr.maxstring ---- 表示一个字符串最大字符数，默认30
- Repr.maxother  ---- 表示其他类型的最大字符数，默认20

例如：


```
# 递归实例演示
import reprlib
a = [1,2,3,[4,5],6,7]
reprlib.aRepr.maxlevel = 1
print(reprlib.repr(a))
```

输出结果为：

```
[1, 2, 3, [...], 6, 7]
```

### 13.2 pprint 模块

pprint 模块提供了更加复杂的打印控制，其输出的内置对象和用户自定义对象能够被解释器直接读取。当输出结果过长而需要折行时，“美化输出机制”会添加换行符和缩进，以更清楚地展示数据结构

### 13.3 textwrap 模块

textwrap 模块能够格式化文本段落，以适应给定的屏幕宽度，
该模块提供了一些便利功能以及可以完成所有工作的类。如果只是包装或填充一个或两个文本字符串，那么便利功能应该足够好；否则应该使用一个模块化功能提高效率。

### 13.4 locale 模块

locale 模块处理与特定地域文化相关的数据格式。locale 模块的 format 函数包含一个 grouping 属性，可直接将数字格式化为带有组分隔符的样式


## 14、string 模板

string 模块包含一个通用的 Template 类，具有适用于最终用户的简化语法。它允许用户在不更改应用逻辑的情况下定制自己的应用

## 15、使用二进制数据记录格式

struct 模块提供了 pack() 和 unpack() 函数，用于处理不定长度的二进制记录格式。下面的例子展示了在不使用 zipfile 模块的情况下，如何循环遍历一个 ZIP 文件的所有头信息。Pack 代码 "H" 和 "I" 分别代表两字节和四字节无符号整数。"<" 代表它们是标准尺寸的小尾型字节序

## 16、多线程

线程是一种对于非顺序依赖的多个任务进行解耦的技术。多线程可以提高应用的响应效率，当接收用户输入的同时，保持其他任务在后台运行。一个有关的应用场景是，将 I/O 和计算运行在两个并行的线程中，在程序编写过程中，熟悉多线程的应用能提高代码运行效率

## 17、日志

Python 日志模块 logging 模块提供功能齐全且灵活的日志记录系统。在最简单的情况下，日志消息被发送到文件或 sys.stderr。
日志系统可以直接从 Python 配置，也可以从用户配置文件加载，以便自定义日志记录而无需更改应用程序。

## 18、弱引用

Python 会自动进行内存管理（对大多数对象进行引用计数并使用 garbage collection 来清除循环引用）。当某个对象的最后一个引用被移除后不久就会释放其所占用的内存

## 19、用于操作列表的工具

许多对于数据结构的需求可以通过内置列表类型来满足。 但是，有时也会需要具有不同效费比的替代实现。

### 19.1 array 模块

array 模块提供了一种 array() 对象，它类似于列表，但只能存储类型一致的数据且存储密集更高。 下面的例子演示了一个以两个字节为存储单元的无符号二进制数值的数组 (类型码为 "H")，而对于普通列表来说，每个条目存储为标准 Python 的 int 对象通常要占用16 个字节:

```
>>> from array import array
>>> a = array('H', [4000, 10, 700, 22222])
>>> sum(a)
26932
>>> a[1:3]
array('H', [10, 700])
```

### 19.2 collections 模块

collections 模块提供了一种 deque() 对象，它类似于列表，但从左端添加和弹出的速度较快，而在中间查找的速度较慢。 此种对象适用于实现队列和广度优先树搜索:

```
>>>
>>> from collections import deque
>>> d = deque(["task1", "task2", "task3"])
>>> d.append("task4")
>>> print("Handling", d.popleft())
Handling task1
unsearched = deque([starting_node])
def breadth_first_search(unsearched):
    node = unsearched.popleft()
    for m in gen_moves(node):
        if is_goal(m):
            return m
        unsearched.append(m)
```

在替代的列表实现以外，标准库也提供了其他工具，例如 bisect 模块具有用于操作排序列表的函数:


```
>>>
>>> import bisect
>>> scores = [(100, 'perl'), (200, 'tcl'), (400, 'lua'), (500, 'python')]
>>> bisect.insort(scores, (300, 'ruby'))
>>> scores
[(100, 'perl'), (200, 'tcl'), (300, 'ruby'), (400, 'lua'), (500, 'python')]
```

### 19.3 heapq 模块

heapq 模块提供了基于常规列表来实现堆的函数。 最小值的条目总是保持在位置零。 这对于需要重复访问最小元素而不希望运行完整列表排序的应用来说非常有用:

```
>>>
>>> from heapq import heapify, heappop, heappush
>>> data = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0]
>>> heapify(data)                      # rearrange the list into heap order
>>> heappush(data, -5)                 # add a new entry
>>> [heappop(data) for i in range(3)]  # fetch the three smallest entries
[-5, 0, 1]
```

## 20、十进制浮点运

decimal 模块提供了一种 Decimal 数据类型用于十进制浮点运算。相比内置的 float 二进制浮点实现，该类特别适用于以下几种场景：

- 财务应用和其他需要精确十进制表示的用途，

- 控制精度，

- 控制四舍五入以满足法律或监管要求，

- 跟踪有效小数位，或

- 用户期望结果与手工完成的计算相匹配的应用程序。

例如，使用十进制浮点和二进制浮点数计算 70 美分手机和 5％ 税的总费用，会产生的不同结果。如果结果四舍五入到最接近的分数差异会更大

## 总结

本节给大家介绍了 Python 常用标准库的基本概念，在后续的文章中将对具体的模块作详细介绍，更好的对 Python 工程师使用标准库提供支撑。

> 示例代码：[Python-100-days-day029](https://github.com/JustDoPython/python-100-day/tree/master/day-024)

参考：

https://docs.python.org/3/library/reprlib.html
https://docs.python.org/3/library/
