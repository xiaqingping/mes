import React from 'react';

import { Form, Input, Button, Row, Col, Switch, Spin } from 'antd';
import '../index.less';
import { connect } from 'dva';

class SampleGroup extends React.Component {
  constructor() {
    super();
    this.myRef = React.createRef();
  }

  state = {
    loading: false,
    viewForm: {}, // 当是查看的时候, 表单数据
  };

  componentDidMount() {
    const { editOriginData } = this.props;
    console.log(editOriginData);
    const otherProperties = editOriginData.paramPropertiesStr
      ? JSON.parse(editOriginData.paramPropertiesStr)
      : editOriginData.paramPropertiesMap;
    if (otherProperties) {
      if (otherProperties.isrequired === 'true') {
        otherProperties.isrequired = true;
      } else {
        otherProperties.isrequired = false;
      }
    }

    const viewForm = {
      paramKey: editOriginData.paramKey,
      paramName: editOriginData.paramName,
      myId: editOriginData.myId,
      ...otherProperties,
    };
    this.setState({
      viewForm,
    });

    this.myRef.current.setFieldsValue(viewForm);
  }

  onFinish = values => {
    // 校验通过， values就是form对象
    const data = JSON.parse(JSON.stringify(values));
    const argumentValues = {};
    argumentValues.paramKey = data.paramKey;
    argumentValues.paramName = data.paramName;
    delete data.paramName;
    delete data.paramKey;
    argumentValues.type = this.props.type;
    data.isrequired = data.isrequired ? 'true' : 'false';
    argumentValues.paramPropertiesStr = JSON.stringify(data);
    argumentValues.paramProperties = [];
    argumentValues.myId = this.props.editOriginData.myId
      ? this.props.editOriginData.myId
      : Date.now();
    console.log(argumentValues);

    this.props.emitArguments(argumentValues);
    this.props.onClose();
  };

  onFinishFailed = () => {
    // 校验不通过
    return false;
  };

  render() {
    const formItemLayout = null;
    // const buttonItemLayout = null;
    const { loading, viewForm } = this.state;
    console.log(viewForm);
    viewForm.isrequired = viewForm.isrequired ? '是' : '否';
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
            rules={
              !fromView && [
                {
                  required: true,
                  message: '请输入参数名称',
                },
              ]
            }
          >
            {fromView ? <span>{viewForm.paramKey}</span> : <Input placeholder="请输入参数名称 " />}
          </Form.Item>
          <Form.Item
            label="参数描述："
            name="paramName"
            rules={
              !fromView && [
                {
                  required: true,
                  message: '请输入参数名称',
                },
              ]
            }
          >
            {fromView ? viewForm.paramName : <Input placeholder="请输入 " />}
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="是否必填：" name="isrequired" valuePropName="checked">
                {fromView ? viewForm.isrequired : <Switch defaultChecked />}
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item label="提示文字：" name="placeholder">
                {fromView ? viewForm.placeholder : <Input placeholder="请输入 " />}
              </Form.Item>
            </Col> */}
          </Row>
          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="默认值：" name="defaultValue">
                {fromView ? viewForm.defaultValue : <Input placeholder="请输入 " />}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="验证规则：" name="validRule">
                {fromView ? viewForm.validRule : <Input placeholder="请输入 " />}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="验证说明：" name="validDesc">
            {fromView ? viewForm.validDesc : <Input placeholder="请输入 " />}
          </Form.Item> */}
          <div
            style={{ width: '100%' }}
            // className="task_model_argu_form_submit_wrap"
          >
            <div className="task_model_argu_form_submit">
              <Form.Item>
                {!fromView && (
                  <Button type="primary" htmlType="submit">
                    确认
                  </Button>
                )}
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(SampleGroup);
