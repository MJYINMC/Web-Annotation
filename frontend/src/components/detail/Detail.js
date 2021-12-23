import React, { useState } from 'react';
import { Typography, Divider, message, Steps, Descriptions, Space, Card, Table, Image, Button, Alert, Row, Col, Select, Modal, Tag} from 'antd';
import { useRequest } from 'ahooks';
import Avatar from 'antd/lib/avatar/avatar';

import { fetchInfo, remove, setType, exportCOCO, exportVOC } from './services';
import { annotate } from '../workspace/services';
import { useNavigate } from 'react-router';
import { FileZipTwoTone } from "@ant-design/icons";

const { Title } = Typography;
const { Step } = Steps;
const { Column } = Table;
const { Option } = Select;

export default (props) => {
    const fetch = async () => {
        setLoading(true)
        let result = await fetchInfo(props.project)
        if(!(result.status === 200 & result.data.success))
            message.error(result.data.msg)
        else{
            let data = result.data.data
            console.info(data)
            let index = 0
            setProjectInfo(data)
            setStep(data.type)
            setData(data.images.map(
                (img) => {
                    let tmp = index
                    const a = img.regions.length ?     
                        <Alert message="存在标注" type="success" />:
                        <Alert message="暂无标注" type="error" />
                    const b = img.checked ?
                        <Alert message="审核通过" type="success" />:
                        <Alert message="需要审核" type="error" />
                    return({
                    'index' : index += 1,
                    'name' : img.name,
                    'image' : <Image width={200} src = {img.src}/>,
                    'uploader': img.uploader,
                    'description': "最近被 " + img.last_editor + " 更改于 " + img.last_update,
                    'key': img.id,
                    'status':
                            <Row>
                                <Space>
                                <Col >
                                    {a}
                                </Col>
                                <Col>
                                    {b}
                                </Col>
                                </Space>
                            </Row>,
                    'action': 
                        <div>
                            <Space>
                                <Button onClick={async () => {
                                    Navigate("/project/" + props.project + "/workspace/" + tmp)
                                    props.setPathname("/project/" + props.project + "/workspace/" + tmp) 
                                }}>
                                从这里开始</Button>
                                <Button  onClick={async () => {
                                    let result = await annotate(img.id, [])
                                    if(result.status === 200 & result.data.success){
                                        message.success("清除成功")
                                        fetch()
                                    }else
                                        message.error(result.data.msg)}}>
                                清空标注</Button>
                                <Button danger onClick={async () => {
                                    let result = await remove(img.id)
                                    if(result.status === 200 & result.data.success){
                                        message.success("删除成功")
                                        fetch()
                                    }else
                                        message.error(result.data.msg)}}>
                                删除</Button>
                            </Space>
                        </div>
                    })
                }
            ))
            setLoading(false)
        }
    }

    useRequest(fetch)
    const Navigate = useNavigate()
    const [projectInfo, setProjectInfo] = useState({})
    const [data, setData] = useState([])
    const [value, setValue] = useState(0)
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false);

    const options = [
        <Option key={1}>项目已创建，等待标注</Option>,
        <Option key={2}>标注进行中，等待完成</Option>,
        <Option key={3}>标注已完成，等待审核</Option>,
        <Option key={4}>审核已完成，项目存档</Option>
    ]

    const handleOk = async () => {
        let result = await setType(props.project, value[0])
        if(result.status === 200 & result.data.success){
            message.success("设置成功")
            fetch()
        }else
            message.error(result.data.msg)  
        setIsModalVisible(false);
    }
    
    const handleCancel = () => {
        setIsModalVisible(false);
    }

    return(
        loading ? 
        <div />:
        <div style={{ background: 'white', padding: 50}}>
            <Modal title="设置任务状态" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Select  style={{ width: '100%' }} placeholder="任务状态"
                    onChange = {(value) => {
                        setValue(value)
                    }} >
                    {options}
                </Select>
            </Modal>
            <Typography>
                <Row>
                    <Col span={12}>                
                        <Title level={2}>基本信息</Title>
                    </Col>
                    <Col span={12} >
                        <div style={{float:'right'}}>
                            <Space>
                                <Button onClick={ () => {
                                    Navigate("/project/" + props.project + "/workspace/0")
                                    props.setPathname("/project/" + props.project + "/workspace/0")
                                    }
                                }
                                >开始标注</Button>
                                <Button onClick={() => {
                                    setIsModalVisible(true)
                                }}>变更状态</Button>
                                <Button onClick={()=>{
                                    Navigate("/project/" + props.project + "/workspace/0", {
                                        state:{
                                            checking: true,
                                        }})
                                    props.setPathname("/project/" + props.project + "/workspace/0")
                                }}>进入审核</Button>
                                <Button onClick={ () => {
                                    let choice = "COCO";
                                    Modal.confirm({
                                        title: '导出数据集',
                                        icon: <FileZipTwoTone />,
                                        content:  <Select defaultValue="COCO"  style={{width: "95%"}} placeholder="数据集类型"
                                                    onChange = {(value) => {
                                                        choice = value
                                                    }} >
                                                    <Option value={"COCO"}>
                                                        COCO
                                                    </Option>
                                                    <Option value={"Pascal VOC"}>
                                                        Pascal VOC
                                                    </Option>
                                                </Select>,
                                        okText: '确认',
                                        cancelText: '取消',
                                        onCancel: false,
                                        onOk: () => {
                                            switch(choice){
                                                case "COCO":
                                                    exportCOCO(
                                                        projectInfo.UUID, 
                                                        projectInfo.classes, 
                                                        projectInfo.tags,
                                                        projectInfo.images,
                                                        projectInfo.create_time
                                                    )
                                                    break;
                                                case "Pascal VOC":
                                                    exportVOC(projectInfo.UUID, 
                                                        projectInfo.images)
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    })
                                }
                                }>导出数据集</Button>
                            </Space>
                        </div>
                    </Col>
                </Row>
                <Descriptions >
                    <Descriptions.Item label="项目名">{projectInfo.name}</Descriptions.Item>
                    <Descriptions.Item label="UUID">{projectInfo.UUID}</Descriptions.Item>
                    <Descriptions.Item label="创建人">{projectInfo.creator}</Descriptions.Item>
                    <Descriptions.Item label="属性">{projectInfo.private? "私人项目": "公开项目"}</Descriptions.Item>
                    <Descriptions.Item label="图片总数">{projectInfo.img_num}</Descriptions.Item>
                    <Descriptions.Item label="待标记数">{projectInfo.to_annotate}</Descriptions.Item>
                    <Descriptions.Item label="待审核数">{projectInfo.to_check}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={2}>标注属性</Title>
                <Row>
                    <Col span={8}>
                        <span>class: </span>
                        {projectInfo.tags.map(
                            (e) => (
                                <Tag> {e} </Tag>
                            )
                        )}     
                    </Col>
                    <Col span={8} >
                        <span>tag: </span>
                        {projectInfo.classes.map(
                            (e) => (
                                <Tag> {e}</Tag>
                            )
                        )}
                    </Col>
                    <Col span={8} >
                        <span>tools: </span>
                        {projectInfo.tools.map(
                            (e) => (
                                <Tag> {e}</Tag>
                            )
                        )}
                    </Col>
                </Row>

                <Divider />

                <Title level={2}>项目贡献者</Title>
                    <Space size='large' >
                        {projectInfo.joiners.map((name) => (<Avatar size='large'>{name}</Avatar>))}
                    </Space>
                <Divider />
                
                <Title level={2}>时间线</Title>
                <Steps current={step} labelPlacement="vertical">
                    <Step title="项目创建" description={projectInfo.create_time}/>
                    <Step title="标注已开始" subTitle="请尽快完成" description={"最近一次更新: " + projectInfo.update_time} />
                    <Step title="标注已完成" subTitle="" description="请联系管理员协助审核" />
                    <Step title="标注完成" description= {<div style={{whiteSpace: "nowrap"}}>祝您幸福美满每一天！</div>} />
                </Steps>

                <Divider />

                <Title level={2}>图片橱窗</Title>
                <Card bordered={true} >              
                    <Table dataSource={data}>
                        <Column title="序号" dataIndex="index"/>
                        <Column title="图片名" dataIndex="name"/>
                        <Column title="预览" dataIndex="image" />
                        <Column title="上传者" dataIndex="uploader" />
                        <Column title="历史" dataIndex="description"/>  
                        <Column title="状态" dataIndex="status"/>  
                        <Column title="操作" dataIndex="action"/>  
                    </Table>
                </Card>
            </Typography>
        </div>
    )
}