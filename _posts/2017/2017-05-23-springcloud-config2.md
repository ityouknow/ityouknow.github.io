---
layout: post
title: springcloud(七)：配置中心(二)
category: springcloud
tags: [springcloud]
---


上一篇[springcloud(六)：配置中心(一)](http://www.ityouknow.com/springcloud/2017/05/22/springcloud-config.html)留了一个小问题，当重新修改配置文件提交后，客户端获取的仍然是修改前的信息，这个问题我们先放下，待会再讲。国内很多公司都使用的svn来做代码的版本控制，我们先介绍以下如何使用svn+Spring Cloud Config来做配置中心。


## svn版本

同样先示例server端的代码，基本步骤一样。

### 1、添加依赖

``` xml
<dependencies>
	<dependency>
		<groupId>org.springframework.cloud</groupId>
		<artifactId>spring-cloud-config-server</artifactId>
	</dependency>
	<dependency>
		<groupId>org.tmatesoft.svnkit</groupId>
		<artifactId>svnkit</artifactId>
	</dependency>
</dependencies>
```

需要多引入svnkitr包

### 2、配置文件

``` properties
server:
  port: 8001

spring:
  cloud:
    config:
      server:
        svn:
          uri: http://192.168.0.6/svn/repo/config-repo
          username: username
          password: password
        default-label: trunk
  profiles:
    active: subversion
  application:
    name: spring-cloud-config-server
```

和git版本稍有区别，需要显示声明subversion.

### 3、启动类

启动类没有变化，添加```@EnableConfigServer```激活对配置中心的支持

``` java
@EnableConfigServer
@SpringBootApplication
public class ConfigServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigServerApplication.class, args);
	}
}
```

### 4、测试

**服务端测试**

访问：```http://localhost:8001/neo-config-dev.properties```，返回：```neo.hello: hello im dev```，说明服务端可以正常读取到svn代码库中的配置信息。修改配置文件```neo-config-dev.properties```中配置信息为：```neo.hello=hello im dev update```,再次在浏览器访问```http://localhost:8001/neo-config-dev.properties```，返回：```neo.hello: hello im dev update```。说明server端会自动读取最新提交的内容


**客户端测试**

客户端直接使用上一篇示例项目```spring-cloud-config-client```来测试，配置基本不用变动。启动项目后访问：```http://localhost:8002/hello，返回：```hello im dev update``说明已经正确的从server端获取到了参数。同样修改svn配置并提交，再次访问```http://localhost:8002/hello```依然获取的是旧的信息，和git版本的问题一样。


## 自动刷新

现在来解决上一篇的遗留问题，这个问题在svn版本中依然存在。SpringCloudConfig分服务端和客户端，服务端负责将git（svn）中存储的配置文件发布成REST接口，客户端可以从服务端REST接口获取配置。但客户端并不能主动感知到配置的变化，从而主动去获取新的配置。客户端如何去主动获取新的配置信息呢，springcloud已经给我们提供了解决方案，每个客户端通过POST方法触发各自的```/refresh```。

修改```spring-cloud-config-client```项目已到达可以refresh的功能。

### 1、添加依赖

``` xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

增加了```spring-boot-starter-actuator```包，```spring-boot-starter-actuator```是一套监控的功能，可以监控程序在运行时状态，其中就包括```/refresh```的功能。


### 2、添加```@RefreshScope```

需要给加载变量的类上面加载```@RefreshScope```，在客户端执行```/refresh```的时候就会更新此类下面的变量值。

``` java
@RestController
@RefreshScope // 使用该注解的类，会在接到SpringCloud配置中心配置刷新的时候，自动将新的配置更新到该类对应的字段中。
class HelloController {

    @Value("${neo.hello}")
    private String hello;

    @RequestMapping("/hello")
    public String from() {
        return this.hello;
    }
}
```

*springboot 1.5.X 以上默认开通了安全认证，所以需要在配置文件```application.properties```添加以下配置*

``` properties
management.security.enabled=false
```

OK 这样就改造完了，以post请求的方式来访问```http://localhost:8002/refresh``` 就会更新修改后的配置文件。

我们再次来测试，首先访问```http://localhost:8002/hello```，返回：```hello im dev```，我将svn库中的值修改为```hello im dev update```。在win上面打开cmd执行```curl -X POST http://localhost:8002/refresh```，返回```["neo.hello"]```说明已经更新了```neo.hello```的值。我们再次访问```http://localhost:8002/hello```，返回：```hello im dev update``,客户端已经得到了最新的值。

但是每次手动刷新客户端也挺麻烦的，如果以后的配置文件越来越多手动刷新弊端会更多。其实spring已经给了我们解决方案，留到下一篇文章来介绍。

**[示例代码](https://github.com/ityouknow/spring-cloud-starter)**

-------------
**作者：纯洁的微笑**  
**出处：[http://www.ityouknow.com/](http://www.ityouknow.com/springcloud/2017/05/23/springcloud-config2.html)**      
**版权归作者所有，转载请注明出处** 
