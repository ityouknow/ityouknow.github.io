---
layout: post
title: hbase分布式集群搭建
category: hbase
tags: [hbase]
---

hbase和hadoop一样也分为单机版、伪分布式版和完全分布式集群版本，这篇文件介绍如何搭建完全分布式集群环境搭建。

hbase依赖于hadoop环境，搭建habase之前首先需要搭建好hadoop的完全集群环境，因此看这篇文章之前需要先看我的上一篇文章：[hadoop分布式集群搭建](http://www.ityouknow.com/hadoop/2017/07/24/hadoop-cluster-setup.html)。本文中没有按照独立的zookeeper，使用了hbase自带的zookeeper。

1、环境准备

- hbase软件包: http://mirror.bit.edu.cn/apache/hbase/1.3.1/hbase-1.3.1-bin.tar.gz  
- 完成hadoop集群环境搭建

2、安装hbase(在hadoop-master上)

``` shell 
wget http://mirror.bit.edu.cn/apache/hbase/1.3.1/hbase-1.3.1-bin.tar.gz
#解压
tar -xzvf hbase-1.3.1-bin.tar.gz  -C /usr/local/
#重命名 
mv hbase-1.3.1 hbase
```

配置环境变量```vim /etc/profile```

``` shell 
#内容
export HBASE_HOME=/usr/local/hbase
export PATH=$HBASE_HOME/bin:$PATH
#使立即生效
source /etc/profile
```

修改系统变量ulimit

``` shell 
ulimit -n 10240
```

3、 hbase配置文件修改

hbase 相关的配置主要包括hbase-env.sh、hbase-site.xml、regionservers三个文件，都在 /usr/local/hbase/conf目录下面：

配置hbase-env.sh

``` shell 
vim hbase-env.sh
#内容
export JAVA_HOME=/usr/lib/jvm/jre-1.7.0-openjdk.x86_64
export HBASE_CLASSPATH=/usr/local/hbase/conf
# 此配置信息，设置由hbase自己管理zookeeper，不需要单独的zookeeper。
export HBASE_MANAGES_ZK=true
export HBASE_HOME=/usr/local/hbase
export HADOOP_HOME=/usr/local/hadoop
#Hbase日志目录
export HBASE_LOG_DIR=/usr/local/hbase/logs
```

配置 hbase-site.xml

``` xml 
<configuration>
	<property>
		<name>hbase.rootdir</name>
		<value>hdfs://hadoop-master:9000/hbase</value>
	</property>
	<property>
		<name>hbase.cluster.distributed</name>
		<value>true</value>
	</property>
	<property>
		<name>hbase.master</name>
		<value>hadoop-master:60000</value>
	</property>
	<property>
		<name>hbase.zookeeper.quorum</name>
		<value>hadoop-master,hadoop-slave1,hadoop-slave2,hadoop-slave3</value>
	</property>
</configuration>
```

配置regionservers

``` shell 
vim /usr/local/hbase/conf/regionservers
hadoop-master
hadoop-slave1
hadoop-slave2
hadoop-slave3
```

复制hbase到从节点中

``` shell 
scp -r /usr/local/hbase hadoop-slave1:/usr/local/
scp -r /usr/local/hbase hadoop-slave2:/usr/local/
scp -r /usr/local/hbase hadoop-slave3:/usr/local/
```

4. 启动hbase（仅在master节点上执行即可）

``` shell 
~/hbase/bin/start-hbase.sh
```

启动后，master上进程和slave进程列表

master中的信息

``` shell 
[hadoop@master ~]$ jps
6225 Jps
2897 SecondaryNameNode   # hadoop进程
2710 NameNode            # hadoop master进程
3035 ResourceManager     # hadoop进程
5471 HMaster             # hbase master进程
2543 HQuorumPeer         # zookeeper进程
```

salve中的信息

``` shell 
[hadoop@slave1 ~]$ jps
4689 Jps
2533 HQuorumPeer          # zookeeper进程
2589 DataNode             # hadoop slave进程
4143 HRegionServer        # hbase slave进程
```

因为hbase依赖于hadoop，因此启动和停止都是需要按照顺序进行

如果安装了独立的zookeeper

启动顺序: ```hadoop-> zookeeper-> hbase```
停止顺序：```hbase-> zookeeper-> hadoop```

使用自带的zookeeper

启动顺序: ```hadoop-> hbase```
停止顺序：```hbase->  hadoop```


重启hbase

~/hbase/bin/stop-hbase.sh
~/hadoop/sbin/stop-all.sh
~/hadoop/sbin/start-all.sh
~/hbase/bin/start-hbase.sh



参考:  
[centos 6.4下hbase 1.0.1 分布式集群搭建](http://www.ixirong.com/2015/05/25/how-to-install-hbase-cluster/)
