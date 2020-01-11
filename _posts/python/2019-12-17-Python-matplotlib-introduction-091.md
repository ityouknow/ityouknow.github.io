---
layout: post
title:  第91天：Python matplotlib introduction
category: python
copyright: python
---

by 潮汐

今天我们一起来探究 Python 中一个很有趣的模块--Matplotlib，Matplotlib 是一个非常优秀的 Python 2D 绘图库，只要给出符合格式的数据，通过 Matplotlib 就可以方便地制作数据图。

<!--more-->

### 一、初识 Matplotlib

- Matplotlib 以多种硬拷贝格式和跨平台的交互式环境生成出版物质量的图形。Matplotlib 可用于 IPython 脚本，Python 和 IPython Shell，Jupyter 笔记本，Web应用程序服务器和四个图形用户界面工具包。
- Matplotlib 尝试使容易的事情变得容易，使困难的事情变得可能。在实践过程中只需几行代码就可以生成图表，比如直方图、功率谱、条形图、误差图、散点图等。

![示例图](https://qiniu.mdnice.com/197cd9096caa65cd4c5aebbd9a719022.png)

![示例图](https://qiniu.mdnice.com/82577c0eb804bad6bba37634abc0a094.jpeg)


####  1、 IPython 

IPython 是 Python 的一个增强版本。它在下列方面有所增强：命名输入输出、使用系统命令（shell commands）、排错（debug）能力。我们在命令行终端给 IPython 加上参数 -pylab （0.12 以后的版本是 --pylab）之后，就可以像 Matlab 或者 Mathematica 那样以交互的方式绘图。

#### 2、pylab

pylab 是 matplotlib 面向对象绘图库的一个接口。它的语法和 Matlab 十分相近。也就是说，它主要的绘图命令和 Matlab 对应的命令有相似的参数。

### 二、 安装

#### 在线安装
安装 Matplotlib 包与安装其他 Python 包一样，都可以使用 pip 来安装。
启动命令行窗口，在命令行窗口中输入如下命令：

```
pip3 install matplotlib
```

输入上面的命令后会自动下载安装 Matplotlib 包的最新版本。下载完成后会安装，最后提示 Matplotlib 包安装成功：

```
Installing collected packages: matplotlib
Successfully installed matplotlib-3.1.1
```

#### 离线安装

在有网络限制条件下我们需要下载离线包来安装，python matplotlib 离线安装需要提前下载好与 python 版本对应的 wheel 安装包，[下载地址](https://pypi.org/project/matplotlib/#files)

![安装包图片](https://imgkr.cn-bj.ufileos.com/9bbb8246-41c5-44e8-b68b-32fcf133d368.png)

在上图中选择相应的安装包下载即可，`cp36` 表示 python 是 3.6 版本，同样的 `cp37` 表示 python 是3.7 版本，同样可以在 python 命令行下使用一下命令查看支持的版本属性：

```python
>>>python
>>> import pip._internal
>>> print(pip._internal.pep425tags.get_supported())
```

![安装包支持版本](https://imgkr.cn-bj.ufileos.com/189d2fad-d6df-417a-b0fd-3b8dcb54d597.png)

以上结果可以显示出相应的版本支持，下载好后 使用 pip命令安装即可成功：

```
pip install matplotlib-3.1.1-cp36-cp36m-manylinux1_x86_64.whl
```

### 三、matplotlib 架构

#### 1、matplotlib 架构图

![matplotlib 架构图](https://imgkr.cn-bj.ufileos.com/56b0bdb3-860b-463b-9831-579508591e96.png)

matplotlib 框架分为三层，这三层构成了一个栈，上层可以调用下层，三层框架描述如下：

- 脚本层 (pyplot)：简化了完成数据分析与可视化的常规操作。 管理创建图形、坐标轴以及他们与后端层的连接。
- 艺术家层 (artist)：管理漂亮图形背后的大多数内部活动。
- 后端层 (backend)：matplotlib 的底层，实现了大量的抽象接口类；还和用户界面工具箱整合在一起；可以将图形保存为不同格式(比如PDF、PNG、PS和SVG等)。

这三层属于matplotlib程序包的范畴，脚本层(pytplot模块)可以提供给我们一个与matplotlib打交道的接口，我们可以只通过调用pyplot模块的函数从而操作整个程序包，来绘制图形。

#### 2、matplotlib 编程接口

matplotlib 编程接口由 3 层组成，组成描述如下：
- 第一层状态机环境，是由 pyplot 提供的。
- 第二层是有 pyplot 和面向对象(oo)接口提供，由 pyplot 获取 figure 对象，通过面向对象接口来显示地管理axies 对象。
- 第三层由面向对象(oo)接口提供，该层完全不使用 pyplot 模块。

**编程接口图：**

![编程接口图](https://qiniu.mdnice.com/2b42791299f3f60c3dfd713539799dbb.png)


### 四、matplotlib 绘图概念

#### 1、 绘图方式

在matplotlib库里，总分成两种绘图方式

- 方法一：函数式绘图

绘图方法通过调用一系列函数传入数据绘制出相应的图，
在 matplotlib.pyplot 里是封装好的函数，用户可以直接调用函数进行绘图。
一般的，我们约定 matplotlib.pyplot 取别名为 plt

其模块下主要定义如下两方面的函数：

操作类的函数：对于画布，图，子图，坐标轴，图例，背景，网格等的操作。
如：
`plt.ylabel(), plt.xlabel(), plot.yscale(), plt.legend(), plt.title(), plt.text()等`

绘图类的函数：画折线图，散点图，条形图，直方图，饼状图等特点图的绘制函数。
如：
`plt.scatter, plt.plot(), plt.bar, plot.pie(), plt.hise()……`

**绘图部分函数如下：**

|序号|	绘图函数（plt.xxx）|	说明|
| --- | --- | --- |
|1|	acorr()	|绘制x的自相关图|
||2|	angle_spectrum()|	绘制角度谱图|
|3	|bar()	|制作条形图|
|4|	barbs()|	绘制倒钩的二维场图|
|5|	barh()	|制作水平条形图|
|6|	boxplot()	|制作一个盒子和胡须图|
|7|	broken_barh()|	绘制一个水平的矩形序列图|
|8|	clabel()|	绘制等高线图|
|9	|cohere()	|绘制x和y之间的一致性图|
|10	|csd()	|绘制交叉谱密度图|
|11	|eventplot()	|绘制相同的平行线|
|12	|fill()|	绘制填充多边形图|
|13	|hexbin()	|制作六边形分箱图|
|14	|hist()|绘制直方图|
|15	|hist2d()	|制作2D直方图|
|16	|magnitude_spectrum()|	绘制幅度谱图|
|17	|phase_spectrum()|	绘制相位谱图|
|18	|pie()	|绘制饼图|
|19	|plot()	|绘制折线图|
|20	|plot_date()	|绘制包含日期的数据图|
|21	|quiver()|	绘制一个二维箭头场图|
|22	|scatter()|绘制散点图|
|23	|specgram()	|绘制频谱图|
|24	|stackplot()|	绘制堆积区域图|
|25|	streamplot()	|绘制矢量流的流线型图|
|26|	triplot()	|绘制非结构化三角形网格作为线条图|

- 方法二：面向对象式绘图

面向对象式的绘图，才是matplotlib绘图最自然的方式

**下图是 matplotlib 基本的组成部分**

![matplotlib 绘图概念描述](https://qiniu.mdnice.com/10ce120d56575c1dee417fdd692df90a.png)

元素描述：
| 元素| 描述 |
| --- | --- |
|   figure  |  图形   |
| axes    |  子图形   |
|title|标题|
|legend|图例|
|Major tick(|大标尺刻度|
|Minor tick|小标尺刻度|
|Major tick label(|大标尺刻度数值|
|Minor tick label|小标尺刻度数值|
|Y axis label|y轴指标说明|
|X axis label|x轴指标说明|
|Line|线型图)|
|Markers|数据标注点|
|Grid|格子|

**基本对象描述如下：**

1) Figure(图)

指整个图形(包括所有的元素,比如标题、线等)。 管理着所有的坐标系，还有一些特殊的艺术家和canvas(画布)。
	
- 整个图形即是一个Figure对象，即一个弹出的绘图的窗口，便是一个figure。
- Figure对象至少包含一个子图，也就是Axes对象。
- Figure对象包含一些特殊的Artist对象，如title标题、图例legend。
- Figure对象包含画布canvas对象。 canvas对象一般不可见，通常无需直接操作该对象，matplotlib程序实际绘图时需要调用该对象。
  
2) Axes(坐标系)

数据的绘图区域

- 字面上理解，axes是数据轴axis的复数，但它并不是指数据轴，而是子图对象。可以这样理解，每一个子图都有x和y轴，axes则用于代表这两个数据轴所对应的一个子图对象。
-常用方法set_xlim()以及set_ylim()：
 	- 设置子图x轴和y轴对应的数据范围。
 	- set_title()：设置子图的标题。
 	- set_xlabel()以及set_ylable()：
 	- 设置子图x轴和y轴指标的描述说明。
 
3) Axis(坐标轴)

坐标系中的一条轴，包含大小限制、刻度和刻度标签。
 	
- Axis是数据轴对象，主要用于控制数据轴上刻度位置和显示数值。
- Axis有Locator和Formatter两个子对象，分别用于控制刻度位置和显示数值。
  
4) artist(艺术家)

图中所有的对象都是artis，当图形显示时，所有的艺术家都会被绘制到画布上。

- 基本上所有的对象都是一个Artist对象，包括Figure对象、Axes对象和Axis对象，可以将Artist理解为一个基本类。
- 当提交代码，图像最终呈现时，所有的artist对象都会绘制于canvas画布上
  
**值得注意的是：**

- 一个figure(图)可以包含多个axes(坐标系)，但是一个axes只能属于一个figure。
- 一个axes(坐标系)可以包含多个axis(坐标轴)，包含两个即为2d坐标系，3个即为3d坐标系

绘图之间的层级结构如下：

![层级结构图](https://qiniu.mdnice.com/382eb70727df3391c4989f20aea621c3.png)


#### 3、绘图步骤

在现实生活中，如果我们要画一幅画，首先需要什么工具呢？
1. 首先咱们需要一个画板
2. 其次还需要一张画布
3. 指定大致轮廓（轴），轴是绘画的基准
3. 最后是画画工具（画笔…）

而使用 Matplotlib 画图同样如此，首先需要指定一个画板，再指定一张画布，然后再指定元素开始作画。

例如：

```
import matplotlib.pyplot as plt
# 指定一个画板
fig = plt.figure()
# 指定画板后指定轴
# ax = fig.add_subplot(111)
ax1 = fig.add_subplot(221)
ax2 = fig.add_subplot(222)
ax3 = fig.add_subplot(224)
ax4 = fig.add_subplot(223)
# 设置轴的位置
# ax.set(xlim=[0.5, 4.5], ylim=[-2, 8], title='An Example Axes',
#        ylabel='Y-Axis', xlabel='X-Axis')
plt.show()
```
运行结果如下：

![运行结果图](https://qiniu.mdnice.com/155dac9054065a22fd1ded43da5dcd6b.png)


#### 3、matplotlib 重要模块 pyplot 详解

matplotlib.pytplot包含了一系列类似于matlab的画图函数。 它的函数作用于当前图形(figure)的当前坐标系(axes)。

#### 3.1 导入模块	

```
import matplotlib.pyplot as plt
```
#### 3.2 运用模块

导入模块后，调用相应函数，例如

```python
plot(xdata,ydata,format)
```
函数参数：

- xdata:所有点的x坐标，如果不传默认是[0:]。
- ydata:所有点的y坐标。
- format:绘制的格式，默认是’b-‘。比如’b-+’：分别代表颜色、线形和标记。 
	- 颜色：绘制的颜色(b指blue,蓝色)。
	- 线性：点之间的连线样式(-指实线)。
	- 标记：点的风格(+为加号）。
  
例如：

```
import matplotlib.pyplot as plt
plt.plot([1,2],[1,2],'r--+')
plt.show()
```
运行结果为：

![运行结果图](https://qiniu.mdnice.com/06b781a8a0c7ff2c6b2a62a3178ab361.png)

再例如一个简单的折线图如下：
```python
import matplotlib.pyplot as plt

x = (1,3,5,9,13)

y = (2,5,9,12,28)

# 调用绘制方法
# 设置线条属性
# linewidth属性设置线条的宽度
plt.plot(x,y,linewidth = 5)

# 显示图片
plt.show()
```

运行结果：
![运行结果图](https://imgkr.cn-bj.ufileos.com/9b645225-2e6d-4285-b46c-ae2e9b06892c.png)

除了设置这些属性以外，图形还可以设置其他属性，这些概念我们将在下一节文章中作详细的讲解。

## 总结

凡事预则立，学习任何一门知识也得从最基本开始，本章节对 matplotlib 模块做了详细的概念描述，在接下来的的章节中将结合 NumPy 模块进行实战性演练，以此对初入门的伙伴们做更好的支撑。

###  参考

https://blog.csdn.net/hekind/article/details/79542040
https://matplotlib.org/3.1.1/contents.html
https://matplotlib.org/api/_as_gen/matplotlib.pyplot.html?highlight=matplotlib%20pyplot#module-matplotlib.pyplot

> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)
