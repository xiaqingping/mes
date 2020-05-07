/**
 * 单选框
 * @module 单选框
 * @param {object} paramList 基础数据
 * @param {String} paramName 参数名称
 * @param {String} paramKey 参数Key
 * @param {boolean} isRequired 是否必填
 * @param {String} placeholder 请输入
 * @param {String} paramValue 默认值
 */
import React from 'react';
import { Select, Descriptions, message } from 'antd';

const { Option } = Select;

class radioModel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 基础数据list
      paramList: props.paramList,
    }
  }

  /**
   * 设置单选下拉列表值value
   * @param {object} paramList 下拉框value
   */
  setSelectValue = paramList => {
    const selectList = []
    Object.keys(paramList).forEach(key => {
      if (key.indexOf('select_') !== -1) {
        selectList.push(JSON.parse(paramList[key]))
      }
    })
    return selectList
  }


  /**
   * 值的获取, 处理抛出结果
   * @param {string} value 当前元素的值
   */
  handleChange = value => {
    const { paramList } = this.state
    const data = {
      paramKey: paramList.paramKey,
      paramValue: value,
      taskModelId: paramList.taskModelId,
    }
    const verify = this.verifyData(value)
    if (!verify) return
    this.props.getData(data, 'radio', verify);
  }

  /**
   * 验证数据
   * @param {object} 待验证数据
   */
  verifyData = value => {
    const { paramList } = this.state;
    let verify = true
    if (paramList.isRequired === 'true') {
      if (value.length === 0) {
        message.warning(`${paramList.paramName}参数不能为空`);
        verify = true;
      }
      verify = false
    }
    return verify
  }

  /**
   * 设置Itemlabel状态拼接
   * @param {string} value label
   */
  setLabel = value => {
    const str = JSON.parse(this.state.paramList.isRequired) ? '（必填）' : '（选填）'
    return value + str
  }


  render() {
    const { paramList } = this.state
    const { disabled } = this.props

    // 获取Select数据
    const selectList = this.setSelectValue(paramList)
    return (
      <Descriptions layout="vertical">
        <Descriptions.Item label={this.setLabel(paramList.paramName)}>
          <Select
            disabled={disabled}
            placeholder="请选择"
            style={{ width: '150px' }}
            onChange={e => this.handleChange(e, 'select')}
            allowClear
            defaultValue={this.state.paramList.paramValue}
          >
            {
              selectList.map(item =>
                <Option key={item.selectKey} value={item.selectValue}>{item.selectValue}</Option>
              )
            }
          </Select>
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

export default radioModel
