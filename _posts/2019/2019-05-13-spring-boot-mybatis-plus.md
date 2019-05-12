---
layout: post
title: Spring Boot 2 (十一)：如何优雅的使用 MyBatis 之 MyBatis-Plus
category: springboot
tags: [springboot]
keywords: Spring Boot,MyBatis,MyBatis-Plus
---

前两天在公众号中发了[《Spring Boot(六)：如何优雅的使用 Mybatis》](http://www.ityouknow.com/springboot/2016/11/06/spring-boot-mybatis.html)，有朋友留言说能不能写一下整合 MyBatis-Plus 的教程。

在这之前我对 MyBatis-Plus 其实了解不是很多，一般情况下也不太愿意使用第三方的组件。找时间了解了一下 MyBatis-Plus 发现还是国人出品的开源项目，并且在 Github 上有 5000 多个关注，说明在国内使用的用户已经不少。

这篇文章就给大家介绍一下，如何在 Spring Boot 中整合 MyBatis-Plus 使用 MyBatis。


## MyBatis-Plus 介绍

MyBatis-Plus（简称 MP）是一个 MyBatis 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

> 官方愿景：成为 MyBatis 最好的搭档，就像 魂斗罗 中的 1P、2P，基友搭配，效率翻倍。

根据愿景甚至还设置了一个很酷的 Logo。

![](https://mp.baomidou.com/img/relationship-with-mybatis.png)

**特性**

官网说的特性太多了，挑了几个有特定的分享给大家。

- 无侵入：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑
- 损耗小：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作
- 强大的 CRUD 操作：内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求
- 支持 Lambda 形式调用：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错
- 支持多种数据库：支持 MySQL、MariaDB、Oracle、DB2、H2、HSQL、SQLite、Postgre、SQLServer2005、SQLServer 等多种数据库
- 内置分页插件：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询

## 快速上手








参考出处：

https://mp.baomidou.com/guide 