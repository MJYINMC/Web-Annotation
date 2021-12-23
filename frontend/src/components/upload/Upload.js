import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { Button, message, Modal, Upload} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { upload } from './services';
const { Dragger } = Upload;

export default (props) => {
    const Navigate = useNavigate()
    const [uploading, setUploading] = useState(false)
    const [fileList, setFileList] = useState([])
    let syncList = fileList

    const beforeUpload = (file) => {
        const isMedia = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' 
            || file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/flv';
        if (!isMedia){
            message.error('文件格式不支持!');
        }else{
            syncList = [...syncList, file]
            setFileList(syncList)
        }
        return false;
    }

    const handleUpload = async () =>{
        setUploading(true)
        for (const file of fileList) {
            let result = await upload(props.project, file)
            if(result.status === 200 & result.data.success)
                message.success("上传成功")
            else
                message.error(result.data.msg)
        }
        setFileList([])
        setUploading(false)
    }

    return(
        <Modal title="上传文件" 
            visible= 'true'
            footer={[
                <Button key="back"  onClick = {
                    () =>{
                        Navigate("/project/" + props.project + "/info")
                        props.setPathname("/project/" + props.project + "/info")
                    }
                }>
                    返回
                </Button>,

                <Button
                    type = "primary"
                    onClick={handleUpload}
                    disabled = {fileList.length === 0}
                    loading = {uploading}
                >
                {uploading ? '上传中，请耐心等待' : '开始上传'}
                </Button>
            ]}
            onCancel={
                () =>{
                    Navigate("/project/" + props.project + "/info")
                    props.setPathname("/project/" + props.project + "/info")
                }  
            }
        >
        <Dragger   
            name = 'file'
            multiple = {true}
            beforeUpload={beforeUpload}
            fileList={fileList}
            onRemove = {
                (file) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1)
                    setFileList(newFileList)
                }
            }
        >
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖曳文件到此区域以上传</p>
            <p className="ant-upload-hint">
                支持mp4，avi，flv等常见视频格式
                <br></br>
                支持png，jpg，bmp等常见图片格式
            </p>
        </Dragger>             

        </Modal>
    )
}