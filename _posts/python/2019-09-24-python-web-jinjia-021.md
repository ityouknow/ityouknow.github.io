---
layout: post
title:  第21天： Web 开发 Jinja2 模板引擎
category: python
copyright: python
---

>  by 太阳雪


被之前的文章中，简单介绍了 Python Web 开发框架 Flask，知道了如何写个 Hello World，但是距离用 Flask 开发真正的项目，还有段距离，现在我们目标更靠近一些 —— 学习下 Jinja2 模板。

<!--more-->

## 模板的作用

模板是用来做什么的呢？模板是用来更高效地生成相应时的 Html 文本的，没有模板，可以手写，比如之前的 hello world 示例，写段 html 代码:

```html
<h1>Hello world!</h1>
```

对于简单的练习还行，但对于规模大的，动态化程度高的项目来说，这样写就有些勉强了，即，不利于项目和产品化。那么模板有什么好处呢：

- **能让展现逻辑和业务逻辑**
    展示逻辑即 UI，就是用来给用户看和操作的，业务逻辑是业务规则，比如什么条件可以注册，什么权限能考到什么。模板将展现逻辑封装起来，业务逻辑写在视图函数中。
- **能使项目更易维护**
    由于展现逻辑和业务逻辑的分离，它们可以由不同的开发人员来维护，不会有代码冲突的问题
- **使项目更加安全**
    在做交互式开发中，有个原则: **永远不要相信用户的输入**，因为恶意用户可能通过输入来注入（关于注入以后有机会可以单独聊聊），而模板在一定程度上会防注入，例如用户输入一点 html 代码作为输入，默认情况下模板会将其替换为网络安全字符，以防止恶意注入。
- **能提高开发效率**
    有了模板，相当于一个展示逻辑的函数，所以就可以被复用，可以用在不同的视图函数中，也可以用在不同的项目中

>思考下：
>上面提到的**展现逻辑**和**业务逻辑**，为什么不直接说成**前台**和**后台**呢?
>如果你有答案和想法，欢迎留言讨论。

### Jinja2 模板引擎

Jinja2 是 Flask 框架默认支持的模板引擎，并不是唯一也不是最好（因人而异，没有最好）模板引擎，不同的 Web 框架，比如 Django、Nodejs 等都有自己的模板引擎，甚至一些程序员自己实现的模板引擎（我就这么干过），但大体思路是一样的，都是要将数据替换或者转换到，用特殊格式标记了位置的模板中，以合成动态的 html，这种技术不新鲜，在之前的打印模板，如水晶报表里就有，无非就是标记和语法不同而已，所以要举一反三。

### 引入渲染函数

像其他功能一样，要使用模板引擎，先引入

```python
from flask import render_template
```

>**注意**： 要将将模板文件放置在项目根目录(即 `print(__file__)` 显示的路径)下的 `templates` 文件夹中

例如模板文件 `hello.html` 为：

{% raw %}
```
<h1>Hello {{ name }} </h1>
```
{% endraw %}


视图函数可以写成:

```python
@app.route('/user/<name>')
def index(name):
    return render_template('hello.html', name=name)
```

Flask提供的 `render_template` 函数把Jinja2模板引擎集成到了程序中。 `render_template` 函数第一个参数是模板的文件名，随后的参数都是键值对，表示模板中变量的对应的真实值，在上面代码中，模板会接收到一个名为 `name` 的变量

### 变量

模板文件就是普通的文本文件，然后将需要替换的部分用双大括号( `{{ }}` )标记出来，双大括号中，表示要替换的变量名，这个变量支持基本数据类型，以及列表、词典、对象和元组。如模板 `template.html`:

{% raw %}
```
<p> A value form a string: {{ name }}.</p>
<p> A value form a int: {{ myindex }}.</p>
<p> A value form a list: {{ mylist[3]] }}.</p>
<p> A value form a list, with a variable index: {{ mylist[myindex] }}.</p>
<p> A value form a dictionary: {{ mydict['key'] }}.</p>
<p> A value form a tuple: {{ mytuple }}.</p>
<p> A value form a tuple by index: {{ mytuple[myindex] }}.</p>
```
{% endraw %}


视图函数代码:

```python
@app.route('/template/')
def template():
    name = 'Jinja2 模板引擎'
    myindex = 1
    mylist = [1,2,3,4]
    mydict = {
       key: 'age',
       value: '25'
    }
    mytuple = (1,2,3,4)
    return render_template('template.html', name=name, myindex=myindex, mylist=mylist, mydict=mydict, mytuple=mytuple)
```

显示结果:

![显示结果](http://justdopython.com/assets/images/2019/python/python_web_template_01.jpg)

### 过滤器

有些时候需要对要在模板中替换的值做一些特殊处理，比如首字母大写，去掉前后空格等等，有种选择就是使用过滤器。

#### 说明

Jinjia2 模板引擎中，过滤器类似于 Linux 命令中的管道,例如将字符串变量的首字母大写

{% raw %}
```html
<h1>{{ name | capitalize}}</h1>
```
{% endraw %}

过滤器可以拼接，和 linux 的管道命令一样，如对值进行全部变大写，并且去除前后空白字符：

{% raw %}
```html
<h1>{{ name | upper | trim }}</h1>
```
{% endraw %}

如上代码，过滤器和变量之间用管道符号 | 相连，相当于对变量值作进一步加工。

一些常用的过滤器

|过滤器|说明|
|---|--|
|safe|渲染是不转义|
|capitalize|首字母大写|
|lower|所有字母小写|
|upper|所有字母大写|
|title|值中每个单词首字母大写|
|trim|删除首位空白字符|
|striptags|渲染时删除掉值中所有HTML标签|

**注意**： safe 过滤器，默认情况下，处于安全考虑，Jinja2 会转义所有变量，例如一个变量的值为`<h1>Hello</h1>`, Jinja2 会将其渲染成`&lt;h1&gt;Hello&lt;/&gt;`,浏览器会显示出原本的值，但是不会解释。如果需要浏览器解释的话，可以使用 safe 过滤器
例如模板文件`html.html`为:

{% raw %}
```Jinja
<h1>{{ html | safe }}</h1>
```
{% endraw %}

视图函数为：

```python
@app.route('/html')
def html():
    return render_template('html.html', html='<b>bob</b>')
```

> **注意：**千万别在不可信的值上使用 safe 过滤器，例如用户在表单上输入的文本。

还有一些有用的过滤器

- `default`，可以当变量未定义时，提供默认值，如果想将 `false`、`False` 和空( `none` )视为未定义，需要提供第二个参数为 `true`

{% raw %}
```Jinja
<!-- 提供默认值过滤器 -->
<h1>Hello {{ name | default('world') }}!</h1>

<!-- 将false、False和空(none)视为未定义的默认值过滤器 -->
<h1>Hello {{ name | default('world', true)! }}</h1>
```
{% endraw %}

当变量 `name` 的未定义时，上下两个显示效果一样，当值为 `none` 时，上面会显示 `Hello none!`, 而下面的会显示 `Hello world!`

- 列表过滤器 `min`, `max`, 得到列表中的最小值或最大值

#### 自定义过滤器

过滤器虽然有很多，但总有不满足需求的时候，例如首行文字缩进、将金额转化为中文的大写等等。
过滤器实质就是个函数，所以，第一定义一个过滤器函数，第二，注册到Jinjia2 的过滤器中。

```python
# 定义过滤器函数
def mylen(arg):# 实现一个可以求长度的函数
    return len(arg)
def interval(test_str, start, end): # 返回字符串中指定区间的内容
    return test_str[int(start):int(end)]

# 注册过滤器
env = app.jinja_env
env.filters['mylen'] = mylen
env.filters['interval'] = interval

# 视图函数
@app.route('/myfilter')
def myfilter():
    return render_template('myfilter.html', phone='13300000000')
```

模板文件

{% raw %}
```html
<h1>电话号码是：{{ phone }}, 长度为：{{ phone | mylen }}，运营商号：{{ phone | interval(0,3) }}</h1>
```
{% endraw %}

> 过滤器注册代码还可以写在初始化代码 `__init__.py` 中

### 控制结构

很多时候，需要更智能的模板渲染，即能给渲染编程，比如男生一个样式，女生一样样式，控制结构指令需要用指令标记来指定，下面介绍下一些简单的控制结构

#### 条件

即在模板中用 `if-else` 控制结构

{% raw %}
```Jinja
{% if gender=='male' %}
    Hello, Mr {{ name }}
{% else %}
    Hello, Ms {{ name }}
{% endif %}
```
{% endraw %}

视图函数

```python
@app.route('/hello2/<name>/<gender>')
def hello2(name, gender):
    return render_template('hello2.html', name=name, gender=gender)
```

在控制结构里，代码语法同`python`

#### 循环

循环对于渲染列表，很有帮助，循环的标记是 `for`。例如奖列表的内容显示在 `ul` 中

{% raw %}
```Jinja
<ul>
{% for name in names %}
    <li>{{ name }} </li>
{% endfor %}
</ul>
```
{% endraw %}

例如给定一个学生列表，将其用无序列表 `ul` 显示出来

### 宏——模板中的函数

模板中可以定义宏，相当于定义了一个函数，可以重复使用，让逻辑更清晰。
首先，定义一个宏:

mymacro.html

{% raw %}
```Jinja
{% macro render_name(name) %}
    <li>{{ name }}</li>
{% endmacro %}
```
{% endraw %}

然后使用宏, 例如将循环结构的例子中，显示名称的地方，改为调用宏

{% raw %}
```Jinja
<ul>
    {% for name in names %}
        {{ render_name(name) }}
    {% endfor %}
</ul>
```
{% endraw %}

调用宏，和调用函数是一样的，不过要将代码写在 `{{}}` 双大括号内。
一般我们会将宏存在单独的文件中，以便复用，在需要用到宏的地方，引用就好了

{% raw %}
```Jinja
{% import 'mymarco.html' as macros %}
<ul>
    {% for name in names %}
        {{ macros.render_name(name) }}
    {% endfor%}
</ul>
```
{% endraw %}

如上所述，用 improt 引入宏定义文件，通过 as 指定别名，和 python 的模块引入一样。指定别名是一个良好的编程习惯，可以将一个复杂的东西形象化，同时像一个命名空间一样，有效的避免冲突。

### include

另外可以将多个模板片段写入一个单独文件，再包含( `include` )在所有模板中，以提高开发效率:

{% raw %}
```Jinja
{% include 'common.html' %}
```
{% endraw %}

`include` 进来的文件，相当于将文件中的内容复制到 `include` 的位置，所以自使用之前需要考虑仔细

### 模板继承

如果觉得 `include` 过于呆板，灵活性差，Jinja2 模板引擎还有更高级的功能——继承。类似于 Python 代码中类的继承，一起看看。
首先定义一个基类, base.html:

{% raw %}
```Jinja
<html>
<head>
    {% block head %}
    <title>{% block title %}{% endblock%} - My Application</title>
    {% endblock %}
</head>
<body>
    {% block body %}
        <h3>这是基类的内容</h3>
    {% endblock %}
</body>
</html>
```
{% endraw %}

其中的 `block` 标签，定义了可以被子类重构（替换）的部分，每个 `blcok` 标签，需要指定一个特殊的名称，例如 `head`、`title` 等，以便子类用特定的名称来重构。另外 `block` 标签需要有结束标签 `endblock`,类似于类C语言中的大括号，当然 `block` 标签也可以嵌套。
接下来，定义一个子类模板 hello3.html：

{% raw %}
```Jinja
{% extends "base.html" %}
{% block title %}Index{% endblock %}
{% block head %}
    {{ super() }}
    <style></style>
{% endblock %}
{% block body %}
    {{ super() }}
    <h3>这是子类的内容 Hello world!</h>
{% endblock %}
```
{% endraw %}

效果如图所示:

![显示结果](http://justdopython.com/assets/images/2019/python/python_web_template_02.jpg)

通过 `extends` 标记来指定需要继承的基类，然后用 `block` 标记来设置子类需要替换调基类中的内容，只要 `block` 指定的名称一样就行。
另外，如不需要完全替换调基类的内容，可以在子类 `block` 中，调用 `super` 方法，以获取基类在此名称下的内容，这样就能达到更号的灵活性。

## 总结

今天介绍了 Jinja2 模板引擎的基本用法和特点，期望通过不同的特点，让你了解到模板的基本用法，以便更快的使用和进一步学习更深入的内容。另外，想通过 Jinja2 模板引擎，说明模板的基本特征，以便触类旁通、举一反三，更快的学习其他优秀的模板, 同时也想说明，模板不仅仅可以用在 Web 的开发中，还可以用在自动化编码、测试等众多领域。
最后在本章开头，留了个思考题，为什么不将**展现逻辑**和**业务逻辑**说成是**前台**和**后台**呢？如果你有答案，欢迎留言交流。

[示例代码](https://github.com/JustDoPython/python-100-day/tree/master/day-021)

参考

- [图书: Flask Web开发　https://item.jd.com/12418677.html](https://item.jd.com/12418677.html)
- [API-Jinja Documentation(2,10.x)　https://jinja.palletsprojects.com/en/2.10.x/api/#the-context](https://jinja.palletsprojects.com/en/2.10.x/api/#the-context)
- [ansible基础-Jinjia2模板——过滤器　https://www.cnblogs.com/mauricewei/p/10056379.html](https://www.cnblogs.com/mauricewei/p/10056379.html)
