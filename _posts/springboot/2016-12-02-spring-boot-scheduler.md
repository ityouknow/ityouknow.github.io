---
layout: post
title:  Spring Boot(九)：定时任务
category: springboot 
tags: [springboot]
copyright: java
---

在我们开发项目过程中，经常需要定时任务来帮助我们来做一些内容， Spring Boot 默认已经帮我们实行了，只需要添加相应的注解就可以实现


## 1、pom 包配置

pom 包里面只需要引入 Spring Boot Starter 包即可

``` xml
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter</artifactId>
	</dependency>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-test</artifactId>
		<scope>test</scope>
	</dependency>
</dependencies>
```


## 2、启动类启用定时

在启动类上面加上`@EnableScheduling`即可开启定时

``` java
@SpringBootApplication
@EnableScheduling
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```


## 3、创建定时任务实现类

定时任务1：

``` java
@Component
public class SchedulerTask {

    private int count=0;

    @Scheduled(cron="*/6 * * * * ?")
    private void process(){
        System.out.println("this is scheduler task runing  "+(count++));
    }

}
```


定时任务2：

``` java
@Component
public class Scheduler2Task {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    @Scheduled(fixedRate = 6000)
    public void reportCurrentTime() {
        System.out.println("现在时间：" + dateFormat.format(new Date()));
    }

}
```


结果如下：

``` xml
this is scheduler task runing  0
现在时间：09:44:17
this is scheduler task runing  1
现在时间：09:44:23
this is scheduler task runing  2
现在时间：09:44:29
this is scheduler task runing  3
现在时间：09:44:35
```


## 参数说明

`@Scheduled` 参数可以接受两种定时的设置，一种是我们常用的`cron="*/6 * * * * ?"`,一种是 `fixedRate = 6000`，两种都表示每隔六秒打印一下内容。

**fixedRate 说明**

- `@Scheduled(fixedRate = 6000)` ：上一次开始执行时间点之后6秒再执行
- `@Scheduled(fixedDelay = 6000)` ：上一次执行完毕时间点之后6秒再执行
- `@Scheduled(initialDelay=1000, fixedRate=6000)` ：第一次延迟1秒后执行，之后按 fixedRate 的规则每6秒执行一次

> 文章内容已经升级到 Spring Boot 2.x 

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-scheduler)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples/tree/master/spring-boot-scheduler)**


