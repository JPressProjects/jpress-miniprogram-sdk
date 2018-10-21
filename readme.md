# JPress 微信小程序SDK

JPress 是一个类似 WordPress 的程序，并提供了良好的扩展和微服务与分布式的支持，因此理论支持任何并发流量。

JPress 网址： http://jpress.io 


## SDK 用法

### 初始化

SDK 需要在小程序启动的时候进行初始化，例如：

```js
App({
  onLaunch: function () {
       jpress.init({
         host:'http://jpress_web_url.com',
         app_id:'my_app_id',
         app_secret:'my_app_secret'
       })
   }
})   
```

以上的 `my_app_id` 和 `my_app_secret` 需要在后台填写（后台 -> 系统 -> 接口 ），如下图所示：

![](./doc/imgs/jpress_app_id.png)

#### 用户登录和注册

jpress.login();
jpress.getUserInfo();

#### 获取当前用户信息（自己的信息）

```js
jpress.myInfo()
.send()
.then(data=>{
    console.log(data)//用户信息
})
```

#### 获取用户信息

获取id=123的用户信息

```js
jpress.userInfo(123)
.send()
.then(data=>{
    console.log(data)//用户信息
})
```

#### 保存用户信息

```js
var userData = {
    id:123,
    nickname : "张三",
    email : "xxx@qq.com",  
}

jpress.userSave(userData)
.send()
.then(data=>{
    //保存成功
})
.catch(error=>{
    console.error(error.message)
})
```


