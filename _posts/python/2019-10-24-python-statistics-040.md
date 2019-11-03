---
layout: post
title:  第40天： Python statistics 模块
category: python
copyright: python
---

by 豆豆

## 简介

随着互联网的普及，整个互联网每天都会产生海量的数据，如何有效地处理这些数据成为了互联网人的必备技能，而 Python 内置的 statistics 模块提供了基本的数据统计操作。

<!--more-->

## 常用功能

### mean(data)

mean(data) 用于求给定序列或者迭代器的算术平均数。

```python
import statistics
example_list = [1,2,3,4,5,6]
x = statistics.mean(example_list)
print(x)

# 输出结果
3.5
```

### harmonic_mean(data)

harmonic_mean(data) 用于计算数据的调和均值。

```python
x = statistics.harmonic_mean(example_list)
print(x)
print(1/sum([1/1,1/2,1/3,1/4,1/5,1/6])*6)

# 输出结果
2.4489795918367347
2.448979591836735
```

### median(data)

median(data) 计算数据的中位数。如果有两个中位数，则返回其平均值。

```python
x = statistics.median(example_list)
print(x)

# 输出结果
3.5
```

### median_low(data)

median_low(data) 也是用于计算中位数的，如果有两个中位数，返回较小的那个。

```python
x = statistics.median_low(example_list)
print(x)

# 输出结果
3
```

### median_high(data)

median_high(data) 也是用于计算中位数的，如果有两个中位数，返回较大的那个。

```python
x = statistics.median_high(example_list)
print(x)

# 输出结果
4
```


### mode(data)

mode(data) 计算众数，也就是序列中出现次数最多的元素。

```python
x = statistics.mode([1,1,2,3,4,3,3,3,3])
print(x)

x = statistics.mode(["a","b","c","d","d","a","a",])
print(x)

# 输出结果
3
a
```

### pstdev(data, mu=None)

pstdev(data, mu=None) 用于计算数据的总体标准差。其中 mu 是序列的均值，如果你已经知道了该序列的均值，可传入该参数以减少计算量，当然该函数不会去验证你传入的均值是否合法，使用错误的均值可能会产生无效的结果。

```python
x = statistics.pstdev([2,2,2,6])
print(x)

# 输出结果
1.7320508075688772
```


### pvariance(data, mu=None)

pvariance(data, mu=None) 用于计算数据的总体方差。

```python
x = statistics.pvariance([2,2,2,6])
print(x)

# 输出结果
3
```


### stdev(data, xbar=None)

stdev(data, xbar=None) 用于计算数据的样本标准差。其中 xbar 是序列的均值，如果你已经知道了该序列的均值，可传入该参数以减少计算量，当然该函数不会去验证你传入的均值是否合法，使用错误的均值可能会产生无效的结果。

```python
x = statistics.stdev([2,2,2,6])
print(x)

# 输出结果
2.0
```


### variance(data, xbar=None)

variance(data, xbar=None) 用于计算数据的样本方差。

```python
x = statistics.variance([2,2,2,6])
print(x)

# 输出结果
4
```

## statistics 总结

本文总结了 statistics 模块的常规操作，对于数据分析还是非常有益处的。

## 代码地址

> 示例代码：[Python-100-days-day040](https://github.com/JustDoPython/python-100-day/tree/master/day-040)

## 参考资料
[Python 文档 statistics](https://docs.python.org/zh-cn/3.7/library/statistics.html)

