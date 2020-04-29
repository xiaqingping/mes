// 数值输入框
import React from 'react';
import { Slider, InputNumber } from 'antd';

class NumberModels extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      inputValue: 0,
      // paramKey: props.paramList.paramKey
    };
  }

  componentDidMount() {}

  // 监听是否提交
  componentDidUpdate(props) {
    if (props.submitStatus !== this.props.submitStatus) {
      const data = this.formatSubmitData();
      // if (data !== undefined && data.length > 0) this.props.getData(data, 'inputNumber');
    }
  }

  // 提交数据验证
  formatSubmitData = () => {
    const { inputValue } = this.state;
  };

  // 获取数据
  onChange = value => {
    this.setState({
      inputValue: value,
    });
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
            style={{ margin: '0 20px' }}
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
