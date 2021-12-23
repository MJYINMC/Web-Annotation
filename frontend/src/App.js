import React from "react";

import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import { Result } from "antd";
import Login from './components/user/Login'
import Register from './components/user/Register'
import Homepage from './components/home/Home'

function App(){
  return (
    <div>
      <BrowserRouter>
          <Routes>
              <Route path = "/"  element = {<Login/>}/>
              <Route path = "/login"  element = {<Login/>}/>
              <Route path = "/register"  element = {<Register/>}/>
              <Route path = "/home"  element = {<Homepage path = "/home" />} key = "home"/>
              <Route path = "/create"  element = {<Homepage path =  "/create" />} key = "project_create"/>
              <Route exact path = "/project/:project/info"  element = {<Homepage />} />
              <Route exact path = "/project/:project/upload"  element = {<Homepage />} />
              <Route exact path = "/project/:project/workspace/:sel"  element = {<Homepage  />} />
              <Route path="/404" element={      
                                        <Result
                                        status="404"
                                        style={{
                                          height: '100%',
                                          background: '#fff',
                                        }}
                                        title= "404 Not Found"
                                        subTitle="Sorry, you are not authorized to access this page."
                                      />} 
                                    />
              <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
