import axios from 'axios';
import store from 'store';
import X2JS from 'x2js';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import settings from '../../etc/settings.json';
const url = settings.url;

const fetchInfo = async (project) => {
    //从本地缓存获取token添加到headers
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
            store.set('django_token', token);    //刷新本地存储的token
    }
    return res
}

const remove = async (id) => {
    //从本地缓存获取token添加到headers
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
            url+'/file/remove',
            {
                method: "DELETE",
                headers: headers,
                data: {
                    'id': id
                }
            }
        )
    if (res.status === 200) {
        let token = res.headers.auth;
        if (token) 
            store.set('django_token', token);    //刷新本地存储的token
    }
    return res
}

const setType = async (project, type) => {
    //从本地缓存获取token添加到headers
    let token = store.get('django_token')
    let headers = {
        auth: token
    }

    let res = await axios(
        url+'/project/set_type',
        {
            method: "PUT",
            headers: headers,
            data: {
                'project': project,
                'type': type
            }
        }
    )
    
    if (res.status === 200) {
        let token = res.headers.auth;
        if (token) 
            store.set('django_token', token);    //刷新本地存储的token
    }
    return res
}

const exportCOCO = (UUID, classes, tags, images, time) => {
    let template = {
        info: {
            year: new Date().getFullYear(),
            'version': 1.0,
            'description': "BS project @MJY, ZheJiang University",
            'url': 'https://cocodataset.org/',
            'date_created': time
        },
        license: {
            "id": 1,
            "name": "http://creativecommons.org/licenses/by-nc-sa/2.0/",
            "url": 'Attribution-NonCommercial-ShareAlike License',
        }, 
        "images": [],
        "annotations": [],
        "categories": []
    }
    
    template.images = images.map( (img) => {
        let w = img.width
        let h = img.height
        img.regions.forEach( (e) => {
            let beginX = 0,
                beginY = 0,
                width = 0,
                height = 0;
            let segmentation = [];
            let area = 0;
            switch (e.type) {
                case 'box':
                    beginX = w * e.x;
                    beginY = h * e.y;
                    width =w * e.w;
                    height = h * e.h;
                    area = width * height;
                    break;
                  case 'point':
                    beginX = w * e.x;
                    beginY = h * e.y;
                    width = height = 1;
                    area = 1;
                    break;
                  case 'polygon':
                    e.points.forEach(
                        (p) => {
                            segmentation.push(p[0] * w)
                            segmentation.push(p[1] * h)
                        }
                    )
                    break;
                  case 'line':
                    beginX = w * e.x1;
                    beginY = h * e.y1;
                    width = w * e.x2;
                    height = h * e.y2;
                    area = 1;
                    break;
                  default:
                    break;
            }
            template.annotations.push({
                iscrowd: 0,
                image_id: img.id,
                category_id: classes.indexOf(e.cls),
                id: e.id,
                area,
                segmentation,
                bbox: [beginX, beginY, width, height],
                tags: e.tags ? e.tags : []
            })
        });
        return(
            {
                'id': img.id,
                'width': img.width,
                'height': img.height,
                'file_name': img.name,
                'flickr_url': img.src,
                'coco_url': img.src,
                "date_captured": img.upload_time
            })
        }
    )

    template.categories = (classes.map(
        (cls, idx) => ({
          id: idx,
          name: cls,
          supercategory: cls,
        })
    ))
    var datastr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template));
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", datastr);
    downloadAnchorNode.setAttribute("download", UUID + '.json')
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const exportVOC = (UUID, images) => {
    let zip = new JSZip();
    let x2js = new X2JS();
    images.forEach(
        (img) => {
            let w = img.width
            let h = img.height
            let annotation = {
                folder: UUID,
                filename: img.name,
                size: { width: w, height: h, depth: 3 },
                segmented: 0,
                object: [],
              };
        img.regions.forEach(
            (e) => {
                let type = ''
                let beginX = 0,
                    beginY = 0,
                    width = 0,
                    height = 0;
                let segmentation = [];
                let area = 0;
                switch (e.type) {
                    case 'box':
                        type = 'bndbox';
                        beginX = w * e.x;
                        beginY = h * e.y;
                        width = w * e.w;
                        height = h * e.h;
                        area = width * height;
                        break;
                    case 'point':
                        type = 'point';
                        beginX = w * e.x;
                        beginY = h * e.y;
                        width = height = 1;
                        area = 1;
                        break;
                    case 'polygon':
                        type = 'polygon';
                        e.points.forEach(
                        (p) => {
                            segmentation.push(p[0] * w)
                            segmentation.push(p[1] * h)
                        })   
                        break;
                    case 'line':
                        type = 'line';
                        beginX = w * e.x1;
                        beginY = h * e.y1;
                        width = w * e.x2;
                        height = h * e.y2;
                        area = 1;
                        break;
                    default:
                        break;
                }
                annotation.object.push({
                    name: e.cls ? e.cls: '', 
                    truncated: 0, 
                    difficult: 0,
                    [type] : {
                        xmin: beginX,
                        xmax: beginX + width,
                        ymin: beginY,
                        ymax: beginY + height,
                        area: area,
                        segmentation: segmentation,
                    }
                })
            }
        )
        let xmlAsStr = x2js.js2xml({ annotation: annotation });
        let blob = new Blob([xmlAsStr], { type: 'application/xml' });
        zip.file(img.name.substring(0, img.name.lastIndexOf('.')) + '.xml', blob);
        }
    )
    zip.generateAsync({ type: 'blob' }).then((content) => {
        FileSaver(
          content,
          UUID,
        );
    });
}

export{
    fetchInfo,
    remove,
    setType,
    exportCOCO,
    exportVOC
}