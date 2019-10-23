---
layout: post
title:  第27天：Python shutil 模块
category: python
copyright: python
---

>  by 程序员野客

shutil 可以看作 sh + util，即 shell 工具之意，该模块提供了一些针对文件和文件夹的高级操作，如：拷贝、删除、移动等，shutil 模块是对 os 模块的补充。

<!--more-->

## 1 文件和文件夹操作

**1）copyfileobj(fsrc, fdst, length=16*1024)**

复制对象 fsrc 的内容到 fdst，如果 fdst 不存在则自动创建，length 表示缓冲大小，如果是负数表示直接复制，默认为值为 16*1024。示例如下：

```
s = open('folder1/fsrc.txt','r')
d = open('folder1/fdst.txt','w')
shutil.copyfileobj(s,d,16*1024)
```

**2）shutil.copyfile(src, dst, \*, follow_symlinks=True)**

复制文件 src 的内容到 dst 并返回 dst，如果 dst 不存在则自动创建，src 和 dst 是字符串类型的路径名，如果 src 和 dst 指向同一个文件，抛出 SameFileError。示例如下：

```
shutil.copyfile('folder1/fsrc.txt','folder1/fdst.txt')
```

**3）copymode(src, dst, \*, follow_symlinks=True)**

复制文件 src 的权限到 dst，src 和 dst 是字符串类型的路径名，如果 follow_symlinks 为 False 且 src 和 dst 都是符号链接，将修改 dst 符号链接文件而非源文件的权限。示例如下：

```
shutil.copymode('folder1/fsrc.txt','folder1/fdst.txt')
```

> 注：符号链接（软链接）是一类特殊的文件， 其包含有一条以绝对路径或者相对路径的形式指向其它文件或者目录的引用。

**4）copystat(src, dst, \*, follow_symlinks=True)**

复制 src 的权限、最后访问时间、最后修改时间以及标志到 dst，src 和 dst 是字符串类型的路径名，可以是文件或目录，在Linux平台上还会复制扩展属性。示例如下：

```
shutil.copystat('folder1/fsrc.txt','folder1/fdst.txt')
```

>扩展文件属性是文件系统的一个功能，它允许用户将计算机文件与未被文件系统所解释的元数据关联起来。

**5）copy(src, dst, \*, follow_symlinks=True)**

复制文件 src 的内容和权限到 dst，dst 可以是文件或文件夹，如果是文件，函数的返回值就是 dst，如果是文件夹，函数的返回值就是 src 的文件名与 dst 的路径拼接，src 和 dst 都是字符串类型，如果 dst 指向一个文件夹，则创建与 src 同名的新文件。示例如下：

```
# dst 为文件
shutil.copy('folder1/fsrc.txt','folder1/fdst.txt')

# dst 为文件夹
shutil.copy('folder1/fsrc.txt', 'tmp/')
```

**6）copy2(src, dst, \*, follow_symlinks=True)**

该方法会保留 src 的所有元数据(如创建时间、修改时间等)，其他与 copy() 相同，当 follow_symlinks 为 False 且 src 为软链接时，dst 将作为软链接被创建并拷贝 src 的所有元数据到 dst。示例如下：

```
shutil.copy2('folder1/fsrc.txt','folder1/fdst.txt')
```

**7）ignore_patterns(\*patterns)**

创建并返回一个函数，可传递到 copytree() 中作为 ignore 参数的值，忽略满足匹配模式的文件和目录。示例如下：

```
shutil.ignore_patterns('tmp*')
```

**8）copytree(src, dst, symlinks=False, ignore=None, copy_function=copy2, ignore_dangling_symlinks=False)**

递归复制以 src 为根目录的整个目录树，返回目标目录 dst，dst 必须是不存在的目录，它和它不存在的父目录都将被创建，使用 copystat() 复制目录元数据，使用 copy2() 复制文件内容和元数据。

* symlinks：是否复制软链接；
* ignore：指定不参与复制的文件，其值应该是一个 ignore_patterns() 方法；
* copy_function：指定复制的模式。

示例如下：

```
shutil.copytree('folder1', 'folder2', ignore=shutil.ignore_patterns( 'tmp*'))
```

**9）rmtree(path, ignore_errors=False, onerror=None)**

删除目录，path 必须指定一个目录。示例如下：

```
shutil.rmtree('rm')
```

**10）move(src, dst, copy_function=copy2)**

移动文件或目录到目标位置，如果目标位置 dst 是一个存在的目录，将 src 移动到 dst 路径下。示例如下：

```
shutil.move('folder1/', 'folder2/')
```

**11）disk_usage(path)**

检测磁盘使用信息，返回值为元组。示例如下：

```
print(shutil.disk_usage('folder1/'))

# 输出结果
# usage(total=107375226880, used=69274427392, free=38100799488)
```

**12）which(cmd, mode=os.F_OK \| os.X_OK, path=None)**

返回 cmd 调用的可执行文件路径，没有返回 None。mode：用于判断文件是否存在或可执行，path：cmd 的查找路径。示例如下：

```
print(shutil.which('python'))

# 输出结果
# E:\Python3\python.EXE
```

**13）chown(path, user=None, group=None)**

改变指定 path 的所有者和所属组，user 和 group 参数，可以是系统上的用户名、组名或 uid/gid，至少需要传递其中一个参数。

## 2 归档操作

**1）make_archive(base_name, format, root_dir=None, base_dir=None, verbose=0, dry_run=0, owner=None, group=None, logger=None)**

创建归档文件，并返回归档文件的名称。

* base_name：要创建的归档文件的名称，可以包含路径表示归档文件的目标位置；
* format：归档文件的格式(zip、tar、 gztar、bztar、xztar)；
* root_dir：归档文件的根目录(默认当前目录)；
* base_dir：归档文件中所有文件和目录的前缀路径(默认当前目录)；
* dry_run：如果为 True，不创建归档文件。
* owner/group：归档文件中所有文件和目录的所属用户和组，如果 format 为 zip，owner 和 group 的配置不生效；
* logger：通常使用 logging.Logger 对象；
* verbose：已弃用。

看下示例：

```
# zipfile:生成文件名；归档 tmp 目录下文件和文件夹
shutil.make_archive('zipfile', 'zip', 'tmp')
```

**2）get_archive_formats()**

返回支持的归档格式列表，列表中的每个元素是 (name, description) 形式的元组。示例如下：

```
print(shutil.get_archive_formats())

# 输出结果
# [('bztar', "bzip2'ed tar-file"), ('gztar', "gzip'ed tar-file"), ('tar', 'uncompressed tar file'), ('xztar', "xz'ed tar-file"), ('zip', 'ZIP file')]
```

**3）register_archive_format(name, function, extra_args=None, description='')**

注册一个格式名并绑定到一个压缩时使用的程序，function 是用于解包存档文件的可调用函数。

**4）unregister_archive_format(name)**

从支持的归档格式中移除 name。

**5）unpack_archive(filename, extract_dir=None, format=None)**

解压归档文件。filename：归档文件名称；extract_dir：归档文件解压的目标位置；format：使用指定格式的解压器解压归档文件。

**6）register_unpack_format(name, extensions, function, extra_args=None, description='')**

注册格式为 name 的解压器。

**7）unregister_unpack_format(name)**

从支持的解压格式中移除 name。

**8）get_unpack_formats()**

返回支持的解压格式列表，列表中的每个元素是 (name, extensions, description) 形式的元组。

## 3 查询终端大小

**get_terminal_size()**

查询终端大小。示例如下：

```
print(shutil.get_terminal_size())

# 输出结果
# os.terminal_size(columns=80, lines=24)
```

> 示例代码：[Python-100-days-day027](https://github.com/JustDoPython/python-100-day/tree/master/day-027)

参考：

[https://docs.python.org/3.3/library/shutil.html](https://docs.python.org/3.3/library/shutil.html)

[http://liujiangblog.com/course/python/61](http://liujiangblog.com/course/python/61)


