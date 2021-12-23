import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { Card, Col, Row, Table, Button, message, Space} from 'antd';
import { useRequest } from 'ahooks';
import { get_projects, join, quit, remove } from './services';

export default (props) => {
    const Navigate = useNavigate()
    const getProjects = async () => {
        let result = await get_projects()
        let count = 0
        if(result.status === 200 & result.data.success){
            setImg_num(result.data.img_num)
            setTodo_num(result.data.todo_num)
            setData(result.data.data.map(
                (e) => {
                    if(e.is_in)
                        count += 1
                    e.status = types[e.type]
                    e.action = e.private && !e.is_in? 
                    (<Space >
                        <Button disabled style={{marginLeft:25}}>
                            私有项目
                        </Button>
                        <Button type="primary" danger disabled >
                            私有项目
                        </Button>
                    </Space>):
                    !e.is_in ?
                    (<Space>
                        <Button
                            onClick={() => handleJoin(e.name)}>
                            认领
                        </Button>                               
                    </Space>): 
                    e.private?
                    (<Space>
                        <Button
                            onClick={() => handleEnter(e.name)}>
                            进入
                        </Button>
                        <Button disabled style={{marginLeft:25}}>
                            私有项目
                        </Button>
                        <Button type="primary" danger
                            onClick={() => handleDelete(e.UUID)}>
                            删除
                        </Button>
                    </Space>):
                    (<Space>
                        <Button
                            onClick={() => handleEnter(e.name)}>
                            进入
                        </Button>
                        <Button
                            onClick={() => handleQuit(e.name)}>
                            离开
                        </Button>
                        {<Button type="primary" danger 
                            onClick={() => handleDelete(e.UUID)}>
                            删除
                        </Button>}
                    </Space>)
                return e
            }))
            setCount(count)
        }
    }

    useRequest(getProjects)
    const [img_num, setImg_num] = useState(0)
    const [todo_num, setTodo_num] = useState(0)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)

    const types = {
        1 : "项目已创建",
        2 : "标注进行中",
        3 : "等待审核中",
        4 : "项目已完成"
    }

    const {Column} = Table;

    const handleJoin = async (name) =>{
        let result =  await join(name)
        if (result.status === 200 & result.data.success){
            message.success("认领成功！")
            getProjects()
        }else{
            message.error(result.data.msg)   
        }
    }

    const handleQuit = async (name) =>{
        let result = await quit(name)
        if (result.status === 200 & result.data.success){
            message.success("离开成功！")
            getProjects()
        }else{
            message.error(result.data.msg)   
        }
    }

    const handleEnter = (name) =>{
        Navigate("/project/" + name + "/info")
        props.setPathname("/project/" + name + "/info")
    }


    const handleDelete = async (UUID) =>{
        let result = await remove(UUID)
        if (result.status === 200 & result.data.success){
            message.success("删除成功！")
            getProjects()
        }else{
            message.error(result.data.msg)   
        }
    }

    return(
        <div style={{ background: 'white', padding: 0 }}>
            <Card title="统计信息" bordered={false}>
                <Row gutter={24}>
                    <Col span={6}>
                        <Card title="项目总数" bordered={true}>
                            {data.length}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="个人参与项目数" bordered={true}>
                            {count}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="图像总数" bordered={true}>
                            {img_num}
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="待标记任务数" bordered={true}>
                            {todo_num}
                        </Card>
                    </Col>
                </Row>
            </Card>
            <Card title="创建记录" bordered={false}>              
                <Table dataSource={data} scroll={{ y: 600 }}>
                    <Column title="发布项目" dataIndex="name" key="name" />
                    <Column title="创建者" dataIndex="creator" key="creator" />
                    <Column title="创建时间" dataIndex="create_time" key="create_time" />  
                    <Column title="最后一次更新于" dataIndex="last_update" key="last_update" />   
                    <Column title="状态" dataIndex="status" key="status" />   
                    <Column title="动作" dataIndex="action" key="action" />                                                                         
                </Table>
            </Card>
        </div>
    )
}