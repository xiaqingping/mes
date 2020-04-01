import React from 'react';
import { Input, Form } from 'antd';

/**
 * 单行输入框
 * @param {String} label 参数描述
 * @param {String} name 参数名称
 * @param {boolean} isRequired 是否必填
 * @param {String} placeholder 请输入
 * @param {String} defaultValue 默认值
 * @param {String} validRules 验证规则
 * @param {String} validDesc 验证说明
 */
const InputModel = props => (
  <Form.Item
    label={props.label}
    name={props.name}
    rules={[
      { required: !!props.isRequired, pattern: props.validRules || '', message: props.validDesc },
    ]}
  >
    <Input placeholder={props.placeholder} defaultValue={props.defaultValue} />
  </Form.Item>
);
export { InputModel };
