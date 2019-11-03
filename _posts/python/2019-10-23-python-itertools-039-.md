---
layout: post
title:  第39天： Python itertools 模块
category: python
copyright: python
---

by 豆豆

## 简介

在 Python 中，迭代器是一种非常好用的数据结构，其最大的优势就是延迟生成，按需使用，从而大大提高程序的运行效率。而 itertools 作为 Python 的内置模块，就为我们提供了一套非常有用的用于操作可迭代对象的函数。

<!--more-->

## 常用功能

### count 功能详解

count(start=0,step=1) 函数有两个参数，其中 step 是默认参数，可选的，默认值为 1。 该函数返回一个新的迭代器，从 start 开始，返回以 step 为步长的均匀间隔的值。

```python
import itertools
x = itertools.count(1,2)
for k in x:
	print(k, end=", ")

# 输出结果如下 无穷无尽
1, 3, 5, 7, 9, 11, 13, 15, ...
```

### cycle 功能详解

cycle(iterable) 该函数会把接收到的序列无限重复下去。

```python
import itertools
x = itertools.cycle("XYZ")
for k in x:
	print(k, end = ", ")
  
# 输出结果如下 无穷无尽
X, Y, Z, X, Y, Z, X, Y, Z, ...
```

注意，该函数可能需要相当大的辅助空间（取决于 iterable 的长度）。

### repeat 功能详解

repeat(object, times) 该函数创建一个迭代器，不断的重复 object，当然如果指定 times 的话，则只会重复 times 次。

```python
import itertools
x = itertools.repeat("XYZ")
for k in x:
	print(k, end = ", ")
  
# 输出结果如下 无穷无尽
XYZ, XYZ, XYZ, XYZ, XYZ, XYZ, ...
```

```python
import itertools
x = itertools.repeat("XYZ", 3)
print(list(x))

# 输出结果如下 只会输出三次
['XYZ', 'XYZ', 'XYZ']
```

注意：无限循环迭代器只有在 for 循环中才会不断的生成元素，如果只是创建一个迭代器对象，则不会事先生成无限个元素。

### chain 功能详解

chain(*iterables) 该函数创建一个新的迭代器，会将参数中的所有迭代器全包含进去。

```python
import itertools
x = itertools.chain("abc", "xyz")
print(list(x))

# 输出结果如下
['a', 'b', 'c', 'x', 'y', 'z']
```

### groupby 功能详解

groupby(iterable, key=None) 分组函数，将 key 函数作用于序列的各个元素。根据 key 函数的返回值将拥有相同返回值的元素分到一个新的迭代器。类似于 SQL 中的 GROUP BY 操作，唯一不同的是该函数对序列的顺序有要求，因为当 key 函数的返回值改变时，迭代器就会生成一个新的分组。因此在使用该函数之前需要先使用同一个排序函数对该序列进行排序操作。


```python
import itertools
def sortBy(score):
	if score > 80:
		return "A"
	elif score >= 60:
		return "B"
	else:
		return "C"

scores = [81, 82, 84, 76, 64, 78, 59, 44, 55, 89]
for m, n in itertools.groupby(scores, key=sortBy):
	print(m, list(n))

# 输出结果如下
A [81, 82, 84]
B [76, 64, 78]
C [59, 44, 55]
A [89]
```

我们可以看到，该函数根据我们自定义的排序函数 sortBy 将列表中的元素进行了分组操作，只是我们发现最后一个怎么多了一个 A 的分组呢，这就是我们上面说所得「当 key 函数的返回值改变时，迭代器就会生成一个新的分组」。所以，我们需要事先对列表用 sortBy 函数排一下序。

```python
scores = [81, 82, 84, 76, 64, 78, 59, 44, 55, 89]
scores = sorted(scores, key=sortBy)
for m, n in itertools.groupby(scores, key=sortBy):
	print(m, list(n))

# 输出结果如下
A [81, 82, 84]
B [76, 64, 78]
C [59, 44, 55]
A [89]
```

### compress 功能详解

compress(data, selectors) 该函数功能很简单，就是根据 selectors 中的值判断是否保留 data 中对应位置的值。

```python
import itertools
data = [81, 82, 84, 76, 64, 78]
tf = [1,1,0,1,1,0]
print(list(itertools.compress(data, tf)))

# 输出结果如下
[81, 82, 76, 64]
```

### dropwhile 功能详解

dropwhile(predicate, iterable) 创建一个迭代器，从 predicate 首次为 false 时开始迭代元素。

```python
import itertools
x = itertools.dropwhile(lambda x: x < 5, [1,3,5,7,4,2,1])
print(list(x))

# 输出结果如下
[5, 7, 4, 2, 1]
```
由以上得知，即使 predicate 首次为 false 后面的元素不满足 predicate 也同样会被迭代。

### filterfalse 功能详解

filterfalse(predicate, iterable) 创建一个迭代器，返回 iterable 中 predicate 为 false 的元素。

```python
import itertools
x = itertools.filterfalse(lambda x: x < 5, [1,3,5,7,4,2,1])
print(list(x))

# 输出结果如下
[5, 7]
```

### islice 功能详解

islice(iterable, start, stop[, step]) 对 iterable 进行切片操作。从 start 开始到 stop 截止，同时支持以步长为 step 的跳跃。

```python
import itertools
print(list(itertools.islice('123456789', 2)))
print(list(itertools.islice('123456789', 2, 4)))
print(list(itertools.islice('123456789', 2, None)))
print(list(itertools.islice('123456789', 0, None, 2)))

# 输出结果如下
['1', '2']
['3', '4']
['3', '4', '5', '6', '7', '8', '9']
['1', '3', '5', '7', '9']
```

### starmap 功能详解

starmap(function, iterable) 从可迭代对象中获取参数来执行该函数。

```python
import itertools
print(list(itertools.starmap(pow,[(2,10), (3,3)])))

# 输出结果如下
[1024, 27]
```

### takewhile 功能详解

takewhile(predicate, iterable) 创建一个迭代器，遇到 predicate 为 false 则停止迭代元素。与 dropwhile 完全相反。

```python
import itertools
x = itertools.takewhile(lambda x: x < 5, [1,3,5,7,4,2,1])
print(list(x))

# 输出结果如下
[1, 3]
```

### product 功能详解

product(*iterables, repeat=1) 输出可迭代对象的笛卡尔积，有点类似于嵌套循环。其中 repeat 可以设置循环次数。


```python
import itertools
print(list(itertools.product("ab", "12")))
print(list(itertools.product("ab", "ab")))
print(list(itertools.product("ab", repeat=2)))

# 输出结果如下
[('a', '1'), ('a', '2'), ('b', '1'), ('b', '2')]
[('a', 'a'), ('a', 'b'), ('b', 'a'), ('b', 'b')]
[('a', 'a'), ('a', 'b'), ('b', 'a'), ('b', 'b')]
```

### permutations 功能详解

permutations(iterable, r=None) 返回 iterable 中长度为 r 的所有排列。默认值 r 为 iterable 的长度。即使元素的值相同，不同位置的元素也被认为是不同的。

```python
import itertools
print(list(itertools.permutations("aba", r=2)))

# 输出结果如下
[('a', 'b'), ('a', 'a'), ('b', 'a'), ('b', 'a'), ('a', 'a'), ('a', 'b')]
```

### combinations 功能详解

combinations(iterable, r=None) 返回 iterable 中长度为 r 的有序排列。默认值 r 为 iterable 的长度。 与 permutations 操作不同的是该函数严格按照 iterable 中元素的顺序进行排列。

```python
import itertools
print(list(itertools.combinations("abc", r=2)))

# 输出结果如下
[('a', 'b'), ('a', 'c'), ('b', 'c')]
```

### combinations_with_replacement 功能详解

combinations_with_replacement(iterable, r=None) 返回 iterable 中长度为 r 的有序排列。默认值 r 为 iterable 的长度。 与 combinations 操作不同的是该函数允许每个元素重复出现。

```python
import itertools
print(list(itertools.combinations_with_replacement("abc", r=2)))

# 输出结果如下
[('a', 'a'), ('a', 'b'), ('a', 'c'), ('b', 'b'), ('b', 'c'), ('c', 'c')]
```

## itertools 总结

本文总结了 itertools 模块的常规操作，学习并掌握这些极为便利的操作非常有助于提高自己的编码效率。

## 代码地址

> 示例代码：[Python-100-days-day039](https://github.com/JustDoPython/python-100-day/tree/master/day-039)

## 参考资料
[Python 文档 itertools](https://docs.python.org/zh-cn/3/library/itertools.html)

