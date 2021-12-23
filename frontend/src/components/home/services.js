import axios from 'axios';
import store from 'store';

import settings from '../../etc/settings.json';
const url = settings.url;

const verify = async () => {
  //从本地缓存获取token添加到headers
  let token = store.get('django_token')
  let headers = {
    auth: token
  }

  let res =   axios(
        url+'/user/verify',
        {
            method: "GET",
            headers: headers
        }
    )
  if (res.status === 200) {
    let token = res.headers.auth;
    if (token) 
      store.set('django_token', token);    //刷新本地存储的token
  }
  return res
}


export {
  verify
}