import axios from 'axios';

import settings from '../../etc/settings.json';
const url = settings.url;

const register = async (data) => {
  return axios(
    url+'/user/register',
    {
        method: "POST",
        data: data
    }
  )
}

const login = async (data) => {
  return axios(
    url+'/user/login',
    {
        method: "POST",
        data: data
    }
  )
}


export {
  register,
  login
}