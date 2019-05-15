---
layout: post
title:  Spring Boot (十三)： Spring Boot 小技巧
category: springboot 
tags: [springboot]
copyright: java
---

一些 Spring Boot 小技巧、小知识点

##  初始化数据

我们在做测试的时候经常需要初始化导入一些数据，如何来处理呢？会有两种选择，一种是使用 Jpa，另外一种是 Spring JDBC 。两种方式各有区别下面来详细介绍。

**使用 Jpa**

在使用`spring boot jpa`的情况下设置`spring.jpa.hibernate.ddl-auto`的属性设置为 `create` or `create-drop`的时候，Spring Boot 启动时默认会扫描 classpath 下面（项目中一般是 resources 目录）是否有`import.sql`，如果有机会执行`import.sql`脚本。


**使用 Spring JDBC**

使用 Spring JDBC 需要在配置文件中添加以下配置

``` xml
spring:
    datasource:
        schema: classpath:db/schema.sql
        data: classpath:db/data.sql
      sql-script-encoding: utf-8
    jpa:
      hibernate:
        ddl-auto: none
```

- schema ：脚本中创建表的语句
- data ：脚本中初始化数据的预计
- sql-script-encoding：设置脚本的编码

Spring Boot 项目启动的时候会自动执行脚本。

**ddl-auto 四个值的解释**

> 1. create： 每次加载hibernate时都会删除上一次的生成的表，然后根据你的model类再重新来生成新表，哪怕两次没有任何改变也要这样执行，这就是导致数据库表数据丢失的一个重要原因。
> 2. create-drop ：每次加载hibernate时根据model类生成表，但是sessionFactory一关闭,表就自动删除。
> 3. update：最常用的属性，第一次加载hibernate时根据model类会自动建立起表的结构（前提是先建立好数据库），以后加载hibernate时根据 model类自动更新表结构，即使表结构改变了但表中的行仍然存在不会删除以前的行。要注意的是当部署到服务器后，表结构是不会被马上建立起来的，是要等 应用第一次运行起来后才会。
> 4.  validate ：每次加载hibernate时，验证创建数据库表结构，只会和数据库中的表进行比较，不会创建新表，但是会插入新值。
> 5、 none  : 什么都不做。

**不同点**

第一种方式启动的时候 Jpa 会自动创建表，import.sql 只负责创建表单后的初始化数据。第二种方式启动的时候不会创建表，需要在初始化脚本中判断表是否存在，再初始化脚本的步骤。

> 在生产中，这两种模式都建议慎用！

##  Thymeleaf 设置不校验 html 标签

默认配置下，Thymeleaf 对 .html 的内容要求很严格，比如`<meta charset="UTF-8" />`，如果少封闭符号`/`，就会报错而转到错误页。也比如你在使用 Vue.js 这样的库，然后有`<div v-cloak></div>`这样的 html 代码，也会被 Thymeleaf 认为不符合要求而抛出错误。

通过设置 Thymeleaf 模板可以解决这个问题，下面是具体的配置:

``` properties
spring.thymeleaf.cache=false
spring.thymeleaf.mode=LEGACYHTML5
```

LEGACYHTML5 需要搭配一个额外的库 NekoHTML 才可用，项目中使用的构建工具是 Maven 添加如下的依赖即可完成:

``` xml
<dependency>
	<groupId>net.sourceforge.nekohtml</groupId>
	<artifactId>nekohtml</artifactId>
	<version>1.9.22</version>
</dependency>
```

## 自定义 Favicon

Spring Boot 提供了一个默认的 Favicon，也就是 Spring 的 logo ，我们可以根据自己企业的需要来定制它。

首先需要在 application.propertie 中关闭原有的logo

``` properties
spring.mvc.favicon.enable=false 
```

在将自己的 favicon.ico 放到`src/main/resources/static`下 ，然后再重新启动项目就可以了。


> 文章内容已经升级到 Spring Boot 2.x 

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples)**

参考：

- [thymeleaf模板对没有结束符的HTML5标签解析出错的解决办法](http://blog.csdn.net/yalishadaa/article/details/60768811)
- [howto-database-initialization](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html)



