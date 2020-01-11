---
layout: post
title:  第78天： Python 操作 MongoDB 数据库介绍
category: python
copyright: python
---

by 極光

MongoDB 是一款面向文档型的 `NoSQL` 数据库，是一个基于分布式文件存储的开源的非关系型数据库系统，其内容是以 `K/V` 形式存储，结构不固定，它的字段值可以包含其他文档、数组和文档数组等。其采用的 `BSON`（二进制 JSON ）的数据结构，可以提高存储和扫描效率，但空间开销会有些大。今天就为大家简单介绍下在 Python 中使用 MongoDB 。

<!--more-->

## 安装 PyMongo 库

在 Python 中操作 MongoDB ，需要使用 `PyMongo` 库，执行如下命令安装：

```shell
pip3 install pymongo
```

## 连接 MongoDB 数据库

连接时需要使用 PyMongo 库里面的 MongoClient 模块，有两种方式可以创建连接，默认只需要传入IP和端口号即可。如果数据库存在账号密码，则需要指定连接的数据库，并进行鉴权才能连接成功。

```python
#导入 MongoClient 模块
from pymongo import MongoClient, ASCENDING, DESCENDING

# 两种方式
#1. 传入数据库IP和端口号
mc = MongoClient('127.0.0.1', 27017)

#2. 直接传入连接字串
mc = MongoClient('mongodb://127.0.0.1:27017')

# 有密码的连接
# 首先指定连接testdb数据库
db = mc.testdb

# 通过authenticate方法认证账号密码
db.authenticate('username','password')

# 检查是否连接成功，输出以下结果表示连接成功
print(mc.server_info())
# {'version': '4.2.1', 'gitVersion': 'edf6d45851c0b9ee15548f0f847df141764a317e', 'modules': [], 'allocator': 'tcmalloc', 'javascriptEngine': 'mozjs', 'sysInfo': 'deprecated', 'versionArray': [4, 2, 1, 0], 'openssl': {'running': 'OpenSSL 1.1.1  11 Sep 2018', 'compiled': 'OpenSSL 1.1.1  11 Sep 2018'},  ……省略 ,  'ok': 1.0}
```

## MongoDB 数据库操作

成功连接数据库，接下来我们开始介绍通过 MongoClient 模块如何对 mongoDB 数据库进行 `CURD` 的操作。

### 获取数据库和集合

首先要指定需要操作的数据库和集合，这里的数据库可以对应为 `Mysql` 的 `DataBase`，集合对应为 `Mysql` 的 `Table`。需要注意的是在 mongoDB 中，不需要提前创建数据库和集合，在你操作它们时如果没有则会自动创建，但都是延时创建的，在添加 `Document` 时才会真正创建。

```python
# 指定操作数据库的两种方式
#1. 获取 testdb 数据库，没有则自动创建
db = mc.testdb

#2. 效果与上面 db = mc.testdb 相同
db = mc['testdb']

# 打印出testdb数据库下所有集合(表)
print(db.collection_names())


# 指定操作集合的两种方式
#1. 获取 test 集合，没有则自动创建
collection = db.test

#2. 效果与 collection = db.test 相同
collection = db['test']

# 打印集合中一行数据
print(collection.find_one())
```

### 数据的插入操作

在 MongoDB 中，每条数据其实都有一个 `_id` 属性作为唯一标识。如果没有显式指明该属性，MongoDB 会自动产生一个 `ObjectId` 类型的 `_id` 属性，`insert()` 方法会在执行后返回 `_id` 值。不过在 PyMongo 3.x 版本中，官方已经不推荐使用 `insert()` 方法，而是推荐使用`insert_one()` 和 `insert_many()` 方法来分别插入单条记录和多条记录。

```python
# 要插入到集合中的对象
book = {
      'name' : 'Python基础',
      'author' : '张三',
      'page' : 80
}

# 向集合中插入一条记录
collection.insert_one(book)
# 返回结果：{'_id': ObjectId('5de4c7b90ae08431839ac2a7'), 'name': 'Python基础', 'author': '张三', 'page': 80}

# 对于insert_many()方法，我们可以将数据以列表形式传递参数
book1 = {
      'name' : 'Java基础',
      'author' : '李白',
      'page' : 100
}
book2 = {
      'name' : 'Java虚拟机',
      'author' : '王五',
      'page' : 100
}

# 创建 book_list 列表
book_list = [book1, book2]

# 向集合中插入多条记录
collection.insert_many(book_list)
# 返回结果： <pymongo.results.InsertManyResult object at 0x7f80a39fa408>
```

### 数据的查询操作

查询需要使用 `find_one()` 或 `find()` 方法，其中 `find_one()` 查询得到的是单个结果，即一条记录，`find()` 则返回一个生成器对象。下面我们就来查询上面刚插入的数据，如果查询不到数据则返回 `None` ，代码如下：

```python
# 通过条件查询一条记录，如果不存在则返回None
res = collection.find_one({'author': '张三'})
print (res)
# 打印结果：{'_id': ObjectId('5de4c7b90ae08431839ac2a7'), 'name': 'Python基础', 'author': '张三', 'page': 80}

# 通过条件查询多条记录，如果不存在则返回None
res = collection.find({'page': 100})
print (res)
#打印结果：<pymongo.cursor.Cursor object at 0x7f80a39daa58>

# 使用 find() 查询会返回一个对象
# 遍历对象，并打印查询结果
for r in res:
   print(r)
#打印结果：
# {'_id': ObjectId('5de4c8ae0ae08431839ac2a8'), 'name': 'Java基础', 'author': '李白', 'page': 100}
# {'_id': ObjectId('5de4c8ae0ae08431839ac2a9'), 'name': 'Java虚拟机', 'author': '王五', 'page': 100}

# 查询page大于50的记录
res = collection.find({'page': {'$gt': 50}})
# 通过遍历返回对象，结果如下：
# {'_id': ObjectId('5de4c7b90ae08431839ac2a7'), 'name': 'Python基础', 'author': '张三', 'page': 80}
# {'_id': ObjectId('5de4c8ae0ae08431839ac2a8'), 'name': 'Java基础', 'author': '李白', 'page': 100}
# {'_id': ObjectId('5de4c8ae0ae08431839ac2a9'), 'name': 'Java虚拟机', 'author': '王五', 'page': 100}
```

上面查询条件中我们用到了 `$gt` 的比较运算符，关于查询条件中的比较运算符和功能运算符对照表如下：

|符号 | 含义 | 举例  |
|:------:|:-----:| :-----|
|$gt | 大于| {'page': {'$gt': 50} |
|$lt  | 小于 |  |
|$lte  | 小于等于  |  |
|$gte | 大于等于  |   |
|$ne   | 不等于  |  |
|$in    | 在范围内  | {'page': {'$in': [50, 100]}}  |
|$nin  | 不在范围内  | {'page': {'$nin': [50, 100]}}  |
|$regex | 匹配正则表达式 | {'name': {'$regex': '^张.*'}} |
|$exists | 属性是否存在 | {'name': {'$exists': True}} |
|$type  | 类型判断 |  {'name': {'$type': 'string'}}  |
|$mod  | 数字模操作 | {'page': {'$mod': [80, 10]}} |
|$text   | 文本查询    | {'\$text': {'$search': 'Java'}} |
|$where | 高级条件查询 | {'$where': 'obj. author == obj. full_name'}|

### 数据的更新操作

更新操作和插入操作类似，`PyMongo` 提供了两种更新方法，即 `update_one()` 和 `update_many()` 方法，其中 `update_one()` 方法只会更新满足条件的第一条记录。

> 注意：
> - 如果使用 $set，则只更新 book 对象内存在的字段，如果更新前还有其他字段，则不更新也不删除。
> - 如果不使用 $set，则会把更新前的数据全部用 book 对象替换，如果原本存在其他字段则会被删除。

```python
# 查询一条记录
book = collection.find_one({'author': '张三'})
book['page'] = 90

# 更新满足条件{'author', '张三'}的第一条记录
res = collection.update_one({'author': '张三'}, {'$set': book})

# 更新返回结果是一个对象，我们可以调用matched_count和modified_count属性分别获得匹配的数据条数和影响的数据条数。
print(res.matched_count, res.modified_count)
#打印结果：1 1

# 更新满足条件 page>90 的所有记录，page 字段自加 10
res = collection.update_many({'page': {'$gt': 90}}, {'$inc': {'page': 10}})

# 打印更新匹配和影响的记录数
print(res.matched_count, res.modified_count)
#打印结果：2 2

book3 = {'name':'Python高级', 'author':'赵飞', 'page': 50}

#upsert=True表示如果没有满足更新条件的记录，则会将book3插入集合中
res = collection.update_one({'author': '赵飞'}, {'$set': book3}, upsert=True)
print(res.matched_count, res.modified_count)
#打印结果：0 0

# 查询所有记录，并遍历打印出来
res = collection.find()
for r in res:
   print(r)
#打印结果：
# {'_id': ObjectId('5de4c7b90ae08431839ac2a7'), 'name': 'Python基础', 'author': '张三', 'page': 90}
# {'_id': ObjectId('5de4c8ae0ae08431839ac2a8'), 'name': 'Java基础', 'author': '李白', 'page': 110}
# {'_id': ObjectId('5de4c8ae0ae08431839ac2a9'), 'name': 'Java虚拟机', 'author': '王五', 'page': 110}
# {'_id': ObjectId('5de4d76f71aa089d58170a92'), 'author': '赵飞', 'name': 'Python高级', 'page': 50}
```

### 集合的删除操作

删除数据同样推荐使用两个方法 `delete_one()` 和 `delete_many()` ，其中 `delete_one()` 为删除第一条符合条件的记录。具体操作代码如下：

```python
# 删除满足条件的第一条记录
result = collection.delete_one({'author': '张三'})
# 同样可以通过返回对象的 deleted_count 属性查询删除的记录数
print(result.deleted_count)
# 打印结果：1

# 删除满足条件的所有记录，以下为删除 page < 90 的记录
result = collection.delete_many({'page': {'$lt': 90}})
print(result.deleted_count)
# 打印结果：1
```

### 其他数据库操作

除了以上标准的数据库操作外，`PyMongo` 还提供了以下通用且方便的操作方法，比如 `limit()` 方法用来读取指定数量的数据
 `skip()` 方法用来跳过指定数量的数据等，具体请看如下代码：

```python
# 查询返回满足条件的记录然后删除
result = collection.find_one_and_delete({'author': '王五'})  
print(result)
# 打印结果：{'_id': ObjectId('5de4c8ae0ae08431839ac2a9'), 'name': 'Java虚拟机', 'author': '王五', 'page': 110}

# 统计查询结果个数
# 全部结果个数
collection.find().count()
# 返回结果：1

# 满足条件结果个数
collection.find({'page': 100}).count()
# 返回结果：0

# 查询结果按字段排序
# 升序
results = collection.find().sort('page', ASCENDING)

# 降序
results = collection.find().sort('page', DESCENDING)

# 下面查询结果是按page升序排序，只返回第二条记录及以后的两条结果
results = collection.find().sort('page', ASCENDING).skip(1).limit(2)
print(results)
```

> 注意：在数据量在在千万、亿级别庞大的时候，查询时最好 `skip()` 的值不要太大，这样很可能导致内存溢出。

### 数据索引操作

默认情况下，数据插入时已经有一个 `_id` 索引了，当然我们还可以创建自定义索引。

```py
# unique=True时，创建一个唯一索引，索引字段插入相同值时会自动报错，默认为False
collection.create_index('page', unique= True)
# 打印结果：'page_1'

# 打印出已创建的索引
print(collection.index_information())
# 返回结果：{'_id_': {'v': 2, 'key': [('_id', 1)], 'ns': 'testdb.test'}, 'page_1': {'v': 2, 'unique': True, 'key': [('page', 1)], 'ns': 'testdb.test'}}

# 删除索引
collection.drop_index('page_1')

#删除集合
collection.drop()
```

## 总结

本文为大家介绍了 Python 中如何创建连接 MongoDB 数据库，并通过代码的方式展示了对 MongoDB 数据的增删改查以及排序索引等操作，通过以上学习个人感觉操作起来还是比较简单方便的。今天就先介绍到这里，以后还会为大家介绍其他数据库的操作。

## 参考

PyMongo 文档：https://pymongo.readthedocs.io/en/stable/

> 示例代码：https://github.com/JustDoPython/python-100-day
