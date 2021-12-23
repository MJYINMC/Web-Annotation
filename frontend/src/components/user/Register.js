import React from 'react'
import { useNavigate } from 'react-router';
import 'antd/dist/antd.css';
import { message, Typography, Form, Input, Button, Image} from 'antd';
import { Icon } from '@ant-design/compatible';
import { ProFormCaptcha } from '@ant-design/pro-form';
import { LockOutlined } from '@ant-design/icons'
import md5 from "js-md5";
import {Link} from 'react-router-dom';

import Footer from "../Footer";
import { register } from './services';
const { Title } = Typography;

function Register(){
    const Navigate = useNavigate()

    const onFinish = async (values) => {
        values.password = md5(values.password);
        delete values.captcha;
        let result = await register(values)
        if(result.status === 200 & result.data.success){
            message.success("注册成功，将跳转到登录页面")
            Navigate("/login")
        }else{
            message.error(result.data.msg, 5);
        }
    };

    const layout = {
        labelCol: {
            span: 10,
        },
        wrapperCol: {
            span: 4,
        }
    };

    const tailLayout = {
        wrapperCol: {
            offset: 10,
            span: 4,
        }
    };
    
    return (
        <div className='container'>
            <div className='content'>
                <div
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '7%'
                    }}
                >
                    <Image height={100} width={100} src="/logo.svg" />
                    <Title>Web Annotation</Title>
                </div>
                <Form 
                    {...layout}
                    onFinish={onFinish}
                    initialValues={{ remember: true}}
                    size = 'large'
                >

                <Form.Item 
                    name="username" 
                    label="用户名" 
                    tooltip="该用户名和邮箱同时为唯一标识符，请谨慎选择"
                    rules={[{
                        required: true,
                        message: "请输入用户名"
                    }]}
                >
                    <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        {
                            required: true,
                            message: "请输入邮箱"
                        },
                        {
                            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 
                            message: "邮箱格式不太对啊！"
                        }
                    ]}
                >
                    <Input
                        type="email"
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: "请输入密码"
                        },
                        {
                            min: 6,
                            message: '密码不能少于6个字符'
                        }
                    ]}
                >
                    <Input.Password
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item  {...tailLayout}>
                    <ProFormCaptcha
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className={'prefixIcon'} />,
                        }}
                        captchaProps={{
                            size: 'large',
                        }}
                        placeholder={'请输入验证码'}
                        captchaTextRender={(timing, count) => {
                            if (timing) {
                            return `${count} ${'获取验证码'}`;
                            }
                            return '获取验证码';
                        }}
                        name="captcha"
                        rules={[
                            {
                            required: false,
                            message: '请输入验证码！',
                            },
                        ]}
                        onGetCaptcha={async () => {
                            message.success('获取验证码成功！验证码为：1234');
                        }}
                    />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button htmlType='submit' type="primary">
                        注册
                    </Button>
                    <Link
                        style={{
                            float: 'right',
                        }}
                        to="/login"
                    >
                        已有帐户？直接登录
                    </Link>
                </Form.Item>
            </Form>
        </div>
        <Footer />
    </div>);
}

export default Register;