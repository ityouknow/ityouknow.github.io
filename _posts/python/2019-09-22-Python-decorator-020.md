---
layout: post
title:  第20天：Python 之装饰器
category: python
copyright: python
lock: need
---

>  by 轩辕御龙

# Python 之装饰器

## 1. 概念介绍

**装饰器**（decorator），又称“装饰函数”，即一种返回值也是函数的函数，可以称之为“函数的函数”。其目的是在不对现有函数进行修改的情况下，实现额外的功能。最基本的理念来自于一种被称为“装饰模式”的设计模式。

在 Python 中，装饰器属于纯粹的“语法糖”，不使用也没关系，但是使用的话能够大大简化代码，使代码更加易读——当然，是对知道这是怎么回事儿的人而言。

<!--more-->

想必经过一段时间的学习，大概率已经在 Python 代码中见过`@`这个符号。没错，这个符号正是使用装饰器的标识，也是正经的 Python 语法。

> [语法糖]([https://baike.baidu.com/item/%E8%AF%AD%E6%B3%95%E7%B3%96/5247005?fr=aladdin](https://baike.baidu.com/item/语法糖/5247005?fr=aladdin))：指计算机语言中添加的某种语法，这种语法对语言的功能并没有影响，但是更方便程序员使用。通常来说使用语法糖能够增加程序的可读性，从而减少程序代码出错的机会。

## 2. 运行机制

简单来说，下面两段代码在语义上是可以划等号的（当然具体过程还是有一点微小区别的）：

```python
def IAmDecorator(foo):
    '''我是一个装饰函数'''
    pass

@IAmDecorator
def tobeDecorated(...):
    '''我是被装饰函数'''
    pass
```

与：

```python
def IAmDecorator(foo):
    '''我是一个装饰函数'''
    pass

def tobeDecorated(...):
    '''我是被装饰函数'''
    pass
tobeDecorated = IAmDecorator(tobeDecorated)
```

可以看到，使用装饰器的`@`语法，就相当于是将具体定义的函数作为参数传入装饰器函数，而装饰器函数则经过一系列操作，返回一个新的函数，然后再将这个新的函数赋值给原先的函数名。

最终得到的是一个与我们在代码中显式定义的函数**同名**而**异质**的新函数。

而装饰函数就好像为原来的函数套了一层壳。如图所示，最后得到的组合函数即为应用装饰器产生的新函数：

![2019-09-23-装饰器_03.gif](http://www.justdopython.com/assets/images/2019/09/23/2019-09-23-decorator_03.gif)

这里要注意一点，上述两段代码在具体执行上还是存在些微的差异。在第二段代码中，函数名`tobeDecorated`实际上是先指向了原函数，在经过装饰器修饰之后，才指向了新的函数；但第一段代码的执行就没有这个中间过程，直接得到的就是名为`tobeDecorated`的新函数。

此外，装饰函数**有且只能有**一个参数，即要被修饰的原函数。

## 3. 用法

Python 中，装饰器分为两种，分别是“函数装饰器”和“类装饰器”，其中又以“函数装饰器”最为常见，“类装饰器”则用得很少。

### 3.1 函数装饰器

#### 3.1.1 大体结构

对装饰函数的定义大致可以总结为如图所示的模板，即：

![装饰函数模板示意图.png](http://www.justdopython.com/assets/images/2019/09/23/template_of_decoratorFunction.png)

由于要求装饰函数返回值也为一个函数的缘故，为了在原函数的基础上对功能进行扩充，并且使得扩充的功能能够以函数的形式返回，因此需要在装饰函数的定义中再定义一个内部函数，在这个内部函数中进一步操作。最后`return`的对象就应该是这个内部函数对象，也只有这样才能够正确地返回一个附加了新功能的函数。

如图一的动图所示，装饰函数就像一个“包装”，将原函数装在了装饰函数的内部，从而通过在原函数的基础上附加功能实现了扩展，装饰函数再将这个新的整体返回。同时对于原函数本身又不会有影响。这也是“装饰”二字的含义。

**这个地方如果不定义“内部函数”行不行呢？**

**答案是“不行”。**

#### 3.1.2 关于结构的解释

让我们来看看下面这段代码：

```python
>>> def IAmFakeDecorator(fun):
...     print("我是一个假的装饰器")
...     return fun
...
>>> @IAmFakeDecorator
... def func():
...     print("我是原函数")
...
我是一个假的装饰器
```

有点奇怪，怎么刚一定义，装饰器扩展的操作就执行了呢？

再来调用一下新函数：

```python
>>> func()
我是原函数
```

诶呦奇了怪了，扩展功能哪儿去了呀？

不要着急，我们来分析一下上面的代码。在装饰函数的定义中，我们没有另外定义一个内部函数，扩展操作直接放在装饰函数的函数体中，返回值就是传入的原函数。

在定义新函数的时候，下面两段代码又是等价的：

```python
>>> @IAmFakeDecorator
... def func():
...     print("我是原函数")
...
我是一个假的装饰器
```
和

```python
>>> def func():
...     print("我是原函数")
...
>>> func = IAmFakeDecorator(func)
我是一个假的装饰器
```

审视一下后一段代码，我们可以发现，装饰器只在定义新函数的同时调用一次，之后新函数名引用的对象就是装饰器的返回值了，与装饰器没有半毛钱关系。

换句话说，装饰器本身的函数体中的操作都是**当且仅当**函数定义时，才会执行一次，以后再以新函数名调用函数，执行的只会是内部函数的操作。所以到实际调用新函数的时候，得到的效果跟原函数没有任何区别。

如果不定义内部函数，单纯返回传入的原函数当然也是可以的，也符合装饰器的要求；但却得不到我们预期的结果，对原函数扩展的功能**无法复用**，只是**一次性**的。因此这样的行为没有任何意义。

这个在装饰函数内部定义的用于扩展功能的函数可以随意取名，但一般约定俗成命名为`wrapper`，即“包装”之意。

正确的装饰器定义应如下所示：

```python
>>> def IAmDecorator(fun):
...     def wrapper(*args, **kw):
...         print("我真的是一个装饰器")
...         return fun(*args, **kw)
...     return wrapper
...
```

#### 3.1.3 参数设置的问题

内部函数参数设置为`(*args, **kw)`的目的是可以接收**任意参数**，关于如何接收任意参数的内容在前面的[函数参数](http://www.justdopython.com/2019/09/19/python-function-param-017/)部分已经介绍过。

之所以要让`wrapper`能够接收任意参数，是因为我们在定义装饰器的时候并不知道会用来装饰什么函数，具体函数的参数又是什么情况；定义为“可以接收任意参数”能够极大增强代码的适应性。

另外，还要注意给出参数的位置。

要明确一个概念：除了函数头的位置，其他地方一旦给出了函数参数，表达式的含义就不再是“**一个函数对象**”，而是“**一次函数调用**”。

因此，我们的装饰器目的是返回一个函数对象，返回语句的对象一定是不带参数的函数名；在内部函数中，我们是需要对原函数进行调用，因此需要带上函数参数，否则，如果内部函数的返回值还是一个函数对象，就还需要再给一组参数才能够调用原函数。Show code：

```python
>>> def IAmDecorator(fun):
...     def wrapper(*args, **kw):
...         print("我真的是一个装饰器")
...         return fun
...     return wrapper
...
>>> @IAmDecorator
... def func(h):
...     print("我是原函数")
...
>>> func()
我真的是一个装饰器
<function func at 0x000001FF32E66950>
```

原函数没有被成功调用，只是得到了原函数对应的函数对象。只有进一步给出了下一组参数，才能够发生正确的调用（为了演示参数的影响，在函数`func`的定义中增加了一个参数`h`）：

```python
>>> func()(h=1)
我真的是一个装饰器
我是原函数
```

只要明白了带参数和不带参数的区别，并且知道你想要的到底是什么效果，就不会在参数上犯错误了。并且也完全不必拘泥上述规则，也许你要的就是一个未经调用的函数对象呢？

把握住这一点，嵌套的装饰器、嵌套的内部函数这些也就都不是问题了。

#### 3.1.4 函数属性

> 本小节内容启发于[廖雪峰的官方网站-Python 教程-函数式编程-装饰器](https://www.liaoxuefeng.com/wiki/1016959663602400/1017451662295584)

还应注意的是，经过装饰器的修饰，原函数的属性也发生了改变。

```python
>>> def func():
...     print("我是原函数")
...
>>> func.__name__
'func'
```

正常来说，定义一个函数，其函数名称与对应的变量应该是一致的，这样在一些需要以变量名标识、索引函数对象时才能够避免不必要的问题。但是事情并不是那么顺利：

```python
>>> @IAmDecorator
... def func():
...     print("我是原函数")
...
>>> func.__name__
'wrapper'
```

变量名还是那个变量名，原函数还是那个原函数，但是函数名称却变成了装饰器中内部函数的名称。

在这里我们可以使用 Python 内置模块`functools`中的`wraps`工具，实现“在使用装饰器扩展函数功能的同时，保留原函数属性”这一目的。这里`functools.wraps`本身也是一个装饰器。运行效果如下：

```python
>>> import functools
>>> # 定义保留原函数属性的装饰器
... def IAmDecorator(fun):
...     @functools.wraps(fun)
...     def wrapper(*args, **kw):
...         print("我真的是一个装饰器")
...         return fun(*args, **kw)
...     return wrapper
...
>>> @IAmDecorator
... def func():
...     print("我是原函数")
...
>>> func.__name__
'func'
```

大功告成！

### 3.2 类装饰器

> 本节部分参考[[Python3 文档-复合语句-类定义](https://docs.python.org/3/reference/compound_stmts.html#class-definitions)]和[[python 一篇文章搞懂装饰器所有用法](https://www.jb51.net/article/168276.htm)]中类装饰器相关部分

类装饰器的概念与函数装饰器类似，使用上语法也差不多：

```python
@ClassDecorator
class Foo:
    pass
```

等价于

```python
class Foo:
    pass
Foo = ClassDecorator(Foo)
```

在定义类装饰器的时候，要保证类中存在`__init__`和`__call__`两种方法。其中`__init__`方法用以接收原函数或类，`__call__`方法用以实现装饰逻辑。

简单来讲，`__init__`方法负责在初始化类实例的时候，将传入的函数或类绑定到这个实例上；而`__call__`方法则与一般的函数装饰器差不多，连构造都没什么两样，可以认为`__call__`方法就是一个函数装饰器，因此不再赘述。

### 3.3 多个装饰器的情况

多个装饰器可以嵌套，具体情况可以理解为从下往上结合的复合函数；或者也可以理解为下一个装饰器的值是前一个装饰器的参数。

举例来说，下面两段代码是等价的：

```python
@f1(arg)
@f2
def func(): 
    pass
```

和

```python
def func(): 
    pass
func = f1(arg)(f2(func))
```

理解了前面的内容，这种情况也很容易掌握。

## 4. 总结

本文介绍了 Python 中的装饰器这一特性，详细讲解了装饰器的实际原理和使用方式，能够大大帮助学习者掌握有关装饰器的知识，减小读懂 Python 代码的阻力，写出更加 pythonic 的代码。

> 示例代码：[Python-100-days-day022](https://github.com/JustDoPython/python-100-day/tree/master/day-020)

## 参考资料

[1] [Python3 术语表-装饰器](https://docs.python.org/3/glossary.html#term-decorator)

[2] [Python3 文档-复合语句-函数定义](https://docs.python.org/3/reference/compound_stmts.html#function-definitions)

[3] [Python3 文档-复合语句-类定义](https://docs.python.org/3/reference/compound_stmts.html#class-definitions)

[4] [语法糖](https://baike.baidu.com/item/语法糖/5247005?fr=aladdin)

[5] [廖雪峰的官方网站-Python 教程-函数式编程-装饰器](https://www.liaoxuefeng.com/wiki/1016959663602400/1017451662295584)