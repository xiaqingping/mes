import React from 'react';
import { Form, Input, Row, Col, Switch, Select } from 'antd';

const { Option } = Select;

class numericalInput extends React.Component {
  state = {};

  render() {
    const { fromView, viewForm } = this.props;
    return (
      <>
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
          <Col span={12}>
            <Form.Item label="提示文字：" name="placeholder">
              {fromView ? viewForm.placeholder : <Input placeholder="请输入 " />}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item label="默认值：" name="defaultValue">
              {fromView ? viewForm.defaultValue : <Input placeholder="请输入 " />}
            </Form.Item>
          </Col>
          <Form.Item label="输入区间" name="interval">
            {fromView ? (
              viewForm.interval
            ) : (
              <Input.Group compact>
                <Form.Item name="min">
                  <Input style={{ width: 80, textAlign: 'center' }} placeholder="最小值" />
                </Form.Item>
                <Input
                  className="site-input-split"
                  style={{
                    width: 30,
                    borderLeft: 0,
                    borderRight: 0,
                    pointerEvents: 'none',
                  }}
                  placeholder="~"
                  disabled
                />
                <Form.Item name="max">
                  <Input
                    className="site-input-right"
                    style={{
                      width: 80,
                      textAlign: 'center',
                    }}
                    placeholder="最大值"
                  />
                </Form.Item>
              </Input.Group>
            )}
          </Form.Item>
        </Row>

        <Form.Item label="验证说明：" name="validDesc">
          {fromView ? viewForm.validDesc : <Input placeholder="请输入 " />}
        </Form.Item>
        <Form.Item label="输入模式：" name="inputMode">
          {fromView ? (
            viewForm.inputMode
          ) : (
            <Select defaultValue="请选择" style={{ width: 160 }} allowClear>
              <Option value="one">滑动条+输入框</Option>
              <Option value="two">滑动条</Option>
              <Option value="three">输入框</Option>
            </Select>
          )}
        </Form.Item>
      </>
    );
  }
}

export default numericalInput;

//--------------------------
