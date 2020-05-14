import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { TextArea } = Input;

/**
 * 流程 编辑名称描述 模态框
 * @param {String} visible 是否显示
 */
const EditInforModel = props => {
  const [form] = Form.useForm();
  const [confirmLoading] = useState(false);

  // 关闭Model
  const handleCancel = () => {
    props.onClose();
  };

  // 确定保存
  const handleOk = async () => {
    const row = await form.validateFields();
    const data = {
      id: props.rowData.id,
      ...row,
    };
    props.getData(data);
    props.onClose();
  };

  return (
    <div>
      <Modal
        className="classEditFormItem"
        title="修改"
        visible={props.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
            确定
          </Button>,
        ]}
        centered
        width={650}
      >
        <div>
          <Form
            name="basic"
            form={form}
            initialValues={{ name: props.rowData.name, describe: props.rowData.describe }}
          >
            <FormItem label="名称" name="name" rules={[{ message: '请输入名称!' }]}>
              <Input style={{ width: 260, height: 32 }} />
            </FormItem>
            <FormItem label="描述" name="describe" rules={[{ message: '请输入相关描述!' }]}>
              <TextArea rows={4} style={{ width: 470, height: 129, marginBottom: -10 }} />
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

/**
 * 成员 修改权限 模态框
 * @param {String} visible 是否显示
 */
const EditJurisdictionModel = props => {
  const [confirmLoading] = useState(false);

  // 关闭Model
  const handleCancel = () => {
    props.onClose();
  };

  // 确定保存
  const handleOk = async () => {
    const data = {
      type: 'ok',
      id: props.data.id,
      jurisdictionValue: props.data.jurisdictionValue,
    };
    props.getData(data);
    props.onClose();
  };

  return (
    <div>
      <Modal
        visible={props.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        centered
        closable={false}
        width={350}
      >
        <div style={{ textAlign: 'center' }}>
          <InfoCircleOutlined style={{ fontSize: 40, color: '#f6b03b' }} />
          <p style={{ marginTop: 25, fontSize: 16, marginBottom: 5 }}>
            是否将{props.data.name}修改为{props.data.jurisdictionName}?
          </p>
        </div>
      </Modal>
    </div>
  );
};

export { EditInforModel, EditJurisdictionModel };
