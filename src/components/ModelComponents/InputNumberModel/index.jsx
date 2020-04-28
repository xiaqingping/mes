/**
 * @module 数值输入框
 * @param {String} paramName 参数名称
 * @param {String} paramKey 参数Key
 * @param {boolean} isRequired 是否必填
 * @param {String} placeholder 请输入
 * @param {String} defaultValue 默认值
 * @param {String} validRules 验证规则
 * @param {String} validDesc 验证说明
 */

import React from 'react';
import { Slider, InputNumber, message } from 'antd';

class NumberModels extends React.Component {
  constructor(props) {
    super(props);
    // 处理paramValue
    const paramValue = this.setParamValue(props)
    this.state = {
      paramList: props.paramList,
      inputValue: paramValue,
    };
  }

  componentDidMount() {}

  componentDidUpdate(props) {
    // 监听是否提交
    if (props.submitStatus !== this.props.submitStatus) {
      const data = this.formatSubmitData();
      console.log(data)
      // if (data !== undefined && data.length > 0) this.props.getData(data, 'number_input');
    }
  }

  /**
   * 检查ParamValue
   * @param {object}
   * @return {string} paramValue
   */
  setParamValue = value => {
    let {paramValue} = value.paramList
    if(typeof paramValue !== 'number' || parseFloat(paramValue) > 1 || parseFloat(paramValue) < 1) {
      paramValue = 0
    }
    return paramValue
  }

  /**
   * 提交数据验证
   * @return {object} data 组件返回的数据
   */
  formatSubmitData = () => {
    // 获取校验结果
    const error = this.verifyData();
    if (error) return false;
    const { paramList, inputValue } = this.state;
    const data = {
      paramValue: inputValue,
      paramKey: paramList.paramKey,
      taskModelId: paramList.taskModelId,
    };
    return data;
  };

  /**
   * 验证数据
   */
  verifyData = () => {
    const { paramList, inputValue } = this.state;
    let error = false;
    if (paramList.isrequired === 'true') {
      if (parseFloat(inputValue) <= 0 || parseFloat(inputValue) > 1 || inputValue === undefined) {
        message.warning(`${paramList.paramName}`);
        error = true;
      }
    }
    return error;
  };

  //
  /**
   * 获取数据 获取保存更改值
   * @param {String}
   */
  onChange = value => {
    this.setState({
      inputValue: value,
    });
  };


  render() {
    const { paramList, inputValue } = this.state;
    const { disabled } = this.props;
    return (
      <>
        <div>序列相似度（选填）</div>
        {/* 组件InputNumber */}
        <div>
          <Slider
            disabled={disabled}
            min={0}
            max={1}
            onChange={this.onChange}
            value={inputValue}
            defaultValue={inputValue || paramList.defaultValue}
            step={0.01}
            style={{ width: '200px', float: 'left' }}
          />
          <InputNumber
            disabled={disabled}
            min={0}
            max={1}
            style={{ margin: '0 20px' }}
            step={0.01}
            value={inputValue}
            // defaultValue={inputValue || data.defaultValue}
            onChange={this.onChange}
          />
          范围（0-1）
        </div>
      </>
    );
  }
}

export default NumberModels;
