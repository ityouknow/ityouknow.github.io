
## 环境准备

系统系统 centos6.5        
六台服务器：192.168.0.86/71/72/73/74/75  
安装包： 

``` sh
fastdfs-5.05.tar.gz
libfastcommon-1.0.36.zip
nginx-1.7.9.tar.gz
```

服务器规划

tracker服务器：192.168.0.86/71  
storage服务器：192.168.0.72/73/74/75 


安装

``` sh
#安装依赖软件
yum install gcc gcc-c++ kernel-devel pcre pcre-devel make libevent perl perl-devel gzip gzip-devel

tar -xvzf fastdfs-5.05.tar.gz -C /usr/local/
unzip libfastcommon-1.0.36.zip  -d /usr/local/
 
cd /usr/local/libfastcommon-1.0.36
./make.sh
./make.sh install

cd /usr/local/fastdfs-5.05
./make.sh
./make.sh install
```


配置tracker（86、71）

``` sh
# 存储日志和数据的根目录
mkdir /root/fastdfs

cd /etc/fdfs
cp tracker.conf.sample tracker.conf

vi tracker.conf
base_path=/root/fastdfs  

# 设置开机启动
chkconfig fdfs_trackerd on

cp /etc/init.d/fdfs_trackerd  /usr/local/bin/  
cp /usr/local/fastdfs-5.05/*.sh /usr/local/bin/

/etc/init.d/fdfs_trackerd start #启动
/etc/init.d/fdfs_trackerd stop  #停止
```

配置storage

``` sh
# 分组
group1 （72、73）
group2 （74、75）
``` 

``` sh
# 存储日志和数据的根目录
mkdir /root/fastdfs

cd /etc/fdfs
cp storage.conf.sample storage.conf

vi /etc/fdfs/storage.conf
# 修改的内容如下:
group_name=group1                   # 组名（第一组为group1，第二组为group2，依次类推...）
base_path=/root/fastdfs             # 数据和日志文件存储根目录
store_path0=/root/fastdfs           #第一个存储目录，第二个存储目录起名为：store_path1=xxx，其它存储目录名依次类推...
store_path_count=1                  # 存储路径个数，需要和store_path个数匹配
tracker_server=192.168.0.86:22122          # tracker服务器IP和端口
tracker_server=192.168.0.71:22122          # tracker服务器IP和端口

# 设置开机启动
chkconfig fdfs_storaged on

cp /etc/init.d/fdfs_trackerd  /usr/local/bin/  
cp /usr/local/fastdfs-5.05/*.sh /usr/local/bin/

/etc/init.d/fdfs_storaged start #启动
/etc/init.d/fdfs_storaged stop  #停止

# 所有存储节点都启动之后，可以在任一存储节点上使用如下命令查看集群的状态信息：
fdfs_monitor /etc/fdfs/storage.conf
``` 