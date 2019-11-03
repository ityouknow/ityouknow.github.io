---
layout: post
title:  第47天： Web 开发 RESTful
category: python
copyright: python
---

by 太阳雪

现在单页 Web 项目很流行，使用各种 Js 框架，通过 Ajax 和服务器的 Api 进行交互，实现类似原生 app 效果，很酷，对 Flask 来说小菜一碟，是时候了解下 Flask-RESTful 了

<!--more-->

开始前先了解下 RESTful，阮一峰老师有这样的解释:

>网络应用程序，分为前端和后端两个部分。当前的发展趋势，就是前端设备层出不穷（手机、平板、桌面电脑、其他专用设备......）。
>因此，必须有一种统一的机制，方便不同的前端设备与后端进行通信。这导致API构架的流行，甚至出现"API First"的设计思想。RESTful API是目前比较成熟的一套互联网应用程序的API设计理论

也就是说 RESTful 一个框架和互联网应用的设计原则，遵循这个设计原则，可以让应用脱离前台展现的束缚，支持不同的前端设备。

## 安装

Flask 的 RESTful 模块是 flask-restful ，使用 pip 安装:

```bash
pip install flask-restful
```

如果安装顺利，可以在 Python Shell 环境下导入

```python
>>> from flask_restful import Api
>>>
```

## 小试牛刀

安装好后，简单试试。
flask-restful 像之前的 bootstrop-flask 以及 flask-sqlalchamy 模块一样，使用前需要对 Flask 应用进行初始化，然后会得到当前应用的 api 对象，用 api 对象进行资源绑定和路由设置：

```python
from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)

api = Api(app)  # 初始化得到 api 对象
```

上面代码中从 flask_restful 中引入的 Resource 类是用来定义资源的，具体资源必须是 Resource 的子类，下面定义一个 HelloRESTful 资源:

```python
class HelloRESTful(Resource):
    def get(self):
        return {'greet': 'Hello Flask RESTful!'}
```

接着，给资源绑定 URI：

```python
api.add_resource(HelloRESTful, '/')

if __name__ == '__main__':   # 别忘了启动应用的代码
    app.run(debug=True)
```

在终端或者命令行下运行 `python app.py` 启动应用

访问 `localhost:5000` 或者 `127.0.0.1:5000` 查看效果，将会看到 JSON 格式的数据输出:

```json
{
  "greet": "Hello Flask RESTful!"
}
```

也可以用 curl 工具在终端或者命令行下发送请求:

```bash
 curl http://localhost:5000 -s
{
    "greet": "Hello Flask RESTful!"
}
```

> curl 的参数 -s 是开启安静模式的意思

## 资源

从上面代码中可以看到，资源是 Resource 类的子类，以请求方法( GET、POST 等)名称的**小写形式**定义的方法，能对对应方法的请求作出相应，例如上面资源类中定义的 `get` 方法可以对 `GET` 请求作出相应，还可以定义 `put`、`post`、`delete` 等，称之为视图方法。

例如创建一个 todo 字样，支持获取代办事项和新增代办事项：

```python
# 初始化待办列表
todos = {
  'todo_1': "读《程序员的自我修养》",
  'todo_2': "买点吃的",
  'todo_3': "去看星星"
}
class Todo(Resource):
    # 根据 todo_id 获取代办事项
    def get(self, todo_id):
        return { todo_id: todos[todo_id] }

    # 新增一个待办事项
    def put(self, todo_id):
        todos[todo_id] = request.form['data']
        return {todo_id: todos[todo_id]}
```

- 通过 GET 方式，提供 todo_id, 从 todos 列表中获取待办事项内容
- 通过 PUT 方式，提供 todo_id, 从请求体中获取到内容，作为待办事项内容
- 两种方法都返回 todo_id 所对应的待办事项内容

为 Todo 资源指定 URI:

```python
api.add_resource(Todo, '/todo/<string:todo_id>/')
```

启动项目，用 curl 工具测试:

```bash
# 读取 key 为 todo_1 的待办事项
 curl http://localhost:5000/todo/todo_1/
{
    "todo_1": "\u8bfb\u300a\u7a0b\u5e8f\u5458\u7684\u81ea\u6211\u4fee\u517b\u300b"
}

# 创建一个 key 为 todo_4 的代办事项
 curl http://localhost:5000/todo/todo_4/ -d "data=学习 Flask" -X PUT
{
    "todo_4": "\u5b66\u4e60 Flask"
}


# 读取刚添加的待办事项 todo_4
 curl http://localhost:5000/todo/todo_4/
{
    "todo_4": "\u5b66\u4e60 Flask"
}
```

Flask-RESTful 支持多种视图方法的返回值:

```python
class Todo1(Resource):
    def get(self):
        # 直接返回
        return { 'task': 'Hello world'}

class Todo2(Resource):
    def get(self):
        # 返回内容及状态码
        return {'task': 'Hello world'}, 201

class Todo3(Resource):
    def get(self):
        # 返回内容，状态码以及 Header
        return {'task': 'Hello world'}, 200, {'Etag': 'some-opaque-string'}
```

为三个资源指定 URI：

```python
api.add_resource(Todo1, '/todo_1/')
api.add_resource(Todo1, '/todo_2/')
api.add_resource(Todo1, '/todo_3/')
```

启动项目后，用 curl 工具来测试:

```bash
 curl http://localhost:5000/todo_1/
{
    "task": "Hello world"
}

# -请求 todo_2 并显示出 HTTP 标头，HTTP 状态码为 201
 curl http://localhost:5000/todo_2/ -i
HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 30
Server: Werkzeug/0.16.0 Python/3.7.5rc1
Date: Thu, 31 Oct 2019 14:12:54 GMT

{
    "task": "Hello world"
}

# -请求 todo_3 并显示出 HTTP 标头，HTTP 状态码为 200 ，标头中还有 Etag
 curl http://localhost:5000/todo_3/ -i
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 30
Etag: some-opaque-string
Server: Werkzeug/0.16.0 Python/3.7.5rc1
Date: Thu, 31 Oct 2019 14:14:57 GMT

{
    "task": "Hello world"
}

```

## 路由

从上面可以看到，通过 api.add_resource 方法来为资源设置路由

第一个参数是资源类，第二个参数是路由，和之前介绍的 `@app.route` 注解参数一样

可以为一个资源制定多个理由，例如:

```python
api.add_resource(Todo, '/todo/', '/mytodo/')
```

`http://localhost:5000/todo/` 和 `http://localhost:5000/mytodo/` 都将指向 Todo

既然路由，就应该有 `endpoint`，通过命名参数 `endpoint` 指定:

```python
api.add_resource(Todo, '/todo/', endpoint='todo_ep')
```

设置路由的 `endpoint` 为 `todo_ep`，如果不指定，`endpoint` 就是资源类名的小写形式

`endpoint` 是 Flask 中对具体路由的内部的具体定义，一般作为 `url_for` 方法的第一个参数，即通过 `endpoint` 获得该路由的 URL，在列出 RESTful 资源 URL 时非常有用。

## 请求解析

RESTful 服务器对请求数据有很强的依赖，就请求数据的获取及校验是很繁琐的事情，还好 Flask-RESTful 提供了非常好的请求解析工具 `reqparse`，不仅可以获取请求数据，还可以对数据进行校验并返回合适的错误消息。

```python
from flask_restful import reqparse  # 引入 reqparse 模块
# ...

parser = reqparse.RequestParser()  # 定义全局的解析实体
# 定义参数 id，类型必须是整数
parser.add_argument('id', type=int, help='必须提供参数 id')
# 定义参数 name，且为必填
parser.add_argument('name', required=True)
# ...

class Reqparser(Resource):
    def get(self):
        args = parser.parse_args()  # 获取解析器中定义的参数 并校验
        return args

api.add_resource(Reqparser, '/reqparser/')  # 指定路由
```

看下效果:

```bash
# 提供一个非整数参数 id
 curl http://localhost:5000/reqparser/ -d "id=noint" -X GET
{
    "message": {
        "id": "\u53c2\u6570 id \u5fc5\u987b\u662f\u6574\u6570"
    }
}

# 不提供参数 name
curl http://localhost:5000/reqparser/
{
    "message": {
        "name": "Missing required parameter in the JSON body or the post body or the query string"
    }
}
```

- 当参数校验失败，自动返回 400 状态码，以及错误信息，通过命名参数 help 设置错误信息，不提供会有默认信息，如比选参数 name 的错误信息。
- 默认情况下有多个参数错误，会以定义参数的顺序，逐个显示错误，定义解析器时将 bundle_errors 设置为 True，则可显示多个错误，如 `parser = reqparse.RequestParser(bundle_errors=True)`，或者设置应用配置，如 `app.config['BUNDLE_ERRORS'] = True`
- 默认情况下参数都是从请求表单中获取，定义参数时命名参数 location 可以指定从 form、headers、args（即 querystring）还是从 cookies 等中获取，如 `parser.add_argument('id', type=int, help='必须提供参数 id', location='args')`

请求解析器支持继承，可以定义最高级别的解析器，逐渐细化，最后应用的具体资源上：

```python
from flask_restful import reqparse

parser = reqparse.RequestParser()
parser.add_argument('foo', type=int)

parser_copy = parser.copy()  # 继承
parser_copy.add_argument('bar', type=int)  # parser_copy 将有两个参数

# 改变继承来的参数 foo 必填且的获取位置为 querystring
parser_copy.replace_argument('foo', required=True, location='args')

# 删除继承来的参数 foo
parser_copy.remove_argument('foo')
```

## 格式化输出

请求解析处理用收到的信息，对于输入的信息也可以处理，通过 Flask-RESTful 提供的类 fields 和注解 marshal_with 来实现：

```python
from flask_restful import Resource, fields, marshal_with

resource_fields = {
    'name': fields.String,
    'address': fields.String,
    'date_updated': fields.DateTime(dt_format='rfc822'),
}

class TodoFormat(Resource):
    @marshal_with(resource_fields, envelope='resource')
    def get(self):
        return db_get_todo()  # 某个获得待办事项的方法
```

- 定义一个字段格式化模板，属性用 fields 的类型方法定义
- 在响应方法上加上 `marshal_with` 注解，指定格式化模板，和封装属性名

格式化模板属性名，需要在响应函数返回的对象属性中匹配，如果需要会要对字段重命名，可以这样:

```python
fields = {
    # name 将被重命名为 private_name
    'name': fields.String(attribute='private_name'),
    'address': fields.String
}
```

返回值中没有可以定义默认值:

```python
fields = {
    # 为 name 设置默认值
    'name': fields.String(default='Anonymous User'),
    'address': fields.String
}
```

## 总结

本节课程简单介绍了 Flask 如何玩 RESTful，通过对 RESTful 的说明，讲解了 Flask-RESTful 模块的用法，并简单讲解了资源、路由，以及请求解析和格式化输出等技术

> 示例代码：[Python-100-days-day047](https://github.com/JustDoPython/python-100-day/tree/master/day-047)

参考

- [http://www.ruanyifeng.com/blog/2014/05/restful_api.html](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)
- [http://www.ruanyifeng.com/blog/2011/09/restful.html](http://www.ruanyifeng.com/blog/2011/09/restful.html)
- [https://flask-restful.readthedocs.io/en/latest/](https://flask-restful.readthedocs.io/en/latest/)
- [http://www.ruanyifeng.com/blog/2019/09/curl-reference.html](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)
