---
layout: post
title:  第97天：图像库 PIL（二）
category: python
copyright: python
---

by 闲欢

上节我们讲了 Python 的图像处理库 PIL 的基本图像处理功能，打开了 PIL 的神秘面纱。这节我们接着讲 PIL 的 Image 模块的常用方法。
<!--more-->

## Image 模块的方法

### convert

> Image.convert(mode=None, matrix=None, dither=None, palette=0, colors=256)

参数说明：

- mode：转换的模式
- matrix：可选转变矩阵。如果给出，必须为包含浮点值长为 4 或 12 的元组。
- dither：抖动方法。RGB 转换为 P；RGB 或 L 转换为 1 时使用。有 matrix 参数可以无 dither。参数值 NONE 或 FLOYDSTEINBERG（默认）。
- palette：调色板，在 RGB 转换为 P 时使用， 值为 WEB 或 ADAPTIVE 。
- colors：调色板的颜色值，默认 256.

转换图片模式，它支持每种模式转换为"L" 、 "RGB"和 "CMYK"。
有 matrix 参数只能转换为"L" 或 "RGB"。
当模式之间不能转换时，可以先转换 RGB 模式，然后在转换。
色彩模式转换为 L 模式计算公式
如下：

> L = R * 299/1000 + G * 587/1000 + B * 114/1000

我们一般使用时，只用传需要转换的 mode 即可，其他的可选参数需要先理解图片深层次的原理后才可以理解，大家如果感兴趣可以去深入了解一下。下面我们来看一个简单实例：

```
from PIL import Image

im = Image.open('cat.png')
im.show()
# 将图像转换成黑白色并返回新图像
im1 = im.convert('L')
im1.show()
```

我们将一个图像转换成 L模式（灰色），转换结果如下图所示：

![](http://www.justdopython.com/assets/images/2019/python/image-convert.png)

### copy

> Image.copy()

复制图像方法，该方法完全复制一个一模一样的图像，很好理解，我们就不举例说明了。

### crop

> Image.crop(box)

参数说明：

- box：相对图像左上角坐标为（0,0）的矩形坐标元组, 顺序为(左, 上, 右, 下)

该方法从图像中获取 box 矩形区域的图像，相当于从图像中抠一个矩形区域出来。我们来看例子：

```
from PIL import Image

im = Image.open('cat.jpg')
print(im.size)
im.show()

# 定义了图像的坐标位置，从左、上、右、下
box = (100, 100, 250, 250)

# 它会从左上角开始，同时向下和向右移动100像素的位置开始截取250-100的像素宽高，也就是150x150的图像
# 这里注意后两个数值要大于前两个数值，不然截取后的图像宽高为负数，会报错
region = im.crop(box)
print(region.size)
region.show()

# 输出结果
(451, 300)
(150, 150)
```

我们从 cat.jpg 这张图片中截取了 150x150 的图像，从打印结果可以看到截取前和截取后的图像大小。两张图像的对比如下图：

![](http://www.justdopython.com/assets/images/2019/python/image-crop.png)

### filter

> Image.filter(filter)

参数说明：

- filter：过滤内核

使用给定的筛选器筛选此图像。有关可用筛选器的列表：

筛选器名称 | 说明
---|---
BLUR | 模糊滤波，处理之后的图像会整体变得模糊。
CONTOUR | 轮廓滤波，将图像中的轮廓信息全部提取出来。
DETAIL | 细节增强滤波，会使得图像中细节更加明显。
EDGE_ENHANCE | 边缘增强滤波，突出、加强和改善图像中不同灰度区域之间的边界和轮廓的图像增强方法。
EDGE_ENHANCE_MORE | 深度边缘增强滤波，会使得图像中边缘部分更加明显。
EMBOSS | 浮雕滤波，会使图像呈现出浮雕效果。
FIND_EDGES | 寻找边缘信息的滤波，会找出图像中的边缘信息。
SHARPEN | 锐化滤波，补偿图像的轮廓，增强图像的边缘及灰度跳变的部分，使图像变得清晰。
SMOOTH | 平滑滤波，突出图像的宽大区域、低频成分、主干部分或抑制图像噪声和干扰高频成分，使图像亮度平缓渐变，减小突变梯度，改善图像质量。
SMOOTH_MORE | 深度平滑滤波，会使得图像变得更加平滑。

看到这些，大家是不是联想到我们手机上一些 APP 的图像处理功能了，其实那些功能的实现方式跟我们这里讲的方法是一样的。我们来看个例子：

```
from PIL import Image
from PIL import ImageFilter

im = Image.open('flower.jpg')
im.show()

# 模糊
im2 = im.filter(ImageFilter.BLUR)
im2.show()

# 轮廓滤波
im3 = im.filter(ImageFilter.CONTOUR)
im3.show()

# 细节增强
im4 = im.filter(ImageFilter.DETAIL)
im4.show()
```

我们分别对原图了使用了模糊滤波、轮廓滤波、细节增强滤波的处理，大家运行程序就可以看到处理后的效果了，如下图所示：

![](http://www.justdopython.com/assets/images/2019/python/image-filter.png)

### getbands

> Image.getbands()

返回一个包含此图像中每个通道名称的元组。直接看实例：

```
from PIL import Image

# 打开图像
im = Image.open('cat.jpg')
# 创建新图像
im1 = Image.new('L', (450, 450), 50)

# 获取图像的通道名称元组
print(im.getbands())
print(im1.getbands())

# 输出结果
('R', 'G', 'B')
('L',)
```

上例中，我们分别打开一个 RGB 图像和创建一个 L 模式的新图像，然后打印输出他们的通道名称。

### getbbox

> Image.getbbox()

计算图像中非零区域的边界框。将边界框作为定义左、上、右和下像素坐标的四元组返回。我们来看例子：

```
from PIL import Image

# 打开图像(451x300)
im = Image.open('cat.jpg')
# 创建新图像(450x450)
im1 = Image.new('L', (450, 450), 50)

# 打印图像中非零区域的边界框
print(im.getbbox())
print(im1.getbbox())

# 输出结果
(0, 0, 451, 300)
(0, 0, 450, 450)
```

这个方法很简单，很容易理解，那么这个方法有什么用处呢？最直接的一个用处就是迅速地获取图像的边界坐标。

### getcolors

> Image.getcolors(maxcolors=256)

参数说明：

- maxcolors：最大颜色数。默认限制为256色。

获取图像中颜色的使用列表，超过 maxcolors 设置值返回 None 。
返回值为 (count, pixel) 的列表，表示（出现的次数，像素的值）

```
from PIL import Image

im = Image.open('cat.png')

# 将彩色图像转换成灰度图
im2 = im.convert("L")

# 打印灰度图的颜色列表，返回的点数超过maxcolors就直接返回None
print(im2.getcolors(maxcolors=200))
print(im2.getcolors(maxcolors=255))

# 输出结果
None
[(1, 0), (69, 1), (275, 2), (518, 3), (165, 4), ... (6, 250), (1, 251)]
```
我们这个图像有252个像素值，所以第一次 maxcolors 设置为200时，由于 252>200，所以返回了 None。第二次设置255时，正常返回。

### getdata

> Image.getdata(band=None)

参数：

- band：获取对应通道值。如：RGB 图像像素值为 (r,g,b) 的元组，要返回单个波段，请传递索引值（例如0，从 RGB 图像中获取 R  波段）。

获取图像中每个像素的通道对象元组，像素获取从左至右，从上至下。

### getextrema

> Image.getextrema()

获取图像中每个通道的最小值与最大值。对于单波段图像，包含最小和最大像素值的2元组。对于多波段图像，每个波段包含一个2元组的元组。

### getpixel

> Image.getpixel(xy)

参数：

- xy：坐标，以（x，y）表示。

通过传入坐标返回像素值。如果图像是多层图像，则此方法返回元组。

### point

> Image.point(lut, mode=None)

参数说明：

- lut：一个查找表，包含图像中每个波段的256个（或65536个，如果 self.mode==“I” 和 mode==“L”）值。可以改用函数，它应采用单个参数。对每个可能的像素值调用一次函数，结果表将应用于图像的所有带区。

- mode：输出模式（默认与输入相同）。只有当源图像具有模式 “L” 或 “P” ，并且输出具有模式 “1” 或源图像模式为 “I” ，并且输出模式为 “L” 时，才能使用此选项。

对图像的的每个像素点进行操作，返回图像的副本。

```
from PIL import Image

im = Image.open('cat.png')

# 调整灰色图像的对比度
im_point=im.convert('L').point(lambda i: i < 80 and 255)
im_point.show()

source = im.split()
# 三通道分别处理对比度
band_r = source[0].point(lambda i: i < 80 and 255)
band_g = source[1].point(lambda i: i < 80 and 255)
band_b = source[2].point(lambda i: i < 80 and 255)
band_r.show()
band_g.show()
band_b.show()
```

在例子中，我们先将图像转换成 L 模式，然后调整对比度，以及将图像的三个通道分别调整对比度。所谓调整对比度，我们这个例子的规则就是当像素值小于80时，将其调整为255，相当于将接近黑色的像素点加黑，使其与浅色对比更明显。运行效果如下图：

![](http://www.justdopython.com/assets/images/2019/python/image-point.png)

### resize

> Image.resize(size, resample=0, box=None)

参数说明：

- size：以像素为单位的请求大小，作为2元组：（宽度、高度）。
- resample：可选的重新采样滤波器。可以是 PIL.Image.NEAREST（最近滤波） ， PIL.Image.ANTIALIAS （平滑滤波）， PIL.Image.BILINEAR （双线性滤波）， PIL.Image.HAMMING ， PIL.Image.BICUBIC （双立方滤波）。如果省略，或者图像具有模式 “1” 或 “P” ，则设置为 PIL.Image.NEAREST 。
-box：一个可选的4元组的浮点数，给出了应该缩放的源图像区域。值应在（0，0，宽度，高度）矩形内。如果省略或没有，则使用整个源。

这个方法是获取调整大小后的图片。通俗地讲就是在原图中抠一个矩形区域（如果传入了 box 参数），然后对抠出来的区域进行滤波处理（如果传入了 resample 参数），最后以指定的 size 大小进行返回。

```
from PIL import Image

im = Image.open('flower.jpg')

img1 = im.resize((250, 250), Image.BILINEAR)
img2 = im.resize((250, 250), Image.BICUBIC)
img3 = im.resize((250, 250), Image.NEAREST)

im.show()
img1.show()
img2.show()
img3.show()
```

这几个滤波器的具体的原理比较理论，大家对照着程序运行返回自行去深入了解。


关于 PIL 的 Image 模块的方法我们只讲这么多，还有好多其他方法，大家可参照 https://www.osgeo.cn/pillow/reference/ 这个网站去尝试。

我们讲的 PIL 的 Image 模块只是 PIL 的一个基础模块而已，它还有好多其他的模块，诸如 ImageChops （通道操作模块）、ImageColor （颜色转换模块）、ImageDraw （二维图形模块）等，大家在需要的时候可以去查找 API 使用。


## 总结

pillow 库是一个非常强大的基础图像处理库，若不深入图像处理，运用这个库里面的方法组合，对图像进行各种常见的操作已经够用，这是计算机图片识别的基础。当然，如果需要更专业的操作，那么就直接上 opencv 吧。

## 参考

https://www.osgeo.cn/pillow/reference/

> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)
