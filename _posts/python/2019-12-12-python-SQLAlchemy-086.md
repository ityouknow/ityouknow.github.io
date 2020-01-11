---
layout: post
title:  第86天：Python SQLAlchemy
category: python
copyright: python
---

by 程序员野客

## 1 简介

SQLAlchemy 是一个使用 Python 实现的 ORM 框架，它的设计理念是：SQL 数据库的量级和性能比对象集合重要，对象集合的抽象比表和行重要；它采用了类似于 Java 里 Hibernate 的数据映射模型；它的目标是提供能兼容众多数据库（如：SQLite、MySQL、Postgres、Oracle、MS-SQL、SQLServer 和 Firebird）的企业级持久性模型。

<!--more-->

上面提到了 ORM，那 ORM 是什么？ORM 全称 Object Relational Mapping，中文译为对象关系映射，简单的说就是在数据库与业务实体对象之间建立了一种对应关系，我们可以用操作实体对象的方式来完成数据库的操作，ORM 封装了数据库操作，我们无需关心底层数据库是什么，也不用关心 SQL 语言，只需与数据对象交互即可。

## 2 使用

SQLAlchemy 可以支持多种数据库，本文我们以 SQLite 例，其他数据库也会做一些简单介绍。

### 2.1 安装

在使用 SQLAlchemy 之前，我们首先要进行安装，使用 pip install sqlalchemy 即可。安装好后看一下版本，如下所示：

```
>>> import sqlalchemy
>>> sqlalchemy.__version__
'1.3.11'
```

### 2.2 创建连接

具体操作之前先看一下 SQLAlchemy Engine（引擎），如图所示：

![](/assets/images/2019/sqlalchemy/engine.png)


SQLAlchemy 通过 Engine 来驱动，从图中可以看出 Engine 内维护了一个连接池（Pool）和方言（Dialect），Pool 就是用来存放连接的，Dialect 是用来判断要连接的是哪种数据库，我们创建连接要先创建 Engine，然后再通过 Engine 来创建连接。

#### 2.2.1 SQLite

我们先来看一下如何创建 Engine，几种创建方式如下所示：

相对路径方式

```
engine = create_engine('sqlite:///foo.db')
```

绝对路径方式

```
# Unix/Mac
engine = create_engine('sqlite:////absolute/path/to/foo.db')

# Windows
engine = create_engine('sqlite:///C:\\path\\to\\foo.db')

# Windows 另一种写法
engine = create_engine(r'sqlite:///C:\path\to\foo.db')
```

创建内存数据库

SQLite 可以创建内存数据库，其他数据库不可以。

```
engine = create_engine('sqlite://')
```

以相对路径方式为例，看一下实现示例：

```
from sqlalchemy import create_engine

# 创建 Engine
engine = create_engine('sqlite:///foo.db', echo=True)
# 创建连接
conn = engine.connect()
```

echo=True 会将执行语句打印出来，默认为 False；数据库（foo.db）不存在会自动创建。

#### 2.2.2 其他数据库

##### MySQL

在使用之前要进行第三库的安装，使用 pip install mysqlclient 和 pip install pymysql 即可。

创建 Engine 方式如下所示：

```
# default
engine = create_engine('mysql://scott:tiger@localhost/foo')

# mysqlclient
engine = create_engine('mysql+mysqldb://scott:tiger@localhost/foo')

# PyMySQL
engine = create_engine('mysql+pymysql://scott:tiger@localhost/foo')
```

使用示例如下所示：

```
from sqlalchemy import create_engine

engine = create_engine('mysql://root:root@localhost:3306/mysql',
                       echo=True,
                       pool_size=10,
                       pool_recycle=3600)
conn = engine.connect()
```

参数说明如下所示：

* echo：值为 True 将执行语句打印出来，默认为 False。

* pool_size：连接池的大小，默认为 5，0 表示连接数无限制。

* pool_recycle：设置了 pool_recycle 后，SQLAlchemy 会在指定时间内回收连接，单位为秒。

##### Oracle

创建 Engine 方式如下所示：

```
engine = create_engine('oracle://scott:tiger@127.0.0.1:1521/sidname')

engine = create_engine('oracle+cx_oracle://scott:tiger@tnsname')
```

##### PostgreSQL

创建 Engine 方式如下所示：

```
# default
engine = create_engine('postgresql://scott:tiger@localhost/mydatabase')

# psycopg2
engine = create_engine('postgresql+psycopg2://scott:tiger@localhost/mydatabase')

# pg8000
engine = create_engine('postgresql+pg8000://scott:tiger@localhost/mydatabase')
```

##### SQL Server

创建 Engine 方式如下所示：

```
# pyodbc
engine = create_engine('mssql+pyodbc://scott:tiger@mydsn')

# pymssql
engine = create_engine('mssql+pymssql://scott:tiger@hostname:port/dbname')
```

### 2.3 创建表

表的创建通过映射类的方式实现，首先创建映射基类，后面的类需要继承它，如下所示：

```
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
```

创建具体映射类，如下所示：

```
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

engine = create_engine('sqlite:///foo.db', echo=True)
# 映射基类
Base = declarative_base()
# 具体映射类
class SysUser(Base):
    # 指定映射表名
    __tablename__ = 'sys_user'

    # id 设置为主键
    id = Column(Integer, primary_key=True)
    # 指定 name 映射到 name 字段
    name = Column(String(30))
    password = Column(String(32))

# 创建表
Base.metadata.create_all(engine)
```

执行完成后表就自动为我们创建好了，我们通过 SQLiteStudio 查看一下，结果如图所示：

![](/assets/images/2019/sqlalchemy/utable.png)

### 2.4 建立会话

具体的操作需要使用 session，创建方式如下所示：

```
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///foo.db', echo=True)
Session = sessionmaker(bind=engine)
# 创建 Session 类实例
session = Session()
```

### 2.5 基本操作

#### 2.5.1 新增

我们先新增一条数据，如下所示：

```
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///foo.db', echo=True)
# 映射基类
Base = declarative_base()
# 具体映射类
class SysUser(Base):
    # 指定映射表名
    __tablename__ = 'sys_user'

    # id 设置为主键
    id = Column(Integer, primary_key=True)
    # 指定 name 映射到 name 字段
    name = Column(String(30))
    password = Column(String(32))
Session = sessionmaker(bind=engine)
# 创建 Session 类实例
session = Session()
# 新增
su = SysUser(id=1, name='Jhon', password='123456')
# 保存
session.add(su)
# 提交
session.commit()
# 关闭
session.close()
```

#### 2.5.2 查询

查询操作如下所示：

```
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///foo.db', echo=True)
# 映射基类
Base = declarative_base()
# 具体映射类
class SysUser(Base):
    # 指定映射表名
    __tablename__ = 'sys_user'

    # id 设置为主键
    id = Column(Integer, primary_key=True)
    # 指定 name 映射到 name 字段
    name = Column(String(30))
    password = Column(String(32))
Session = sessionmaker(bind=engine)
# 创建 Session 类实例
session = Session()
# 查询一条数据，filter 相当于 where 条件
u = session.query(SysUser).filter(SysUser.id==1).one()
# 查询所有数据
# session.query(SysUser).filter(SysUser.id==1).all()
print('name-->', u.name)
```

#### 2.5.3 修改

我们将 id=1 这条数据的 name 修改一下，如下所示：

```
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///foo.db', echo=True)
# 映射基类
Base = declarative_base()
# 具体映射类
class SysUser(Base):
    # 指定映射表名
    __tablename__ = 'sys_user'

    # id 设置为主键
    id = Column(Integer, primary_key=True)
    # 指定 name 映射到 name 字段
    name = Column(String(30))
    password = Column(String(32))
Session = sessionmaker(bind=engine)
# 创建 Session 类实例
session = Session()
u = session.query(SysUser).filter(SysUser.id==1).one()
print('修改前名字-->', u.name)
u.name = 'James'
session.commit()
print('修改后名字-->', u.name)
```

#### 2.5.4 删除

我们将 id=1 这条数据删除，如下所示：

```
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///foo.db', echo=True)
# 映射基类
Base = declarative_base()
# 具体映射类
class SysUser(Base):
    # 指定映射表名
    __tablename__ = 'sys_user'

    # id 设置为主键
    id = Column(Integer, primary_key=True)
    # 指定 name 映射到 name 字段
    name = Column(String(30))
    password = Column(String(32))
Session = sessionmaker(bind=engine)
# 创建 Session 类实例
session = Session()
u = session.query(SysUser).filter(SysUser.id==1).one()
session.delete(u)
session.commit()
```

## 总结

本文介绍了 SQLAlchemy 的基本概念和使用，对 Python 工程师使用 SQLAlchemy 提供了支撑。

## 参考：

[https://docs.sqlalchemy.org/en/13/orm/tutorial.html](https://docs.sqlalchemy.org/en/13/orm/tutorial.html)

> 示例代码：[Python-100-days-day086](https://github.com/JustDoPython/python-100-day/tree/master/day-086)


