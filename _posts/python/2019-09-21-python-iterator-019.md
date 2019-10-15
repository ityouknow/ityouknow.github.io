---
layout: post
title:  第19天：Python 之迭代器
category: python
copyright: python
---

>  by 轩辕御龙


# Python 之迭代器

## 1 概念引入

在之前的教程中，我们已经接触过一些典型的`for`语句<!--more-->，比如：

```python
>>> list_example = [0, 1, 2, 3, 4]
>>> for i in list_example:
...  print(i)
...
0
1
2
3
4
```

通过简单地使用`for`和`in`两个关键字，我们可以很轻松地实现在 C 语言中繁琐的遍历操作。相比较而言，C 语言中要实现相同的功能，需要这样写（假设存在整型数组`list_example`）：

```c
int i;
for(i = 0; i < list_length; i++)
    printf("%d\n", list_example[i]);
```

显而易见，在遍历元素的操作上，Python 的表达更加直观优雅，简洁明了；这正是因为 Python 在实现`for`语句的时候，恰到好处地使用了“迭代器”的概念。

迭代器在 Python 中随处可见，并且具有统一的标准。通过使用迭代器，Python 能够逐个访问列表`list_example`中的每个元素。

下面我们来进一步讨论相关的机制。

## 2 定义及原理

### 2.1 迭代器的定义

> 迭代器（iterator）是一种可在容器（container）中遍访的接口，为使用者封装了内部逻辑。
>
> ——[百度百科·迭代器]([https://baike.baidu.com/item/%E8%BF%AD%E4%BB%A3%E5%99%A8/3803342?fr=aladdin](https://baike.baidu.com/item/迭代器/3803342?fr=aladdin)) 大意

上面是我们可以查到的、对“迭代器”的一个宽泛的定义。

而具体到 Python 中，迭代器也属于内置的**标准类**之一，是与我们之前学习过的“序列”同一层次的概念。

对于迭代器对象本身来说，需要具有[`__iter__()`](https://docs.python.org/3/library/functions.html#iter)和[`__next__()`](https://docs.python.org/3/library/stdtypes.html#iterator.__next__)两种方法，二者合称为“**迭代器协议**”。也就是说，只要同时具有这两种方法，Python 解释器就会认为该对象是一个迭代器；反之，只具有其中一个方法或者二者都不具有，解释器则认为该对象不是一个迭代器。

上述论断可由下面的代码验证（需要用到内置函数`isinstance()`，来判断一个对象是否是某个类的实例；该用法启发于[[廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1016959663602400/1017323698112640)]）：

```python
>>> from collections import Iterable, Iterator, Container
>>> class bothIterAndNext:
... 	def __iter__(self):
... 		pass
... 	def __next__(self):
... 		pass
...
>>> isinstance(bothIterAndNext(), Iterable) # 两种方法都有的对象是可迭代的
True
>>> isinstance(bothIterAndNext(), Iterator) # 两种方法都有的对象是迭代器
True
>>> 
>>> class onlyNext:
... 	def __next__(self):
... 		pass
...
>>> isinstance(onlyNext(), Iterable) # 只有方法 __next__() 是不可迭代的
False
>>> isinstance(onlyNext(), Iterator) # 只有方法 __next__() 不是迭代器
False
>>> 
>>> class onlyIter:
... 	def __iter__(self):
... 		pass
...
>>> isinstance(onlyIter(), Iterable) # 只有方法 __iter__() 是可迭代的
True
>>> isinstance(onlyIter(), Iterator) # 只有方法 __iter__() 不是迭代器
False
```

由第 8~11 行的代码可知，对于 Python 来说，判断一个对象是否是迭代器的标准仅仅是“是否同时具有`__iter__()`和`__next__()`这两个方法”。

并且从第 17~20 行的代码也可以验证上述推断：只具有方法`__next__()`既不是可迭代的，也不是一个迭代器。

有意思的事情发生在代码第 26、27 两行：代码输出结果显示，只有方法`__iter__()`的对象居然是**可迭代的**！（后文解释）

### 2.2 迭代器的实质

迭代器对象本质上代表的是一个数据流，通过反复调用其方法`__next__()`或将其作为参数传入`next()`函数，即可按顺序逐个返回数据流中的每一项；直到流中不再有数据项，从而抛出一个`StopIteration`异常，终止迭代。

在 Python 中内置了两个函数：`iter()`和`next()`，分别用于“**将参数对象转换为迭代器对象**”和“**从迭代器中取出下一项**”。

实际上所有具有方法`__iter__()`的对象均被视作“可迭代的”。因为方法`__iter__()`进行的操作其实就是返回一个该对象对应的迭代器，也就是说“可迭代的（iterable）”的真实含义其实是“可以被转换为迭代器（iterator）的”。而内置函数`iter()`也是调用对象本身具有的`__iter__()`方法来实现特定对象到迭代器的转换。

相应地，内置函数`next()`其实是调用了对象本身的方法`__next__()`，而该方法执行的操作就是从对象对应的数据流中取出下一项。

因此直接调用对象的`__iter__()`和`__next__()`方法与将对象作为参数传入内置函数`iter()`和`next()`是等效的。

要注意的一点在于，对迭代器调用其本身的`__iter__()`方法，得到的将会是这个迭代器自身，该迭代器相关的状态都会被保留，包括该迭代器目前的迭代状态。见下述代码：

```python
>>> li = [1, 2, 3]
>>> li_iterator = iter(li)
>>> isinstance(li, Iterator)
False
>>> isinstance(li_iterator, Iterator)
True
```

显然，列表`li`本身并不是一个迭代器，而将其传入内置函数`iter()`就得到了相应于列表`li`的迭代器`li_iterator`。我们调用`next()`函数来迭代它：

```python
>>> next(li_iterator)
1
>>> next(li_iterator)
2
```

一切都在预料之中。我们再来将其本身作为参数传入内置函数`iter()`：

```python
>>> li_iterator = iter(li_iterator)
>>> next(li_iterator)
3
```

到这里跟我们希望的就有所出入了。在使用这样一个语句的时候，通常我们的目的都是得到一个新的迭代器，而非跟原先的迭代器一样的对象。

更进一步地，我们还可以发现，对迭代器调用`iter()`函数得到的对象不仅与原先的迭代器具有相同的状态，它们其实就是指向**同一个对象**：

```python
>>> id(li_iterator)
2195581916440
>>> li_iterator = iter(li_iterator)
>>> id(li_iterator)
2195581916440
>>> li_iterator2 = iter(li_iterator)
>>> id(li_iterator2)
2195581916440
```

也就是说在对象本身就是一个迭代器的情况下，生成的对应迭代器的时候 Python 不会进行另外的操作，就返回这个迭代器本身作为结果。

## 3 实现一个迭代器类

> 本节构建类的代码来自[[Python3 文档-类-9.8 迭代器](https://docs.python.org/3/tutorial/classes.html?highlight=iterator#iterators)]

有了上面的讨论，我们就可以自己实现一个简单的迭代器。只要确保这个简单迭代器具有与迭代器定义相符的行为即可。

说人话就是：要定义一个数据类型，具有`__iter__()`方法并且该方法返回一个带有`__next__()`方法的对象，而当该类已经具有`__next__()`方法时则返回其本身。示例代码如下：

```python
class Reverse:
    """反向遍历序列对象的迭代器"""
    def __init__(self, data):
        self.data = data
        self.index = len(data)

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == 0:
            raise StopIteration
        self.index = self.index - 1
        return self.data[self.index]
```

验证一下：

```python
>>> rev = Reverse('justdopython.com')
>>> next(rev)
'm'
>>> next(rev)
'o'
>>> next(rev)
'c'
>>> next(rev)
'.'
```

(o゜▽゜)o☆[BINGO!]

任务完成！

## 4 `for`语句与迭代器

回到文章开头我们作为引子的`for`循环示例，实际上在执行`for`语句的时候，Python 悄悄调用了内置函数[`iter()`](https://docs.python.org/3/library/functions.html#iter)，并将`for`语句中的容器对象作为参数传入；而函数[`iter()`](https://docs.python.org/3/library/functions.html#iter)返回值则是一个迭代器对象。

因此，`for`语句是将容器对象转换为迭代器对象之后，调用`__next__()`方法，逐个访问原容器中的各个对象，直到遍历完所有元素，抛出一个`StopIteration`异常，并终止`for`循环。

## 5 总结

- 迭代器（iterator）首先要是可迭代的（iterable）；即迭代器一定是可迭代的，但可迭代的不一定是迭代器
- 可迭代的对象意味着可以被转换为迭代器
- 迭代器需要同时具有方法`__iter__()`和`__next__()`
- 对迭代器调用`iter()`函数，得到的是这个迭代器本身
- `for`循环实际上使用了迭代器，并且一般情况下将异常`StopIteration`作为循环终止条件

本文探究了 Python 中迭代器的相关知识点，深入理解了迭代器的属性和行为，学到了两个重要的方法`__iter__()`和`__next__()`。同时搞明白了 Python 实现`for`循环的内部机制。

> 示例代码：[Python-100-days-day019](https://github.com/JustDoPython/python-100-day/tree/master/day-019)

## 参考资料

[1] [Python3 文档-内置类型](https://docs.python.org/3/library/stdtypes.html)

[2] [廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1016959663602400/1017323698112640)

[3] [Python3 文档-类-9.8 迭代器](https://docs.python.org/3/tutorial/classes.html?highlight=iterator#iterators)

