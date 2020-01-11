---
layout: post
title:  第90天：NumPy 位运算与算术函数
category: python
copyright: python
---

by 潮汐

今天的文章和大家聊聊 Python Numpy 位运算和算术函数，本文将分两部分做详细描述。
<!--more-->

## Numpy 位运算

NumPy包中，可用位操作函数进行位运算,以 `bitwise_` 开头的函数是位运算函数。

NumPy 位运算函数如下：

|  函数   |  描述   |
| --- | --- |
|  bitwise_and   |  对数组元素执行位与运算   |
|bitwise_or|对数组元素执行位或运算|
|invert|按位取反（位非运算）|
|left_shift|向左移动二进制表示的位（左移位）|
|right_shift|向右移动二进制表示的位（右移位）|

**值得注意的是：** 位运算同样可以使用操作符进行计算，分别是使用 "&"、 "~"、 "|" 和 "^" 等。

### 1、bitwise_and

bitwise_and() 函数对数组中整数的二进制形式执行位与运算。

**实例：**

```python
a, b = 13, 17
print('13 和 17 的二进制：')
print(bin(a), bin(b))
print('\n')

print('13 和 17 的位与：')
print(np.bitwise_and(a,b))

```
**输出结果：**
```
13 和 17 的二进制：
0b1101 0b10001


13 和 17 的位与：
1
```
**位与运算规律如下：**

|   A  |  B   |  AND   |
| --- | --- | --- |
|   1   |   1  |   1  |
|   1  |   0  |  0   |
|   0  |   1  |   0  |
|   0  |   0  |   0  |

13 和 17 的位与运算规律运算如下：

|     |     |   1  |   1  |   0  |   1  |
| --- | --- | --- | --- | --- | --- |
|     |   1  |  0   |  0   |  0   |   1  |
|  AND   |     |     |     |     |     |
|     |   0  |   0  |  0   |   0  |  1   |

所以 13 和 17 位与运算结果为 1

### 2、bitwise_or
bitwise_or()函数对数组中整数的二进制形式执行位或运算。

**实例：**
```
import numpy as np

# Numpy 位或运算
a, b = 13, 17
print('13 和 17 的二进制：')
print(bin(a), bin(b))
print('\n')


print('13 和 17 的位或：')
print(np.bitwise_or(a,b))
```
**输出结果为：**

```
13 和 17 的二进制形式：
0b1101 0b10001
13 和 17 的位或：
29
```

位或运算规律如下：

|  A   |   B  |   OR  |
| --- | --- | --- |
| 1    |   1  |  1   |
|   1  |   0  |   1  |
|  0   |   1  |  1  |
|   0  |  0   |   0  |

运算结果为：

|     |     |   1  |   1  | 0    |  1   |
| --- | --- | --- | --- | --- | --- |
|  OR   |     |     |     |     |     |
|     |   1  |   0  |  0   |  0   |  1   |
|     |   1  |   1  |   1  |  0   |   1  |

最后的运算结果为：
`29`, 即数字 29 的二进制为 `11101`，正是以上实例或运算结果。

### 3、invert 

invert() 函数是对数值进行位非操作，位非即数值的取反操作。
invert() 函数对数组中整数进行位取反运算，即 0 变成 1，1 变成 0。

对于有符号整数，取该数二进制数的补码，然后 +1；二进制数最高位为0表示正数，最高位为 1 表示负数。

**实例：**

```
import numpy as np

# 比较 13 和 242 的二进制表示，发现了位的反转
print('13 的二进制表示：')
print(np.binary_repr(13, width=8))
print('\n')

print('242 的二进制表示：')
print(np.binary_repr(242, width=8))

print('13 的位反转：')
print(np.invert(np.array([13], dtype=np.uint8)))
print('\n')
```

**输出结果为：**

```
13 的二进制表示：
00001101

242 的二进制表示：
11110010

13 的位反转：
[242]
```

### 4、left_shift

left_shift() 函数将数组元素的二进制形式向左移动到指定位置，右侧附加相等数量的 0。

实例：
```
import numpy as np

print('将 10 左移两位：')
print(np.left_shift(10, 2))
print('\n')

print('10 的二进制表示：')
print(np.binary_repr(10, width=8))
print('\n')

print('40 的二进制表示：')
print(np.binary_repr(40, width=8))
#  '00001010' 中的两位移动到了左边，并在右边添加了两个 0。
```

输出结果为：

```
将 10 左移两位：
40

10 的二进制表示：
00001010

40 的二进制表示：
00101000
```

### 5、right_shift

right_shift() 函数将数组元素的二进制形式向右移动到指定位置，左侧附加相等数量的 0。

```
import numpy as np

print('将 40 右移两位：')
print(np.right_shift(40, 2))
print('\n')

print('40 的二进制表示：')
print(np.binary_repr(40, width=8))
print('\n')

print('10 的二进制表示：')
print(np.binary_repr(10, width=8))
#  '00001010' 中的两位移动到了右边，并在左边添加了两个 0。
```

输出结果为：

```
将 40 右移两位：
10


40 的二进制表示：
00101000


10 的二进制表示：
00001010
```

## Numpy 算术函数

### 1、介绍及函数明细

Numpy 算术函数-->算术函数顾名思义就是加、减、乘、除的意思，即add()，subtract()，multiply() 和 divide()等。
但值得注意的是数组必须具有相同的形状或符合数组广播规则。

NumPy 中涵盖的算术运算通过下表展示，除了基本的算术运算函数外，下表中还列出对应的指数和对数函数，详细信息如下：

|方法	|描述|
| --- | --- |
|add()|	按元素添加参数|
|subtract()	|从元素方面减去参数|
|multiply()	|在元素方面乘以论证|
|divide()	|以元素方式返回输入的真正除法|
|logaddexp()	|输入的取幂之和的对数|
|logaddexp2()	|base-2中输入的取幂之和的对数|
|true_divide()|	以元素方式返回输入的真正除法|
|floor_divide()	|返回小于或等于输入除法的最大整数|
|negative()	|数字否定, 元素方面|
|positive()	|数字正面, 元素方面|
|power()	|第一个数组元素从第二个数组提升到幂, 逐个元素|
|remainder()	|返回除法元素的余数|
|mod()|	返回除法元素的余数|
|fmod()	|返回除法的元素余数|
|divmod()|	同时返回逐元素的商和余数|
|absolute()|	逐个元素地计算绝对值|
|fabs()|	以元素方式计算绝对值|
|rint()	|将数组的元素舍入为最接近的整数|
|sign()	|返回数字符号的元素指示|
|heaviside()	|计算Heaviside阶跃函数|
|conj()	|以元素方式返回复共轭|
|conjugate()	|以元素方式返回复共轭|
|exp()|	计算输入数组中所有元素的指数|
|exp2()|	计算输入数组中所有 p 的 2**p|
|log()	|自然对数, 元素方面|
|log2()	|x的基数为2的对数|
|log10()|以元素方式返回输入数组的基数10对数|
|expm1()|	计算数组中的所有元素吗，exp(x) - 1|
|log1p()|	返回一个加上输入数组的自然对数, 逐个元素|
|sqrt()	|以元素方式返回数组的非负平方根|
|square()|	返回输入的元素方块|
|cbrt()	|以元素方式返回数组的立方根|
|reciprocal()	|以元素方式返回参数的倒数|
|gcd()	| 返回最大公约数|
|lcm()	| 返回 最小公倍数 | 

### 2、实例详解

#### 2.1、add() 
add() 表示两个数组相加，add() 函数使用方法如下：

`add(数组1,数组2,…)`

**实例：**

``` python
import numpy as np

a = np.arange(16, dtype = np.int_).reshape(4,4)
print('第一个数组：')
print(a)
print('\n')

print('第二个数组：')
b = np.array([10, 10, 10, 10])
print(b)
print('\n')

# 两个数组相加
print('两个数组相加：')
print(np.add(a, b))
print('\n')
```

**以上结果输出为：**

```
第一个数组：
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]
 [12 13 14 15]]

第二个数组：
[10 10 10 10]

两个数组相加：
[[10 11 12 13]
 [14 15 16 17]
 [18 19 20 21]
 [22 23 24 25]]
```
由上可得结论，数组之间的相加维度、数据类型必须一致。

### 2.2、subtract()
subtract()表示两个数组相减，subtract() 函数使用方法如下：
`subtract(数组1,数组2,…)`

**实例：**

```
import numpy as np

a = np.arange(16, dtype = np.int_).reshape(4,4)
print('第一个数组：')
print(a)
print('\n')

print('第二个数组：')
b = np.array([10, 10, 10, 10])
print(b)
print('\n')

print('两个数组相减：')
print(np.subtract(a, b))
print('\n')
```
以上结果输出为：
```
第一个数组：
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]
 [12 13 14 15]]

第二个数组：
[10 10 10 10]

两个数组相减：
[[-10  -9  -8  -7]
 [ -6  -5  -4  -3]
 [ -2  -1   0   1]
 [  2   3   4   5]]
```

### 2.3、multiply()
multiply() 表示两个数组相乘，multiply() 函数使用方法：`multiply(数组1,数组2,…)`

实例：
```
import numpy as np

a = np.arange(16, dtype = np.int_).reshape(4,4)
print('第一个数组：')
print(a)
print('\n')

print('第二个数组：')
b = np.array([10, 10, 10, 10])
print(b)
print('\n')

print('两个数组相乘：')
print(np.multiply(a, b))
print('\n')
```

输出结果为：
```
第一个数组：
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]
 [12 13 14 15]]


第二个数组：
[10 10 10 10]


两个数组相乘：
[[  0  10  20  30]
 [ 40  50  60  70]
 [ 80  90 100 110]
 [120 130 140 150]]
```

### 2.4、divide()
divide() 表示两个数组相除，divide() 使用方法为：`divide(数组1,数组2,…)`

**实例：**

```python
import numpy as np

a = np.arange(16, dtype = np.int_).reshape(4,4)
print('第一个数组：')
print(a)
print('\n')

print('第二个数组：')
b = np.array([10, 10, 10, 10])
print(b)
print('\n')

print('两个数组相除：')
print(np.divide(a, b))
```
输出结果为:
```
第一个数组：
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]
 [12 13 14 15]]

第二个数组：
[10 10 10 10]

两个数组相除：
[[0.  0.1 0.2 0.3]
 [0.4 0.5 0.6 0.7]
 [0.8 0.9 1.  1.1]
 [1.2 1.3 1.4 1.5]]
```

### 2.5 log()
log() 函数是取数的对数
实例：
```
import numpy as np

# 数的对数测试
c = 100
print('数字100的对数：')
print(np.log(c))
```

输出结果为：
```
数字100的对数：
4.605170185988092
```
### 2.6 numpy.power()
numpy.power() 函数将第一个输入数组中的元素作为底数，计算它与第二个输入数组中相应元素的幂。

**实例：**
```
# NumPy 幂计算
import numpy as np

d = np.array([2, 5, 10])
print('第一个数组是：')
print(d)

print('\n')
print('调用 power 函数：')
print(np.power(d, 2))

print('\n')
print('第二个数组：')
e = np.array([1, 2, 3])
print(e)
print('\n')
print('再次调用 power 函数：')
print(np.power(d, e))
```

输出结果为：
```
第一个数组是：
[ 2  5 10]

调用 power 函数：
[  4  25 100]

第二个数组：
[1 2 3]

再次调用 power 函数：
[   2   25 1000]

```


## 总结

本章节是 NumPy 位运算和算术函数运用的基本介绍，这部分的知识实例都是从简单入手，对于一个知识点，难的是综合运用，只有根基牢固才能造出大 House，希望对使用这部分知识的工程师提供更好的支撑。

## 参考
[https://www.runoob.com/numpy/numpy-arithmetic-operations.html](https://www.runoob.com/numpy/numpy-arithmetic-operations.html)
[https://www.numpy.org.cn/reference/ufuncs.html](https://www.numpy.org.cn/reference/ufuncs.html#%E6%95%B0%E5%AD%A6%E8%BF%90%E7%AE%97)
[https://numpy.org/devdocs/reference/routines.math.html](https://numpy.org/devdocs/reference/routines.math.html)


> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)
