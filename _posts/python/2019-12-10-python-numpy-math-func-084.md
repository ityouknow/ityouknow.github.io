---
layout: post
title:  第84天：NumPy 数学函数
category: python
copyright: python
---

by 闲欢

本文向大家介绍一下 NumPy 常见的数学函数。
<!--more-->

## NumPy 三角函数

三角函数是基本初等函数之一，是以角度（数学上最常用弧度制，下同）为自变量，角度对应任意角终边与单位圆交点坐标或其比值为因变量的函数。三角函数一般用于计算三角形中未知长度的边和未知的角度，在导航、工程学以及物理学方面都有广泛的用途。

常见的三角函数包括正弦函数、余弦函数和正切函数。下面我们来学习这三个常见的三角函数：

函数 | 描述
---|---
sin() | 数组中角度的正弦值
cos() | 数组中角度的余弦值
tan() | 数组中角度的正切值
arcsin() | 数组中角度的反正弦值
arccos() | 数组中角度的反余弦值
arctan() | 数组中角度的反正切值
degrees() | 将弧度转换成角度

我们直接来看实例：

```
import numpy as np

a = np.array([0, 30, 45, 60, 90])

print(np.char.center('不同角度的正弦值', 30, '*'))
# 通过乘 pi/180 转化为弧度
sin = np.sin(a*np.pi/180)
print(sin)
print('\n')

print(np.char.center('不同角度的余弦值', 30, '*'))
# 通过乘 pi/180 转化为弧度
cos = np.cos(a*np.pi/180)
print(cos)
print('\n')

print(np.char.center('不同角度的正切值', 30, '*'))
# 通过乘 pi/180 转化为弧度
tan = np.tan(a*np.pi/180)
print(tan)
print('\n')

print(np.char.center('不同角度的反正弦值', 30, '*'))
arcsin = np.arcsin(sin)
# 将弧度转换成角度打印输出
print(np.degrees(arcsin))
print('\n')

print(np.char.center('不同角度的反余弦值', 30, '*'))
arccos = np.arccos(cos)
# 将弧度转换成角度打印输出
print(np.degrees(arccos))
print('\n')

print(np.char.center('不同角度的反正切值', 30, '*'))
arctan = np.arctan(tan)
# 将弧度转换成角度打印输出
print(np.degrees(arctan))
print('\n')

# 返回
***********不同角度的正弦值***********
[0.         0.5        0.70710678 0.8660254  1.        ]
***********不同角度的余弦值***********
[1.00000000e+00 8.66025404e-01 7.07106781e-01 5.00000000e-01
 6.12323400e-17]
***********不同角度的正切值***********
[0.00000000e+00 5.77350269e-01 1.00000000e+00 1.73205081e+00
 1.63312394e+16]
**********不同角度的反正弦值***********
[ 0. 30. 45. 60. 90.]
**********不同角度的反余弦值***********
[ 0. 30. 45. 60. 90.]
**********不同角度的反正切值***********
[ 0. 30. 45. 60. 90.]
```

上面例子中，我们先计算不同角度的正弦值、余弦值、正切值，然后我们通过反三角函数，将前面计算的值计算成弧度，然后通过 `degrees` 函数转换成角度。我们可以看到最后的出来的角度和开始输入的数组的角度是一样的。

## NumPy 四舍五入函数

我们在数据的处理中可能会遇到需要将一组数字进行四舍五入操作，这时候我们就可以使用 NumPy 提供的四舍五入函数来处理了。

函数 | 描述
---|---
around() | 四舍五入
round() | 舍弃小数位
floor() | 向下取整
ceil() | 向上取整

### numpy.around()

> 对数组中的数字进行四舍五入

我们来看实例：

```
import numpy as np

a = np.array([1, 2.0, 30.12, 129.567])

# 四舍五入（取整）
print(np.around(a))
# 四舍五入（取一位小数）
print(np.around(a, decimals=1))
# 四舍五入（取小数点左侧第一位）
print(np.around(a, decimals=-1))

# 返回
[  1.   2.  30. 130.]
[  1.    2.   30.1 129.6]
[  0.   0.  30. 130.]
```

我们可以通过 `decimals` 参数来表示舍入的小数位数，默认值为0。 如果为负，整数将四舍五入到小数点左侧的位置。

### numpy.round()

> 对数组中的数字进行若干位的舍弃。

我们来看实例：

```
import numpy as np

a = np.array([1, 2.0, 30.12, 129.567])

# 只舍不入（取整）
print(np.around(a))
# 只舍不入（到小数点后一位）
print(np.around(a, decimals=1))
# 只舍不入（取小数点左侧第一位）
print(np.around(a, decimals=-1))

# 返回
[  1.   2.  30. 130.]
[  1.    2.   30.1 129.6]
[  0.   0.  30. 130.]
```

这个函数与 `around` 函数的区别就是只是舍弃，不做四舍五入。

### numpy.floor()

> 返回小于或者等于指定表达式的最大整数，即向下取整。

我们来看实例：

```
import numpy as np

a = np.array([1, 2.0, 30.12, 129.567])

# 向下取整
print(np.floor(a))

# 返回
[  1.   2.  30. 129.]
```

这个函数很好理解，就是舍弃小数位。

### numpy.ceil()

> 返回大于或者等于指定表达式的最小整数，即向上取整。

我们来看实例：

```
import numpy as np

a = np.array([1, 2.0, 30.12, 129.567])

# 向上取整
print(np.ceil(a))

# 返回
[  1.   2.  31. 130.]
```

这个函数和上面的 `floor` 是相反含义的函数，向上取整意思是如果没有小数位或者小数位是0，取当前整数；如果有小数位并且小数位不是0，则取当前数字的整数加1。

## NumPy 算术函数

接下来我们来介绍一下 NumPy 的几个常用的算术函数：

函数 | 描述
---|---
add() | 两个数组元素相加
multiply() | 两个数组元素相乘
divide() | 两个数组元素相除
subtract() | 两个数组元素相减
pow() | 将第一个输入数组中的元素作为底数，计算它与第二个输入数组中相应元素的幂
mod() | 计算输入数组中相应元素的相除后的余数

我们先来看看两个数组元素的加减乘除的实例：

```
import numpy as np

a = np.arange(6, dtype=np.float_).reshape(2, 3)
print('第一个数组：')
print(a)
print('第二个数组：')
b = np.array([10, 10, 10])
print(b)
print('\n')

print(np.char.center('两个数组相加', 20, '*'))
print(np.add(a, b))
print('\n')

print(np.char.center('两个数组相减', 20, '*'))
print(np.subtract(a, b))
print('\n')

print(np.char.center('两个数组相乘', 20, '*'))
print('两个数组相乘：')
print(np.multiply(a, b))
print('\n')

print(np.char.center('两个数组相除', 20, '*'))
print(np.divide(a, b))
print('\n')

# 返回
第一个数组：
[[0. 1. 2.]
 [3. 4. 5.]]
第二个数组：
[10 10 10]
*******两个数组相加*******
[[10. 11. 12.]
 [13. 14. 15.]]
*******两个数组相减*******
[[-10.  -9.  -8.]
 [ -7.  -6.  -5.]]
*******两个数组相乘*******
两个数组相乘：
[[ 0. 10. 20.]
 [30. 40. 50.]]
*******两个数组相除*******
[[0.  0.1 0.2]
 [0.3 0.4 0.5]]

```

在上面例子中，我们先定义了两个数组，第一个数一个二维数组，第二个是一个一维数组，然后对两个数组的元素进行加减乘除操作，返回的是一个二维数组。

这里需要注意的是数组必须具有相同的形状或符合数组广播规则。


### numpy.pow

> 将第一个输入数组中的元素作为底数，计算它与第二个输入数组中相应元素的幂。

我们先来看看实例：

```
import numpy as np

c = np.array([10, 100, 1000])
print('第一个数组是：')
print(c)
print('\n')

print(np.char.center('调用 power 函数', 20, '*'))
print(np.power(c, 2))
print('\n')

d = np.array([1, 2, 3])
print('第二个数组是：')
print(d)
print('\n')

print(np.char.center('再次调用 power 函数', 20, '*'))
print(np.power(c, d))

# 返回
第一个数组是：
[  10  100 1000]
****调用 power 函数*****
[    100   10000 1000000]
第二个数组是：
[1 2 3]
***再次调用 power 函数****
[        10      10000 1000000000]
```

从例子中我们可以看到，如果第二个参数是数字，就将第一个参数数组中的每个元素作为底数，计算它与第二个参数的幂；如果第二个参数是数组，那就将第一个参数数组中的每个元素作为底数，计算它与第二个数组中元素的幂。


### numpy.mod()

> 计算输入数组中相应元素的相除后的余数。

我们先来看看实例：

```
import numpy as np

e = np.array([10, 20, 30])
f = np.array([3, 5, 7])
print('第一个数组：')
print(e)
print('\n')

print('第二个数组：')
print(f)
print('\n')

print(np.char.center('调用 mod 函数', 20, '*'))
print(np.mod(e, f))

# 返回
第一个数组：
[10 20 30]
第二个数组：
[3 5 7]
*****调用 mod 函数******
[1 0 2]
```

这里也需要注意数组必须具有相同的形状或符合数组广播规则。


## 总结

本文向大家介绍了 NumPy 的数学函数，包括三角函数、四舍五入函数和算术函数。这些函数在一些数据分析中比较常见，运用得好会使你事半功倍。


## 参考

https://numpy.org/devdocs/reference/routines.math.html


> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)

