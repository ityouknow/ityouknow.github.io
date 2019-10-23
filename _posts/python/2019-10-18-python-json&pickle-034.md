---
layout: post
title:  第34天：python json&pickle
category: python
copyright: python
---

>  by 千阳

在日常开发中，对数据进行序列化和反序列化是常见的数据操作，Python提供了两个模块方便开发者实现数据的序列化操作，即 json 模块和 pickle 模块。这两个模块主要区别如下：

- json 是一个文本序列化格式，而 pickle 是一个二进制序列化格式；
- json 是我们可以直观阅读的，而 pickle 不可以；
- json 是可互操作的，在 Python 系统之外广泛使用，而 pickle 则是 Python 专用的；
- 默认情况下，json 只能表示 Python 内置类型的子集，不能表示自定义的类；但 pickle 可以表示大量的 Python 数据类型。

<!--more-->

## Json 模块

Json 是一种轻量级的数据交换格式，由于其具有传输数据量小、数据格式易解析等特点，它被广泛应用于各系统之间的交互操作，作为一种数据格式传递数据。它包含多个常用函数，具体如下：

### dumps()函数

`dumps()`函数可以将 Python 对象编码成 Json 字符串。例如：

```
#字典转成json字符串 加上ensure_ascii=False以后，可以识别中文， indent=4是间隔4个空格显示   

import json         
d={'小明':{'sex':'男','addr':'上海','age':26},'小红':{ 'sex':'女','addr':'上海', 'age':24},}
print(json.dumps(d,ensure_ascii=False,indent=4)) 

#执行结果：
{
    "小明": {
        "sex": "男",
        "addr": "上海",
        "age": 26
    },
    "小红": {
        "sex": "女",
        "addr": "上海",
        "age": 24
    }
}
```

### dump()函数

`dump()`函数可以将 Python对象编码成 json 字符串，并自动写入到文件中，不需要再单独写文件。例如：

```
#字典转成json字符串,不需要写文件，自动转成的json字符串写入到‘users.json’的文件中 
import json                                                                         
d={'小明':{'sex':'男','addr':'上海','age':26},'小红':{ 'sex':'女','addr':'上海', 'age':24},}
#打开一个名字为‘users.json’的空文件
fw =open('users.json','w',encoding='utf-8')

json.dump(d,fw,ensure_ascii=False,indent=4)
```

### loads()函数

`loads()`函数可以将 json 字符串转换成 Python 的数据类型。例如：

```
#这是users.json文件中的内容
{
    "小明":{
        "sex":"男",
        "addr":"上海",
        "age":26
    },
    "小红":{
        "sex":"女",
        "addr":"上海",
        "age":24
    }
}

#!/usr/bin/python3
#把json串变成python的数据类型   
import json  
#打开‘users.json’的json文件
f =open('users.json','r',encoding='utf-8')
#读文件
res=f.read()
print(json.loads(res))   

#执行结果：
{'小明': {'sex': '男', 'addr': '上海', 'age': 26}, '小红': {'sex': '女', 'addr': '上海', 'age': 24}}
```

### load()函数

`load()`跟`loads()`功能相似，`load()`函数可以将 json 字符串转换成 Python 数据类型，不同的是前者的参数是一个文件对象，不需要再单独读此文件。例如：

```
#把json串变成python的数据类型：字典，传一个文件对象，不需要再单独读文件 
import json   
#打开文件
f =open('users.json','r',encoding='utf-8') 
print(json.load(f))

#执行结果：
{'小明': {'sex': '男', 'addr': '上海', 'age': 26}, '小红': {'sex': '女', 'addr': '上海', 'age': 24}}

```

## Pickle 模块

Pickle 模块与 Json 模块功能相似，也包含四个函数，即 dump()、dumps()、loads() 和 load()，它们的主要区别如下：

- dumps 和 dump 的区别在于前者是将对象序列化，而后者是将对象序列化并保存到文件中。

- loads 和 load 的区别在于前者是将序列化的字符串反序列化，而后者是将序列化的字符串从文件读取并反序列化。

### dumps()函数

`dumps()`函数可以将数据通过特殊的形式转换为只有python语言认识的字符串，例如：

```
import pickle
# dumps功能
import pickle
data = ['A', 'B', 'C','D']  
print(pickle.dumps(data))

b'\x80\x03]q\x00(X\x01\x00\x00\x00Aq\x01X\x01\x00\x00\x00Bq\x02X\x01\x00\x00\x00Cq\x03X\x01\x00\x00\x00Dq\x04e.'
```

### dump()函数

`dump()`函数可以将数据通过特殊的形式转换为只有python语言认识的字符串，并写入文件。例如：

```
# dump功能
with open('test.txt', 'wb') as f:
    pickle.dump(data, f)
print('写入成功')

写入成功
```

### loads()函数

`loads()`函数可以将pickle数据转换为python的数据结构。例如：

```
# loads功能
msg = pickle.loads(datastr)
print(msg)

['A', 'B', 'C', 'D']
```

### load()函数

`load()`函数可以从数据文件中读取数据，并转换为python的数据结构。例如：

```
# load功能
with open('test.txt', 'rb') as f:
   data = pickle.load(f)
print(data)

['A', 'B', 'C', 'D']
```

## 总结

本节给大家介绍 Python 中 json&pickle 模块的常用操作，对于实现数据的序列化和反序列化提供了支撑。

> 示例代码：[Python-100-days-day034](https://github.com/JustDoPython/python-100-day/tree/master/day-034)

参考
[1] https://docs.python.org/3.7/library/pickle.html
[2] https://docs.python.org/3.7/library/json.html