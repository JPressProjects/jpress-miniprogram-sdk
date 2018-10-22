# JPress 微信小程序SDK

JPress 是一个使用java开发的类似 WordPress 的程序，详情：https://gitee.com/fuhai/jpress 。 此 SDK 是为了帮助微信小程序开发者能够快速的对接 jpress，调用和操作 jpress 数据。

JPress 同时也是开发者用来开发其他互联网系统的基石，基于 JPress 开发的产品能够快速对接微信公众号和微信小程序等。

JPress 已经内置了完善的 用户管理、权限管理、文章管理、页面管理的基础功能，同时 基于 JFinal 和 Jboot 开发，天生支持微服务的分布式部署，支持任何大流量、大并发项目。同时拥有良好的扩展机制，帮助程序员节约时间和开发成本。

SDK 是基于 Apache 协议开源，因此可以通过此SDK修改扩展到你自己的其他项目里。不用担心任何版权的问题。

JPress 网址： http://jpress.io 


## SDK 用法

SDK的用法主要分为以下几个步骤：

* 初始化 SDK
* 调用 SDK 接口进行数据操作

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

### 小程序用户登录和注册

**用户登录**

```js
wx.login({
  success: res => {
    jpress.wxLogin(res.code)
  }
})
```

**用户注册**

注意：只有该微信用户是第一次进入微信小程序的时候，才会进行用户注册，当用户注册成功后，再次进入，该接口则是读取当前的用户信息进行绑定。

微信小程序布局文件：

```html
<button  open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 
获取用户信息 
</button>
```

js 处理：

```js
getUserInfo: function(e) {

    //只需要一行代码就可以把当前用户信息注册到jpress系统
    //此时，通过jpress后台就可以查看到该用户信息
    jpress.wxGetUserInfo(e.detail)
}
```

### SDK 方法列表

 

|  接口 | 描述 | 备注 |
| --- | --- | --- |
| init | 对JPress SDK 进行初始化 | 在小程序启动的时候调用  |
| createGetRequest | 构建一个Get API请求 |  |
| createPostRequest | 构建一个Post API请求 |  |
| createRequest | 构建一个API请求，默认是get请求 |  |
| wxLogin | 进行用户code初始化 |  |
| wxGetUserInfo | 进行用户注册 （如果当前用户没有注册，就会注册一个新的用户；如果用户已经注册，则初始化当前用户信息） |  |
| getOption | 获取网站配置信息 |  |
| getUser | 通过用户ID获取用户信息 |  |
| getMyInfo | 获取当前登录的用户信息（我的信息） |  |
| doUserSave | 对用户信息进行保存 |  |
| getArticle | 获取单篇文章信息 |  |
| getArticleList | 获取文章列表（固定数量，默认为10条数据） |  |
| getArticlePage | 分页加载文章列表 |  |
| getArticleCategory | 获取网站的分类信息 |  |
| doArticleSave | 文章数据更新 |  |
| getPage | 获取单个页面信息 |  |
| getPageList | 获取固定标识的页面列表 |  |



#### 获取当前用户信息（自己的信息）

```js
jpress.getMyInfo()
.then(data=>{
    console.log(data)//用户信息
})
.catch(data=>{
    console.log(data.message);//错误信息
})
```

#### 获取用户信息

获取id=123的用户信息

```js
jpress.getUser(123)
.then(data=>{
    console.log(data)//id=123的用户信息
})
.catch(data=>{
    console.log(data.message);//错误信息
})
```

#### 保存用户信息

```js
var userData = {
    id:123,
    nickname : "张三",
    email : "xxx@qq.com",  
}

jpress.doUserSave(userData)
.then(data=>{
    //保存成功
})
.catch(error=>{
    console.error(error.message)
})
```

其他方法参考SDK列表。




