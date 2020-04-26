// 单选框
import React from 'react';
import { Select, InputNumber } from 'antd';

const { Option } = Select;

class Radio extends React.Component {
  // state = {
  //   inputValue: 0,
  // };
  // handleChange= () =>{
  //   this.setState({selectValue:e.target.value});
  // }

  render() {
    return (
      <>
        <div>
          <div>物种分类数据库（必填）</div>
          <Select
            defaultValue="请选择"
            style={{ width: 120 }}
            onChange={this.handleChange}
            allowClear
          >
            <Option value="one">滑动条+输入框</Option>
            <Option value="two">滑动条</Option>
            <Option value="three">输入框</Option>
          </Select>
          <InputNumber
            min={0}
            max={1}
            style={{ margin: '0 16px' }}
            step={0.01}
            onChange={this.onChange}
          />
          范围（0-1）
        </div>
      </>
    );
  }
}

export default Radio;
