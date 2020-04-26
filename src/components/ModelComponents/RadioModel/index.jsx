// 单选框
import React from 'react';
import { Select, Descriptions } from 'antd';

const { Option } = Select;

class Classify extends React.Component {
  state = {
    selectValue: '',
  };

  /**
   * 值的获取
   * @param {string} value 当前元素的值
   */
  handleChange = value => {
    this.setState({
      selectValue: value,
    });
    this.props.getData(value);
  };

  render() {
    return (
      <Descriptions layout="vertical">
        <Descriptions.Item label="物种分类数据库（必填）">
          <Select
            placeholder="请选择"
            style={{ width: '150px' }}
            onChange={e => this.handleChange(e, 'select')}
            allowClear
          >
            <Option value="one">滑动条+输入框</Option>
            <Option value="two">滑动条</Option>
            <Option value="three">输入框</Option>
          </Select>
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

export default Classify;
