---
layout: post
title:  第85天：NumPy 统计函数
category: python
copyright: python
---

by 闲欢

数学统计在我们的程序当中特别是数据分析当中是必不可少的一部分，本文就来介绍一下 NumPy 常见的统计函数。
<!--more-->

## 最大值与最小值

### numpy.amin()

> 用于计算数组中的元素沿指定轴的最小值。

可以通过 axis 参数传入坐标轴来指定统计的轴，当指定 axis 时，axis 的范围为 ndarray 的维度范围，可以利用 shape 函数获取 ndrray 的维度。我们来看例子：

```
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('最小值', 15, '*'))
print("所有维度的最小值：")
print(np.amin(a))
print('\n')
print("0轴的最小值：")
print(np.amin(a, 0))
print('\n')
print("1轴的最小值：")
print(np.amin(a, 1))
print('\n')

# 返回
初始数组：
[[1 2 3]
 [4 5 6]
 [7 8 9]]
******最小值******
所有维度的最小值：
1
0轴的最小值：
[1 2 3]
1轴的最小值：
[1 4 7]
```

我们例子中使用的是二维数组，所以 axis 只有取0和1两个值。其实我们还可以用 `numpy.min()` 来计算，效果是一样的，只不过 NumPy 的官方文档上没有写 `numpy.min()` 这个方法，看源码我们知道这个方法其实是 `numpy.amin()` 的别名。

### numpy.amax()

> 用于计算数组中的元素沿指定轴的最大值。

可以通过 axis 参数传入坐标轴来指定统计的轴，当指定 axis 时，axis 的范围为 ndarray 的维度范围，可以利用 shape 函数获取 ndrray 的维度。我们来看例子：

```
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('最大值', 15, '*'))
print("所有维度的最大值：")
print(np.amax(a))
print('\n')
print("0轴的最大值：")
print(np.amax(a, 0))
print('\n')
print("1轴的最大值：")
print(np.amax(a, 1))
print('\n')

# 返回
初始数组：
[[1 2 3]
 [4 5 6]
 [7 8 9]]
******最大值******
所有维度的最大值：
9
0轴的最大值：
[7 8 9]
1轴的最大值：
[3 6 9]
```

这个函数和 `numpy.amin()` 函数是相反的含义，也可以用 `numpy.max()` 来计算。

### numpy.ptp()

> 计算数组中元素最大值与最小值的差（最大值 - 最小值）。

实例：

```
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('最大值与最小值的差', 15, '*'))
print("所有维度的极差：")
print(np.ptp(a))
print('\n')
print("0轴的极差：")
print(np.ptp(a, 0))
print('\n')
print("1轴的极差：")
print(np.ptp(a, 1))
print('\n')

# 返回
***最大值与最小值的差***
所有维度的极差：
8
0轴的极差：
[6 6 6]
1轴的极差：
[2 2 2]
```

这个方法可以迅速的找出数组中任何维度的最大最小值之差，还是很方便的。


## 中位数

### numpy.percentile()

> 百分位数是统计中使用的度量，表示小于这个值的观察值的百分比。   
numpy.percentile(a, q, axis) 接收以下参数:   
a: 输入数组   
q: 要计算的百分位数，在 0 ~ 100 之间   
axis: 沿着它计算百分位数的轴   

这个百分位怎么理解呢？

例如第60个百分位是这样一个值，它使得至少有60%的数据项小于或等于这个值，且至少有40%的数据项大于或等于这个值。

我们来看看实例：

```
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('百分位数', 15, '*'))
print("50%的分位数，即数组排序之后的中位数：")
print(np.percentile(a, 50))
print('\n')
print("0轴的中位数：")
print(np.percentile(a, 50, 0))
print('\n')
print("1轴的中位数：")
print(np.percentile(a, 50, 1))
print('\n')

# 返回
******百分位数*****
50%的分位数，即数组排序之后的中位数：
5.0
0轴的中位数：
[4. 5. 6.]
1轴的中位数：
[2. 5. 8.]
```

### numpy.median()

> 用于计算数组 a 中元素的中位数（中值）

我们来看实例：

```
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('计算中位数', 15, '*'))
print("所有元素的中位数：")
print(np.median(a))
print('\n')
print("0轴的中位数：")
print(np.median(a, 0))
print('\n')
print("1轴的中位数：")
print(np.median(a, 1))
print('\n')

# 返回
*****计算中位数*****
所有元素的中位数：
5.0
0轴的中位数：
[4. 5. 6.]
1轴的中位数：
[2. 5. 8.]
```

## 总数与均值

### numpy.sum()

> 用于按指定轴计算数组中的元素的和。

实例：

```
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('求和', 15, '*'))
print("所有维度的和：")
print(np.sum(a))
print('\n')
print("按0轴求和：")
print(np.sum(a, 0))
print('\n')
print("按1轴求和：")
print(np.sum(a, 1))
print('\n')

# 返回
*******求和******
所有维度的和：
45
按0轴求和：
[12 15 18]
按1轴求和：
[ 6 15 24]
```

不管按哪个维度求和，得出的结果再相加肯定等于所有维度求和的结果。

### numpy.mean()

> 按轴计算数组中元素的算术平均值。

算术平均值是沿轴的元素的总和除以元素的数量。我们来看实例：

```
import numpy as np

a = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('计算算术平均值', 15, '*'))
print("所有元素的算术平均值：")
print(np.mean(a))
print('\n')
print("0轴的算术平均值：")
print(np.mean(a, 0))
print('\n')
print("1轴的算术平均值：")
print(np.mean(a, 1))
print('\n')

# 返回
****计算算术平均值****
所有元素的算术平均值：
5.0
0轴的算术平均值：
[4. 5. 6.]
1轴的算术平均值：
[2. 5. 8.]
```

### numpy.average()

> 根据在另一个数组中给出的各自的权重计算数组中元素的加权平均值，该函数可以接收一个轴参数，如果没有指定轴，则数组会被展开。

加权平均值是由每个分量乘以权重因子得到的平均值。即将各数值乘以相应的权数，然后加总求和得到总体值，再除以总的单位数。

举个例子：数组[1, 2, 3, 4]对应的权重是[4， 3， 2， 1]，那么加权平均值的计算公式为：
> 加权平均值=(1*4+2*3+3*2+4*1)/(4+3+2+1)

实例：

```
import numpy as np

print(np.char.center('加权平均值', 15, '*'))
b = np.array([1, 2, 3, 4])
print("所有元素的加权平均值（不指定权重相当于求平均值）：")
print(np.average(b))
print('\n')
print("指定权重的加权平均值：")
print(np.average(b, weights=[4, 3, 2, 1]))
print('\n')
print("指定权重的加权平均值以及权重的和：")
print(np.average(b, weights=[4, 3, 2, 1], returned=True))
print('\n')

# 返回
*****加权平均值*****
所有元素的加权平均值（不指定权重相当于求平均值）：
2.5
指定权重的加权平均值：
2.0
指定权重的加权平均值以及权重的和：
(2.0, 10.0)
```

我们可以通过returned参数来设置是否返回权重的和。在上例中，权重数组中元素相加等于10。


## 方差与标准差

### numpy.var()

> 计算数组中元素的方差

统计中的方差（样本方差）是每个样本值与全体样本值的平均数之差的平方值的平均数。计算公式为：

> mean((x - x.mean())** 2)。

我们来看实例：

```
import numpy as np

print(np.char.center('计算方差', 15, '*'))
print(np.var([1, 2, 3, 4]))
print('\n')

# 返回
******计算方差*****
1.25
```

### numpy.std()

> 计算数组中袁术的标准差

标准差是一组数据平均值分散程度的一种度量，是方差的算术平方根。标准差公式如下：

> std = sqrt(mean((x - x.mean())**2))

我们来看实例：

```
import numpy as np

print(np.char.center('计算标准差', 15, '*'))
print(np.std([1, 2, 3, 4]))
print('\n')

# 返回
*****计算标准差*****
1.118033988749895
```


## 总结

本文向大家介绍了 NumPy 的统计函数，包括最大最小值函数、总数与均值函数、中位数函数以及方差与标准差函数。这些函数主要运用在一些数据分析的统计工作中，我们可以不用实现这些统计方法的原理而直接使用函数，使我们的代码简洁而高效。


## 参考

https://numpy.org/devdocs/reference/routines.statistics.html


> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)
