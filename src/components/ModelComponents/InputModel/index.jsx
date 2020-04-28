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
      paramList: props.paramList,
      inputValue: props.paramList.paramValue || '',
    };
  }

  // 监听提交状态
  componentDidUpdate(props) {
    if (props.submitStatus !== this.props.submitStatus) {
      const data = this.formatSubmitData();
      this.props.getData(data, 'input');
    }
  }

  // 提交数据格式化
  formatSubmitData = () => {
    const error = this.verifyData();
    if (error) return false;
    const { paramList, inputValue } = this.state;
    const data = {
      paramKey: paramList.paramKey,
      paramValue: inputValue,
      taskModelId: paramList.taskModelId,
    };
    return data;
  };

  // 获取数据
  onChange = e => {
    const { paramKey, paramValue, defaultValue } = this.state.paramList;
    let error;
    if (e.target.value === '') {
      error = this.verifyData();
      if (error) {
        if (defaultValue === undefined || paramValue === undefined) return false;
        e.target.setValue({ [paramKey]: paramValue || defaultValue });
      }
    }
    if (!error) this.setState({ inputValue: e.target.value });
    return false;
  };

  // 验证数据
  verifyData = () => {
    const { paramList, inputValue } = this.state;
    let error = false;
    if (paramList.isrequired === 'true') {
      if (inputValue === '' || inputValue === undefined) {
        message.warning(`${paramList.paramName}`);
        error = true;
      }
    }
    return error;
  };

  render() {
    const { paramList, inputValue } = this.state;
    const data = paramList;
    return (
      <Form.Item
        label={data.paramName}
        name={data.paramKey}
        rules={[
          // { required: data.isRequired, pattern: data.validRules || '', message: data.validDesc },
          { required: data.isRequired, message: data.validDesc },
        ]}
      >

        <Input
          placeholder={data.placeholder}
          disabled={this.props.disabled}
          defaultValue={inputValue || data.defaultValue}
          onChange={event => this.onChange(event)}
        />
      </Form.Item>
    );
  }
}

export default InputModel;
