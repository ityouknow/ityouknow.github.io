---
layout: post
title:  第58天： Web 开发 Django 入门
category: python
copyright: python
---

by 极光

今天来为大家介绍 Python 另一个 Web 开发框架 Django，它是一个基于 Python 定制的开源 Web 应用框架，最早源于一个在线新闻 Web 网站，后于2005年开源。Django 的功能大而全，它提供的一站式解决的思路，能让开发者不用在开发之前就在选择应用的基础设施上花费大量时间。它有很多功能强大的第三方插件，可以使我们更快速、方便的开发一个网站。

<!--more-->

## Django 框架

Django 采用了 MVC (即模型M，视图V和控制器C)构造的 Web 框架，但由于控制器接受用户输入的部分由框架自行处理，所以使用 Django 开发中里更关注的是模型（Model）、模板(Template)和视图（Views），称为 MTV 模式。
Django 的主要目的是简便、快速的开发数据库驱动的网站。它强调代码复用，多个组件可以很方便的以“插件”形式服务于整个框架，Django 有许多功能强大的第三方“插件”，你甚至可以很方便的开发出自己的工具包，这使得 Django 具有很强的可扩展性。它还强调快速开发和 DRY(Do Not Repeat Yourself) 原则。

## 安装 Django 库

同其他模块一样，Django 的安装也非常简单，下面通过 pip3 包管理器来安装


```shell
pip3 install django
```

安装 Django 之后就可以使用管理工具 `django-admin`，可以用来创建项目，创建应用，启动服务等操作命令。

```shell
$ django-admin
cleanup           -- remove old data from the database
compilemessages   -- compile .po files to .mo for use with gettext
createcachetable  -- creates table for SQL cache backend
createsuperuser   -- create a superuser
dbshell           -- run command-line client for the current database
diffsettings      -- display differences between the current settings and Django defaults
dumpdata          -- output contents of database as a fixture
flush             -- execute 'sqlflush' on the current database
inspectdb         -- output Django model module for tables in database
loaddata          -- install the named fixture(s) in the database
makemessages      -- pull out all strings marked for translation
reset             -- executes 'sqlreset' for the given app(s)
runfcgi           -- run this project as a fastcgi
runserver         -- start a lightweight web server for development
shell             -- run a Python interactive interpreter. Tries to use IPython, if it's available
sql               -- print the CREATE TABLE statements for the given app(s)
sqlall            -- print the CREATE TABLE, CREATE INDEX and custom statements for the given app(s)
sqlclear          -- print the DROP TABLE statements for the given app(s)
sqlcustom         -- print the custom table-modifying SQL statements for the given app(s)
sqlflush          -- print the SQL statements required to return all tables to installation state
sqlindexes        -- print the CREATE INDEX statements for the given app(s)
sqlreset          -- print the DROP TABLE and CREATE TABLE statements for the given app(s)
sqlsequencereset  -- print the SQL statements for resetting sequences for the given app(s)
startapp          -- create Django app directory in this project's directory
syncdb            -- create database tables for apps in INSTALLED_APPS where required
test              -- run the test suite for the specified app, or the entire site
testserver        -- run a development server with data from the given fixture(s)
validate          -- validate all installed modules

```

## 创建一个项目

项目是 Django 实例的一系列设置的集合，它包括数据库配置、Django 特定选项以及应用程序的特定设置。安装成功后，接下来我们开始创建一个新项目 `TestProject`

```shell
$ django-admin startproject TestProject

$ cd TestProject
$.
 |____manage.py
 |____TestProject
 | |______init__.py
 | |____settings.py
 | |____urls.py
 | |____wsgi.py

```

>**目录说明**：
TestProject: 项目的容器。
manage.py: 一个实用的命令行工具，可让你以各种方式与该 Django 项目进行交互。
TestProject/__init__.py: 一个空文件，告诉 Python 该目录是一个 Python 包。
TestProject/settings.py: 该 Django 项目的设置/配置。
TestProject/urls.py: 该 Django 项目的 URL 声明; 一份由 Django 驱动的网站"目录"。
TestProject/wsgi.py: 一个 WSGI 兼容的 Web 服务器的入口，以便运行你的项目。

## 启动开发服务器

创建完项目后，其实就已经构成了一个可运行的 Django 网站。Django 自带了一个简单的网络服务器，在开发过程中非常方便，所以我们无需安装任何其他软件即可在本地运行项目。在 `TestProject` 项目目录下输入如下命令启动服务器:

```shell
$ python manage.py runserver 127.0.0.1:8080
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 17 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.

September 27, 2019 - 10:54:32
Django version 2.2.5, using settings 'testweb.settings'
Starting development server at http://127.0.0.1:8080/
Quit the server with CONTROL-C.

```

如上所示服务启动完成。
django 开发服务是可用在开发期间的，一个内建的，轻量的web服务。它提供了一个在网站开发阶段时实监测你的代码修改并加载到它们，你能直接看到修改结果而不需要重启服务。

>127.0.0.1：表示可连接到服务器的IP地址
8080：端口号(如果不指定，端口号默认为 8000)

然后在浏览器输入服务器的IP及端口号(这里我们输入本机 IP 地址： 127.0.0.1:8080) ，如果正常启动，输出结果如下：

![正常启动](http://www.justdopython.com/assets/images/2019/python/python_web_django_01.png)

>注意：开发服务器在需要的情况下会对每一次的访问请求重新载入一遍 Python 代码。所以你不需要为了让修改的代码生效而频繁的重新启动服务器。然而，一些动作，比如添加新文件，将不会触发自动重新加载，这时你得自己手动重启服务器。

## 配置开发服务器

Django 是一个支持国际化和本地化的框架，因此刚才我们看到的默认首页也是支持国际化的，我们将默认语言修改为中文，时区设置为东八区，配置如下：

```shell
$ vi TestProject/settings.py
```

```
# 省略上下文
# 设置语言代码
LANGUAGE_CODE = 'zh-hans'
# 设置时区
TIME_ZONE = 'Asia/Chongqing'
```

然后刷新刚才的页面，页面会变为中文显示，如下图所示：
![](http://www.justdopython.com/assets/images/2019/python/python_web_django_02.png)

## 创建一个应用

创建完项目，就可以在项目创建应用了，每一个应用都是一个 Python 包，并且遵循着相同的约定。Django 自带一个工具，可以帮你生成应用的基础目录结构，这样你就能专心写代码，而不是创建目录了。

>**项目 VS 应用**
项目和应用有啥区别？应用是一个专门做某件事的网络应用程序——比如博客系统，或者公共记录的数据库，或者简单的投票程序。项目则是一个网站使用的配置和应用的集合。项目可以包含很多个应用，应用可以被很多个项目使用。

你的应用可以存放在任何 Python `path` 中定义的路径。在这个教程中，我们将在你的 `manage.py` 同级目录下创建投票应用。这样它就可以作为顶级模块导入，而不是 `mysite` 的子模块。
请确定你现在处于 `manage.py` 所在的目录下，然后运行这行命令来创建一个应用：

```shell
$ python manage.py startapp polls
$ tree     #列出当前目录结构
.
|____db.sqlite3
|____manage.py
|____polls
| |______init__.py
| |____admin.py
| |____apps.py
| |____migrations
| | |______init__.py
| |____models.py
| |____tests.py
| |____views.py
|____TestProject
| |______init__.py
| |______pycache__
| | |______init__.cpython-37.pyc
| | |____settings.cpython-37.pyc
| | |____urls.cpython-37.pyc
| | |____wsgi.cpython-37.pyc
| |____settings.py
| |____urls.py
| |____wsgi.py
```

然后我们就可以编辑`polls`应用中的`views.py`视图，操作如下：

```shell
$ vim polls/views.py
```

```python
from django.http import HttpResponse

def index(request):
    return HttpResponse("你好，这是一个投票页面。")
```

保存后退出，这样一个简单的视图就做好了，接下来需要给它加一个指向这个视图的路由。首先我们需要在`polls`应用下新建 `urls.py` 的文件，操作如下：

```shell
$ vim polls/urls.py
```

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

保存后退出，然后还需要修改 `TestProject` 目录下的 `urls.py`，增加 `polls` 的路由映射配置，如下：

```shell
$ vim TestProject/urls.py
```

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('admin/', admin.site.urls),
]
```

>函数 `include()` 允许引用其它 `URLconfs`。每当 Django 遇到 `include()` 时，它会截断与此项匹配的 URL 的部分，并将剩余的字符串发送到 `URLconf` 以供进一步处理。
Django设计 `include()` 的理念是使其可以即插即用，当包括其它 URL 模式时你应该总是使用 `include()`， `admin.site.urls` 是唯一例外。

保存后退出，然后我们再访问网址 http://localhost:8080/polls/， 就能访问到我们新创建的页面了，如下图：

![](http://www.justdopython.com/assets/images/2019/python/python_web_django_03.png)

## 总结

本文通过上面几步操作，就可以快速创建一个可访问的网站，是不是觉得用 Django 开发网站原来这么简单方便。Django还有模板，表单，路由，认证，基本的数据库管理等等内建功能，接下来将进一步的介绍 Django 的高级功能。

## 参考

- [Django 中文文档：https://docs.djangoproject.com/zh-hans/2.2/](https://docs.djangoproject.com/zh-hans/2.2/)
- [Django W3C介绍：https://www.w3cschool.cn/django/](https://www.w3cschool.cn/django/)

[示例代码：https://github.com/JustDoPython/python-100-day](https://github.com/JustDoPython/python-100-day)

