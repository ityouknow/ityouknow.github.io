---
layout: post
title:  第59天： Web 开发 Django 模型
category: python
copyright: python
---

by 极光

今天来为大家介绍 Django 框架的模型部分，模型是真实数据的简单明确的描述，它包含了储存的数据所必要的字段和行为，Django 遵循 DRY Principle 。它的目标是你只需要定义数据模型，然后其它的杂七杂八代码你都不用关心，它们会自动从模型生成。

<!--more-->

## Django 模型

Django 中模型是真实数据的简单明确的描述，它包含了储存的数据所必要的字段和行为，在创建模型前需要先配置好数据库。 Django 对各种数据库提供了很好的支持，包括：PostgreSQL、MySQL、SQLite、Oracle等，Django 为这些数据库提供了统一的调用 API。 我们可以根据自己业务需求选择不同的数据库。

## 数据库配置

Python 内置 SQLite，所以你无需安装额外东西来使用它，在 `TestProject` 项目目录下，打开 `TestProject/settings.py` 配置文件， 已经配置了 SQLite 作为默认数据库。当然如果在真实项目中，我们可以换一个更具扩展性的数据库，如Mysql等。具体配置操作如下：

```python
# TestProject/settings.py

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

配置说明：

- ENGINE：数据库驱动，可选（'django.db.backends.sqlite3'，'django.db.backends.postgresql'，'django.db.backends.mysql'，或 'django.db.backends.oracle'）
- NAME：数据库的名称（这里使用的SQLite对应的是一个数据库文件路径）
- USER：数据库登陆用户名
- PASSWORD：数据库登陆密码
- HOST：数据库所在主机连接地址（可以是域名或IP地址）
- PORT：数据库所在主机服务端口号

## 创建模型

还是以我们之前创建的投票应用为基础，在这个应用中创建两个模型--Question和Choice。

- Question（问题）中包含提问的内容和发布的时间两个字段。
- Choice（选项）中包含针对问题的选项以及已投票数，每个问题可以有多个选项。
  
下面我们将以上模型描述通过编辑 `polls/models.py` 文件定义出来。

```python
# polls/models.py

from django.db import models


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('发布日期')


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

```

这里有以下几点需要注意：

1. 每个模型被定义为 django.db.models.Model 类的子类。
2. 每个模型有一些类变量，它们都表示模型里的一个数据库字段。
3. 每个字段都是 Field 类的实例，如 CharField 对应数据库中的字符串字段。
4. 每个 Field 类实例变量的名字也是字段名，如 question_text，定义时需要遵循数据库字段规则。
5. 实例变量的名字可以定义备注名，方便代码理解，如 pub_date = models.DateTimeField('发布日期')。
6. 某些 Field 类实例定义时需要参数，还有一些可选参数，对应数据库表结构，如 CharField 类需要定义长度max_length。
7. 使用 ForeignKey 可以定义表外键关联，如本例中用 ForeignKey 定义了每个 Choice 都要关联到一个 Question 对象上。

## 激活模型

通过配置上面 `models.py` 类中创建模型的代码，已经足够 Django 为我们创建数据库和相应表结构了，现在我们将 `polls` 应用安装到我们 `TestProject` 项目中。
首先再次打开 `TestProject/settings.py` 配置文件，在配置类 `INSTALLED_APPS` 中添加 `polls` 应用的点式路径  `'polls.apps.PollsConfig'`，配置完成如下所示：

```python
# TestProject/settings.py

INSTALLED_APPS = [
    'polls.apps.PollsConfig',   #新增polls路径
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

>因为 PollsConfig 类写在文件 polls/apps.py 中，所以它的点式路径是 'polls.apps.PollsConfig'

保存配置并退出，然后运行 `makemigrations` 命令, Django 会检测你对模型文件的修改，并且把修改的部分储存为一次`迁移`（迁移是 Django 对于模型定义即你的数据库结构的变化的储存形式）。

```shell
$ python manage.py makemigrations polls
Migrations for 'polls':
  polls/migrations/0001_initial.py
    - Create model Question
    - Create model Choice
```

执行成功后，就可以再执行 `migrate` 命令，将你在模型中定义的数据库修改同步到应用的数据库表结构上，执行结果如下：

```shell
$ python manage.py migrate
Operations to perform:
  Apply all migrations: polls
Running migrations:
  Applying polls.0001_initial... OK
```

>数据库`迁移`操作被分解成生成和应用两个命令是为了让你能够在代码控制系统上提交迁移数据并使其能在多个应用里使用；这不仅仅会让开发更加简单，也给别的开发者和生产环境中的使用带来方便。

## 模型操作

对模型对象的操作，本质上就是数据库数据的操作。下面我们就通过对模型对象操作实现对数据库记录基本的CURD操作。

### 新增数据

编辑 `TestProject` 项目下 `polls/views.py` 文件代码，通过访问 `URL` 在 `Question` 模型对应表中添加数据。

```python
# polls/views.py
from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from polls.models import Choice, Question
from django.utils import timezone

def index(request):
    return HttpResponse("你好，这是一个投票页面。")

# 增加问题描述信息
def add(request):
    question = Question(question_text='双十一你在哪个平台剁手？',pub_date=timezone.now())
    question.save();
    return HttpResponse("新增投票成功！")

```

再编辑 `polls/urls.py` 文件代码，新增一条 `add` 的路由，代码如下：

```python
# polls/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add', views.add, name='add'),    #新增add路由
]
```

保存后，通过 `python manage.py runserver 127.0.0.1:8080` 命令启动本地开发服务器，启动后在浏览器中输入URL地址 `http://127.0.0.1:8080/polls/add` ，会返回如下页面表示新增数据成功。

![](http://www.justdopython.com/assets/images/2019/python/python_web_django_11.jpg)

接下来我们再刷新下页面，这样就会再增加一条数据，然后我们把这两条记录查出来。

### 查询数据

Django 提供了多种方式来查询出数据库记录，如查询上面 `Question` 模型对应全部数据，某个id的数据以及通过多条件过滤得到所需要的数据。依然编辑 `TestProject` 项目下 `polls/views.py` 文件，增加查询对应代码：

```python
# polls/views.py
# …… 省略部分代码

def query(request):
    # 通过objects这个模型管理器的all()获得所有数据行，相当于SQL中的SELECT * FROM question
    questionList = Question.objects.all()
    # 获取单个对象
    response2 = Question.objects.get(id=1)
    # 相当于SQL中的WHERE id=1，可设置条件过滤
    response3 = Question.objects.filter(id=1)
    #根据id字段排序
    response5 = Question.objects.order_by("id")

    res = ""
    # 遍历所有对象
    for q in questionList:
        res += str(q.id) + "." + q.question_text + " <br />"
    return HttpResponse("查询所有问题：<br />" + res)

```

再编辑 `polls/urls.py` 文件代码，新增一条 `query` 的路由，代码如下：

```python
# polls/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add', views.add, name='add'),  
    path('query', views.query, name='query'),  #新增的query路由
]
```

然后再浏览器中输入 URL `http://127.0.0.1:8080/polls/query` ，看到如下图所求请求结果：

![](http://www.justdopython.com/assets/images/2019/python/python_web_django_12.jpg)

可以看到出现两条一样的记录，但是 `id` 不同，不过这正符合我们的预期，下面我们将对第一条数据进行修改和删除。

### 修改数据和删除

修改和删除数据可以操作一条或多条记录，这取决于你的查询条件，再次编辑 `TestProject` 项目下 `polls/views.py` 文件，增加修改和删除对应代码：

```python
# polls/views.py
# …… 省略部分代码

#修改数据
def update(request):
    question1 = Question.objects.get(id=1)
    question1.question_text = '天猫和京东你会选哪个？'
    question1.save()

    # 通过条件过滤的方式也可以更新一条或多条数据
    # Question.objects.filter(id=1).update(question_text='天猫和京东你会选哪个？')

    return HttpResponse("更新id=1：" + question1.question_text)

#删除数据
def delete(request):
    question2 = Question.objects.get(id=2)
    question2.delete()

    # 通过条件过滤的方式也可以删除一条或多条数据
    # Question.objects.filter(id=2).delete()

    # 删除所有数据
    # Question.objects.all().delete()

    res3 = ''
    questionList = Question.objects.all()
    # 遍历所有对象
    for q in questionList:
        res3 += str(q.id) + "." + q.question_text + " <br />"
    return HttpResponse("删除后查询：<br />" + res3)
```

再编辑 `polls/urls.py` 文件代码，新增一条 `query` 的路由，代码如下：

```python
# polls/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add', views.add, name='add'),  
    path('query', views.query, name='query'), 
    path('update', views.update, name='update'),  # 新增update路由
    path('del', views.delete, name='del'),  # 新增del路由
]
```

完成以上代码配置，我们就可以通过访问 URL `http://127.0.0.1:8080/polls/update` 实现第一条数据的更新操作，请求后返回页面如下：

![](http://www.justdopython.com/assets/images/2019/python/python_web_django_15.jpg)

这样我们就把第一条数据的问题描述更新了，再次通过 URL `http://127.0.0.1:8080/polls/query` 查询下所有数据，可以看到返回页面如下：

![](http://www.justdopython.com/assets/images/2019/python/python_web_django_16.jpg)

好，更新成功后，我们再试下删除数据了，通过查看删除相关代码是把 `id` 为2的数据删除了，这次我们访问的 URL `http://127.0.0.1:8080/polls/del`，然后返回删除后再次查询所有记录的页面，如下图：

![](http://www.justdopython.com/assets/images/2019/python/python_web_django_17.jpg)

可以看到只剩下一条数据，说明我们已经删除成功了。

## 总结

本文为大家介绍了 Django 的模型，通过上面学习我们了解到模型功能的强大，为我们基于数据库的开发节省了大量工作量。Django还有模板，表单，路由，认证，基本的数据库管理等等内建功能，接下来将进一步的介绍 Django 提供的其他功能。

参考

- [Django 中文文档：https://docs.djangoproject.com/zh-hans/2.2/](https://docs.djangoproject.com/zh-hans/2.2/)
- [Django W3C介绍：https://www.w3cschool.cn/django/](https://www.w3cschool.cn/django/)

[示例代码：https://github.com/JustDoPython/python-100-day](https://github.com/JustDoPython/python-100-day)
