import React from "react";

import 'antd/dist/antd.css';
import '@ant-design/pro-form/dist/form.css';
import '@ant-design/pro-table/dist/table.css';
import '@ant-design/pro-layout/dist/layout.css';
import { LoginForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-form';
import {
  UserOutlined,
  LockOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';

import { message, Tabs, Space } from 'antd';
import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react';
import { useRequest } from 'ahooks';

import md5 from "js-md5";
import store from 'store';

import './style.less';

import Footer from "../Footer";
import { login } from "./services";

function Login(){
    const Navigate = useNavigate()
    const onLogin = async () => {
      if(store.get("django_token") !== undefined & store.get("django_autologin") === true)
        Navigate('/home')
    }

    useRequest(onLogin);

    const onFinish = async (values) => {
      values.password = md5(values.password);
      let result = await login(values);
      if(result.status === 200 & result.data.success){
        let token = result.headers.auth;
        if(token) 
            store.set('django_token', token); 
            store.set('django_autologin', values.autoLogin); 
        Navigate('/home')
      }else{
          message.error(result.data.msg, 5);
      }
  };

  const [loginType, setLoginType] = useState('account');
  return (
    <div className="container">
      <div className="content">
        <LoginForm
          logo = {<img alt="logo" src="/logo.svg"  />}
          title="Web Annotation"
          subTitle="2021 BS Project"
          actions={
            <Space>
              其他登录方式
              <AlipayCircleOutlined className="icon"/>
              <TaobaoCircleOutlined className="icon"/>
              <WeiboCircleOutlined className="icon"/>
            </Space>
          }
          onFinish = {onFinish}
          initialValues	= {{
            autoLogin : true
          }}
        >
          <Tabs activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey)}>
            <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
            <Tabs.TabPane key={'email'} tab={'邮箱登录'} />
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          {loginType === 'email' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                name="email"
                placeholder={'邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱！',
                  },
                  {
                    pattern:  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    message: '邮箱格式错误！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </> 
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <Link
              style={{
                float: 'right',
              }}
              to="/register"
            >
              创建用户
            </Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;