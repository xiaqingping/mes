// 新增分组
import React from 'react';
import { Form, Input, Button, Modal } from 'antd';

const AddGroup = props => {
  const [form] = Form.useForm();
  const onFinish = values => {
    form.resetFields();
    if (!values.groupName || !values.groupDesc || values.groupName === 'no') {
      return false;
    }
    props.handleCloseGroup(values, 1);
    return true;
  };
  return (
    <Modal
      title="添加组分类"
      visible={props.visible}
      onCancel={props.handleCloseGroup}
      footer={null}
      mask={false}
      maskClosable={false}
      width={550}
      style={{ top: 180, right: 120, height: 500 }}
    >
      <Form
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item label="分组名称" name="groupName">
          <Input placeholder="请输入分组名称" />
        </Form.Item>
        <Form.Item label="描述" name="groupDesc">
          <Input.TextArea placeholder="请输入描述" style={{ resize: 'none' }} rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddGroup;
