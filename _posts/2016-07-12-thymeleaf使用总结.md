---
layout: post
title: thymeleaf使用总结
category: thymeleaf
tags: [thymeleaf]
---

thymeleaf 是新一代的模板引擎

## 标签使用


1、标签添加值

``` html
 <p  th:text="${collect.description}">description</p>
```

2、for 循环

``` html
  <tr  th:each="collect,stat : ${collects}"> 
     <th scope="row" th:text="${collect.id}">1</th>
     <td >
        <img th:src="${collect.webLogo}"/>
     </td>
     <td th:text="${collect.url}">Mark</td>
     <td th:text="${collect.title}">Otto</td>
     <td th:text="${collect.description}">@mdo</td>
     <td th:text="${collect.collectTime}">@mdo</td>
 </tr>
```

3、 a标签

``` html
<a target="_blank" th:href="@{${collect.url}}" th:text="${collect.title}">title</a>
```

4、设置背景

``` html
<div th:style="'background:url(' + @{/<path-to-image>} + ');'"></div>
```

根据属性值改变背景

``` html
 <div class="media-object resource-card-image"  th:style="'background:url(' + @{(${collect.webLogo}=='' ? 'img/favicon.png' : ${collect.webLogo})} + ')'" ></div>
```

5、URL

URL在Web应用模板中占据着十分重要的地位，需要特别注意的是Thymeleaf对于URL的处理是通过语法@{...}来处理的。
如果需要Thymeleaf对URL进行渲染，那么务必使用th:href，th:src等属性，下面是一个例子

``` html
<!-- Will produce 'http://localhost:8080/standard/unread' (plus rewriting) -->
 <a  th:href="@{/standard/{type}(type=${type})}">view</a>

<!-- Will produce '/gtvg/order/3/details' (plus rewriting) -->
<a href="details.html" th:href="@{/order/{orderId}/details(orderId=${o.id})}">view</a>
```
几点说明：

 * 上例中URL最后的``` (orderId=${o.id}) ``` 表示将括号内的内容作为URL参数处理，该语法避免使用字符串拼接，大大提高了可读性
 *  ``` @{...} ```表达式中可以通过``` {orderId} ```访问Context中的orderId变量
 *  ``` @{/order} ```是Context相关的相对路径，在渲染时会自动添加上当前Web应用的Context名字，假设context名字为app，那么结果应该是/app/order


## 参考

[新一代Java模板引擎Thymeleaf](http://www.tianmaying.com/tutorial/using-thymeleaf)
[Thymeleaf选择变量表达式](http://blog.ourway.top/post/76)
[thymeleaf官方指南](http://www.thymeleaf.org/doc/tutorials/2.1/thymeleafspring.html#integrating-thymeleaf-with-spring)




