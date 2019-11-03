---
layout: post
title:  第42天： paramiko模块
category: python
copyright: python
---

by 某某白米饭

## paramiko 模块

paramiko 是一个用 Python 语言编写的、遵循 SSH2 协议、支持以加密和认证方式进行连接远程服务器的模块。改模块可以对远程服务器进行一些命令或文件操作。
<!--more-->

### 安装

使用 pip3 安装 paramiko 模块

```python
pip3 install paramiko
```

### 连接远程服务器

paramiko 模块连接远程服务器可以使用远程服务器的用户名、密码登录

```python
import paramiko

# 创建一个SSHClient对象
ssh = paramiko.SSHClient()
# 将信任的主机加到 host_allow 列表
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
# 连接服务器
ssh.connect("服务器IP地址", "服务器端口号", "用户名", "密码")
```

### 使用命令

在登录远程服务器后，利用 paramiko 模块可以使用 shell 命令操作远程服务器，比如：df 命令、pwd 命令、cat 命令等等...

```python
# 打印磁盘情况
# 执行df命令，结果放到 dfout 中，如果有错误将放到 dferr 中
dfout, dferr = ssh.exec_command('df')
print(dfout.read().decode('utf-8'))

# 使用cd、cat命令查看文件内容
# paramiko.txt文件为/root/data/paramiko.txt
catin, catout,caterr = ssh.exec_command('cd data;cat paramiko.txt')
print(catin.read().decode('utf-8'))
```

在 exec_command 函数中，exec_command 执行的是单个会话，执行完成后会回到登录的缺省目录，多个命令需要 命令1;命令2;命令3 的写法

### sftp上传和下载文件

```python
import paramiko

transport = paramiko.Transport(("服务器IP地址",服务器端口号))
transport.connect(username = "用户名", password = "密码")
sftp = paramiko.SFTPClient.from_transport(transport)
# 从远程服务器下载文件
# 远程服务器文件路径为/data/paramiko.txt
sftp.get('/data/paramiko.txt', 'paramiko.txt', print("下载完成！"))
# 从本地上传文件到远程服务器
sftp.put('upload_paramiko.txt', '/data/upload_paramiko.txt', print("上传完成！"))
```

### 服务器文件修改内容

sftp 对象可以在线修改远程服务器上文件的内容

```python
import paramiko

# 登录远程服务器
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("服务器IP地址",,"服务器端口号","用户名", "密码", timeout=5)
sftp = client.open_sftp()
# 远程服务器文件地址为/data/paramiko.txt
remoteFile = sftp.open("/data/paramiko.txt", 'a')
remoteFile.write("\n");
remoteFile.write("这里是追加的内容！");
remoteFile.close()
sftp.close()
```

### 查询文件

使用 sftp 对象获取远程服务器上的文件列表

```python
import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect("服务器IP地址",,"服务器端口号","用户名", "密码", timeout=5)
sftp = client.open_sftp()
for fileName in sftp.listdir("/root/data"):
    if fileName.endswith(".txt"):
        print(fileName)
sftp.close()
```

### 结语

以上是 paramiko 模块的基本操作，学会以上内容后在多个远程服务器的情况下，可以快速、便捷的操作服务器内容

> 示例代码：[Python-100-days-day042](https://github.com/JustDoPython/python-100-day/tree/master/day-042)