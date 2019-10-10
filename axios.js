import Vue from 'vue'
import axios from "axios"
import qs from "qs"
// import NProgress from 'nprogress' // progress bar
axios.defaults.baseURL = '/';
// axios.defaults.baseURL='/';

axios.defaults.retry = 1;
axios.defaults.retryDelay = 1000;
axios.defaults.shouldRetry = (error) => true;
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
// axios.defaults.headers['api-version'] = 'v2'


let api = function (url, type, options, version) {

  /*  url       请求地址
   *   type      请求类型
   *   options   请求参数
   *   instance  请求首选项
   *   origin   请求的地址服务器
   */

  const OriginApi = process.env.NODE_ENV === 'development' ? '/api' : ''

  // const OriginApi = '/api'

  url = OriginApi + url //  http://192.168.1.185/
  // url = "http://football.com" + url //  http://192.168.1.185/

  // url = 'api' + url
  let opt = options || {};
  var version = version || "";
  let instance = axios.create({
    timeout: 5000
  });


  instance.interceptors.request.use(config => {

    // NProgress.start()

    if (this.$store.state.auth_token) {
      config.headers.AUTHTOKEN = this.$store.state.auth_token
    }
    if (version) {
        config.headers['api-version'] = version;
    }
    return config
  }, error => {
    console.log(error)
    return Promise.reject(error)
  })

  instance.interceptors.response.use(undefined, (error) => {
    console.log('interceptors error')
    console.log(error.response)
    this.$toast.clear()
    // NProgress.done()
    const config = error.config
    // 判断是否配置了重试
    if(!config || !config.retry) return Promise.reject(error);

    if(!config.shouldRetry || typeof config.shouldRetry != 'function') {
      return Promise.reject(error);
    }

    //判断是否满足重试条件
    if(!config.shouldRetry(error)) {
      return Promise.reject(error);
    }

    // 设置重置次数，默认为0
    config.__retryCount = config.__retryCount || 0;

    // 判断是否超过了重试次数
    if(config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }

    //重试次数自增
    config.__retryCount += 1;

    //延时处理
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });

    //重新发起axios请求
    return backoff.then(function() {
      return instance(config);
    });
  })
  return new Promise((resolve,reject)=>{

    if(type === 'POST' || type === 'post'){
      instance.post(url,qs.stringify(opt))

        .then(response => {
          // NProgress.done()
          //微信授权登录接口出错处理
          if(response.data.ResultCD == '00009'){
            window.location.href = window.location.origin + '/#/'
            return
          }

          if(response.data.ResultCD != 200){
            this.$toast.clear()
            this.$toast(response.data.ErrorMsg)
            return
          }
          resolve(response.data)
        })
        .catch(error => {
          // NProgress.done()
          console.log("loading failed")
        })
    }else if(type === 'GET' || type === 'get'){
      let getOpt = qs.stringify(opt);
      if(getOpt){
        getOpt = '?'+ getOpt
      }

      instance.get(url + getOpt)

        .then(response => {
          // NProgress.done()
          resolve(response)
        })
        .catch(error => {
          // NProgress.done()
          alert("loading failed")
        })
    }

  })
}


Vue.prototype.$ajax = api;
Vue.prototype.axios = axios
Vue.use(axios);
