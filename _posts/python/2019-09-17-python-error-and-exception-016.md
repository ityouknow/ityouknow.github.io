---
layout: post
title:  第16天：Python 错误和异常
category: python
copyright: python
---

> by 闲欢  


作为 Python 初学者，在刚学习 Python 编程时，经常会看到一些报错信息，这些报错信息就是我们接下来要讲的错误和异常。
<!--more-->

我们在执行程序语句的时候，经常会看到命令行输出报错信息，例如：

```
>>> while True print('Hello world')
  File "<stdin>", line 1, in ?
    while True print('Hello world')
                   ^
SyntaxError: invalid syntax
```

这种报错信息会阻止程序正常运行，也就是我们要介绍的错误和异常。


## 错误

我们说的错误指的是Python的语法错误，例如：

```
>>> if 1=1: print('always')
  File "<stdin>", line 1
    if 1=1: print('always')
        ^
SyntaxError: invalid syntax
```

上面例子中，在判断相等的时候应该用''=='，而不是用'='，执行的时候，语法解析器检查到有错误，程序语句终止执行，并将错误的地方用上箭头指出来。

语法错误很好解决，根据命令行提示的错误位置，检查语法，改正即可。


## 异常

在Python中，即使你的代码没有语法错误，也不能保证程序按照你的想法运行完毕，因为在程序执行过程中也会有错误。
程序运行期间检测到的错误被称为异常，例如：

```
>>> '1' + 2
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
TypeError: Can't convert 'int' object to str implicitly
```

大多数的异常都不会被程序处理，都以错误信息的形式显示出来，如上例所示，提示信息告诉我们int类型不能和str类型相加。

错误提示信息会告诉我们异常发生的上下文，并以调用栈的形式显示具体信息，提示信息的最后一行开头会显示错误类型名称，上例中，错误类型为'TypeError'，表示类型异常。

### 什么是异常

异常是一个事件，该事件会在程序执行过程中发生，从而影响程序的正常执行。当 Python遇到无法处理的程序时，就会引发一个异常。在 Python 中，异常是一个对象，用于表示一个错误，当 Python脚本发生异常时我们需要捕获和处理它，否则程序会终止执行。

### 处理异常

Python 提供了 try/except语句用来捕获和处理异常。try 语句用来检测语句块中是否有错误，except 语句则用来捕获 try 语句中的异常，并进行处理，附加的 else 可以在 try 语句没有异常时执行。

#### 语法

下面以最简单的 try...except...else 为例：

```
try:
    statement(s)            # 要检测的语句块
except exception：
    deal_exception_code # 如果在 try 部份引发了 'exception' 异常
except exception2, e:
    deal_exception2_code # 如果引发了 'exception2' 异常
else:
    no_exception_happend_code #如果没有异常发生
```

try 语句的执行逻辑如下：

- 首先，执行 try 子句 （try 和 except 关键字之间的（多行）语句）。
- 如果没有异常发生，则跳过 except 子句 并完成 try 语句的执行。
- 如果在执行try 子句时发生了异常，则跳过该子句中剩下的部分。然后，如果异常的类型和 except 关键字后面的异常匹配，则执行 except 子句，然后继续执行 try 语句之后的代码。
- 如果发生的异常和 except 子句中指定的异常不匹配，则将其传递到外部的 try 语句中；如果没有找到处理程序，则它是一个 未处理异常，执行将停止并显示错误消息。
- 如果 try 语句执行时没有发生异常，那么将执行 else 语句后的语句（如果有 else 的话），然后控制流通过整个 try 语句。

#### 基类

如果发生的异常和 except 子句中的类是同一个类或者是它的基类，则异常和 except 子句中的类是兼容的（但反过来则不成立 --- 列出派生类的 except 子句与基类兼容）。

##### 实例

```
class BException(Exception):  #继承Exception基类
    pass

class CException(BException):  #继承BException基类
    pass

class DException(CException):  #继承CException基类
    pass

for cls in [BException, CException, DException]:
    try:
        raise cls()  #抛出异常
    except DException:
        print("D")
    except CException:
        print("C")
    except BException:
        print("B")

#输出
B
C
D
```

请注意如果 except 子句被颠倒（把 except BException 放到第一个），它将打印 B，B，B --- 因为DException类继承CException类，CException类继承BException类，将 except BException 放到第一个可以匹配这三个异常，后面的 except 就不会执行。

#### 不带异常类型的 except 

Python可以在所有 except 的最后加上 except 子句，这个子句可以省略异常名，以用作通配符。它可以捕获前面任何 except （如果有的话）没有捕获的所有异常。

```
try:
    statement(s)            # 要检测的语句块
except exception：
    deal_exception_code # 如果在 try 部份引发了 'exception' 异常
except :
    deal_all_other_exception2_code # 处理全部其它异常
else:
    no_exception_happend_code #如果没有异常发生
```

##### 实例

```
try:
    raise BException()  #抛出异常
except DException:
    print("D")
except:
    print("处理全部其它异常") #处理全部其它异常

#输出
处理全部其它异常
```

#### except 语句捕获多种异常类型

一个 try 语句可能有多个 except 子句，以指定不同异常的处理程序，最多会执行一个处理程序。 处理程序只处理相应的 try 子句中发生的异常，而不处理同一 try 语句内其他处理程序中的异常。一个 except 子句可以将多个异常命名为带括号的元组。

```
try:
    statement(s)            # 要检测的语句块
except exception：
    deal_exception_code # 如果在 try 部份引发了 'exception' 异常
except (Exception1[, Exception2[,...ExceptionN]]]) :
    deal_all_other_exception2_code # 处理多个异常
else:
    no_exception_happend_code #如果没有异常发生
```

##### 实例

```
try:
    raise BException()  #抛出异常
except (BException, DException):
    print("D")
except:
    print("处理全部其它异常") #处理全部其它异常
else:
    print("没有异常发生") #没有异常发生

#输出
D
```

#### try - finally 语句

finally 语句用于无论是否发生异常都将执行最后的代码。

```
try:
    # <语句>
finally:
    # <语句>    #退出try时总会执行
```

##### 实例

```
try:
    raise BException()  #抛出异常
except (BException, DException):
    print("D")
except:
    print("处理全部其它异常") #处理全部其它异常
else:
    print("没有异常发生") #没有异常发生
finally:
    print("你们绕不过我，必须执行") #必须执行的代码
    
#输出
D
你们绕不过我，必须执行
```

这里注意 finally 和 else 的区别，finally 是无论是否有异常都会执行，而 else 语句只有没有异常时才会执行。也就是说如果没有异常，那么 finally 和 else 都会执行。

#### 异常的参数

except 子句可以在异常名称后面指定一个变量。这个变量和一个异常实例绑定，它的参数是一个元组，通常包含错误字符串，错误数字，错误位置，存储在 .args 中。为了方便起见，异常实例定义了__str__() ，因此可以直接打印参数而无需引用 .args。

```
try:
    # 正常的操作 ......
except ExceptionType as inst:
    # 可以在这输出 inst 的值.....
```

##### 实例

```
try:
    x = 1 / 0  # 除数为0
except ZeroDivisionError as err: #为异常指定变量err
    print("Exception")
    print(err.args) #打印异常的参数元组
    print(err) #打印参数，因为定义了__str__()

#输出
Exception
('division by zero',)
division by zero
```

#### 触发异常

Python 提供了 raise 语句用于手动引发一个异常。

##### 语法

```
raise [Exception [, args [, traceback]]]
```

##### 参数说明

```
Exception：异常的类型，例如 ZeroDivisionError
args：异常参数值，可选，默认值 "None"
traceback：可选，用于设置是否跟踪异常对象
```

异常参数值可以是一个字符串，类或对象

##### 实例

```
def diyException(level):
    if level > 0:
        raise Exception("raise exception", level)  #主动抛出一个异常，并且带有参数
        print('我是不会执行的') #这行代码不会执行

try:
   diyException(2)  #执行异常方法
except Exception as err: #捕获异常
    print(err) #打印异常参数
    
#输出
('raise exception', 2)
```

为了能够捕获异常，"except"语句必须有用相同的异常来抛出类对象或者字符串。如果要捕获上面代码抛出的异常，except 语句应该如下所示：

```
#定义函数
def diyException(level):
    if level > 0:
        raise Exception("error level", level)  #主动抛出一个异常，并且带有参数
        print('我是不会执行的') #这行代码不会执行

try:
   diyException(2)  #执行异常方法
except 'error level' as err: #捕获异常
    print(err) #打印异常参数

#输出
Traceback (most recent call last):
  File "/Users/cxhuan/Documents/python_workspace/stock/test.py", line 51, in <module>
    diyException(2)  #执行异常方法
  File "/Users/cxhuan/Documents/python_workspace/stock/test.py", line 47, in diyException
    raise Exception("error level", level)  #主动抛出一个异常，并且带有参数
Exception: ('error level', 2)
```

当然，我们也可以通过 traceback 来捕获异常：

```
import traceback

#定义函数
def diyException(level):
    if level > 0:
        raise Exception("error level", level)  #主动抛出一个异常，并且带有参数
        print('我是不会执行的') #这行代码不会执行

try:
   diyException(2)  #执行异常方法
except Exception: #捕获异常
    traceback.print_exc()
#输出
Traceback (most recent call last):
  File "/Users/cxhuan/Documents/python_workspace/stock/test.py", line 51, in <module>
    diyException(2)  #执行异常方法
  File "/Users/cxhuan/Documents/python_workspace/stock/test.py", line 47, in diyException
    raise Exception("error level", level)  #主动抛出一个异常，并且带有参数
Exception: ('error level', 2)
```

#### 用户自定义异常

除了使用 Python 内置的异常，我们还可以创建自己的异常类型。创建自己的异常非常简单，只需要创建一个类，并继承 Exception 类或其子类。

下面的代码创建了一个异常 DiyError 继承自 Python 内置的 RuntimeError，用于在异常触发时输出更多的信息。

```
#自定义异常
class DiyError(RuntimeError):
    def __init__(self, arg):
        self.args = arg

try:
    raise DiyError("my diy exception") #触发异常
except DiyError as e:
    print(e)
```

定义好了之后，我们就可以在 except 语句后使用 DiyError 异常，变量 e 是用于创建 DiyError 类的实例。我们也可以通过 raise 语句手动触发这个异常。

#### 预定义的清理行为

一些对象定义了标准的清理行为，无论系统是否成功的使用了它，一旦不需要它了，那么这个标准的清理行为就会执行。

```
for line in open("myfile.txt"):
    print(line, end="")
```

上面这个例子尝试打开一个文件，然后把内容打印出来。但是有一个问题：当执行完毕后，程序没有关闭文件流，文件会保持打开状态。

关键词 with 语句就可以保证诸如文件之类的对象在使用完之后一定会正确的执行他的清理方法。

```
with open("myfile.txt") as f:
    for line in f:
        print(line, end="")
```

以上这段代码执行完毕后，就算在处理过程中出问题了，文件 f 总是会关闭。这里面的原理就是使用了 finally 机制，有兴趣的可以去深入了解一下。


## 总结

本节给大家介绍了 Python 错误和异常的使用，掌握了错误和异常的处理，可以极大地提高程序的健壮性，为程序的持续完整运行提供了保障。


> 示例代码：[Python-100-days-day011](https://github.com/JustDoPython/python-100-day/tree/master/day-011)

