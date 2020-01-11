---
layout: post
title:  第77天：Python 操作 SQLite
category: python
copyright: python
---

by 程序员野客

## 1 简介

SQLite 是一种轻型嵌入式关系型数据库，它包含在一个相对小的 C 库中。SQLite 占用资源低，处理速度快，它支持 Windows、Linux、Unix 等多种主流操作系统，支持 Python、Java、C# 等多种语言，目前的版本已经发展到了 SQLite3。

<!--more-->

SQLite 是一个进程内的库，它实现了自给自足、无服务器、无需配置、支持事务。Python 可以通过 sqlite3 模块与 SQLite3 集成，Python 2.5.x 以上版本内置了 sqlite3 模块，因此，我们在 Python 中可以直接使用 SQLite。 

## 2 SQLite 数据类型

在介绍使用之前，我们先了解下 SQLite 数据类型。SQLite 采用动态数据类型，也就是说数据的类型取决于数据本身。

### 2.1 存储类型

存储类型就是数据保存成文件后的表现形式，存储类型有 5 种，如下所示：

| 类型              | 描述                       |
| ----------------- |:--------------------------:|
| NULL              | 空值 						 |
| INTEGER       	| 有符号的整数类型   		 |
| REAL     			| 浮点数类型     			 |
| TEXT   			| 字符串，使用数据库编码（UTF-8、UTF-16BE 或 UTF-16LE）存储|
| BLOB   			| 二进制表示 			 	 |

### 2.2 亲和类型

亲和类型简单来说就是数据表列的数据对应存储类型的倾向性，当数据插入时，字段的数据将会优先采用亲缘类型作为值的存储方式，同样有 5 种，如下所示：

| 类型              | 描述                       |
| ----------------- |:--------------------------:|
| NONE              | 不做任何转换，直接以该数据所属的数据类型进行存储|
| NUMERIC       	| 该列可以包含使用所有五个存储类型的值   		 	|
| INTEGER     		| 类似于 NUMERIC，区别是在执行 CAST 表达式时    	|
| TEXT   			| 该列使用存储类型 NULL、TEXT 或 BLOB 存储数据		|
| REAL   			| 类似于 NUMERIC，区别是它会强制把整数值转换为浮点类型|

### 2.3 声明类型

声明类型也就是我们写 SQL 时字段定义的类型，我们看一下常用的声明类型与亲和类型的对应关系。

| 声明类型          | 亲和类型                   |
| ----------------- |:--------------------------:|
| INT/INTEGER/TINYINT/BIGINT   | INTEGER		 |
| VARCHAR/TEXT/CLOB       	   | TEXT   		 |
| BLOB     					   | NONE    	 	 |
| DOUBLE/FLOAT   			   | REAL			 |
| DECIMAL/BOOLEAN/DATE/DATETIME| NUMERIC		 |

## 3 SQLite 常用函数

SQLite 提供了一些内置函数，也就是我们可以直接使用的函数，下面来看一下。

| 函数          	| 描述                   	 |
| ----------------- |:--------------------------:|
|COUNT  			| 计算一个数据库表中的行数	 |
|MAX  				| 某列的最大值 		 		 |
|MIN  				| 某列的最小值		 		 |
|AVG  				| 某列的平均值		 		 |
|SUM  				| 某列的和		 			 |
|RANDOM  			| 返回一个介于 -9223372036854775808 和 +9223372036854775807 之间的随机整数|
|ABS  				| 返回数值参数的绝对值		 |
|UPPER  			| 把字符串转换为大写字母 	 |
|LOWER   			| 把字符串转换为小写字母 	 |
|LENGTH   			| 返回字符串的长度		 	 |
|sqlite_version   	| 返回 SQLite 库的版本		 |  

使用示例如下所示：

```
SELECT COUNT(*) FROM table;
SELECT MAX/MIN/AVG/SUM/ABS/UPPER/LOWER/LENGTH(col) FROM table;
SELECT random() AS Random;
SELECT sqlite_version() AS 'SQLite Version';
```

## 4 基本使用

### 4.1 连接数据库

```
# 导入模块
import sqlite3
# 连接数据库
conn = sqlite3.connect('test.db')
```

如果数据库不存在，则会自动被创建。

### 4.2 游标

连接数据库后，我们需要使用游标进行相应 SQL 操作，游标创建如下所示：

```
# 创建游标
cs = conn.cursor()
```

### 4.3 创建表

我们在 test.db 库中新建一张表 student，如下所示：

```
# 创建表
cs.execute('''CREATE TABLE student
       (id varchar(20) PRIMARY KEY,
        name varchar(20));''')
# 关闭 Cursor
cs.close()
# 提交当前事务
conn.commit()
# 关闭连接
conn.close()
```

表创建好后，我们可以使用图形化工具 SQLiteStudio 直观的查看一下，官方下载地址： [https://sqlitestudio.pl/index.rvt?act=download]( https://sqlitestudio.pl/index.rvt?act=download )，打开如图所示：

![](http://www.justdopython.com/assets/images/2019/sqlite/sqlitestudio1.PNG)

以 Windows 系统为例，选择免安装版 portable 进行下载，下载好后解压文件，直接运行文件夹中的 SQLiteStudio.exe 即可，打开后如图所示：

![](http://www.justdopython.com/assets/images/2019/sqlite/sqlitestudio2.PNG) 

我们先点击上方工具栏上的 Database 按钮，然后选 Add a database，如图所示：

![](http://www.justdopython.com/assets/images/2019/sqlite/sqlitestudio3.PNG) 

接着点击文件下方右侧的绿色加号按钮或文件夹按钮，选择数据库文件，比如我们选择 test.db 文件，选好了后点击测试连接，如果能够正常连接，我们就点击 OK 按钮添加数据库。

添加完数据库后，再点击 SQLiteStudio 主界面上方工具栏中 View 按钮，接着选数据库，结果如图所示：

![](http://www.justdopython.com/assets/images/2019/sqlite/sqlitestudio4.PNG) 

接着双击 test 库，结果如图所示：

![](http://www.justdopython.com/assets/images/2019/sqlite/sqlitestudio5.PNG) 

此时已经看到 student 表了，双击 student 表，我们还可以查看表的更多信息，如图所示：

![](http://www.justdopython.com/assets/images/2019/sqlite/sqlitestudio6.PNG) 

### 4.4 新增

我们向 student 表中插入两条数据，如下所示：

```
cs.execute("INSERT INTO student (id, name) VALUES ('1', 'Jhon')")
cs.execute("INSERT INTO student (id, name) VALUES ('2', 'Alan')")
cs.execute("INSERT INTO student (id, name) VALUES ('3', 'Bob')")
cs.close()
conn.commit()
conn.close()
```

执行完后，到 SQLiteStudio 中看一下，如图所示：

![](http://www.justdopython.com/assets/images/2019/sqlite/sqlitestudio7.PNG) 

我们看到数据已经进来了。

### 4.5 查询

前面我们是通过 SQLiteStudio 查看数据的，现在我们通过 SQL 查看一下，如下所示：

```
# 导入模块
import sqlite3
# 连接数据库
conn = sqlite3.connect('test.db')
# 创建游标
cs = conn.cursor()
# 查询数据
cs.execute("SELECT id, name FROM student")
# 获取查询结果集中的下一行
print('fetchone-->', cs.fetchone())
# 获取查询结果集中的下一行组
print('fetchmany-->', cs.fetchmany())
# 获取查询结果集中所有（剩余）的行
print('fetchall-->', cs.fetchall())
cs.close()
conn.close()
```

输出结果：

```
fetchone--> ('1', 'Jhon')
fetchmany--> [('2', 'Alan')]
fetchall--> [('3', 'Bob')]
```

### 4.6 更新

我们修改 id 为 1 这条数据的 name 值，如下所示：

```
# 导入模块
import sqlite3
# 连接数据库
conn = sqlite3.connect('test.db')
# 创建游标
cs = conn.cursor()
# 修改数据
cs.execute("SELECT id, name FROM student WHERE id = '1'")
print('修改前-->', cs.fetchall())
cs.execute("UPDATE student set name = 'Nicolas' WHERE id = '1'")
cs.execute("SELECT id, name FROM student WHERE id = '1'")
print('修改后-->', cs.fetchall())
conn.commit()
cs.close()
conn.close()
```

输出结果：

```
修改前--> [('1', 'Jhon')]
修改后--> [('1', 'Nicolas')]
```

### 4.7 删除

我们删除 id 为 1 这条数据，如下所示：

```
# 导入模块
import sqlite3
# 连接数据库
conn = sqlite3.connect('test.db')
# 创建游标
cs = conn.cursor()
# 删除
cs.execute("SELECT id, name FROM student")
print('删除前-->', cs.fetchall())
cs.execute("DELETE FROM student WHERE id = '1'")
cs.execute("SELECT id, name FROM student")
print('删除后-->', cs.fetchall())
conn.commit()
cs.close()
conn.close()
```

输出结果：

```
删除前--> [('2', 'Alan'), ('1', 'Jhon')]
删除后--> [('2', 'Alan')]
```

这里我们只介绍了增删改查基本操作，SQLite 的 SQL 操作与我们常用的 MySQL 等数据库基本类似。

## 总结

本文介绍了 SQLite 及通过 Python 操作 SQLite，对 Python 工程师使用 SQLite 提供了基本支撑。

> 示例代码：[Python-100-days-day080](https://github.com/JustDoPython/python-100-day/tree/master/day-080)

参考：

[https://baike.baidu.com/item/SQLite/375020?fr=aladdin]( https://baike.baidu.com/item/SQLite/375020?fr=aladdin )

[https://www.liaoxuefeng.com/wiki/1016959663602400/1017801751919456](https://www.liaoxuefeng.com/wiki/1016959663602400/1017801751919456)

