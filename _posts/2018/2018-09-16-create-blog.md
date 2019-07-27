---
layout:     post
title:      技术人如何搭建自己的技术博客
category: other
tags: [other]
excerpt: 每个程序员都想拥有一个博客
---

上次有人留言说，技术博客是程序员的标配，但据我所知绝大部分技术同学到现在仍然没有自己的技术博客。原因有很多，有的是懒的写，有的是怕写不好，还有的是一直想憋个大招，幻想做到完美再发出来，结果一直胎死腹中。但其实更多程序员是不知道如何去搭建一个博客，其实如今搭建一个个人技术博客非常简单，其中最简单搭建方式莫属使用 GitHub Pages + Jekyll 了，我的博客就是使用这种技术。

## GitHub Pages

Github Pages 是面向用户、组织和项目开放的公共静态页面搭建托管服务，站点可以被免费托管在 Github 上，你可以选择使用 Github Pages 默认提供的域名 github.io 或者自定义域名来发布站点。Github Pages 支持 自动利用 Jekyll 生成站点，也同样支持纯 HTML 文档，将你的 Jekyll 站点托管在 Github Pages 上是一个不错的选择。

使用 Github Pages 搭建博客有以下几个优点：

- 完全免费，其中服务器、流量、域名什么的都管，完全零费用搭建一个技术博客
- 写博客就是提交代码，让写作和编程的体验保持一致
- 支持绑定自己的域名
- 提供流行的网页主题模板

缺点也是有的：

- 不支持动态内容，博客必须都是静态网页，一般会使用 Jekyll 来构建内容。
- 博客不能被百度索引，因 Github 和百度有过节，所以 Github 就把百度给屏蔽了。
- 仓库空间不大于1G
- 每个月的流量不超过100G
- 每小时更新不超过 10 次


Github Pages 使用 Jekyll 来构建内容，那么 Jekyll 是什么呢？

**Jekyll 介绍**

Jekyll 是一个简单的博客形态的静态站点生产机器。它有一个模版目录，其中包含原始文本格式的文档，通过一个转换器（如 Markdown）和我们的 Liquid 渲染器转化成一个完整的可发布的静态网站，你可以发布在任何你喜爱的服务器上。Jekyll 也可以运行在 GitHub Page 上，也就是说，你可以使用 GitHub 的服务来搭建你的项目页面、博客或者网站，而且是完全免费的。

但如果我们只是在 GitHub 上面使用的话，到不需要知道 Jekyll 的语法，一般 Github 会自动将我们写的 Markdown  文件转换成静态页面。使用 Jekyll 需要使用 Markdown 语法来写你的文章，不过 Markdown 语法非常简单，做为程序员来讲基本上两三天就掌握了，大家也可以参考这篇文章：[markdown 使用总结](http://www.ityouknow.com/other/2015/10/18/markdown-summary.html)。

给大家分享一些 Jekyll 主题，这个网站下有很多 [http://jekyllthemes.org/](http://jekyllthemes.org/) 主题，大家可以根据自己的爱好去选择博客主题。

## 我的个人博客

我的博客经过了三个阶段，第一个阶段，完全依托于使用 GitHub Pages 来构建；第二个阶段，将博客托管于国外的一个服务商；第三个阶段，服务器迁移回到国内、域名备案。之前也写过几篇关于技术博客的文章，如下：

- [千里追踪博客之殇](http://www.ityouknow.com/other/2017/09/10/blog-stop-a-month.html)
- [历时25天，我的博客（www.ityouknow.com）终于又活了过来](http://www.ityouknow.com/life/2018/06/10/my-blog-back.html)
- [技术博客那些事儿](http://www.ityouknow.com/other/2017/07/16/operating-technology-blog.html)

使用 Github Pages + Jekyll 构建一个技术博客很简单，基本上步骤就是网上找一个自己喜欢的主题，直接 Fork 到自己的 Github ，然后在删掉原博客中的内容，在上传自己的文章即可，以我自己的博客为例。

我的博客最初使用的是[Yummy-Jekyll](https://github.com/DONGChuan/Yummy-Jekyll)，但这个主题已经尽两年多都没有更新了。因此后期我在这个主题的基础上做了一些改动，其中有依赖组件的更新，结合个人情况对个别页面进行了改版，就成为了现在的样子：

![](http://favorites.ren/assets/images/2018/it/blog1.png)

使用这个主题的原因是，我比较喜欢简洁大气的风格，并且此博客主题对代码展示支持良好。

## 快速构建一个博客

以我的博客为例，介绍如何最快搭建一个博客。这也是我博客经历的第一个阶段。

1、首先打开地址[https://github.com/ityouknow/ityouknow.github.io](https://github.com/ityouknow/ityouknow.github.io)，点击 Fork 按钮将代码复制一份到自己的仓库。

![](http://favorites.ren/assets/images/2018/it/blog8.png)

过上一分钟，你的 github 仓库发现一个 ityouknow.github.io 项目。

2、删除 CNAME 文件

删除项目中的 CNAME 文件，CNAME 是定制域名的时候使用的内容，如果不使用定制域名会存在冲突。

3、设置 GitHub Pages

点击 Settings 按钮打开设置页面，页面往下拉到 GitHub Pages 相关设置，在 Source 下面的复选框中选择 master branch ，然后点击旁边的 Save 按钮保存设置。

![](http://favorites.ren/assets/images/2018/it/blog9.png)

4、重命名项目

点击 Settings 按钮打开设置页面，重命名项目名称为：github_username.github.io。

![](http://favorites.ren/assets/images/2018/it/blog11.png)

> github_username 是你的 github 登录用户名

5、重命名之后，再次回到 Settings > GitHub Pages 页面

会发现存在这样一个地址： https://github_username.github.io

![](http://favorites.ren/assets/images/2018/it/blog10.png)

这个时候，你访问此地址已经可以看到博客的首页，但是点击文章的时链接跳转地址不对，这是因为少配置了一个文件。

6、配置 _config.yml 

打开项目目录下的 _config.yml 文件，修改以下配置：

```
repository: github_username/github_username.github.io
github_url: https://github.com/github_username
url: https://github_username.github.io
```

这时候在访问地址： `https://github_username.github.io`，就会发现博客就已经构建完成了。剩下的事情就是去项目的 _posts 目录下删除掉我的文章，然后按照 Jekyll 的语法就写自己的文章就好了。

> github_username 为你的 github id。

## 自定义域名

虽然通过地址`https://github_username.github.io`可以正常访问博客，但是技术小伙伴们肯定有人想使用自己的域名访问博客，这样的需求 GitHub Pages 也是支持的。

首先需要设置域名解析，将域名的地址指向自己的 github 博客地址。这里以万网的域名配置为例，选择需要设置的域名点击解析，在域名解析页面添加以下两条记录

![](http://favorites.ren/assets/images/2018/it/blogcdn.png)

> 红框内，需要填写自己`github_username`值。

然后重新打开项目的 Settings > GitHub Pages 页面，Custom domain 下的输入框输入刚才设置的域名：xxx.com，点击保存即可。

![](http://favorites.ren/assets/images/2018/it/jiexi.png)

重新配置 _config.yml 

打开项目目录下的 _config.yml 文件，修改以下配置：

```
url: http://www.xxx.com
```

等待一分钟之后，浏览器访问地址：`www.xxx.com` 即可访问博客。

## 自定义 DIY 博客

一般同学到上面这一步也就完成了，基本满足了 80% 技术同学的需求。但还是有一些同学们有更高的追求，比如说使用 Github Pages 虽然简单方便，但是不能被百度检索白白流失了大量的流量，还有一个原因有些时候，博客网络访问稳定性不是很高。

当时我在国外有几个虚拟机，本来用作它用，后来在上面安装了一个 Nginx 作为静态页面的服务器。首先我在本机（win10）安装了 Jekyll 环境，将 Github 上的博客代码下载下来之后，在本机编译成静态的 Html ，然后手动上传到服务的 Nginx 目录下；然后将域名指向虚拟机。

> 非常不建议大家实践以上这段内容，win10 上面安装 Jekyll 环境是一段惨痛的经历。

就这样很麻烦的步骤我用了几个月后，实在是受不了了，一方面因为服务器在国外，有时候仍然不稳定（可能因为服务器安装了代理），另一方面我需要使用一些功能，使用这些功能的前提是网站需要备案，那段时间腾讯云在做活动，就把博客又从国外搬了回来，顺便重新优化了一下流程。

仍然把博客托管在 Github 上面，每次提交完代码后，在腾讯云上面执行一个脚本，这个脚本会自动从 Github 拉取最新更新的文件，并自动生产静态的 Html 文件推送到 Nginx 目录，域名重新指向这台服务器。可以在 Github 上面设置一些钩子，当提交代码的时候自动触发脚本，也可以定时触发脚本来发布文章。

脚本内容如下：

```
cd /usr/local/ityouknow.github.io
git pull http://github.com/ityouknow/ityouknow.github.io.git
jekyll build --destination=/usr/share/nginx/html
```

> 执行此脚本的前提是安装好 git\jekyll 环境，这个网上有很多案例，这里就不再多描述了。  
> 关于 Jekyll 环境搭建和使用可以参考这里：[https://jekyllcn.com/docs/home/](https://jekyllcn.com/docs/home/)

## 自动化部署

这两天看到[方志朋搞了自动化部署](https://www.fangzhipeng.com/life/2018/10/14/how-to-build-blog.html)，我也按照他的步骤实践了一番，很好用，所以把自动化部署这段写补上。

### 配置 Webhook

在开发过程中的 Webhook，是一种通过通常的 callback，去增加或者改变 Web page或者 Web app 行为的方法。这些 Callback 可以由第三方用户和开发者维持当前，修改，管理，而这些使用者与网站或者应用的原始开发没有关联。Webhook 这个词是由 Jeff Lindsay 在 2007 年在计算机科学 hook 项目第一次提出的。

用大白话讲就是，代码仓库在收到代码提交的时候，会自动触发一个 url 类型的通知，你可以根据这个通知去做一些事情，比如提交了代码就自动去部署项目。

我们的自动部署博客也是利用了这个机制，Github 自带了  Webhook 功能，我们直接配置即可使用。

在 Github 仓库的项目界面，比如本博客项目 `https://github.com/ityouknow/ityouknow.github.io`，点击 Setting->Webhooks->Add Webhook，在添加 Webhooks 的配置信息，我的配置信息如下：

```
Payload URL: http://www.ityouknow.com/deploy
Content type: application/json
Secret: 123456
```

如下图：

![](http://favorites.ren/assets/images/2018/it/webhook.png)

### 服务器接受推送

我们需要在博客的服务器上面建立一个服务，来接收 Github 提交代码后的推送，从而来触发部署的脚本。 Github 上有一个开源项目可以做这个事情 [github-webhook-handler](https://github.com/rvagg/github-webhook-handler)。

这个开源项目目的很单纯，就是负责接收 Github 推送过来的通知，然后执行部署脚本，不过他是使用 NodeJs 来开发的，所以我们先需要在 Centos 上面按照 Node 环境。

centos7 安装 Node 环境

首先添加源

```
sudo rpm -ivh https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-7-11.noarch.rpm

//yum安装node.js
yum install -y nodejs
```

然后在安装 github-webhook-handler

```
npm install -g github-webhook-handler     #安装 github-webhook-handler
#如果没有安装成功，可以选择法2来安装
npm install -g cnpm --registry=http://r.cnpmjs.org
cnpm install -g github-webhook-handler
```

安装成功之后，我们需要添加一个脚本。进入到安装目录下：

```
cd  /usr/lib/node_modules/github-webhook-handler
```

新建 deploy.js

```
vi deploy.js
```

脚本内容如下：

```
var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/deploy', secret: 'ityouknow' }) //监听请求路径，和Github 配置的密码
 
function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";
 
  child.stdout.on('data', function(buffer) { resp += buffer.toString(); });
  child.stdout.on('end', function() { callback (resp) });
}
 
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(3006)//监听的端口
 
handler.on('error', function (err) {
  console.error('Error:', err.message)
})
 
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  run_cmd('sh', ['/usr/local/depoly.sh'], function(text){ console.log(text) });//成功后，执行的脚本。
})
```

脚本的作业就是启动一个监听端口来接收请求，接收到请求后执行部署脚本，脚本内容的关键点已经标注上注释。

部署博客的脚本如下：depoly.sh

```
echo `date`
cd /usr/local/ityouknow.github.io
echo start pull from github 
git pull http://github.com/ityouknow/ityouknow.github.io.git
echo start build..
jekyll build --destination=/usr/share/nginx/html
```

就是拉取代码，进行部署而已。

这个脚本的启动需要借助 Node 中的一个管理 forever 。forever 可以看做是一个 nodejs 的守护进程，能够启动，停止，重启我们的 app 应用。

不过我们的先安装 forever，然后需要使用 forever 来启动 deploy.js 的服务，执行命令如下：

```
npm install forever -g   #安装
$ forever start deploy.js          #启动
$ forever stop deploy.js           #关闭
$ forever start -l forever.log -o out.log -e err.log deploy.js   #输出日志和错误
/root/node-v8.12.0-linux-x64/lib/node_modules/forever/bin/forever start -l forever.log -o out.log -e err.log deploy.js

如果报错：
/root/node-v8.12.0-linux-x64/lib/node_modules/forever/bin/forever start -a -l forever.log -o out.log -e err.log deploy.js
```

同时一般情况下，我们不会对外保留很多端口，所以需要通过博客的地址来转发，需要在 Nginx 上面添加一个转发配置，用来监听的 /deploy 请求转发到 nodejs 服务上，配置代码如下：

```
location = /deploy {
     proxy_pass http://127.0.0.1:3006/deploy;
}
```

这样我们整个自动化部署就完了，每次提交代码时，Github 会发送 Webhook 给地址`http://www.ityouknow.com/deploy`，Nginx 将 `/deploy` 地址转发给 Nodejs 端口为 3306 的服务，最后通过 github-webhook-handler 来执行部署脚本，已到达自动部署的目的。

以后只需要我们提交代码到 Github ,就会自动触发博客的自动化部署。

## 可能会出现的问题

有一些小伙伴反馈在克隆博客的时候出现了一些问题，在这里集中回复一下。

1、克隆博客后格式丢失

这是很多读者反馈的第一个问题，因为我的博客 css 和 图片是放到另外一个域名下的：www.itmind.net ，因此这块大家克隆过去需要改成本地的。

主要涉及的文件 `ityouknow.github.io\_includes` 目录下 head.html 和 footer.html 两个文件夹，将文件中的 `http://www.ityouknow.com/xxx/xxx` 改为相对路径`/xxx/xxx`即可。


2、留言功能丢失

这里就需要大家修改一下 _config.yml 中 gitalk 的配置信息。具体如何操作大家可以参考这篇文章 [jekyll-theme-H2O 配置 gitalk
](https://weijunzii.github.io/2018/06/29/Add-Gitalk-In-Jekyll-Theme-H2O.html)。注册完之后，需要在 `_config.yml` 配置以下信息：

```
gitalk:
    owner: ityouknow
    repo: blog-comments
    clientID: 61bfc53d957e74e78f8f
    clientSecret: 31c61e66cdcc9ada8db2267ee779d0bdafac434c
```

将这里改成你注册好的信息


3、博客

博客现在还缺检索功能，下一页和上一页功能、系列文章优化查看的功能，大家克隆后有完善功能的，也请帮忙留意，共同把这个博客完善的更好。



最后，大家可以在这篇文章下留下你的个人博客地址，方便同行们观赏、交流、学习。

