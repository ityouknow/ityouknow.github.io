---
layout: post
title:  第18天：Python 高阶函数
category: python
copyright: python
---

>  by 小小摸虾

函数式编程现在逐渐被广大开发群体接受，越来越多的开发者门开始使用这种优雅的开发模式，而我们使用函数式编程最主要的是需要清楚：
1. 什么是高阶函数（**Higher-order Functions**）？
2. Python 中高阶函数有哪些？要怎么用？

<!--more-->

## 高阶函数概念

在函数式编程中，我们可以将函数当作变量一样自由使用。一个函数接收另一个函数作为参数，这种函数称之为高阶函数。

举个例子：

```python
def high_func(f, arr):
    return [f(x) for x in arr]
```

上面的例子中， `high_func`  就是一个高阶函数。其中第一个参数  `f`  是一个函数，第二个参数  `arr`  是一个数组，返回的值是数组中的所有的值在经过  `f`  函数计算后得到的一个列表。例如：

```python
from math import factorial

def high_func(f, arr):
    return [f(x) for x in arr]

def square(n):
    return n ** 2

# 使用python自带数学函数
print(high_func(factorial, list(range(10))))
# print out: [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880]

# 使用自定义函数
print(high_func(square, list(range(10))))
# print out: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

## Python 常用高阶函数

如同 java、scala 等语言，我们很多常用的高阶函数基本都一致。在开发中我们经常使用的最基本的高阶函数其实就几个，而我们也可以基于这些函数去进行适当的扩展，那么下面开始介绍几种常用的高阶函数。

### map

> Make an iterator that computes the function using arguments from each of the iterables.  Stops when the shortest iterable is exhausted.

根据提供的函数对指定序列做映射, 并返回映射后的序列，定义：

```python
map(func, *iterables) --> map object
```

-  `function`  # 序列中的每个元素需要执行的操作, 可以是匿名函数
-  `*iterables`  # 一个或多个序列

正如前面所举的例子  `high_func` 函数， `map`  函数是  `high_func` 函数高阶版，可以传入一个函数和多个序列。

```python
from math import factorial

def square(n):
    return n ** 2

# 使用python自带数学函数
facMap = map(factorial, list(range(10)))
print(list(facMap))
# print out: [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880]

# 使用自定义函数
squareMap = map(square, list(range(10)))
print(list(squareMap))
# print out: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

可以看到输出了同样的结果，只是与  `python2.X`  不同的是，  `python3.X`  中返回  `map` 类
，而前者直接返回一个列表。

我们使用匿名函数，也可以传入多个序列，如下

```python
# 使用匿名函数
lamMap = map(lambda x: x * 2, list(range(10)))
print(list(lamMap))
# print out: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# 传入多个序列
mutiMap = map(lambda x, y: x+y, list(range(10)), list(range(11, 15)))
print(list(mutiMap))
# print out: [11, 13, 15, 17]
```

### reduce

> *Apply a function of two arguments cumulatively to the items of a sequence,from left to right, so as to reduce the sequence to a single value*.

大致上来讲， `reduce`  函数需要传入一个有两个参数的函数，然后用这个函数从左至右顺序遍历序列并生成结果，定义如下：

```python
reduce(function, sequence[, initial]) -> value
```
-  `function`  # 函数, 序列中的每个元素需要执行的操作, 可以是匿名函数
-  `sequence`  # 需要执行操作的序列
-  `initial`   # 可选，初始参数

最后返回函数的计算结果, 和初始参数类型相同

简单举个例子：

```python
# 注意，现在 reduce() 函数已经放入到functools包中。
from functools import reduce

result = reduce(lambda x, y: x + y, [1, 2, 3, 4, 5])

print(result)
# print out 15
```

我们可以看到，序列  `[1, 2, 3, 4, 5]`  通过匿名函数进行了累加。
    
设定初始值：

```python
# 设定初始参数：
s = reduce(lambda x, y: x + y, ['1', '2', '3', '4', '5'], "数字 = ")

print(s)
# print out： 数字 = 12345
```

需要注意的是：序列数据类型需要和初始参数一致。

### filter

> Return an iterator yielding those items of iterable for which function(item) is true. If function is None, return the items that are true.

 `filter()`  函数用来过滤序列中不符合条件的值，返回一个迭代器，该迭代器生成那些函数(项)为 true 的 iterable 项。如果函数为 None，则返回为 true 的项。定义如下：

```python
filter(function or None, iterable) --> filter object
```

-  `function or None`  # 过滤操作执行的函数
-  `iterable`  # 需要过滤的序列

举个例子：

```python
def boy(n):
    if n % 2 == 0:
        return True
    return False

# 自定义函数
filterList = filter(boy, list(range(20)))

print(list(filterList))
# print out: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# 自定义函数
filterList2 = filter(lambda n: n % 2 == 0, list(range(20)))

print(list(filterList2))
# print out: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

上面我们可以看到，列表中不能被  `2`  整除的数据都被排除了。


### sorted

> Return a new list containing all items from the iterable in ascending order.

> A custom key function can be supplied to customize the sort order, and the reverse flag can be set to request the result in descending order.

  `sorted`  函数默认将序列升序排列后返回一个新的 list，还可以自定义键函数来进行排序，也可以设置  `reverse`  参数确定是升序还是降序，如果  `reverse = True`  则为降序。函数定义如下：
 
```python
def sorted(iterable: Iterable[_T], *,
           key: Optional[Callable[[_T], Any]] = ...,
           reverse: bool = ...) -> List[_T]: ...
```

-  `iterable`  # 序列
-  `key`  # 可以用来计算的排序函数。
-  `reverse`  # 排序规则，reverse = True 降序，reverse = False 升序(默认）。

举个简单例子：

```python
list01 = [5, -1, 3, 6, -7, 8, -11, 2]
list02 = ['apple', 'pig', 'monkey', 'money']

print(sorted(list01))
# print out: [-11, -7, -1, 2, 3, 5, 6, 8]

print(sorted(list01, key=abs))
# print out: [-1, 2, 3, 5, 6, -7, 8, -11]

# 默认升序
print(sorted(list02))
# print out: ['apple', 'money', 'monkey', 'pig']

# 降序
print(sorted(list02, reverse=True))
# print out: ['pig', 'monkey', 'money', 'apple']

# 匿名函数排序
print(sorted(list02, key=lambda x: len(x), reverse=True))
# print out: ['monkey', 'apple', 'money', 'pig']
```

## 总结
以上我们简单的介绍了几个常用的高阶函数的使用，当然还有很多的高阶函数我们可以去研究，比如  `zip`  函数等，希望此节的介绍对大家有所帮助。

## 代码地址

> 示例代码：[Python-100-days-day018](https://github.com/JustDoPython/python-100-day/tree/master/day-018)

