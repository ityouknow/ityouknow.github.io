---
layout: post
title:  第53天： Python 线程池
category: python
copyright: python
---

by 豆豆

大家都知道当任务过多，任务量过大时如果想提高效率的一个最简单的方法就是用多线程去处理，比如爬取上万个网页中的特定数据，以及将爬取数据和清洗数据的工作交给不同的线程去处理，也就是生产者消费者模式，都是典型的多线程使用场景。

那是不是意味着线程数量越多，程序的执行效率就越快呢。

<!--more-->

显然不是。线程也是一个对象，是需要占用资源的，线程数量过多的话肯定会消耗过多的资源，同时线程间的上下文切换也是一笔不小的开销，所以有时候开辟过多的线程不但不会提高程序的执行效率，反而会适得其反使程序变慢，得不偿失。

所以，如何确定多线程的数量是多线程编程中一个非常重要的问题。好在经过多年的摸索业界基本已形成一套默认的标准。

对于 CPU 密集型的计算场景，理论上将线程的数量设置为 CPU 核数就是最合适的，这样可以将每个 CPU 核心的性能压榨到极致，不过在工程上，线程的数量一般会设置为 CPU 核数 + 1，这样在某个线程因为未知原因阻塞时多余的那个线程完全可以顶上。

而对于 I/O 密集型的应用，就需要考虑 CPU 计算的耗时和 I/O 的耗时比了。如果 I/O 耗时和 CPU 耗时 为 1:1，那么两个线程是最合适的，因为当 A 线程做 I/O 操作时，B 线程执行 CPU 计算任务，当 B 线程做 I/O 操作时，A 线程执行 CPU 计算任务，CPU 和 I/O 的利用率都得到了百分百，完美。所以可以认为最佳线程数 = CPU 核数 * [1 +（I/O 耗时 / CPU 耗时]。

## 线程池

平时我们自己写多线程程序时基本都是直接调用 Thread(target=method) 即可，实际上创建线程远没有这么简单，需要分配内存，同时线程还需要调用操作系统内核的 API，然后操作系统还需要为线程分配一系列的资源，过程很是复杂，所以要尽量避免频繁的创建和销毁线程。

回想一下自己平时写多线程代码的模式，是不是当任务来临时直接创建线程，执行任务，当任务执行结束之后，线程也就随之消亡了。然后又开始循环往复。有多少个任务就创建了多少个线程。这种模式的话很浪费硬件资源。

那如何避免这种问题呢，线程池就派上用场了。

其实线程池就是生产者消费者模式的最佳实践，当线程池初始化时，会自动创建指定数量的线程，有任务到达时直接从线程池中取一个空闲线程来用即可，当任务执行结束时线程不会消亡而是直接进入空闲状态，继续等待下一个任务。而随着任务的增加线程池中的可用线程必将逐渐减少，当减少至零时，任务就需要等待了。

在 python 中使用线程池有两种方式，一种是基于第三方库 `threadpool`，另一种是基于 python3 新引入的库 `concurrent.futures.ThreadPoolExecutor`。这里我们都做一下介绍。

## `threadpool` 方式

使用 `threadpool` 前需要先安装一下，看了这么久我们的文章，相信你很快就会搞定的。在命令行执行如下命令即可。

```python
pip install threadpool
```

以下是一个简易的线程池使用模版，我们创建了一个函数 `sayhello`，然后创建了一个大小为 2 的线程池，也就是线程池总共有两个活跃线程。

最后通过 `pool.putRequest()` 将任务丢到线程池执， `pool.wait()` 等待所有线程结束。同时我们还可以定义回调函数，拿到任务的返回结果。

由结果我们可以看出，线程池中的确只有两个线程，分别为 `Thread-1` 和 `Thread-2`。

```python
import time
import threadpool
import threading

def sayhello(name):
    print("%s say Hello to %s" % (threading.current_thread().getName(), name));
    time.sleep(1)
    return name

def callback(request, result): # 回调函数，用于取回结果
    print("callback result = %s" % result)

name_list =['admin','root','scott','tiger']
start_time = time.time()
pool = threadpool.ThreadPool(2) # 创建线程池
requests = threadpool.makeRequests(sayhello, name_list, callback) # 创建任务
[pool.putRequest(req) for req in requests] # 加入任务
pool.wait() 
print('%s cost %d second' % (threading.current_thread().getName(), time.time()-start_time))

## 运行结果如下
Thread-1 say Hello to admin
Thread-2 say Hello to root
Thread-1 say Hello to scott
Thread-2 say Hello to tiger
callback result = admin
callback result = root
callback result = tiger
callback result = scott
MainThread cost 2 second
```

## `ThreadPoolExecutor` 方式

`ThreadPoolExecutor` 是 python3 新引入的库，具体使用方法与 `threadpool` 大同小异，同样是创建容量为 2 的线程池，提交四个任务。只不过这里分别是通过 `submit` 和 `as_completed` 来提交和获取任务返回结果的。

同样由输出结果我们可以看出，两种线程池的实现方式中关于线程的命名方式是不一致的。

```python
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

def sayhello(name):
    print("%s say Hello to %s" % (threading.current_thread().getName(), name));
    time.sleep(1)
    return name

name_list =['admin','root','scott','tiger']
start_time = time.time()
with ThreadPoolExecutor(2) as executor: # 创建 ThreadPoolExecutor 
    future_list = [executor.submit(sayhello, name) for name in name_list] # 提交任务

for future in as_completed(future_list):
    result = future.result() # 获取任务结果
    print("%s get result : %s" % (threading.current_thread().getName(), result))

print('%s cost %d second' % (threading.current_thread().getName(), time.time()-start_time))

## 运行结果如下
ThreadPoolExecutor-0_0 say Hello to admin
ThreadPoolExecutor-0_1 say Hello to root
ThreadPoolExecutor-0_0 say Hello to scott
ThreadPoolExecutor-0_1 say Hello to tiger
MainThread get result : root
MainThread get result : tiger
MainThread get result : scott
MainThread get result : admin
MainThread cost 2 second
```

## 线程池总结

本文介绍了常用的两种线程池的实现方式，在多线程编程中能使用线程池就不要自己去创建线程，并不是说线程池实现的多么好，其实我们自己完全也可以实现一个功能更强大的线程池。但是其内置的线程池一来是受过全方面测试的，在安全性，性能和方便性上基本就是最优的了，同时线程池还替我们做了很多额外的工作，比如任务队列的维护，线程销毁时资源的回收等都不需要开发者去关心，我们只需注重业务逻辑即可，不需要在关心其他额外的工作，这将大大提高我们的的工作效率和使用感受。

当然其自带的线程池也不是十全十美的，至少暂时没有提供动态添加任务的入口出来。而且在设计方面不够灵活，比如我想线程池只维护一个核心数量，也就是上文说的最大数量。但是当任务过多时可以再额外创建出一些新的线程（阈值可以自定义），处理完之后这些多余的线程将自动销毁，目前这个是做不到的。

## 代码地址

https://github.com/JustDoPython/python-100-day/tree/master/day-053

## 参考资料

https://chrisarndt.de/projects/threadpool/api/