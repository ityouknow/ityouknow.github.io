---
layout: post
title:  第30天： Python collections 模块
category: python
copyright: python
lock: need
---

>  by 豆豆

## 1.简介

collections 是 python 的内置模块，提供了很多方便且高性能的关于集合的操作，掌握这些知识有助于提高代码的性能和可读性。

<!--more-->

## 2.常用功能

### 2.1 namedtuple 功能详解

namedtuple() 返回一个新的元组子类，且规定了元组的元素的个数，同时除了使用下标获取元素之外，还可以通过属性直接获取。

```python
from collections import namedtuple
User = namedtuple("User",["name", "age", "weight"])
user = User("admin", "20", "60")
name, age, weight = user
print(user[0])
print(name, age, weight)
print(user.name, user.age, user.weight)

# 输出结果如下
admin
admin 20 60
admin 20 60
```

由以上代码可以看出，namedtuple() 相当于直接定义了一个新的类，但是这个类跟传统的定义 class 的方式又有着巨大的区别。该方式会比直接定义 class 的方式省很多空间，其次其返回值是一个 tuple，支持 tuple 的各种操场。

同时，namedtuple() 还自带两个非常好用的方法。

```python
# 将序列直接转换为新的 tuple 对象
user = ["root", 32, 65]
user = User._make(user) 
print(user) 
# 输出 User(name='root', age=32, weight=65)

# 返回一个 dict
user = User("admin", 20, 60)
print(user._asdict()) 
# 输出 OrderedDict([('name', 'admin'), ('age', 20), ('weight', 60)])
```

### 2.2 ChainMap 功能讲解

ChainMap() 可以将多个字典集合到一个字典中去，对外提供一个统一的视图。注意：该操作并是不将所有字典做了一次拷贝，实际上是在多个字典的上层又进行了一次封装而已。

```python
from collections import ChainMap

user1 = {"name":"admin", "age":"20"}
user2 = {"name":"root", "weight": 65}
users = ChainMap(user1, user2)
print(users.maps)

users.maps[0]["name"] = "tiger"
print(users.maps)

for key, value in users.items():
    print(key, value)

# 输出如下
[{'name': 'admin', 'age': '20'}, {'name': 'root', 'weight': 65}]
[{'name': 'tiger', 'age': '20'}, {'name': 'root', 'weight': 65}]
name tiger
weight 65
age 20
```

由此可见，如果 ChainMap() 中的多个字典有重复 key，查看的时候可以看到所有的 key，但遍历的时候却只会遍历 key 第一次出现的位置，其余的忽略。同时，我们可以通过返回的新的视图来更新原来的的字典数据。进一步验证了该操作不是做的拷贝，而是直接指向原字典。

### 2.3 deque 功能详解

dqueue 是 ”double-ended queue” 的简称，是一种类似列表(list)的容器，实现了在两端快速添加(append)和弹出(pop)操作。大大加快了遍历速度

```python

from collections import deque
q = deque([1, 2, 3])
q.append('4')
q.appendleft('0')
print(q)
print(q.popleft())

# 输出如下
deque(['0', 1, 2, 3, '4'])
0
```

### 2.4 Counter 功能详解

Counter 可以简单理解为一个计数器，可以统计每个元素出现的次数，同样 Counter() 是需要接受一个可迭代的对象的。
```python
from collections import Counter

animals = ["cat", "dog", "cat", "bird", "horse", "tiger", "horse", "cat"]
animals_counter = Counter(animals)
print(animals_counter)
print(animals_counter.most_common(2))

Counter({'cat': 3, 'horse': 2, 'dog': 1, 'bird': 1, 'tiger': 1})
[('cat', 3), ('horse', 2)]

# 输出如下
Counter({'cat': 3, 'horse': 2, 'dog': 1, 'bird': 1, 'tiger': 1})
[('cat', 3), ('horse', 2)]
```

其实一个 Counter 就是一个字典，其额外提供的 ```most_common()``` 函数通常用于求 Top k 问题。

### 2.5 OrderedDict 功能详解

OrderedDict 是字典的子类，保证了元素的插入顺序。在 3.7 版本下，字典同样也保证了元素的插入顺序。那相比内置字典 OrderedDict 有哪些升级呢。

+ 算法上， OrderedDict 可以比 dict **更好地处理频繁的重新排序操作**。在跟踪最近的访问这种场景（例如在 LRU cache）下非常适用。
+ OrderedDict 类有一个 move_to_end() 方法，可以有效地将元素移动到任一端。

```python
from collections import OrderedDict

user = OrderedDict()
user["name"] = "admin"
user["age"] = 23
user["weight"] = 65
print(user)
user.move_to_end("name") # 将元素移动至末尾
print(user)
user.move_to_end("name", last = False) # 将元素移动至开头
print(user)

# 输出如下
OrderedDict([('name', 'admin'), ('age', 23), ('weight', 65)])
OrderedDict([('age', 23), ('weight', 65), ('name', 'admin')])
OrderedDict([('name', 'admin'), ('age', 23), ('weight', 65)])
```

### 2.6 defaultdict 功能详解

defaultdict 是内置 dict 类的子类。它实现了当 key 不存在是返回默认值的功能，除此之外，与内置 dict 功能完全一样。

```python
from collections import defaultdict

default_dict = defaultdict(int)
default_dict["x"] = 10
print(default_dict["x"])
print(default_dict["y"])

# 输出如下
10
0
```

注意，defaultdict 的参数必须是可操作的。比如 python 内置类型，或者无参的可调用的函数。

```python
def getUserInfo():
    return {
        "name" : "",
        "age" : 0
    }

default_dict = defaultdict(getUserInfo)
admin = default_dict["admin"]
print(admin)

admin["age"] = 34
print(admin)

# 输出如下
{'name': '', 'age': 0}
{'name': '', 'age': 34}
```

上述示例我们给 defaultdict 传了一个自定义函数，当字典中不存在所取 key 时返回默认的用户信息。

## collections 总结

本文总结了 collections 提供的便利的操作，掌握这些知识将大大提高你的编程效率。

## 4. 代码地址

> 示例代码：[Python-100-days-day030](https://github.com/JustDoPython/python-100-day/tree/master/day-030)

## 参考资料
[Python 文档](https://docs.python.org/zh-cn/3/library/collections.html)