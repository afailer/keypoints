import axios from 'axios'
import { Message } from "element-ui";
import { getToken, removeToken } from "./auth";

export const Method = {
  PUT: 'put',
  GET: 'get',
  DELETE: 'delete',
  POST: 'post',
  PATCH: 'patch'
};

axios.defaults.baseURL = getCurrentBaseUrl();

function getCurrentBaseUrl () {
  console.log(location)
  return location.hostname === 'localhost' ? 'http://10.18.117.14:8888/' : location.protocol + '//' + location.hostname + ':' + location.port
}

axios.interceptors.request.use((config) => {
  const token = getToken()
  if(token){
    config.headers.Authorization = 'JWT ' + token; // 设置请求头
  }
  return config
}, (err) => {
  return Promise.reject(err)
});

axios.interceptors.response.use(
  response => response,
  error => {
    if(error.response.status === 401){
      Message({
        message: '用户信息过期，正在自动重新登录...',
        type: 'error',
        duration: 1000
      });
      removeToken();
    }else{
      Message({
        message: error.message,
        type: 'error',
        duration: 1000
      });
    }
    return Promise.reject({
      code: error.response.status,
      message: error.message
    })
  }
);

export default axios
