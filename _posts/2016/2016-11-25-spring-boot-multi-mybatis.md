---
layout: post
title: Spring Boot(七)：Mybatis 多数据源最简解决方案
category: springboot 
tags: [springboot]
copyright: java
---

说起多数据源，一般都来解决那些问题呢，主从模式或者业务比较复杂需要连接不同的分库来支持业务。我们遇到的情况是后者，网上找了很多，大都是根据 Jpa 来做多数据源解决方案，要不就是老的 Spring 多数据源解决方案，还有的是利用 Aop 动态切换，感觉有点小复杂，其实我只是想找一个简单的多数据支持而已，折腾了两个小时整理出来，供大家参考。

>废话不多说直接上代码吧

我们以 Mybatis Xml 版本为例，给大家展示如何如何配置多数据源。

## 配置文件

Pom 包就不贴了比较简单该依赖的就依赖，主要是数据库这边的配置：

``` properties
mybatis.config-location=classpath:mybatis/mybatis-config.xml

spring.datasource.test1.jdbc-url=jdbc:mysql://localhost:3306/test1?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8&useSSL=true
spring.datasource.test1.username=root
spring.datasource.test1.password=root
spring.datasource.test1.driver-class-name=com.mysql.cj.jdbc.Driver

spring.datasource.test2.jdbc-url=jdbc:mysql://localhost:3306/test2?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8&useSSL=true
spring.datasource.test2.username=root
spring.datasource.test2.password=root
spring.datasource.test2.driver-class-name=com.mysql.cj.jdbc.Driver
```

一个 test1 库和一个 test2 库，其中 test1 位主库，在使用的过程中必须指定主库，不然会报错。


## 数据源配置

``` java
@Configuration
@MapperScan(basePackages = "com.neo.mapper.test1", sqlSessionTemplateRef  = "test1SqlSessionTemplate")
public class DataSource1Config {

    @Bean(name = "test1DataSource")
    @ConfigurationProperties(prefix = "spring.datasource.test1")
    @Primary
    public DataSource testDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "test1SqlSessionFactory")
    @Primary
    public SqlSessionFactory testSqlSessionFactory(@Qualifier("test1DataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/mapper/test1/*.xml"));
        return bean.getObject();
    }

    @Bean(name = "test1TransactionManager")
    @Primary
    public DataSourceTransactionManager testTransactionManager(@Qualifier("test1DataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "test1SqlSessionTemplate")
    @Primary
    public SqlSessionTemplate testSqlSessionTemplate(@Qualifier("test1SqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
```

最关键的地方就是这块了，一层一层注入,首先创建 DataSource，然后创建 SqlSessionFactory 再创建事务，最后包装到 SqlSessionTemplate 中。其中需要指定分库的 mapper 文件地址，以及分库dao层代码

```
@MapperScan(basePackages = "com.neo.mapper.test1", sqlSessionTemplateRef  = "test1SqlSessionTemplate")
```

这块的注解就是指明了扫描 dao 层，并且给 dao 层注入指定的 SqlSessionTemplate。所有`@Bean`都需要按照命名指定正确。


## dao 层和 xml层

dao 层和 xml 需要按照库来分在不同的目录，比如：test1 库 dao 层在 `com.neo.mapper.test1` 包下，test2 库在`com.neo.mapper.test2`

``` java
public interface User1Mapper {
	List<UserEntity> getAll();
	UserEntity getOne(Long id);
	void insert(UserEntity user);
	void update(UserEntity user);
	void delete(Long id);
}
```

xml 层

``` xml
<mapper namespace="com.neo.mapper.test1.User1Mapper" >
    <resultMap id="BaseResultMap" type="com.neo.model.User" >
        <id column="id" property="id" jdbcType="BIGINT" />
        <result column="userName" property="userName" jdbcType="VARCHAR" />
        <result column="passWord" property="passWord" jdbcType="VARCHAR" />
        <result column="user_sex" property="userSex" javaType="com.neo.enums.UserSexEnum"/>
        <result column="nick_name" property="nickName" jdbcType="VARCHAR" />
    </resultMap>
    
    <sql id="Base_Column_List" >
        id, userName, passWord, user_sex, nick_name
    </sql>

    <select id="getAll" resultMap="BaseResultMap"  >
       SELECT 
       <include refid="Base_Column_List" />
     FROM users
    </select>

    <select id="getOne" parameterType="java.lang.Long" resultMap="BaseResultMap" >
        SELECT 
       <include refid="Base_Column_List" />
     FROM users
     WHERE id = #{id}
    </select>

    <insert id="insert" parameterType="com.neo.model.User" >
       INSERT INTO 
          users
          (userName,passWord,user_sex) 
        VALUES
          (#{userName}, #{passWord}, #{userSex})
    </insert>
    
    <update id="update" parameterType="com.neo.model.User" >
       UPDATE 
          users 
       SET 
        <if test="userName != null">userName = #{userName},</if>
        <if test="passWord != null">passWord = #{passWord},</if>
        nick_name = #{nickName}
       WHERE 
          id = #{id}
    </update>
    
    <delete id="delete" parameterType="java.lang.Long" >
       DELETE FROM
           users 
       WHERE 
           id =#{id}
    </delete>

</mapper>
```


## 测试

测试可以使用 SpringBootTest,也可以放到 Controller中，这里只贴 Controller 层的使用


``` java
@RestController
public class UserController {

    @Autowired
    private User1Mapper user1Mapper;

	@Autowired
	private User2Mapper user2Mapper;
	
	@RequestMapping("/getUsers")
	public List<UserEntity> getUsers() {
		List<UserEntity> users=user1Mapper.getAll();
		return users;
	}
	
    @RequestMapping("/getUser")
    public UserEntity getUser(Long id) {
    	UserEntity user=user2Mapper.getOne(id);
        return user;
    }
    
    @RequestMapping("/add")
    public void save(UserEntity user) {
        user2Mapper.insert(user);
    }
    
    @RequestMapping(value="update")
    public void update(UserEntity user) {
        user2Mapper.update(user);
    }
    
    @RequestMapping(value="/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        user1Mapper.delete(id);
    }
    
}
```

Mybatis 注解版本配置多数据源和 Xml 版本基本一致，搭建可以参考文末的示例项目。

> 文章内容已经升级到 Spring Boot 2.x 

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-mybatis)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples/tree/master/spring-boot-mybatis)**
