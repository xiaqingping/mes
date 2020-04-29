// 单选框
import React from 'react';
import { Select, Descriptions } from 'antd';

const { Option } = Select;

class radioModel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      paramList: props.paramList,
    };
  }

  setSelectValue = paramList => {
    const selectList = []
    Object.keys(paramList).forEach(key => {
      if (key.indexOf('select_') !== -1) {
        selectList.push(
          {
            "key": key,
            "value": paramList[key]
          }
        )
      }
    })
    return selectList
  }

  /**
   * 值的获取
   * @param {string} value 当前元素的值
   */
  handleChange = value => {
    const { paramList } = this.state;
    const data = {
      paramKey: paramList.paramKey,
      paramValue: value,
      taskModelId: paramList.taskModelId,
    }
    this.props.getData(data, 'radio', true);
  };

  render() {
    const { paramList } = this.state
    const selectList = this.setSelectValue(paramList)
    return (
      <Descriptions layout="vertical">
        <Descriptions.Item label={paramList.paramName}>
          <Select
            placeholder="请选择"
            style={{ width: '150px' }}
            onChange={e => this.handleChange(e, 'select')}
            allowClear
            defaultValue={paramList.defaultValue}
          >
            {
              selectList.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
            }
          </Select>
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

export default radioModel;
