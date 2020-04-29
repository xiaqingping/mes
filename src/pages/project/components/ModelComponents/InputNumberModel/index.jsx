/**
 * @module 数值输入框
 * @param {String} paramName 参数名称
 * @param {String} paramKey 参数Key
 * @param {boolean} isRequired 是否必填
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
    const { paramList } = props
    this.state = {
      paramList,
      inputValue: paramList.paramValue || 0,
      max: paramList.maxNum || 1,
      min: paramList.minNum || 0,
      inputMode: paramList.inputMode
    }
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
    const { max, min, inputValue, paramList } = this.state;
    console.log(parseFloat(inputValue) <= max && parseFloat(inputValue) >= min)
    if (parseFloat(inputValue) <= max && parseFloat(inputValue) >= min ) return true
    if (paramList.validDesc) {
      message.warning(paramList.validDesc)
    } else {
      message.warning(`值不合法`)
    }
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
    if(!isVerify) return
    this.props.getData(data, 'number_input', isVerify)
  };


  render() {
    const {  inputValue, max, min, inputMode, paramList } = this.state;
    const { disabled } = this.props;
    return (
      <>

        <div>{paramList.paramName} {paramList.isRequired ?
        (<span>（必填）</span>) : (<span>（选填）</span>)}</div>

        {/* 组件InputNumber */}
        <div>
          {inputMode !== 'three' ? (
            <Slider
              disabled={disabled}
              min={min}
              max={max}
              onChange={this.onChange}
              value={inputValue}
              step={0.01}
              style={{ width: '200px', float: 'left' }}
            />
          ) : null}
          {inputMode !== 'two' ? (
            <InputNumber
              disabled={disabled}
              min={0}
              max={1}
              style={{ margin: '0 20px' }}
              step={0.01}
              value={inputValue}
              defaultValue={inputValue}
              onChange={this.onChange}
              onPressEnter={this.onChange}
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
