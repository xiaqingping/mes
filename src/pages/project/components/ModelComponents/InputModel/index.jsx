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
    console.log(props)
    this.state = {
      paramList: props.paramList,
      inputValue: props.paramList.paramValue || '',
    };
  }

  componentDidMount() {}

  // 实时获取数据 回传给父组件
  onBlur = e => {
    this.formatSubmitData(e.target.value);
  };

  // 格式化提交数据
  formatSubmitData = value => {
    const error = this.verifyData(value);
    if (error) return false;
    const { paramList } = this.state;
    const data = {
      paramData: {
        paramKey: paramList.paramKey,
        paramValue: value,
        taskModelId: paramList.taskModelId,
      },
      isVerify: true,
    };
    this.props.getData(data.paramData, 'input', data.isVerify);
    return false;
  };

  // 验证数据
  verifyData = value => {
    const { paramName, defaultValue, validDesc, isrequired } = this.state.paramList;
    let error = false;
    if (isrequired === 'true') {
      if (!value) {
        if (!defaultValue) {
          if (validDesc) {
            message.warning(validDesc);
          } else {
            message.warning(`${paramName}不能为空`);
          }
          error = true;
        }
      }
    }
    if (!value) error = true;
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
          onBlur={event => this.onBlur(event)}
        />
      </Form.Item>
    );
  }
}

export default InputModel;
