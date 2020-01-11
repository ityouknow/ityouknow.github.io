---
layout: post
title:  第83天：NumPy 字符串操作
category: python
copyright: python
---

 by 闲欢

 本文向大家介绍一下 NumPy 的常见字符串函数。
<!--more-->

## NumPy 字符串函数

以下函数用于对 dtype 为 numpy.string_ 或 numpy.unicode_ 的数组执行向量化字符串操作。 它们基于 Python 内置库中的标准字符串函数。

这些函数在字符数组类（numpy.char）中定义：


函数 | 描述
---|---
add() | 对两个数组的逐个字符串元素进行连接
multiply() | 返回按元素多重连接后的字符串
center() | 居中字符串
capitalize() | 将字符串第一个字母转换为大写
title() | 将字符串的每个单词的第一个字母转换为大写
lower() | 数组元素转换为小写
upper()	| 数组元素转换为大写
split()	| 指定分隔符对字符串进行分割，并返回数组列表
splitlines() | 返回元素中的行列表，以换行符分割
expandtabs() | 将字符串里面的 `\t` 转换成 N 个 `tab`
strip()	| 移除元素开头或者结尾处的特定字符
lstrip() | 去除字符串左边的空格
rstrip() | 去除字符串右边的空格
join()	| 通过指定分隔符来连接数组中的元素
partition() | 通过制定字符来分隔字符串
replace() | 使用新字符串替换字符串中的所有子字符串
decode() | 数组元素依次调用 str.decode
encode() | 数组元素依次调用 str.encode


## 函数的实例说明

### numpy.char.add()

> numpy.char.add() 函数依次对两个数组的对应元素进行字符串连接。

这里需要注意的是只能连接两个数组，并且两个数组的元素个数必须相同。

实例：

```
import numpy as np

# 连接两个字符串：
print(np.char.add(['hello'], [' world']))

# 连接多个字符串
print(np.char.add(['hello', 'hi'], [' world', ' Tracy']))

返回：
['hello world']
['hello world' 'hi Tracy']
```

### numpy.char.multiply()

> 将字符串或数组进行重复多重连接。

如果参数是数组的话，这个函数会对数组的每个元素分别进行多重连接。

实例：

```
import numpy as np

# 多重连接
print(np.char.multiply('hello ', 3))
print(np.char.multiply(['hello', 'hi'], 3))

返回：
hello hello hello 
['hellohellohello' 'hihihi']
```

### numpy.char.center()

> 用于将字符串居中，并使用指定字符在左侧和右侧进行填充。三个参数分别是：字符串或数组，拼接后总字符串字符数，填充的字符。

这个函数感觉用在打日志的时候特别好。

实例：

```
import numpy as np

print(np.char.center('hello', 20, fillchar='*'))
print(np.char.center(['hello', 'hi'], 19, fillchar='*'))

返回：
*******hello********
['*******hello*******' '*********hi********']
```

### numpy.char.capitalize()

> 将字符串的第一个字母转换为大写。

实例：

```
import numpy as np

print(np.char.capitalize('hello'))

返回：
Hello
```

### numpy.char.title()

> 将字符串的每个单词的第一个字母转换为大写。

这个函数是上面函数的升级版吧。

实例：

```
import numpy as np

print(np.char.title('i love china'))

返回：
I Love China
```

### numpy.char.lower()

> 将字符串或数组的每个元素转换为小写。

实例：

```
import numpy as np

# 操作字符串
print(np.char.lower('GOOGLE'))

# 操作数组
print(np.char.lower(['I', 'LOVE', 'CHINA']))

返回：
google
['i' 'love' 'china']
```

### numpy.char.upper()

> 将字符串或数组的每个元素转换为大写。

和上一个函数作用相反。

实例：

```
import numpy as np

# 操作字符串
print(np.char.upper('google'))

# 操作数组
print(np.char.upper(['', 'love', 'china']))

返回：
GOOGLE
['' 'LOVE' 'CHINA']
```

### numpy.char.split()

> 通过指定分隔符对字符串进行分割，并返回数组。分隔符默认为空格。

实例：

```
import numpy as np

# 分隔符默认为空格
print(np.char.split('do you love china?'))
# 分隔符为 ,
print(np.char.split('yes,i do', sep=','))

返回：
['do', 'you', 'love', 'china?']
['yes', 'i do']
```

### numpy.char.splitlines()

> 用换行符作为分隔符来分割字符串，并返回数组。

这里的换行符可以是`\r`，`\n`，`\r\n`。

实例：

```
import numpy as np

# 换行符 \r
print(np.char.splitlines('I\rLove China'))
# 换行符 \n
print(np.char.splitlines('I\nLove China'))
# 换行符 \r\n
print(np.char.splitlines('I\r\nLove China'))

返回：
['I', 'Love China']
['I', 'Love China']
['I', 'Love China']
```

### numpy.char.expandtabs()

> 将字符串里面的 `\t` 转换成 N 个 `tab`。

实例：

```
import numpy as np

# 将 \t 转成3个tab
print(np.char.expandtabs('i\tlove\tchina', 3))

返回：
i  love  china
```

### numpy.char.strip()

> 移除开头或结尾处的特定字符。

实例：

```
import numpy as np

# 移除字符串头尾的 a 字符
print(np.char.strip('it love china', 'i'))

# 移除数组元素头尾的 a 字符
print(np.char.strip(['it', 'love', 'china'], 'i'))

返回：
t love china
['t' 'love' 'china']
```

### numpy.char.lstrip()

> 去除字符串左边的空格。

实例：

```
import numpy as np

# 去除左边的空格
print(np.char.lstrip('    china    '))

返回：
china    
```

### numpy.char.rstrip()

> 去除字符串右边的空格。

实例：

```
import numpy as np

# 去除右边的空格
print(np.char.rstrip('    china    '))

返回：
    china
```

### numpy.char.join()

> 通过指定分隔符来连接数组中的元素或字符串。

可以指定多个分隔符分隔数组中对应的元素。

实例：

```
import numpy as np

# 操作字符串
print(np.char.join(':', 'china'))

# 操作数组
print(np.char.join(':', ['china', 'american']))

# 指定多个分隔符操作数组元素
print(np.char.join([':', '-'], ['china', 'american']))

返回：
c:h:i:n:a
['c:h:i:n:a' 'a:m:e:r:i:c:a:n']
['c:h:i:n:a' 'a-m-e-r-i-c-a-n']
```

### numpy.char.join()

> 通过指定字符来分隔数组中的元素或字符串。

通过指定的字符将字符串分割成指定字符前面的字符，指定的字符串和指定字符后面的字符三个部分。

实例：

```
import numpy as np

# 操作字符串
print(np.char.partition('china', 'i'))

# 操作数组
print(np.char.partition(['china', 'like'], 'i'))

返回：
['ch' 'i' 'na']
[['ch' 'i' 'na']
 ['l' 'i' 'ke']]
```

### numpy.char.replace()

> 使用新字符串替换字符串中的所有子字符串。

实例：

```
import numpy as np

# 替换字符串
print(np.char.replace('i love china', 'ov', 'ik'))

返回：
i like china
```

### numpy.char.encode()

> 对数组中的每个元素进行编码操作。默认编码是 utf-8，可以使用标准 Python 库中的编解码器。

实例：

```
import numpy as np

# 编码
print(np.char.encode('中国', 'utf-8'))

返回：
b'\xe4\xb8\xad\xe5\x9b\xbd'
```

### numpy.char.decode()

> 对数组中的每个元素进行解码操作。

实例：

```
import numpy as np

a = np.char.encode('中国', 'utf-8')
print(a)
# 解码
print(np.char.decode(a, 'utf-8'))

返回：
b'\xe4\xb8\xad\xe5\x9b\xbd'
中国
```

## 总结

本文向大家介绍了 NumPy 的字符串函数，这些函数都可以用 python 的原生字符串的方法来完成，但是使用起来没有这么简洁方便。大家可以在不同的场景下根据需求使用本文的这些操作，让代码更简洁，可读性更好。

## 参考

https://numpy.org/devdocs/reference/routines.char.html


> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)