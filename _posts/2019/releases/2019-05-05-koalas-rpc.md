---
layout: post
title: 百亿级企业级 RPC 框架开源了！
category: it
tags: [it]
excerpt: 可靠的 RPC 框架技术方案
lock: need
---

今天给大家介绍给一款性能卓越的 RPC 开源框架，其作者就是我推荐每个 Java 程序员都应该看的[《Java 生态核心知识点整理》](http://www.ityouknow.com/java/2019/03/25/java-knowledge.html)的原作者张玉龙。

说实话我第一次看到这个资料的时候，就感觉作者是一位真正的技术爱好者，后来通过朋友介绍终于认识了他。交谈之中得知他在美团工作，最初和朋友一起整理这份资料的初衷是为了面试，估计每天需要面试太多的应聘者，这份资料成了助手。强烈建议没有看这份资料的同学学习下，作为 Java 生态知识体系构建也是一份不错的资源。

后来得知业余时间他在研发一款开源的 RPC 开源框架，并且经过测试可支持百亿级别的调用，并且于近期终于完成推出 1.0 版本。这款开源软件名字叫做 Koalas，源代码地址：[koalas-rpc](https://gitee.com/a1234567891/koalas-rpc)，下面对这款开源软件做详细介绍，内容来源于 Koalas 。

![](http://favorites.ren/assets/images/2019/it/koalas-rpc.png)


##  Koalas 介绍

企业生产级百亿日 PV 高可用可拓展的 RPC 框架。理论上并发数量接近服务器带宽，客户端采用 thrift 协议，服务端支持 netty 和 thrift 的 TThreadedSelectorServer 半同步半异步线程模型，支持动态扩容，服务上下线，权重动态，可用性配置，页面流量统计，支持 trace 跟踪等，天然接入 cat 支持数据大盘展示等，持续为个人以及中小型公司提供可靠的 RPC 框架技术方案。

> Thrift 是一种接口描述语言和二进制通讯协议，它被用来定义和创建跨语言的服务。它被当作一个远程过程调用（RPC）框架来使用，是由 Facebook 为“大规模跨语言服务开发”而开发的。

**为什么叫 koalas**

树袋熊英文翻译，希望考拉 RPC 给那些不太喜欢动手自己去造轮子的人提供可靠的 RPC 使用环境。

## 为什么要写这个 RPC

市面上常见的 RPC 框架很多，grpc，motan，dubbo 等，但是随着越来越多的元素加入，复杂的架构设计等因素似使得这些框架和 spring 一样，虽然号称是轻量级，但是用起来却是让我们很蹩脚，大量的配置，繁杂的 API 设计，其实，我们根本用不上这些东西！！！ 

我也算得上是在很多个互联网企业厮杀过，见过很多很多的内部 RPC 框架，有些优秀的设计让我非常赞赏，有一天我突然想着，为什么不对这些设计原型进行聚合归类，于是自己搞一套【轻量级】 RPC 框架呢，于是利用业余时间开发此项目，希望源码对大家对认识 RPC 框架起到推进的作用。

## 技术栈 

- thrift 0.8.0
- spring-core-4.2.5，spring-context-4.2.5，spring-beans-4.2.5
- log4j，slf4j
- org.apache.commons(v2.0+)
- io.netty4
- fastJson
- zookeeper
- 点评cat（V3.0.0+ 做数据大盘统计上报等使用，可不配置）
- AOP，反射代理等

## 技术架构

**Koalas 架构图**  
![](http://favorites.ren/assets/images/2019/it/koalas-rpc-00.png)


**序列化**

考察了很多个序列化组件，其中包括jdk原生，kryo、hessian、protoStuff,thrift，json等，最终选择了Thrift，原因如下：原生JDK序列化反序列化效率堪忧，其序列化内容太过全面kryo和hessian，json相对来说比原生JDK强一些，但是对跨语言支持一般，所以舍弃了，最终想在protoBuf和Thrift协议里面选择一套框架，这俩框架很相通，支持跨语言，需要静态编译等等。但是protoBuf不带RPC服务，本着提供多套服务端模式（thrift rpc，netty）的情况下，最终选择了Thrift协议。

**IO线程模型**

原生socket可以模拟出简单的RPC框架，但是对于大规模并发，要求吞吐量的系统来说，也就算得上是一个demo级别的，所以BIO肯定是不考虑了，NIO的模型在序列化技术选型的时候已经说了，Thrift本身支持很多个io线程模型，同步，异步，半同步异步等（SimpleServer，TNonblockingServer，THsHaServer，TThreadedSelectorServer，TThreadPoolServer），其中吞吐量最高的肯定是半同步半异步的IO模TThreadedSelectorServer了，具体原因大家可自行google，这次不做多的阐述，选择好了模型之后，发现thrift简直就是神器一样的存在，再一想，对于服务端来说，IO模型怎么能少得了Netty啊，所以下决心也要支持Netty，但是很遗憾Netty目前没有对Thrift的序列化解析，拆包粘包的处理，但是有protoBuf，和http协议的封装，怎么办，自己在netty上写对thrift的支持呗，虽然工作量大了一些，但是一想netty不就是干这个事儿的嘛- -！

**服务发现**

支持集群的RPC框架里面，像dubbo，或者是其他三方框架，对服务发现都进行的封装，那么自研RPC的话，服务发现就要自己来写了，那么简单小巧容易上手的zookeeper肯定是首选了。 

## 内容展示

**实际性能压测**

8C 16G mac 开发本，单机 10000 次请求耗时截图 

![](http://favorites.ren/assets/images/2019/it/koalas-rpc-01.png)

10w 次请求，大约耗时 12s，平均 qps 在8000左右，在集群环境下会有不错的性能表现

**数据大盘展示**

koalas2.0 已经接入了 cat 服务，cat 服务支持 qps 统计，可用率，tp90line,tp99line,丰富自定义监控报警等，接入效果图 

![](http://favorites.ren/assets/images/2019/it/koalas-rpc-02.png)

丰富的可视参数，流量统计，日，周，月报表展示等。

**链路跟踪**

对 RPC 服务来说，系统间的调用和排查异常接口，确定耗时代码是非常重要的，只要接入了 cat，koalsa-rpc 天然的支持链路跟踪，一切尽在眼前！ 

![](http://favorites.ren/assets/images/2019/it/koalas-rpc-03.png)

## 最后

作者非常具有技术情怀，在聊天中说就剩这点爱好了，要坚持下去。听了这句话啥都不说了，点击下方链接，先 Star 为敬。


[https://gitee.com/a1234567891/koalas-rpc](https://gitee.com/a1234567891/koalas-rpc)

