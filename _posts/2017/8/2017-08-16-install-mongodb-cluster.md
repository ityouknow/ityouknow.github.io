---
layout: post
title: mongodb 3.4 集群搭建：分片+副本集 五台服务器
category: mongodb
tags: [mongodb]
---

生产实际搭建记录。

## 环境准备

系统系统 centos6.9        
五台服务器：192.168.181.31/32/33/34/35   
安装包： mongodb-linux-x86_64-3.4.6.tgz  

服务器规划

服务器31      |服务器32	      |服务器33       |服务器34      |服务器35
---           |---            |---            |---           |---
mongos server |mongos server  |config server  |config server |config server
shard1 server |shard2 server  |shard3 server  |shard4 server |shard5 server
shard5 server |shard1 server  |shard2 server  |shard3 server |shard4 server
shard4 server |shard5 server  |shard1 server  |shard2 server |shard3 server


端口分配：

``` properties
mongos：20000
config：21000
shard1：27001
shard2：27002
shard3：27003
shard4：27004
shard5：27005
```

权限分配：

登录root账户，将安装目录和数据目录权限分配给日常操作（hkrtP4）账户

``` properties
chown -R hkrtP4:hkrtP4 /usr/local/
chown -R hkrtP4:hkrtP4 /data
```

## mongodb安装


### 1、下载

下载 mongodb 3.4.6 安装包

``` sh
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.4.6.tgz
```

``` sh
#解压
tar -xzvf mongodb-linux-x86_64-3.4.6.tgz -C /usr/local/
#改名
mv mongodb-linux-x86_64-3.4.6 mongodb
```

### 2、创建相关目录

根据服务器的规范，分别在对应的服务器上建立conf、mongos、config、shard1、shard2、shard3、shard4、shard5等目录，因为mongos不存储数据，只需要建立日志文件目录即可。

``` sh
mkdir -p /usr/local/mongodb/conf
mkdir -p /data/mongos/log
mkdir -p /data/config/data
mkdir -p /data/config/log
mkdir -p /data/shard1/data
mkdir -p /data/shard1/log
mkdir -p /data/shard2/data
mkdir -p /data/shard2/log
mkdir -p /data/shard3/data
mkdir -p /data/shard3/log
mkdir -p /data/shard4/data
mkdir -p /data/shard4/log
mkdir -p /data/shard5/data
mkdir -p /data/shard5/log
```


### 3、环境变量

为了后续方便操作，配置mongodb的环境变量，需要切到root用户下面

``` sh
vim /etc/profile
# 内容
export MONGODB_HOME=/usr/local/mongodb
export PATH=$MONGODB_HOME/bin:$PATH
# 使立即生效，在安装用户下（hkrtP4）执行
source /etc/profile
```

查看mongodb版本信息```mongod -v``` 输出版本信息表明配置环境变量成功


## 集群配置

### 1、config server配置服务器

在服务器33、34、35上配置以下内容：

添加配置文件：

添加配置文件

``` sh
vi /usr/local/mongodb/conf/config.conf

## content
systemLog:
  destination: file
  logAppend: true
  path: /data/config/log/config.log
 
# Where and how to store data.
storage:
  dbPath: /data/config/data
  journal:
    enabled: true
# how the process runs
processManagement:
  fork: true
  pidFilePath: /data/config/log/configsrv.pid
 
# network interfaces
net:
  port: 21000
  bindIp: 192.168.181.33
 
#operationProfiling:
replication:
    replSetName: config        

sharding:
    clusterRole: configsvr
```

启动三台服务器的config server

``` sh
numactl --interleave=all mongod --config /usr/local/mongodb/conf/config.conf
```

登录任意一台配置服务器，初始化配置副本集

``` sh
#连接
mongo 192.168.181.33:21000
#config变量
config = {
...    _id : "config",
...     members : [
...         {_id : 0, host : "192.168.181.33:21000" },
...         {_id : 1, host : "192.168.181.34:21000" },
...         {_id : 2, host : "192.168.181.35:21000" }
...     ]
... }

#初始化副本集
rs.initiate(config)

#查看分区状态
rs.status();
```

其中，"_id" : "configs"应与配置文件中配置的 replicaction.replSetName 一致，"members" 中的 "host" 为三个节点的ip和port

*这样配置服务器就配置好了*


### 2、配置分片、副本集

#### 配置第一个分片副本集

在服务器 31、32、33上面做以下配置

配置文件

``` sh
vi /usr/local/mongodb/conf/shard1.conf

#配置文件内容
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /data/shard1/log/shard1.log
 
# Where and how to store data.
storage:
  dbPath: /data/shard1/data
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
       cacheSizeGB: 20

# how the process runs
processManagement:
  fork: true 
  pidFilePath: /data/shard1/log/shard1.pid
 
# network interfaces
net:
  port: 27001
  bindIp: 192.168.181.33

#operationProfiling:
replication:
    replSetName: shard1
sharding:
    clusterRole: shardsvr
```

启动三台服务器的shard1 server

``` sh
numactl --interleave=all mongod  --config  /usr/local/mongodb/conf/shard1.conf
```

登陆任意一台服务器，初始化副本集

``` sh
mongo 192.168.181.31:27001
#使用admin数据库
use admin
#定义副本集配置
config = {
...    _id : "shard1",
...     members : [
...         {_id : 0, host : "192.168.181.31:27001" },
...         {_id : 1, host : "192.168.181.32:27001" },
...         {_id : 2, host : "192.168.181.33:27001" }
...     ]
... }


#初始化副本集配置
rs.initiate(config);


#查看分区状态
rs.status();
```


#### 配置第二个分片副本集

在服务器32、33、34上面做以下配置

配置文件

``` sh
vi /usr/local/mongodb/conf/shard2.conf

#配置文件内容
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /data/shard2/log/shard2.log
 
# Where and how to store data.
storage:
  dbPath: /data/shard2/data
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
       cacheSizeGB: 20
 
# how the process runs
processManagement:
  fork: true 
  pidFilePath: /data/shard2/log/shard2.pid
 
# network interfaces
net:
  port: 27002
  bindIp: 192.168.181.33

 
#operationProfiling:
replication:
    replSetName: shard2
sharding:
    clusterRole: shardsvr
```

启动三台服务器的shard2 server

``` sh
numactl --interleave=all mongod  --config /usr/local/mongodb/conf/shard2.conf
```

登陆任意一台服务器，初始化副本集

``` sh
mongo 192.168.181.32:27002
#使用admin数据库
use admin
#定义副本集配置
config = {
...    _id : "shard2",
...     members : [
...         {_id : 0, host : "192.168.181.32:27002" },
...         {_id : 1, host : "192.168.181.33:27002" },
...         {_id : 2, host : "192.168.181.34:27002" }
...     ]
... }


#初始化副本集配置
rs.initiate(config);

#查看分区状态
rs.status();
```

#### 配置第三个分片副本集

在服务器33、34、35上面做以下配置

配置文件

``` sh
vi /usr/local/mongodb/conf/shard3.conf

#配置文件内容
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /data/shard3/log/shard3.log
 
# Where and how to store data.
storage:
  dbPath: /data/shard3/data
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
       cacheSizeGB: 20
# how the process runs
processManagement:
  fork: true 
  pidFilePath: /data/shard3/log/shard3.pid
 
# network interfaces
net:
  port: 27003
  bindIp: 192.168.181.33

 
#operationProfiling:
replication:
    replSetName: shard3
sharding:
    clusterRole: shardsvr
```

启动三台服务器的shard3 server

``` sh
numactl --interleave=all mongod  --config  /usr/local/mongodb/conf/shard3.conf
```

登陆任意一台服务器，初始化副本集

``` sh
mongo 192.168.181.33:27003
#使用admin数据库
use admin
#定义副本集配置
config = {
...    _id : "shard3",
...     members : [
...         {_id : 0, host : "192.168.181.33:27003" },
...         {_id : 1, host : "192.168.181.34:27003" },
...         {_id : 2, host : "192.168.181.35:27003" }
...     ]
... }


#初始化副本集配置
rs.initiate(config);

#查看分区状态
rs.status();
```


#### 配置第四个分片副本集

在服务器34、35、31上面做以下配置

配置文件

``` sh
vi /usr/local/mongodb/conf/shard4.conf

#配置文件内容
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /data/shard4/log/shard4.log
 
# Where and how to store data.
storage:
  dbPath: /data/shard4/data
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
       cacheSizeGB: 20

# how the process runs
processManagement:
  fork: true 
  pidFilePath: /data/shard4/log/shard4.pid
 
# network interfaces
net:
  port: 27004
  bindIp: 192.168.181.35

 
#operationProfiling:
replication:
    replSetName: shard4
sharding:
    clusterRole: shardsvr
```

启动三台服务器的shard4 server

``` sh
numactl --interleave=all mongod  --config /usr/local/mongodb/conf/shard4.conf
```

登陆任意一台服务器，初始化副本集

``` sh
mongo 192.168.181.34:27004
#使用admin数据库
use admin
#定义副本集配置
config = {
...    _id : "shard4",
...     members : [
...         {_id : 0, host : "192.168.181.34:27004" },
...         {_id : 1, host : "192.168.181.35:27004" },
...         {_id : 2, host : "192.168.181.31:27004" }
...     ]
... }


#初始化副本集配置
rs.initiate(config);

#查看分区状态
rs.status();
```


#### 配置第五个分片副本集

在服务器35、31、32上面做以下配置

配置文件

``` sh
vi /usr/local/mongodb/conf/shard5.conf

#配置文件内容
# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /data/shard5/log/shard5.log
 
# Where and how to store data.
storage:
  dbPath: /data/shard5/data
  journal:
    enabled: true
  wiredTiger:
    engineConfig:
       cacheSizeGB: 20

# how the process runs
processManagement:
  fork: true 
  pidFilePath: /data/shard5/log/shard5.pid
 
# network interfaces
net:
  port: 27005
  bindIp: 192.168.181.35

 
#operationProfiling:
replication:
    replSetName: shard5
sharding:
    clusterRole: shardsvr
```

启动三台服务器的shard5 server

``` sh
numactl --interleave=all mongod  --config  /usr/local/mongodb/conf/shard5.conf
```

登陆任意一台服务器，初始化副本集

``` sh
mongo 192.168.181.35:27005
#使用admin数据库
use admin
#定义副本集配置
config = {
...    _id : "shard5",
...     members : [
...         {_id : 0, host : "192.168.181.35:27005" },
...         {_id : 1, host : "192.168.181.31:27005" },
...         {_id : 2, host : "192.168.181.32:27005" }
...     ]
... }


#初始化副本集配置
rs.initiate(config);

#查看分区状态
rs.status();
```

*至此，五个分片和副本集搭建完毕*


### 3、配置路由服务器 mongos


以下配置在服务器31、32上执行

> 注意：先启动配置服务器和分片服务器,后启动路由实例

``` sh
vi /usr/local/mongodb/conf/mongos.conf

systemLog:
  destination: file
  logAppend: true
  path: /data/mongos/log/mongos.log
processManagement:
  fork: true
#  pidFilePath: /usr/local/mongodb/mongos.pid
 
# network interfaces
net:
  port: 20000
  bindIp: 192.168.181.31
#监听的配置服务器,只能有1个或者3个 configs为配置服务器的副本集名字
sharding:
   configDB: configs/192.168.181.33:21000,192.168.181.34:21000,192.168.181.35:21000
```

启动二台服务器的mongos server

``` sh
mongos  --config  /usr/local/mongodb/conf/mongos.conf
```

### 4、启用分片


目前搭建了mongodb配置服务器、路由服务器，各个分片服务器，不过应用程序连接到mongos路由服务器并不能使用分片机制，还需要在程序里设置分片配置，让分片生效。

登陆任意一台mongos

``` sh
mongo 192.168.181.31:20000
#使用admin数据库
use  admin
#串联路由服务器与分配副本集
sh.addShard("shard1/192.168.181.31:27001,192.168.181.32:27001,192.168.181.33:27001")
sh.addShard("shard2/192.168.181.32:27002,192.168.181.33:27002,192.168.181.34:27002")
sh.addShard("shard3/192.168.181.33:27003,192.168.181.34:27003,192.168.181.35:27003")
sh.addShard("shard4/192.168.181.34:27004,192.168.181.35:27004,192.168.181.31:27004")
sh.addShard("shard5/192.168.181.35:27005,192.168.181.31:27005,192.168.181.32:27005")
#查看集群状态
sh.status()
```


## 警告

不做任何优化启动mongodb，一般会警告如下：

``` sh
2017-08-16T18:33:42.985+0800 I STORAGE  [initandlisten] ** WARNING: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine
2017-08-16T18:33:42.985+0800 I STORAGE  [initandlisten] **          See http://dochub.mongodb.org/core/prodnotes-filesystem
2017-08-16T18:33:43.024+0800 I CONTROL  [initandlisten] 
2017-08-16T18:33:43.024+0800 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2017-08-16T18:33:43.024+0800 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2017-08-16T18:33:43.024+0800 I CONTROL  [initandlisten] 
2017-08-16T18:33:43.025+0800 I CONTROL  [initandlisten] 
2017-08-16T18:33:43.025+0800 I CONTROL  [initandlisten] ** WARNING: You are running on a NUMA machine.
2017-08-16T18:33:43.025+0800 I CONTROL  [initandlisten] **          We suggest launching mongod like this to avoid performance problems:
2017-08-16T18:33:43.025+0800 I CONTROL  [initandlisten] **              numactl --interleave=all mongod [other options]
2017-08-16T18:33:43.026+0800 I CONTROL  [initandlisten] 
2017-08-16T18:33:43.026+0800 I CONTROL  [initandlisten] ** WARNING: /proc/sys/vm/zone_reclaim_mode is 1
2017-08-16T18:33:43.026+0800 I CONTROL  [initandlisten] **          We suggest setting it to 0
2017-08-16T18:33:43.026+0800 I CONTROL  [initandlisten] **          http://www.kernel.org/doc/Documentation/sysctl/vm.txt
2017-08-16T18:33:43.026+0800 I CONTROL  [initandlisten] 
2017-08-16T18:33:43.027+0800 I CONTROL  [initandlisten] ** WARNING: /sys/kernel/mm/transparent_hugepage/enabled is 'always'.
2017-08-16T18:33:43.027+0800 I CONTROL  [initandlisten] **        We suggest setting it to 'never'
2017-08-16T18:33:43.027+0800 I CONTROL  [initandlisten] 
2017-08-16T18:33:43.027+0800 I CONTROL  [initandlisten] ** WARNING: /sys/kernel/mm/transparent_hugepage/defrag is 'always'.
2017-08-16T18:33:43.027+0800 I CONTROL  [initandlisten] **        We suggest setting it to 'never'
2017-08-16T18:33:43.027+0800 I CONTROL  [initandlisten] 
```

启动之后有六条建议；

1、建议启用XFS文件系统，我们使用的是centos6.9,重新格式化磁盘即可。

参考这篇文章：[centos6构建XFS文件系统](http://blog.csdn.net/xiegh2014/article/details/52687734)

2、配置mongodb管理账户，数据库的访问权限

参考官方配置：[Re-start the MongoDB instance with access control.](https://docs.mongodb.com/master/tutorial/enable-authentication/#re-start-the-mongodb-instance-with-access-controls)

3、启动的时候添加参数：

``` sh
numactl --interleave=all mongod [other options]
```

4、修改内核参数

``` sh
echo 0 > /proc/sys/vm/zone_reclaim_mode
```

5、修改参数

``` sh
echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

 6、修改参数

``` sh
echo never > /sys/kernel/mm/transparent_hugepage/defrag
```

## 错误


### rs.initiate报错

执行 rs.initiate(config); 是报错：

``` sh
rs.initiate(config);
{
        "ok" : 0,
        "errmsg" : "No host described in new configuration 1 for replica set shard1 maps to this node",
        "code" : 93,
        "codeName" : "InvalidReplicaSetConfig"
}
```

最后发现是自己的一个端口号写错了。


###  启动mongos报错

启动mongos的时候报错：

``` sh
about to fork child process, waiting until server is ready for connections.
forked process: 1436
ERROR: child process failed, exited with error number 1
```

这个问题卡了我们半天，找了很多的资料，不是说清理lock，就是说清理log总无解，最后看到这个网站的提示

[ERROR: child process failed, exited with error number 1](http://www.kriblog.com/bigdata/NoSQL/MongoDb/error-child-process-failed-exited-with-error-number-1.html)

去掉了配置文件中  --fork，才将错误日志打印了出来，是我们的配置文件中的路径写错了，本来是log写成了logs

原来：```path: /data/logs/mongos.log```

改为：```path: /data/log/mongos.log```

成功


###  压力测试


生产使用了5台服务器，五个分片，每个分片两个副本集，服务器内存128G，CPU 20核，硬盘3T 做完raid10之后，数据目录data大概是2.1T的空间。

搭建完成时候迫不及待的进行了压测，启动了10个线程每个线程1万数据，没有启动分片的勤快下，大概用了8分钟。启用分片之后，进行测试启动了100个线程，每个线程插入100万的时候，平均每秒插入速度8000。第二天过来的时候发现分片5节点挂了，报错如下：


项目报错：

``` sh
Caused by: com.mongodb.WriteConcernException: Write failed with error code 83 and error message 'write results unavailable from 192.168.181.35:27005 :: caused by :: Location11002: socket exception [CONNECT_ERROR] for 192.168.181.35:27005'
```

mongos错误信息：

``` sh
 Failed to connect to 192.168.181.35:27005, in(checking socket for error after poll), reason: Connection refused

 No primary detected for set shard5
```

 congfig 报错：

``` sh
 No primary detected for set shard5
2017-08-21T11:08:22.709+0800 W NETWORK  [Balancer] Failed to connect to 192.168.181.31:27005, in(checking socket for error after poll), reason: Connection refused
2017-08-21T11:08:22.710+0800 W NETWORK  [Balancer] Failed to connect to 192.168.181.35:27005, in(checking socket for error after poll), reason: Connection refused
2017-08-21T11:08:22.710+0800 W NETWORK  [Balancer] No primary detected for set shard5
2017-08-21T11:08:22.710+0800 I SHARDING [Balancer] caught exception while doing balance: could not find host matching read preference { mode: "primary" } for set shard5
2017-08-21T11:08:22.710+0800 I SHARDING [Balancer] about to log metadata event into actionlog: { _id: "mongodb34.hkrt.cn-2017-08-21T11:08:22.710+0800-599a4ea698ec442a0836e2d5", server: "mongodb34.hkrt.cn", clientAddr: "", time: new Date(1503284902710), what: "balancer.round", ns: "", details: { executionTimeMillis: 20051, errorOccured: true, errmsg: "could not find host matching read preference { mode: "primary" } for set shard5" } }
```

剩余分片（192.168.181.32）报错：

``` sh
not master and slaveOk=false
could not find host matching read preference { mode: "primary" } for set shard5
```


同时查看五台服务器内存，全部被使用完了，重新启动分片5之后，查看数据只插入了3000万条，就崩了；启动万之后，在进行了10万数据的压测，结果分片三又蹦了。

看了mongodb的官方文档，猜测大概是内存配置的问题。找到这一句：


``` sh
storage.wiredTiger.engineConfig.cacheSizeGB

Type: float

The maximum size of the internal cache that WiredTiger will use for all data.

Changed in version 3.4: Values can range from 256MB to 10TB and can be a float. In addition, the default value has also changed.

Starting in 3.4, the WiredTiger internal cache, by default, will use the larger of either:

50% of RAM minus 1 GB, or
256 MB.
Avoid increasing the WiredTiger internal cache size above its default value.

With WiredTiger, MongoDB utilizes both the WiredTiger internal cache and the filesystem cache.

Via the filesystem cache, MongoDB automatically uses all free memory that is not used by the WiredTiger cache or by other processes. Data in the filesystem cache is compressed.

*NOTE*
*The storage.wiredTiger.engineConfig.cacheSizeGB limits the size of the WiredTiger internal cache. The operating system will use the available free memory for filesystem cache, which allows the compressed MongoDB data files to stay in memory. In addition, the operating system will use any free RAM to buffer file system blocks and file system cache.*

*To accommodate the additional consumers of RAM, you may have to decrease WiredTiger internal cache size.*


The default WiredTiger internal cache size value assumes that there is a single mongod instance per machine. If a single machine contains multiple MongoDB instances, then you should decrease the setting to accommodate the other mongod instances.

If you run mongod in a container (e.g. lxc, cgroups, Docker, etc.) that does not have access to all of the RAM available in a system, you must set storage.wiredTiger.engineConfig.cacheSizeGB to a value less than the amount of RAM available in the container. The exact amount depends on the other processes running in the container.
```

[原文地址](https://docs.mongodb.com/manual/reference/configuration-options/index.html)


大概意思就是，分配的缓存默认会使用内存的一半减去1G,如果部署多个实例的时候应该相应的减少缓存大小的配置。

如果不设置的话，128G的内存，每个分片的实例使用内存的大小是63G,三个分片的使用的大小是189G远远超出内存128G，导致内存使用过量分片down掉。


看到这块的时候，感觉mongodb还是不够智能，为什么不会根据实例的多少动态平衡呢非要把内容打满down掉，随后我们调整了每天实例使用内存的大小，设置如下：

分片的启动参数中添加以下配置：

``` sh
storage:
  wiredTiger:
    engineConfig:
       cacheSizeGB: 20
```

每台实例的大小设置为20G。

可以使用mongostat命令来查看每个分片使用内存的大小。

第二天再次进行了压测，100个线程每个线程插入100万，1亿数据入库，正常，插入的速度，8000/s,高峰期间可以达到2万/s。


## 添加节点

### 副本集 改为仲裁节点

[convert-secondary-into-arbiter](https://docs.mongodb.com/manual/tutorial/convert-secondary-into-arbiter/)

登录

``` sh
mongo 192.168.181.35:27005
#使用admin数据库
use admin
```

``` sh
#查看分区状态
rs.status();
```

移除副本集

``` sh
rs.remove("192.168.181.35:27005")
```

查看配置

``` sh
rs.conf()
```

删除shard5的数据目录，重启shard5

重新添加仲裁节点

``` sh
rs.addArb("192.168.181.35:27005")
```

查看配置

``` sh
rs.conf()
```


### 仲裁节点改成副本集

[Add Members to a Replica Set](https://docs.mongodb.com/manual/tutorial/expand-replica-set/)

移除仲裁节点

``` sh
rs.remove("192.168.181.35:27005")
```

删除总裁节点的数据，并重启


在 primary 添加副本节点

``` sh
rs.add("192.168.181.35:27005")
```

``` sh
rs.conf()
rs.status();
```

刚添加的副本集状态为：STARTUP2

``` sh
"stateStr" : "STARTUP2",
```

## 集群中添加分片


``` sh
mongo 192.168.181.31:20000
#使用admin数据库
use  admin
#添加分片
sh.addShard("shard5/192.168.181.35:27005,192.168.181.31:27005,192.168.181.32:27005")
#查看集群状态
sh.status()
```


## 监控

###  mongostat 

mongostat是mongdb自带的状态检测工具，在命令行下使用。它会间隔固定时间获取mongodb的当前运行状态，并输出。如果你发现数据库突然变慢或者有其他问题的话，你第一手的操作就考虑采用mongostat来查看mongo的状态。


它的输出有以下几列：

- inserts/s 每秒插入次数
- query/s 每秒查询次数
- update/s 每秒更新次数
- delete/s 每秒删除次数
- getmore/s 每秒执行getmore次数
- command/s 每秒的命令数，比以上插入、查找、更新、删除的综合还多，还统计了别的命令
- flushs/s 每秒执行fsync将数据写入硬盘的次数。
- mapped/s 所有的被mmap的数据量，单位是MB，
- vsize 虚拟内存使用量，单位MB
- res 物理内存使用量，单位MB
- faults/s 每秒访问失败数（只有Linux有），数据被交换出物理内存，放到swap。不要超过100，否则就是机器内存太小，造成频繁swap写入。此时要升级内存或者扩展
- locked % 被锁的时间百分比，尽量控制在50%以下吧
- idx miss % 索引不命中所占百分比。如果太高的话就要考虑索引是不是少了
- q t|r|w 当Mongodb接收到太多的命令而数据库被锁住无法执行完成，它会将命令加入队列。这一栏显示了总共、读、写3个队列的长度，都为0的话表示mongo毫无压力。高并发时，一般队列值会升高。
- conn 当前连接数
- time 时间戳

示例：

``` sh
mongostat -h 192.168.181.31:27001
##返回结果
insert query update delete getmore command dirty  used flushes vsize   res qrw arw net_in net_out conn    set repl                time
   576    *0     *0     *0     455  1370|0  2.7% 64.0%       0 15.8G 13.9G 0|1 0|0  1.82m   1.44m   77 shard1  PRI Aug 23 17:05:25.495
   514    *0     *0     *0     446  1336|0  2.7% 64.0%       0 15.8G 13.9G 0|1 0|0  1.71m   1.29m   77 shard1  PRI Aug 23 17:05:26.495
   499    *0     *0     *0     461  1310|0  2.7% 64.0%       0 15.8G 13.9G 0|0 1|0  1.68m   1.27m   77 shard1  PRI Aug 23 17:05:27.495
   485    *0     *0     *0     442  1285|0  2.7% 64.0%       0 15.8G 13.9G 0|0 0|1  1.64m   1.24m   77 shard1  PRI Aug 23 17:05:28.496
   498    *0     *0     *0     444  1317|0  2.7% 64.0%       0 15.8G 13.9G 0|0 0|0  1.68m   1.26m   77 shard1  PRI Aug 23 17:05:29.494
   477    *0     *0     *0     445  1272|0  2.7% 64.0%       0 15.8G 13.9G 0|0 0|0  1.61m   1.22m   77 shard1  PRI Aug 23 17:05:30.494
```

mongostat间隔时间刷新mongodb分片的各项操作。

## mongotop

mongotop用来跟踪MongoDB的实例， 提供每个集合的统计数据。默认情况下，mongotop每一秒刷新一次。
mongotop用法：

``` sh
mongotop -h 192.168.181.31:27001 10
```

后面的10是<sleeptime>参数 ，可以不使用，等待的时间长度，以秒为单位，mongotop等待调用之间。通过的默认mongotop返回数据的每一秒。


mongotop --locks
报告每个数据库的锁的使用中，使用mongotop - 锁，这将产生以下输出：

结果字段介绍：
ns：包含数据库命名空间，后者结合了数据库名称和集合。
db：包含数据库的名称。名为 . 的数据库针对全局锁定，而非特定数据库。
total：mongod花费的时间工作在这个命名空间提供总额。
read：提供了大量的时间，这mongod花费在执行读操作，在此命名空间。
write：提供这个命名空间进行写操作，这mongod花了大量的时间。



### profiler

类似于MySQL的slow log, MongoDB可以监控所有慢的以及不慢的查询。

Profiler默认是关闭的，你可以选择全部开启，或者有慢查询的时候开启。

``` sh
> use test
switched to db test
> db.setProfilingLevel(2);
{"was" : 0 , "slowms" : 100, "ok" : 1} // "was" is the old setting
> db.getProfilingLevel()
```

查看Profile日志

``` sh
> db.system.profile.find().sort({$natural:-1})
{"ts" : "Thu Jan 29 2009 15:19:32 GMT-0500 (EST)" , "info" :
"query test.$cmd ntoreturn:1 reslen:66 nscanned:0 query: { profile: 2 } nreturned:1 bytes:50" ,
"millis" : 0} ...
```

``` sh
#查看系统中的慢查询数量
db.system.profile.count();
```

3个字段的意义

- ts：时间戳
- info：具体的操作
- millis：操作所花时间，毫秒

参考：[Database Profiler](https://docs.mongodb.com/manual/tutorial/manage-the-database-profiler/)

注意，造成满查询可能是索引的问题，也可能是数据不在内存造成因此磁盘读入造成。


### db.serverStatus()

db.serverStatus()

获取服务器的状态

``` sh
{
        "host" : "mongodb31.hkrt.cn:20000",
        "version" : "3.4.6",
        "process" : "mongos",
        "pid" : NumberLong(1940),
        "uptime" : 67854,
        "uptimeMillis" : NumberLong(67853593),
        "uptimeEstimate" : NumberLong(67853),
        "localTime" : ISODate("2017-08-23T09:39:55.400Z"),
        "asserts" : {
                "regular" : 0,
                "warning" : 0,
                "msg" : 0,
                "user" : 7048,
                "rollovers" : 0
        },
        "connections" : {
                "current" : 56,
                "available" : 52372,
                "totalCreated" : 523
        },
        "extra_info" : {
                "note" : "fields vary by platform",
                "page_faults" : 3
        },
        "network" : {
                "bytesIn" : NumberLong("102972729600"),
                "bytesOut" : NumberLong("7551683898"),
                "physicalBytesIn" : NumberLong("102972729600"),
                "physicalBytesOut" : NumberLong("7551683898"),
                "numRequests" : NumberLong(210803831)
        },
        "opcounters" : {
                "insert" : 79028505,
                "query" : 26334341,
                "update" : 0,
                "delete" : 4,
                "getmore" : 0,
                "command" : 79067537
        },
        "sharding" : {
                "configsvrConnectionString" : "config/192.168.181.33:21000,192.168.181.34:21000,192.168.181.35:21000",
                "lastSeenConfigServerOpTime" : {
                        "ts" : Timestamp(1503481193, 1),
                        "t" : NumberLong(1)
                }
        },
        "tcmalloc" : {
                "generic" : {
                        "current_allocated_bytes" : 3643648,
                        "heap_size" : 40898560
                },
                "tcmalloc" : {
                        "pageheap_free_bytes" : 36864,
                        "pageheap_unmapped_bytes" : 24522752,
                        "max_total_thread_cache_bytes" : NumberLong(1073741824),
                        "current_total_thread_cache_bytes" : 4660344,
                        "total_free_bytes" : 12695296,
                        "central_cache_free_bytes" : 2833608,
                        "transfer_cache_free_bytes" : 5201344,
                        "thread_cache_free_bytes" : 4660344,
                        "aggressive_memory_decommit" : 0,
                        "formattedString" : "------------------------------------------------\nMALLOC:        3643648 (    3.5 MiB) Bytes in use by application\nMALLOC: +        36864 (    0.0 MiB) Bytes in page heap freelist\nMALLOC: +      2833608 (    2.7 MiB) Bytes in central cache freelist\nMALLOC: +      5201344 (    5.0 MiB) Bytes in transfer cache freelist\nMALLOC: +      4660344 (    4.4 MiB) Bytes in thread cache freelists\nMALLOC: +      1401024 (    1.3 MiB) Bytes in malloc metadata\nMALLOC:   ------------\nMALLOC: =     17776832 (   17.0 MiB) Actual memory used (physical + swap)\nMALLOC: +     24522752 (   23.4 MiB) Bytes released to OS (aka unmapped)\nMALLOC:   ------------\nMALLOC: =     42299584 (   40.3 MiB) Virtual address space used\nMALLOC:\nMALLOC:           1936              Spans in use\nMALLOC:            109              Thread heaps in use\nMALLOC:           4096              Tcmalloc page size\n------------------------------------------------\nCall ReleaseFreeMemory() to release freelist memory to the OS (via madvise()).\nBytes released to the OS take up virtual address space but no physical memory.\n"
                }
        },
        "mem" : {
                "bits" : 64,
                "resident" : 24,
                "virtual" : 689,
                "supported" : true
        },
        "metrics" : {
                "cursor" : {
                        "timedOut" : NumberLong(21),
                        "open" : {
                                "multiTarget" : NumberLong(0),
                                "singleTarget" : NumberLong(0),
                                "pinned" : NumberLong(0),
                                "total" : NumberLong(0)
                        }
                },
                "commands" : {
                        "aggregate" : {
                                "failed" : NumberLong(1),
                                "total" : NumberLong(16)
                        },
                        "balancerStatus" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(2)
                        },
                        "buildInfo" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(519)
                        },
                        "collStats" : {
                                "failed" : NumberLong(1),
                                "total" : NumberLong(97)
                        },
                        "count" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(12)
                        },
                        "createIndexes" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(4)
                        },
                        "currentOp" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(2)
                        },
                        "dbStats" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(4)
                        },
                        "delete" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(4)
                        },
                        "drop" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(7)
                        },
                        "dropDatabase" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(2)
                        },
                        "find" : {
                                "failed" : NumberLong(2),
                                "total" : NumberLong(26334294)
                        },
                        "getLastError" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(252)
                        },
                        "getLog" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(6)
                        },
                        "insert" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(79028505)
                        },
                        "isMaster" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(24048)
                        },
                        "listCollections" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(44)
                        },
                        "listDatabases" : {
                                "failed" : NumberLong(1),
                                "total" : NumberLong(135)
                        },
                        "ping" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(13575)
                        },
                        "profile" : {
                                "failed" : NumberLong(3),
                                "total" : NumberLong(3)
                        },
                        "replSetGetStatus" : {
                                "failed" : NumberLong(34),
                                "total" : NumberLong(34)
                        },
                        "serverStatus" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(131)
                        },
                        "whatsmyuri" : {
                                "failed" : NumberLong(0),
                                "total" : NumberLong(135)
                        }
                }
        },
        "ok" : 1
}
```

需要关心的地方：

- connections 当前连接和可用连接数，听过一个同行介绍过，mongodb最大处理到2000个连接就不行了（要根据你的机器性能和业务来设定），所以设大了没意义。设个合理值的话，到达这个值mongodb就拒绝新的连接请求，避免被太多的连接拖垮。
- indexCounters:btree:misses 索引的不命中数，和hits的比例高就要考虑索引是否正确建立。你看我的”missRatio”3.543930204420982e-7，很健康吧。所以miss率在mongostat里面也可以看
- 其他的都能自解释，也不是查看mongo健康状况的关键，就不说明了。

详细的解释参考这里：[serverStatus](https://docs.mongodb.com/manual/reference/command/serverStatus/#dbcmd.serverStatus)


### db.currentOp()

Mongodb 的命令一般很快就完成，但是在一台繁忙的机器或者有比较慢的命令时，你可以通过db.currentOp()获取当前正在执行的操作。

在没有负载的机器上，该命令基本上都是返回空的

``` sh
>  db.currentOp()
{ "inprog" : [ ] }
```

以下是一个有负载的机器上得到的返回值样例：

``` sh
{ "opid" : "shard3:466404288", "active" : false, "waitingForLock" : false, "op" : "query", "ns" : "sd.usersEmails", "query" : { }, "client_s" : "10.121.13.8:34473", "desc" : "conn" },
```

字段名字都能自解释。如果你发现一个操作太长，把数据库卡死的话，可以用这个命令杀死他

``` sh
> db.killOp("shard3:466404288")
```

[db.currentOp()](https://docs.mongodb.com/manual/reference/method/db.currentOp/index.html)




## 压力测试


### 查询

100万数据 分页查询list count 秒出 ， agg聚合 3秒

1000万数据  分页查询 list  count 秒出 ，  agg 聚合 14秒

6000万数据  分页查询  list秒出  count 1秒时间  agg聚合时间  第一次 4分钟 第二次 1分钟24秒

6000万数据  条件分页查询  list秒出  count 40秒时间  agg聚合时间 2分11秒

1亿 分页查询  list  count 10秒时间  agg聚合时间 3分

1亿4000万数据  分页查询  list秒出  count 秒出  agg聚合时间 2分11秒

3亿数据  分页查询  list 1  count 1秒  agg聚合时间 30分

3亿数据  条件分页查询  list 1  count 3分钟  agg聚合时间 18分钟


插入测试：13:35分开始 1亿条 每秒插入速度2000-3000 预计12-13小时左右，实际用时30小时。



4亿数据  分页查询  list 1  count 1秒     agg聚合时间 45分

4亿数据  条件分页查询  list 1秒  count 6分钟  agg聚合时间 48分钟


插入测试  2017.08.30 13:15分开始 插入数据100亿  

