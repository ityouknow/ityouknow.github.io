---
layout: post
title: Spring Boot(二十)：使用 spring-boot-admin 对 Spring Boot 服务进行监控
category: springboot
tags: [springboot]
excerpt: Spring Boot Admin 监控、介绍和使用，Spring Boot Admin 图形化监控，让监控更直观更省力。
keywords: Spring Boot Admin，监控，应用，图形化
copyright: java
lock: need
---

上一篇文章[《Spring Boot(十九)：使用 Spring Boot Actuator 监控应用》](http://www.ityouknow.com/springboot/2018/02/06/spring-boot-actuator.html)介绍了 Spring Boot Actuator 的使用，Spring Boot Actuator 提供了对单个 Spring Boot 的监控，信息包含：应用状态、内存、线程、堆栈等等，比较全面的监控了 Spring Boot 应用的整个生命周期。

但是这样监控也有一些问题：第一，所有的监控都需要调用固定的接口来查看，如果全面查看应用状态需要调用很多接口，并且接口返回的 Json 信息不方便运营人员理解；第二，如果 Spring Boot 应用集群非常大，每个应用都需要调用不同的接口来查看监控信息，操作非常繁琐低效。在这样的背景下，就诞生了另外一个开源软件：**Spring Boot Admin**。

## 什么是 Spring Boot Admin?

Spring Boot Admin 是一个管理和监控 Spring Boot 应用程序的开源软件。每个应用都认为是一个客户端，通过 HTTP 或者使用 Eureka 注册到 admin server 中进行展示，Spring Boot Admin UI 部分使用 VueJs 将数据展示在前端。

这篇文章给大家介绍如何使用 Spring Boot Admin 对 Spring Boot 应用进行监控。

## 监控单体应用

这节给大家展示如何使用 Spring Boot Admin 监控单个 Spring Boot 应用。

### Admin Server 端

**项目依赖**

``` xml
<dependencies>
  <dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-server</artifactId>
    <version>2.1.0</version>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
</dependencies>
```

**配置文件**

``` properties
server.port=8000
```
服务端设置端口为：8000。

**启动类**

``` java
@Configuration
@EnableAutoConfiguration
@EnableAdminServer
public class AdminServerApplication {

  public static void main(String[] args) {
    SpringApplication.run(AdminServerApplication.class, args);
  }
}
```

完成上面三步之后，启动服务端，浏览器访问`http://localhost:8000`可以看到以下界面：

![](http://favorites.ren/assets/images/2018/springboot/admin21.png)


### Admin Client 端

**项目依赖**

``` xml
<dependencies>
    <dependency>
      <groupId>de.codecentric</groupId>
      <artifactId>spring-boot-admin-starter-client</artifactId>
      <version>2.1.0</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

**配置文件**

``` properties
server.port=8001
spring.application.name=Admin Client
spring.boot.admin.client.url=http://localhost:8000  
management.endpoints.web.exposure.include=*
```

- `spring.boot.admin.client.url` 配置 Admin Server 的地址  
- `management.endpoints.web.exposure.include=*` 打开客户端 Actuator 的监控。


**启动类**

``` java
@SpringBootApplication
public class AdminClientApplication {
  public static void main(String[] args) {
    SpringApplication.run(AdminClientApplication.class, args);
  }
}
```

配置完成之后，启动 Client 端，Admin 服务端会自动检查到客户端的变化，并展示其应用

![](http://favorites.ren/assets/images/2018/springboot/admin22.png)

页面会展示被监控的服务列表，点击详项目名称会进入此应用的详细监控信息。

![](http://favorites.ren/assets/images/2018/springboot/admin23.png)

通过上图可以看出，Spring Boot Admin 以图形化的形式展示了应用的各项信息，这些信息大多都来自于 Spring Boot Actuator 提供的接口。


## 监控微服务 

如果我们使用的是单个 Spring Boot 应用，就需要在每一个被监控的应用中配置 Admin Server 的地址信息；如果应用都注册在 Eureka 中就不需要再对每个应用进行配置，Spring Boot Admin 会自动从注册中心抓取应用的相关信息。

如果我们使用了 Spring Cloud 的服务发现功能，就不需要在单独添加 Admin Client 客户端，仅仅需要 Spring Boot Server ,其它内容会自动进行配置。

接下来我们以 Eureka 作为服务发现的示例来进行演示，实际上也可以使用 Consul 或者 Zookeeper。

1、服务端和客户端添加 spring-cloud-starter-eureka 到包依赖中

``` xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

2、启动类添加注解

``` java
@Configuration
@EnableAutoConfiguration
@EnableDiscoveryClient
@EnableAdminServer
public class SpringBootAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootAdminApplication.class, args);
    }

    @Configuration
    public static class SecurityPermitAllConfig extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests().anyRequest().permitAll()  
                .and().csrf().disable();
        }
    }
}
```

使用类 SecurityPermitAllConfig 关闭了安全验证。

3、在客户端中配置服务发现的地址

``` xml
eureka:   
  instance:
    leaseRenewalIntervalInSeconds: 10
    health-check-url-path: /actuator/health
    metadata-map:
      startup: ${random.int}    #needed to trigger info and endpoint update after restart
  client:
    registryFetchIntervalSeconds: 5
    serviceUrl:
      defaultZone: ${EUREKA_SERVICE_URL:http://localhost:8761}/eureka/

management:
  endpoints:
    web:
      exposure:
        include: "*"  
  endpoint:
    health:
      show-details: ALWAYS
```

Spring Cloud 提供了示例代码可以参考这里：[spring-boot-admin-sample-eureka](https://github.com/codecentric/spring-boot-admin/tree/master/spring-boot-admin-samples/spring-boot-admin-sample-eureka/)

重启启动服务端和客户端之后，访问服务端的相关地址就可以看到监控页面了。


> 文章内容已经升级到 Spring Boot 2.x 

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-admin-simple)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples/tree/master/spring-boot-admin-simple)**


## 参考

[Spring Boot Admin Reference Guide](http://codecentric.github.io/spring-boot-admin/1.5.6/#getting-started)  


