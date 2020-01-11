---
layout: post
title:  第49天：Python 多线程之 threading 模块 
category: python
copyright: python
---

by 程序员野客

在之前的文章中，我们已经介绍了 Python 通过 _thread 和 threading 模块提供了对多线程的支持，threading 模块兼具了 _thread 模块的现有功能，又扩展了一些新的功能，具有十分丰富的线程操作功能，本节我们就来详细学习一下 threading 模块。

<!--more-->

## 1 创建线程

使用 threading 模块创建线程通常有两种方式：1）使用 threading 模块中 Thread 类的构造器创建线程，即直接对类 threading.Thread 进行实例化，并调用实例化对象的 `start` 方法创建线程；2）继承 threading 模块中的 Thread 类创建线程类，即用 threading.Thread 派生出一个新的子类，将新建类实例化，并调用其 start 方法创建线程。

### 1.1 构造器方式

调用 threading.Thread 类的如下构造器创建线程：
> threading.Thread(group=None, target=None, name=None, args=(), kwargs={}, *, daemon=None)
> * **group**：指定该线程所属的线程组，目前该参数还未实现，为了日后扩展 ThreadGroup 类实现而保留。
> * **target**：用于 run() 方法调用的可调用对象，默认是 None，表示不需要调用任何方法。
> * **args**：是用于调用目标函数的参数元组，默认是 ()。
> * **kwargs**：是用于调用目标函数的关键字参数字典，默认是 {}。
> * **daemon**：如果 daemon 不是 None，线程将被显式的设置为守护模式，不管该线程是否是守护模式，如果是 None (默认值)，线程将继承当前线程的守护模式属性。

示例如下：

```
import time
import threading
def work(num):
    print('线程名称：',threading.current_thread().getName(),'参数：',num,'开始时间：',time.strftime('%Y-%m-%d %H:%M:%S'))
if __name__ == '__main__':
    print('主线程开始时间：',time.strftime('%Y-%m-%d %H:%M:%S'))
    t1 = threading.Thread(target=work,args=(3,))
    t2 = threading.Thread(target=work,args=(2,))
    t3 = threading.Thread(target=work,args=(1,))
    t1.start()
    t2.start()
    t3.start()
    t1.join()
    t2.join()
    t3.join()
    print('主线程结束时间：', time.strftime('%Y-%m-%d %H:%M:%S'))
```

上述示例中实例化了三个 Thread 类的实例，并向任务函数传递不同的参数，`start` 方法开启线程，`join` 方法阻塞主线程，等待当前线程运行结束。

### 1.2 继承方式

通过继承的方式创建线程包括如下步骤：1）定义 Thread 类的子类，并重写该类的 `run` 方法；2）创建 Thread 子类的实例，即创建线程对象；3）调用线程对象的 `start` 方法来启动线程。示例如下：

```
import time
import threading
class MyThread(threading.Thread):
    def __init__(self,num):
        super().__init__()
        self.num = num
    def run(self):
        print('线程名称：', threading.current_thread().getName(), '参数：', self.num, '开始时间：', time.strftime('%Y-%m-%d %H:%M:%S'))
if __name__ == '__main__':
    print('主线程开始时间：',time.strftime('%Y-%m-%d %H:%M:%S'))
    t1 = MyThread(3)
    t2 = MyThread(2)
    t3 = MyThread(1)
    t1.start()
    t2.start()
    t3.start()
    t1.join()
    t2.join()
    t3.join()
    print('主线程结束时间：', time.strftime('%Y-%m-%d %H:%M:%S'))
```

上述示例中自定义了线程类 MyThread，继承了 threading.Thread，并重写了 `__init__` 方法和 `run` 方法。

## 2 守护线程

守护线程（也称后台线程）是在后台运行的，它的任务是为其他线程提供服务，如 Python 解释器的垃圾回收线程就是守护线程。如果所有的前台线程都死亡了，守护线程也会自动死亡。来看个例子：

```
# 不设置守护线程
import threading
def work(num):
    for i in range(num):
        print(threading.current_thread().name + "  " + str(i))
t = threading.Thread(target=work, args=(10,), name='守护线程')
t.start()
for i in range(10):
    pass
    
# 输出结果：
'''
守护线程  0
守护线程  1
守护线程  2
守护线程  3
守护线程  4
守护线程  5
守护线程  6
守护线程  7
守护线程  8
守护线程  9
'''
```

```
# 设置守护线程
import threading
def work(num):
    for i in range(num):
        print(threading.current_thread().name + "  " + str(i))
t = threading.Thread(target=work, args=(10,), name='守护线程')
t.daemon = True
t.start()
for i in range(10):
    pass
    
# 输出结果：
# 守护线程  0
```

上述示例直观的说明了当前台线程结束，守护线程也会自动结束。

如果你设置一个线程为守护线程，就表示这个线程是不重要的，在进程退出的时候，不用等待这个线程退出；如果你的主线程在退出的时候，不用等待哪些子线程完成，那就设置这些线程为守护线程；如果你想等待子线程完成后再退出，那就什么都不用做，或者显示地将 daemon 属性设置为 false。

## 3 线程本地数据

Python 的 threading 模块提供了 `local` 方法，该方法返回得到一个全局对象，不同线程使用这个对象存储的数据，其它线程是不可见的(本质上就是不同的线程使用这个对象时为其创建一个独立的字典)。来看个示例：

```
# 不使用 threading.local
import threading
import time
num = 0
def work():
    global num
    for i in range(10):
        num += 1
    print(threading.current_thread().getName(), num)
    time.sleep(0.0001)
for i in range(5):
    threading.Thread(target=work).start()

# 输出结果：
'''
Thread-1 10
Thread-2 20
Thread-3 30
Thread-4 40
Thread-5 50
'''
```

上面示例中 num 是全局变量，变成了公共资源，通过输出结果，我们发现子线程之间的计算结果出现了互相干扰的情况。

```
# 使用 threading.local
num = threading.local()
def work():
    num.x = 0
    for i in range(10):
        num.x += 1
    print(threading.current_thread().getName(), num.x)
    time.sleep(0.0001)
for i in range(5):
    threading.Thread(target=work).start()
    
# 输出结果：
'''
Thread-1 10
Thread-2 10
Thread-3 10
Thread-4 10
Thread-5 10
'''
```

使用 threading.local 的示例中，num 是全局变量，但每个线程定义的属性 num.x 是各自线程独有的，其它线程是不可见的，因此每个线程的计算结果未出现相互干扰的情况。

## 4 定时器

threading 模块提供了 Timer 类实现定时器功能，来看个例子：

```
# 单次执行
from threading import Timer
def work():
    print("Hello Python")
# 5 秒后执行 work 方法
t = Timer(5, work)
t.start()
```

Timer 只能控制函数在指定的时间内执行一次，如果我们需要多次重复执行，需要再进行一次调度，想要取消调度时可以使用 Timer 的 `cancel` 方法。来看个例子：

```
# 重复执行
count = 0
def work():
    print('当前时间：', time.strftime('%Y-%m-%d %H:%M:%S'))
    global t, count
    count += 1
    # 如果 count 小于 5，开始下一次调度
    if count < 5:
        t = Timer(1, work)
        t.start()
# 指定 2 秒后执行 work 方法
t = Timer(2, work)
t.start()
```

## 5 常用方法、属性

threading 模块提供了十分丰富的线程操作功能，它的 API 方法及属性自然也特别多，我们来看一下常用的方法和属性。

1）threading.Thread 实例的方法、属性

| 方法              | 说明                                                   |
| ----------------- |:-------------------------------------------------------|
| start()           | 启动线程活动，它在一个线程里最多只能被调用一次。       |
| run()             | 表示线程活动的方法。                                   |
| join(timeout=None)| 等待至线程中止。     	                            	 |
| getName()         | 返回线程名。      	                            	 |
| setName()         | 设置线程名。   		                            	 |
| is_alive()        | 返回线程是否是活动的。     	                         |
| daemon            | 是否为守护线程的标志。 			                     |
| ident             | 线程标识符，线程尚未开始返回 None，已启动返回非零整数。|

2）threading 直接调用的方法

| 方法              | 说明                                                                       |
| ----------------- |:---------------------------------------------------------------------------|
| active_count()    | 返回当前存活的线程类 Thread 对象，返回个数等于 enumerate() 返回的列表长度。|
| current_thread()  | 返回当前对应调用者的 Thread 对象。                                         |
| get_ident()       | 返回当前线程的线程标识符，它是一个非零的整数。                             |
| enumerate()       | 以列表形式返回当前所有存活的 Thread 对象。     	                         |
| main_thread()     | 返回主 Thread 对象。      	                            	             |
| settrace(func)    | 为所有 threading 模块开始的线程设置追踪函数。                   	         |
| setprofile(func)  | 为所有 threading 模块开始的线程设置性能测试函数。 			             |
| stack_size([size])| 返回创建线程时用的堆栈大小。                                               |

## 总结

本节给大家介绍了 Python 的线程模块 threading，让大家对 threading 模块的相关概念和使用有了进一步的了解。

> 示例代码：[Python-100-days-day049](https://github.com/JustDoPython/python-100-day/tree/master/day-049)

参考：

[https://docs.python.org/zh-cn/3/library/threading.html](https://docs.python.org/zh-cn/3/library/threading.html)

