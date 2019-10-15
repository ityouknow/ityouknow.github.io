---
layout: post
title:  第25天：Python datetime&time
category: python
copyright: python
---

>  by 千阳


在前面的章节中已经介绍了一些 Python 常用的模块，本节再介绍两个模块 datetime 模块和 time 模块，这两个模块主要用于转换日期格式的功能。

<!--more-->

## datetime模块

datetime 模块是 Python 内置的功能模块，它可以实现对日期的算数运算，以指定的方式格式化日期。datetime 模块内含有一个同名的 datetime 类，该类中包含多个操作日期的函数，例如：datetime.now()、datetime.fromtimestamp()、datetime.timedelta()等，下面逐一举例说明。

### datetime()构造函数

datetime 类提供了一个`now()`的方法可以获取当前日期和时间，还提供了带参数的构造函数`datetime()`，可以通过传入特定的数字返回不同的datetime 对象。例如:

```
import datetime
#当前日期和时间
print(datetime.datetime.now())
2019-09-30 22:19:37.582514

#获取指定时间
datetest = datetime.datetime(2019,9,30,22,22,0)
print(datetest)
2019-09-30 22:22:00

#获取日期的年月日时分秒
print(str(datetest.year)+"-"+str(datetest.month)+"-"+str(datetest.day)+" "+str(datetest.hour)+":"+str(datetest.minute)+":"+str(datetest.second))
2019-9-30 22:22:0
```
### fromtimestamp()函数

`fromtimestamp()`函数可以将时间戳转换成 datetime 对象。例如：

```
import datetime
dt1 = datetime.datetime.fromtimestamp(10000)
dt2 = datetime.datetime.fromtimestamp(time.time())

print(dt1)
print(dt2)

1970-01-01 10:46:40
2019-09-30 23:28:47.629210
```
### strptime()和strftime()函数

使用`strptime()`函数可以将日期字符串转换成 datetime 类型，`strftime()`函数可以将 datetime 类型转换成字符串。例如：

```
import datetime
#日期转换
datestr = datetime.strptime('2019-9-30 22:10:00', '%Y-%m-%d %H:%M:%S')
now = datetime.now()
print(datestr)
print(now.strftime('%a, %b %d %H:%M'))

2019-09-30 22:10:00
Tue, Oct 01 00:02
```
### timedelta()函数

`timedelta()`函数返回一个 timedelta 类型的数据，它表示一段时间而不是一个时刻，多用于日期的增加和减少场景。例如：

```
import datetime
#日期增加和减少
now = datetime.datetime.now()
print(now)

newdate = now + datetime.timedelta(hours=10)
print(newdate)

newdate = now - datetime.timedelta(days=1)
print(newdate)

2019-10-01 00:23:50.152118
2019-10-01 10:23:50.152118
2019-09-30 00:23:50.152118
```

## time模块

与 datetime 模块有所不同，time 模块主要功能是读取系统时钟的当前时间。其中，time.time() 和 time.sleep() 是两个最常用的模块。

### time()函数

time.time() 函数返回的值是带小数点的，它表示从 Unix 纪元（1970年1月1日0点）到执行代码那一刻所经历的时间的秒数，这个数字称为UNIX纪元时间戳。例如：

```
import time
print ("当前时间戳为:", time.time())

当前时间戳为: 1569770357.6496012
```

在项目开发中，我们经常需要计算一段代码的执行时间，就可以用纪元时间戳来实现。例如：

```
import time
def calculateTime():
    item = 1
    for i in range(1,100000):
        item = item + i
    return item

startTime = time.time()
result = calculateTime()
endTime = time.time()
print('计算结果：'+ str(result))
print('执行时间：'+ str(endTime - startTime))

计算结果：4999950001
执行时间：0.020943403244018555
```
在代码中，函数`calculateTime()`是需要执行的代码块，变量 `startTime` 表示开始时间，变量 `endTime` 表示结束时间，`endTime-startTime`表示代码块运行的间隔时间。

### sleep()函数

如果需要让程序暂停一下，可以使用time.sleep()函数。sleep()函数有个参数，表示需要暂停的秒数。例如：

```
import time
for i in range(2):
    print('one')
    print(time.time())
    time.sleep(1)
    print('two')
    print(time.time())
    time.sleep(1)
print('运行完成')

one
1569772121.6350794
two
1569772122.637142
one
1569772123.639813
two
1569772124.6423109
运行完成

```

从上面程序的执行结果可以看出以下几点：

1. 打印`one`和打印`two`之间每次都间隔了一秒，因为`time.time()`函数输出结果的精确度比较高，会存在些许误差。
2. `time.sleep()`函数会阻塞代码，只有当`time.sleep()`中的秒数流逝后，才会执行后续代码

## 总结

本节给大家介绍了 Python 中 datetime 和 time 模块的常用操作，对 Python 工程师实现系统日期显示和转换功能提供了支撑。

示例代码
https://github.com/layne0031/python-100-day.git

参考
[1] Python编程快速上手 https://item.jd.com/11943853.html
[2] https://www.liaoxuefeng.com/wiki/1016959663602400/1017648783851616


