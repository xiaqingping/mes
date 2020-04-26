import React from 'react';
import { Input, Form, message } from 'antd';

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
class InputModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  // componentDidUpdate(props) {
  //   if (props.sbm !== this.props.sbm) {
  //     this.props.getData('testData', '1');
  //   }
  // }

  // 判断是否可为空
  onChange = e => {
    const { data } = this.state;
    if (e.target.value === '') {
      if (data.isrequired === 'true') {
        message.warning(`${data.paramName}参数值不能为空`);
        const { paramKey } = data;
        if (data.defaultValue === undefined) data.defaultValue = '';
        e.target.setValue({ [paramKey]: data.paramValue || data.defaultValue });
      }
    }
  };

  render() {
    const { data } = this.state;

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
          defaultValue={data.paramValue ? data.paramValue : data.defaultValue}
          onChange={event => this.onChange(event)}
          // ref={input => setInput(input)}
        />
      </Form.Item>
    );
  }
}

export default InputModel;
