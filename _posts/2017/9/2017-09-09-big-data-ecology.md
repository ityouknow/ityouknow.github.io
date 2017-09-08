---
layout: post
title: 
category: bigdata
tags: [bigdata]
---


2003年，Google发表了三篇大数据技术论文：《MapReduce》、《Google File System》、《Big Table》。这三篇论文描述了采用分布式计算方式来进行大数据处理的全新思路, 其主要思想是将任务分解，然后在多台处理能力较弱的计算节点中同时处理, 最后将结果合并从而完成大数据处理。



Yahoo投入了大量的资源到Hadoop的研究中，目前Yahoo在Hadoop上的贡献率占了70%。从2005年起，Yahoo就成立了专门的团队，致力于推动Hadoop的研发，并将集群从20个节点发展到2011年的42000个节点，初具生产规模。在应用领域，Yahoo更是积极地将Hadoop应用于自己的各种产品中，在搜索排名、内容优化、广告定位、反垃圾邮件、用户兴趣预测等方面得到了充分的应用。
http://www.sohu.com/a/133828001_464033


Hadoop框架最核心的设计是：HDFS和MapReduce。HDFS用于非结构化海量数据的存储，MapReduce则为海量数据提供了计算。


adoop MapReduce计算模型虽然大行其道，并且在海量数据分析领域成绩斐然，被很多公司广泛采用。但是，因为Hadoop MapReduce每次操作之后将所有数据写回到物理存储介质（磁盘）上，而使海量数据的处理性能大大折扣，这是一个令人头痛的问题！
2009年，Spark诞生于伯克利AMPLab，2010年开源。
http://blog.csdn.net/xwc35047/article/details/51072145




Spark特点

Spark之所以这么受关注，主要是因为其有与其他大数据平台不同的特点，主要如下。 
1．轻量级快速处理 
大数据处理中速度往往被置于第一位，Spark允许传统Hadoop集群中的应用程序在内存中以100倍的速度运行，即使在磁盘上运行也能快10倍。Spark通过减少磁盘IO来达到性能的提升，它们将中间处理数据全部放到了内存中。Spark使用了RDD（Resilient Distributed Datasets）数据抽象，这允许它可以在内存中存储数据，只在需要时才持久化到磁盘。这种做法大大的减少了数据处理过程中磁盘的读写，大幅度的降低了运行时间。

2．易于使用 
Spark支持多语言。Spark允许Java、Scala、Python及R（Spark 1.4版最新支持），这允许更多的开发者在自己熟悉的语言环境下进行工作，普及了Spark的应用范围，它自带80多个高等级操作符，允许在shell中进行交互式查询，它多种使用模式的特点让应用更灵活。

3．支持复杂查询 
除了简单的map及reduce操作之外，Spark还支持filter、foreach、reduceByKey、aggregate以及SQL查询、流式查询等复杂查询。Spark更为强大之处是用户可以在同一个工作流中无缝的搭配这些功能，例如Spark可以通过Spark Streaming（1.2.2小节对Spark Streaming有详细介绍）获取流数据，然后对数据进行实时SQL查询或使用MLlib库进行系统推荐，而且这些复杂业务的集成并不复杂，因为它们都基于RDD这一抽象数据集在不同业务过程中进行转换，转换代价小，体现了统一引擎解决不同类型工作场景的特点。有关Streaming技术以及MLlib库和RDD将会这之后几个章节进行详述。

4．实时的流处理 
对比MapReduce只能处理离线数据，Spark还能支持实时流计算。Spark Streaming主要用来对数据进行实时处理，当然在YARN之后Hadoop也可以借助其他的工具进行流式计算。对于Spark Streaming，著名的大数据产品开发公司Cloudera曾经对Spark Streaming有如下评价： 
1）简单、轻量且具备功能强大的API，Sparks Streaming允许用户快速开发流应用程序。 
2）容错能力强，不像其他的流解决方案，比如使用Storm需要额外的配置，而Spark无需额外的代码和配置，因为直接使用其上层应用框架Spark Streaming就可以做大量的恢复和交付工作，让Spark的流计算更适应不同的需求。 
3）集成性好，为流处理和批处理重用了同样的代码，甚至可以将流数据保存到历史数据中（如HDFS）。

5．与已存Hadoop数据整合 
Spark不仅可以独立的运行（使用standalone模式），还可以运行在当下的YARN管理集群中。它还可以读取已有的任何Hadoop数据，这是个非常大的优势，它可以运行在任何Hadoop数据源上，比如HBase、HDFS等。如果合适的话，这个特性让用户可以轻易迁移已有Hadoop应用。

6．活跃和不断壮大的社区 
Spark起源于2009年，当下已有超过50个机构730个工程师贡献过代码，与2014年6月相比2015年代码行数扩大了近三倍（数据源于Spark Summit 2015公布的数据），这是个惊人的增长。