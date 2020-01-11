---
layout: post
title:  第110天：Numpy 中数组和矩阵的区别
category: python
copyright: python
---

 by 吴刀钓鱼

 不知道你是否跟我有同样的疑惑，就是 Numpy 科学计算库中既可以创建数组，也可以创建矩阵，这两者究竟有哪些相似与不同之处呢？下面我们一起来解开这个疑惑。

<!--more-->

## 1 创建方式

我们先来看一下三个例子。

应用示例1：

```
# 创建矩阵2 X 2的矩阵 A_mat 和 二维数组 A_array
import numpy as np
A_mat = np.mat([[1, 2],[3, 4]], int)
A_array = np.array([[1, 2],[3, 4]])
print(A_mat, type(A_mat))
print(A_array, type(A_array))

# 输出结果：
#[[1 2]
# [3 4]] <class 'numpy.matrix'>
#[[1 2]
# [3 4]] <class 'numpy.ndarray'>
```

应用示例2：

```
# 创建矩阵2 X 2的矩阵 A_mat 和 二维数组 A_array
import numpy as np
A_mat = np.mat([[1, 2],[3, 4]], int)
A_array = np.array(A_mat)
print(A_mat, type(A_mat))
print(A_array, type(A_array))

# 输出结果：
#[[1 2]
# [3 4]] <class 'numpy.matrix'>
#[[1 2]
# [3 4]] <class 'numpy.ndarray'>
```

应用示例3：

```
# 创建矩阵2 X 2的矩阵 A_mat 和 二维数组 A_array
import numpy as np
A_array = np.array([[1, 2],[3, 4]])
A_mat = np.mat(A_array, int)
print(A_mat, type(A_mat))
print(A_array, type(A_array))

# 输出结果：
#[[1 2]
# [3 4]] <class 'numpy.matrix'>
#[[1 2]
# [3 4]] <class 'numpy.ndarray'>
```

通过以上三个例子的运行结果可知，虽然矩阵 A_mat 和数组 A_array 的元素一样，但是两者的数据类型不同，一个是 numpy.matrix，另一个是 numpy.ndarray。而且在创建矩阵或数组的时候，我们可以将已经创建的数组转换为矩阵，反之将已经创建的矩阵转换为数组也是可以的。

## 2 数学运算

### 2.1 加法和减法运算

应用举例：

```
# 创建矩阵(A_mat、B_mat)和数组(A_array、B_array)，使其两两相加、相减
import numpy as np
A_mat = np.mat([[1, 2],[3, 4]], int)
B_mat = np.mat([[1, 2],[3, 4]], int)
A_array = np.array([[1, 2],[3, 4]])
B_array = np.array([[1, 2],[3, 4]])
print(A_mat + B_mat)
print(A_array + B_array)

C_array = np.array([[1, 2]])
C_mat = np.mat([[1, 2]], int)
print(A_array + C_array)
print(A_mat + C_mat)

# 输出结果：
#[[2 4]
# [6 8]]
#[[2 4]
# [6 8]]
#[[0 0]
# [0 0]]
#[[0 0]
# [0 0]]
#[[2 4]
# [4 6]]
#[[2 4]
# [4 6]]
```

通过以上例子的结果可以看出，对于矩阵和数组的加减法的运算方式两者是一样的，而且矩阵和数组都具备广播机制。

### 2.2 数乘运算

应用举例：

```
# 创建矩阵(A_mat)和数组(A_array)，进行数乘运算
import numpy as np
a = 0.1
A_mat = np.mat(np.full((3, 3), 100), int)
A_array = np.full((3, 3), 100)
print(a*A_mat)
print(a*A_array)

# 输出结果：
#[[10. 10. 10.]
# [10. 10. 10.]
# [10. 10. 10.]]
#[[10. 10. 10.]
# [10. 10. 10.]
# [10. 10. 10.]]
```

通过以上例子的结果可以看出，两者的数乘运算类似。

### 2.3 点乘运算

应用举例：

```
# 创建矩阵(A_mat)和数组(A_array)，进行点乘运算
import numpy as np
A_mat = np.mat(np.full((3, 3), 100), int)
A_array = np.full((3, 3), 100)

print(A_mat*A_mat)  # 点乘方式一
print(A_array*A_array)

print(A_mat.dot(A_mat))  # 点乘方式二
print(A_array.dot(A_array))

# 输出结果：
#[[30000 30000 30000]
# [30000 30000 30000]
# [30000 30000 30000]]
#[[10000 10000 10000]
# [10000 10000 10000]
# [10000 10000 10000]]
#[[30000 30000 30000]
# [30000 30000 30000]
# [30000 30000 30000]]
#[[30000 30000 30000]
# [30000 30000 30000]
# [30000 30000 30000]]
```

通过以上例子的结果可以看出，两者的点乘运算有点不同：当采用 * 符号进行运算时，矩阵可以实现点乘运算，而数组的运算结果是对应元素的乘积；在调用 dot 函数时矩阵和数组均可实现点乘运算。

### 2.4 转置运算

应用举例：

```
# 创建矩阵(A_mat)和数组(A_array)，进行转置运算
A_mat = np.mat([[1, 2],[3, 4]], int)
A_array = np.array([[1, 2],[3, 4]])

print(A_mat.T)
print(A_array.T)

# 输出结果：
#[[1 3]
# [2 4]]
#[[1 3]
# [2 4]]
```

通过以上例子的结果可以看出，两者的转置运算类似。

### 2.5 求逆运算

应用举例：

```
# 创建矩阵(A_mat)和数组(A_array)，进行求逆运算
import numpy as np
A_mat = np.mat([[1, 2],[3, 4]], int)
A_array = np.array([[1, 2],[3, 4]])

print(A_mat.I)
print(np.linalg.inv(A_array))
# print(A_array.I)


# 输出结果：
#[[-2.   1. ]
# [ 1.5 -0.5]]
#[[-2.   1. ]
# [ 1.5 -0.5]]
```

通过以上例子的结果可以看出，数组同样有求逆运算，但必须采用 inv 函数，使用 A_array.I 运算则会抛出 AttributeError 异常。

### 2.6 行列式运算

应用举例：

```
# 创建矩阵(A_mat)和数组(A_array)，进行行列式运算
import numpy as np
A_mat = np.mat([[1, 2],[3, 4]], int)
A_array = np.array([[1, 2],[3, 4]])

print(np.linalg.det(A_mat))
print(np.linalg.det(A_array))

# 输出结果：
#-2.0000000000000004
#-2.0000000000000004
```

通过以上例子的结果可以看出，数组和矩阵都可以进行矩阵的行列式运算(计算结果不等于-2，是因为浮点数运算存在精度损失)。

### 2.7 求秩运算

应用举例：

```
# 创建矩阵(A_mat)和数组(A_array)，进行求秩运算
import numpy as np
A_mat = np.mat(np.eye(3, 3), int)
A_array = np.eye(3, 3)

print(np.linalg.matrix_rank(A_mat))
print(np.linalg.matrix_rank(A_array))

# 输出结果：
#3
#3
```

通过以上例子的结果可以看出，数组和矩阵都可以进行矩阵的求秩运算。

### 2.8 求特征值和特征向量运算

应用举例：

```
# 求矩阵 A_mat 和数组 A_array 的特征值和其对应的特征向量
import numpy as np
A_mat = np.mat([[1, 2],[3, 4]], int)
value, vector = np.linalg.eig(A_mat)
print(value)
print(vector)

A_array = np.array([[1, 2],[3, 4]])
value, vector = np.linalg.eig(A_array)
print(value)
print(vector)

# 输出结果：
#[-0.37228132  5.37228132]
#[[-0.82456484 -0.41597356]
# [ 0.56576746 -0.90937671]]
#[-0.37228132  5.37228132]
#[[-0.82456484 -0.41597356]
# [ 0.56576746 -0.90937671]]
```

通过以上例子的结果可以看出，数组和矩阵都可以进行特征值和特征向量的求解运算。

### 2.9 求解线性方程

应用举例：

```
# 求解如下线性方程组的解：
# x + y + z = 3
# 3x + y + 4z = 8
# 8x + 9y + 5z = 22
import numpy as np
A_mat = np.mat([[1, 1, 1], [3, 1, 4], [8, 9, 5]], int)
b_mat = np.mat([[3], [8], [22]], int)
x = np.linalg.solve(A_mat, b_mat)
print(x)

A_array = np.array([[1, 1, 1], [3, 1, 4], [8, 9, 5]])
b_array = np.array([[3], [8], [22]])
x = np.linalg.solve(A_array, b_array)
print(x)

# 输出结果：
#[[1.]
# [1.]
# [1.]]
#[[1.]
# [1.]
# [1.]]
```

通过以上例子的结果可以看出，数组和矩阵都可以进行线性方程组的求解运算。

### 2.10 混合运算

前面举了一堆例子，似乎还缺少了一种，当矩阵和数组进行混合运算时，会产生什么样的效果呢？

应用举例：

```
import numpy as np
A_mat = np.mat([[1, 2],[3, 4]], int)
A_array = np.array([[1, 2],[3, 4]])

A_mix = A_mat + A_array
print(A_mix, type(A_mix))

A_array = np.array([1, 2])
A_mix = A_mat + A_array
print(A_mix, type(A_mix))

# 输出结果：
#[[2 4]
# [6 8]] <class 'numpy.matrix'>
#[[2 4]
# [4 6]] <class 'numpy.matrix'>
```

通过以上例子的结果可以看出，数组和矩阵可以进行混合运算，运算结果的类型为 numpy.matrix，即数组在运算后转变成了矩阵类型的数据，在混合运算中广播机制同样适用。

## 总结

本节给大家介绍了 Python 中 Numpy 数组与矩阵的区别，总的来说，矩阵和数组的创建以及数学运算基本类似，但是有部分差异，特别是在点乘以及求逆运算上的区别。

## 参考资料

[1] https://www.cnblogs.com/wenshinlee/p/11694885.html


> 示例代码：[Python-100-days](https://github.com/JustDoPython/python-100-day)

