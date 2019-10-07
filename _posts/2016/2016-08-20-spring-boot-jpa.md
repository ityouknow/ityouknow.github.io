---
layout: post
title: Spring Boot(五)：Spring Boot Jpa 的使用
category: springboot
copyright: java
tags: [springboot]
lock: need
---

在上篇文章[Spring Boot(二)：Web 综合开发](http://www.ityouknow.com/springboot/2016/02/03/spring-boot-web.html)中简单介绍了一下 Spring Boot Jpa 的基础性使用，这篇文章将更加全面的介绍 Spring Boot Jpa 常见用法以及注意事项。

使用 Spring Boot Jpa 开发时，发现国内对 Spring Boot Jpa 全面介绍的文章比较少案例也比较零碎，因此写文章总结一下。本人也正在翻译[Spring Data JPA 参考指南](https://ityouknow.gitbooks.io/spring-data-jpa-reference-documentation/content/),有兴趣的同学欢迎联系我，一起加入翻译中！

##  Spring Boot Jpa 介绍

### 首先了解 Jpa 是什么？

Jpa (Java Persistence API) 是 Sun 官方提出的 Java 持久化规范。它为 Java 开发人员提供了一种对象/关联映射工具来管理 Java 应用中的关系数据。它的出现主要是为了简化现有的持久化开发工作和整合 ORM 技术，结束现在 Hibernate，TopLink，JDO 等 ORM 框架各自为营的局面。

值得注意的是，Jpa是在充分吸收了现有 Hibernate，TopLink，JDO 等 ORM 框架的基础上发展而来的，具有易于使用，伸缩性强等优点。从目前的开发社区的反应上看，Jpa 受到了极大的支持和赞扬，其中就包括了 Spring 与 EJB3. 0的开发团队。

>注意:Jpa 是一套规范，不是一套产品，那么像 Hibernate,TopLink,JDO 他们是一套产品，如果说这些产品实现了这个 Jpa 规范，那么我们就可以叫他们为 Jpa 的实现产品。

### Spring Boot Jpa

Spring Boot Jpa 是 Spring 基于 ORM 框架、Jpa 规范的基础上封装的一套 Jpa 应用框架，可使开发者用极简的代码即可实现对数据的访问和操作。它提供了包括增删改查等在内的常用功能，且易于扩展！学习并使用 Spring Data Jpa  可以极大提高开发效率！

> Spring Boot Jpa 让我们解脱了 DAO 层的操作，基本上所有 CRUD 都可以依赖于它来实现


## 基本查询

基本查询也分为两种，一种是 Spring Data 默认已经实现，一种是根据查询的方法来自动解析成 SQL。

### 预先生成方法

Spring Boot Jpa  默认预先生成了一些基本的CURD的方法，例如：增、删、改等等

1 继承 JpaRepository

``` java 
public interface UserRepository extends JpaRepository<User, Long> {
}
```

2 使用默认方法

``` java 
@Test
public void testBaseQuery() throws Exception {
	User user=new User();
	userRepository.findAll();
	userRepository.findOne(1l);
	userRepository.save(user);
	userRepository.delete(user);
	userRepository.count();
	userRepository.exists(1l);
	// ...
}
```

就不解释了根据方法名就看出意思来

### 自定义简单查询

自定义的简单查询就是根据方法名来自动生成 SQL，主要的语法是`findXXBy`,`readAXXBy`,`queryXXBy`,`countXXBy`, `getXXBy`后面跟属性名称：

``` java 
User findByUserName(String userName);
```

也使用一些加一些关键字`And `、 `Or`

``` java 
User findByUserNameOrEmail(String username, String email);
```

修改、删除、统计也是类似语法

``` java 
Long deleteById(Long id);
Long countByUserName(String userName)
```

基本上 SQL 体系中的关键词都可以使用，例如：` LIKE `、 `IgnoreCase`、 `OrderBy`。

``` java 
List<User> findByEmailLike(String email);
User findByUserNameIgnoreCase(String userName);
List<User> findByUserNameOrderByEmailDesc(String email);
```

**具体的关键字，使用方法和生产成SQL如下表所示**

Keyword	| Sample	|JPQL snippet
---     |---        |---
And	|findByLastnameAndFirstname	|… where x.lastname = ?1 and x.firstname = ?2
Or	|findByLastnameOrFirstname	|… where x.lastname = ?1 or x.firstname = ?2
Is,Equals|	findByFirstnameIs,findByFirstnameEquals	|… where x.firstname = ?1
Between	|findByStartDateBetween	|… where x.startDate between ?1 and ?2
LessThan |	findByAgeLessThan	|… where x.age < ?1
LessThanEqual|	findByAgeLessThanEqual	|… where x.age ⇐ ?1
GreaterThan	|findByAgeGreaterThan	|… where x.age > ?1
GreaterThanEqual|	findByAgeGreaterThanEqual	|… where x.age >= ?1
After	|findByStartDateAfter	|… where x.startDate > ?1
Before	|findByStartDateBefore	|… where x.startDate < ?1
IsNull	|findByAgeIsNull	|… where x.age is null
IsNotNull,NotNull|	findByAge(Is)NotNull	|… where x.age not null
Like	|findByFirstnameLike	|… where x.firstname like ?1
NotLike	|findByFirstnameNotLike	|… where x.firstname not like ?1
StartingWith|	findByFirstnameStartingWith	|… where x.firstname like ?1 (parameter bound with appended %)
EndingWith	|findByFirstnameEndingWith	|… where x.firstname like ?1 (parameter bound with prepended %)
Containing	|findByFirstnameContaining	|… where x.firstname like ?1 (parameter bound wrapped in %)
OrderBy	|findByAgeOrderByLastnameDesc	|… where x.age = ?1 order by x.lastname desc
Not	|findByLastnameNot	|… where x.lastname <> ?1
In	|findByAgeIn(Collection<Age> ages)	|… where x.age in ?1
NotIn|	findByAgeNotIn(Collection<Age> age)	|… where x.age not in ?1
TRUE|	findByActiveTrue()	|… where x.active = true
FALSE|	findByActiveFalse()	|… where x.active = false
IgnoreCase|	findByFirstnameIgnoreCase	|… where UPPER(x.firstame) = UPPER(?1)


## 复杂查询

在实际的开发中我们需要用到分页、删选、连表等查询的时候就需要特殊的方法或者自定义 SQL

### 分页查询

分页查询在实际使用中非常普遍了，Spring Boot Jpa 已经帮我们实现了分页的功能，在查询的方法中，需要传入参数`Pageable` ,当查询中有多个参数的时候`Pageable`建议做为最后一个参数传入.

``` java 
Page<User> findALL(Pageable pageable);
Page<User> findByUserName(String userName,Pageable pageable);
```

`Pageable` 是 Spring 封装的分页实现类，使用的时候需要传入页数、每页条数和排序规则

``` java 
@Test
public void testPageQuery() throws Exception {
	int page=1,size=10;
	Sort sort = new Sort(Direction.DESC, "id");
    Pageable pageable = new PageRequest(page, size, sort);
    userRepository.findALL(pageable);
    userRepository.findByUserName("testName", pageable);
}
```

**限制查询**

有时候我们只需要查询前N个元素，或者支取前一个实体。

```
User findFirstByOrderByLastnameAsc();
User findTopByOrderByAgeDesc();
Page<User> queryFirst10ByLastname(String lastname, Pageable pageable);
List<User> findFirst10ByLastname(String lastname, Sort sort);
List<User> findTop10ByLastname(String lastname, Pageable pageable);
```

### 自定义SQL查询

其实 Spring Data 觉大部分的 SQL 都可以根据方法名定义的方式来实现，但是由于某些原因我们想使用自定义的 SQL 来查询，Spring Data 也是完美支持的；在 SQL 的查询方法上面使用`@Query`注解，如涉及到删除和修改在需要加上`@Modifying`.也可以根据需要添加 `@Transactional`对事物的支持，查询超时的设置等。

```
@Modifying
@Query("update User u set u.userName = ?1 where u.id = ?2")
int modifyByIdAndUserId(String  userName, Long id);
	
@Transactional
@Modifying
@Query("delete from User where id = ?1")
void deleteByUserId(Long id);
  
@Transactional(timeout = 10)
@Query("select u from User u where u.emailAddress = ?1")
User findByEmailAddress(String emailAddress);
```

### 多表查询

多表查询 Spring Boot Jpa 中有两种实现方式，第一种是利用 Hibernate 的级联查询来实现，第二种是创建一个结果集的接口来接收连表查询后的结果，这里主要第二种方式。

首先需要定义一个结果集的接口类。

``` java 
public interface HotelSummary {

	City getCity();

	String getName();

	Double getAverageRating();

	default Integer getAverageRatingRounded() {
		return getAverageRating() == null ? null : (int) Math.round(getAverageRating());
	}

}
```

查询的方法返回类型设置为新创建的接口

``` java
@Query("select h.city as city, h.name as name, avg(r.rating) as averageRating "
		- "from Hotel h left outer join h.reviews r where h.city = ?1 group by h")
Page<HotelSummary> findByCity(City city, Pageable pageable);

@Query("select h.name as name, avg(r.rating) as averageRating "
		- "from Hotel h left outer join h.reviews r  group by h")
Page<HotelSummary> findByCity(Pageable pageable);
```

使用

```
Page<HotelSummary> hotels = this.hotelRepository.findByCity(new PageRequest(0, 10, Direction.ASC, "name"));
for(HotelSummary summay:hotels){
		System.out.println("Name" +summay.getName());
	}
```

> 在运行中 Spring 会给接口（HotelSummary）自动生产一个代理类来接收返回的结果，代码汇总使用 `getXX`的形式来获取


## 多数据源的支持

### 同源数据库的多源支持

日常项目中因为使用的分布式开发模式，不同的服务有不同的数据源，常常需要在一个项目中使用多个数据源，因此需要配置 Spring Boot Jpa 对多数据源的使用，一般分一下为三步：

- 1 配置多数据源
- 2 不同源的实体类放入不同包路径
- 3 声明不同的包路径下使用不同的数据源、事务支持

### 异构数据库多源支持

比如我们的项目中，即需要对 mysql 的支持，也需要对 Mongodb 的查询等。

实体类声明`@Entity` 关系型数据库支持类型、声明`@Document` 为 Mongodb 支持类型，不同的数据源使用不同的实体就可以了

``` java 
interface PersonRepository extends Repository<Person, Long> {
 …
}

@Entity
public class Person {
  …
}

interface UserRepository extends Repository<User, Long> {
 …
}

@Document
public class User {
  …
}
```

但是，如果 User 用户既使用 Mysql 也使用 Mongodb 呢，也可以做混合使用

``` java 
interface JpaPersonRepository extends Repository<Person, Long> {
 …
}

interface MongoDBPersonRepository extends Repository<Person, Long> {
 …
}

@Entity
@Document
public class Person {
  …
}
```

也可以通过对不同的包路径进行声明，比如 A 包路径下使用 mysql,B 包路径下使用 MongoDB 

```
@EnableJpaRepositories(basePackages = "com.neo.repositories.jpa")
@EnableMongoRepositories(basePackages = "com.neo.repositories.mongo")
interface Configuration { }
```


## 其它

**使用枚举**

使用枚举的时候，我们希望数据库中存储的是枚举对应的 String 类型，而不是枚举的索引值，需要在属性上面添加`	@Enumerated(EnumType.STRING) ` 注解

```
@Enumerated(EnumType.STRING) 
@Column(nullable = true)
private UserType type;
```

**不需要和数据库映射的属性**

正常情况下我们在实体类上加入注解`@Entity`，就会让实体类和表相关连如果其中某个属性我们不需要和数据库来关联只是在展示的时候做计算，只需要加上`@Transient`属性既可。

```
@Transient
private String  userName;
```


**源码案例**

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-jpa)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples/tree/master/spring-boot-jpa)**


> 文章内容已经升级到 Spring Boot 2.x 

## 参考

[Spring Data JPA - Reference Documentation](http://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

[Spring Data JPA——参考文档 中文版](https://www.gitbook.com/book/ityouknow/spring-data-jpa-reference-documentation/details)
