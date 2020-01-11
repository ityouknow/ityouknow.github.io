---
layout: post
title:  第94天：数据分析之 pandas 初步
category: python
copyright: python
---

by 轩辕御龙

# 数据分析之 pandas 初步

`pandas`是一个常用的第三方 Python 库，提供快速灵活的数据处理功能，也是进行数据分析的有力工具。我们的口号是：“更快，更高，更强”（皮一下）。啊，当然，现在经常有很多库一上来就要“吊打”`pandas`，咱们还是不必在意。

<!--more-->

`pandas`尤其擅长处理以下数据：

以下几种数据尤其适合用`pandas`进行处理：

- 多种数据混合的扁平化数据格式，比如 SQL 表和 Excel 电子表格；
- 时间序列数据，不管有序无序；
- 任意带有行列标签的矩阵数据，不管是同种数据类型还是多种数据类型；
- 还有其他任意的统计数据集，不必带标签。

在本文开头要提醒的是，`pandas`指的不是英语中的“panda”，熊猫。实际上`pandas`是术语“panel data”（面板数据）的简写，大家要注意：这不是国宝模块哈哈，不要看到这个模块就想起憨憨的大熊猫啦~

## 1. pandas 安装

有了之前文章的铺垫，其实安装这个步骤大家应该已经很熟悉了，但是在这里依然要再叙述一遍。已经安装好的同学跳过就好。

由于`pandas`并非 Python 的内置模块，因此我们直接从 Python 官网下载安装的发行版是不包含 `pandas`这个模块的。这个时候你要是想`import numpy`，显然是会无功而返的。因此我们需要额外安装 `pandas`模块。

安装 `pandas`有好几种方式，我们这里推荐的是：1）使用`pip`进行安装；2）安装[Anaconda]( https://www.anaconda.com/ )。

### 1.1 使用`pip`安装

这种方式推荐给已经从 Python 官网下载了某个 Python 发行版的读者，或是已经通过其它方式获得了 Python 环境，但却没有 `pandas`这个模块的读者。

安装命令：

```shell
pip install pandas
```

或：

```shell
python -m pip install pandas
```

均可。

当然，实际上 `pandas`模块本身也有很多依赖，也需要其他一些模块才能够真正发挥出它强大的功能，因此我们推荐一次安装多个模块：

```shell
python -m pip install --user numpy scipy matplotlib ipython jupyter pandas sympy nose
```

### 1.2 安装 [Anaconda]( https://www.anaconda.com/ )

这种方式适合还没有安装 Python 的读者，或是已经安装了 Python 但是想一劳永逸拥有大多数科学计算库的读者。

访问 [Anaconda]( https://www.anaconda.com/ ) 官网找到下载链接进行安装即可。

或者如果你觉得 [Anaconda]( https://www.anaconda.com/ ) 过于臃肿，也可以安装其简化版本 [Miniconda](https://docs.conda.io/en/latest/miniconda.html) 。

## 2. 主要数据类型

`pandas`中有两个主要的数据类型，一种是 **Series**，称为“序列”，是一种一维数据结构；另一种是 **DataFrame**，称为“数据帧”或是“数据框架”，是一种二维数据结构。在`pandas`中，我们就是使用这两种主要的数据结构，“喜迎四海宾朋，笑对八方来客”，分分钟处理掉天上地下来的各种数据。

其中，Series 内部要求是同种数据，而 DataFrame 则可以使混合数据。更进一步地说， **DataFrame 其实就是包含了一至多个 Series**。

前面我们学习了`numpy`模块的基本相关知识，如果大家还有印象的话可以回忆一下。

`numpy`虽然提供了强大的多维数组供我们进行数据处理，但是这中间有一个要命的问题：**维数比较少的时候还好，维数一旦多起来，你还分得清哪个轴代表什么意义吗**？呃当然不排除有人可以，但是大多数人肯定是不行的，因为`numpy`的每个轴之间其实没有什么本质上的差异，你可以是轴 1，我也可以是轴 1，谁有比谁高贵怎么滴？因此在使用`numpy`进行高维数据处理，尤其是当其中每个维度都有特定的意义时，使用`numpy`的多维数组就会给使用者造成很大的负担——而这些本来不应该是由使用者负担的。

因此`pandas`的优势就体现出来了。`pandas`可以为每一列数据打上标签，这样通过标签就可以直接区分开每个轴谁是谁，也可以通过标签获得更具语义性的信息，知道每列数据都是什么、有什么用途。即使是交换了顺序也无所谓，比较在`pandas`中，我们可以不再以默认的序号作为索引。

当然`pandas`还有可以组合多种数据类型等优势，这些就留待大家在实践中体会啦~

我们预先导入`pandas`，并且由于演示过程中会用到`numpy`模块，在这里也一并导入：

```python
import numpy as np
import pandas as pd
```

### 2.1 Series

Series 实际上是一个带标签的一维数组，数组中的内容可以是任何数据类型。在 Series 中，“带标签的轴”统称为“index（索引）”，类似于我们之前学习的字典数据类型中的“key（关键字）”。

#### 2.1.1 创建 Series

创建 Series 最常用的方法就是调用`pd.Series`：

```python
>>> s = pd.Series(data, index=index)
```

其中，`data`要求是下列数据类型之一：

- Python 字典；
- Python 列表；
- N 维数组；
- 标量（即一个数字）。

而参数`index`则应当是一个用来指定轴标签的列表。

按照原始数据类型的不同，创建 Series 的方式也分为 4 种：1）用 Python 字典创建；2）用 Python 列表创建；3）用 N 维数组创建；4）用标量创建。

1. Python 字典

```python
>>> d = {'b': 1, 'a': 0, 'c': 2}
>>> s = pd.Series(d)
>>> s
b    1
a    0
c    2
dtype: int64
```

2. Python 列表

```python
>>> l = [1,2,3]
>>> s = pd.Series(l)
>>> s
0    1
1    2
2    3
dtype: int64
```

可以看到，在只使用列表而不提供索引值时，`pandas`会自动为 Series 中的数据分配默认索引作为标签。

3. N 维数组

```python
>>> ar = np.random.randn(5)
>>> ar
array([-0.12383463,  0.2312694 ,  1.82605315, -1.4743252 , -0.71267657])
>>> s = pd.Series(ar, index=['a', 'b', 'c', 'd', 'e'])
>>> s
a   -0.123835
b    0.231269
c    1.826053
d   -1.474325
e   -0.712677
dtype: float64
```

4. 标量

```python
>>> # 标量生成单元素序列
>>> s = pd.Series(5.)
>>> s
0    5.0
dtype: float64
>>> 
>>> # 标量生成多元素序列
>>> s = pd.Series(5., index=['a', 'b', 'c', 'd', 'e'])
>>> s
a    5.0
b    5.0
c    5.0
d    5.0
e    5.0
dtype: float64
```

#### 2.1.2 索引 Series

既然说到 Series 类似于一维数组，也就是说 Series 也可以通过序号进行索引：

```python
>>> s = pd.Series([5,-4,7,-8,9], index=['a','b','c','d','e'])
>>> s
a    5
b   -4
c    7
d   -8
e    9
dtype: int64
>>> s[2]
7
>>> s[1]
-4
```

其次，Series 还可以通过标签进行索引：

```python
>>> s['a']
5
>>> s['d']
-8
```

并且 Series 也有切片功能：

```python
>>> s[1:3]
b   -4
c    7
dtype: int64
>>> s[:3]
a    5
b   -4
c    7
dtype: int64
```

甚至标签也可以用于切片：

```python
>>> s['a':'d']
a    5
b   -4
c    7
d   -8
dtype: int64
```

都是观察可以发现，使用标签进行索引与使用序号进行索引还是存在一点儿**不同**：使用序号进行索引时，切片结果不会包括结束序号对应的内容；但使用标签进行索引就会包括末尾标签指定的内容。

还可以从 Series 中直接选取特定的项。同样地，也是既可以使用序号，也可以使用标签，但要记得将指定的序号或标签放在一个列表中：

```python
>>> # 使用序号
>>> s[[1,2]]
b   -4
c    7
dtype: int64
>>> 
>>> # 使用标签
>>> s[['a','d']]
a    5
d   -8
dtype: int64
```

此外还有根据条件进行筛选的用法，这种用法是一种`pandas`的`if-then`方言：

```python
>>> s[s > 0]
a    5
c    7
e    9
dtype: int64
```

这样就提取出了`s`中大于 0 的部分。

还要注意，Series 的直接赋值不会创建副本，如果想要新的 Series 对象与旧的没有关系，需要显式地创建副本并赋值：

```python
>>> s2 = s
>>> s2 is s
True
>>> s2 = s.copy()
>>> s2 is s
False
```

#### 2.1.3 Series 的运算

类似`numpy`数组地，Series 的算术运算——包括应用于很多`numpy`中的函数——也是逐元素进行的：

```python
>>> s + s
a    10.0
b    -8.0
c    14.0
d   -16.0
e    18.0
dtype: float64
>>> s * 2
a    10.0
b    -8.0
c    14.0
d   -16.0
e    18.0
dtype: float64
>>> np.exp(s)
a     148.413159
b       0.018316
c    1096.633158
d       0.000335
e    8103.083928
dtype: float64
```

而 Series 与`numpy`数组的不同之处在于，Series 有自动对齐的特性，也就是说，在运算中如果两个参与运算的 Series 数据长度不一样，`pandas`会自动用默认的缺省值补全缺失的部分，以使运算顺利进行：

```python
>>> s[1:] + s[:-1]
a     NaN
b    -8.0
c    14.0
d   -16.0
e     NaN
dtype: float64
```

简单来讲，在运算时如果遇到了“在某个运算对象中找不到对应项标签”的情况，那么`pandas`就会自作主张用缺省值`NaN`来代替。这就使得在进行交互式数据分析的时候有了极大的灵活性。

### 2.2 DataFrame

#### 2.2.1 创建 DataFrame

DataFrame 是一种二维带标签的数据结构，并且允许各列直接数据类型不同。我们既可以把它当做是电子表格或是 SQL 表，也可以将其当作是一个由若干个 Series 对象组成的字典；也是`pandas`中最常用的数据结构。

创建 DataFrame 的方法是调用`pd.DataFrame`：

```python
pd.Series(data, index=index, columns=columns)
```

其中的`data`参数要求是下列数据类型之一：

- 由一维数组、列表、字典或是 Series 构成的字典；
- 二维 Numpy 数组；
- 结构化数组；
- 一个 Series；
- 别的 DataFrame。

参数`index`对应于 DataFrame 中的行标签，参数`columns`对应于DataFrame 中的列标签。通过指定这两个参数，可以有筛选使用哪些数据来生成 DataFrame。

在这里我们仅仅介绍 3 中可能用到的方法。

1. 使用**由 Series 组成的字典**或**由字典组成的的字典**来创建 DataFrame

> 如果不指定`columns`参数的话，默认将`columns`设置为字典关键字的有序列表。

```python
>>> d = {'one': pd.Series([1., 2., 3.], index=['a', 'b', 'c']),
...      'two': pd.Series([1., 2., 3., 4.], index=['a', 'b', 'c', 'd'])}
>>> df = pd.DataFrame(d, index=['d', 'b', 'a'])
>>> df
   one  two
d  NaN  4.0
b  2.0  2.0
a  1.0  1.0
>>> df = pd.DataFrame(d, index=['d', 'b', 'a'], columns=['two', 'three'])
>>> df
   two three
d  4.0   NaN
b  2.0   NaN
a  1.0   NaN
>>> 
>>> # 默认形式
>>> df = pd.DataFrame(d)
>>> df
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
d  NaN  4.0
```

2. 使用 N 维数组或列表的字典

```python
>>> d = {'one': [1., 2., 3., 4.],
...      'two': [4., 3., 2., 1.]}
>>> pd.DataFrame(d)
   one  two
0  1.0  4.0
1  2.0  3.0
2  3.0  2.0
3  4.0  1.0
>>> pd.DataFrame(d, index=['a', 'b', 'c', 'd'])
   one  two
a  1.0  4.0
b  2.0  3.0
c  3.0  2.0
d  4.0  1.0
```

3. 使用字典组成的列表

```python
>>> data2 = [{'a': 1, 'b': 2}, {'a': 5, 'b': 10, 'c': 20}]
>>> pd.DataFrame(data2)
   a   b     c
0  1   2   NaN
1  5  10  20.0
>>> pd.DataFrame(data2, index=['first', 'second'])
        a   b     c
first   1   2   NaN
second  5  10  20.0
>>> pd.DataFrame(data2, columns=['a', 'b'])
   a   b
0  1   2
1  5  10
```

#### 2.2.2 索引 DataFrame

通过`index`和`columns`两个属性可以分别查看 DataFrame 的行标签和列标签：

```python
>>> d = {'one': pd.Series([1., 2., 3.], index=['a', 'b', 'c']),
...       'two': pd.Series([1., 2., 3., 4.], index=['a', 'b', 'c', 'd'])}
>>> df = pd.DataFrame(d)
>>> df
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
d  NaN  4.0
>>> df.index
Index(['a', 'b', 'c', 'd'], dtype='object')
>>> df.columns
Index(['one', 'two'], dtype='object')
```

可以使用列标签来索引：

```python
>>> df['one']
a    1.0
b    2.0
c    3.0
d    NaN
Name: one, dtype: float64
```

也可以直接将列标签作为属性：

```python
>>> df.one
a    1.0
b    2.0
c    3.0
d    NaN
Name: one, dtype: float64
```

还可以按列选取：

```python

>>> df[['one', 'two']]
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
d  NaN  4.0
```

要对 DataFrame 按行索引，则需要使用`loc`这个属性：

```python
>>> df.loc['a']
one    1.0
two    1.0
Name: a, dtype: float64
```

同样地，也可以通过行标签来按行切片、选取：

```python
>>> df.loc['a':'c']
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
>>> df.loc[['a','d']]
   one  two
a  1.0  1.0
d  NaN  4.0
```

此外，还可以使用`head`和`tail`来分别获取数据的前、后几行，具体数目由参数指定：

```python
>>> df.head(2)
   one  two
a  1.0  1.0
b  2.0  2.0
>>> df.tail(2)
   one  two
c  3.0  3.0
d  NaN  4.0
```

#### 2.2.3 统计信息

使用`describe`可以计算得到一个 DataFrame 数据的相关统计信息，并且计算统计信息时会自动忽略缺省值`NaN`。

```python
>>> df
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
d  NaN  4.0
>>> df.describe()
       one       two
count  3.0  4.000000
mean   2.0  2.500000
std    1.0  1.290994
min    1.0  1.000000
25%    1.5  1.750000
50%    2.0  2.500000
75%    2.5  3.250000
max    3.0  4.000000
```

其中`count`是各列的数据个数，`mean`是各列数据的平均值，`std`则对应标准差，后续的各行为从最小值到最大值的均匀数据。

还可以使用`median`方法主动求出平均值：

```python
>>> df.median() # 也适用于 Series
one    2.0
two    2.5
dtype: float64
```

### 2.3 其他

Series 和 DataFrame 都可以使用同样的方法转换为`numpy`数组的形式：

```python
>>> s.to_numpy()
array([ 5., -4.,  7., -8.,  9.])
```

此外，两种主要数据结构还有一个叫做`apply`的方法，用来对实例调用指定的函数。可以指定已有的函数，也可以临时定义一个匿名函数，后者更加常见一些：

```python
>>> df.apply(len)
one    4
two    4
dtype: int64
>>> df.apply(lambda x: x * x)
   one   two
a  1.0   1.0
b  4.0   4.0
c  9.0   9.0
d  NaN  16.0
```

## 3. 读取数据

实际上，大多数时候我们并不会手动创建一个 Series 或是 DataFrame，更一般的方法是通过使用`pandas`的读写接口，直接从文件中读取需要处理的数据。

为了演示`pandas`读取数据的功能，我们提供了一个真实的数据集，其中包含加利福尼亚州住房数据。同学们可以从“代码示例”获取该文件；也可直接使用示例代码中指定的 URL 进行下载。

```pyhton
california_housing_dataframe = pd.read_csv("/data/california_housing_train.csv", sep=",")
```

使用`columns`来看看有哪些种类的数据：

```python
>>> california_housing_dataframe.columns
Index(['longitude', 'latitude', 'housing_median_age', 'total_rooms',
       'total_bedrooms', 'population', 'households', 'median_income',
       'median_house_value'],
      dtype='object')
```

`pandas`提供了大量函数用于文件读写，适用于 CSV、Excel、HDF、SQL、JSON、HTML 等文件类型，还包括一个读取系统剪贴板的接口`pd.read_clipboard()`。

## 4. pandas 画图

上一节我们读取了一个真实的数据集，现在让我们针对其中意义最丰富的属性`median_house_value`（即平均房价）这一列，来画个直方图瞧一瞧：

```python
>>> import matplotlib.pyplot as plt
>>> california_housing_dataframe.hist('median_house_value')
array([[<matplotlib.axes._subplots.AxesSubplot object at 0x00000222934BC8D0>]],
      dtype=object)
>>> plt.show()
```

![加州平均房价直方图](http://www.justdopython.com/assets/images/2019/12/19/加州平均房价.png)

然后我们使用`latitude`作为 x 轴，以`latitude`作为 y 轴，考察一下加州房价在南北走向上的分布：

```python
>>> california_housing_dataframe.plot.scatter(y='median_house_value',x='latitude')
<matplotlib.axes._subplots.AxesSubplot object at 0x000002229301C7B8>
>>> plt.show()
```

![加州房价南北分布](http://www.justdopython.com/assets/images/2019/12/19/加州房价南北分布.png)

从图上我们可以看到，加州的房价在南北走向上有两个高价带。

再考察一下东西走向上的分布：

```python
>>> california_housing_dataframe.plot.scatter(y='median_house_value',x='longitude')
<matplotlib.axes._subplots.AxesSubplot object at 0x00000222939A87B8>
>>> plt.show()
```

![加州房价东西分布](http://www.justdopython.com/assets/images/2019/12/19/加州房价东西分布.png)

可以看到，加州房价在东西走向上也出现了两个高价带。显然加州高价房应该是集中在两个区域，我们可以通过对应的经纬度，找到这两个区域。

最后我们将经纬度分别作为 x、y 轴，将平均房价作为 z 轴画出一个三维图像，直观地观察一下：

```python
>>> from mpl_toolkits.mplot3d import Axes3D
>>> x = california_housing_dataframe['longitude']
>>> y = california_housing_dataframe['latitude']
>>> z = california_housing_dataframe['median_house_value']
>>> fig = plt.figure()
>>> ax = Axes3D(fig)
>>> ax.scatter(x,y,z)
<mpl_toolkits.mplot3d.art3d.Path3DCollection object at 0x00000222943317B8>
>>> plt.show()
```

![加州房价平面分布](http://www.justdopython.com/assets/images/2019/12/19/加州房价平面分布.png)

通过拖动 3D 图像转换视角，容易看出确实有两个区域集中分布着高价房。

## 5. 总结

本文初步介绍了`pandas`模块中最核心的两个数据类型：Series 和 DataFrame，以及它们的一些性质。

通过演示读取数据和使用`pandas`画图，我们熟悉了`pandas`的基本操作，也感受了一下数据可视化的效果。

> 示例代码：[Python-100-days](https://github.com/JustDoPython/python-100-day/tree/master/)

## 参考资料

[pandas 文档](https://pandas.pydata.org/pandas-docs/stable/index.html)

[Google colab - pandas 简介](https://colab.research.google.com/notebooks/mlcc/intro_to_pandas.ipynb)

[python：利用pandas进行绘图（总结）基础篇](https://blog.csdn.net/genome_denovo/article/details/78322628)