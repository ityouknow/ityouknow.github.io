---
layout: post
title:  第96天：图像库 PIL（一）
category: python
copyright: python
---

by 闲欢

Python 提供了 PIL（python image library）图像库，来满足开发者处理图像的功能，该库提供了广泛的文件格式支持，包括常见的 JPEG、PNG、GIF 等，它提供了图像创建、图像显示、图像处理等功能。
<!--more-->

## 基本概念

要学习 PIL 图像库的使用，我们必须先来了解一些关于图像的基本概念，包括深度（depth），通道（bands），模式（mode），坐标系统（coordinate system）等。

### 图像的深度

图像中像素点占得 bit 位数，就是图像的深度，比如：

二值图像：图像的像素点不是0就是1 （图像不是黑色就是白色），图像像素点占的位数就是1位，图像的深度就是1，也称作位图。

灰度图像：图像的像素点位于0-255之间（0代表全黑，255代表全白，在0-255之间插入了255个等级的灰度）。2^8=255，图像像素点占的位数就是8位，图像的深度是8。

依次类推，我们把计算机中存储单个像素点所用的 bit 位称为图像的深度。

### 图像的通道

每张图像都是有一个或者多个数据通道构成的，如  RGB 是基本的三原色（红色、绿色和蓝色），如果我们用8位代表一种颜色，那么每种颜色的最大值是255，这样，每个像素点的颜色值范围就是（0-255, 0-255, 0-255）。这样的图像的通道就是3。而灰度图像的通道数是1。

### 图像的模式

图像实际上是像素数据的矩形图，图像的模式定义了图像中像素的类型和深度，每种类型代表不同的深度，在 PIL 中我们称之为图像的模式。常见的模式有以下几种：

>1：1位像素，表示黑和白，占8 bit ，在图像表示中称为位图。

>L：表示黑白之间的灰度，占8 bit 像素。

>P：8位像素，使用调色版映射。

>RGB：真彩色，占用 3x8 位像素，其中 R 为红色，G 为绿色，B为蓝色，三原色叠加形成的色彩变化，如三通道都为0则代表黑色，都为255则代表白色。

>RGBA：为带透明蒙版的真彩色，其中的 A 为 alpha 透明度，占用 4x8 位像素

其他的还有 CMYK、 YCbCr、I、F等不常用的模式，这里就不多做介绍了。

### 图像的坐标系

PIL 中图像的坐标是从左上角开始，向右下角延伸，以二元组 （x，y）的形式传递，x 轴从左到右，y 轴从上到下，即左上角的坐标为 (0, 0)。那么矩形用四元组表示就行，例如一个450 x 450 像素的矩形图像可以表示为 (0, 0, 450, 450)。


## PIL 的安装

和其他库一样，PIL 的安装也很简单：

> pip3 install pillow


## PIL 图像模块的功能

### 打开图像

我们可以从本地目录中打开文件，也可以从文件流中打开图像。打开文件的方法为：

> Image.open(file,mode)

读取图像文件，mode 只能是 ‘r’，所以我们也可以省略这个参数。

```
from PIL import Image
from io import BytesIO
import requests

# 打开图像文件
im = Image.open('cat.jpg')

# 从文件流中打开图像
r = requests.get('http://f.hiphotos.baidu.com/image/pic/item/b151f8198618367aa7f3cc7424738bd4b31ce525.jpg')
im2 = Image.open(BytesIO(r.content))

# 展示图像
im.show()
im2.show()

# 翻转90度展示
im.rotate(90).show()
```

我们首先打开本目录下的 cat.jpg 图像，接着从百度图片请求到一张图片，使用文件流的方式打开。使用 show 方法可以展示图像。我们也可以使用 rotate 方法来是图像翻转角度。运行程序，我们会看到弹出三张图片，一张是 cat.jpg 对应的图像，一张是百度图片中的图像，还有一种是将 cat.jpg 翻转90度后展示的图像。

### 创建图像

> Image.new(mode,size,color)

我们可以使用给定的模式、大小和颜色来创建新图像。大小以（宽度，高度）的二元组形式给出，单位为像素；颜色以单波段图像的单个值和多波段图像的元组（每个波段的一个值）给出，可以使用颜色名如 ‘red’ ，也可以受用16进制 '#FF0000' 或者使用数字表示（255,0,0）。

```
from PIL import Image

im = Image.new('RGB', (450, 450), (255, 0, 0))
im1 = Image.new('RGB', (450, 450), 'red')
im2 = Image.new('RGB', (450, 450), '#FF0000')
im.show()
im1.show()
im2.show()
```

上面例子中我们分别通过三种形式创建了 RGB 模式的大小为 450x450 ，颜色为红色的图像，最终的图像效果是一样的。

### 转换格式

> Image.save(file)

我们直接使用保存方法，修改保存的文件名就可以转换图像的格式。

```
from PIL import Image

# 加载 cat.jpg
im = Image.open('cat.jpg', 'r')

# 打印图片类型
print(im.format)

# 保存为 png 类型图片
im.save('cat.png')

# 加载新保存的 png 类型图片
im2 = Image.open('cat.png', 'r')

# 打印新保存图片类型
print(im2.format)


# 输出结果
JPEG
PNG
```

例子中我们先打开 cat.jpg 图像，然后新保存一张类型为 png 的图像，通过打印我们可以看到两者的格式。

### 创建缩略图

> Image.thumbnail(size, resample=3)

修改当前图像制作成缩略图，该缩略图尺寸不大于给定的尺寸。这个方法会计算一个合适的缩略图尺寸，使其符合当前图像的宽高比，调用方法 draft() 配置文件读取器，最后改变图像的尺寸。

size 参数表示给定的最终缩略图大小。

resample 参数是过滤器，只能是 NEAREST、BILINEAR、BICUBIC 或者 ANTIALIAS 之一。如果省略该变量，则默认为 NEAREST。

注意：在当前PIL的版本中，滤波器 BILINEAR 和 BICUBIC 不能很好地适应缩略图产生。用户应该使 用ANTIALIAS，图像质量最好。如果处理速度比图像质量更重要，可以选用其他滤波器。这个方法在原图上进行修改。

```
from PIL import Image

# 加载图像
im = Image.open('cat.png')

# 展示图像
im.show()

# 图像尺寸
size = 128, 128
# 缩放图像
im.thumbnail(size, Image.ANTIALIAS)

# 展示图像
im.show()
```

我们将一个 450x450 大小的图像缩放成了 128x128 大小的图像，程序运行的结果如下图：

![](http://www.justdopython.com/assets/images/2019/python/thumbnail.png)


### 融合图像

> Image.blend(image1, image2, alpha) 

将图像 image1 和 图像 im2 根据 alpha 值进行融合，公式为：

> out = image1 * (1.0 - alpha) + image2 * alpha

image1 和 image2 表示两个大小和模式相同的图像， alpha 是介于 0 和 1 之间的值。如果 alpha 为0，返回 image1 图像，如果 alpha 为1，返回 image2 图像。

```
from PIL import Image

# 蓝色图像
image1 = Image.new('RGB', (128, 128), (0, 0, 255))
# 红色图像
image2=Image.new('RGB', (128, 128), (255, 0, 0))
# 取中间值
im = Image.blend(image1, image2, 0.5)
image1.show()
image2.show()
# 显示紫色图像
im.show()
```

我们将一张蓝色图像和一张红色图像进行融合，融合度为两张图像各0.5，最终得到一张紫色图像（因为红色叠加蓝色会调和成紫色）。显示图像如下图：

![](http://www.justdopython.com/assets/images/2019/python/blend.png)


### 像素点处理

> Image.eval(image, *args)

根据传入的函数对图像每个像素点进行处理。第一个参数 image 为需要处理的图像对象，第二个参数是函数对象，有一个整数作为参数。

如果变量image所代表图像有多个通道，那么函数作用于每一个通道。注意：函数对每个像素点只处理一次，所以不能使用随机组件和其他生成器。

```
from PIL import Image

im = Image.open('cat.jpg')
im.show()

# 将每个像素值翻倍（相当于亮度翻倍）
evl1 = Image.eval(im, lambda x: x*2)
evl1.show()

# 将每个像素值减半（相当于亮度减半）
evl2 = Image.eval(im, lambda x: x/2)
evl2.show()
```

我们分别对图像进行像素值翻倍和减半处理，显示效果如下图：

![](http://www.justdopython.com/assets/images/2019/python/eval.png)


### 合成图像

> Image.composite(image1, image2, mask)

使用给定的两张图像及 mask 图像作为透明度，创建出一张新的图像。变量 mask 图像的模式可以为“1”，“L” 或者 “RGBA”。所有图像必须有相同的尺寸。

```
from PIL import Image

# 打开 cat.png
image1 = Image.open('cat.png')

# 打开 flower.jpg
image2 = Image.open('flower.jpg')

# 分离image1的通道
r, g, b = image1.split()

# 合成图像，获得 cat + flower
im = Image.composite(image1, image2, mask=b)

image1.show()
image2.show()
im.show()
```

上面例子中我们将一张图像猫（cat.png）和一张图像花（flower.jpg），以图像猫的一个通道构成的蒙版进行合成，就像 PS 一样，我们最终得到猫+花的图像，结果如下图所示：

![](http://www.justdopython.com/assets/images/2019/python/composite.png)


### 通过单通道创建图像

> Image.merge(mode,bands) 

将一组单通道图像合并成多通道图像。参数 mode 为输出图像的模式，bands 为输出图像中每个通道的序列。

```
from PIL import Image

im = Image.open('cat.png')
# 将三个通道分开
im_split = im.split()

# 分别显示三个单通道图像
im_split[0].show()
im_split[1].show()
im_split[2].show()

# 将三个通道再次合并
im2 = Image.merge('RGB', im_split)
im2.show()

# 打开第二张图像
im3 = Image.open('flower.jpg')
# 将第二张图像的三个通道分开
im_split2 = im3.split()

# 将第二张图像的第1个通道和第一张图像的第2、3通道合成一张图像
rgbs = [im_split2[0], im_split[1], im_split[2]]
im4 = Image.merge('RGB', rgbs)
im4.show()
```

上面例子中，我们先将 cat.jpg 图像的三个通道分离成三张图像，效果如下图：

![](http://www.justdopython.com/assets/images/2019/python/merge-split.png)

然后我们又将 flower.jpg 图像的三个通道分离，最后分别取 flower.jpg 的 R 通道图像和 cat.jpg 的 G 和 B 通道图像合成一张新图像，最终的效果如下图：

![](http://www.justdopython.com/assets/images/2019/python/merge-merge.png)

## 总结

本节为大家介绍了 Python pillow 库中图像有关的几个基本概念，以及 PIL 模块中处理图像的几个常见功能。掌握了这些功能后，我们可以打开、创建图像，也可以对图像做一些常见的如拆分、合成、融合等操作，这些都是图像处理的基础，需要大家好好理解和掌握。

> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)

## 参考资料

https://www.osgeo.cn/pillow/reference/

