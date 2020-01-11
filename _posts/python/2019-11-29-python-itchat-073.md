---
layout: post
title:  第73天： itchat 微信机器人简介
category: python
copyright: python
---

by 極光

今天来为大家介绍一个有意思的开源微信个人号 API，它是基于 Python 调用微信网页版实现，只需要编写少量的代码，就可以完成一个能够处理所有信息的微信机器人。那它到底能实现了什么功能，接下来为大家一一介绍。

<!--more-->

## 安装

想要使用它，首先得安装 itchat 模块：

```shell
$ pip3 install itchat
```

## 登陆

想要通过 itchat 操作微信接收、发送信息等，第一步需要先登陆微信网页版，为此 itchat 提供了 `auto_login` 方法，调用这个方法就能实现微信登陆。首先新建 `mychat1.py` 文件，代码如下：

```python
# mychat1.py
import itchat
from itchat.content import TEXT

@itchat.msg_register(TEXT)   # 注册处理文本信息
def simple_reply(msg):
    print(msg.text)

itchat.auto_login(hotReload=True)  # hotReload=True表示短时间关闭程序后可重连
itchat.run()
```

然后通过执行命令 `python mychat1.py` 运行代码，这时会生成一个名为 `QR.png` 的二维码图片文件，通过扫描这个二维码就可以登陆微信网页版了，这时将会显示如下信息：

```
Login successfully as 你的微信昵称
Start auto replying.
```

如果你向这个登陆后的微信发送文本消息，则会直接把你发送的消息内容在终端打印出来。

**关于登陆这里还有几点要说明下：**

1. itchat提供了登陆状态暂存，关闭程序后一定时间内不需要扫码即可登录。只需要在 `auto_login` 方法中传入 `hotReload=True` 即可。
2. 为了方便在无图形界面使用itchat，程序内置了命令行二维码的显示。只需要在 `auto_login` 方法中传入 `enableCmdQR=True` 即可。
3. 可以自定义登陆，比如更改提示语、二维码出现后邮件发送等。

**关于自定义登陆所需要的方法，登陆的过程按顺序为：**

- 获取二维码uuid，方法名称：`get_QRuuid`
- 获取二维码，方法名称：`get_QR`
- 判断是否已经登陆成功，方法名称：`check_login`
- 获取初始化数据，方法名称：`web_init`
- 更新微信相关信息（通讯录、手机登陆状态），方法名称：`get_friends`、`show_mobile_login`
- 循环扫描新信息（开启心跳），方法名称：`start_receiving`

以上简单介绍了下关于登陆相关的内容，如果想了解更详细信息请查看官方文档。

## 注册消息方法

itchat 将根据接收到的消息类型寻找对应的已经注册的方法，如果一个消息类型没有对应的注册方法，该消息将会被舍弃，就像我们上面代码只注册了 `TEXT` 类型的消息才会被打印出来。当然在运行过程当中也可以动态注册方法，注册方式与结果不变。

### 消息类型

itchat 支持多种类型的消息处理，具体类型和参数详见下表：

|参数|类型|Text键值|
|---|---|---|
|TEXT|文本|文本内容|
|MAP|地图|位置文本|
|CARD|名片|推荐人字典|
|NOTE|通知|通知文本|
|SHARING|分享|分享名称|
|PICTURE|图片/表情|下载方法|
|RECORDING|语音|下载方法|
|ATTACHMENT|附件|下载方法|
|VIDEO|小视频|下载方法|
|FRIENDS|好友邀请|添加好友所需参数|
|SYSTEM|系统消息|更新内容的用户或群聊的UserName组成的列表|

### 注册消息

注册消息有两种方法：

1. 不带具体对象注册，将注册为普通消息的回复方法
2. 带对象参数注册，对应消息对象将调用该方法

```python
# mychat2.py
import itchat
from itchat.content import TEXT

# 不带具体对象注册，将注册为普通消息的回复方法
@itchat.msg_register(TEXT)
def simple_reply(msg):
    return 'I received: %s' % msg['Text']

# 带对象参数注册，对应消息对象将调用该方法
@itchat.msg_register(TEXT, isFriendChat=True, isGroupChat=True, isMpChat=False)
def text_reply(msg):
    msg.user.send('%s: %s' % (msg.type, msg.text))

itchat.auto_login(hotReload=True)
itchat.run()
```

然后通过执行命令 `python mychat2.py` 运行代码，扫码登陆并向该微信号发消息，这时你会发现你向它发什么消息，它会同样回复什么消息，而控制台并没有打印消息，很明显它只调用了带参数对象注册的方法，那么为什么不调用第一个不带对象注册的方法，下面我们就说说注册消息的优先级。

### 注册消息优先级

多次注册同一类型消息时，遵循以下规则：

- 后注册消息先于先注册消息
- 带参数消息先于不带参数消息

依据这两个规则，上例代码只执行第二个带参数注册的方法就很正常了，另外 itchat 还支持动态注册消息，一种方法是生成一个守护线程动态注册消息，另一种是使用 `configured_reply` 方法，具体如何实现请参考官方文档 。

## 消息回复

itchat 提供了五种消息回复的方法：

**1. send方法**

```python
import itchat

# 可发送多种类型消息
itchat.send(msg='文本消息', toUserName=None)
itchat.send('@img@%s' % '表情图片.gif')
itchat.send('@fil@%s' % '文件.docx')
itchat.send('@vid@%s' % '测试.mp4')
```

> **参数说明：**
> - msg：消息内容。`'@fil@文件地址'`将会被识别为传送文件，`'@img@图片地址'`将会被识别为传送图片，`'@vid@视频地址'`将会被识别为小视频。
> - toUserName：发送对象，如果留空将会发送给自己。

> **返回值：**
> - 发送成功：True
> - 失败：False

**2. send_msg方法**

```py
send_msg(msg='文本消息', toUserName=None)
```

> **参数说明：**
> - msg：消息内容，仅文本
> - toUserName：发送对象，如果留空将会发送给自己

> **返回值：**
> - 发送成功：True
> - 失败：False

**3. send_file、send_img、send_video方法**

```py
send_file(fileDir, toUserName=None)
send_img(fileDir, toUserName=None)
send_video(fileDir, toUserName=None)
```

> **参数说明：**
> - fileDir：文件路径（不存在该文件时将打印无此文件的提醒）
> - toUserName：发送对象，如果留空将会发送给自己

> **返回值：**
> - 发送成功：True
> - 失败：False

通过以上几种可以看出，几种方法各有特点，可以随自己喜好使用，不过官方推荐直接使用 `send` 方法。

## 消息内容

在上面介绍注册消息时，我们知道了 itchat 支持微信回复的以下几种类型的消息，包括：微信初始化消息、文本消息、图片消息、小视频消息、地理位置消息、名片消息、 语音消息、动画表情、普通链接和应用分享、音乐链接、群消息、红包消息、系统消息。接下来我们选几种常见消息和大家简单介绍下。

### 文本消息 

文本消息是最常见的消息，基本格式如下：

```
MsgType: 1   # 消息类型 
FromUserName: 发送方ID
ToUserName: 接收方ID
Content: 消息内容
```

### 图片消息

```
MsgType: 3   # 消息类型 
FromUserName: 发送方ID
ToUserName: 接收方ID
MsgId: 用于获取图片
Content:
    <msg>
        <img length="6503" hdlength="0" />
        <commenturl></commenturl>
    </msg>
```

### 小视频消息

```
MsgType: 62   # 小视频消息
FromUserName: 发送方ID
ToUserName: 接收方ID
MsgId: 用于获取小视频
Content:
    <msg>
        <img length="6503" hdlength="0" />
        <commenturl></commenturl>
    </msg>
```

篇幅有限，先展示这几种消息结构，有个大概的认识，更多的消息结构请参考官网文档。

## 账号类型

我们平时使用微信中，经常接触的三种账号，分别为好友、公众号、群聊。 itchat 为这三种类型的账号分别提供了整体获取和根据条件搜索的方法，接下来我们分别介绍下每种类型的使用方式。

### 好友

1、好友的获取方法为 `get_friends`，将会返回完整的好友列表：

- 其中每个好友为一个字典
- 列表的第一项为本人的账号信息
- 传入 `update` 键为 `True` 将可以更新好友列表并返回

2、好友的搜索方法为 `search_friends`，目前有如下四种搜索方式：

- 仅获取自己的用户信息： `search_friends()` 
- 获取特定 `UserName` 的用户信息： `search_friends(userName='好友昵称')`
- 获取备注、微信号、昵称中的任何一项等于name键值的用户：`search_friends(name='搜索名称')`
- 获取备注、微信号、昵称分别等于相应键值的用户：`search_friends(wechatAccount='搜索名称')`
- 以上第3和4项功能可以一同使用：`itchat.search_friends(name='小白', wechatAccount='littleboy')`
  
3、更新用户信息的方法为 `update_friend`，该方法需要传入用户的 `UserName`，返回指定用户的最新信息。当然也可以传入 `UserName` 组成的列表，那么相应的也会返回指定用户的最新信息组成的列表。

### 公众号

1、公众号的获取方法为 `get_mps`，将会返回完整的公众号列表:

- 其中每个公众号为一个字典
- 传入 `update` 键为 `True` 将可以更新公众号列表并返回

2、公众号的搜索方法为 `search_mps`，有两种搜索方法:

- 获取特定 `UserName` 的公众号：`search_mps(userName='公众号名')`
- 获取名字中含有特定字符的公众号，返回值为一个字典的列表：`search_mps(name='littleboy')`

### 群聊

1、群聊的获取方法为 `get_chatrooms`，将会返回完整的群聊列表：

- 其中每个群聊为一个字典
- 传入 `update` 键为 `True` 将可以更新群聊列表并返回通讯录中保存的群聊列表
- 群聊列表为后台自动更新，如果中途意外退出存在极小的概率产生本地群聊消息与后台不同步
- 为了保证群聊信息在热启动中可以被正确的加载，即使不需要持续在线的程序也需要运行 `itchat.run()`
- 如果不想要运行上述命令，请在退出程序前调用 `itchat.dump_login_status()`，更新热拔插需要的信息

2、群聊的搜索方法为 `search_chatrooms`，有两种搜索方法，分别是通过传参 `userName` 和 `name` 进行搜索，方式同公众号搜索相似。

3、群聊用户列表的获取方法为 `update_chatroom`，同时需要关注以下几点：

- 如果想要更新该群聊的其他信息也可以用该方法
- 群聊在首次获取中不会获取群聊的用户列表，所以需要调用该命令才能获取群聊的成员
- 该方法需要传入群聊的 `UserName`，返回特定群聊的详细信息
- 同样也可以传入 `UserName` 组成的列表，那么相应的也会返回指定用户的最新信息组成的列表

4、创建、增加、删除群聊用户的方法如下所示：

```py
memberList = itchat.get_friends()[1:]
# 创建群聊，topic键值为群聊名
chatroomName = itchat.create_chatroom(memberList, '测试群聊')
# 删除群聊内的群友
itchat.delete_member_from_chatroom(chatroomName, memberList[0])
# 增加好友进入群聊
itchat.add_member_into_chatroom(chatroomName, memberList[0], useInvitation=False)
```

不过还需要注意以下几点：

- 由于之前通过群聊检测是否被好友拉黑的程序，目前这三个方法都被严格限制了使用频率
- 删除群聊需要本账号为群管理员，否则会失败
- 将用户加入群聊有直接加入与发送邀请，通过 `useInvitation` 设置
- 超过40人的群聊无法使用直接加入的加入方式，特别注意

## 总结

本文为大家简单介绍了 itchat 所提供的大部分功能，通过这些功能我们完全可以非常方便的开发出一个微信聊天机器人。还有目前微信对新账号有限制，即不能登陆微信网页版，所以这种账号也不能通过 itchat 登陆。另外 GitHub 上也有很多基于 itchat 做的开源机器人项目，有兴趣可以去搜索，再次感谢各位开源作者的贡献。

参考

- [itchat 文档：https://itchat.readthedocs.io/zh/latest/](https://itchat.readthedocs.io/zh/latest/)

[示例代码：https://github.com/JustDoPython/python-100-day](https://github.com/JustDoPython/python-100-day)

