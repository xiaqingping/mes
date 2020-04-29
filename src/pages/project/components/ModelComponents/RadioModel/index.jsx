/**
 * 单选框
 * @param {String} paramName 参数名称
 * @param {String} paramKey 参数Key
 * @param {boolean} isRequired 是否必填
 * @param {String} placeholder 请输入
 * @param {String} paramValue 默认值
 */
import React from 'react';
import { Select, Descriptions } from 'antd';

const { Option } = Select;

class radioModel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      paramList: props.paramList,
    }
  }

  /**
   * 设置单选下拉列表值
   * @param {object}
   * @param {object}
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
   * @param {string} 当前元素的值
   */
  handleChange = value => {
    const { paramList } = this.state
    const data = {
      paramKey: paramList.paramKey,
      paramValue: value,
      taskModelId: paramList.taskModelId,
    }
    this.props.getData(data, 'radio', true);
  }

  setLabel = value => {
    const str = this.state.paramList.isRequired ? '（必填）' : '（选填）'
    return value + str
  }

  render() {
    const { paramList } = this.state
    // 获取Select数据
    const selectList = this.setSelectValue(paramList)
    return (
      <Descriptions layout="vertical">
        <Descriptions.Item label={this.setLabel(paramList.paramName)}>
          <Select
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
