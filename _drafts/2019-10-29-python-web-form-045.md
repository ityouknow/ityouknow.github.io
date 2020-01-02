---
layout: post
title:  第45天： Web 开发 Form
category: python
copyright: python
---

by 太阳雪

在了解了 Flask Bootstrap 基本框架之后，我们来了解一下 Flask 框架的 表单( form )，以帮助我们创建交互式的 Web 应用，最后会有个提交个人信息的例子。

<!--more-->

Flask-WTF 是 Flask 框架的一个扩展，用来做表单的交互，是对 WTForms 的集成，默认支持 CSRF 安全签名，并且继承文件上传功能。

## 安装

使用 pip 安装

```bash
pip install Flask-WTF
```

验证

```bash
>>> from flask_wtf import FlaskForm
>>>
```

## 小试牛刀

### 创建表单类

Flask-WTF 能将 WTForms 集成到 Flask 应用中，创建一个 `app.py` 主代码文件，例如：

```python
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class MyForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
```

MyForm 是自定义的类，继承自 FlaskForm，其中定义了一个字段 name，标题是 name, 且设置为非空。

### 表单模板

接下来创建一个表单模板 `submit.html`，例如:

{% raw %}
```html
<form method="POST" action="/">
    {{ form.csrf_token }}
    {{ form.name.label }} {{ form.name(size=20) }}
    <input type="submit" value="Go">
</form>
```
{% endraw %}


其中 `form.csrf_token` 是 Flask-WTF 提供的一个防止**跨站请求伪造**的隐藏字段。原理是将一个密钥根据请求特征加密，在表单提交时一起送到服务器端，作校验。

密钥串与多种定义方式，为了方便，这里将密钥串定义在应用上:

```python
app.secret_key = 'abc'
```

>注意： 上示例仅作演示说明，不能在生产系统中用这样简单的密钥

之后则是对字段 `name` 的模板定义，经过渲染会替换成 Html 控件。

### 定义视图函数

视图函数首先需要将表单渲染出来，另外要对表单的提交作验证，当然视图函数与提交验证函数也可不是同一个：

```python
@app.route('/', methods=('GET', 'POST'))
def submit():
    form = MyForm()
    if form.validate_on_submit():
        return redirect('/success')
    return render_template('submit.html', form=form)
```

提交表单一般都是 POST 方法，所以要确保视图函数支持 POST

视图函数中实例化一个 MyForm，值得注意的时，FlaskForm 示例化时会使用 request 中的 form 来初始化，所以在下面才可以直接来校验表单

validate_on_submit 方法是 is_submitted 和 validate 的联合校验，后面会详述

如果验证通过将跳转到 `/success`，如果没有通过，用 form 来渲染 `submit.html` 模板，

### 运行

在主代码  `app.py` 中加入启动方法:

```python
if __name__ == '__main__':
  app.run(debug=True)
```

然后运行，如果一起正常，访问 `localhost:5000`, 就能看输入框和提交按钮，点击提交，会跳转到 `/success` 或者提升必填。

## 表单

FlaskForm 是 WTForms Form 的子类，可以用来定一个表单，定义表单中的字段，验证方式等，作为一个 Flask 和 Html 之间的一个数据载体。

另外 FlaskForm 集成了 CSRF 校验，方便编写程序的同时，提高访问安全性。定义 Form 对象时不用明确声明 CSRF 字段，只需要在表单模板中填写  `form.csrf_token` 就行，提交表单时，视图函数会自动对 CSRF 进行校验。

FlaskForm 实例化参数中有个 formdata 参数，用来设定 Form 中字段的值，在视图函数中，可以不提供 formdata，会将 request.form 或者 request.files 中获取，作为 formdata 参数，这就是视图函数中实例化 Form 时，不带任何参数，在后面还能方法 Form 对象内容的原因。

## 字段及验证

FlaskForm 从 0.9.0 版本开始，不再从 WTForms 中导入任何东西，所以大部分字段和校验方法都直接引用自 WTForms，如：

```python
from wtforms import StringField, IntergreField, validators
```

- 常用的字段

|字段|说明|
|---|---|
|StringField|文本字段|
|IntergreField|文本字段，要求输入的时数字|
|PasswordField|文本字段，输入内容会转会为小黑点|
|DateField|文本字段，输入指定日期格式的字符串会转会为日期类型|
|RadioField|单选字段|
|SelectField|选择字段|
|SelectMultipleField|多项选择字段|
|SubmitField|表单的提交按钮|

- 常用验证

|验证|说明|
|---|---|
|DataRequired|必填字段|
|Email|电子邮箱地址验证|
|EqualTo|验证与其他指定字段值是否相等|
|Length|输入字符串长度限制|
|NumberRange|输入数值大小限制|
|URL|网站格式验证|

例如定义一个 MyForm 表单类:

```python
class MyForm(FlaskForm):
    name = StringField(label='姓名', validators=[InputRequired()])
    city = StringField('城市', validators=[validators.Length(min=4, max=25, message='输入的长度不符合要求')])
    birthday = DateField(label='生日', format="%Y-%m-%d", validators=[DataRequired('日期格式不正确')])
    gender = RadioField(label='性别', choices=[(1, 'male'), (2, 'female')])
    interest = SelectMultipleField(label='兴趣', choices=[(1, 'Football'), (2, 'Movies'), (3, 'Reading')])
```

如果字段值验证失败，会将错误信息存放在字段的 `errors` 属性中，`errors` 是个列表，元素是每一个验证出现的问题信息，通过设定验证的 `message` 参数指定。

要完整的在模板中定义字段以及错误信息，是件乏味的事情，这里通过一个自定义的模板宏来完成：

{% raw %}
```jinjia
{% macro render_field(field) %}
  <dt>{{ field.label }}:
  <dd>{{ field(**kwargs)|safe }}
  {% if field.errors %}
    <ul class=errors>
    {% for error in field.errors %}
      <li>{{ error }}</li>
    {% endfor %}
    </ul>
  {% endif %}
  </dd>
{% endmacro %}
```
{% endraw %}

## 文件上传

上传文件，是表单应用必不可少的，可以通过 FileField 字段来设置，因为需要视图函数对上传的文件进行处理，所以这里单独作说明

定义一个有上传文件字段的表单类:

```python
from flask_wtf.file import FileField

class PhotoForm(FlaskForm):
  photo = FileField('上传照片')
```

视图函数定义为:

```python
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    form = PhotoForm()
    filepath = None
    if form.validate_on_submit():
        filename = secure_filename(form.photo.data.filename)
        file = form.photo.data
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save( filepath )
    else:
        filename = None
    return render_template('photo.html', form=form, filename= filename)
```

在通过验证之后，用方法 `secure_filename` 对上传文件名作安全处理，这是很有必要的，以防止通过文件名注入, 这个方法从库 `werkzeug` 中导入，这个库会在在安装 `Flask` 时一起被安装。

之后拿到上传文件的数据，这是已经经过 Flask 转化的 File 对象，可以直接调用 save 方法存储上传的文件。

`app.config['UPLOAD_FOLDER']` 定义了文件存储的位置，如:

```python
app.config['UPLOAD_FOLDER'] = './upload'
```

最后新建一个模板文件 upload.html：

{% raw %}
```html
<form action="/upload" method="post" enctype="multipart/form-data">
    {{ form.csrf_token() }}
    {{ form.photo() }}
    <input type="submit" value="提交">
</form>
```
{% endraw %}

注意模板中 `form` 的编码类型必须设置为 `multipart/form-data`

## Bootstrap

虽然 FlaskForm 使用起来已经很方便了，但是还是有很多需要重复编写的地方，以及展示效果不够美观的问题，借助 `Bootstrap-flask` 将解决这些问题。

之前对 `Bootstrap-flask` 介绍中说国，`Bootstrap-flask` 主要是定义了很多模板宏，减少重复的编码，对于表单，同样提供了很多宏

首先在模板中导入 bootstrap 的 Form 相关宏:

{% raw %}
```jinjia
{% from 'bootstrap/form.html' import render_form, render_form_row, render_field %}
```
{% endraw %}

- `render_form` 接受一个 Form 对象，将其渲染成 Html 表单，是最省事的，例如:

{% raw %}
```jinjia
{{ render_form(form) }}
```
{% endraw %}

- `render_field` 接受一个 Field， 将其渲染成一个表单的字段：

{% raw %}
```jinjia
{{ render_field(form.name) }}
```
{% endraw %}

- `render_form_row` 接受一个 Field 列表，将列表中的字段渲染到一行

模板代码如下:

{% raw %}
```html
{% from 'bootstrap/form.html' import render_form, render_form_row, render_field %}
{{ bootstrap.load_css() }}
<h1> render_form </h1>
{{ render_form(form) }}

<h1>render_form_row</h1>
<form method="post" >
    {{ render_form_row([form.name, form.city]) }}
    {{ render_form_row([form.gender, form.birthday]) }}
    {{ render_form_row([form.interest]) }}
</form>

<h1>render_field</h1>
<form method="post" >
    {{ render_field(form.name) }}
    {{ render_field(form.gender) }}
    {{ render_field(form.interest) }}
</form>
```
{% endraw %}

先导入表单相关的宏，然后加入 Bootstrap 的样式，之后是各个宏的使用

## 总结

本节课程简单介绍了 Flask 中表单的处理方式和方法，包括 FlaskForm，WTForms和一些常用的字段，最后说明了 Bootstrap-flask 对表单的支持，以便是 Web 开发更高效。

> 示例代码：[Python-100-days-day045](https://github.com/JustDoPython/python-100-day/tree/master/day-045)

参考

- [https://flask-wtf.readthedocs.io/en/stable/](https://flask-wtf.readthedocs.io/en/stable/)
- [https://dormousehole.readthedocs.io/en/latest/patterns/wtforms.html](https://dormousehole.readthedocs.io/en/latest/patterns/wtforms.html)
- [https://www.cnblogs.com/haiyan123/p/8254228.html](https://www.cnblogs.com/haiyan123/p/8254228.html)
