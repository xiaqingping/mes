import React from 'react';

import { Form, Input, Button, Row, Col, Switch, Spin } from 'antd';

import { connect } from 'dva';

class ArgumentForm extends React.Component {
  constructor() {
    super();
    this.myRef = React.createRef();
  }

  state = {
    loading: false,
  };

  componentDidMount() {
    // 从查看列表过来的。。。
    const { fromView } = this.props;
    const { editOriginData } = this.props;
    let otherProperties = {};
    (editOriginData.paramProperties || []).forEach(item => {
      otherProperties = { ...otherProperties, ...item };
    });
    this.myRef.current.setFieldsValue({
      paramKey: editOriginData.paramKey,
      paramName: editOriginData.paramName,
      myId: editOriginData.myId,
      ...otherProperties,
    });
  }

  onFinish = values => {
    // 校验通过， values就是form对象
    const data = JSON.parse(JSON.stringify(values));
    const argumentValues = {};
    argumentValues.paramKey = data.paramKey;
    argumentValues.paramName = data.paramName;
    delete data.paramName;
    delete data.paramKey;
    argumentValues.paramProperties = [data];
    argumentValues.myId = this.props.editOriginData.myId
      ? this.props.editOriginData.myId
      : Date.now();
    this.props.emitArguments(argumentValues);
    this.props.onClose();
  };

  onFinishFailed = () => {
    // 校验不通过
    return false;
  };

  render() {
    const formItemLayout = null;
    const buttonItemLayout = null;
    const { loading } = this.state;
    const { fromView } = this.props;
    return loading ? (
      <div style={{ textAlign: 'center', marginTop: 15 }}>
        <Spin />
      </div>
    ) : (
      <div>
        <Form
          {...formItemLayout}
          layout="vertical"
          ref={this.myRef}
          onFinishFailed={this.onFinishFailed}
          onFinish={this.onFinish}
        >
          <Form.Item
            label="参数Key："
            name="paramKey"
            rules={[
              {
                required: true,
                message: '请输入参数名称',
              },
            ]}
          >
            {fromView ? 'ddd' : <Input placeholder="请输入参数名称 " />}
          </Form.Item>
          <Form.Item
            label="参数描述："
            name="paramName"
            rules={[
              {
                required: true,
                message: '请输入参数名称',
              },
            ]}
          >
            <Input placeholder="请输入 " />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="是否必填：" name="isrequired" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="提示文字：" name="placeholder">
                <Input placeholder="请输入 " />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="默认值：" name="defaultValue">
                <Input placeholder="请输入 " />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="验证规则：" name="validRule">
                <Input placeholder="请输入 " />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="验证说明：" name="validDesc">
            <Input placeholder="请输入 " />
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentForm);
