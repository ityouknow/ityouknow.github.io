---
layout: post
title: idea常用快捷键
category: idea
tags: [idea]
---

记录idea的一些常用快捷键

## 快捷键

1、进入实现方法的快捷键

> Ctrl + Alt + B 
> > Ctrl + Alt + 鼠标点击

2、自动给方法添加注释的快捷键

> 输入/**,然后回车

3、删除一行

> CTRL + Y / CTRL + X

4、复制一行

> CTRL + D

5、自动导入包

> ALT + Enter

6、生成getter、setter方式

> ALT + insert

7、实现接口方法

> CTRL + O

8、移动整个代码块

> Ctrl + SHIfT + 上下箭头 

9、返回至上次浏览的位置

> Ctrl + ALT + 左/右

## 错误 

1、maven导入项目报错

> Failed to read artifact descriptor for org.springframework.cloud:spring-cloud-starter-eureka-server:jar:1.3.0.RELE
> intellij inspects a maven model for resolution problems


不同project下面存在相同的module,导致此问题，删除其它project中项目，再次导入OK。