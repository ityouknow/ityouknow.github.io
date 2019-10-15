---
layout: post
title:  第22天：Python NameSpace&Scope
category: python
copyright: python
---

>  by 潮汐


命名空间定义了在某个作用域内变量名和绑定值之间的对应关系，命名空间是键值对的集合，变量名与值是一一对应关系。作用域定义了命名空间中的变量能够在多大范围内起作用。

命名空间在 Python 解释器中是以字典的形式存在的，是以一种可以看得见摸得着的实体存在的。作用域是 Python 解释器定义的一种规则，该规则确定了运行时变量查找的顺序，是一种形而上的虚的规定。

<!--more-->

# 一、命名空间

## 1、概述

> A namespace is a mapping from names to objects.Most namespaces are currently implemented as Python dictionaries。             
命名空间是名字和对象的映射，命名空间是通过 Python Dictionary(字典) 来实现的。

- 命名空间提供了一个在大型项目下避免名字冲突的方法
- Python 中各个命名空间都是独立的，他们之间无任何关系
- 一个命名空间中不能有重名，但不同的命名空间是可以重名而没有任何影响。


命名空间就像是计算机中的文件夹一样，同一个文件夹中的文件不可重名，但是如果两个文件从属于不同的文件夹就可以重名。
![image](https://www.runoob.com/wp-content/uploads/2019/09/0129A8E9-30FE-431D-8C48-399EA4841E9D.jpg)

同理相同的对象名可以存在不同的命名空间中：

![对象名和命名空间](https://i.loli.net/2019/09/27/OsePaFKRbfnkDVC.png)

## 2、命名空间种类 

命名空间的种类分为 3 类，命名空间的种类也体现了命名空间的生命周期。三个种类及生命周期描述如下：

**1）内置名称（built-in names）**

Python 语言内置的名称，比如函数名 abs、char 和异常名称 BaseException、Exception 等等。
 
  **生命周期：**

对于 Python built-in names 组成的命名空间，它在 Python 解释器启动的时候被创建，在解释器退出的时候才被删除；

**2）全局名称（global names）**

模块中定义的名称，记录了模块的变量，包括函数、类、其它导入的模块、模块级的变量和常量。
 
  **生命周期：**

对于一个 Python 模块的 global namespace，它在这个 module 被  import  的时候创建，在解释器退出的时候退出；

**3）局部名称（local names）**

函数中定义的名称，记录了函数的变量，包括函数的参数和局部定义的变量。（类中定义的也是）
 
  **生命周期：**
  
对于一个函数的 local namespace，它在函数每次被调用的时候创建，函数返回的时候被删除。

**注意：**

命名空间的生命周期取决于对象的作用域，如果对象执行完成，则该命名空间的生命周期就结束。
因此，我们无法从外部命名空间访问内部命名空间的对象。例如：

```
# var1 是全局名称
var1 = 5
def some_func(): 
  
    # var2 是局部名称
    var2 = 6
    def some_inner_func(): 
  
        # var3 是内嵌的局部名称
        var3 = 7
```

**命名空间分类图如下：**

![命名空间分类直观图](https://i.loli.net/2019/09/27/zo6SFa4EGnRmKvI.png)

##  3、命名空间查找、创建、销毁顺序

###  3.1 查找变量  

如果程序执行时去使用一个变量 hello ，那么 Python，
查找变量顺序为： 
 
**局部的命名空间 -> 全局命名空间 -> 内置命名空间**

如果按照这个顺序找不到相应的变量，它将放弃查找并抛出一个 NameError 异常：

```
NameError: name 'hello' is not defined。
```

###  3.2 各命名空间创建顺序：

Python 解释器启动 ->创建内建命名空间 -> 加载模块 -> 创建全局命名空间 ->函数被调用 ->创建局部命名空间

### 3.3 各命名空间销毁顺序：

函数调用结束 -> 销毁函数对应的局部命名空间 -> Python 虚拟机（解释器）退出 ->销毁全局命名空间 ->销毁内建命名空间

##  4、命名空间总结
 
 一个模块的引入，函数的调用，类的定义都会引入命名空间，函数中的再定义函数，类中的成员函数定义会在局部 namespace 中再次引入局部 namespace。
 
#  二、作用域
 
##   1、概述

> A scope is a textual region of a Python program where a namespace is directly accessible. "Directly accessible" here means that an unqualified reference to a name attempts to find the name in the namespace.
 
作用域就是一个 Python 程序可以直接访问命名空间的正文区域。

- Python 程序中，直接访问一个变量，会从内到外依次访问所有的作用域直到找到，否则会报未定义的错误。
- Python 中，程序的变量并不是在哪个位置都可以访问的，访问权限决定于这个变量是在哪里赋值的。
- Python 中， 变量的作用域决定了在哪一部分程序可以访问哪个特定的变量名称

## 2、作用域种类

作用域分为4类，分别如下：

- L（Local）：最内层，包含局部变量，比如一个函数/方法内部。
- E（Enclosing）：包含了非局部(non-local)也非全局(non-global)的变量。比如两个嵌套函数，一个函数（或类） A 里面又包含了一个函数 B ，那么对于 B 中的名称来说 A 中的作用域就为 nonlocal。
- G（Global）：当前脚本的最外层，比如当前模块的全局变量。
- B（Built-in）： 包含了内建的变量/关键字等，最后被搜索。

作用域规则顺序为：

    L->E->G->B
	
如果变量在局部内找不到，便会去局部外的局部找（例如闭包），再找不到就会去全局找，再找不到就去内置中找，如下图所示：

![作用域分类直观图](https://www.runoob.com/wp-content/uploads/2014/05/1418490-20180906153626089-1835444372.png)

## 3、全局作用域和局部作用域

局部作用域（Local）是脚本中的最内层，包含局部变量，比如一个函数或方法内部。
闭包函数外函数（Enclosing）包含了非局部 (non-local) 也非全局 (non-global) 的变量。 
全局作用域（Global）是当前脚本的最外层，如当前模块的全局变量，实例如下：

```
global_scope = 0  # 全局作用域

# 定义闭包函数中的局部作用域
def outer():
    o_count = 1  # 闭包函数外的函数中，相对于函数 inner() 来说 作用域非局部
    def inner():
       local_scope = 2  # 局部作用域
```

以上实例展示的是全局作用域和闭包函数中的函数，以及函数中的局部作用域，对于函数 inner() 来说，outer() 中的作用域为 non-local

## 4、内建作用域

> Python 中的内建作用域（Built-in）： 包含了内建的变量/关键字等，最后被搜索

内建作用域是通过一个名为 builtin 的标准模块来实现的，但是这个变量名自身并没有放入内置作用域内，所以必须导入这个文件才能够使用它。在 Python3.0 中，可以使用以下的代码来查看到底预定义了哪些变量:

```
import builtins
dir(builtins)
['ArithmeticError', 'AssertionError', 'AttributeError', 'BaseException', 'BlockingIOError', 'BrokenPipeError', 'BufferError', 'BytesWarning', 'ChildProcessError', 'ConnectionAbortedError', 'ConnectionError', 'ConnectionRefusedError'...]
```

Python 中只有模块（module），类（class）以及函数（def、lambda）才会引入新的作用域，其它的代码块（如 if/elif/else/、try/except、for/while 等）是不会引入新的作用域的，也就是说这些语句内定义的变量，外部也可以访问，如下:

```
name1 = 'SuSan'
if chr('SuSan'.__eq__(name1)):
    result = 'I am from China'
else:
    result = 'I am from USA'

print(result)

# 输出结果为：
I am SuSan,I am from China
```

实例中 result 变量定义在 if 语句块中，但外部还是可以访问的。

如果将 result 定义在函数中，则它就是局部变量，外部不能访问，在代码中会报错运行出异常：

```
# 如果将变量定义在函数内部，则外部不能访问
def names():
    name2 = 'SuSan'
# 在程序调用方法内部的变量报错
if('SuSan'.__eq__(name2)):
    result = 'I am '+name2 +','+'I am from China'
else:
    result = 'I am from USA'

print(result)

#运行输出异常
Traceback (most recent call last):
  File "python_scope.py", line 30, in <module>
    if('SuSan'.__eq__(name1)):
NameError: name 'name2' is not defined
```

从以上报错信息看出，name2 未定义，因为 name2 是函数 names() 中的局部变量，只能在函数内部调用，外部不能调用函数中的局部变量。

## 5、全局变量和局部变量

- 全局变量：定义在函数外部拥有全局作用域的变量
- 局部变量：定义在函数内部拥有局部作用域的变量

局部变量只能在其被声明的函数内部访问，而全局变量可以在整个程序范围内访问。调用函数时，所有在函数内声明的变量名称都将被加入到作用域中。如下实例：
 
```
# 全局变量和局部变量
total = 0  # 这是一个全局变量
# 函数说明
def sum(arg1, arg2):
    # 返回2个参数的和."
    total = arg1 + arg2  # total在这里是局部变量.
    print("函数内是局部变量 : ", total)
    return total

# 调用sum函数，传入参数的计算结果显示局部变量
sum(10, 20)
print("函数外是全局变量 : ", total)

# 输出结果为：
函数内是局部变量 :  30
函数外是全局变量 :  0
```

## 6、global 和 nonlocal 关键字 

当内部作用域想修改外部作用域的变量时，就要用到 global 和 nonlocal 关键字了。

**变量访问顺序**：  
                                            
当前作用域局部变量 -> 外层作用域变量 -> 再外层作用域变量 -> ...... -> 当前模块全局变量 -> pyhton 内置变量

- global: 全局变量,当局部作用域改变全局变量用 global，同时 global 还可以定义新的全局变量
- nonlocal: 外层嵌套函数的变量, nonlocal 不能定义新的外层函数变量，只能改变已有的外层函数变量,同时 nonlocal 不能改变全局变量

### 6.1 修改全局变量

```
num = 1
def fun1():
# 申明访问全局变量
    global num  # 需要使用 global 关键字声明
# 输出全局变量原始值
    print(num) 
#　修改全局变量
    num = 123
    print(num)
# 调用函数
fun1()
# 输出修改后的全局变量值
print(num)
```

以上实例输出结果为：

```
1
123
123
```

### 6.2 修改嵌套作用域

如果要修改嵌套作用域（enclosing 作用域，外层非全局作用域）中的变量则需要 nonlocal 关键字

```
# 定义函数
def outer():
# 定义变量
    num = 10
    #　定义嵌套函数
    def inner():
        nonlocal num   # nonlocal关键字声明，使用函数中变量
        # 修改变量值
        num = 100
        print(num)
    inner()
    print(num)
outer()
```

以上实例输出：

```
100
100
```

另外还有一种特殊情况，以下这段代码有语法错误，运行会报一个异常：

```
b = 8
def test():
    b = b * 10
    print(b)
test()

#　异常信息：UnboundLocalError
```

程序执行异常：

```
Traceback (most recent call last):
  File "python_scope.py", line 90, in <module>
    test()
  File "python_scope.py", line 88, in test
    a = a + 1
UnboundLocalError: local variable 'a' referenced before assignment
```

错误信息为局部作用域引用错误，因为 test 函数中的 a 使用的是局部变量，未定义，无法修改。
将 a 修改为全局变量，通过函数参数传递，程序就可以正常执行，输出结果为：

```
b = 8
def test(b):
    b = b * 10
    print(b)
test(b)
```

程序输出结果为：

```
80
```

另一种解决办法是加 global 关键字：

```
b = 8
def test():
    global b
    b = b * 30
    print(b)
test()
```

输出结果为：

```
240
```

### 6.3 global 和 nonlocal 的区别

- 两者的功能不同。global 关键字修饰变量后标识该变量是全局变量，对该变量进行修改就是修改全局变量，而 nonlocal 关键字修饰变量后标识该变量是上一级函数中的局部变量，如果上一级函数中不存在该局部变量，nonlocal 位置会发生错误（最上层的函数使用 nonlocal 修饰变量必定会报错）。
- 两者使用的范围不同。global 关键字可以用在任何地方，包括最上层函数中和嵌套函数中，即使之前未定义该变量，global 修饰后也可以直接使用，而 nonlocal 关键字只能用于嵌套函数中，并且外层函数中定义了相应的局部变量，否则会发生错误

# 总结

本节给大家介绍了 Python 命名空间和作用用户的介绍与简单应用，在 Python 开发实战中对命名空间和作用域的运用比较广泛，谨以此文献给在 Python 学习道路上的道友，希望对大家有一丝帮助。

> 示例代码：[Python-100-days-day021](https://github.com/JustDoPython/python-100-day/tree/master/day-022)

参考：

https://www.runoob.com/python3/python3-namespace-scope.html



