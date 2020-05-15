import React from 'react';
import { Input, Form } from 'antd';

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

  /**
   * 实时获取数据 回传给父组件
   * @param {object} e 目标对象
   */
  onBlur = e => {
    this.formatSubmitData(e.target.value);
  };

  /**
   * 格式化提交数据
   * @param {Array} value Input值
   */
  formatSubmitData = value => {
    // 验证数据
    const errorData = this.verifyData(value);
    const { error } = errorData;

    const { paramList } = this.state;
    const paramData = {
      paramKey: paramList.paramKey,
      paramValue: error ? '' : value,
      taskModelId: paramList.taskModelId,
    };
    const isVerify = !error;
    const { message } = errorData;
    this.props.getData(paramData, 'input', isVerify, message);
    return false;
  };

  /**
   * 验证数据
   * @param {string} value 验证值
   */
  verifyData = value => {
    const { paramName, defaultValue, validDesc, isRequired } = this.state.paramList;
    let error = false;
    let message = '';
    if (isRequired === 'true') {
      if (!value) {
        if (!defaultValue) {
          if (validDesc) {
            message = validDesc;
          } else {
            message = `${paramName}为必填参数`;
          }
          error = true;
        }
      }
    }
    return { error, message };
  };

  render() {
    const { paramList, inputValue } = this.state;
    const data = paramList;
    return (
      <Form.Item
        label={data.paramName}
        name={data.paramKey}
        rules={[{ required: data.isRequired, message: data.validDesc }]}
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
