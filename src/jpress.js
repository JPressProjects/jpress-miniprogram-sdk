import md5 from './md5.js';

const apis = {
  code2session: "/api/wechat/mp/code2session",
  decryptUserInfo: "/api/wechat/mp/decryptUserInfo",

  //user apis
  userInfo:"/api/user",
  myInfo:"/api/user/me",
  userSave:"/api/user/save",

  //article apis
  articleInfo: "/api/article",
  articleList:"/api/article/list",
  articlePagination:"/api/article/paginate",
  articleCategoryInfo: "/api/article/category",
  articleSave: "/api/article/save",

  //page apis
  pageInfo: "/api/page",
  pageList: "/api/page/list",

  //option apis
  optionInfo:"/api/option",
}

const config = {
  host : "",
  app_id:"",
  app_secret:"",
  sessionId:"",
  jwt:""
}

const init = conf =>{
  config.host = conf.host;
  config.app_id = conf.app_id;
  config.app_secret = conf.app_secret;
}


const getUrl = (api,paras) => {

  paras = Object.assign({
    appId:config.app_id
  }, paras);

  //对数据进行签名
  var signString = sign(paras);

  //添加签名结果
  paras = Object.assign({
    sign: signString
  }, paras);

  //拼接URL地址
  var url = config.host+api+"?"
  var arr = Object.keys(paras);
  for (var i in arr) {
    url = url + (arr[i] + "=" + paras[arr[i]])+"&";
  }

  //remove last '&'
  return url.substring(0, url.length - 1); 
}

const createGetRequest = req =>{
  //default is get
  return createRequest(req);
}

const createPostRequest = req => {
  return createRequest(Object.assign({ method: 'POST' }, req));
}

const createRequest = (req = {
  api,
  paras,
  method,
  header,
  data,
  }) =>{

  var url = getUrl(req.api, req.paras);

  var realRequest = {
    url : url,
    method : (req.method == null ? 'GET' : method),
    header : Object.assign({"jwt" : config.jwt},req.header),
    data:req.data,
  }

  const p = new Promise((resolve, reject) => {
    wx.request(Object.assign({
      success: function (res) { 
        //jpress 请求成功
        if (res.data.state == "ok") {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      error: function (e) {
        reject({
          code : 99,
          message: '网络出错'
        });
      }
    },realRequest))
  });

  return {
    send : () => p
  }
}

/**
 * 对 obj 进行签名，返回签名内容
 * 要保证和JPress签名算法一致
 */
const sign = obj => {
  if (obj == null) { 
    return null;
   }

  var secret = config.app_secret;

  //生成key升序数组，与JPress后台保存一致
  var arr = Object.keys(obj);
  arr.sort();

  var str = '';
  for (var i in arr) {
    str += arr[i] + obj[arr[i]];
  }

  return md5(str + secret);
}


const code2session = code => {

  createRequest({
    api:apis.code2session,
    paras:{code : code}
  })
  .send()
  .then(data => {
      config.sessionId = data.sessionId;
    })
  .catch(data =>{
     console.error("error -----> " + data.message);
  })

}

const decryptUserInfo = (data = {
  rawData, signature, encryptedData, iv
}) => {

  createPostRequest({
    api:apis.decryptUserInfo,
    data: Object.assign({ sessionId: config.sessionId }, data)
  })
  .send()
  .then(data => {
    config.jwt = data.token;
  })
  .catch(data => {
    console.error("error:" + data.message);
  })
}



///////////////////////option api start/////////////////////////////////

/**
 * 获取网站配置信息
 */
const optionInfo = key => {
  return createGetRequest({
    api: apis.optionInfo,
    paras: { key: key }
  })
}

///////////////////////option api end/////////////////////////////////

///////////////////////user api start/////////////////////////////////

/**
 * 获取用户信息
 */
const userInfo = id =>{
  return createGetRequest({
    api : apis.userInfo,
    paras : {id : id}
  })
}

/**
 * 获取登录用户信息（我的信息）
 */
const myInfo = () => {
  return createGetRequest({
    api: apis.myInfo
  })
}

/**
 * 用户信息保存
 */
const userSave = userData => {
  return createPostRequest({
    api: apis.userSave,
    data: userData,
  })
}


///////////////////////user api end/////////////////////////////////


///////////////////////article api start/////////////////////////////////

/**
 * 获取文章信息
 */
const articleInfo = id => {
  return createGetRequest({
    api: apis.articleInfo,
    paras: { id: id }
  })
}

/**
 * 获取文章列表
 */
const articleList = (paras = {
  flag,
  hasThumbnail,
  orderBy,
  count
}) => {
  return createGetRequest({
    api: apis.articleList,
    paras: paras
  })
}

/**
 * 分页获取文章内容
 */
const articlePagination = (paras = {
  categoryId
}) => {
  return createGetRequest({
    api: apis.articlePagination,
    paras: paras
  })
}

/**
 * 获取文章分类信息
 */
const articleCategoryInfo = (paras = {
  id,
  slug,
  type,
}) => {
  return createGetRequest({
    api: apis.articleCategoryInfo,
    paras: paras
  })
}

/**
 * 用户信息保存
 */
const articleSave = articleData => {
  return createPostRequest({
    api: apis.articleSave,
    data: articleData,
  })
}

///////////////////////article api end/////////////////////////////////


///////////////////////page api start/////////////////////////////////

/**
 * 获取页面信息
 */
const pageInfo = id => {
  return createGetRequest({
    api: apis.pageInfo,
    paras: { id: id }
  })
}

/**
 * 获取页面列表
 */
const pageList = flag => {
  return createGetRequest({
    api: apis.pageList,
    paras: { flag: flag }
  })
}

///////////////////////page api end/////////////////////////////////



module.exports = {
  init: init, //初始化
  createGetRequest: createGetRequest, //构建一个Get API请求
  createPostRequest: createPostRequest, //构建一个Post API请求
  createRequest: createRequest, //构建一个API请求，默认是get请求
  wxLogin: code2session, //进行用户code初始化
  wxGetUserInfo: decryptUserInfo, //进行用户注册 或 初始化当前用户信息

  // 配置相关 //
  optionInfo: optionInfo,

  // 用户相关 //
  userInfo: userInfo,
  myInfo: myInfo,
  userSave: userSave,

  // 文章相关 //
  articleInfo: articleInfo,
  articleList: articleList,
  articlePagination: articlePagination,
  articleCategoryInfo: articleCategoryInfo,
  articleSave: articleSave,

  // 页面相关 //
  pageInfo: pageInfo,
  pageList: pageList,
}
