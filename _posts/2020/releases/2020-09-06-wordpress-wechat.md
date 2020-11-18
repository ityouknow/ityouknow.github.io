---
layout: post
title: Wordpress 实现关注微信公众号后，才可下载特定资源
category: it
no-post-nav: true
tags: [it]
keywords: 微信公众号涨粉,wordpress,微信,涨粉,插件
excerpt: 市面上wordpress5.0唯一解决方案
---

Wordpress 目前是世界上建站使用最多的框架，很多朋友使用 Wordpress 做为自己的博客。慢慢的有些朋友会系那个将流量导入到自己的微信公众号，大家相续搞了一些方案。

甚至还有一个朋友做了一个叫“微信公众号涨粉”插件，基本上实现了涨粉必须关注公号才可以查看隐藏内容的功能。但是随着时间的流逝这个差距也有一个小问题，就是不支持 Wordpress 5，另外还有一个痛点所有的页面秘密都是一样的。

前段时间自己也搭了一个网站，想到达这样的功能，可惜找了很多相关的插件，或者现成的一些解决方案，都不能达到自己的需求，当然也发现了一些好玩的东西，于是在这个基础之上最后实现了预想中的功能。

1、必须在公众号中回复某个关键字，才可以看到隐藏内容（重要信息或者下载资源）。
2、每个页面可以单独定制秘密，也可以统一设置密码。


既然没有现成的解决方案，那就自己来了。

我是在网上查找相关解决方案的时候，看到了这个文章[WordPress代码隐藏文章内容 需登录或输入密码可见](https://www.joynop.com/p/82.html)，再它的基础上实现了相关功能。


废话不多说给大家说如何来实现吧。

在主题 function.php 文件里加入以下代码。

```
//部分内容输入密码可见
function e_secret($atts, $content=null){
	 extract(shortcode_atts(array('key'=>null), $atts));
	 if(isset($_POST['e_secret_key']) && $_POST['e_secret_key'] !='' && $_POST['e_secret_key']==$key){
		return '
				<div class="e-secret">'.$content.'</div>
				';
	 }elseif (isset($_POST['e_secret_key']) && $_POST['e_secret_key'] !='' && $key =='' && $_POST['e_secret_key']=='123456') {
		  return '
				<div class="e-secret">'.$content.'</div>
				';
	 }
	 else{
		 return '
		<form class="e-secret" action="'.get_permalink().'" method="post" name="e-secret" >
			<div class="e-secret-container">
			<div class="e-secret-title-content" >此处内容已经被作者无情的隐藏，请输入验证码查看内容：</div>
			<div class="e-secret-code" >
    			<span>验证码：</span>
			<input type="password" name="e_secret_key" class="euc-y-i" maxlength="50" >
			<input type="submit" class="euc-y-s" value="确定" >
    		</div>
			<div class="e-secret-tip" >
			    请关注本站公众号回复“<span>验证码</span>”，获取验证码。
			    <span>【注】</span>”在微信里搜索“不会笑青年”或者“laughyouth”或者微信扫描右侧二维码都可以关注微信公众号。
			</div>
			</div>
			<img src="http://www.ityouknow.com/assets/images/cartoon.jpg" alt="不会笑青年" >
			</form>
		';
	 }
}


add_shortcode('secret','e_secret');
```

然后注入到主函数中。


上面这段代码比较简单，意思就是页面是否有隐藏代码的标注，如果有的话显示需要验证的页面，如果是提交了页面秘密之后，根据秘密判断是否正确，如果正确展示出隐藏的内容。

自己主题 main.css 或者 style.css 或者 app.css 样式文件里添加下面代码 css 改动如下：



```
.e-secret {
    background: none repeat scroll 0 0 #fcffff;
    border: 1px dashed #24b4f0;
    color: #123456;
    padding: 10px;
    border-radius: 9px;
    margin: 18px 0px;
    overflow: hidden;
    clear: both;
	white-space: initial;
}

.e-secret img{
	float: right;
    max-width: 30%;
}

.e-secret input.euc-y-i[type="password"] {
    /* float: left; */
    background: #fff;
    width: 20%;
    line-height: 30px;
    margin-top: 5px;
    border-radius: 3px;
	display:inline-block;
}
.e-secret input.euc-y-s[type="submit"] {
    margin-top: -47px;
    width: 72px;
    margin-right: 1px;
    border-radius: 3px;
    margin-top: 1px;
    padding: 10px 8px;
	display:inline-block;
}


.e-secret-container{	
	display: inline-block;
    width: 70%;
    margin-top: 10px;
}

.e-secret-title-content{
	font-size: 18px;
    line-height: 20px;
    color: #f0503c;
    margin: 5px;
}

.e-secret-code{
	margin-top: 24px;
}

.e-secret-code span{
	font-size: 18px;
    font-weight: bold;
    margin: 5px;
}

.e-secret-tip{
	margin-top: 24px;
}

.e-secret-tip span{
	color: #f0503c;
}
```


以上代码即可实现我们想要的功能，如果在页面中需要隐藏部分内容是，就按照下面这种方式来写。


```
[secret key="密码"]加密内容[/secret] // 使用页面密码
[secret ]加密内容[/secret]    // 使用全局统一密码

```


如果这里使用了 key 这个关键字，就说明页面定制了自己的秘密，用户需要输入次密码才可以看到隐藏功能；如果没有使用 key 关键字那么系统就会默认使用统一的密码来隐藏内容。


最后的效果如下：

![](http://favorites.ren/assets/images/2020/it/wpsecret.png)


我把完整的代码放到了 不会笑青年公号中，感兴趣的朋友在公号中回复 306 查看。
