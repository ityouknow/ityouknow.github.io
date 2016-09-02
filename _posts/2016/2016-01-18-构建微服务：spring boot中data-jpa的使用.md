---
layout: post
title: 构建微服务：spring boot中data-jpa的使用
category: spring boot
tags: [spring]
---

在进行springboot 数据库开发操作的时候，发现国内对spring boot jpa全面介绍的文章比较少，在此整理一篇供大家参考


# 未完成




Keyword	| Sample	|JPQL snippet
 :-  	| :-        |	 :-  
And	|findByLastnameAndFirstname	|… where x.lastname = ?1 and x.firstname = ?2
Or	|findByLastnameOrFirstname	|… where x.lastname = ?1 or x.firstname = ?2
Is,Equals|	findByFirstname,findByFirstnameIs,findByFirstnameEquals	|… where x.firstname = ?1
Between	|findByStartDateBetween	|… where x.startDate between ?1 and ?2
LessThan |	findByAgeLessThan	|… where x.age < ?1
LessThanEqual|	findByAgeLessThanEqual	|… where x.age ⇐ ?1
GreaterThan	|findByAgeGreaterThan	|… where x.age > ?1
GreaterThanEqual|	findByAgeGreaterThanEqual	|… where x.age >= ?1
After	|findByStartDateAfter	|… where x.startDate > ?1
Before	|findByStartDateBefore	|… where x.startDate < ?1
IsNull	|findByAgeIsNull	|… where x.age is null
IsNotNull,NotNull|	findByAge(Is)NotNull	|… where x.age not null
Like	|findByFirstnameLike	|… where x.firstname like ?1
NotLike	|findByFirstnameNotLike	|… where x.firstname not like ?1
StartingWith|	findByFirstnameStartingWith	|… where x.firstname like ?1 (parameter bound with appended %)
EndingWith	|findByFirstnameEndingWith	|… where x.firstname like ?1 (parameter bound with prepended %)
Containing	|findByFirstnameContaining	|… where x.firstname like ?1 (parameter bound wrapped in %)
OrderBy	|findByAgeOrderByLastnameDesc	|… where x.age = ?1 order by x.lastname desc
Not	|findByLastnameNot	|… where x.lastname <> ?1
In	|findByAgeIn(Collection<Age> ages)	|… where x.age in ?1
NotIn|	findByAgeNotIn(Collection<Age> age)	|… where x.age not in ?1
TRUE|	findByActiveTrue()	|… where x.active = true
FALSE|	findByActiveFalse()	|… where x.active = false
IgnoreCase|	findByFirstnameIgnoreCase	|… where UPPER(x.firstame) = UPPER(?1)














## 参考
[JPA](http://log-cd.iteye.com/blog/288909)

[Spring Data JPA - Reference Documentation](http://docs.spring.io/spring-data/jpa/docs/current/reference/html/)


http://www.zhongtiancai.com/doc/JPA.htm

https://hongye.gitbooks.io/spring-data-jpa-/content/