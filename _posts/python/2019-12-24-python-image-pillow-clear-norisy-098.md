---
layout: post
title:  第98天：图像库 PIL 实例—验证码去噪
category: python
copyright: python
---

by 闲欢

前面我们学习了 Python 的图像处理库 PIL，学会了一些相关的图像处理方法，好多人心里会问：有什么用呢？这一节我们就拿实际的例子来回答大家。
<!--more-->

## 识别验证码的原理

现在大多数网站登录不再是简单地输入用户名密码了，一般都伴随着此二者之外的验证手段，目的是阻止一些居心不良的行为。而图片验证码是其中一种比较常用的手段。所谓道高一尺魔高一丈，在 IT 行业中，对于这种安全防守，肯定会有针对性地破解势力。对于图片验证码的识别破解，目前已经有了很多成熟的方法。我想大概是从自动抢火车票兴起之后快速发展而来的吧。

首先我们来看一张未处理的验证码图片：

![](http://www.justdopython.com/assets/images/2019/python/image-vc.png)

想要识别验证码，我们需要有一套图片识别算法（这个目前已经有成熟的应用，大家可以自行搜索），然后拿到足够多的样本去喂养它，让它不断地自我学习，不断提升识别准确率。在喂养算法之前，我们首先要做的就是对原始图片进行处理，一般包括的步骤是：

- 将彩色图片转换成灰度图
- 将灰度图二值化处理
- 去除图片噪点

经过这三步处理之后，一般图片的验证码数字或者字母会比较明显好辨别了。

下面我们以上面那张简单的验证码图片为例，来运用 Python 的 PIL 库的方法对图片进行去噪处理。


## 1. 彩色图片转换成灰度图

什么事灰度图呢？灰度图，也可以认为是黑白图。我们知道彩色图片是有不同的颜色的像素组合到一起的，灰度图可以类似的认为是由不同灰度值的像素组合在一起后呈现出来的。

任何颜色都有红、绿、蓝三原色组成，假如原来某点的颜色为 RGB（R，G，B），那么，我们可以通过下面几种方法，将其转换为灰度：

- 1.浮点算法

```math
Gray=R*0.3+G*0.59+B*0.11
```

- 2.整数方法

```math
Gray=(R*30+G*59+B*11)/100
```

- 3.移位方法

```math
Gray =(R*76+G*151+B*28)>>8
```

- 4.平均值法


```math
Gray=(R+G+B)/3
```

- 5.仅取绿色

```math
Gray=G
```

通过上述任一种方法求得Gray后，将原来的RGB(R,G,B)中的R,G,B统一用Gray替换，形成新的颜色RGB(Gray,Gray,Gray)，用它替换原来的RGB(R,G,B)就是灰度图了。

我们用代码实现非常简单:

```
from PIL import Image

# 打开原始图片
im = Image.open('vc.png')
# 展示原始图片
im.show()

# 将原始图片灰度化
grey_im = im.convert('L')
# 展示灰度化图片
grey_im.show()
# 保存灰度化图片
grey_im.save('grey.png')
```

运行上面代码后，我们可以看到转换后的灰度图了，如下所示：

![](http://www.justdopython.com/assets/images/2019/python/image-grey.png)


## 2. 将灰度图片二值化

我们已经得到了灰度图，接下来就是将灰度图二值化。所谓二值化就是将灰度图像转换成由黑白二色组成的图像。思路就是确定一个阈值，大于阈值的像素表示为白色，小于阈值的像素表示为黑色，以此将图片的像素（灰度值）划分为两部分：0和1，例如0代表黑色，1代表白色，然后我们就可以用一串0和1组成的数字来表示一张图片。

```
from PIL import Image

# 二值处理
# 设定阈值threshold，像素值小于阈值，取值0，像素值大于阈值，取值1
# 阈值具体多少需要多次尝试，不同阈值效果不一样
def get_table(threshold=115):
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)
    return table

# 打开灰度化图片并进行二值处理
binary_im = Image.open('grey.png').point(get_table(120), "1")
# 展示二值化图片
binary_im.show()
# 保存二值化图片
binary_im.save('binary.png')
```

我们首先定义了一个二值处理的方法，该方法就是根据传入的一个阈值，将0到256之间的数进行分类，大于这个阈值取1，小于阈值取0。然后我们使用 Image 的 point 方法，该方法针对传入的函数对每一个像素点进行操作。我们传入二值处理方法，对每个像素点进行二值化处理，将图片转换成二值图片。

这里的阈值是需要大家尝试之后才能确定的，不同的图片，在阈值不同时会出现不同的处理效果，大家需要用不同的阈值去处理，查看处理之后的效果图，找到比较合理的阈值。本例中使用的是120。

经过二值化处理之后，我们的图片变成了下面这样：

![](http://www.justdopython.com/assets/images/2019/python/image-binary.png)


## 3. 对图片进行降噪处理

我们看二值化后的图片，可以看到还有一些干扰线，这些线条也会影响算法的识别准确率，所以我们需要想办法去掉这些干扰线。

降噪的方法有很多，主要难点是判断哪些点是噪点。由于我们这张验证码图片上的数字和字母的线条比干扰线的线条粗，因此我们认为字母和数字线条上的点周围8个点范围内黑色点的个数应该比干扰线上的点要多。因此我们这里采用的思路是：
> 根据一个点 A 的 RGB 值，与周围的8个点的 RBG 值比较，设定一个值 N（0 <N <8），当 A 的 RGB 值与周围8个点的 RGB 相等数小于 N 时，此点为噪点。

对应的程序代码为：

```
from PIL import Image, ImageDraw


# 判断噪点,如果确认是噪点,用该点的上面一个点的灰度进行替换
# 根据一个点A的RGB值，与周围的8个点的RBG值比较，设定一个值 N（0 <N <8），当A的RGB值与周围8个点的RGB相等数小于N时，此点为噪点
# x, y: 像素点坐标
# G: 图像二值化阀值
# N: 降噪率 0 < N <8
def get_pixel(image, x, y, G, N):
    # 获取像素值
    L = image.getpixel((x, y))

    # 与阈值比较
    if L > G:
        L = True
    else:
        L = False

    nearDots = 0

    if L == (image.getpixel((x - 1, y - 1)) > G):
        nearDots += 1
    if L == (image.getpixel((x - 1, y)) > G):
        nearDots += 1
    if L == (image.getpixel((x - 1, y + 1)) > G):
        nearDots += 1
    if L == (image.getpixel((x, y - 1)) > G):
        nearDots += 1
    if L == (image.getpixel((x, y + 1)) > G):
        nearDots += 1
    if L == (image.getpixel((x + 1, y - 1)) > G):
        nearDots += 1
    if L == (image.getpixel((x + 1, y)) > G):
        nearDots += 1
    if L == (image.getpixel((x + 1, y + 1)) > G):
        nearDots += 1

    if nearDots < N:
        return image.getpixel((x, y - 1))
    else:
        return None


# 降噪
# Z: 降噪次数
def clear_noise(image, G, N, Z):
    draw = ImageDraw.Draw(image)

    for i in range(0, Z):
        for x in range(1, image.size[0] - 1):
            for y in range(1, image.size[1] - 1):
                color = get_pixel(image, x, y, G, N)
                if color is not None:
                    draw.point((x, y), color)

# 打开二值化图片
b_im = Image.open('binary.png')
# 将二值化图片降噪
clear_noise(b_im, 50, 4, 4)
# 展示降噪后的图片
b_im.show()
# 保存降噪后的图片
b_im.save('result.png')
```

在本例中，我们设置的二值化阈值为50，降噪率为4，降噪次数为4.这几个参数也是不同的图片会有不同的值，大家需要根据不同的图片自行设定。

降噪后的图片效果如下：

![](http://www.justdopython.com/assets/images/2019/python/image-result.png)

我们可以看到，经过上面的处理之后，图片上的字母和数字已经很清晰了，再使用图片识别算法，准确率应该会很高。

除了上面的步骤，我们还可以通过 PIL 库的 ImageEnhance 和 ImageFilter 对图片做其他处理，例如增加对比度、亮度、锐化等，最终的目的都是去除图片的噪点，是图片更容易辨别。大家如果感兴趣的话可以试试看。


## 总结

本节我们通过使用 PIL 库的一些简单方法，对验证码图片进行一系列的处理，从而达到降噪的目标。通过本节的学习，大家应该要学会学以致用，运用我们学习的一些理论知识去解决工作或生活中遇到的实际问题。 PIL 库还有很多其他的方法都可以用来对图片进行不同的处理，大家可以自己去探索。

## 参考

https://www.osgeo.cn/pillow/reference/

> 文中示例代码：https://github.com/JustDoPython/python-100-day/tree/master/day-098