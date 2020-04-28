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
import PropTypes from 'prop-types';
import { Slider, InputNumber, message } from 'antd';

class NumberModels extends React.Component {
  constructor(props) {
    super(props);
    // 处理paramValue
    const paramValue = this.setParamValue()
    this.state = {
      paramList: props.paramList,
      inputValue: paramValue,
      max: props.paramList.maxNum || 1,
      min: props.paramList.minNum || 0,
    };
  }


  /**
   * 检查ParamValue
   * @param {object}
   */
  setParamValue = () => {
    const { paramList } = this.props
    const maxNum = paramList.max || 1
    const minNum = paramList.min || 0
    if (typeof paramValue !== 'number'
      || parseFloat(paramList.paramValue) > minNum
      || parseFloat(paramList.paramValue) < maxNum) {
      return 0
    }
    return paramList.paramValue
  }

  /**
   * 提交数据验证
   * @return {object} data 组件返回的数据
   */
  formatSubmitData = () => {
    // 获取校验结果
    const isVerify = this.verifyData();
    // if (isVerify) return false;
    const { paramList, inputValue } = this.state;
    const data = {
      paramKey: paramList.paramKey,
      paramValue: inputValue,
      taskModelId: paramList.taskModelId,
    };
    return { data, isVerify };
  };

  /**
   * 验证数据
   */
  verifyData = () => {
    const { max, min, inputValue } = this.state;
    console.log(max, min)
    if (parseFloat(inputValue) <= max && parseFloat(inputValue) >= min) {
      return true
    }
    message.warning(`值不合法`);
    return false
  };

  //
  /**
   * 获取数据 获取保存更改值
   * @param {String}
   */
  onChange = async value => {
    if(!parseFloat(value)) return
    await this.setState({
      inputValue: value,
    });
    const { data, isVerify } = this.formatSubmitData();
    console.log(data, isVerify)
    this.props.getData(data, 'number_input', isVerify)
  };


  render() {
    const { paramList, inputValue, max, min } = this.state;
    const { disabled, inputPattern } = this.props;
    return (
      <>
        <div>序列相似度（选填）</div>
        {/* 组件InputNumber */}
        <div>
          {inputPattern !== 3 ? (
            <Slider
              disabled={disabled}
              min={min}
              max={max}
              onChange={this.onChange}
              value={inputValue}
              defaultValue={inputValue || paramList.defaultValue}
              step={0.01}
              style={{ width: '200px', float: 'left' }}
            />
          ) : null}
          {inputPattern !== 2 ? (
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
          ) : null}
          范围（{min}-{max}）
        </div>
      </>
    );
  }
}

NumberModels.defaultProps = {
  paramList: {},
  disabled: false
};
NumberModels.propTypes = {
  paramList: PropTypes.object,
  disabled: PropTypes.bool
};

export default NumberModels;
