---
layout: post
title:  第41天： operator模块
category: python
copyright: python
---

by 某某白米饭

## operator 模块

operator 模块提供了一套与 Python 的内置运算符对应的高效率函数。

### 函数的种类

函数包含的种类有：对象的比较运算、逻辑运算、数学运算和序列运算
<!--more-->

### 比较运算

运算 | 函数 | 语法
-- | -- | --
小于 | lt(a, b) | a < b
小于等于 | le(a, b) | a <= b
大于 | gt(a, b) | a > b
大于等于 | ge(a, b) | a >= b
等于 | eq(a, b) | a == b
不等于 | ne(a, b) | a != b

#### 实例：

```python
>>> from operator import *
>>> lt(1, 2)     
True
>>> le(1, 3)    
True
>>> le(3, 3)   
True
>>> gt(10, 1)   
True
>>> ge(10, 10)
True
>>> ge(10, 9)  
True
>>> eq(10, 9) 
False
>>> ne(10,10) 
False
>>> ne(10, 9)
True
```

### 逻辑运算

运算 | 函数 | 语法
-- | -- | --
与 | and_(a, b) | a & b
或 | or_(a, b) | a | b
异或 | xor(a, b) | a ^ b
取反 | invert(a, b) | ~ a
对象是否相等 | is_(a, b) | a is b
对象是否不相等 | is_not(a, b) | a is not b
真值 | truth(obj) | obj


#### 实例：

```python
>>> from operator import *
>>> and_(1, 1)
1
>>> or_(1, 2)
3
>>> xor(1, 2)
3
>>> invert(True)
-2
>>> invert(1)
-2
>>> invert(2)
-3
>>> a = [1, 2, 3]
>>> b = 3
>>> is_(a, b)
False
>>> is_not(a, b)
True
>>> truth(a)
True
```

### 数学运算

运算 | 函数 | 语法
-- | -- | --
加 | add(a ,b) | a + b
除 | truediv(a, b) | a / b
乘 | mul(a, b) | a * b
减 | sub(a, b) | a - b
幂 | pow(a, b) | a ** b
负数 | neg(a) | - a
正数 | pos(a) | + a
取模 | mod(a, b) | a % b

#### 实例：

```python
>>> from operator import *
>>> add(1, 2)
3
>>> truediv(3, 2)
1.5
>>> mul(3, 2)
6
>>> sub(3, 2)
1
>>> pow(2, 8)
256
>>> neg(5)
-5
>>> neg(-5)
5
>>> pos(10)
10
>>> pos(-10)
-10
>>> mod(10, 3)
1
```

### 序列运算

运算 | 函数 | 语法
-- | -- | --
字符串拼接 | concat(seq1, seq2) | seq1 + seq2
包含 | contains(seq, obj) | obj in seq
索引赋值 | setitem(obj, i, v) | obj[i] = v
索引删除 | delitem(obj, i) | del obj[i]
索引取值 | getitem(obj, i) | obj[i]
切片赋值 | setitem(seq, slice(i, j), values) | seq[i:j] = values
切片删除 | delitem(seq, slice(i, j)) | del seq[i:j]
切片取值 | getitem(seq, slice(i, j)) | seq[i:j]
格式化 | mod(s, obj) | s % obj

#### 实例：

```python
>>> from operator import *
>>> concat('hello', ' Python')
'hello Python'
>>> a = [1, 3, 4]
>>> contains(a, 2)
False
>>> setitem(a, 1, 5)
>>> a
[1, 5, 4]
>>> delitem(a, 2)
>>> a
[1, 5]
>>> getitem(a, 1)
5
>>> setitem(a, slice(1, 3), 'ijk')
>>> a
[1, 'i', 'j', 'k']
>>> delitem(a, slice(2, 3))
>>> a
[1, 'i', 'k']
>>> mod('str %s', 'value')
'str value'
```

### attrgetter类

operator 模块的 attrgetter 类可以获取对象的属性用于 map(), stored() 操作

#### attrgetter实例:

```python
from operator import *

class Student:
    pass

    def __init__(self, name, score):
        self.name = name
        self.score = score

    def __repr__(self):
        return '%s(name=%r,score=%r)' % (self.__class__.__name__, self.name, self.score)

if __name__ == '__main__':
    students = [Student("zhangSan", 89),
                Student("liSi", 60),
                Student("wangWu", 70),
                Student("xiaoMing", 100)]


    print("按照【分数】排序: ")
    print(sorted(students, key=attrgetter('score'), reverse=True))

    g = attrgetter("score") # 获取【分数】属性
    vals = [g(i) for i in students]
    print ('获取分数属性：' + vals)

```

### itemgetter类

operator 模块的 itemgetter 类会返回一个可调用对象，传入多个对象则返回元组

#### itemgetter实例:

```python
>>> from operator import *
>>> itemgetter(3)('abcdefg')
'd'
>>> itemgetter(1, 3, 4)('abcdefg')
('b', 'd', 'e')
>>> itemgetter('name')({'name': 'liSi', 'age': 18})
'liSi'
>>> soldier = dict(rank='captain', name='dotterbart')
>>> itemgetter('rank')(soldier)
'captain'
>>> inventory = [('apple', 8), ('banana', 2), ('pear', 7)]
>>> getCount = itemgetter(1)
>>> list(map(getCount, inventory))
[8, 2, 7]
>>> sorted(inventory, key = getCount)
[('banana', 2), ('pear', 7), ('apple', 8)]
```