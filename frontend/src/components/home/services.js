import axios from 'axios';
import store from 'store';

import settings from '../../etc/settings.json';
const url = settings.url;

const verify = async () => {
  //�ӱ��ػ����ȡtoken��ӵ�headers
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
      store.set('django_token', token);    //ˢ�±��ش洢��token
  }
  return res
}


export {
  verify
}