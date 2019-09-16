---
layout: post
title: 再见 Spring Boot 1.X ，Spring Boot 2.X 走向舞台中心
category: springboot
no-post-nav: true
tags: [springboot]
keywords: Spring Boot 1.X ,Spring Boot 2.X
---

2019年8月6日，Spring 官方在其博客宣布，Spring Boot 1.x 停止维护，Spring Boot 1.x 生命周期正式结束。

![](http://favorites.ren/assets/images/2019/springboot/goodbay1.x.png)

其实早在2018年7月30号，Spring 官方就已经在博客进行过预告，Spring Boot 1.X 将维护到2019年8月1日。 1.5.x 将会是 Spring Boot 1.0 系列的最后一个大版本。

![](http://favorites.ren/assets/images/2019/springboot/goodbay1.x-2.png)

如今 Spring Boot 1.X 版本最后将永久的定格在 `v1.5.22.RELEASE`，其实回想起来自从 Spring Boot 1.0 发布已经过去了 5 年多，相当于 Spring Boot 一年发布一个大的子版本，然后到了现在的 1.5.x。

而 Spring Boot 2.0.0 也于2018年3月1号正式发布，如今已经过了整整一年多，同时 Spring Boot 2.2 已经到了第五个里程碑。

Spring Boot 2.X 也是时候走向舞台中心接力 Spring Boot 1.x 的历史使命。

我们来回顾一下 Spring Boot 重大版本的历史节点：

- 2014年04月01号，Spring Boot 发布 v1.0.0.RELEASE，Spring Boot 正式商用
- 2014年06月11号，Spring Boot 发布 v1.1.0.RELEASE，主要修复了若干 Bug 
- 2014年12月11号，Spring Boot 发布 v1.2.0.RELEASE，此版本更新的特性比较多，主要集成了 Servlet 3.1，支持 JTA、J2EE 等。
- 2015年11月16号，Spring Boot 发布 v1.3.0.RELEASE，增加了新 `spring-boot-devtools` 模块，缓存自动配置、颜色 banners 等新特性。
- 2016年07月29号，Spring Boot 发布 v1.4.0.RELEASE，以 Spring 4.3 为基础进行的构建，更新了很多第三方库的支持，重点增加了 Neo4J, Couchbase、 Redis 等 Nosql 的支持。
- 2017年01月30号，Spring Boot 发布 v1.5.0.RELEASE，更新了动态日志修改，增加 Apache Kafka、LDAP、事物管理等特性的支持。
- 2018年03月01号，Spring Boot 发布 v2.0.0.RELEASE，2.0更新的内容就太多了，详情请参考：[Spring Boot 2.0权威发布](http://www.ityouknow.com/springboot/2018/03/01/spring-boot-2.0.html)
- 2018年10月30号，Spring Boot 发布 v2.1.0.RELEASE，主要更新了相关特性，详见：[Spring Boot 2.1.0 权威发布](http://www.ityouknow.com/springboot/2018/03/01/spring-boot-2.0.html)

当时 Spring Boot 2.0 刚刚发布的时候，我说过一段话：

> Spring Boot 2.0 是历时 4 年开发出来的巨作，在 Spring Boot 1.0 的基础上进行了大量的优化，淘汰了很多过期的 API，同时引入了一大批最新的技术，这些新技术在未来的一段时间内都具有引导性。
> 
> 如果不是特别需要使用 Spring Boot 2.0 上面提到的新特性，就尽量不要着急进行升级，等 Spring Boot 2.0 彻底稳定下来后再使用。如果想要升级也请先从早期的版本升级到 Spring Boot 1.5.X 系列之后，再升级到 Spring Boot 2.0 版本，Spring Boot 2.0 的很多配置内容和 Spring Boot 1.0 不一致需要注意。

当时因为 Spring Boot 2.0 刚刚发布有一些特性可能不是特别稳定，并不推荐大家立刻在生产环境使用，但到了今天 Spring Boot 2.X 系列最新稳定版本已经到了 2.1.7，大家可以放心的在生产环境使用了。

**生产中正在使用 Spring Boot 1.x 需要立刻升级吗？**

Spring Boot 1.x 只是停止维护，并不是不能用了，如果你不是特别着急想用 Spring Boot 2.x 的新特性，再用个几年也是没有任何问题的。

另外，Spring Boot 1.x 到  2.x 中间更新了很多 API 以及依赖组件。升级时需要先将 Spring Boot 1.X 系列升级到 1.5.x，再从 1.5.x 升级到 2.x 最新稳定版本。

Spring Boot 2.x 对 Java 环境的要求最低为 JDK 8，可能还有很多的公司服务器还在 1.6 或者 1.7 的环境中跑着，升级的时候也需要先升级服务器的基础环境。

如果项目中使用了微服务架构，建议可以一个一个子服务进行升级，不要一次全部升级完成，保障整个服务在升级过程的稳定性。我之前写过 Spring Boot 1.x 升级 2.x 的文章，大家可以参考：[Spring Boot 2.0 版的开源项目云收藏来了！](http://www.ityouknow.com/springboot/2018/06/03/favorites-spring-boot-2.0.html)。

最后祝愿 Spirng Boot 发展越来越好。

---

**同时大家如果想系统学习 Spring Boot 的使用，可以关注下面这个开源项目**

全网最全的 Spring Boot 学习示例项目，点击下方链接即可获取。

**[spring-boot-examples](https://github.com/ityouknow/spring-boot-examples)**


