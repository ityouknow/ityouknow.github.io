---
layout: post
title: FastDFS并发会有bug，其实我也不太信？
category: life
tags: [life]
---

前一段时间，业务部门同事反馈在一次生产服务器升级之后，POS消费上传小票业务偶现异常，上传小票业务有重试机制，有些重试三次也不会成功，他们排查了一下没有找到原因，希望架构组帮忙解决。自从来了新的公司，我就成了救火队长，很多业务部门解决不了的问题都会跑到我这里，我也很乐意去做这些事情。

## 一些背景

我们公司使用的是FastDFS来做的图片服务器，生产使用了六台服务器外加一个存储，集群采用的是：2个tracker+4个storage，storage分为两个group，使用独立的nginx做文件代理访问。各软件版本信息如下：

- 操作系统：centos6.9
- FastDFS ：5.05
- libfastcommon：1.0.36
- nginx ：1.7.9      
- fastdfs-nginx-module：1.16

为了尽可能的模拟生产，我在测试环境1:1搭建了一套和生产一样的FastDFS集群，当时也写了搭建过程：[FastDFS 集群 安装 配置](http://www.ityouknow.com/fastdfs/2017/10/10/cluster-building-fastdfs.html)

## 从日志中找线索

业务部门同事反馈，在一次生产服务器升级之后，重新搭建了一套FastDFS集群，然后过了几天就开始出现小票上传失败的问题。根据这些细腻的反馈，我怀疑是否是FastDFS搭建有问题？这个怀疑点差点把我待到了沟里去。

我拉取了FastDFS的日志，tracker服务器日志如下：

``` text
[2017-09-19 09:13:52] ERROR - file: tracker_nio.c, line: 306, client ip: 192.168.0.1, pkg length: 15150 > max pkg size: 8192
[2017-09-19 10:34:57] ERROR - file: tracker_nio.c, line: 306, client ip: 192.168.0.1, pkg length: 16843 > max pkg size: 8192
[2017-09-19 10:34:57] ERROR - file: tracker_nio.c, line: 306, client ip: 192.168.0.1, pkg length: 16843 > max pkg size: 8192
[2017-09-19 11:31:08] ERROR - file: tracker_nio.c, line: 306, client ip: 192.168.03, pkg length: 23955 > max pkg size: 8192
[2017-09-19 11:42:56] ERROR - file: tracker_nio.c, line: 306, client ip: 192.168.01, pkg length: 12284 > max pkg size: 8192
[2017-09-19 12:10:28] ERROR - file: tracker_service.c, line: 2452, cmd=103, client ip: 192.168.0.3, package size 6258 is too long, exceeds 144

```

根据tracker的日志反馈是不时的有一些上传小票大于最大传输大小，跟着这个线索我顺着上传的那条线进行了排查，比如nginx上传大小的限制，tracker上传大小的限制，是不是生成的小票出现异常，大小突然变大。麻溜的整了半天得出结论，上传小票和这个异常没有关系。

接下来看了下storaged的日志。

``` text
[2017-09-25 14:22:38] WARNING - file: storage_service.c, line: 7135, client ip: 192.168.1.11, logic file: M00/D1/04/wKg5ZlnIoKWAAkNRAAAY86__WXA920.jpg-m not exist
[2017-09-25 14:22:39] WARNING - file: storage_service.c, line: 7135, client ip: 192.168.1.11, logic file: M00/D1/04/wKg5ZlnIoKuAUXeVAAAeASIvHGw673.jpg not exist
[2017-09-25 14:22:50] ERROR - file: storage_nio.c, line: 475, client ip: 192.168.1.13, recv failed, errno: 104, error info: Connection reset by peer
[2017-09-25 14:22:56] ERROR - file: tracker_proto.c, line: 48, server: 192.168.1.11:23001, response status 2 != 0
[2017-09-25 14:23:06] ERROR - file: tracker_proto.c, line: 48, server: 192.168.1.11:23001, response status 2 != 0
[2017-09-25 14:23:11] ERROR - file: storage_service.c, line: 3287, client ip:192.168.1.13, group_name: group2 not correct, should be: group1
```

出了看到一些文件不存在的警告和响应状态不对的错误外，也没有发现其它的异常。

最后来看应用中的错误日志，其中有两段错误日志引起了我的注意：

第一段日志如下：

``` text
org.csource.common.MyException: body length: 0 <= 16
	at org.csource.fastdfs.StorageClient.do_upload_file(StorageClient.java:799)
	at org.csource.fastdfs.StorageClient.upload_file(StorageClient.java:208)
	at org.csource.fastdfs.StorageClient.upload_file(StorageClient.java:226)
	at com.xxx.neo.fastdfs.FileManager.upload(FileManager.java:86)
	at com.xxx.neo.controller.QpayUploadSignController.saveSign(QpayUploadSignController.java:84)
	at com.xxx.neo.controller.QpayUploadSignController.uploadSign(QpayUploadSignController.java:65)
	at com.xxx.neo.controller.QpayUploadSignController$$FastClassByCGLIB$$5debf81b.invoke(<generated>)
	at net.sf.cglib.proxy.MethodProxy.invoke(MethodProxy.java:191)
	at org.springframework.aop.framework.Cglib2AopProxy$CglibMethodInvocation.invokeJoinpoint(Cglib2AopProxy.java:689)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:150)
```

跟了一下fastdfs-client-java中的源码的do_upload_file方法，有这么一段话：

``` java
ProtoCommon.RecvPackageInfo pkgInfo = ProtoCommon.recvPackage(storageSocket.getInputStream(),
              ProtoCommon.STORAGE_PROTO_CMD_RESP, -1);
//省略中间代码              
if (pkgInfo.body.length <= ProtoCommon.FDFS_GROUP_NAME_MAX_LEN) {
    throw new MyException("body length: " + pkgInfo.body.length + " <= " + ProtoCommon.FDFS_GROUP_NAME_MAX_LEN);
  }
```

pkgInfo是封装好的文件流信息，ProtoCommon是fastdfs-client-java中封装好的定制参数，其中FDFS_GROUP_NAME_MAX_LEN的值为16，代码的意思就是当读取的大小小于16字节的时候，报MyException异常。

第二段日志如下：


``` java
[ INFO] [http://*:8083-69096 2017-09-25 14:07:32] (FileManager.java:upload:92) upload_file time used:76 ms
[ INFO] [http://*:8083-69096 2017-09-25 14:07:32] (FileManager.java:upload:103) upload file successfully!!!group_name:group2, remoteFileName: M00/3C/A8/wKg5Z1nInSOAaHSNAAAdNipAyrQ611.jpg
upload file successfully!!!group_name:group2, remoteFileName: M00/3C/A8/wKg5Z1nInSOAaHSNAAAdNipAyrQ611.jpg
[Ljava.lang.String;@17584701
[ERROR] [http://*:8083-69087 2017-09-25 14:07:32] (FileManager.java:upload:90) Non IO Exception when uploadind the file:520
java.lang.NullPointerException
	at org.csource.fastdfs.StorageClient.do_upload_file(StorageClient.java:842)
	at org.csource.fastdfs.StorageClient.upload_file(StorageClient.java:208)
	at org.csource.fastdfs.StorageClient.upload_file(StorageClient.java:226)
	at com.xxx.neo.fastdfs.FileManager.upload(FileManager.java:86)
	at com.xxx.neo.controller.QpayUploadSignController.saveSign(QpayUploadSignController.java:84)
	at com.xxx.neo.controller.QpayUploadSignController.uploadSign(QpayUploadSignController.java:65)
	at com.xxx.neo.controller.QpayUploadSignController$$FastClassByCGLIB$$5debf81b.invoke(<generated>)
	at net.sf.cglib.proxy.MethodProxy.invoke(MethodProxy.java:191)
	at org.springframework.aop.framework.Cglib2AopProxy$CglibMethodInvocation.invokeJoinpoint(Cglib2AopProxy.java:689)
```

日志中关于空指针的异常最多，跟踪了下代码有这几处：

第一处：

``` java
storageSocket = this.storageServer.getSocket();
ext_name_bs = new byte[ProtoCommon.FDFS_FILE_EXT_NAME_MAX_LEN];
Arrays.fill(ext_name_bs, (byte) 0);
``` 

第二处：

``` java
if (!bNewConnection) {
    try {
      this.storageServer.close();
    } catch (IOException ex1) {
      ex1.printStackTrace();
    } finally {
      this.storageServer = null;
}
``` 

第三处：

``` java
if (bNewConnection) {
    try {
      this.storageServer.close();
    } catch (IOException ex1) {
      ex1.printStackTrace();
    } finally {
      this.storageServer = null;
    }
  }
``` 

这三个代码都有一个共同之处，就是都有storageServer的调用，并且在调用的地方出现了空指针异常，难倒fastdfs-client-java有bug？觉得不可能，会不会是我们使用的新版本太旧或者使用方式不对呢?

> 日志中的IP地址和公司信息均已进行脱敏

## FastDFS提供的Jar包有问题？

带着上面的怀疑我准备搞个多线程压测一下，看是不是并发的时候产生的问题。使用CountDownLatch让线程集中执行，代码如下：

``` java
private static void latchTest() throws InterruptedException {
        final CountDownLatch start = new CountDownLatch(1);
        final CountDownLatch end = new CountDownLatch(poolSize);
        ExecutorService exce = Executors.newFixedThreadPool(poolSize);
        for (int i = 0; i < poolSize; i++) {
            Runnable run = new Runnable() {
                @Override
                public void run() {
                    try {
                        start.await();
                        testLoad();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    } finally {
                        end.countDown();
                    }
                }
            };
            exce.submit(run);
        }
        start.countDown();
        end.await();
        exce.shutdown();
    }
``` 

使用Executors.newFixedThreadPool创建固定大小的线程池，刚开始设置的是12，每个线程执行一万次上传请求。

``` java
public static void testLoad() {
    String filePath="C:\\Users\\xxx\\Pictures\\xz.jpg";
    File file=new File(filePath);
    String serverUrl="http://localhost:8080/uploadSign";
    for (int i=0;i<10000;i++){
        HttpClientUtils.uploadFile(file,serverUrl);
    }
}
``` 

Controller层接到请求后，组装FastDFSFile进行上传

``` java
....
byte[] file_buff = null;
	if(inputStream!=null){
		int len1 = inputStream.available();
		file_buff = new byte[len1];
		inputStream.read(file_buff);
	}
FastDFSFile file = new FastDFSFile("520", file_buff, "jpg");
try {
	 fileAbsolutePath = FileManager.upload(file);  //上传到分布式文件系统
	System.out.println(fileAbsolutePath);
} catch (Exception e1) {
	e1.printStackTrace();
}
...
``` 

再进行一些封装之后，最终调用fastdfs-client-java的API upload_file()方法

``` java
uploadResults = storageClient.upload_file(file.getContent(), file.getExt(), meta_list);
``` 

压测代码写完之后，迫不及待的运行了起来，准备验证一把，结果非常出意料，刚一启动就不断的报空指针异常，看到这个空指针异常我却一阵欢喜，这个异常和我在生产看到的异常一模一样，最害怕遇到偶现的异常的问题，常常不知道异常的原因，一旦可以测试环境复现问题，那就意味着解决了一半的问题。

接下来，我将线程池的个数见到6个，启动测试后还是狂暴异常；接着将线程数减到2两，每个线程数执行的数量由以前的10000改为100个，改完后再进行测试还是报错；没办法改成一个线程来运行，果然程序可以正常上传小票了，看来是并发导致的问题。

那么生产环境应该是在业务高峰期间产生的并发才导致出现空指针异常，那为什么这个问题一直没有发现呢？有两方面的因素：第一，可能业务初期并发量并不是很高，这也不是主干业务，偶尔出现一两笔也没有发现；第二，生产环境使用了六台服务器做负载，请求都被均匀分发到六台服务器中，在某种程度上也避免了单台服务器的并发量，只有业务并发量进一步扩大才出现明显的异常。


## 尝试着去解决

既然异常都发生在upload_file方法storageServer出现的地方，那么我们就研究这个storageServer是个什么鬼？

storageServer根据属性名就可以看出来，storageServer代表了可以具体上传文件的storage存储节点，每次上传文件的时候从trackerServer中中获取。

跟踪storageServer类在两个地方可以初始化：第一，在初始化storageClient的时候

``` java
storageClient = new StorageClient(trackerServer, storageServer);
``` 

这里一般不是必须的，可以为空；一般会自动从trackerServer中获取，如果需要指定具体的storage可以在这里进行初始化。

第二，在调用do_upload_file方法开头中，下面代码截取于do_upload_file方法。

``` java
bUploadSlave = ((group_name != null && group_name.length() > 0) &&
        (master_filename != null && master_filename.length() > 0) &&
        (prefix_name != null));
if (bUploadSlave) {
  bNewConnection = this.newUpdatableStorageConnection(group_name, master_filename);
} else {
  bNewConnection = this.newWritableStorageConnection(group_name);
}

try {
  storageSocket = this.storageServer.getSocket();
...
``` 

在do_upload_file方法的开头，会根据条件运行this.newUpdatableStorageConnection(group_name, master_filename)方法或者his.newWritableStorageConnection(group_name)方法，在这俩个方法中都会有对storageServer进行初始化。我们这里只看一下newWritableStorageConnection(group_name)方法：

``` java
/**
* check storage socket, if null create a new connection
*
* @param group_name the group name to upload file to, can be empty
* @return true if create a new connection
*/
protected boolean newWritableStorageConnection(String group_name) throws IOException, MyException {
if (this.storageServer != null) {
  return false;
} else {
  TrackerClient tracker = new TrackerClient();
  this.storageServer = tracker.getStoreStorage(this.trackerServer, group_name);
  if (this.storageServer == null) {
    throw new MyException("getStoreStorage fail, errno code: " + tracker.getErrorCode());
  }
  return true;
}
}
```

首先会判断storageServer是否进行过初始化，如果没有初始化，从tracker中获取一个可用的storageServer进行初始化。初始化之后do_upload_file会根据拿到的storageServer进行文件上传操作。

**接下来到了全文最关键的地方的了，do_upload_file方法在上传文件结束的时候，将storageServer关闭并赋值为空。** 相关代码如下：

``` java
} catch (IOException ex) {
  if (!bNewConnection) {
    try {
      this.storageServer.close();
    } catch (IOException ex1) {
      ex1.printStackTrace();
    } finally {
      this.storageServer = null;
    }
  }

  throw ex;
} finally {
  if (bNewConnection) {
    try {
      this.storageServer.close();
    } catch (IOException ex1) {
      ex1.printStackTrace();
    } finally {
      this.storageServer = null;
    }
  }
}
```

当然这个逻辑是没有问题的，每次方法执行的时候获取一个可用的storageServer，结束的时候进行回收，避免每次都使用同一个storage。如果程序没有任何并发这段代码是没有问题的，如果出现并发呢，出现小的并发也不一定会出现问题，但是并非量稍微大一点的时候就一定会出现问题，这是为什么呢？

我们来继续跟踪storageServer，发现storageServer是StorageClient类的一个全局属性，当并发特别大的时候就有可能出现这样一个现象：第一个线程进这个方法的时候，看到storageServer没有初始化于是进行复制并继续往前走；这时候第二个线程又开始进入这个方法，发现storageServer已经进行了初始化，那就直接拿着用，继续执行；这个时候第一个线程因为先进do_upload_file方法因此这个时候快执行结束了，然后将storageServer进行关闭，并赋值为null，然后拍屁股走人了；这个时候可苦逼第二个线程了，他方法才执行了一般，当需要使用storageServer的时候，才发现storageServer已经为置为了null，于是就在使用storageServer报出了空指针异常，第二个线程，在挂掉的时候一定在想，真tm的坑爹。

于是上面的这个故事，就不时的在我们生产环境中上演。

后面我继续看了一下不但是do_upload_file会存在此问题，里面凡事这样使用storageServer的都会出现类似的并发问题，如：do_modify_file方法、delete_file方法等等。

那么既然找到了问题的根因，到底如何解决这个问题呢？解决这个问题的本质就是解决共享变量的并发问题，那解决共享变量并发有哪些手段呢？最常用有加锁，或者使用Threadlocal，看了一下使用Threadlocal进行改造工作量比较大，因此我最后选择使用了Synchronized同步锁来解决这个问题，就是在每个使用storageServer方法上面添加一个Synchronized关键字。

``` java
protected Synchronized  String[] do_upload_file
```

在github上面讲源码down下来 [fastdfs-client-java](https://github.com/happyfish100/fastdfs-client-java)，修改完之后在进行压测，妥妥的在不会报空指针异常类。

全文完。