---
layout: post
title: springcloud(一)：大话springcloud
category: springcloud
tags: [springcloud]
---


研究了一段时间spring boot了准备向spirng cloud进发，公司架构和项目也全部拥抱了spring cloud。在使用了一段时间后发现spring cloud从技术架构上降低了对大型系统的构建的要求，使我们以非常低的成本（技术或者硬件）来非常容易的搭建一套高效、分布式、容错的平台，但spring cloud也不是没有缺点，小型独立的项目不适合使用，另外对分布式事物的支持暂时也没有。


##  spring cloud是什么鬼？

 微服务是可以独立部署、水平扩展、独立访问（或者有独立的数据库）的服务单元，springcloud就是这些微服务的大管家，采用了微服务这种架构之后，项目的数量会非常多，springcloud做为大管家需要管理好这些微服务，自然需要很多小弟来帮忙。 

 主要的小弟有：Spring Cloud Config、Spring Cloud Netflix（Eureka、Hystrix、Zuul、Archaius...）、Spring Cloud Bus、Spring Cloud for Cloud Foundry、Spring Cloud Cluster、Spring Cloud Consul、Spring Cloud Security、Spring Cloud Sleuth、Spring Cloud Data Flow、Spring Cloud Stream、Spring Cloud Task、Spring Cloud Zookeeper、Spring Cloud Connectors、Spring Cloud Starters、Spring Cloud CLI，每个小弟身怀独门绝技武功高强下面来做一一介绍。


## 小弟出场（全家桶）

### Spring Cloud Config

俗称的配置中心，配置管理工具包，让你可以把配置放到远程服务器，集中化管理集群配置，目前支持本地存储、Git以及Subversion。就是以后大家武器、枪火什么的东西都集中放到一起，别随便自己带，方便以后统一管理、升级装备。

### Spring Cloud Netflix

这可是个大boss，地位仅次于老大，老大各项服务依赖与它，与各种Netflix OSS组件集成，组成微服务的核心，它的小弟主要有Eureka, Hystrix, Zuul, Archaius... 太多了

#### Eureka

服务中心，云端服务发现，一个基于 REST 的服务，用于定位服务，以实现云端中间层服务发现和故障转移。这个可是springcloud最牛鼻的小弟，服务中心，任何小弟需要其它小弟支持什么都需要从这里来拿，同样的你有什么独门武功的都赶紧过报道，方便以后其它小弟来调用；它的好处是你不需要直接找各种什么小弟支持，值需要到服务中心来领取，也不需要知道提供支持的其它小弟在哪里，是几个小弟来支持的反正拿来用就行，服务中心来保证稳定性和质量。

#### Hystrix

熔断器，容错管理工具，旨在通过熔断机制控制服务和第三方库的节点,从而对延迟和故障提供更强大的容错能力。比如突然某个小弟生病了，但是你还需要它的支持，然后调用之后它半天没有响应，你却不知道，一直在等等这个响应；有可能别的小弟也正在调用你的武功绝技，那么当请求多之后，就会发生严重的阻塞影响老大的整体计划。这个时候Hystrix就派上用场了，当Hystrix发现某个小弟状态不稳定立马马上让它下线，让其它小弟来顶上来，或者给你说不用等了这个小弟今天肯定不行，该干嘛赶紧干嘛去别在这排队了。

#### Zuul

Zuul 是在云平台上提供动态路由,监控,弹性,安全等边缘服务的框架。Zuul 相当于是设备和 Netflix 流应用的 Web 网站后端所有请求的前门。当其它门派来找大哥办事的时候一定要先经过zuul,看下有没有带刀子什么的给兰回去，或者是需要找那个小弟的直接给带过去。

#### Archaius

配置管理API，包含一系列配置管理API，提供动态类型化属性、线程安全配置操作、轮询框架、回调机制等功能。

### Spring Cloud Bus

事件、消息总线，用于在集群（例如，配置变化事件）中传播状态变化，可与Spring Cloud Config联合实现热部署。相当于水浒传中日行八百里的神行太保戴宗，确保各个小弟之间消息保持畅通。

### Spring Cloud for Cloud Foundry

通过Oauth2协议绑定服务到CloudFoundry，CloudFoundry是VMware推出的开源PaaS云平台。

### Spring Cloud Cluster

提供Leadership选举，如：Zookeeper, Redis, Hazelcast, Consul等常见状态模式的抽象和实现。

### Spring Cloud Consul

封装了Consul操作，consul是一个服务发现与配置工具，与Docker容器可以无缝集成。

### Spring Cloud Security

基于spring security的安全工具包，为你的应用程序添加安全控制。这个小弟很牛鼻专门负责整个帮派的安全问题，设置不同的门派访问特定的资源，不能把秘籍葵花宝典泄漏了。

### Spring Cloud Sleuth

日志收集工具包，封装了Dapper和log-based追踪以及Zipkin和HTrace操作，为SpringCloud应用实现了一种分布式追踪解决方案。

### Spring Cloud Data Flow

大数据操作工具，作为Spring XD的替代产品，它是一个混合计算模型，结合了流数据与批量数据的处理方式。


### Spring Cloud Stream

数据流操作开发包，封装了与Redis,Rabbit、Kafka等发送接收消息。

### Spring Cloud Task

提供云端计划任务管理、任务调度。

### Spring Cloud Zookeeper

操作Zookeeper的工具包，用于使用zookeeper方式的服务发现和配置管理。

### Spring Cloud Connectors

便于云端应用程序在各种PaaS平台连接到后端，如：数据库和消息代理服务。

### Spring Cloud Starters

Spring Boot式的启动项目，为Spring Cloud提供开箱即用的依赖管理。

### Spring Cloud CLI

基于 Spring Boot CLI，可以让你以命令行方式快速建立云组件。