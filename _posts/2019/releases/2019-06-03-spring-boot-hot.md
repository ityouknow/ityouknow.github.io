---
layout: post
title: Spring Boot 为什么这么火？
category: springboot
tags: [springboot]
keywords: Spring Boot
---

没错 Spring Boot 越来越火了，而且火的超过了我的预期，作为一名行走一线的 Java 程序员，你可能在各个方面感受到了 Spring Boot 的火。

## Spring Boot 的火

技术社区 Spring Boot 的文章越来越多；Spring Boot 相关的图文、视频课程越来越多；使用 Spring Boot 的互联网公司越来越多；现在出去面试 Java 工程师， Spring Boot 已经成了必问的内容。

一切都在证明，Spring Boot 已经成为了 Java 程序员必备的技能。并且可以预见的是未来 Spring Boot 的发展还会更好。

那我个人是如何感受到这一点呢？

三年前写的一个 Spring Boot 入门的文章，单篇文章阅读量超过百万！在百度指数上搜索 Spring Boot 关键字，可以看到一个气势如虹的增长曲线。

![](http://favorites.ren/assets/images/2019/springboot/spring-boot-hot-01.jpg)

2016年，在 Github 上写了一个 Spring Boot 的开源项目，现在竟有 15000+ Star，6600 + Fork ，在 Github 上 Star 排名今次于 Spring Boot 官方。

![](http://favorites.ren/assets/images/2019/springboot/spring-boot-hot-02.jpg)

项目名称：spring-boot-examples  

项目地址：

[https://github.com/ityouknow/spring-boot-examples](https://github.com/ityouknow/spring-boot-examples)

>注：这个开源项目还有很多国际友人参与贡献。

Spring 官方也特别特别重视 Spring Boot ，直接将 Spring Boot 摆放到官网第一的位置上来。

![](http://favorites.ren/assets/images/2019/springboot/spring-boot-hot-03.jpg)

## Spring Boot 为什么这么火

作为一个学习使用三年多 Spring Boot 的程序员，我来试着从我的角度来给大家聊聊 Spring Boot 为什么这么火，可以在短短几年内给 Java 程序员带来这么大的变革。

### 从设计理念谈起

要说到 Spring Boot 为什么这么火，就必须得聊聊 Spring Boot 的设计理念，正是此设计理念奠基了Spring Boot 开发设计的基准，让 Spring Boot 走到了今天。

那 Spring Boot 的设计理念是什么呢？它就是**约定优于配置（convention over configuration）。**

约定优于配置并不是一个新概念，它是一种软件设计范式，很早就应用在软件架构设计中，它的作用是减少软件开发人员需做决定的数量，获得简单的好处，而又不失灵活性。

只是 Spring Boot 让这个设计理念上升了一个层次，Spring Boot 不止在某个功能上实现此设计理念，而是整个软件体系都在践行约定优于配置。

Spring Boot 体系将约定优于配置的思想展现得淋淋尽致，小到配置文件，中间件的默认配置，大到内置容器、生态中的各种 Starters 无不遵循此设计规则。

Spring Boot Jpa 80% 大部分查询功能都以约定的方式给与提供，另外 20% 复杂的场景，提供另外的技术手段来解决，典型的约定优于配置的实现。

Spring Boot Starter ，在项目启动的时候，根据约定信息对组件进行加载、初始化。因此项目中引入了对于的 Starter 之后，就可以到达开箱即用的效果。

甚至 Spring Cloud 的设计，也借鉴了约定优于配置的思想，很多组件都是在启动时，默认提供了其相关的功能，可以让我们的使用到达很少配置或者零配置。

### Spring Boot 的 Starter 机制

Spring Boot Starter  是 Spring Boot 的 星辰大海。

正是因为丰富的 Spring Boot Starter  ，让 Spring Boot 征服了使用各个开源软件的开发者，只要 Spring Boot Starter 指向哪个开源软件，就会让某个开源软件变得异常好用。

这真的是这样，有一种神笔马良的感觉（夸张了一点）。

**那什么是 Spring Boot Starter 呢？**

在 Spring Boot 中，Starter 是为快速应用开发提供“一站式服务”的依赖（Dependency）。Starter 使得开发人员在开始编写新的模块时不需要拷贝样板式的配置文件、编写样板式的代码，只需要提供最简单的配置即可开始编程。

Spring Boot Starter 有两个核心组件：自动配置代码和提供自动配置模块及其它有用的依赖。也就意味着当我们项目中引入某个 Starter ，即拥有了此软件的默认使用能力，除非我们需要特定的配置，一般情况下我仅需要少量的配置或者不配置即可使用组件对应的功能。

Spring Boot 由众多 Starter 组成，随着版本的推移 Starter 家族成员也与日俱增。在传统 Maven 项目中通常将一些层、组件拆分为模块来管理，以便相互依赖复用，在 Spring Boot 项目中我们则可以创建自定义 Spring Boot Starter 来达成该目的。

**Spring Boot Starter 统一了使用不同软件的编程体验。**

在没有使用 Spring Boot Starter 之前，我们需要按照每个开源软件的特性，将对应的组件包集成到我们的开发项目中，因为每个组件的设计理念和开发团队都不一致，因此会有很多不同的调用风格在我们的项目中。

Spring Boot 强大到很多技术社区都主动提供了对应的 Starter 组件，比如 MyBatis 、Apache Camel、Apache CXF 等等。随着 Spring Boot 的发展 Starter 组件会越来越多。

Spring Boot 非常强大的原因之一就是提供了大量的 Spring Boot Starter ，如此多的“开箱即用” 的依赖模块，让我们在日常开发中“拿来即用”，以便更加快速和高效专注于业务开发。

### Spring Boot 的豪华开发团队

我们经常会看到在介绍 Spring Boot 的时候有这么一句：Spring Boot 是由 Pivotal 团队提供的全新框架。由此我们得知 Spring Boot 是由 Pivotal 团队所研发，那么 Pivotal 团队到底是一个什么样的团队呢？其实这里的 Pivotal 团队是指 Pivotal 公司。

Pivotal 公司介绍：致力于“改变世界构造软件的方式（We are transforming how the world builds software）”，提供云原生应用开发 PaaS 平台及服务，帮助企业客户采用敏捷软件开发方法论，从而提高软件开发人员工作效率、减少运维成本，实现数字化转型、IT 创新，并最终实现业务创新。

Pivotal 公司可谓是大牛云集，公司研发的产品有： Spring 以及衍生框架、缓存中间件 Redis、消息队列框架 RabbitMQ、数据引擎产品 Greenplum，还有 Tomcat、Groovy 里的一些顶级开发者，DevOps 理论的提出者都在这个公司。

2016 年风靡全球的云原生理念亦是 Pivotal 公司提出，美国硅谷著名的精益化创业书籍的作者 Eric Ries 也加入了 Pivotal公司。Spring Boot 为什么如此的优秀，正是因为背后有这些全球的顶级开发者。

Pivotal 公司的背后其实是一场商业并购大片，有很多著名的公司在其身后，戴尔、Spring、EMC、VMware 等等，详情大家开源看这篇文章：[《是时候给大家介绍 Spring Boot/Cloud 背后豪华的研发团队了》](http://www.ityouknow.com/springboot/2019/01/03/spring-pivotal.html)。

### 有个好干爹

Spring Boot 的干爹是谁呢？毫无疑问就是 Spring 了。有图为证，看下面：

![](http://favorites.ren/assets/images/2019/springboot/spring-boot-hot-04.jpg)

Spring Boot 完全依赖 Spring 来开发，发明 Spring Boot 也是为了让大家更好的使用 Spring，而不是消灭 Spring ，所以说没有 Spring 这个干爹，就没有 Spring Boot 。

当然 Spring Boot 不仅是基于 Spring 开发这么简单，Spring Boot 完全继承了 Spring 干爹的声誉，说实话如果没有 Spring 这个老干爹十多年来打拼下来的天气，哪有 Spring Boot 今天来的风光。

2002 年的时候， Rod Johnson 可能也没有想到自己开创的一个小开源软件，可以发展到今天这么辉煌的一刻。到了今天，如果一个 Java 程序员说自己不知道 Spring ，那估计会把他当作外星人吧。

Spirng 当时以 IoC 和 Aop 开始发家，一开始的目标只是想干掉 EJB 这个庞然大物，但是随着时间的发展，Spring 开始了一路的逆袭之路，在2010年的时候 Spring 还是 SSH 三大框架之一，到了今天 Spring 要说自己是老二，还这没有人敢说自己是第一。

正是因为 Spring 在 Java 社区中有如此强大的影响力，所以在 Spring Boot 一出生的时候，就受到了广大社区爱好者的关注、使用、写教程、贡献代码、提 Bug。正是因为庞大的开源爱好者，才一起反铺 Spring Boot ，让 Spring Boot 发展这么快，这么好。

如果你想系统的学习 Spring Boot ，给大家推荐一个 Spring Boot 中文索引，收集了 Spring Boot 中文社区的所有学习资料，地址： [http://springboot.fun/](http://springboot.fun/)。

以上便是我个人对 Spring Boot 为什么这么火的一些浅薄见解，大家是怎么认为的呢，欢迎给我留言。


---

***作者简介**：纯洁的微笑，**一个有故事的程序员**。曾在互联网金融，第三方支付公司工作，现为一名自由职业者，和你一起用技术的角度去看这个世界。我的个人微信号 **puresmilea**，欢迎大家找我聊天，记录你我的故事。*





