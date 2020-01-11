---
layout: post
title:  第48天：初识 Python 多线程 
category: python
copyright: python
---

by 程序员野客


我们知道，多线程与单线程相比，可以提高 CPU 利用率，加快程序的响应速度。

<!--more-->

单线程是按顺序执行的，比如用单线程执行如下操作：

```
6秒读取文件1
9秒处理文件1
5秒读取文件2
8秒处理文件2
```

总共用时 28 秒，如果开启两条线程来执行上面的操作（假设处理器为多核 CPU），如下所示：

```
6秒读取文件1 + 5秒读取文件2
9秒处理文件1 + 8秒处理文件2
```

只需 15 秒就可完成。

## 1 线程与进程

### 1.1 简介

说到线程就不得不提与之相关的另一概念：进程，那么什么是进程？与线程有什么关系呢？简单来说一个运行着的应用程序就是一个进程，比如：我启动了自己手机上的酷猫音乐播放器，这就是一个进程，然后我随意点了一首歌曲进行播放，此时酷猫启动了一条线程进行音乐播放，听了一部分，我感觉歌曲还不错，于是我按下了下载按钮，此时酷猫又启动了一条线程进行音乐下载，现在酷猫同时进行着音乐播放和音乐下载，此时就出现了多线程，音乐播放线程与音乐下载线程并行运行，说到并行，你一定想到了并发吧，那并行与并发有什么区别呢？并行强调的是同一时刻，并发强调的是一段时间内。线程是进程的一个执行单元，一个进程中至少有一条线程，进程是资源分配的最小单位，线程是 CPU 调度的最小单位。

线程一般会经历新建（New）、就绪（Runnable）、运行（Running）、阻塞（Blocked）、死亡（Dead）5 种状态，当线程被创建并启动后，并不会直接进入运行状态，也不会一直处于运行状态，CPU 可能会在多个线程之间切换，线程的状态也会在就绪和运行之间转换。


### 1.2 Python 中的线程与进程

Python 提供了 _thread（Python3 之前名为 thread ） 和 threading 两个线程模块。_thread 是低级、原始的模块，threading 是高级模块，对 _thread 进行了封装，增强了其功能与易用性，绝大多数时候，我们只需使用 threading 模块即可。下一节我们会对 threading 模块进行详细介绍。

Python 提供了 multiprocessing 模块对多进程进行支持，它使用了与 threading 模块相似的 API 产生进程，除此之外，还增加了新的 API，用于支持跨多个输入值并行化函数的执行及跨进程分配输入数据，详细用法可以参考官方文档 [https://docs.python.org/zh-cn/3/library/multiprocessing.html](https://docs.python.org/zh-cn/3/library/multiprocessing.html)。

## 2 GIL

要说 Python 的多线程，必然绕不开 GIL，可谓成也 GIL 败也 GIL，到底 GIL 是啥？怎么来的？为什么说成也 GIL 败也 GIL 呢？下面就带着这几个问题，给大家介绍一下 GIL。

### 2.1 GIL 相关概念

GIL 全称 Global Interpreter Lock（全局解释器锁），是 Python 解释器 CPython 采用的一种机制，通过该机制来控制同一时刻只有一条线程执行 Python 字节码，本质是一把全局互斥锁，将并行运行变成串行运行。

什么是 CPython 呢？我们从 Python 官方网站下载安装 Python 后，获得的官方解释器就是 CPython，因其是 C 语言开发的，故名为 CPython，是目前使用最广泛的 Python 解释器；因为我们大部分环境下使用的默认解释器就是 CPython，有些人会认为 CPython 就是 Python，进而以为 GIL 是 Python 的特性，其实 CPython 只是一种 Python 解释器，除了 CPython 解释器还有：PyPy、Psyco、Jython （也称 JPython）、IronPython 等解释器，其中 Jython 与 IronPython 分别采用 Java 与 C# 语言实现，就没有采用 GIL 机制；而 GIL 也不是 Python 特性，Python 可以完全独立于 GIL 运行。

### 2.2 GIL 起源与发展

我们已经知道了 GIL 是 CPython 解释器中引入的机制，那为什么 CPython 解释器中要引入 GIL 呢？GIL 一开始出现是因为 CPython 解释器的内存管理不是线程安全的，也就是采用 GIL 这把锁解决 CPython 的线程安全问题。

随着时间的推移，计算机硬件逐渐向多核多线程方向发展，为了更加充分的利用多核 CPU 资源，各种编程语言开始对多线程进行支持，Python 也加入了其中，尽管多线程的编程方式可以提高程序的运行效率，但与此同时也带来了线程间数据一致性和状态同步的问题，解决这个问题最简单的方式就是加锁，于是 GIL 这把锁再次登场，很容易便解决了这个问题。

慢慢的越来越多的代码库开发者开始接受了这种设定，进而开始大量依赖这种特性，因为默认加了 GIL 后，Python 的多线程便是线程安全的了，开发者在实际开发无需再考虑线程安全问题，省掉了不少麻烦。

对于 CPython 解释器中的多线程程序，为了保证多线程操作安全，默认使用了 GIL 锁，保证任意时刻只有一个线程在执行，其他线程处于等待状态。

### 2.3 成也 GIL，败也 GIL

以前为了解决多线程的线程操作安全问题，CPython 采用了 GIL 锁的方式，这种方式虽然解决了线程操作安全问题，但由于同一时刻只能有一条线程执行，等于主动放弃了线程并行执行的机会，因此在目前 CPython 下的多线程并不是真正意义上的多线程。

现在这种情况，我们可能会想要实现真正意义上的多线程，可不可以去掉 GIL 呢？答案是可以的，但是有一个问题：依赖这个特性的代码库太多了，现在已经是尾大不掉了，使去除 GIL 的工作变得举步维艰。

当初为了解决多线程带来的线程操作安全问题使用了 GIL，现在又发现 GIL 方式下的多线程比较低效，想要去掉 GIL，但已经到了尾大不掉的地步了，真是成也 GIL，败也 GIL。

对于 CPython 下多线程的低效问题，除了去掉 GIL，还有什么其他解决方案吗？我们来简单了解下：

1）使用无 GIL 机制的解释器；如：Jython 与 IronPython，但使用这两个解释器失去了利用 C 语言模块一些优秀特性的机会，因此这种方式还是比较小众。

2）使用 multiprocess 代替 threading；multiprocess 使用了与 threading 模块相似的 API 产生进程，不同之处是它使用了多进程而不是多线程，每个进程有自己独立的 GIL，因此不会出现进程之间的 GIL 争抢，但这种方式只对计算密集型任务有效，通过后面的示例我们也能得出这个结论。

## 3 多线程实现

_thread 模块是一个底层模块，功能较少，当主线程运行完毕后，如果不做任何处理，会立刻把子线程给结束掉，现实中几乎很少使用该模块，因此不作过多介绍。对于多线程开发推荐使用 threading 模块，这里我们简单了解下通过该模块实现多线程，详细介绍我们放在了下一节多线程的文章中。

threading 模块通过 Thread 类提供对多线程的支持，首先，我们要导入 threading 中的类 Thread，示例如下：

```
from threading import Thread
```

依赖导入了，接下来要就要创建线程了，直接创建 Thread 实例即可，示例如下：

```
# method 为线程要执行的具体方法
p1 = Thread(target=method)
```

若要实现两条线程，再创建一个 Thread 实例即可，示例如下：

```
p2 = Thread(target=method)
```

需要实现更多条的线程也是一个道理。线程创建好了，通过 start 方法启动即可，示例如下：

```
p1.start()
p2.start()
```

如果是多线程任务，我们可能需要等待所有线程执行完成再进行下一步操作，使用 join 方法即可。示例如下：

```
# 等待线程 p1、p2 都执行完
p1.join()
p2.join()
```


## 4 多进程实现

Python 的多进程通过 multiprocessing 模块的 Process 类实现，它的使用基本与 threading 模块的 Thread 类一致，因此这里就不一步步说了，直接看示例：

```
# 导入 Process
from multiprocessing import Process

# 创建两个进程实例：p1、p2，method 是要执行的具体方法
p1 = Process(target=method)
p2 = Process(target=method)

# 启动两个进程
p1.start()
p2.start()

# 等待进程 p1、p2 都执行完
p1.join()
p2.join()
```

## 5 效率大比拼

现在我们已经了解了 Python 线程和进程的基本使用，那么 Python 单线程、多线程、多进程的实际工作效率如何呢？下面我们就以计算密集型和 I/O 密集型两种任务考验一下它们。

### 5.1 计算密集型任务

计算密集型任务的特点是要进行大量的计算，消耗 CPU 资源，比如：计算圆周率、对视频进行解码 ... 全靠 CPU 的运算能力，下面看一下单线程、多线程、多进程的实际耗时情况。

1）单线程就是一条线程，我们直接以主线程为例，来看下单线程表现如何：

```
# 计算密集型任务-单线程
import os,time

def task():
    ret = 0
    for i in range(100000000):
        ret *= i
if __name__ == '__main__':
    print('本机为',os.cpu_count(),'核 CPU')
    start = time.time()
    for i in range(5):
        task()
    stop = time.time()
    print('单程耗时 %s' % (stop - start))
    
# 测试结果：
'''
本机为 4 核 CPU
单线程耗时 23.19068455696106
'''
```

2）来看多线程表现：

```
# 计算密集型任务-多线程
from threading import Thread
import os,time

def task():
    ret = 0
    for i in range(100000000):
        ret *= i
if __name__ == '__main__':
    arr = []
    print('本机为',os.cpu_count(),'核 CPU')
    start = time.time()
    for i in range(5):
        p = Thread(target=task)
        arr.append(p)
        p.start()
    for p in arr:
        p.join()
    stop = time.time()
    print('多线程耗时 %s' % (stop - start))
    
# 测试结果：
'''
本机为 4 核 CPU
多线程耗时 25.024707317352295
'''
```

3）来看多进程表现：

```
# 计算密集型任务-多进程
from multiprocessing import Process
import os,time

def task():
    ret = 0
    for i in range(100000000):
        ret *= i
if __name__ == '__main__':
    arr = []
    print('本机为',os.cpu_count(),'核 CPU')
    start = time.time()
    for i in range(5):
        p = Process(target=task)
        arr.append(p)
        p.start()
    for p in arr:
        p.join()
    stop = time.time()
    print('计算密集型任务，多进程耗时 %s' % (stop - start))
    
# 输出结果
'''
本机为 4 核 CPU
计算密集型任务，多进程耗时 14.087027311325073
'''
```

通过测试结果我们发现，在 CPython 下执行计算密集型任务时，多进程效率最优，多线程还不如单线程。

### 5.2 I/O 密集型任务

涉及到网络、磁盘 I/O 的任务都是 I/O 密集型任务，这类任务的特点是 CPU 消耗很少，任务的大部分时间都在等待 I/O 操作完成（因为 I/O 的速度远远低于 CPU 和内存的速度）。通过下面例子看一下耗时情况：

1）来看单线程表现：

```
# I/O 密集型任务-单线程
import os,time

def task():
    f = open('tmp.txt','w')
if __name__ == '__main__':
    arr = []
    print('本机为',os.cpu_count(),'核 CPU')
    start = time.time()
    for i in range(500):
        task()
    stop = time.time()
    print('I/O 密集型任务，多进程耗时 %s' % (stop - start))
	
# 输出结果
'''
本机为 4 核 CPU
I/O 密集型任务，单线程耗时 0.2964005470275879
'''
```

2）来看多线程表现：

```
# I/O 密集型任务-多线程
from threading import Thread
import os,time

def task():
    f = open('tmp.txt','w')
if __name__ == '__main__':
    arr = []
    print('本机为',os.cpu_count(),'核 CPU')
    start = time.time()
    for i in range(500):
        p = Thread(target=task)
        arr.append(p)
        p.start()
    for p in arr:
        p.join()
    stop = time.time()
    print('I/O 密集型任务，多进程耗时 %s' % (stop - start))
	
# 输出结果
'''
本机为 4 核 CPU
I/O 密集型任务，多线程耗时 0.24960064888000488
'''
```

3）来看多进程表现：

```
# I/O 密集型任务-多进程
from multiprocessing import Process
import os,time

def task():
    f = open('tmp.txt','w')
if __name__ == '__main__':
    arr = []
    print('本机为',os.cpu_count(),'核 CPU')
    start = time.time()
    for i in range(500):
        p = Process(target=task)
        arr.append(p)
        p.start()
    for p in arr:
        p.join()
    stop = time.time()
    print('I/O 密集型任务，多进程耗时 %s' % (stop - start))
	
# 输出结果
'''	
本机为 4 核 CPU
I/O 密集型任务，多进程耗时 21.05265736579895
'''
```

通过 I/O 密集型任务在 CPython 下的测试结果我们发现：多线程效率优于多进程，单线程与多线程效率接近。

对于一个运行的程序来说，随着 CPU 的增加执行效率必然会有所提高，因此大多数时候，一个程序不会是纯计算或纯 I/O，所以我们只能相对的去看一个程序是计算密集型还是 I/O 密集型。

## 总结

本节给大家介绍了 Python 多线程，让大家对 Python 多线程现状有了一定了解，能够根据任务类型选择更加高效的处理方式。

> 示例代码：[Python-100-days-day045](https://github.com/JustDoPython/python-100-day/tree/master/day-048)

参考：

[https://www.cnblogs.com/SuKiWX/p/8804974.html](https://www.cnblogs.com/SuKiWX/p/8804974.html)

[https://docs.python.org/zh-cn/3/glossary.html#term-global-interpreter-lock](https://docs.python.org/zh-cn/3/glossary.html#term-global-interpreter-lock)


