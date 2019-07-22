---
layout: post
title: Spring Boot(一)：入门篇
copyright: java
category: springboot
tags: [springboot]
---

##  什么是 Spring Boot

Spring Boot 是由 Pivotal 团队提供的全新框架，其设计目的是用来简化新 Spring 应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。用我的话来理解，就是 Spring Boot 其实不是什么新的框架，它默认配置了很多框架的使用方式，就像 Maven 整合了所有的 Jar 包，Spring Boot 整合了所有的框架。


##  使用 Spring Boot 有什么好处

其实就是简单、快速、方便！平时如果我们需要搭建一个 Spring Web 项目的时候需要怎么做呢？

- 1）配置 web.xml，加载 Spring 和 Spring mvc
- 2）配置数据库连接、配置 Spring 事务
- 3）配置加载配置文件的读取，开启注解
- 4）配置日志文件
- ...
- 配置完成之后部署 Tomcat 调试
- ...

现在非常流行微服务，如果我这个项目仅仅只是需要发送一个邮件，如果我的项目仅仅是生产一个积分；我都需要这样折腾一遍!


但是如果使用 Spring Boot 呢？  
很简单，我仅仅只需要非常少的几个配置就可以迅速方便的搭建起来一套 Web 项目或者是构建一个微服务！

使用 Spring Boot 到底有多爽，用下面这幅图来表达
 
![](http://favorites.ren/assets/images/2016/dog.jpg)  

## 快速入门

说了那么多，手痒痒的很，马上来一发试试!

**Maven 构建项目**

- 1、访问 http://start.spring.io/  
- 2、选择构建工具 Maven Project、Java、Spring Boot 版本 2.1.3 以及一些工程基本信息，可参考下图所示：

![](http://favorites.ren/assets/images/2019/springboot/spring-boot-start.png)

- 3、点击 Generate Project 下载项目压缩包
- 4、解压后，使用 Idea 导入项目，File -> New -> Model from Existing Source.. -> 选择解压后的文件夹 -> OK，选择 Maven 一路 Next，OK done! 
- 5、如果使用的是 Eclipse，Import -> Existing Maven Projects -> Next -> 选择解压后的文件夹 -> Finsh，OK done! 

**Idea 构建项目**

- 1、选择 File -> New —> Project... 弹出新建项目的框
- 2、选择 Spring Initializr，Next 也会出现上述类似的配置界面，Idea 帮我们做了集成
- 3、填写相关内容后，点击 Next 选择依赖的包再点击 Next，最后确定信息无误点击 Finish。

**项目结构介绍**
 
![](http://favorites.ren/assets/images/2016/springboot2.png)  


如上图所示，Spring Boot 的基础结构共三个文件:
- `src/main/java`  程序开发以及主程序入口
- `src/main/resources` 配置文件
- `src/test/java`  测试程序

另外， Spring Boot 建议的目录结果如下：  
root package 结构：`com.example.myproject`

``` java
com
  +- example
    +- myproject
      +- Application.java
      |
      +- model
      |  +- Customer.java
      |  +- CustomerRepository.java
      |
      +- service
      |  +- CustomerService.java
      |
      +- controller
      |  +- CustomerController.java
      |
```

- 1、Application.java 建议放到根目录下面,主要用于做一些框架配置
- 2、model 目录主要用于实体与数据访问层（Repository）
- 3、service 层主要是业务类代码
- 4、controller 负责页面访问控制

采用默认配置可以省去很多配置，当然也可以根据自己的喜欢来进行更改  
最后，启动 Application main 方法，至此一个 Java 项目搭建好了！


**引入 web 模块**

1、pom.xml中添加支持web的模块： 

``` xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

pom.xml 文件中默认有两个模块：

- `spring-boot-starter` ：核心模块，包括自动配置支持、日志和 YAML，如果引入了 `spring-boot-starter-web` web 模块可以去掉此配置，因为 `spring-boot-starter-web` 自动依赖了 `spring-boot-starter`。
- `spring-boot-starter-test` ：测试模块，包括 JUnit、Hamcrest、Mockito。  

2、编写 Controller 内容：

``` java
@RestController
public class HelloWorldController {
    @RequestMapping("/hello")
    public String index() {
        return "Hello World";
    }
}
```

`@RestController` 的意思就是 Controller 里面的方法都以 json 格式输出，不用再写什么 jackjson 配置的了！

3、启动主程序，打开浏览器访问 `http://localhost:8080/hello`，就可以看到效果了，有木有很简单！


**如何做单元测试**

打开的`src/test/`下的测试入口，编写简单的 http 请求来测试；使用 mockmvc 进行，利用`MockMvcResultHandlers.print()`打印出执行结果。

``` java
@RunWith(SpringRunner.class)
@SpringBootTest
public class HelloTests {

  
    private MockMvc mvc;

    @Before
    public void setUp() throws Exception {
        mvc = MockMvcBuilders.standaloneSetup(new HelloWorldController()).build();
    }

    @Test
    public void getHello() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/hello").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(equalTo("Hello World")));
    }

}
```

**开发环境的调试**

热启动在正常开发项目中已经很常见了吧，虽然平时开发web项目过程中，改动项目启重启总是报错；但springBoot对调试支持很好，修改之后可以实时生效，需要添加以下的配置：  

``` xml
 <dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <fork>true</fork>
            </configuration>
        </plugin>
</plugins>
</build>
```

该模块在完整的打包环境下运行的时候会被禁用。如果你使用 `java -jar`启动应用或者用一个特定的 classloader 启动，它会认为这是一个“生产环境”。


## 总结

使用 Spring Boot 可以非常方便、快速搭建项目，使我们不用关心框架之间的兼容性，适用版本等各种问题，我们想使用任何东西，仅仅添加一个配置就可以，所以使用 Spring Boot 非常适合构建微服务。


> 文章内容已经升级到 Spring Boot 2.x 

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-helloWorld)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples/tree/master/spring-boot-helloWorld)**

