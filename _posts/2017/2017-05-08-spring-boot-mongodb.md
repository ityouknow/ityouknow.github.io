---
layout: post
title: Spring Boot(十一)：Spring Boot 中 MongoDB 的使用
category: springboot 
tags: [springboot]
keywords: mongodb
copyright: java
lock: need
---

MongoDB 是最早热门非关系数据库的之一，使用也比较普遍，一般会用做离线数据分析来使用，放到内网的居多。由于很多公司使用了云服务，服务器默认都开放了外网地址，导致前一阵子大批 MongoDB 因配置漏洞被攻击，数据被删，引起了人们的注意，感兴趣的可以看看这篇文章：[场屠戮MongoDB的盛宴反思：超33000个数据库遭遇入侵勒索](http://www.freebuf.com/articles/database/125127.html)，同时也说明了很多公司生产中大量使用mongodb。


## MongoDB 简介

MongoDB（来自于英文单词“Humongous”，中文含义为“庞大”）是可以应用于各种规模的企业、各个行业以及各类应用程序的开源数据库。基于分布式文件存储的数据库。由C++语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。MongoDB 是一个高性能，开源，无模式的文档型数据库，是当前 NoSql 数据库中比较热门的一种。

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。他支持的数据结构非常松散，是类似 json 的 bjson 格式，因此可以存储比较复杂的数据类型。MongoDB 最大的特点是他支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。

传统的关系数据库一般由数据库（database）、表（table）、记录（record）三个层次概念组成，MongoDB 是由数据库（database）、集合（collection）、文档对象（document）三个层次组成。MongoDB 对于关系型数据库里的表，但是集合中没有列、行和关系概念，这体现了模式自由的特点。

MongoDB 中的一条记录就是一个文档，是一个数据结构，由字段和值对组成。MongoDB 文档与 JSON 对象类似。字段的值有可能包括其它文档、数组以及文档数组。MongoDB 支持 OS X、Linux 及 Windows 等操作系统，并提供了 Python，PHP，Ruby，Java及 C++ 语言的驱动程序，社区中也提供了对 Erlang 及 .NET 等平台的驱动程序。

MongoDB 的适合对大量或者无固定格式的数据进行存储，比如：日志、缓存等。对事物支持较弱，不适用复杂的多文档（多表）的级联查询。文中演示 Mongodb 版本为 3.5。


## MongoDB 的增删改查

Spring Boot 对各种流行的数据源都进行了封装，当然也包括了 Mongodb,下面给大家介绍如何在 Spring Boot 中使用 Mongodb：

### 1、pom 包配置

pom 包里面添加 `spring-boot-starter-data-mongodb` 包引用

``` xml
<dependencies>
	<dependency> 
	    <groupId>org.springframework.boot</groupId>
	    <artifactId>spring-boot-starter-data-mongodb</artifactId>
	</dependency> 
</dependencies>
```

### 2、在 application.properties 中添加配置

``` properties
spring.data.mongodb.uri=mongodb://name:pass@localhost:27017/test
```

多个 IP 集群可以采用以下配置：

``` properties
spring.data.mongodb.uri=mongodb://user:pwd@ip1:port1,ip2:port2/database
```


### 2、创建数据实体

``` java
public class User implements Serializable {
        private static final long serialVersionUID = -3258839839160856613L;
        private Long id;
        private String userName;
        private String passWord;

      //getter、setter省略
}
```

### 3、创建实体的增删改查操作

Repository 层实现了 User 对象的增删改查

``` java
@Component
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * 创建对象
     * @param user
     */
    @Override
    public void saveUser(User user) {
        mongoTemplate.save(user);
    }

    /**
     * 根据用户名查询对象
     * @param userName
     * @return
     */
    @Override
    public User findUserByUserName(String userName) {
        Query query=new Query(Criteria.where("userName").is(userName));
        User user =  mongoTemplate.findOne(query , User.class);
        return user;
    }

    /**
     * 更新对象
     * @param user
     */
    @Override
    public long updateUser(User user) {
        Query query=new Query(Criteria.where("id").is(user.getId()));
        Update update= new Update().set("userName", user.getUserName()).set("passWord", user.getPassWord());
        //更新查询返回结果集的第一条
        UpdateResult result =mongoTemplate.updateFirst(query,update,User.class);
        //更新查询返回结果集的所有
        // mongoTemplate.updateMulti(query,update,UserEntity.class);
        if(result!=null)
            return result.getMatchedCount();
        else
            return 0;
    }

    /**
     * 删除对象
     * @param id
     */
    @Override
    public void deleteUserById(Long id) {
        Query query=new Query(Criteria.where("id").is(id));
        mongoTemplate.remove(query,User.class);
    }
}
```


### 4、开发对应的测试方法


``` java
@RunWith(SpringRunner.class)
@SpringBootTest
public class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Test
    public void testSaveUser() throws Exception {
        UserEntity user=new UserEntity();
        user.setId(2l);
        user.setUserName("小明");
        user.setPassWord("fffooo123");
        userDao.saveUser(user);
    }

    @Test
    public void findUserByUserName(){
       UserEntity user= userDao.findUserByUserName("小明");
       System.out.println("user is "+user);
    }

    @Test
    public void updateUser(){
        UserEntity user=new UserEntity();
        user.setId(2l);
        user.setUserName("天空");
        user.setPassWord("fffxxxx");
        userDao.updateUser(user);
    }

    @Test
    public void deleteUserById(){
        userDao.deleteUserById(1l);
    }

}
```

### 5、查看验证结果

可以使用工具 MongoVUE 工具来连接后直接图形化展示查看，也可以登录服务器用命令来查看

1.登录 mongos
> bin/mongo -host localhost -port 20000

2、切换到 test 库
> use test

3、查询 user 集合数据
> db.user.find()


根据3查询的结果来观察测试用例的执行是否正确。


到此 Spring Boot 对应 MongoDB 的增删改查功能已经全部实现。


## 多数据源 MongoDB 的使用

接下来实现 MongoDB 多数据源的使用


### 1、pom 包配置

``` xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
    </dependency>
</dependencies>
```

### 2、配置两条数据源，如下：

``` properties
mongodb.primary.uri=mongodb://192.168.0.75:20000
mongodb.primary.database=primary
mongodb.secondary.uri=mongodb://192.168.0.75:20000
mongodb.secondary.database=secondary
```

### 3、配置两个库的数据源

封装读取以 Mongodb 开头的两个配置文件

``` java
@Data
@ConfigurationProperties(prefix = "mongodb")
public class MultipleMongoProperties {

	private MongoProperties primary = new MongoProperties();
	private MongoProperties secondary = new MongoProperties();
}
```

配置不同包路径下使用不同的数据源

第一个库的封装

``` java
@Configuration
@EnableMongoRepositories(basePackages = "com.neo.model.repository.primary",
		mongoTemplateRef = PrimaryMongoConfig.MONGO_TEMPLATE)
public class PrimaryMongoConfig {

	protected static final String MONGO_TEMPLATE = "primaryMongoTemplate";
}
```

第二个库的封装

``` java
@Configuration
@EnableMongoRepositories(basePackages = "com.neo.model.repository.secondary",
		mongoTemplateRef = SecondaryMongoConfig.MONGO_TEMPLATE)
public class SecondaryMongoConfig {

	protected static final String MONGO_TEMPLATE = "secondaryMongoTemplate";
}
```

读取对应的配置信息并且构造对应的 MongoTemplate

``` java
@Configuration
public class MultipleMongoConfig {

	@Autowired
	private MultipleMongoProperties mongoProperties;

	@Primary
	@Bean(name = PrimaryMongoConfig.MONGO_TEMPLATE)
	public MongoTemplate primaryMongoTemplate() throws Exception {
		return new MongoTemplate(primaryFactory(this.mongoProperties.getPrimary()));
	}

	@Bean
	@Qualifier(SecondaryMongoConfig.MONGO_TEMPLATE)
	public MongoTemplate secondaryMongoTemplate() throws Exception {
        return new MongoTemplate(secondaryFactory(this.mongoProperties.getSecondary()));
	}

	@Bean
    @Primary
	public MongoDbFactory primaryFactory(MongoProperties mongo) throws Exception {
		return new SimpleMongoDbFactory(new MongoClient(mongo.getHost(), mongo.getPort()),
				mongo.getDatabase());
	}

	@Bean
	public MongoDbFactory secondaryFactory(MongoProperties mongo) throws Exception {
		return new SimpleMongoDbFactory(new MongoClient(mongo.getHost(), mongo.getPort()),
				mongo.getDatabase());
	}
}
```

两个库的配置信息已经完成。

### 4、创建两个库分别对应的对象和 Repository

对应可以共用

``` java
public class User implements Serializable {
        private static final long serialVersionUID = -3258839839160856613L;
        private String  id;
        private String userName;
        private String passWord;

        public User(String userName, String passWord) {
                this.userName = userName;
                this.passWord = passWord;
        }
}
```

对应的 Repository


``` java
public interface PrimaryRepository extends MongoRepository<PrimaryMongoObject, String> {
}
```

继承了 MongoRepository 会默认实现很多基本的增删改查，省了很多自己写 Repository 层的代码

Secondary 和上面的代码类似就不贴出来了


## 5、最后测试

``` java
@RunWith(SpringRunner.class)
@SpringBootTest
public class MuliDatabaseTest {

    @Autowired
    private PrimaryRepository primaryRepository;

    @Autowired
    private SecondaryRepository secondaryRepository;

    @Test
    public void TestSave() {

        System.out.println("************************************************************");
        System.out.println("测试开始");
        System.out.println("************************************************************");

        this.primaryRepository
                .save(new PrimaryMongoObject(null, "第一个库的对象"));

        this.secondaryRepository
                .save(new SecondaryMongoObject(null, "第二个库的对象"));

        List<PrimaryMongoObject> primaries = this.primaryRepository.findAll();
        for (PrimaryMongoObject primary : primaries) {
            System.out.println(primary.toString());
        }

        List<SecondaryMongoObject> secondaries = this.secondaryRepository.findAll();

        for (SecondaryMongoObject secondary : secondaries) {
            System.out.println(secondary.toString());
        }

        System.out.println("************************************************************");
        System.out.println("测试完成");
        System.out.println("************************************************************");
    }

}
```

到此，MongoDB 多数据源的使用已经完成。

> 文章内容已经升级到 Spring Boot 2.x 

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-mongodb)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples/tree/master/spring-boot-mongodb)**

