import axios from 'axios';
import store from 'store';

import settings from '../../etc/settings.json';
const url = settings.url;

const fetchInfo = async (project) => {
    //�ӱ��ػ����ȡtoken��ӵ�headers
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
            url+'/project/get_info',
            {
                method: "POST",
                headers: headers,
                data: {
                    'project': project
                }
            }
        )
    if (res.status === 200) {
        let token = res.headers.auth;
        if (token) 
            store.set('django_token', token);    //ˢ�±��ش洢��token
    }
    return res
}

const annotate = async (id, regions) => {
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
        url+'/file/annotate',
        {
            method: "PUT",
            headers: headers,
            data: {
                'id': id,
                'regions': JSON.stringify(regions)
            }
        }
    )

    if (res.status === 200) {
        let token = res.headers.auth;
        if (token) 
            store.set('django_token', token);    //ˢ�±��ش洢��token
    }
    return res
}

const check = async (id, checked) => {
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
        url+'/file/check',
        {
            method: "PUT",
            headers: headers,
            data: {
                'id': id,
                'checked': checked
            }
        }
    )

    if (res.status === 200) {
        let token = res.headers.auth;
        if (token) 
            store.set('django_token', token);    //ˢ�±��ش洢��token
    }
    return res
}

export{
    fetchInfo,
    annotate,
    check
}