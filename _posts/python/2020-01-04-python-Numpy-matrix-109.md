---
layout: post
title:  第109天：Numpy 矩阵
category: python
copyright: python
---

by 吴刀钓鱼

机器学习中会用到大量的数学操作，而 Numpy 计算库使这些操作变得简单，这其中就涉及到了 Numpy 的矩阵操作，下面我们就来一起学习如何在 Numpy 科学计算库中进行矩阵的一些基本运算。

<!--more-->

## 1 矩阵的定义

定义矩阵使用 Numpy 科学计算库中的 mat 函数，如下所示：

**numpy.mat(data, dtype=None)**

- data，表示矩阵的数据。
- dtype，表示矩阵中的数据类型，默认是浮点数。

应用示例：

```
# (1) 定义一个3 X 3的矩阵，数据类型为 int
import numpy as np
data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
A = np.mat(data, int)
print(A, type(A)) 

# 输出结果：
#[[1 2 3]
# [4 5 6]
# [7 8 9]] <class 'numpy.matrix'>
```

```
# (2) 定义一个3 X 3的矩阵，矩阵元素全为0，数据类型为 int
import numpy as np
A = np.mat(np.zeros((3, 3)), int)
print(A)

# 输出结果：
#[[0 0 0]
# [0 0 0]
# [0 0 0]]
```

```
# (3) 定义一个3 X 3的矩阵，矩阵元素全为1
import numpy as np
A = np.mat(np.ones((3, 3)))
print(A)

# 输出结果：
#[[1. 1. 1.]
# [1. 1. 1.]
# [1. 1. 1.]]
```

```
# (4) 定义一个3 X 3的单位矩阵
import numpy as np
A = np.mat(np.eye(3, 3), int)
print(A)

# 输出结果：
#[[1 0 0]
# [0 1 0]
# [0 0 1]]
```

```
# (5) 定义一个3 X 3的对角矩阵，主对角线之外的元素皆为0
import numpy as np
A = np.mat(np.diag([1, 2, 3]), int)
print(A)

# 输出结果：
#[[1 0 0]
# [0 2 0]
# [0 0 3]]
```

```
# (6) 定义一个3 X 3的矩阵，把100作为所有元素初始值
import numpy as np
A = np.mat(np.full((3, 3), 100), int)
print(A)

# 输出结果：
#[[100 100 100]
# [100 100 100]
# [100 100 100]]
```

## 2 矩阵的线性代数运算

### 2.1 矩阵的加法与减法

只有两个矩阵的行数和列数相等时，才可以进行矩阵的加法和减法运算，否则程序会抛出 ValueError 异常。

应用示例：

```
# 定义两个矩阵 A 和 B，分别进行矩阵的加法和减法运算
import numpy as np
A = np.mat(np.full((3, 3), 100), int)
B = np.mat(np.full((3, 3), 200), int)
print(A+B)
print(A-B)

# 输出结果：
#[[300 300 300]
# [300 300 300]
# [300 300 300]]
#[[-100 -100 -100]
# [-100 -100 -100]
# [-100 -100 -100]]
```

### 2.2 矩阵的数乘

某个实数乘以矩阵称作矩阵的数乘。

应用示例：

```
# 定义矩阵 A 和浮点数 a，进行矩阵的数乘运算
import numpy as np
a = 0.1
A = np.mat(np.full((3, 3), 100), int)
print(a*A)

# 输出结果：
#[[10. 10. 10.]
# [10. 10. 10.]
# [10. 10. 10.]]
```

### 2.3 矩阵的点乘

只有在第一个矩阵的列数与第二个矩阵的行数相等时，两个矩阵才能相乘，否则程序会抛出 ValueError 异常。

应用示例：

```
# 定义矩阵 A 和矩阵 B，进行矩阵的乘法运算
import numpy as np
A = np.mat(np.full((2, 3), 10), int)
B = np.mat(np.full((3, 3), 10), int)
print(A*B)  # 求矩阵相乘形式一
print(A.dot(B))  # 求矩阵相乘形式二
print(np.dot(A, B))  # 求矩阵相乘形式三

# 输出结果：
#[[300 300 300]
# [300 300 300]]
#[[300 300 300]
# [300 300 300]]
```

### 2.4 矩阵的转置

把矩阵的每一行转换为列，称为矩阵的转置。

应用示例：

```
# 定义矩阵 A，进行矩阵转置运算
import numpy as np
data = [[1,2,3],[4,5,6],[7,8,9]]
A = np.mat(data, int)
print(A.T)

# 输出结果：
#[[1 4 7]
# [2 5 8]
# [3 6 9]]
```

### 2.5 矩阵的求逆

非奇异矩阵下，可以对矩阵进行求逆运算。(非奇异矩阵就是行列式不为 0 的矩阵)

应用示例：

```
# 定义矩阵 A，进行矩阵求逆运算
import numpy as np
data = [[1, 2], [3, 4]]
A = np.mat(data, int)
print(A.I)

# 输出结果：
#[[-2.   1. ]
# [ 1.5 -0.5]]
```

### 2.6 矩阵的行列式

对于矩阵 A，均可对应一个标量 det(A)，它的值将告诉我们矩阵是否为非奇异的。

应用示例：

```
# 求矩阵 A 的行列式 det(A)
import numpy as np
A = np.mat([[1, 2],[3, 4]], int)
det = np.linalg.det(A)
print(det)

# 输出结果：
# -2.0000000000000004
```

计算结果不等于-2，是因为浮点数运算存在精度损失。  

### 2.7 矩阵的秩

如果把矩阵看成一个向量组，那么秩就是线性无关向量的个数，也就是向量组的维度，概念比较复杂，有兴趣的读者可以继续探索。矩阵的秩应该是小于等于行数与列数的最小值。

```
# 求矩阵 A 的秩 rank(A)
import numpy as np
A = np.mat([[1, 2],[3, 4]], int)
rank = np.linalg.matrix_rank(A)
print(rank)

# 输出结果：
# 2
```

### 2.8 矩阵特征值和特征向量

A 为 n 阶矩阵，若数 λ 和 n 维非0列向量 x 满足 Ax=λx，那么数 λ 称为 A 的特征值，x 称为 A 的对应于特征值 λ的特征向量。

应用示例：

```
# 求矩阵 A 的特征值和其对应的特征向量
import numpy as np
A = np.mat([[1, 2],[3, 4]], int)
value, vector = np.linalg.eig(A)
print(value)
print(vector)

# 输出结果：
#[-0.37228132  5.37228132]
#[[-0.82456484 -0.41597356]
# [ 0.56576746 -0.90937671]]
```

### 2.9 矩阵的线性方程解

求解形如 Ax = b 的线性方程组，其中 A 为矩阵，b 为一维或二维的数组，x 是未知变量。

应用举例：

```
# 求解如下线性方程组的解：
# x + y + z = 3
# 3x + y + 4z = 8
# 8x + 9y + 5z = 22
import numpy as np
A = np.mat([[1, 1, 1], [3, 1, 4], [8, 9, 5]], int)
b = np.mat([[3], [8], [22]], int)
x = np.linalg.solve(A,b)
print(x)

# 输出结果：
#[[1.]
# [1.]
# [1.]]
```

## 总结

本节给大家介绍了 Python 中 Numpy 科学计算库中矩阵的基本使用方法，助你掌握机器学习中有关矩阵的一些基本运算。

## 参考资料

[1] https://www.runoob.com/numpy/numpy-matrix.html

[2] https://www.runoob.com/numpy/numpy-linear-algebra.html

> 示例代码：[Python-100-days](https://github.com/JustDoPython/python-100-day)