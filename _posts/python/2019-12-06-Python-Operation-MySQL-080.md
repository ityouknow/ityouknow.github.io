---
layout: post
title:  第80天：Python-Operation_MySQL
category: python
copyright: python
---

by 潮汐

本章节Python 操作 MySQL 数据库需要是使用到 PyMySQL 驱动

 - PyMySQL 是在 Python3.x 版本中用于连接 MySQL 服务器的一个库，Python2 中则使用 mysqldb。
 - PyMySQL 遵循 Python 数据库 API v2.0 规范，并包含了 pure-Python MySQL 客户端库。
 
<!--more-->

Python 操作 MySQL 前提是要安装好 MySQL 数据库并能正常连接使用，安装步骤详见下文。

## 操作流程

1. 安装 MySQL 数据库
2. pymysql 模块安装与使用
3. 获取数据库的连接
4. 执行 sql 语句或存储过程
5. 关闭数据库连接

### 安装 MySQL 数据库

**注意：**  安装过程我们需要通过开启管理员权限来安装，否则会由于权限不足导致无法安装。

### 一、Linux 上安装 MySQL

#### 1、检测系统是否自带安装 MySQL:
  
  ```shell
  rpm -qa | grep mysql
  ```
#### 2、如果查看到系统有安装 MySQL，那可以选择进行卸载:

```
rpm -e mysql…　　# 普通删除模式
rpm -e --nodeps mysql…　　# 强力删除模式，如果使用上面命令删除时，提示有依赖的其它文件，则用该命令可以对其进行强力删除
```

#### 3、安装 MySQL

首先需要先下载 MySQL 安装包，[官网下载地址](https://dev.mysql.com/downloads/repo/yum/)
下载对应版本即可,或直接在网上拉取并安装：

```
wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm # 获取安装包
rpm -ivh mysql-community-release-el7-5.noarch.rpm                    # 安装
yum update
yum install mysql-server  
```
**权限设置：**
```
chown mysql:mysql -R /var/lib/mysql
```

**初始化 MySQL：**
```
mysqld --initialize
```

**启动 MySQL：**
```
systemctl start mysqld
```

**查看 MySQL 运行状态：**
```
systemctl status mysqld
```
#### 4、修改默认密码

Mysql安装成功后，默认的root用户密码为空，你可以使用以下命令来创建root用户的密码：

```
mysqladmin -u root password "new_password";
```
**登陆：**

```
mysql -uroot -p'new_password'
```

### 二、Windows 上安装

#### 1、下载
Windows 上安装 MySQL 相对来说会较为简单，[5.7 版本下载地址](https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.28-winx64.zip)

下载完后，将 zip 包解压到自定义目录，这里我将解压后的文件夹放在 D:\Software\MySQL\mysql-5.7.28 下;

#### 2、配置

接下来需要配置下 MySQL 的配置文件，打开刚刚解压的文件夹 D:\Software\MySQL\mysql-5.7.28 ，在该文件夹下创建 my.ini 配置文件，编辑 my.ini 配置以下基本信息：

```
[client]
# 设置mysql客户端默认字符集
default-character-set=utf8
 
[mysqld]
# 设置3306端口
port = 3306
# 设置mysql的安装目录
basedir=D:\\Software\\MySQL\\mysql-5.7.28
# 设置 mysql数据库的数据的存放目录，MySQL 8+ 不需要以下配置，系统自己生成即可，否则有可能报错
datadir=D:\\Software\\MySQL\\SqlData
# 允许最大连接数
max_connections=20
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
```
**注意**：还需要创建数据库数据目录，初始化数据库的时候需要初始化数据目录
在 Mysql 安装目录下创建数据目录 `datadir=D:\\Software\\MySQL\\SqlData`

#### 3、启动数据库

以管理员身份打开 cmd 命令行工具，切换至 Mysql 安装目录：
```
cd D:\Software\MySQL\mysql-5.7.28\bin
```

**初始化数据库：**

```
mysqld --initialize --console
```

执行完成后，会输出 root 用户的初始默认密码，如下所示：
```
A temporary password is generated for root@localhost: feKm1E/-ExWM
```
"feKm1E/-ExWM" 即为 Mysql 初始密码

**输入以下安装命令：**

```
mysqld install
```

**初始化数据目录**

```
mysqld --initialize-insecure 
```
**启动 Mysql：**
```
net start mysql
```

**登陆：**

```
mysql -uroot -p
```
![Mysql 登陆图](https://qiniu.mdnice.com/d854615570e7e56779bd213d4b881dca.png)

刚安装好的数据库 默认密码是空，可根据自身需要修改。

**windows 下修改 mysql 密码：**

```sql
mysql> select User from user;
+---------------+
| User          |
+---------------+
| mysql.session |
| mysql.sys     |
| root          |
+---------------+
3 rows in set (0.00 sec)

mysql>
mysql> update mysql.user set authentication_string=password('123456') where user='root';
Query OK, 1 row affected, 1 warning (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 1

mysql> flush privileges;     # 立即生效
Query OK, 0 rows affected (0.01 sec)

mysql> quit
# 退出重新登陆即可
```

### 三、创建数据库

**创建数据库：**
```sql
create database test_db;
```
**查看数据库：**

```sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| test_db            |
+--------------------+
5 rows in set (0.00 sec)

mysql> use test_db;
Database changed

```

## pymysql 模块安装与数据 CURD

### 一、安装

PyMySQL 模块使用 pip命令进行安装：
```
pip3 install PyMySQL
```
假如系统不支持 pip 命令，可以使用以下方式安装：

```
$ git clone https://github.com/PyMySQL/PyMySQL
$ cd PyMySQL/
$ python3 setup.py install

```

### 二、pymysql 连接数据库

**pymysql .connect 函数：连接上数据库**

```python
# 导入模块
import pymysql

# 打开数据库连接

conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")

print(conn)
print(type(conn))
 
```

输出结果显示如下：表面数据库连接成功

```
<pymysql.connections.Connection object at 0x00000000022A54A8>
<class 'pymysql.connections.Connection'>
```

**使用 pymysql 的 connect() 方法连接数据库，connect  参数解释如下：**

- host：MySQL服务的地址，若数据库在本地上，使用 localhost 或者127.0.0.1。如果在其它的服务器上，则写对应的 IP地址
- port：服务的端口号，默认为3306，不写则为默认值。
- user：登录数据库的用户名
- passwd：登录 MySQL 的密码
- db：数据库名
- charset：设置为 utf8 编码，解决存汉字乱码问题



**conn.cursor():获取游标**

如果要操作数据库，光连接数据是不够的，咱们必须拿到操作数据库的游标，才能进行后续的操作，游标的主要作用是用来接收数据库操作后的返回结果，比如读取数据、添加数据。通过获取到的数据库连接实例 conn 下的 cursor() 方法来创建游标，实例如下：

```python
# 导入模块
import pymysql

# 打开数据库连接
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")

# print(conn)
# print(type(conn))
# 获取连接下的游标
cursor_test = conn.cursor()
print(cursor_test)
```
输出结果为：
```
<pymysql.cursors.Cursor object at 0x000000000A544B00>
```

cursor 返回一个游标实例对象，其中包含了很多操作数据的方法，如执行sql语句，sql 执行命令：`execute()`和`executemany()`

**execute(query,args=None):**
- 函数作用：执行单条的sql语句，执行成功后返回受影响的行数
- 参数说明：
	- query：要执行的sql语句，字符串类型
	- args：可选的序列或映射，用于query的参数值。如果args为序列，query中必须使用%s做占位符；如果args为映射，query中必须使用%(key)s做占位符
  
**executemany(query,args=None)：**
- 函数作用：批量执行sql语句，比如批量插入数据，执行成功后返回受影响的行数
- 参数说明：
	- query：要执行的sql语句，字符串类型
	- args：嵌套的序列或映射，用于query的参数值
 
**其他游标对象如下表：**

|  名称   |  描述   |
| --- | --- |
|  close()   |  关闭游标，之后游标不可用   |
|fetchone()|返回一条查询结果|
|fetchall()|返回所有查询结果|
|fetchmany([size])|返回size条查询结果|
|nextset()|移动到下一条结果|
|scroll(value,mode='relative')|移动游标到指定行，如果mode='relative'，则表示从当前行移动value条，如果mode=‘absolute’，则表示从结果集的第一行移动value条|


**完整数据库连接操作实例如下：**

```
# 导入模块
import pymysql

# 打开数据库连接
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")
# print(conn)
# print(type(conn))

# 获取连接下的游标
cursor_test = conn.cursor()
print(cursor_test)

# 使用 execute()  方法执行 SQL 查询，查询数据库版本
cursor_test.execute("SELECT VERSION()")

# 使用 fetchone() 方法返回一条数据.
data = cursor_test.fetchone()

print("Database version : %s " % data)

# 关闭数据库连接
conn.close()
```

**以上结果输出为：**
```
Database version : 5.7.28 
```

### 三、创建表
创建表代码如下：
```python
import pymysql

# 打开数据库连接
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")

# 获取连接下的游标
cursor_test = conn.cursor()

# 使用 execute() 方法执行 SQL，如果表存在则删除
cursor_test.execute("DROP TABLE IF EXISTS EMPLOYEE")

# 使用预处理语句创建表
sql = """CREATE TABLE user1 (
         FIRST_NAME  CHAR(20) NOT NULL,
         LAST_NAME  CHAR(20),
         AGE INT,  
         SEX CHAR(1),
         INCOME FLOAT )"""

cursor_test.execute(sql)

# 关闭数据库连接
conn.close()
```

如下所示数据库表创建成功：
```
mysql> desc user1;
+------------+----------+------+-----+---------+-------+
| Field      | Type     | Null | Key | Default | Extra |
+------------+----------+------+-----+---------+-------+
| FIRST_NAME | char(20) | NO   |     | NULL    |       |
| LAST_NAME  | char(20) | YES  |     | NULL    |       |
| AGE        | int(11)  | YES  |     | NULL    |       |
| SEX        | char(1)  | YES  |     | NULL    |       |
| INCOME     | float    | YES  |     | NULL    |       |
+------------+----------+------+-----+---------+-------+
5 rows in set (0.00 sec)

```

### 三、插入数据
插入数据实现代码：

```python
import pymysql

# 打开数据库连接
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")

# 获取连接下的游标
cursor_test = conn.cursor()

# 使用预处理语句创建表
sql = """INSERT INTO user1(FIRST_NAME,
         LAST_NAME, AGE, SEX, INCOME)
         VALUES ('Fei', 'Fei', 20, 'M', 1000)"""

try:
   # 执行sql语句
   cursor_test.execute(sql)
   # 提交到数据库执行
   conn.commit()
except:
   # 如果发生错误则回滚
   conn.rollback()

# 关闭数据库连接
conn.close()
```

**插入数据结果：**
```
mysql> select * from user1;
+------------+-----------+------+------+--------+
| FIRST_NAME | LAST_NAME | AGE  | SEX  | INCOME |
+------------+-----------+------+------+--------+
| Fei        | Fei       |   20 | M    |   1000 |
+------------+-----------+------+------+--------+
1 row in set (0.00 sec)
```

### 四、查询数据
Python查询Mysql使用 fetchone() 方法获取单条数据, 使用fetchall() 方法获取多条数据。

- fetchone(): 该方法获取下一个查询结果集。结果集是一个对象
- fetchall(): 接收全部的返回结果行.
- rowcount: 这是一个只读属性，并返回执行 execute()方法后影响的行数。

**查询数据代码如下：**

```
import pymysql


# 打开数据库连接
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")

# 获取连接下的游标
cursor_test = conn.cursor()

sql = """
    select * from user1"""

try:
    # 执行 sql 语句
    cursor_test.execute(sql)
    # 显示出所有数据
    data_result = cursor_test.fetchall()
    for row in data_result:
        fname = row[0]
        lname = row[1]
        age = row[2]
        sex = row[3]
        income = row[4]
        # 打印结果
        print("fname=%s,lname=%s,age=%s,sex=%s,income=%s" % \
              (fname, lname, age, sex, income))
except:
    print("Error: unable to fetch data")

# 关闭数据库连接
conn.close()
```

**输出结果：**
```
fname=Fei,lname=Fei,age=20,sex=M,income=1000.0
```

### 五、数据库表更新操作
```
# 导入模块
import pymysql

# 打开数据库连接
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")
# print(conn)
# print(type(conn))

# 获取连接下的游标
cursor_test = conn.cursor()

sql = "UPDATE user1 SET AGE = AGE + 1 WHERE SEX = '%c'" % ('M')

try:
    # 执行SQL语句
    cursor_test.execute(sql)
    # 提交到数据库执行
    conn.commit()
except:
    # 发生错误时回滚
    conn.rollback()

# 关闭数据库连接
conn.close()
```
### 六、删除操作
```
# 导入模块
import pymysql

# 打开数据库连接
conn = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="123456",
    database="test_db",
    charset="utf8")
# print(conn)
# print(type(conn))

# 获取连接下的游标
cursor_test = conn.cursor()

sql = "DELETE * FROM user1"

try:
    # 执行SQL语句
    cursor_test.execute(sql)
    # 提交到数据库执行
    conn.commit()
except:
    # 发生错误时回滚
    conn.rollback()

# 关闭数据库连接
conn.close()
```

### 七、错误处理

DB API中定义了一些数据库操作的错误及异常，下表列出了这些错误和异常:

| 异 常	| 描 述  |
| --- | --- |
|Warning	| 当有严重警告时触发，例如插入数据是被截断等等。必须是 StandardError 的子类。|
|Error|	警告以外所有其他错误类。必须是 StandardError 的子类。|
|InterfaceError|	当有数据库接口模块本身的错误（而不是数据库的错误）发生时触发。 必须是Error的子类。|
|DatabaseError	|和数据库有关的错误发生时触发。 必须是Error的子类。|
|DataError|	当有数据处理时的错误发生时触发，例如：除零错误，数据超范围等等。 必须是DatabaseError的子类。|
|OperationalError|	指非用户控制的，而是操作数据库时发生的错误。例如：连接意外断开、 数据库名未找到、事务处理失败、内存分配错误等等操作数据库是发生的错误。 必须是DatabaseError的子类。|
|IntegrityError|	完整性相关的错误，例如外键检查失败等。必须是DatabaseError子类。|
|InternalError|	数据库的内部错误，例如游标（cursor）失效了、事务同步失败等等。 必须是DatabaseError子类。|
|ProgrammingError	| 程序错误，例如数据表（table）没找到或已存在、SQL语句语法错误、 参数数量错误等等。必须是DatabaseError的子类。|
|NotSupportedError|	不支持错误，指使用了数据库不支持的函数或API等。例如在连接对象上 使用.rollback()函数，然而数据库并不支持事务或者事务已关闭。 必须是DatabaseError的子类。|

### 总结

本文给大家介绍 Python 如何连接 Mysql 进行数据的增删改查操作，文章通过简洁的代码方式进行示例演示，给使用 Python 操作 Mysql 的工程师提供支撑。

### 参考
[https://www.runoob.com/mysql/mysql-install.html](https://www.runoob.com/mysql/mysql-install.html)
[https://www.runoob.com/python3/python3-mysql.html](https://www.runoob.com/python3/python3-mysql.html)


> 文中示例代码：[python-100-days](https://github.com/JustDoPython/python-100-day)