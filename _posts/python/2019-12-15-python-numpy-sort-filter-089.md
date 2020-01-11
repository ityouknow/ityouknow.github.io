---
layout: post
title:  第89天：NumPy 排序和筛选函数
category: python
copyright: python
---

by 闲欢

对于数据分析来说，排序和筛选数据是不可或缺的一部分内容。NumPy 也提供了多种排序和筛选函数，本文就来介绍一下 NumPy 常见的排序和筛选函数。
<!--more-->

## 排序函数

NumPy 中提供了排序相关的函数。排序函数已经帮助我们实现了不同的排序算法，我们只需要拿来直接使用就行。每个排序算法的执行速度，时间复杂度，空间复杂度和算法的稳定性都不相同，我们来看看常见的几种排序算法的比较。

排序算法 | 速度 | 时间复杂度 | 空间复杂度 | 稳定性
---|---|---|---|---
`quicksort`（快速排序） | 1 | `o(n^2)` | 0 | 否
`mergesort`（归并排序） | 2 | `O(n*log(n))` | ~n/2 | 是
`heapsort`（堆排序） | 3 | `O(n*log(n))` | 0 | 否

### numpy.sort(a, axis, kind, order)

这个排序函数有4个参数，我们来看看参数的说明：


参数 | 说明
---|---
a | 要排序的数组
axis | 排序数组的轴，如果没有数组会被展开，沿着最后的轴排序。axis=0 按列排序，axis=1 按行排序
kind | 排序类型，有 `quicksort` 、`mergesort` 、`heapsort` 、`stable` 几种，默认为`quicksort`（快速排序）
order | 排序的字段，针对包含字段的数组

我们来看看实例：

```
import numpy as np
import time

a = np.array([[3, 7, 12, 45], [9, 1, 0, 34]])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('调用 sort() 函数，默认快速排序', 15, '*'))
print(np.sort(a))
print('\n')

print(np.char.center('按列排序', 15, '*'))
print(np.sort(a, axis=0))
print('\n')

b = np.random.randint(1, 1000, size=[10000, 10000])

print(np.char.center('快速排序时间', 15, '*'))
t1 = time.time()
np.sort(b)
t2 = time.time()
print(t2 - t1)
print('\n')

print(np.char.center('堆排序时间', 15, '*'))
t3 = time.time()
np.sort(b, -1, 'heapsort')
t4 = time.time()
print(t4 - t3)
print('\n')

print(np.char.center('归并排序时间', 15, '*'))
t5 = time.time()
np.sort(b, -1, 'mergesort')
t6 = time.time()
print(t6 - t5)
print('\n')

# 根据字段排序
dt = np.dtype([('name', 'S10'), ('age', int)])
c = np.array([("raju", 21), ("anil", 25), ("ravi", 17), ("amar", 27)], dtype=dt)
print(np.char.center('根据字段排序的数组', 15, '*'))
print(c)
print('\n')

print(np.char.center('按 name 排序', 15, '*'))
print(np.sort(c, order='name'))

# 返回
初始数组：
[[ 3  7 12 45]
 [ 9  1  0 34]]
 
调用 sort() 函数，默认
[[ 3  7 12 45]
 [ 0  1  9 34]]
 
******按列排序*****
[[ 3  1  0 34]
 [ 9  7 12 45]]
 
*****快速排序时间****
5.470074892044067

*****堆排序时间*****
6.988600015640259

*****归并排序时间****
5.784327983856201

***根据字段排序的数组***
[(b'raju', 21) (b'anil', 25) (b'ravi', 17) (b'amar', 27)]

***按 name 排序***
[(b'amar', 27) (b'anil', 25) (b'raju', 21) (b'ravi', 17)]
```

在例子中，我们首先使用了默认的按横轴的快速排序算法，可以看到每个数组都是横向排序的。

接下来，我们多加了一个排序的参数，表示按纵轴排序，我们可以从结果中看到，两个数组中对应位置的元素都按照升序排列了。

接着我们随机生成了一个数据量大的多维数组，然后使用三种排序方式，打印了它们排序的时间，从结果中我们可以看到快速排序最快，其次是归并排序，最后是堆排序。需要注意一点的是，有些排序算法不稳定，可能会导致每次运行的结果不一样。另外，数据量也可能会影响不同排序算法排序的效率。

最后我们创建了一个带字段的数组，然后按照 `name` 字段排序。

### numpy.argsort()

> 函数对输入数组沿给定轴执行间接排序，并使用指定排序类型返回数据的索引数组。 这个索引数组用于构造排序后的数组。

我们来看实例：

```
import numpy as np

a = np.array([3, 4, 2])
print("初始数组：")
print(a)
print('\n')

print(np.char.center('调用 argsort() 函数', 15, '*'))
b = np.argsort(a)
print(b)
print('\n')

print(np.char.center('以排序后的顺序重构原数组', 15, '*'))
print(a[b])
print('\n')

# 返回
初始数组：
[3 4 2]

调用 argsort() 函数
[2 0 1]

**以排序后的顺序重构原数组*
[2 3 4]
```

在上面例子中，我们调用 `argsort()` 函数后，返回了初始数组的排序后的索引。然后我们用排序后的索引数组重构原数组，得到排序后的数组。

### numpy.lexsort()

> 函数使用键序列执行间接排序。 键可以看作是电子表格中的一列。 该函数返回一个索引数组，使用它可以获得排序数据。 注意，最后一个键恰好是 sort 的主键。

对于这个函数，我们假设一种场景：现在有语文和数学考试成绩以及总成绩，我们需要对成绩做个排序，排序原则为总分优先，总分相同的语文高的排前面。

实现的代码如下：

```
import numpy as np

print(np.char.center('lexsort() 函数', 15, '*'))
# 录入了四位同学的成绩
math = (10, 20, 50, 10)
chinese = (30, 50, 40, 60)
total = (40, 70, 90, 70)
# 将优先级高的项放在后面
ind = np.lexsort((math, chinese, total))

for i in ind:
    print(total[i], chinese[i], math[i])
    
# 返回
**lexsort() 函数*
40 30 10
70 50 20
70 60 10
90 40 50
```

例子中我们将参数由优先级从低到高传入，优先级最高的放在最后。最后得到4个同学的成绩排序。

### numpy.msort()

> 数组按第一个轴排序，返回排序后的数组副本。

这个排序相当于 numpy.sort(a, axis=0)。很好理解。我们直接来看实例：

```
import numpy as np

print(np.char.center('msort() 函数', 20, '*'))
msa = np.array([[3, 7, 12, 45], [9, 1, 0, 34]])
print(np.msort(msa))

# 返回
*****msort() 函数*****
[[ 3  1  0 34]
 [ 9  7 12 45]]
```

### numpy.partition() 

> 指定一个数，对数组进行分区。

通俗点说，就是指定一个数，以这个数为中心，将其他数分别放在这个数的两边。

我们来看实例：

```
import numpy as np

print(np.char.center('partition() 函数', 20, '*'))
pta = np.array([3, 7, 12, 45, 15, 0])
print(np.partition(pta, 2))
print('\n')
print(np.partition(pta, (2, 4)))
print('\n')

# 返回
***partition() 函数***
[ 0  3  7 45 15 12]
[ 0  3  7 12 15 45]
```

在第一次排序时，我们选中了索引为2的数字7作为中心，将小于7的数放在左边，大于7的数放在右边。在第二次排序时，我们选择了索引为2的数字7和索引为4的数字45，将小于7的数放在左边，大于7小于45的数放在中间，大于45的数放在右边。

## 筛选函数

下面我们来看几个常见的筛选函数，这些函数用于在数组中查找特定条件的元素。

### numpy.argmax()

> 返回沿给定轴的最大值索引。

注意，索引的值是从0开始计算的。

我们来看实例：

```
import numpy as np

a = np.array([[30, 40, 70], [80, 20, 10], [50, 90, 60]])
print(np.char.center('初始数组', 20, '*'))
print(a)
print('\n')

print(np.char.center('调用 argmax() 函数', 20, '*'))
print(np.argmax(a))
print('\n')

print(np.char.center('展开数组', 20, '*'))
print(a.flatten())
print('\n')

print(np.char.center('沿0轴的最大索引', 20, '*'))
print(np.argmax(a, 0))
print('\n')

print(np.char.center('沿1轴的最大索引', 20, '*'))
print(np.argmax(a, 1))
print('\n')

# 返回
********初始数组********
[[30 40 70]
 [80 20 10]
 [50 90 60]]
***调用 argmax() 函数***
7
********展开数组********
[30 40 70 80 20 10 50 90 60]
******沿0轴的最大索引******
[1 2 0]
******沿1轴的最大索引******
[2 0 1]
```

### numpy.argmin()

> 返回沿给定轴的最小值索引。

注意，索引的值是从0开始计算的。

我们来看实例：

```
import numpy as np

a = np.array([[30, 40, 70], [80, 20, 10], [50, 90, 60]])
print(np.char.center('初始数组', 20, '*'))
print(a)
print('\n')

print(np.char.center('调用 argmin() 函数', 20, '*'))
print(np.argmin(a))
print('\n')

print(np.char.center('沿0轴的最小索引', 20, '*'))
print(np.argmin(a, 0))
print('\n')

print(np.char.center('沿1轴的最小索引', 20, '*'))
print(np.argmin(a, 1))
print('\n')

# 返回
********初始数组********
[[30 40 70]
 [80 20 10]
 [50 90 60]]
***调用 argmin() 函数***
5
******沿0轴的最小索引******
[0 1 1]
******沿1轴的最小索引******
[0 2 0]
```

### numpy.nonzero()

> 返回输入数组中非零元素的索引。

- 只有a中非零元素才会有索引值，那些零值元素没有索引值；
- 返回的索引值数组是一个2维tuple数组，该tuple数组中包含一维的array数组。其中，一维array向量的个数与a的维数是一致的。
- 索引值数组的每一个array均是从一个维度上来描述其索引值。比如，如果a是一个二维数组，则索引值数组有两个array，第一个array从行维度来描述索引值；第二个array从列维度来描述索引值。
- 该np.transpose(np.nonzero(x))
函数能够描述出每一个非零元素在不同维度的索引值。

我们来看实例：

```
import numpy as np

b = np.array([[30, 40, 0], [0, 20, 10], [50, 0, 60]])
print(np.char.center('我们的数组是', 20, '*'))
print(b)
print(np.char.center('调用 nonzero() 函数', 20, '*'))
c = np.nonzero(b)
print(c)
print(np.transpose(np.nonzero(b)))

# 返回
*******我们的数组是*******
[[30 40  0]
 [ 0 20 10]
 [50  0 60]]
**调用 nonzero() 函数***
(array([0, 0, 1, 1, 2, 2]), array([0, 1, 1, 2, 0, 2]))
[[0 0]
 [0 1]
 [1 1]
 [1 2]
 [2 0]
 [2 2]]
```

我们通过 `np.transpose()` 方法转换后看起来比较直观，注意这里的索引是从0开始算的。

### numpy.where()

> 返回输入数组中满足给定条件的元素的索引。

我们来看实例：

```
import numpy as np

b = np.array([[30, 40, 0], [0, 20, 10], [50, 0, 60]])

print(np.char.center('调用 where() 函数', 20, '*'))
print(np.where(b > 20))
print(np.transpose(np.where(b > 20)))

# 返回
***调用 where() 函数****
(array([0, 0, 2, 2]), array([0, 1, 0, 2]))
[[0 0]
 [0 1]
 [2 0]
 [2 2]]
```

这里面我们输入的条件是大于20，数组中大于20的数的索引都被查找出来了。

### numpy.extract()

> 根据某个条件从数组中抽取元素，返回满条件的元素。

我们来看实例：

```
import numpy as np

x = np.arange(9.).reshape(3,  3)
print(np.char.center('我们的数组是', 20, '*'))
print(x)
# 定义条件, 选择偶数元素
condition = np.mod(x, 2) == 0
print(np.char.center('按元素的条件值', 20, '*'))
print(condition)
print(np.char.center('使用条件提取元素', 20, '*'))
print(np.extract(condition, x))

# 返回
*******我们的数组是*******
[[0. 1. 2.]
 [3. 4. 5.]
 [6. 7. 8.]]
******按元素的条件值*******
[[ True False  True]
 [False  True False]
 [ True False  True]]
******使用条件提取元素******
[0. 2. 4. 6. 8.]
```

例子中，我们先定义了一个条件，就是选择偶数。然后我们可以打印这个数组每个元素是否满足条件。最后我们调用 `extract()` 方法返回满足条件的元素。注意这里返回的是元素，而不是元素的索引。


## 总结

本文向大家介绍了 NumPy 的排序与筛选函数，熟练掌握和运用这些函数可以很轻松地帮助我们达到特定的目标，而不用自己去重复造轮子。大家在后续的代码中遇到类似的情况应该要优先想到这些函数。


## 参考

https://numpy.org/devdocs/reference/routines.sort.html

> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)

