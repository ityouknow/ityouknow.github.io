---
layout: post
title:  第101天： Python asyncio
category: python
copyright: python
---

by 某某白米饭

## 异步IO之asyncio

异步IO：当发起一个 IO 操作时，并不需要等待它的结束，程序可以去做其他事情，当这个 IO 操作结束时，会发起一个通知。

在 Python 中可以使用 asyncio 模块异步编程，用于协程、网络爬虫、同步等。

<!--more-->

### asyncio 中的概念

#### event_loop 事件循环

事件循环是 asyncio 应用的核心，管理所有的事件。

1. 创建新的事件循环 

```python
asyncio.new_event_loop()
```

2. 获取当前线程中正在执行的事件循环 

```python
asyncio.get_running_loop()
```

3. 并发运行任务

```python
asyncio.gather()
```

4. 向指定的事件添加一个任务

```python
asyncio.run_coroutine_threadsafe()
```

5. 返回没有执行的事件

```python
asyncio.all_tasks()
```

#### Future 对象

一个 Future 代表一个异步运算的结果，线程不安全。

#### Task 对象

Task 对象的作用是在运行某个任务的同时可以并发的运行其他任务

Task 对象可以使用 asyncio.create_task() 函数创建，也可以使用 loop.create_task() 和 asyncio.ensure_future() 函数创建，不建议实例化 Task对象

1. 取消 Task 对象

```python
cancel()
```

2. Task 任务是否被取消

```python
cancelled()
```

3. Task 对象是否完成

```python
done()
```

4. 返回结果

```python
result()
```

* Task 对象被完成，则返回结果
* Task 对象被取消，则引发 CancelledError 异常
* Task 对象的结果不可用，则引发 InvalidStateError 异常


5. 添加回调，任务完成时触发
```python
add_done_callback(task)
```

6. 所有任务列表

```python
asyncio.all_tasks()
```

7. 返回当前任务

```python
asyncio.current_task()
```

### 运行协程


```python
import asyncio

async def do_work():
    print("Hello....")
    # 模拟阻塞1秒
    await asyncio.sleep(1)
    print("world...")

coroutine = do_work()
print(coroutine)

# 创建一个事件event_loop
loop = asyncio.get_event_loop()

# 将协程加入到event_loop中，并运行
loop.run_until_complete(coroutine)
```

示例结果

```
<coroutine object do_work at 0x1108c50c8>
Hello....
# 这里会暂停1秒
world...
```

在 Python 中使用 async def 定义一个协程（ coroutine ），它并不能直接运行，需要加入到事件循环（ event_loop ）中

### 运行 Task

```python
import asyncio


async def do_work():
    print("这是一个Task例子....")
    # 模拟阻塞1秒
    await asyncio.sleep(1)
    return "Task任务完成"

# 创建一个事件event_loop
loop = asyncio.get_event_loop()

# 创建一个task
task = loop.create_task(do_work())
# 第一次打印task
print(task)

# 将task加入到event_loop中
loop.run_until_complete(task)
# 再次打印task
print(task)
print(task.result())
```

示例结果

```
<Task pending coro=<do_work() running at /Users/imeng/Documents/Interview/Python/asyncio_test.py:5>>
这是一个Task例子....
<Task finished coro=<do_work() done, defined at /Users/imeng/Documents/Interview/Python/asyncio_test.py:5> result='Task任务完成'>
Task任务完成
```

使用 EventLoop 对象的 create_task 函数创建一个 Task 对象，在第一次打印 Task 对象时，状态为 pending，完成执行函数后的状态为 finished

Task 对象的 result() 函数可以获取 do_work() 函数的返回值


### Task 任务回调

```python
import asyncio

async def do_work():
    print("这是一个Task例子....")
    # 模拟阻塞1秒
    await asyncio.sleep(1)
    return "Task任务完成"

# 任务完成后的回调函数
def callback(task):
    # 打印参数
    print(task)
    # 打印返回的结果
    print(task.result())

# 创建一个事件event_loop
loop = asyncio.get_event_loop()

# 创建一个task
task = loop.create_task(do_work())
task.add_done_callback(callback)

# 将task加入到event_loop中
loop.run_until_complete(task)
```

示例结果

```python
这是一个Task例子....
<Task finished coro=<do_work() done, defined at /Users/imeng/Documents/Interview/Python/asyncio_test.py:5> result='Task任务完成'>
Task任务完成
```

定义回调函数时必须有一个参数，参数和 Task 任务时同一个对象，使用 add_done_callback() 函数为 Task 任务添加一个完成后的回调函数

### 并发任务

```python
import asyncio
import time

async def do_work(t):
    print("暂停" + str(t) + "秒")
    # 模拟阻塞1秒
    await asyncio.sleep(t)
    return "暂停了" + str(t) + "秒"


# 任务完成后的回调函数
def callback(future):
    # 打印返回的结果
    print(future.result())


# 创建一个事件event_loop
loop = asyncio.get_event_loop()

tasks = []
i = 0
while i <= 4:
    task = loop.create_task(do_work(i))
    task.add_done_callback(callback)
    tasks.append(task)
    i += 1;


# 计时
now = lambda :time.time()
start = now()
# 将task加入到event_loop中
loop.run_until_complete(asyncio.wait(tasks))

end = now()
print("总共用时间:",end-start)
```

示例结果：

```python
暂停0秒
暂停1秒
暂停2秒
暂停3秒
暂停4秒
暂停了0秒
暂停了1秒
暂停了2秒
暂停了3秒
暂停了4秒
总共用时间: 4.003800868988037
```
使用 asyncio.wait() 函数将 Task 任务列表添加到 event_loop 中，也可以使用 asyncio.gather() 函数

在示例中可以看出多个协程总共用时4秒多，如果是同步任务将需要花费10秒多，asyncio 实现了程序的并发

### 同一个回调

```python
import asyncio
import functools


async def do_work(t):
    print("暂停" + str(t) + "秒")
    await asyncio.sleep(t)
    return "暂停了" + str(t) + "秒"


def callback(loop, gatheringFuture):
    print(gatheringFuture)
    print("多个Task任务完成后的回调")
    loop.stop()


loop = asyncio.get_event_loop()

gather = asyncio.gather(do_work(1), do_work(3))
gather.add_done_callback(functools.partial(callback, loop))

loop.run_forever()
```

示例结果

```
暂停1秒
暂停3秒
<_GatheringFuture finished result=['暂停了1秒', '暂停了3秒']>
多个Task任务完成后的回调
```

loop.run_forever() 函数 和 loop.run_until_complete() 函数 并不相同，run_until_complete() 函数在执行后事件循环被停止，run_forever() 函数在 Task 任务执行完成后事件循环并没有被终止，在回调函数 callback() 中使用 loop.stop() 函数将事件循环停止

### 总结

asyncio 在协程、网络爬虫等多种耗时操作时程序不再需要等待其他任务完成，节约大量的时间。

### 代码地址

> 示例代码：[Python-100-days-day101](https://github.com/JustDoPython/python-100-day/tree/master/day-101)