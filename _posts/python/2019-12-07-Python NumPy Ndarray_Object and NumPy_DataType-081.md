---
layout: post
title: 第81天：NumPy Ndarray_Object&NumPy_Data_Type
category: python
copyright: python
---

by 潮汐

上一篇文章中我们详细介绍了 NumPy 的功能及用途，本章节着重介绍 NumPy 一个神奇的对象 Ndarray 以及 NumPy 数据类型，包括两者的用途，接下来就开启神奇之旅吧。
<!--more-->

标准安装的 Python 中用列表 (list) 保存一组值，它可以用来当作数组使用，不过由于列表的元素可以是任何对象，因此列表中所保存的是对象的指针。这样为了保存一个简单的[1,2,3]，需要有3个指针和三个整数对象。对于数值运算来说这种结构显然比较浪费内存和CPU计算时间。

此外 Python 还提供了一个array模块，array对象和列表不同，它直接保存数值，和C语言的一维数组比较类似。但是由于它不支持多维，也没有各种运算函数，因此也不适合做数值运算。

NumPy 的诞生弥补了这些不足，NumPy提供了两种基本的对象：ndarray（N-dimensional array object）和 ufunc（universal function object）。ndarray (下文统一称之为数组)是存储单一数据类型的多维数组，而 ufunc 则是能够对数组进行处理的函数。

### 一、NumPy Ndarray 对象

NumPy 最重要的一个特点是其 N 维数组对象 ndarray，Ndarray 从名字组成上看是 Nd-array,顾名思义就是 N 维数组的意思，它是一系列多维且同类型数据的集合，以 下标为 0 开始进行集合中元素的索引。ndarray 是内存存储，换言之 ndarray 对象由计算机内存的连续一部分组成，并结合索引模式，将每个元素映射到内存块中的一个位置，它比列表存储节省空间

- ndarray 对象是用于存放同类型元素的多维数组。
- ndarray 中的每个元素在内存中都有相同存储大小的区域。

#### 1、ndarray 内部内容组成

- 一个指向数据（内存或内存映射文件中的一块数据）的指针。
- 数据类型或 dtype，描述在数组中的固定大小值的格子。
- 一个表示数组形状（shape）的元组，表示各维度大小的元组。
- 一个跨度元组（stride），其中的整数指的是为了前进到当前维度下一个元素需要"跨过"的字节数。

#### 2、ndarray 的内部结构

![ndarray 内部结构](https://qiniu.mdnice.com/c6ea6242d50b454059497cd8e9d65820.png)

#### 3、创建 ndarray

```
from numpy import *
eye(4)
Out[3]: 
array([[1., 0., 0., 0.],
       [0., 1., 0., 0.],
       [0., 0., 1., 0.],
       [0., 0., 0., 1.]])
```

由以上实例可知，创建一个 ndarray 只需调用 NumPy 的 array 函数即可，如下：

```python
numpy.array(object, dtype = None, copy = True, order = None, subok = False, ndmin = 0)

```

#### 3.1 参数说明

名称 |	描述
---|---
object | 数组或嵌套的数列
dtype | 数组元素的数据类型，可选
copy |	对象是否需要复制，可选
order |	创建数组的样式，C为行方向，F为列方向，A为任意方向（默认）
subok |	默认返回一个与基类类型一致的数组
ndmin |	指定生成数组的最小维度

值得注意的是：ndmin 默认为数值为 0

#### 3.2 运用实例

创建一个简单的 ndarray 对象，单维数组
```python
import numpy as np 
a = np.array([1,2,3])  
print (a)
```
输出结果如下：

```
[1 2 3]
```

**创建一个大于 1 维的数组**

```python
import numpy as np 
a = np.array([[1,  2],  [3,  4]])  
print (a)
```
**输出结果如下：**

```
[[1 2]
 [3 4]]
```

**使用最小维度参数指定维度**

以下实例指定数组维度为 2 维，ndmin 默认维度是 0 

```
import numpy as np 
a = np.array([1,  2,  3,4,5], ndmin =  2)  
print (a)
```
输出结果为：

```
[[1, 2, 3, 4, 5]]
```

**使用 dtype  参数指定数组元素的数据类型**


```
import numpy as np 
a = np.array([1,  2,  3], dtype = complex)  
print (a)
```

输出结果：

```
[1.+0.j 2.+0.j 3.+0.j]

```

### 二、NumPy 数据类型

NumPy 支持的数据类型比 Python 内置的类型要更多，基本上可以和 C 语言的数据类型对应上，其中部分类型对应为 Python 内置的类型。

#### 1、NumPy 常用数据类型
下表列举了 NumPy 常用基本数据类型，为了区别于 Python 原生的数据类型，bool、int、float、complex、str 等类型名称末尾都加了 _。

名称|	描述
---|---
bool_|	布尔型数据类型（True 或者 False）
int_|默认的整数类型（类似于 C 语言中的 long，int32 或 int64）
intc|	与 C 的 int 类型一样，一般是 int32 或 int 64
intp|	用于索引的整数类型（类似于 C 的 ssize_t，一般情况下仍然是 int32 或 int64）
int8|	字节（-128 to 127）
int16|	整数（-32768 to 32767）
int32|	整数（-2147483648 to 2147483647）
int64|	整数（-9223372036854775808 to 9223372036854775807）
uint8|	无符号整数（0 to 255）
uint16|	无符号整数（0 to 65535）
uint32|	无符号整数（0 to 4294967295）
uint64|	无符号整数（0 to 18446744073709551615）
float_|	float64 类型的简写
float16|	半精度浮点数，包括：1 个符号位，5 个指数位，10 个尾数位
float32|	单精度浮点数，包括：1 个符号位，8 个指数位，23 个尾数位
float64	|双精度浮点数，包括：1 个符号位，11 个指数位，52 个尾数位
complex_|	complex128 类型的简写，即 128 位复数
complex64|	复数，表示双 32 位浮点数（实数部分和虚数部分）
complex128|	复数，表示双 64 位浮点数（实数部分和虚数部分）

另外 numpy 的数值类型实际上是 dtype 对象的实例，并对应唯一的字符，包括 np.bool_，np.int32，np.float32，等等。

#### 2、数据类型对象-dtype

数据类型对象是用来描述与数组对应的内存区域如何使用，这依赖如下几个方面：
- 数据的类型（整数，浮点数或者 Python 对象）
- 数据的大小（例如， 整数使用多少个字节存储）
- 数据的字节顺序（小端法或大端法）
- 在结构化类型的情况下，字段的名称、每个字段的数据类型和每个字段所取的内存块的部分
- 如果数据类型是子数组，它的形状和数据类型

字节顺序是通过对数据类型预先设定"<"或">"来决定的。"<"意味着小端法(最小值存储在最小的地址，即低位组放在最前面)。">"意味着大端法(最重要的字节存储在最小的地址，即高位组放在最前面)。

dtype 对象是使用以下语法构造的：

```
numpy.dtype(object, align, copy)
```
- object - 要转换为的数据类型对象
- align - 如果为 true，填充字段使其类似 C 的结构体。
- copy - 复制 dtype 对象 ，如果为 false，则是对内置数据类型对象的引用

**实例操作：**

实例 1
```
import numpy as np
# 使用标量类型
da = np.array([1, 2, 3])
print(da.dtype)
```
输出结果为：
```
int32
```

实例 2 

```
import numpy as np
# int8, int16, int32, int64 四种数据类型可以使用字符串 'i1', 'i2','i4','i8' 代替
dt = np.dtype('i4')
print(dt)
```
输出结果为：

```
int32
```

#### 3、结构化数据类型的运用

结构化数据类型的使用，类型字段和对应的实际类型将被创建

**实例1：创建年龄数组并且应用于 ndarray 对象** 

##### 1）创建一个结构化数据类型
```
da = np.dtype(np.int64)
print(da)

# 创建
dt = np.dtype([('age',np.int8)])
print(dt)
```
输出结果为：

```
int64
[('age', 'i1')]
```

##### 2）将结构化数据类型应用于ndarray 对象

```
dt = np.dtype([('age',np.int8)]) 
a = np.array([(10,),(20,),(30,)], dtype = dt) 
print(a)
```
输出结果为：

```
[(10,) (20,) (30,)]
```
##### 3) 类型字段名可以用于存取实际的 age 列

```
dt = np.dtype([('age',np.int8)]) 
a = np.array([(10,),(20,),(30,)], dtype = dt) 
print(a['age'])
```
输出结果为：

```
[10 20 30]
```
**实例2：定义一个结构化数据类型 student，包含字符串字段 name，整数字段 age，及浮点字段 marks，并将这个 dtype 应用到 ndarray 对象。**

##### 1） 创建数组

```
student = np.dtype([('name','S20'), ('age', 'i1'), ('marks', 'f4')]) 
print(student)
```
输出结果：

```
[('name', 'S20'), ('age', 'i1'), ('marks', '<f4')]
```

##### 2） 将数组应用与 ndarray 对象

```
import numpy as np
student = np.dtype([('name','S20'), ('age', 'i1'), ('marks', 'f4')]) 
a = np.array([('abc', 21, 50),('xyz', 18, 75)], dtype = student) 
print(a)
```
输出结果为：

```
[(b'abc', 21, 50.) (b'xyz', 18, 75.)]
```

#### 3.1 内建类型的字符代码如下：

字符 |	对应类型
---|---
b|	布尔型
i|	(有符号) 整型
u|	无符号整型 integer
f|	浮点型
c|	复数浮点型
m|	timedelta（时间间隔）
M|	datetime（日期时间）
O|	(Python) 对象
S, a|	(byte-)字符串
U|	Unicode
V|	原始数据 (void)

#### 3.2 NumPy 数据类型转换

numpy 数据类型转换需要调用方法 astype()，不能直接修改 dtype。调用 astype 返回数据类型修改后的数据，但是源数据的类型不会变，需要进一步对源数据的赋值操作才能改变。

**实例：**

```python
da = np.array([1.2,1.1,1.0])
# 输出 da 的数据类型
print(da.dtype)
# 输出 float64

# 转换 da 的数据类型
print(da.astype(np.int32))
# 输出 [1 1 1]

# 重新查看数据类型,发现数据类型还未改变
print(da.dtype)
# 输出 float64

# 重新进行赋值操作
da = da.astype(np.int32)
print(da.dtype) 
# 输出int32

print(da)
# 输出 [1 1 1]
```



#### 4、复数

我们把形如 z=a+bi（a, b均为实数）的数称为复数，其中 a 称为实部，b 称为虚部，i 称为虚数单位。
> 当虚部 b=0 时，复数 z 是实数；                                                                              
当虚部 b!=0 时，复数 z 是虚数；                                                                                      
当虚部 b!=0，且实部 a=0 时，复数 z 是纯虚数。

实例：

```
import numpy as np 
a = np.array([1,  2,  3], dtype = complex)  
print (a)
```
输出：

```
[1.+0.j 2.+0.j 3.+0.j]
```
如上输出结果就是复数形式的数据类型


### 总结

本章节是对 NumPy Ndarray 对象及 NumPy 数据类型的用法作详细介绍，本文介绍的是 Ndarray 基础知识，等把 NumPy 所有知识点介绍完后会出一个项目实战那，更好的给运用 NumPy 相关知识点的友人们提供支撑。

### 参考
https://www.runoob.com/numpy/numpy-ndarray-object.html
https://www.runoob.com/numpy/numpy-dtype.html

> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)


