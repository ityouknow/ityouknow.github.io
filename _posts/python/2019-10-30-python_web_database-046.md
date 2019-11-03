---
layout: post
title:  第46天： Flask数据持久化
category: python
copyright: python
---

by 太阳雪

Web 应用离不开数据存储，今天就来学习下 Flask 中如何与数据库交互，最后我们将做一个提交的实例

<!--more-->

Flask 中最方便用的数据库框架是 flask_sqlalchamy，是对 SQLAlchamy 在 Flask 中的扩展， SQLAlchemy 是一个 Python 数据库工具（ORM，即对象关系映射）。

借助 SQLAlchemy，通过定义 Python 类来表示数据库里的一张表（类属性表示表中的字段 或者 列），通过对这个类进行各种操作来代替写 SQL 语句。这个类我们称之为模型类，类中的属性我们将称之为字段。

SQLAlchemy 支持多种数据库，对于不同的数据库只需要修改下配置链接就可以，在这里我们使用关系型数据库 SQLite 作为演示。

> SQLite 是基于文件的关系型数据库，不需要单独启动数据库服务器，适合在开发时使用，或是在数据库操作简单、访问量低的程序中使用。

## 安装 flask_sqlalchamy

```bash
pip install flask_sqlalchamy
```

安装之后，导入到项目中，对应用进行初始化:

```python
from flask import Flask
from flask_sqlalchamy import SQLAlchamy  # 导入 SQLAlachamy

app = Flask(__name__) # 创建 Flask 应用

db = SQLAlchamy(app) # 初始化应用
```

## 设置数据库连接 URI

数据库一般作为第三方应用，需要通过建立与数据库的连接，让应用可以是使用数据库。

常见的数据库有 MySql、SqlServer、Oracle、SQLite、MongoDB 等等，每种数据库都有自己特定的连接格式，我们使用的是简单的 SQLite 数据库，它的连接格式是:

```sql
sqlite:////数据库文件的绝对地址
```

> **注意:** 如果您使用 Windows 系统，上面的 URI 前缀部分需要写入三个斜线 (即 sqlite:///)

在例子中，将数据库文件路径设置为当前应用的根目录下：

```python
import os
# ...
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////' + os.path.join(app.root_path, 'data.db')
```

> **注意:** 为了设置 Flask、扩展或是我们程序本身的一些行为，需要设置和定义一些配置变量。Flask 提供了一个统一的接口来写入和获取这些配置变量：Flask.config 字典。配置变量的名称必须使用大写，写入配置的语句一般会放到扩展类实例化语句之前。 app.config 是一种简便的 Flask 应用的配置方式

## 模型

模型简单来说就是数据库中的一张表定义，需要有名称，字段，在 Python 中用一个类来表示，由于需要和数据库的表对应，模型必须继承自 SQLAlchamy 的 Model 类

在初始化应用中，我们得到一个 SQLAlchamy 的实例 db，定义模型都是继承自实例的 Model 类的

下面定义一个 Profile 模型，用来记录一个用户的基本信息:

```python
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True) # 主键
    name = db.Column(db.String(20))
    birthday = db.Column(db.Date())
    createtime = db.Column(db.DateTime())
    about = db.Column(db.Text())
```

- 模型中的属性，都是有 Column 类的一个实例，传入的参数为字段的类型，下面的表格列出了常用的字段类
- 在 db.Column() 中添加额外的选项（参数）可以对字段进行设置。比如，primary_key 设置当前字段是否为主键。除此之外，常用的选项还有 nullable（布尔值，是否允许为空值）、index（布尔值，是否设置索引）、unique（布尔值，是否允许重复值）、default（设置默认值）等
- 当一个列被设置为主键，默认主键值是自增长的

常用的字段类型如下表所示：

|字段类型|说明|
|---|---|
|db.Integer|整数|
|db.String(size)|字符串 size 为字符串长度|
|db.DateTime|日期时间|
|db.Date|日期|
|db.Text|长文本，可以存放 CLOB (二进制数据)|
|db.Float|浮点数字|
|db.Boolean|布尔值|

## 创建库表

定义好数据模型之后，可以用模型来创建数据库表，即用模型来管理库表的创建。

> 如果已经有了数据，可以通过 `sqlacodegen` 或者 `Flask-SQLAcodegen` 工具来由数据库中库表定义创建 SQLAlchamy 模型

使用 `db.create_all()` 可以将应用中的模型，创建成数据库中的表，库表名为模型名称的小写形式。可以通过 `__tablename__` 模型类属性类指定库表名称

一般库表是在初始化应用时创建，所以没必要将创建语句写在应用中，可以在库表定义发生变化是单独使用 `Flask-Shell` 工具与数据库同步一次模型定义

在命令行下，将目录切换到当前项目根目录执行:

```bash
$ flask shell
>>> from app import db # app 对应的是应用主代码文件名，如app.py
>>> db.create_all()
```

执行完成，就会在在项目根目录下创建一个 data.db 文件，这个文件是配置中设置的 SQLite 数据库文件

如果变更了模型定义，可以先调用 `db.drop_all()` 来删除数据库中表的定义，注意 **`db.drop_all()` 删除数据库中表的同时，也会删除数据**。

如果需要保留数据，可以使用使用数据库迁移工具，比如集成了 `Alembic` 的 `Flask-Migrate` 扩展工具

> Flask Shell 打开的 Python Shell 环境并不等于 用 python 打开的环境，Flask Shell 会将当前目录下的应用作为环境上下文，所以在执行 Flask Shell 时需要将命令行当前目录切换到项目所在的目录下。
> 项目目录下，应用主代码文件应该命名为 `app.py` 或者 `wsgi.py`

## 增删改查

为了方便说明数据库的使用，我们还在上面的用 Flask Shell 打开的 Python Shell 环境下执行代码

### 新增

向数据库中新增记录

```python
from app import Profile # Profile 是在应用中定义的模型
from app import db
import datetime

# 创建一个 Profile 实例
profile = Profile()
profile.name = "Tiger"
# Date 和 DateTime 类型属性，必须接受 Python datetime 对象
profile.birthday = datetime.datetime(2001, 10, 1)
profile.createtime = datetime.datetime.now()
profile.about = 'My name is Tiger, come from Beijing China.'

db.session.add(profile)  # 将变化添加
db.session.commit() # 将变化提交
```

- 在 Flash Shell 环境中，先引入 Profile 模型类，然后引入数据库的实例 db，由于有些字段是日期类型，还需要引入 datetime 模块
- 创建一个 Profile 实例 profile，设置属性值
- 将实例 profile 键入到会话中
- 提交会话，在数据库表 profile 中新增一条记录

`session` 是一个与数据库通信的会话，是 SQLAlchamy 框架与数据库交互的代理，如果要放弃某次变化，可以调用 `session.rollback()` 回滚掉未提交的变化，这个和数据库的事务很相似，但和数据库的事务没有关系

### 查询

可以通过对模型类的 `query` 属性调用可选的过滤方法和查询方法，获取到对应的单个或多个记录（记录以模型类实例的形式表示）。查询语句的格式如下：

```code
<模型类>.query.<过滤方法（可选）>.<查询方法>
```

例如:

```python
# ... 忽略引入相关代码
profile = Profile.query.first()  # 查询出 profile 表中第一条记录

profile.name  # Tiger
profile.birthday # 2001-10-01 00:00:00
profile.about  # My name is Tiger, come from Beijing China.
profiles = Profile.query.all()  # 查询出所有记录，返回 Profile 实例列表
profile_count = Profile.query.count()  # 记录条数
profile = Profile.query.get(1)  # 获取主键为 1 的记录
profile = Profile.filter_by(name='Tiger').first()  # 查询 name 等于 Tiger 的记录集中第一条记录
profiles = Profile.filter(Profile.name != 'Tiger').all()  # 查询 name 不等于 Tiger 的所有记录
```

- 常用的过滤方法:

|方法名称|说明|
|--|--|
|filter()|使用指定的规则过滤记录，返回新产生的查询对象|
|filter_by()|使用指定规则过滤记录（以关键字表达式的形式），返回新产生的查询对象|
|order_by()|根据指定条件对记录进行排序，返回新产生的查询对象|
|group_by()|根据指定条件对记录进行分组，返回新产生的查询对象|

- 常用的查询方法:

|方法名称|说明|
|--|--|
|all()|返回包含所有查询记录的列表|
|first()|返回查询的第一条记录，如果未找到，则返回None|
|get(id)|传入主键值作为参数，返回指定主键值的记录，如果未找到，则返回None|
|count()|返回查询结果的数量|
|first_or_404()|返回查询的第一条记录，如果未找到，则返回404错误响应|
|get_or_404(id)|传入主键值作为参数，返回指定主键值的记录，如果未找到，则返回404错误响应|
|paginate()|返回一个Pagination对象，可以对记录进行分页处理|

### 更新

首先将记录查询出来，然后对其进行修改，之后调用 `db.session.commit()` 提交变更，注意这里不再需要调用 `db.session.add()` 了:

```python
profile = Profile.query.get(1)  # 查询出ID为 1 的记录
profile.about = profile.about + ' I like coding~'  # 在简介中添加些内容
db.session.commit()  # 必须调用提交，否则将不会被更新到数据库
```

### 删除

也需要将记录查询出来，调用 `db.seeeion.delete()`，最后提交

```python
profile = Profile.query.get(1)  # 查询出ID为 1 的记录
db.session.delete(profile)  # 删除记录
db.session.commit()  # 提交变更
```

如果要批量删除，需要遍历结果集用上面方法逐个删除，也可以使用 query 属性或者 filter 的结果进行删除：

```python
Profile.query.filter(Profile.name == 'Tom').delete()  # 按照过滤条件来删除
Profile.query.delete()  # 删除所有记录
db.seesion.commit()  # 提交变更
```

## 业务中的处理数据

了解了数据库的基本操作之后，就可以在业务逻辑中编写数据库处理代码了

定义一个视图函数，将根据查询参数来找到对应的 Profile 记录，并且将该送给显示模板

```python
@app.route('/myprofile/<id>/')
def myprofile(id):
    profile = Profile.query.get(id)  # 利用参数 id 读取数据库记录
    return render_template('profile.html', profile=profile)  # 将结果送给模板做展示
```

模板代码 `profile.html`：

<% raw %>

```html
<h1>{{ profile.name }}'s Info </h1>
<dt>Name:</dt>
<dd>{{ profile.name }}</dd>
<dt>Birthday:</dt>
<dd>{{ profile.birthday }}</dd>
<dt>About:</dt>
<dd>{{ profile.about }} </dd>
```

<% endraw %>

启动应用后，访问 `localhost:5000/myprofile/1` 就可以看到 ID 为 1 的 Profile 信息。

结合前面讲述的 Form 知识，在视图函数中处理表单中提交的内容，并保存的数据库，下面是视图函数:

```python
@app.route('/createprofile/', methods=('GET', 'POST'))
def createprofile():
    form = MyForm()
    if form.validate_on_submit():  # 如果表单提交了 用表单数据创建 Profile 对象
        profile = Profile()
        profile.name = form.name.data
        profile.birthday = form.birthday.data
        profile.about = form.about.data or ""

        db.session.add(profile)
        db.session.commit()
        return redirect(url_for('myprofile', id=profile.id))  # 跳转到展示页面
    else:
        return render_template('createprofile.html', form=form)  # 显示创建页面
```

当判断表单被提交后，用提交数据创建 Profile 对象，存储到数据库，并且跳转到展示页面。

## 总结

本节课程简单介绍了 Flask 中数据库技术，主要是借助 Flask-SQLAlchamy 框架来操作数据库，以 SQLite 关系数据库为例讲解了数据的增删改查操作，最后展示了如何在视图函数中操作数据，以便与 Flask 应用相结合。

> 示例代码：[Python-100-days-day046](https://github.com/JustDoPython/python-100-day/tree/master/day-046)

参考

- [https://docs.sqlalchemy.org/en/13/core/sqlelement.html](https://docs.sqlalchemy.org/en/13/core/sqlelement.html#sqlalchemy.sql.operators.ColumnOperators)
- [https://read.helloflask.com/c5-database](https://read.helloflask.com/c5-database)
- [https://greyli.com/generate-flask-sqlalchemy-model-class-for-exist-database/](https://greyli.com/generate-flask-sqlalchemy-model-class-for-exist-database/)
- [https://www.cnblogs.com/shengulong/p/6639581.html](https://www.cnblogs.com/shengulong/p/6639581.html)
