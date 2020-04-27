import React from 'react';
import { Checkbox, Form, message } from 'antd';

/**
 * 单行输入框
 * @param {String} paramName 参数名称
 * @param {String} paramKey 参数Key
 * @param {boolean} isRequired 是否必填
 * @param {String} defaultValue 默认值
 */
class CheckBoxModel extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      paramList: props.paramList,
      selectList: [],
      checkedValues: [],
      // checkedValues: ['k3'],
    };
  }

  // 组件加载时
  componentDidMount = () => {
    this.formatGetData();
  };

  // 监听是否提交
  componentDidUpdate(props) {
    if (props.submitStatus !== this.props.submitStatus) {
      const data = this.formatSubmitData();
      this.props.getData(data, 'checkBox');
    }
  }

  // 格式化提交数据
  formatSubmitData = () => {
    const error = this.verifyData();
    if (error) return false;
    const { paramList, checkedValues } = this.state;
    const data = {
      paramKey: paramList.paramKey,
      paramValue: checkedValues,
      taskModelId: paramList.taskModelId,
    };
    return data;
  };

  // 处理获取到的数据
  formatGetData = () => {
    const { paramList } = this.state;
    // 取出选项列表
    const selectList = [];
    Object.keys(paramList).forEach(key => {
      if (key.indexOf('select') !== -1) {
        const item = JSON.parse(paramList[key]);
        const newItem = {
          label: item.selectValue,
          value: item.selectKey,
        };
        selectList.push(newItem);
      }
    });
    this.setState({ selectList });
  };

  // 验证数据
  verifyData = () => {
    const { paramList, checkedValues } = this.state;
    let error = false;
    if (paramList.isRequired === 'true') {
      if (checkedValues.length === 0) {
        message.warning(`${paramList.paramName}参数不能为空`);
        error = true;
      }
    }
    return error;
  };

  // 获取选中项
  onChange = checkedValues => {
    this.setState({ checkedValues });
  };

  render() {
    const { paramList, checkedValues, selectList } = this.state;
    const data = paramList;

    // const options = [
    //   { label: 'v1', value: 'k1' },
    //   { label: 'v2', value: 'k2' },
    //   { label: 'v3', value: 'k3' },
    // ];

    return (
      <Form.Item
        label={data.paramName}
        name={data.paramKey}
        rules={[
          {
            required: data.isRequired,
            // pattern: data.validRules || '',
            message: data.validDesc || '',
          },
        ]}
      >
        {/* <Checkbox.Group options={options} defaultValue={['k1']} /> */}
        <Checkbox.Group
          options={selectList}
          defaultValue={checkedValues}
          disabled={this.props.disabled}
          onChange={this.onChange}
        />
      </Form.Item>
    );
  }
}

export default CheckBoxModel;
