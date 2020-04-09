import React from 'react';
import { Input, Form, message } from 'antd';


/**
 * 判断类型
 * @param {String} type 参数类型
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

  // 判断是否可为空
  const onChange = e => {
    console.log(e.target.value);
    if (e.target.value === '') {
      if(data.isrequired === 1) {
        message.warning(`${data.paramName}参数值不能为空`);
        const { paramKey } = data;
        e.target.setValue({ [paramKey]: data.paramValue || data.defaultValue });
      }
    }

  }
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
        onChange={event => onChange(event)}
      />
    </Form.Item>
  );
}

export { ModelType, InputModel };
