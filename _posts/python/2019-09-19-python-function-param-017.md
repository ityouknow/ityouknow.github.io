---
layout: post
title:  第17天：Python 函数之参数
category: python
copyright: python
---

>  by 小小摸虾

定义一个函数非常简单，但是怎么定义一个函数，需要什么参数，怎么去调用却是我们需要去思考的问题。

如同大多数语言一样（如 Java），Python 也提供了多种参数的设定（如：默认值参数、关键字参数、形参等）。使用这些参数定义出来的代码，可以让我们适应不同的开放场景，也能简化我们的代码开发工作。

<!--more-->

## 默认值参数

我们创建一个函数，定义参数中一个或多个赋予默认值后，我们可以使用比允许的更少的参数去调用此函数，举个例子（*注意:以下代码都使用 python3.7 版本*）：

```python
def def_param_fun(prompt, retries=4, reminder='Please try again!'):
    while True:
        ok = input(prompt)
        if ok in ('y', 'ye', 'yes'):
            return True
        if ok in ('n', 'no', 'nop', 'nope'):
            return False
        retries = retries - 1
        if retries < 0:
            raise ValueError('invalid user response')
        print(reminder)
        
# 我们可以如下进行调用
def_param_fun('Do you really want to quit?')

def_param_fun('Do you really want to quit?', 2)

def_param_fun('Do you really want to quit?', 2, 'Please, yes or no!')
```

如上所示，我们可以使用一个或多个参数去调用此函数，我们实际生产中,很多情况下会赋予函数参数默认值的情形，因此，合理使用此种参数形式可以简化我们很多工作量。

> **重要：使用默认值参数时，如果我们的默认值是一个可变对象时，我们调用函数可能出现不符合我们预期的结果**。如下：

```python
def f(a, l=[]):
    l.append(a)
    return l
    
# 此时调用函数
print(f(1))
print(f(2))
print(f(3))

# 返回值
# [1]
# [1, 2]
# [1, 2, 3]
```

> 这是由于函数在初始化时，默认值只会执行一次，所以在默认值为可变对象（列表、字典以及大多数类实例），我们可以如下操作：

```python
def f(a, l=None):
    if l is None:
        l = []
    l.append(a)
    return l

# 再次调用函数
print(f(1))
print(f(2))
print(f(3))

# 返回值
# [1]
# [2]
# [3]
```

## 可变参数

可变参数也就是我们对于函数中定义的参数是可以一个或多个可以变化的，其中 `*args` 代表着可以传入一个 list 或者 tuple, `**args` 代表着可以传入一个 dict。举个例子：

```python
def variable_fun(kind, *arguments, **keywords):
    print("friend : ", kind, ";")
    print("-" * 40)
    for arg in arguments:
        print(arg)
    print("-" * 40)
    for kw in keywords:
        print(kw, ":", keywords[kw])
        
# 函数调用
variable_fun("xiaoming",
             "hello xiaoming", "nice to meet you!",
            mother="xiaoma",
            father="xiaoba",
            son="see you")
            
# 输出结果
first arg:  xiaoming ...
----------------------------------------
hello 
nice to meet you!
----------------------------------------
mother : xiaoma
father : xiaoba
son : see you
```

我们还可以使用下面的方式进行调用，得到上面相同的结果：

```python
list01 = ["hello xiaoming", "nice to meet you!"]
dict01 = {'mother': 'xiaoma', 'father': 'xiaoba', 'son': 'see you'}
variable_fun("xiaoming", *list01, **dict01)
```

以上其实是 python 的解包操作，和 java 类似。

## 关键字参数

关键字参数允许你调用函数时传入0个或任意个含参数名的参数，这样可以让我们灵活的去进行参数的调用。举个例子：

```python
# 借用官网例子
def key_fun(voltage, state='a stiff', action='voom', type='Norwegian Blue'):
    print("-- This key_fun wouldn't", action, end=' ')
    print("if you put", voltage, "volts through it.")
    print("-- Lovely plumage, the", type)
    print("-- It's", state, "!")

# 函数调用  
key_fun(1000)                                          # 1 positional argument
key_fun(voltage=1000)                                  # 1 keyword argument
key_fun(voltage=1000000, action='VOOOOOM')             # 2 keyword arguments
key_fun(action='VOOOOOM', voltage=1000000)             # 2 keyword arguments
key_fun('a million', 'bereft of life', 'jump')         # 3 positional arguments
key_fun('a thousand', state='pushing up the daisies')  # 1 positional, 1 keyword
```

> 注意不可以重复传值,否则会报如下错误:

```python
# TypeError: key_fun() got multiple values for argument 'voltage'
key_fun(100, voltage=1000)                             # error
```

## 总结
本节主要简单的介绍了 python 中函数参数的使用，设定的方式可以配合使用，但是也不要过多的去设计，否则会造成函数的可读性变的很差。

## 代码地址

> 示例代码：[Python-100-days-day017](https://github.com/JustDoPython/python-100-day/tree/master/day-017)

