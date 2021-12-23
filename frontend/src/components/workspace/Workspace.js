import React from "react";
import ReactImageAnnotate from "react-image-annotate"
import { useState } from "react";
import { useRequest } from "ahooks";
import { fetchInfo, annotate, check } from "./services";
import { Col, message, Progress, Row, Modal } from "antd";
import { Button } from "antd/lib/radio";
import { useNavigate } from "react-router";
import { ExclamationCircleOutlined } from "@ant-design/icons";
export default (props) => {
    const setup = async () => {
        let result = await fetchInfo(props.project)
        if(!(result.status === 200 & result.data.success))
            message.error(result.data.msg)
        else{
            let data = result.data.data
            if(data.images.length > 0)
                setImages(data.images)
            setRegionClsList(data.classes)
            setRegionTagList(data.tags)
            setEnabledTools(data.tools)
        }
        console.info("fetched!")
        setLoading(false)
        setPercent(parseInt(100*((parseInt(props.sel)|| 0)+1)/result.data.data.images.length))
        if(props.checking){
            confirm(result.data.data.images[0].id)
        }
    }

    const confirm = (id) => {Modal.confirm({
        title: '确认',
        icon: <ExclamationCircleOutlined />,
        content: '是否通过审核',
        okText: '不合格',
        cancelText: '通过',
        mask: false,
        onCancel: async () => {
            let result = await check(id, true)
            if(result.status === 200 && result.data.success){
                message.success("审核通过成功！")
            }else{
                message.error(result.data.msg)
            }
        },
        onOk: async () => {
            let result = await check(id, false)
            if(result.status === 200 && result.data.success){
                message.info("设置不通过成功！")
            }else{
                message.error(result.data.msg)
            }
        }
    })};

    useRequest(setup)
    const Navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [images, setImages] = useState(
        [{
            src : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.paca-ecobiz.fr%2Fupload%2Fdocs%2Fimage%2Fjpeg%2F2015-02%2Fwelcome_2015-02-03_14-28-31_171.jpg",
            name : "welcome"
        }]
        )
    const [enabledTools, setEnabledTools] = useState([])
    const [regionClsList, setRegionClsList] = useState([])
    const [regionTagList, setRegionTagList] = useState([])
    const [selectedImage, setSelectedImage] = useState(parseInt(props.sel)||0)
    const [percent, setPercent] = useState(0)

    const handleNext = props.checking ? async (e) => {
            if (selectedImage === images.length - 1)
                return 
            setSelectedImage(selectedImage + 1)
            setPercent(parseInt(100*(selectedImage + 2)/(images.length)))
            confirm(e.images[selectedImage + 1].id)
        }: async (e) =>{
            console.info(e)
            let curImg = e.images[selectedImage]
            let result = await annotate(curImg.id, curImg.regions)
            if(result.status === 200 & result.data.success)
                message.success(curImg.name + " 自动保存成功")
            if ( selectedImage === images.length - 1)
                return 
            setSelectedImage(selectedImage + 1)
            setPercent(parseInt(100*(selectedImage + 2)/(images.length)))
    }

    const handlePrev = props.checking ? async (e) => {
            if (selectedImage === 0)
                return
            setSelectedImage(selectedImage - 1)
            setPercent(parseInt(100*(selectedImage)/(images.length)))
            confirm(e.images[selectedImage - 1].id)
        }: async (e) =>{
            let curImg = e.images[selectedImage]
            let result = await annotate(curImg.id, curImg.regions)
            if(result.status === 200 & result.data.success)
                message.success(curImg.name + " 自动保存成功")
            if (selectedImage === 0)
                return 
            setSelectedImage(selectedImage - 1)
            setPercent(parseInt(100*(selectedImage)/(images.length)))
    }

  return(
        loading ? 
        <div />:
        <div>
            <Row style={{marginBottom:20}}>
                <Col span={22}>
                    <Progress percent={percent}/>
                </Col>
                <Col span={2}>
                    <Button style={{ float:'right'}} onClick={
                        () => {
                            Navigate('/project/' + props.project + '/info')
                            props.setPathname('/project/' + props.project + '/info')
                        }
                    }> 返回详情页 </Button>
                </Col>
            </Row>

            <ReactImageAnnotate
                regionClsList = {regionClsList}
                regionTagList = {regionTagList}
                enabledTools = {props.checking ? [] : enabledTools}
                images = {images}
                onNextImage = {handleNext}
                onPrevImage = {handlePrev}
                selectedImage = {selectedImage}
                hideClone = {true}
                hideSettings = {props.checking ? true: false}
                hideSave = {props.checking ? true: false}
                hideHeaderText = {true}
                onExit = {
                    async (MainLayoutState) => {
                        let img = MainLayoutState.images[selectedImage]
                        let result = await annotate(img.id, img.regions)                                
                        if(!(result.status === 200 & result.data.success))
                            message.error(img.name + "保存失败\n" + result.data.msg)
                        message.info("保存完成，建议返回详情页查看有无遗漏")
                    }
                }
            />
        </div>

  )
}