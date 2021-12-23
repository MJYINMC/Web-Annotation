import React from 'react';
import { useNavigate } from 'react-router';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './style.css'
import { create } from './services';
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 8 },
  },
};

export default (props) => {
    const Navigate = useNavigate()
    const plainOptions = [ "create-point", "create-box", "create-polygon", "create-line"];
    const defaultCheckedList = ["create-box", "create-polygon"];

    const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = React.useState(true);
    const [checkAll, setCheckAll] = React.useState(false);

    const onFinish = async (values) => {
        values.tools = JSON.stringify(checkedList)
        values.classes = JSON.stringify(values.classes)
        values.tags = JSON.stringify(values.tags)

        console.log('Received values of form:', values)
        let result = await create(values)
        if(result.status === 200 & result.data.success){
            message.success("创建成功！")
            Navigate("/project/" + values.name + "/info")
            props.setPathname("/project/" + values.name + "/info")
        }else{
            message.error(result.data.msg)   
        }
    };



const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
};

const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
};
return (
    <Form {...formItemLayoutWithOutLabel} 
        onFinish = {onFinish} size = 'large' 
        style={{margin:"12%"}}
        initialValues = {{
            classes : [],
            tags: [],
            private: false
        }}
        >
        <Form.Item {...formItemLayout}
            name = "name"
            label = "项目名"
            rules={[
            {
                required: true,
                message: "请输入项目名",
            },
            ]}
        >
            <Input placeholder="项目名" style={{ width: '60%' }} />
        </Form.Item>

        <Form.Item {...formItemLayout} 
            label={<div style={{height:"50"}}>标注工具</div>}
            name="tools" >

            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                全选
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
        </Form.Item>
        
        <Form.List
            name="classes"
            rules={[
                {
                    required: false
                },
            ]}
        >
        {(fields, { add, remove }, { errors }) => (
            <>
            {fields.map((field, index) => (
                <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label = {index === 0 ? 'classes' : ''}
                    required={false}
                    key={field.key}
                >
                <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                    {
                        required: true,
                        whitespace: true,
                        message: "请输入class或删除这一项表单",
                    },
                    ]}
                    noStyle
                >
                    <Input placeholder="class name" style={{ width: '60%' }} />
                </Form.Item>
                {
                    <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    />
                }
                </Form.Item>
            ))}



            <Form.Item>
                <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
                >
                Add class
                </Button>
                <Form.ErrorList errors={errors} />
            </Form.Item>
            </>
        )}
        </Form.List>

        <Form.List
        name="tags"
        rules={[
            {
                required: false
            },
        ]}
        >
        {(fields, { add, remove }, { errors }) => (
            <>
            {fields.map((field, index) => (
                <Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label = {index === 0 ? 'tags' : ''}
                    required={false}
                    key={field.key}
                >
                <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                    {
                        required: true,
                        whitespace: true,
                        message: "请输入tag或删除这一项表单",
                    },
                    ]}
                    noStyle
                >
                    <Input placeholder="tag name" style={{ width: '60%' }} />
                </Form.Item>
                {
                    <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    />
                }
                </Form.Item>
            ))}



            <Form.Item>
                <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
                >
                Add tag
                </Button>
                <Form.ErrorList errors={errors} />
            </Form.Item>
            </>
        )}
        </Form.List>

        <Form.Item name="private" valuePropName="checked" >
            <Checkbox>私人项目</Checkbox>
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit">
                创建
            </Button>
        </Form.Item>
    </Form>
    );
};

