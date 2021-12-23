import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { useLocation, useNavigate, useParams } from 'react-router';
import store from 'store';
import { Link } from 'react-router-dom';
import { Button, BackTop, Tag, Input, message, Spin } from 'antd';
import { CrownOutlined, PlusOutlined, PoweroffOutlined, AreaChartOutlined } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';


import { verify }  from './services'
import Footer from "../Footer";
import Switcher from './Switcher';



export default (props) => {
  let { project } = useParams()
  let { sel } = useParams()
  const defaultProps = {
    routes: [
      {
        path: '/home',
        name: '项目总览',
        icon: <CrownOutlined />,
        component: './Home',
      },
      {
        path: '/create',
        name: '创建项目',
        icon: <PlusOutlined />,
        component: './Create',
      },
      {
        path: '/project/',
        name: '项目管理',
        icon: <AreaChartOutlined />,
        component: './Info',
        routes: [
          {
            path: '/project/' + project + '/info',
            name: '项目详情',
            component: './Detail',
          },
          {
            path: '/project/' + project + '/upload',
            name: '上传文件',
            component: './Upload',
          },
          {
            path: '/project/' + project + '/workspace/' + sel,
            name: '标注图像',
            component: './Workspace',
          }
        ]
      },
    ],
  };
  const get_verified = async () => {
    console.info("Homepage")
    let res = await verify()
    if (!(res.status === 200 && res.data.success)){
      message.error(res.data.msg)
      store.set("django_token", undefined)
      Navigate("/login")
    }else{
      message.success("登录成功", 1)
    }
    setLoading(false)
  }

  useRequest(get_verified)
  const Navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [pathname, setPathname] = useState(useLocation().pathname)
  const [component, setComponent] = useState(props.component)

  return (
    <>
      <ProLayout
        route={defaultProps}
        location={{
          pathname,
          component
        }}
        navTheme="light"
        fixSiderbar
        onMenuHeaderClick={(e) => {
          message.success("Enjoy!")
        }}
        title = "2021 BS"
        logo = {<img alt="logo" src="/logo.svg" />}

        headerRender = {false}
        
        menuItemRender={(item, dom) => (
          <Link to={item.path}
            onClick={() => {
              setPathname(item.path || '/home');
              setComponent(item.component || './Home');
            }}
          >
            {dom}
          </Link>
        )}
        footerRender={Footer}
      >
        <PageContainer
          loading={loading ? 
                    <div style={{
                        height: '120vh',
                        textAlign: 'center',
                      }}>
                        <Spin size="large" tip='拼命加载中' style={{marginTop: "50%"}}/>
                    </div>
                    :false}
          onBack={() => {}}
          tags={<Tag color="blue">Web Annotation</Tag>}
          avatar = {{ src: 'https://i.postimg.cc/9f0GFkRM/IMG-2240-20211218-192122.jpg' }}
          fixedHeader
          header={
            {style: {
              padding: '4px 16px',
              zIndex: 999,
              boxShadow: '0 2px 8px #f0f1f2',
            }}
          }

          extra={[
            <Input.Search
              key="search"
              style={{
                width: 240,
              }}
            />,
            <Button 
              key="logout"
              danger
              icon={<PoweroffOutlined />}
              onClick={()=>{
                store.set("django_token", undefined)
                Navigate("/login")
              }}
            >
              注销  
            </Button>,
          ]}
        >
          <div
            style={{
              minHeight: '100vh',
            }}
          >
            <Switcher pathname={decodeURI(pathname)}  project={project} sel={sel} setPathname={setPathname}></Switcher>
          </div>
        </PageContainer>
      </ProLayout>
      <BackTop />
    </>
  );
};

