---
layout: post
title: Spring Boot 2 (十一)：如何优雅的使用 MyBatis 之 MyBatis-Plus
category: springboot
tags: [springboot]
keywords: Spring Boot,MyBatis,MyBatis-Plus
---

MyBatis-Plus 是 MyBatis 的第三方使用插件。

前两天在公众号中发了[《Spring Boot(六)：如何优雅的使用 Mybatis》](http://www.ityouknow.com/springboot/2016/11/06/spring-boot-mybatis.html)，有朋友留言说能不能写一下整合 MyBatis-Plus 的教程。

在这之前我对 MyBatis-Plus 其实了解不是很多，一般情况下也不太愿意使用第三方的组件。找时间了解了一下 MyBatis-Plus 发现还是国人出品的开源项目，并且在 Github 上有 5000 多个关注，说明在国内使用的用户已经不少。

这篇文章就给大家介绍一下，如何在 Spring Boot 中整合 MyBatis-Plus 使用 MyBatis。


## MyBatis-Plus 介绍

MyBatis-Plus（简称 MP）是一个 MyBatis 的增强工具，在 MyBatis 的基础上只做增强不做改变，为简化开发、提高效率而生。

> 官方愿景：成为 MyBatis 最好的搭档，就像 魂斗罗 中的 1P、2P，基友搭配，效率翻倍。

根据愿景甚至还设置了一个很酷的 Logo。

![](https://mp.baomidou.com/img/relationship-with-mybatis.png)

> 官网地址：https://mybatis.plus/，本文大部分内容参考自官网。

**特性**

官网说的特性太多了，挑了几个有特点的分享给大家。

- 无侵入：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑
- 损耗小：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作
- 强大的 CRUD 操作：内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求
- 支持 Lambda 形式调用：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错
- 支持多种数据库：支持 MySQL、MariaDB、Oracle、DB2、H2、HSQL、SQLite、Postgre、SQLServer2005、SQLServer 等多种数据库
- 内置分页插件：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询

## 快速上手

### 准备数据

我们首先设计一个这样的用户表，如下：

| id | name | age | email |
| --- | --- | --- | --- |
| 1 | neo | 18 | smile1@baomidou.com |
| 2 | keep | 36 | smile2@baomidou.com |
| 3 | pure | 28 | smile3@baomidou.com |
| 4 | smile | 21 | smile4@baomidou.com |
| 5 | it | 24 | smile5@baomidou.com |


我们要创建两个 Sql 文件，以便项目启动的时候，将表结构和数据初始化到数据库。

表结构文件（schema-h2.sql）内容：

```
DROP TABLE IF EXISTS user;

CREATE TABLE user
(
	id BIGINT(20) NOT NULL COMMENT '主键ID',
	name VARCHAR(30) NULL DEFAULT NULL COMMENT '姓名',
	age INT(11) NULL DEFAULT NULL COMMENT '年龄',
	email VARCHAR(50) NULL DEFAULT NULL COMMENT '邮箱',
	PRIMARY KEY (id)
);
```

表数据文件（data-h2.sql）内容：

```
INSERT INTO user (id, name, age, email) VALUES
(1, 'neo', 18, 'smile1@ityouknow.com'),
(2, 'keep', 36, 'smile2@ityouknow.com'),
(3, 'pure', 28, 'smile3@ityouknow.com'),
(4, 'smile', 21, 'smile4@ityouknow.com'),
(5, 'it', 24, 'smile5@ityouknow.com');
```

在示例项目的 resources 目录下创建 db 文件夹，将两个文件放入其中。

### 添加依赖

添加相关依赖包，pom.xml 中的相关依赖内容如下：

```
<dependencies>
	<dependency>
		<groupId>org.projectlombok</groupId>
		<artifactId>lombok</artifactId>
		<optional>true</optional>
	</dependency>
	<dependency>
		<groupId>com.baomidou</groupId>
		<artifactId>mybatis-plus-boot-starter</artifactId>
		<version>3.1.1</version>
	</dependency>
	<dependency>
		<groupId>com.h2database</groupId>
		<artifactId>h2</artifactId>
		<scope>runtime</scope>
	</dependency>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-test</artifactId>
		<scope>test</scope>
	</dependency>
</dependencies>
```

- lombok，帮忙省略掉 Get/Set 方法，[具体可以参考这篇文章](http://www.justdojava.com/2019/05/01/java-lombok/)
- mybatis-plus-boot-starter，MyBatis Plus 的依赖包
- h2，本次测试我们使用内存数据库 h2 来演示。
- spring-boot-starter-test，Spring Boot 的测试包

### 配置文件

```
# DataSource Config
spring:
    datasource:
        driver-class-name: org.h2.Driver
        schema: classpath:db/schema-h2.sql
        data: classpath:db/data-h2.sql
        url: jdbc:h2:mem:test
        username: root
        password: test

# Logger Config
logging:
    level:
      com.neo: debug
```

配置了 h2 数据库，已经项目的日志级别。配置 schema 和 data 后，项目启动时会根据配置的文件地址来执行数据。


### 业务代码

创建 MybatisPlusConfig 类，指定 Mapper 地址，启用分页功能。

``` java
@Configuration
@MapperScan("com.neo.mapper")
public class MybatisPlusConfig {

    /**
     * 分页插件
     */
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }
}
```

创建实体类 User

``` java
@Data
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}
```

`@Data` 为 lombok 语法，自动注入 getter/setter 方法。

接下来创建对象对于的 Mapper。

``` java
public interface UserMapper extends BaseMapper<User> {
}
```

以上业务代码就开发完成了，是不是很简单。

### 测试

创建 MyBatisPlusTest 类，注入上面创建的 UserMapper 类。

``` java
@RunWith(SpringRunner.class)
@SpringBootTest
public class MyBatisPlusTest {
    @Autowired
    private UserMapper userMapper;
}
```

测试查询单挑数据，并输出

``` java
@Test
public void testSelectOne() {
    User user = userMapper.selectById(1L);
    System.out.println(user);
}
```

测试添加数据

``` java
@Test
public void testInsert() {
    User user = new User();
    user.setName("微笑");
    user.setAge(3);
    user.setEmail("neo@tooool.org");
    assertThat(userMapper.insert(user)).isGreaterThan(0);
    // 成功直接拿会写的 ID
    assertThat(user.getId()).isNotNull();
}
```

assertThat() 是 Assert 的一个精通方法，用来比对返回结果，包来自`import static org.assertj.core.api.Assertions.assertThat;`。

测试删除数据

``` java
@Test
public void testDelete() {
    assertThat(userMapper.deleteById(3L)).isGreaterThan(0);
    assertThat(userMapper.delete(new QueryWrapper<User>()
            .lambda().eq(User::getName, "smile"))).isGreaterThan(0);
}
```

`QueryWrapper` 是 MyBatis-Plus 内部辅助查询类，可以使用 lambda 语法，也可以不使用。利用 QueryWrapper 类可以构建各种查询条件。


测试更新数据

``` java
@Test
public void testUpdate() {
    User user = userMapper.selectById(2);
    assertThat(user.getAge()).isEqualTo(36);
    assertThat(user.getName()).isEqualTo("keep");

    userMapper.update(
            null,
            Wrappers.<User>lambdaUpdate().set(User::getEmail, "123@123").eq(User::getId, 2)
    );
    assertThat(userMapper.selectById(2).getEmail()).isEqualTo("123@123");
}
```

测试查询所有数据

``` java
@Test
public void testSelect() {
    List<User> userList = userMapper.selectList(null);
    Assert.assertEquals(5, userList.size());
    userList.forEach(System.out::println);
}
```

测试非分页查询

``` java
@Test
public void testPage() {
    System.out.println("----- baseMapper 自带分页 ------");
    Page<User> page = new Page<>(1, 2);
    IPage<User> userIPage = userMapper.selectPage(page, new QueryWrapper<User>()
            .gt("age", 6));
    assertThat(page).isSameAs(userIPage);
    System.out.println("总条数 ------> " + userIPage.getTotal());
    System.out.println("当前页数 ------> " + userIPage.getCurrent());
    System.out.println("当前每页显示数 ------> " + userIPage.getSize());
    print(userIPage.getRecords());
    System.out.println("----- baseMapper 自带分页 ------");
}
```

查询大于 6 岁的用户，并且分页展示，每页两条数据，展示第一页。

## 总结

简单使用了一下 MyBatis-Plus 感觉是一款挺不错的 MyBatis 插件，使用 MyBatis-Plus 操作数据库确实可以少写一些代码，另外 MyBatis-Plus 的功能比较丰富，文中仅展示了常用的增删改查和分页查询，如果想进一步学习可以关注官网示例。


## 示例代码

全网最全的 Spring Boot 学习示例项目，击下方链接即可获取。

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples)**


参考出处：

https://mp.baomidou.com/guide 
