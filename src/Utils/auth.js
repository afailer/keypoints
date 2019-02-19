import request from './request';
import { Method } from "./request";
const TOKEN = 'token';

export function autoLogin() {

}

export function removeToken() {
  localStorage.setItem(TOKEN, '');
  window.location.href = '/#/login';
}

export function getToken() {
  const token = String(localStorage.getItem(TOKEN));
  if(token === 'null' || token === 'undefined'){
    return false
  }else{
    return token
  }
}

export function login(username, password) {
  return request({
    method: Method.POST,
    url: '/api/v1/account/login/',
    data: {
      username: username,
      password: password
    }
  })
}
export function logout() {
  return request({
    method: Method.POST,
    url: '/api/v1/account/logout/'
  })
}
export function getUserInfo() {

}
