---
layout: post
title: Spring Boot(十二)：Spring Boot 如何测试打包部署
category: springboot 
tags: [springboot]
copyright: java
---

有很多网友会时不时的问我， Spring Boot 项目如何测试，如何部署，在生产中有什么好的部署方案吗？这篇文章就来介绍一下 Spring Boot  如何开发、调试、打包到最后的投产上线。


## 开发阶段

### 单元测试

在开发阶段的时候最重要的是单元测试了， Spring Boot 对单元测试的支持已经很完善了。

1、在 pom 包中添加 `spring-boot-starter-test` 包引用

``` xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-test</artifactId>
	<scope>test</scope>
</dependency>
```

2、开发测试类

以最简单的 helloworld 为例，在测试类的类头部需要添加：`@RunWith(SpringRunner.class)`和`@SpringBootTest`注解，在测试方法的顶端添加`@Test`即可，最后在方法上点击右键run就可以运行。

``` java
@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTests {

	@Test
	public void hello() {
		System.out.println("hello world");
	}

}
```

实际使用中，可以按照项目的正常使用去注入数据层代码或者是 Service 层代码进行测试验证，`spring-boot-starter-test` 提供很多基础用法，更难得的是增加了对 Controller 层测试的支持。

```
//简单验证结果集是否正确
Assert.assertEquals(3, userMapper.getAll().size());

//验证结果集，提示
Assert.assertTrue("错误，正确的返回值为200", status == 200); 
Assert.assertFalse("错误，正确的返回值为200", status != 200);  

```
		
引入了`MockMvc`支持了对 Controller 层的测试，简单示例如下：

``` java
public class HelloControlerTests {

    private MockMvc mvc;

    //初始化执行
    @Before
    public void setUp() throws Exception {
        mvc = MockMvcBuilders.standaloneSetup(new HelloController()).build();
    }

    //验证controller是否正常响应并打印返回结果
    @Test
    public void getHello() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/hello").accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }
    
    //验证controller是否正常响应并判断返回结果是否正确
    @Test
    public void testHello() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/hello").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string(equalTo("Hello World")));
    }

}
```

单元测试是验证你代码第一道屏障，要养成每写一部分代码就进行单元测试的习惯，不要等到全部集成后再进行测试，集成后因为更关注整体运行效果，很容易遗漏掉代码底层的bug.



### 集成测试

整体开发完成之后进入集成测试， Spring Boot 项目的启动入口在 Application 类中，直接运行 run 方法就可以启动项目，但是在调试的过程中我们肯定需要不断的去调试代码，如果每修改一次代码就需要手动重启一次服务就很麻烦， Spring Boot 非常贴心的给出了热部署的支持，很方便在 Web 项目中调试使用。

pom 需要添加以下的配置：  

``` xml
 <dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <fork>true</fork>
            </configuration>
        </plugin>
</plugins>
</build>
```

添加以上配置后，项目就支持了热部署，非常方便集成测试。


## 投产上线

其实我觉得这个阶段，应该还是比较简单一般分为两种；一种是打包成 jar 包直接执行，另一种是打包成 war 包放到 tomcat 服务器下。

###  打成 jar 包

如果你使用的是 maven 来管理项目，执行以下命令既可以

``` shell
cd 项目跟目录（和pom.xml同级）
mvn clean package
## 或者执行下面的命令
## 排除测试代码后进行打包
mvn clean package  -Dmaven.test.skip=true
```

打包完成后 jar 包会生成到 target 目录下，命名一般是 项目名+版本号.jar

启动 jar 包命令

``` shell
java -jar  target/spring-boot-scheduler-1.0.0.jar
```

这种方式，只要控制台关闭，服务就不能访问了。下面我们使用在后台运行的方式来启动:

``` shell
nohup java -jar target/spring-boot-scheduler-1.0.0.jar &
```

也可以在启动的时候选择读取不同的配置文件

``` shell
java -jar app.jar --spring.profiles.active=dev
```

也可以在启动的时候设置 jvm 参数

``` shell
java -Xms10m -Xmx80m -jar app.jar &
```

**gradle**  
如果使用的是 gradle，使用下面命令打包

``` shell
gradle build
java -jar build/libs/mymodule-0.0.1-SNAPSHOT.jar
```

### 打成 war 包

打成 war 包一般可以分两种方式来实现，第一种可以通过 eclipse 这种开发工具来导出 war 包，另外一种是使用命令来完成，这里主要介绍后一种


1、maven 项目，修改 pom 包

将 

``` xml
<packaging>jar</packaging>  
```

改为

``` xml
<packaging>war</packaging>
```  

2、打包时排除tomcat.

``` xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-tomcat</artifactId>
	<scope>provided</scope>
</dependency>
```

在这里将 scope 属性设置为 provided，这样在最终形成的 WAR 中不会包含这个  JAR 包，因为 Tomcat 或 Jetty 等服务器在运行时将会提供相关的 API 类。


3、注册启动类

创建 ServletInitializer.java，继承 SpringBootServletInitializer ，覆盖 configure()，把启动类 Application 注册进去。外部 Web 应用服务器构建 Web Application Context 的时候，会把启动类添加进去。

``` java
public class ServletInitializer extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }
}
```

最后执行

``` shell
mvn clean package  -Dmaven.test.skip=true
```

会在 target 目录下生成：项目名+版本号.war文件，拷贝到 tomcat 服务器中启动即可。

**gradle**

如果使用的是 Gradle,基本步奏一样，build.gradle中 添加 war 的支持，排除 spring-boot-starter-tomcat：

``` shell
...

apply plugin: 'war'

...

dependencies {
    compile("org.springframework.boot:spring-boot-starter-web:1.4.2.RELEASE"){
    	exclude mymodule:"spring-boot-starter-tomcat"
    }
}
...
```

再使用构建命令

``` shell
gradle build
```

war 会生成在 build\libs 目录下。


## 生产运维

###  查看 JVM 参数的值 

可以根据 Java 自带的 jinfo 命令：

``` shell
jinfo -flags pid
```

来查看 jar 启动后使用的是什么 gc、新生代、老年代分批的内存都是多少，示例如下：

``` shell
-XX:CICompilerCount=3 -XX:InitialHeapSize=234881024 -XX:MaxHeapSize=3743416320 -XX:MaxNewSize=1247805440 -XX:MinHeapDeltaBytes=524288 -XX:NewSize=78118912 -XX:OldSize=156762112 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseParallelGC
```

- `-XX:CICompilerCount ` ：最大的并行编译数
- `-XX:InitialHeapSize` 和 `-XX:MaxHeapSize` ：指定 JVM 的初始和最大堆内存大小  
- `-XX:MaxNewSize` ： JVM 堆区域新生代内存的最大可分配大小
- ...   
- `-XX:+UseParallelGC` ：垃圾回收使用 Parallel 收集器


### 如何重启

**简单粗暴**

直接 kill 掉进程再次启动 jar 包

``` shell
ps -ef|grep java 
##拿到对于Java程序的pid
kill -9 pid
## 再次重启
Java -jar  xxxx.jar
```

当然这种方式比较传统和暴力，所以建议大家使用下面的方式来管理


**脚本执行**
    
如果使用的是maven,需要包含以下的配置

``` xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <executable>true</executable>
    </configuration>
</plugin>
```

如果使用是 gradle，需要包含下面配置

``` shell
springBoot {
    executable = true
}
```

启动方式：

1、 可以直接`./yourapp.jar` 来启动

2、注册为服务

也可以做一个软链接指向你的jar包并加入到`init.d`中，然后用命令来启动。

init.d 例子:

``` shell
ln -s /var/yourapp/yourapp.jar /etc/init.d/yourapp
chmod +x /etc/init.d/yourapp
```

这样就可以使用`stop`或者是`restart`命令去管理你的应用。

``` shell
/etc/init.d/yourapp start|stop|restart
```

或者

``` shell
service yourapp start|stop|restart
```

到此 Spring Boot 项目如何测试、联调和打包投产均已经介绍完，以后可以找时间研究一下 Spring Boot 的自动化运维，以及 Spring Boot  和 Docker 相结合的使用。

> 文章内容已经升级到 Spring Boot 2.x 

**[示例代码-github](https://github.com/ityouknow/spring-boot-examples/tree/master/spring-boot-package)**

**[示例代码-码云](https://gitee.com/ityouknow/spring-boot-examples/tree/master/spring-boot-package)**

**参考:**
[Installing Spring Boot applications](http://docs.spring.io/spring-boot/docs/current/reference/html/deployment-install.html)

