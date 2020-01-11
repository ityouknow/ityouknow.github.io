---
layout: post
title:  第52天：python multiprocessing模块
category: python
copyright: python
---

by 千阳

本节主要介绍 multiprocessing 多进程模块，由于 threading 多线程模块无法充分利用电脑的多核优势，而在实际开发中会对系统性能有较高的要求，就需要使用多进程来充分利用多核 cpu 的资源，下面详细介绍 Python 中的 multiprocessing。

<!--more-->

multiprocessing 多进程模块有类似 threading 模块的 API 接口，方便熟悉 threading 的用户直接使用 multiprocessing。它支持子进程、通信和共享数据、执行不同形式的同步，下面简单介绍下几个常用的组件。

### Process类

在 multiprocessing 中生成进程的方式是通过创建一个 Process 对象，然后调用它的 `start()` 方法来实现。例如：

```python
from multiprocessing import Process
def f(name):
    print('hello', name)
if __name__ == '__main__':
    p = Process(target=f, args=('world',))
    #启动进程
    p.start()
    #实现进程间的同步，等待所有进程退出
    p.join()

#执行结果：
hello world
```

需要注意的是，在上面示例代码中使用了`if __name__ == '__main__'`，这行代码是符合编程规范的。加上它可以确保主模块能够被新启动的 Python 解释器安全导入。

在启动进程的过程中，需要考虑执行顺序的问题，正常情况下是主进程先执行，子进程后执行。例如：

```python
#主子进程执行顺序
from multiprocessing import Process
import os
import time
def run():
    print("子进程开启")
    time.sleep(2)
    print("子进程结束")

if __name__ == "__main__":
    print("主进程启动")
    p = Process(target=run)
    p.start()
    print("主进程结束")

#执行结果：
主进程启动
主进程结束
子进程开启
子进程结束
```

### Queue类

因为不同进程之间内存是不共享的，要想实现进程间的通信，必须要提供中间的媒介。Python 提供了两个通信的对象类。一个是 Queue 类，另一个是 Pipe 类。

Queue 队列使用一个管道和少量锁和信号量实现的共享队列实例，它是线程和进程安全的，常被用于两个进程之间的通讯。例如有一个 wirte 进程负责写数据，另外一个 read 进程负责读数据。当我们需要将写的数据交给读的进程时，可以通过 Queue 作为中间桥梁，先把 write 进程写的数据交给队列，再由队列将数据传递给 read 进程。

```python
#Queue队列
from multiprocessing import Process, Queue
def f(q):
    q.put([11, None, 'lily'])
if __name__ == '__main__':
    q = Queue()
    p = Process(target=f, args=(q,))
    p.start()
    print(q.get())
    p.join()

#执行结果：
[11, None, 'lily']
```

在上述示例中调用了 `join()`函数，它可以阻塞主进程，直到调用 `join()`函数的进程终止。该函数有一个可选的参数 timeout，参数 timeout 的默认值是 None。如果 timeout 是一个正数，它最多会阻塞 timeout 秒。

### Pipe类

Pipe 和 Queue 一样，可以作为进程之间通信的通道。`Pipe()`函数返回两个对象 `conn1` 和 `conn2` ，这两个对象表示管道的两端。

`Pipe()`函数有一个可选参数 duplex，参数 duplex 的默认值为 True，表示该管道是双向的，即两个对象都可以发送和接收消息。如果把参数 duplex 设置为 False ，表示该管道是单向的，即 `conn1` 只能用于接收消息，`conn2` 只能用于发送消息。例如：

```python
from multiprocessing import Process, Pipe
def f(conn):
    conn.send([11, None, 'lily'])
    conn.close()

if __name__ == '__main__':
    conn1, conn2 = Pipe()
    p = Process(target=f, args=(conn2,))
    p.start()
    print(conn1.recv())
    p.join()

#执行结果：
[11, None, 'lily']
```

从以上示例可以看出，Queue 和 Pipe 拥有相似的功能。但在日常开发中，两者使用的场景有所不同，Pipe 多用于两个进程间通信，而 Queue 则多用于两个及以上进程间的通信。

### Lock类

由于多线程共享进程的资源和地址空间，因此，在对这些公共资源进行操作时，为了防止这些公共资源出现异常的结果，必须考虑线程的同步和互斥问题。

为了保证进程间的同步，我们可以使用 Lock 类给线程或者进程加锁。Lock 返回的是一个非递归锁对象，Lock 实际上是一个工厂函数。它返回由默认上下文初始化的 multiprocessing.synchronize.Lock 对象。

一旦某一个进程或者线程拿到了锁，后续的任何其他进程或线程的其他请求都会被阻塞直到锁被释放。例如：

```python 
#!/usr/bin/python3
from multiprocessing import Process, Lock
def f(l, i):
    l.acquire()
    try:
        print('this is', i)
    finally:
        l.release()

if __name__ == '__main__':
    lock = Lock()

    for num in range(10):
        Process(target=f, args=(lock, num)).start()

#执行结果：
this is 0
this is 2
this is 3
this is 4
this is 1
this is 5
this is 6
this is 7
this is 8
this is 9

```

## 总结

本节给大家介绍了 Python 中 multiprocessing 模块的常用操作，对于实现基于进程的并行操作提供了支撑，注意与 threading 模块基于线程的并行操作区分开。

> 示例代码：https://github.com/JustDoPython/python-100-day/tree/master/day-052

参考
[1] https://docs.python.org/3.7/library/multiprocessing.html
[2] https://blog.csdn.net/brucewong0516/article/details/85796073