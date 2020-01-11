---
layout: post
title:  第92天：Python Matplotlib 进阶操作
category: python
copyright: python
---

by 潮汐

本章节主要是 Matplotlib 和 NumPy  实际操作案例讲解，matplotlib 通常与 NumPy 一起使用，提供了一种有效的 MatLab 开源替代方案，除此之外，它还可以和其他图形工具包搭配使用。前提是在现在的环境中已经安装了 Numpy 模块，Numpy 安装详情请参考[第 79 天：数据分析之 Numpy 初步](https://mp.weixin.qq.com/s/0ou9rd7-CNhvC5O33CESEw) 

这一节将从简到繁用实例讲解 matplotlib 和 Numpy 结合使用的知识点。

<!--more-->

### 1、折线图

使用 Numpy的函数 `np.arange()` 函数创建 x 轴上的值。将 y 轴上的对应值存储在另一个数组对象 y 中。 这些值使用 matplotlib 软件包的 pyplot 子模块的 plot() 函数绘制。

实例如下：

``` python
# 导入模块
import numpy as np
import matplotlib.pyplot as plt

# 绘制 x 轴数据
x = np.arange(2,15)
y = 3 * x+6

# 给图形设置标题
plt.title('line chart')
# 设置 x 轴和 y 轴的属性名
plt.xlabel("x axis")
plt.ylabel("y axis")

# 绘制图形
plt.plot(x,y)

# 显示图形
plt.show()
```
以上程序运行结果图：

![折线图](https://imgkr.cn-bj.ufileos.com/d0d4157c-cad9-460c-9d27-58c15b7f08a9.png)

注意：作为线性图的替代，可以通过向 plot() 函数添加格式字符串来显示离散值，可以使用以下格式化字符,表格如下：

|  字符   |  描述   |
| --- | --- |
|'-'	|实线样式|
|'--'	|短横线样式|
|'-.'	|点划线样式|
|':'	|虚线样式|
|'.'	|点标记|
|','	|像素标记|
|'o'	|圆标记|
|'v'	|倒三角标记|
|'^'	|正三角标记|
|'&lt;'	|左三角标记|
|'&gt;' |右三角标记|
|'1'	|下箭头标记|
|'2'	|上箭头标记|
|'3'	|左箭头标记|
|'4'	|右箭头标记|
|'s'	|正方形标记|
|'p'	|五边形标记|
|'*'	|星形标记 |
|'h'	|六边形标记 1|
|'H'	|六边形标记 2|
|'+'	|加号标记|
|'x'	|X 标记|
|'D'	|菱形标记|
|'d'	|窄菱形标记|
|'&#124;'	|竖直线标记|
|'_'	|水平线标记|

图形显示颜色缩写简写表格如下：

|   字符  |  颜色   |
| --- | --- |
|  'b'   |  蓝色   |	
|'g'	|绿色|
|'r'	|红色|
|'c'	|青/绿色|
|'m'	|品红色|
|'y'	|黄色|
|'k'	|黑色|
|'w'	|白色|
|'o'|橙色|

### 2、散点图

使用以上两个表格表示的简化符号画一个绿色散点图，散点使用 `'o'`表示，，具体实例如下：

```
# 导入模块
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(2, 15)
y = 2 * x + 6
plt.title("scatter chart")
plt.xlabel("x axis")
plt.ylabel("y axis")

# 设置图形样式和颜色
plt.plot(x, y, "oc")
plt.show()
```
以上程序运行结果为：

![散点图](https://imgkr.cn-bj.ufileos.com/3d1fe007-c62f-454b-817c-37360bbf4c49.png)

例如绘制一个倒三角图形：

```
# 导入模块
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(2, 15)
y = 2 * x + 6
plt.title("triangle_scatter chart")
plt.xlabel("x axis")
plt.ylabel("y axis")

# 设置图形样式和颜色
plt.plot(x, y, "^c")
plt.show()
```

显示结果如下：

![倒三角性散点图](https://imgkr.cn-bj.ufileos.com/9d222900-ee0e-40c2-b9c8-5ea1c0d364a1.png)

### 3、正余弦波形图

#### 正弦波形图

正弦波形图的绘制需要用到 Numpy 的数学函数 sin() 和 cos(),详细的数学函数使用请参考 NumPy 系列文章：[第 84 天：NumPy 数学函数](https://mp.weixin.qq.com/s/kGHQUDyJykvwxySznKa05Q)

```python
import numpy as np
import matplotlib.pyplot as plt

# 计算正弦曲线上点的 x 和 y 坐标
print(np.pi)

# 绘制 x 轴，从 0 开始，
x = np.arange(0, 3 * np.pi,  0.1)
y = np.sin(x)

# 设置标题
plt.title("sine wave form")

# 绘制图形点
plt.plot(x, y, 'y')
plt.show()
```
显示结果：

![正弦波形图](https://imgkr.cn-bj.ufileos.com/cf6a15d5-fa61-4a71-9d67-68ccb0783f3e.png)

#### 余弦波形图

```
import numpy as np
import matplotlib.pyplot as plt

# 计算正弦曲线上点的 x 和 y 坐标
print(np.pi)

# 绘制 x 轴，从 0 开始，
x = np.arange(0, 4 * np.pi,  0.1)
y = np.cos(x)

# 设置标题
plt.title("cosine wave form")

# 绘制图形点
plt.plot(x, y, 'm')
plt.show()
```
![余弦波形图](https://imgkr.cn-bj.ufileos.com/44f1f1d6-285e-4f9e-9d4d-733a7cbeafc2.png)

#### 正余弦波形图

在一张图中显示出正弦函数和余弦函数，这里需要使用 subplot 来建立网格图，一幅图中使用两个网格，两个网格中分别展示正弦函数和余弦函数；subplot 函数使用说明如下：

matplotlib 中, 一个 Figure 对象可以包含多个子图(Axes), 可以使用 subplot() 快速绘制, 调用形式如下 :
``` python
subplot(numRows, numCols, plotNum)
```
**参数说明：**

- 图表的整个绘图区域被分成 numRows 行和 numCols 列
- 然后按照从左到右，从上到下的顺序对每个子区域进行编号，左上的子区域的编号为1，左下子区域编号为3，右上子区域编号为2，右下子区域编号为 4，当然具体的还要看指定网格的行数和列数而定。
- plotNum 参数指定创建的 Axes 对象所在的区域

**网格编号图如下：**

![网格编号图](https://imgkr.cn-bj.ufileos.com/69e3b875-63ef-42f0-a002-8226f6c9bc47.png)

假如 numRows ＝ 2, numCols ＝ 3, 那整个绘制图表样式为 2X3 的图片区域, 用坐标表示为
```
(1, 1), (1, 2), (1, 3)
(2, 1), (2, 2), (2, 3)
```
再当 plotNum ＝ 3 时, 表示的坐标为(1, 3), 即第一行第三列的子图
如果 numRows, numCols 和 plotNum 这三个数都小于 10 的话, 可以把它们缩写为一个整数, 例如 subplot(323) 和 subplot(3,2,3) 是相同的。

subplot 在 plotNum 指定的区域中创建一个轴对象， 如果新创建的轴和之前创建的轴重叠的话，之前的轴将被删除。

**例1：上述网格编号图代码如下**

```python
import matplotlib.pyplot as plt

plt.subplot(2,2,1)
plt.xticks([]), plt.yticks([])
plt.text(0.5,0.5, 'subplot(2,2,1)',ha='center',va='center',size=20,alpha=.5)

plt.subplot(2,2,2)
plt.xticks([]),plt.yticks([])
plt.text(0.5,0.5, 'subplot(2,2,2)',ha='center',va='center',size=20,alpha=.5)

plt.subplot(2,2,3)
plt.xticks([]), plt.yticks([])
plt.text(0.5,0.5, 'subplot(2,2,3)',ha='center',va='center',size=20,alpha=.5)

plt.subplot(2,2,4)
plt.xticks([]), plt.yticks([])
plt.text(0.5,0.5, 'subplot(2,2,4)',ha='center',va='center',size=20,alpha=.5)

plt.show()
```

**例4:**
```
import matplotlib.pyplot as plt

plt.subplot(211) # 第一行的左图
plt.subplot(212) # 第一行的右图

plt.show()
```
**还可以表示为：**
```
import matplotlib.pyplot as plt

plt.subplot(2,1,1)
#设置 x 和 y 轴上的值
plt.xticks([]), plt.yticks([]) # 表示无显示值
plt.text(0.5,0.5, 'subplot(2,1,1)',ha='center',va='center',size=24,alpha=.5)

plt.subplot(2,1,2)
plt.xticks([]), plt.yticks([])
plt.text(0.5,0.5, 'subplot(2,1,2)',ha='center',va='center',size=24,alpha=.5)

plt.show()
```

**结果显示：**

网格图1：
![网格图1](https://imgkr.cn-bj.ufileos.com/e6d3aede-ae0d-4d59-b33f-b962c80ce38e.png)

网格图2:

![网格图2](https://imgkr.cn-bj.ufileos.com/f787f73a-cb0f-4a96-b40e-1bb701a44a1e.png)

所以正余弦函数波形图可以表示为：
```

# 计算正弦和余弦曲线上的点的 x 和 y 坐标
x = np.arange(0,  3  * np.pi,  0.1)
y_sin = np.sin(x)
y_cos = np.cos(x)

# 建立 subplot 网格，高为 2，宽为 1
# 激活第一个 subplot
plt.subplot(2,  1,  1)
# 绘制第一个图像
plt.plot(x, y_sin)
plt.title('Sine')

# 将第二个 subplot 激活，并绘制第二个图像
plt.subplot(2,  1,  2)
plt.plot(x, y_cos)
plt.title('Cosine')

# 展示图像
plt.show()
```
最后图形展示：

![正余弦波形图](https://imgkr.cn-bj.ufileos.com/e5237ea8-1c43-4d87-ba31-c5f906de87b0.png)

### 4、直方图

直方图也称条形图，pyplot 子模块提供 bar() 函数来生成条形图，下面的实例是一个使用 `bar()` 函数生成的一个简单的柱状图.
实例如下：

```python
import matplotlib.pyplot as plt

# 设置 x 的 x 轴和 y 轴数值
x = [5,8,10]
y = [12,16,6]

# 设置 x2 的 x 轴和 y 轴数值
x2 = [6,9,11]
y2 = [6,15,7]

# 使用 bar() 函数设置条形图的颜色和对齐方式
plt.bar(x, y,color='y', align='center')
plt.bar(x2, y2, color='c', align='center')

# 设置标题
plt.title('Bar chart')
# 设置 x 轴和 y 轴的属性名
plt.ylabel('Y axis')
plt.xlabel('X axis')

# 展示图形
plt.show()
```
程序运行结果为：

![直方图](https://imgkr.cn-bj.ufileos.com/80bcb1a7-701e-48b1-9d36-ed09d51923b3.png)

**Matplotlib 结合 NumPy 使用：**

这时候需要用到 NumPy 中的直方统计函图：histogram

```
histogram(a,bins=10,range=None,weights=None,density=False);
```

**参数说明：**

- `a` 是待统计数据的数组；
- `bins`指定统计的区间个数；
- `range`是一个长度为2的元组，表示统计范围的最小值和最大值，默认值 `None`，表示范围由数据的范围决定
- `weights`为数组的每个元素指定了权值,`histogram()`会对区间中数组所对应的权值进行求和
- `density`为 `True` 时，返回每个区间的概率密度；为 `False`，返回每个区间中元素的个数

**函数说明：**

- `numpy.histogram()` 函数是数据的频率分布的图形表示。 水平尺寸相等的矩形对应于类间隔，称为 bin，变量 height 对应于频率。
- `numpy.histogram()` 函数将输入数组和 bin 作为两个参数。 bin 数组中的连续元素用作每个 bin 的边界。

**例如：**
```
import numpy as np

# 赋值数组 a
a = np.array([22, 87, 5, 43, 56, 73, 55, 54, 11, 20, 51, 5, 79, 31, 27])

# 调用函数
np.histogram(a, bins=[0, 20, 40, 60, 80, 100])
hist, bins = np.histogram(a, bins=[0, 20, 40, 60, 80, 100])

# 输出值
print(hist)
print(bins)
```

**输出结果为：**

```
[3 4 5 2 1]
[  0  20  40  60  80 100]
```

**`plt()`函数使用：**

Matplotlib 可以将直方图的数字表示转换为图形。 pyplot 子模块的 plt() 函数将包含数据和 bin 数组的数组作为参数，并转换为直方图，例如：
```
import numpy as np
import matplotlib.pyplot as plt

# 赋值数组 a
a = np.array([22, 87, 43, 56, 73, 55, 11, 20, 51, 5, 79, 27,100])

# plt() 函数将数据变为直方图
plt.hist(a, bins=[0,20,40,60,80,100])
plt.title("histogram")
# 显示图形
plt.show()
```
显示结果：

![直方图](https://imgkr.cn-bj.ufileos.com/42838895-1e13-41ca-8f32-76548d66c4cf.png)

### 5、曲线图

**例1：一个简单的曲线图**

画出一个简单的曲线图，如下所示：

```python
import matplotlib.pyplot as plt
import numpy as np

n = 256
X = np.linspace(-np.pi,np.pi,n,endpoint=True)
Y = np.sin(2*X)

plt.plot (X, Y+1, color='blue', alpha=1.00)
plt.plot (X, Y-1, color='blue', alpha=1.00)

plt.title('curve_chart1')
plt.show()
```

**结果展示为：**

![曲线图1](https://imgkr.cn-bj.ufileos.com/e6b7a0c3-4609-49b0-af1e-0f2afcc5d812.png)

**例2：升级版的曲线图**
```
import numpy as np
import matplotlib.pyplot as plt

n = 256
X = np.linspace(-np.pi,np.pi,n,endpoint=True)
Y = np.sin(2*X)

plt.plot (X, Y+1, color='blue', alpha=1.00)
plt.fill_between(X, 1, Y+1, color='blue', alpha=.25)

plt.plot (X, Y-1, color='blue', alpha=1.00)

# 设置线条颜色和填充颜色区域
plt.fill_between(X, -1, Y-1, (Y-1) > -1, color='blue', alpha=.25)
plt.fill_between(X, -1, Y-1, (Y-1) < -1, color='red',  alpha=.25)

plt.title('curve_chart2')
plt.show()
```

**结果展示为：**

![曲线图2](https://imgkr.cn-bj.ufileos.com/11ebde92-457f-4fbc-ab28-852bb870145e.png)

### 总结

本章节是 Matplotlib 结合 NumPy 使用的画图方法，主要介绍了折线图、正余弦波形图、方形图、曲线图的基本画法，同时也详细讲述了子图 `subplot`的基本使用方法，希望以上知识点能对学习这一模块的伙伴们提供更好支撑，若有任何问题欢迎在交流群中进行交流 :)

### 参考

https://www.runoob.com/numpy/numpy-matplotlib.html
https://www.runoob.com/w3cnote/matplotlib-tutorial.html
https://matplotlib.org/tutorials/introductory/usage.html#sphx-glr-tutorials-introductory-usage-py

> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)