---
layout: post
title:  第11天：Python dictionary(字典)
category: python
copyright: python
---

> by 潮汐  

Python 中的字典提供了一种灵活的访问和组织数据的方式

- 字典是由很多值组成的集合
- 字典的索引可以是不同的数据类型，同样也不止是整数，也有字符串
- 字典的索引被称为“键”，键及键所关联的值叫键值对（类似于 Java 中的 Map 集合）
- 字典是另一种可变容器模型，且可存储任意类型对象。
- 字典的每个键值 key=>value 对用冒号 : 分割，每个键值对之间用逗号 , 分割，整个字典包括在花括号 {} 中 ,格式如下所示： 

<!--more-->

```
dictionary  = {'url1':'baidu', 'url':'google', 'num1':12, 'num2':34};
```

键一般是唯一的，如果键重复，最后的一个键值对会替换前面的键值对，值没有唯一性要求，如下：

```
dic1 = {'name':'zhangsan','age':23,'address':'BeiJing','name':'lisi'}
# 查看字典值发现重复的键值后面的替换前面的

dic1
{'name': 'lisi', 'age': 23, 'address': 'BeiJing'}

dic1['name']
'lisi'
```

值可以取任何数据类型，但键必须是不可变的，如字符串，数字或元组，如下：

```
dict = {'Alice': '2341', 'Beth': '9102', 'Cecil': '3258',('a','b'):(12,43)}
```

## 1. 访问字典数据

创建一个字典，并访问数据字典内容，以下字典的键是 ‘size’,'color','character',这些键对应的值是‘big’,'white','gentle' 访问字典的值通过方括号里面添加键就可以直接进行访问，例如：

```
MyDog = {'size':'big','color':'white','character':'gentle'}

# 字典值通过[‘键’]来访问
print(MyDog['size'])
 big   #输出结果

print('My Dog has '+MyDog['color']+' fur.' + ' and it has a ' + MyDog['character']+' character')
My Dog has white fur. and it has a gentle character #输出结果

```

同样的，字典也可以用整数作为键，和列表的索引类似，只是字典的值是任何整数类型都行，不必要从0开始，因为键值的数据类型是任意的，如下：

```
MyCon = {12:'big',0:'white',354:'gentle',1:'good'}
# 访问键为 12 的字典值
MyCon[12]
'big'
# 访问键为 0 的字典值
MyCon[0]
'white'
```

因为字典是不排序的，所以不能像列表那样切片。
如果访问字典中不存在的键，将导致 KeyError 出错信息。这很像列表的“越界”
IndexError 出错信息。在交互式环境中输入以下代码，并注意显示的出错信息，因
为没有 'color' 键：

```
dic1 = {'name':'zhangsan','age':23,'address':'BeiJing'}
#找字典中键为 'color' 的值
dic1['color']
Traceback (most recent call last):
  File "<input>", line 1, in <module>
KeyError: 'color'
```

## 2、修改字典元素

### 2.1 添加和更新字典数据

向字典添加新内容的方法是增加新的键/值对，修改或删除已有键/值对如下实例:

```
dict = {'Name': 'Fiona', 'Age': 10, 'Class': 'Three'}
# 更新
dict['Age'] = 8 
# 添加
dict['School'] = "Middle School" 
# 查看字典数据 
dict
{'Name': 'Fiona', 'Age': 8, 'Class': 'Three', 'School': 'Middle School'}
```

### 2.2 删除字典元素

对字典元素的删除操作能单一删除也能将整个字典清空，显示的删除一个字典使用 del 命令“

```
dict = {'Name': 'Fiona', 'Age': 10, 'Class': 'Three'}

# 删除键是'Name'的条目 
del dict['Name']  

# 清空字典所有条目
dict.clear()  

# 删除整个字典元素
del dict          
 
print ("dict['Age']: ", dict['Age'])
print ("dict['School']: ", dict['School'])
```

以上打印语句这会引发一个异常，因为用 del 后的字典不再存在：

```
Traceback (most recent call last):
  File "test.py", line 12, in <module>
    print("dict['Age']: ", dict['Age'])
TypeError: 'type' object is not subscriptable
```

## 3、字典键的特性

字典值可以没有限制地取任何python对象，既可以是标准的对象，也可以是用户定义的，但键不行。

两个重要的点需要记住：

**1）不允许同一个键出现两次。创建时如果同一个键被赋值两次，后一个值会被记住，如下实例：**

实例

```

dict = {'Name': 'Fiona', 'Age': 10, 'Name': 'Manni'} 
 
print "dict['Name']: ", dict['Name']

# 以上实例输出结果：

dict['Name']:  Manni
```

**2）键必须不可变，所以可以用数字，字符串或元组充当，所以用列表就不行，如下实例：**
```

dict = {['Name']: 'Fiona', 'Age': 10} 
 
print "dict['Name']: ", dict['Name']

# 以上实例输出结果：

Traceback (most recent call last):
  File "test.py", line 3, in <module>
    dict = {['Name']: 'Zara', 'Age': 7} 
TypeError: list objects are unhashable
```

## 4、字典的函数

### 4.1 len()

len() 方法计算字典元素个数（键的总个数）
 
```
>>> dict = {'Name': 'Fiona', 'Age': 10, 'class': 'Three'} 
 >>> len(dict)
     3
```

### 4.2 str()

str() 方法输出字典中可以打印的字符串标识

```
>>> dict = {'Name': 'Runoob', 'Age': 10, 'Class': 'Three'}
>>> str(dict)
"{'Name': 'Runoob', 'Age': 10, 'Class': 'Three'}"
```

### 4.3 type()

type() 方法返回输入的变量类型，如果变量是字典就返回字典类型

```
>>> dict = {'Name': 'Runoob', 'Age': 10, 'Class': 'Three'}
>>> type(dict)
<class 'dict'>
```

## 5、字典的方法

### 5.1 dict.clear()

删除字典内所有元素，clear() 方法没有任何返回值,实例如下：

```
dict = {'Name': 'Fiona', 'Age': 10}

print ("字典长度 : %d" %  len(dict))
dict.clear()
print ("字典删除后长度 : %d" %  len(dict))

# 输出结果为：
字典长度 : 2
字典删除后长度 : 0
```

### 5.2 dict.copy()

copy() 方法对字典进行复制

```
dict = {'Name': 'Runoob', 'Age': 7, 'Class': 'First'}

dict11 = dict.copy()
print(dict11)
print("新复制的字典为 : ", dict11)

dict1 = {'user': 'runoob', 'num': [1, 2, 3]}

# 浅拷贝: 引用对象  赋值
dict2 = dict1  
# 拷贝
dict3 = dict1.copy()  

# 修改 data 数据
dict1['user'] = 'root'
dict1['num'].remove(1)

# 输出结果
print(dict1)
print(dict2)
print(dict3)
```

实例中 dict2 其实是 dict1 的引用，即别名，所以输出结果都是一致的，dict3 对父对象进行了深拷贝，深拷贝不会随dict1 修改而修改，子对象是浅拷贝所以随 dict1 的修改而修改，**即赋值会随父对象的修改而修改，拷贝不会随父对象的修改而修改**，以上结果输出如下：

```
{'Name': 'Runoob', 'Age': 7, 'Class': 'First'}
新复制的字典为 :  {'Name': 'Runoob', 'Age': 7, 'Class': 'First'}

{'user': 'root', 'num': [2, 3]}
{'user': 'root', 'num': [2, 3]}
{'user': 'runoob', 'num': [2, 3]}
```

### 5.3 dict.fromkeys()

创建一个新字典，以序列 seq 中元素做字典的键，val为字典所有键对应的初始值，该方法返回一个新的字典

**fromkeys() 方法语法**

```
dict.fromkeys(seq[, value])

# 参数
seq -- 字典键值列表。
value -- 可选参数, 设置键序列（seq）对应的值，默认为 None。
```

**实例：**

```
# dict.fromkeys(seq[, value])
seq = ('name', 'age', 'class')

# 不指定值
dict = dict.fromkeys(seq)
print("新的字典为 : %s" % str(dict))

# 赋值 10
dict = dict.fromkeys(seq, 10)
print("新的字典为 : %s" % str(dict))

#　赋值一个元组
dict = dict.fromkeys(seq,('zs',8,'Two'))
print("新的字典为 : %s" % str(dict))
```
执行结果返回一个新的字典，如果不指定值默认为None,以上结果输出结果为：

```
新的字典为 : {'name': None, 'age': None, 'class': None}
新的字典为 : {'name': 10, 'age': 10, 'class': 10}
新的字典为 : {'name': ('zs', 8, 'Two'), 'age': ('zs', 8, 'Two'), 'class': ('zs', 8, 'Two')}
```

### 5.4 dict.get(key, default=None)

返回指定键的值，如果值不在字典中返回 default 值

**get() 方法语法**

```
dict.get(key, default=None)

# 参数
key -- 字典中要查找的键。
default -- 如果指定键的值不存在时，返回该默认值值。
```

**实例：**

```
# get ()方法的应用举例
dict = {'Name': 'Mary', 'Age': 20}

print ("Age 值为 : %s" %  dict.get('Age'))
print ("Name 值为 : %s" %  dict.get('Name'))
print ("Sex 值为 : %s" %  dict.get('Sex', "NA"))
```

**以上结果输出为：**

```
Age 值为 : 20
Name 值为 : Mary
Sex 值为 : NA
```

### 5.5 key in dict

如果键在字典dict里返回true，否则返回false

```
dict = {'Name': 'Mary', 'Age': 20,'Address':'BeiJing'}

# 检测键 Age 是否存在
if 'Age' in dict:
    print("键 Age 存在")
else:
    print("键 Age 不存在")

# 检测键 Sex 是否存在
if 'Sex' in dict:
    print("键 Sex 存在")
else:
    print("键 Sex 不存在")

# not in

# 检测键 Name 是否存在
if 'Name' not in dict:
    print("键 Name 不存在")
else:
    print("键 Name 存在")
```

**以上结果输出为：**

```
键 Age 存在
键 Sex 不存在
键 Name 存在
```

### 5.6 dict.items()

item() 方法以列表返回可遍历的(键, 值) 元组数组

```
dict = {'Name': 'Mary', 'Age': 17}
 
print ("Value : %s" %  dict.items())

# 输出结果为：
Value : dict_items([('Age', 17), ('Name', 'Mary')])
```
**可遍历的元组数组举例：**

```
dict1 = {'老大':'25岁',
        '老二':'20岁',
        '老三':'12岁',
        }
print(dict1.items())
for key,values in dict1.items():
    print(key + '已经' + values + '了')
```
**以上结果输出为：**
```
老大已经25岁了
老二已经20岁了
老三已经12岁了

Process finished with exit code 0
```

### 5.7 dict..keys()

返回一个迭代器，可以使用 list() 来转换为列表

**keys()方法语法：**

```
dict.keys()
```

**实例：**

```
dict = {'Name': 'Mary', 'Age': 17}

print(dict.keys())
```

**以上结果输出为：**

```
dict_keys(['Name', 'Age'])
```

由结果看出结果返回一个迭代对象，这时候我们可以使用 list 转换为列表：

```
list1 = list(dict.keys())
print ("转换后的结果为 : %s" % list1)

# 输出结果为一个列表，后续可以对其进行相应操作：
转换后的结果为 : ['Name', 'Age']
```

### 5.8 dict..setdefault(key, default=None)

Python 字典 setdefault() 方法和 get() 方法类似, 如果 key 在 字典中，返回对应的值。如果不在字典中，则插入 key 及设置的默认值 default，并返回 default ，default 默认值为 None。

**setdefault()方法语法：**

```
dict.setdefault(key, default=None)
# 参数
key -- 查找的键值。
default -- 键不存在时，设置的默认键值。
```

**实例：**

```
dict = {'Name': 'Mary', 'Age': 17}
 
print ("Age 键的值为 : %s" %  dict.setdefault('Age', None))
print ("Sex 键的值为 : %s" %  dict.setdefault('Sex', None))
print ("新字典为：", dict)
```

**以上结果输出为：**

```
Age 键的值为 : 17
Sex 键的值为 : None
新字典为： {'Age': 17, 'Name': 'Mary', 'Sex': None}
```

### 5.9 dict..update(dict2)

Python 字典 update() 函数把字典参数 dict2 的 key/value(键/值) 对更新到字典 dict 里。

**语法：**

```
dict.update(dict2)
# 参数
 dict2 -- 添加到指定字典dict里的字典。
```
**实例：**

```
dict = {'Name': 'Mary', 'Age': 17}
dict2 = {'Sex': 'female' }

# 将 dict2 中的结果添加到字典 dict 中　
dict.update(dict2)
print ("更新字典 dict : ", dict)
```

**以上结果输出为：**

```
更新字典 dict :  {'Name': 'Mary', 'Age': 17, 'Sex': 'female'}
```

### 5.10  dict.values()

Python 字典 values() 方法返回一个迭代器，可以使用 list() 来转换为列表，列表为字典中的所有值。

```
dict = { 'Name': 'Mary','Sex': 'male', 'Age': 7}

print("字典所有值为 : ", list(dict.values()))
```
**以上结果输出为：**

```
字典所有值为 :  ['Mary', 'male', 7]
```

### 5.11  dict.pop(key[,default])

Python 字典 pop() 方法删除字典给定键 key 所对应的值，返回值为被删除的值。key 值必须给出。 否则，返回 default 值。

**pop()方法语法：**

```
pop(key[,default])
#参数
key: 要删除的键值
default: 如果没有 key，返回 default 值

# 返回值
返回被删除的值。

```

**实例：**

```
dict = {'Name': 'Mary', 'Age': 17}

result = dict.pop('Age') # 删除

print(result)
```

**以上结果输出为：**

```
17

Process finished with exit code 0
```

### 5.12  dict.popitem()

Python 字典 popitem() 方法随机返回一个键值对(key,value)形式，按照 LIFO（Last In First Out 后进先出法） 顺序规则，即最末尾的键值对。
如果字典已经为空，却调用了此方法，就报出KeyError异常。

**实例：**

```
dict = {'Name': 'Mary', 'Age': 17}
pop_obj=dict.popitem()
print(pop_obj)
print(dict)
```

**以上结果输出为：**

```
('Age', 17)
{'Name': 'Mary'}
```

将字典清空：

```
dict = {'Name': 'Mary', 'Age': 17}
del dict

print(dict.popitem())
```

**结果输出为：**

```
Traceback (most recent call last):
  File "test.py", line 4, in <module>
    print(dict.popitem())
TypeError: descriptor 'popitem' of 'dict' object needs an argument
```

## 6、字典和列表

### 6.1 字典和列表差异

列表中的元素表项由于元素通过序列从 0 开始递增存放，所以列表中的表项是排序的，而字典的内容的表项是不排序的，如下例子就很好的说明列表和字典的区别：

```
list1 = ['zhangsan',23,'BeiJing']
list2 = ['BeiJing','zhangsan',23]
list1 == list2
False
dic1 = {'name':'zhangsan','age':23,'address':'BeiJing'}
dic2 = { 'age':23,'name':'zhangsan','address':'BeiJing'}
dic1 == dic2
True
```

由以上实例可以看出，当列表元素内容一致，顺序不同再对比内容时匹配不成功，同理字典值匹配成功，说明字典中元素内容不按顺序存放。

## 总结

本节给大家介绍了 Python 数据结构之字典的操作与使用，对 Python 工程师使用字典的一些基本知识提供了支撑。

> 示例代码：[Python-100-days-day011](https://github.com/JustDoPython/python-100-day/tree/master/day-011)

参考：

http://www.pythondoc.com/pythontutorial3
https://www.runoob.com/python3/python3-dictionary.html
