// import {Info, Warning} from andt;
import React from "react";
import { message, Result } from "antd";

import Info  from "../info/Info";
import Create from "../create/Create";
import Upload  from "../upload/Upload";
import Workspace from "../workspace/Workspace";
import Detail from "../detail/Detail";
import { useLocation, useNavigate } from "react-router";

export default (props) => {
    const Navigate = useNavigate()
    const location = useLocation()
    let project = props.project
    let pathname = props.pathname
    let sel = props.sel
    console.info('Switcher')
    if(project === 'undefined' & (pathname !== '/home' | pathname !== 'create')){
        message.error('不存在的项目，请从列表中进入项目')
        Navigate('/home')
        props.setPathname('/home')
    }

    switch(pathname){
        case '/home': 
            return <Info setPathname= {props.setPathname}/>;
        case '/create': 
            return <Create setPathname= {props.setPathname}/>;
        case '/project/' + project + '/info': 
            return <Detail project = {project} setPathname= {props.setPathname} />;
        case '/project/' + project + '/upload': 
            return <Upload project = {project} setPathname= {props.setPathname} />;
        case '/project/' + project + '/workspace/' + sel: 
            return <Workspace 
                checking = {location.state ? location.state.checking: false}
                project = {project} setPathname= {props.setPathname} sel =  {sel}/>;
    
        default:
        return <Result
                status="404"
                style={{
                height: '100%',
                background: '#fff',
                }}
                title= "404 Not Found"
                subTitle="Sorry, you are not authorized to access this page."
            />;
    }
} 
