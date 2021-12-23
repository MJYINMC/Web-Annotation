import axios from 'axios';
import store from 'store';

import settings from '../../etc/settings.json';
const url = settings.url;

const get_projects = async () => {
    //�ӱ��ػ����ȡtoken��ӵ�headers
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
            url+'/project/all_projects',
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

const join = async (name) => {
    //�ӱ��ػ����ȡtoken��ӵ�headers
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
            url+'/project/join',
            {
                method: "POST",
                data: {
                    'project' : name
                },
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

const quit = async (name) => {
    //�ӱ��ػ����ȡtoken��ӵ�headers
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
            url+'/project/quit',
            {
                method: "POST",
                data: {
                    'project' : name
                },
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


const remove = async (UUID) => {
    //�ӱ��ػ����ȡtoken��ӵ�headers
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
            url+'/project/delete',
            {
                method: "DELETE",
                params: {
                    UUID : UUID
                },
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
    get_projects,
    join,
    quit,
    remove
}