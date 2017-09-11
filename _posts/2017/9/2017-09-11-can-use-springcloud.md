---
layout: post
title: springcloud(十一)：spring cloud在国内中小型公司能用起来吗？
category: springcloud
tags: [springcloud]
---


想在公司推广spring cloud，但我对这项技术还缺乏了解。

<div align="center">
  <img src="http://www.ityouknow.com/assets/images/2017/springcloud/springcloud-question.png">
</div>


画了一张脑图，总结了 种种问题。

微服务是这样一个结构吗：

前端或二方 - > ng集群 -> zuul集群 -> eureka-server集群 -> service provider集群

（二方指其他业务部门）


首先楼主问的这些问题都挺好的，算是经过了自己的一番思考，我恰好经历了你所说的中小公司，且都使用spring cloud并且已经投产上线了。第一家公司技术开发人员15人左右，项目实例 30多，第二家公司开发人员100人左右，项目实例达160多。

实话说Spring Boot、Spring Cloud仍在高速发展，技术生态不断的完善和扩张，不免也会有一些小的bug，但对于中小公司的使用来将，完全可以忽略，基本都可以找到解决方案。接下来回到你的问题。


1、市场

据我所知有很多知名互联网公司都已经使用了spring cloud，比如阿里、美团但都是小规模，没像像我经历的这俩家公司，业务线全部拥抱spring cloud；另外spring cloud并不是一套高深的技术，普通的Java程序员经过一到俩个月完全就可以上手，但前期需要一个比较精通人的来带队。


2、学习

有很多种方式，现在spring cloud越来越火的情况下，各种资源也越来越丰富，查看官方文档和示例，现在很多优秀的博客在写spirng cloud的相关教程，我这里收集了一些spring boot和spring cloud的相关资源可以参考，找到博客也就找到人和组织了。

- [spring boot学习资料汇总](http://www.ityouknow.com/springboot/2015/12/30/springboot-collect.html)：
- [spring cloud学习资料汇总](http://www.ityouknow.com/springcloud/2016/12/30/springcloud-collect.html) ：

3、前后职责划分

其实这个问题是每个系统架构都应该考虑的问题，spring cloud只是后端服务治理的一套框架，唯一和前端有关系的是thymeleaf，spring推荐使用它做模板引擎。一般情况下，前端app或者网页通过zuul来调用后端的服务，如果包含静态资源也可以使用nginx做一下代理转发。

4、测试

spring-boot-starter-test支持项目中各层方法的测试，也支持controller层的各种属性。所以一般测试的步奏是这样，首先开发人员覆盖自己的所有方法，再测试微服务内所有服务保证实例内的正确性，最后进行微服务之间集成测试，最后交付测试。


5、配置

session共享有很多种方式，比如使用tomcat sesion共享机制，但我比较推荐使用redis缓存来做session共享。完全可以分批引入，我在上一家公司就是分批过渡上线，新旧项目通过zuul进行交互，分批引入的时候，最好是新业务线先使用spring cloud，老业务做过渡，当完全掌握之后在全部替换。如果只是请求转发，zuul的性能不一定比nginx低，但是如果涉及到静态资源建议还是在前端使用nginx做一下代理。另外sping cloud有配置中心，可以非常灵活的做所有配置的事情。


6、部署

多环境不同配置，spring cloud最擅长做这个事情了，使用不同的配置文件来配置不同环境的参数，在服务启动的时候指明某个配置文件既可，例如：java -jar app.jar --spring.profiles.active=dev 就是启动测试环境的配置文件；spring cloud 没有提供发布平台，因为jenkins已经足够完善了，推荐使用jenkins来部署spring boot项目，会省非常多的事情；灰度暂时不支持，可能需要自己来做，如果有多个实例，可以一个一个来更新；支持混合部署，一台机子部署多个是常见的事情。

7、开发

你说的包含html接口就是前端页面吧，spring boot可以支持，但其实也是spring mvc在做这个事情，spring cloud只做服务治理，其它具体的功能都是集成了各种框架来解决而已；excel报表可以，其实除过swing项目外，其它Java项目都可以想象；spring cloud和老项目可以混合使用，通过zuul来支持。是否支持callback，可以通过MQ来实现，还是强调spring cloud只是服务治理。

8、运维

Turbine、zipkin可以用来做熔断和性能监控；动态上下线某个节点可以通过jenkins来实现；provider下线后，会有其它相同的实例来提供服务，Eureka会间隔一段时间来检测服务的可用性；不同节点配置不同的流量权值目前还不支持。注册中心必须做高可用集群，注册中心挂掉之后，服务实例会全部停止。


以上问题可以参考：

- [Spring Boot](http://www.ityouknow.com/spring-boot)  
- [Spring Cloud](http://www.ityouknow.com/spring-cloud)

希望我回答解决了你的问题。

**最后放一张霸气的springcloud组建架构**

<div align="center">
  <img src="http://www.ityouknow.com/assets/images/2017/springcloud/spring-cloud-architecture.png">
</div>