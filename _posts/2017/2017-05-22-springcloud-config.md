---
layout: post
title: springcloud(六)：配置中心
category: springcloud
tags: [springcloud]
---

随着线上项目变的日益庞大，每个项目都散落着各种配置文件；因为采用分布式的开发模式，需要的配置文件随着服务增加而不断增多，某一个基础服务相关信息变更，都会引起一系类的更新和重启，及影响生产正常项目运转，也极其不便利。配置中心便是解决此类问题的灵丹妙药。

市面上开源的配置中心有很多，BAT每家都出过，360的QConf、淘宝的diamond、百度的disconf都是解决这类问题。国外也有很多开源的配置中心Apache的Apache Commons Configuration、owner、cfg4j等等。这些开源的软件以及解决方案都很优秀，但是我最推荐的却是Spring Cloud Config，一方面够简单易用，另一方面可以无缝的和spring体系相结合，够方便够简单我喜欢。


## Spring Cloud Config

在我们了解spring cloud config之前，我可以想想一个配置中心提供的核心功能应该有什么

- 提供 服务端 和 客户端 支持
- 集中管理各环境的配置文件
- 配置文件修改之后，可以快速的生效
- 可以进行版本管理
- 支持大的并发查询
- 支持各种语言

Spring Cloud Config可以完美的支持以上所有的需求。

Spring Cloud Config项目是一个解决分布式系统的配置管理方案。它包含了Client和Server两个部分，server提供配置文件的存储、以接口的形式将配置文件的内容提供出去，client通过接口获取数据、并依据此数据初始化自己的应用。Spring cloud使用git或svn存放配置文件，默认情况下使用git，我们先以git为例做一套示例。


首先在github上面创建了一个文件夹config-repo用来存放配置文件，为了模拟生产环境，我们创建以下三个配置文件：


``` properties
// 开发环境
neo-config-dev.properties
// 测试环境
neo-config-test.properties
// 生产环境
neo-config-pro.properties
```

每个配置文件中都写一个属性neo.hello,属性值分别是 hello  im  dev/test/pro 。下面我们开始配置server端


## server 端

### 1、添加依赖

``` xml
<dependencies>
	<dependency>
		<groupId>org.springframework.cloud</groupId>
		<artifactId>spring-cloud-config-server</artifactId>
	</dependency>
</dependencies>
```

只需要加入spring-cloud-config-server包引用既可。

### 2、配置文件

``` properties
server:
  port: 8040
spring:
  application:
    name: spring-cloud-config-server
  cloud:
    config:
      server:
        git:
          uri: https://github.com/ityouknow/spring-cloud-starter/     # 配置git仓库的地址
          search-paths: config-repo                             # git仓库地址下的相对地址，可以配置多个，用,分割。
          username:                                             # git仓库的账号
          password:                                             # git仓库的密码
```

### 3、启动类

启动类添加```@EnableConfigServer```，激活对配置中心的支持

``` java
@EnableConfigServer
@SpringBootApplication
public class ConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigServerApplication.class, args);
	}
}
```

到此server端相关配置已经完成

### 4、测试

首先我们先要测试server端是否可以读取到github上面的配置信息，直接访问：http://localhost:8001/neo-config/dev

返回信息如下：

```
{
    "name": "neo-config", 
    "profiles": [
        "dev"
    ], 
    "label": null, 
    "version": null, 
    "state": null, 
    "propertySources": [
        {
            "name": "https://github.com/ityouknow/spring-cloud-starter/config-repo/neo-config-dev.properties", 
            "source": {
                "neo.hello": "hello im dev"
            }
        }
    ]
}
```

上述的返回的信息包含了配置文件的位置、版本、配置文件的名称以及配置文件中的具体内容，说明server端已经成功获取了git仓库的配置信息。

如果直接查看配置文件中的配置信息可访问：http://localhost:8001/neo-config-dev.properties，
返回：```neo.hello: hello im dev```

修改配置文件neo-config-dev.properties中配置信息为：```neo.hello=hello im dev update```,再次在浏览器访问http://localhost:8001/neo-config-dev.properties，返回：```neo.hello: hello im dev update```。说明server端会自动读取最新提交的内容

仓库中的配置文件会被转换成web接口，访问可以参照以下的规则：

- /{application}/{profile}[/{label}]  
- /{application}-{profile}.yml  
- /{label}/{application}-{profile}.yml  
- /{application}-{profile}.properties  
- /{label}/{application}-{profile}.properties

以neo-config-dev.properties为例子，它的application是neo-config，profile是dev。client会根据填写的参数来选择读取对应的配置。

## client 端

主要展示如何在业务项目中去获取server端的配置信息


### 1、添加依赖

``` xml
<dependencies>
	<dependency>
		<groupId>org.springframework.cloud</groupId>
		<artifactId>spring-cloud-starter-config</artifactId>
	</dependency>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-web</artifactId>
	</dependency>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-test</artifactId>
		<scope>test</scope>
	</dependency>
</dependencies>
```

引入spring-boot-starter-web包方便web测试

### 2、配置文件

需要配置两个配置文件，application.properties和bootstrap.properties

application.properties如下：

``` properties
spring.application.name=spring-cloud-config-client
server.port=8002
```
bootstrap.properties如下：

``` properties
spring.cloud.config.name=neo-config
spring.cloud.config.profile=dev
spring.cloud.config.uri=http://localhost:8001/
spring.cloud.config.label=master
```

- spring.application.name：对应{application}部分  
- spring.cloud.config.profile：对应{profile}部分  
- spring.cloud.config.label：对应git的分支。如果配置中心使用的是本地存储，则该参数无用
- spring.cloud.config.uri：配置中心的具体地址 
- spring.cloud.config.discovery.service-id：指定配置中心的service-id，便于扩展为高可用配置集群。  

> 特别注意：上面这些与spring-cloud相关的属性必须配置在bootstrap.properties中，config部分内容才能被正确加载。因为config的相关配置会先于application.properties，而bootstrap.properties的加载也是先于application.properties。


### 3、启动类

启动类添加```@EnableConfigServer```，激活对配置中心的支持

``` java
@SpringBootApplication
public class ConfigClientApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigClientApplication.class, args);
	}
}
```

启动类只需要```@SpringBootApplication```注解就可以

### 4、web测试

使用```@Value```注解来获取server端参数的值

``` java
@RestController
class HelloController {
    @Value("${neo.hello}")
    private String hello;

    @RequestMapping("/hello")
    public String from() {
        return this.hello;
    }
}
```

启动项目后访问：http://localhost:8002/hello，返回：```hello im dev update``说明已经正确的从server端获取到了参数。到此一个完整的服务端提供配置服务，客户端获取配置参数的例子就完成了。

我们在进行一些小实验，手动修改neo-config-dev.properties中配置信息为：```neo.hello=hello im dev update1```提交到github,再次在浏览器访问http://localhost:8002/hello，返回：```neo.hello: hello im dev update```，说明获取的信息还是旧的参数，这是为什么呢？因为spirngboot项目只有在启动的时候才会获取配置文件的值，修改github信息后，client端并没有在次去获取，所以导致这个问题。如何去解决这个问题呢？留到下一章我们在介绍。


-------------
**作者：纯洁的微笑**  
**出处：[http://www.ityouknow.com/](http://www.ityouknow.com/springcloud/2017/05/22/springcloud-config.html)**      
**版权归作者所有，转载请注明出处** 

