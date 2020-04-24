// 数值输入框
import React from 'react';
import { Slider, InputNumber } from 'antd';

class NumberModels extends React.Component {
  state = {
    inputValue: 0,
  };

  componentDidMount() {}

  onChange = value => {
    const values = value;
    console.log(values);
    this.setState({
      inputValue: value,
    });
    this.props.getData(values);
  };

  render() {
    const { inputValue } = this.state;
    return (
      <>
        <div>序列相似度（选填）</div>
        <div>
          <Slider
            min={0}
            max={1}
            onChange={this.onChange}
            value={inputValue}
            step={0.01}
            style={{ width: '200px', float: 'left' }}
          />
          <InputNumber
            min={0}
            max={1}
            style={{ margin: '0 16px' }}
            step={0.01}
            value={inputValue}
            onChange={this.onChange}
          />
          范围（0-1）
        </div>
      </>
    );
  }
}

export default NumberModels;
