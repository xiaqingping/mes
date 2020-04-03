import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
// import api from '@/pages/project/api/projectManageDetail';

const FormItem = Form.Item;
const { TextArea } = Input;

const EditInforModel = props => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 关闭Model
  const handleCancel = () => {
    props.onClose();
  };

  // 确定保存
  const handleOk = async () => {
    const row = await form.validateFields();
    const data = {
      id: props.processList.id,
      ...row
    }
    props.getData(data);
    props.onClose();
    // setConfirmLoading(false)
    // try {
    //   const row = await form.validateFields();
    //   console.log(props.processList)
    //   const data = {
    //     id: props.processList.id,
    //     ...row
    //   }
    //   console.log(data);
    //   api.saveProcessInfor(data).then(res => {
    //     props.onClose();
    //     setConfirmLoading(false);
    //   })
    // } catch (errorInfo) {
    //   console.log(errorInfo);
    // }
    // setConfirmLoading(true)
    // setTimeout(() => {
    //   props.visible = false;
    //   setConfirmLoading(false);
    // }, 2000);
  };



  return (
    <div>
      <Modal
        title="修改"
        visible={props.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        centered
      >
        <Form
          // {...layout}
          name="basic"
          form={form}
          initialValues={{ name: props.processList.name , describe: props.processList.describe}}
        >
          <FormItem
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称!' }]}
          >
            <Input style={{ width: 250 }} />
          </FormItem>
          <FormItem
            label="描述"
            name="describe"
            rules={[{ required: true, message: '请输入相关描述!' }]}
          >
            <TextArea rows={4} style={{ width: 350 }} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export { EditInforModel };
