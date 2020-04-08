import React from 'react';
import { Input, Form } from 'antd';


/**
 * 判断类型
 * @param {String} type
 */
const ModelType = props => {
  const { data } = props;
  if (data.type === 'txtShuRuKuang') return <InputModel data={data}/>
  if (data.type === 'input') return <InputModel data={data}/>
  return '';
}

/**
 * 单行输入框
 * @param {String} paramName 参数名称
 * @param {String} paramKey 参数Key
 * @param {boolean} isRequired 是否必填
 * @param {String} placeholder 请输入
 * @param {String} defaultValue 默认值
 * @param {String} validRules 验证规则
 * @param {String} validDesc 验证说明
 */
const InputModel = props => {
  const { data } = props;
  return (
    <Form.Item
      label={data.paramName}
      name={data.paramKey}
      rules={[
        { required: !!data.isRequired, pattern: data.validRules || '', message: data.validDesc },
      ]}
    >
      <Input
        placeholder={data.placeholder}
        defaultValue={data.paramValue ? data.paramValue: data.defaultValue}
      />
    </Form.Item>
  );
}

export { ModelType, InputModel };
