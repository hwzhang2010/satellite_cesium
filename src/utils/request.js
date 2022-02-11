/*
 * @Author: wangchaoxu
 * @Date: 2020-05-13 15:34:59
 * @LastEditors: wangchaoxu
 * @LastEditTime: 2020-07-16 19:07:36
 * @Description:
 */
import axios from 'axios';
import Qs from 'qs';
import { Loading, Message } from 'element-ui'; // 这里我是使用elementUI的组件来给提示
// import router from '@/router';
// let loadingInstance = null; // 加载全局的loading
//创建axios实例，在这里可以设置请求的默认配置
const instance = axios.create({
  timeout: 10000, // 设置超时时间10s
  baseURL: process.env.NODE_ENV === 'prod' ? '' : 'http://101.6.94.135:8902'
  //baseURL: process.env.NODE_ENV === 'prod' ? '' : 'http://localhost:8902' //根据自己配置的反向代理去设置不同环境的baeUrl
});
// 文档中的统一设置get请求头。下面会说到post请求的几种'Content-Type'
instance.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.put['Content-Type'] = 'application/json';
instance.defaults.headers.delete['Content-Type'] = 'application/json';

let httpCode = {
  //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  405: '请求方法错误',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  503: '服务器不可用',
  504: '网关超时'
};

/** 添加请求拦截器 **/
instance.interceptors.request.use(
  config => {
	// 发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
	// 数据转化,也可以使用qs转换
	config.data = JSON.stringify(config.data); 
	
    // config.headers['token'] = sessionStorage.getItem('token') || '123456';
    // loadingInstance = Loading.service({
    //   // 发起请求时加载全局loading，请求失败或有响应时会关闭
    //   spinner: 'fa fa-spinner fa-spin fa-3x fa-fw',
    //   text: '拼命加载中...',
    //   background: 'rgba(0,0,0,.8)',
    //   customClass: 'ajaxLoading'
    // });
    
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

/** 添加响应拦截器  **/
instance.interceptors.response.use(
  response => {
    return Promise.resolve(response.data);
  },
  error => {
    // loadingInstance.close(); //关闭loading
    if (error && error.response) {
      // 根据请求失败的http状态码去给用户相应的提示
      let tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message;
      Message({
        message: tips,
        type: 'error'
      });
      // if (error.response.status === 401) {
      //   // token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
      //   router.push({
      //     path: '/login'
      //   });
      // }
      return Promise.reject(error);
    } else {
      Message({
        message: '请求超时, 请刷新重试',
        type: 'error'
      });
      return Promise.reject(new Error('请求超时, 连接服务器失败'));
    }
  }
);

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url,
      params,
      ...config
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      ...config
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/* 统一封装put请求  */
export const put = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'put',
      url,
      data,
      ...config
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/* 统一封装delete请求  */
// delete由于是关键字不能作为方法名
export const del = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'delete',
      url,
      data,
      ...config
    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};