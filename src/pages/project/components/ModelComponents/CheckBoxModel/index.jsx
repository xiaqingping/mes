import React from 'react';
import { Checkbox, Form } from 'antd';

/**
 * 多选
 * @param {String} paramName 参数名称
 * @param {String} paramKey 参数Key
 * @param {boolean} isRequired 是否必填
 * @param {String} defaultValue 默认值
 */
class CheckBoxModel extends React.Component {
  constructor(props) {
    super(props);
    let values;
    if (props.paramList.paramValue) values = JSON.parse(props.paramList.paramValue);
    values = [];
    this.state = {
      paramList: props.paramList,
      selectList: [],
      checkedValues: values,
    };
  }

  /** 组件加载时 */
  componentDidMount = () => {
    this.formatGetData();
  };

  /**
   * 格式化提交数据
   * @param {Array} checkedValues checkBox选中数据
   */
  formatSubmitData = checkedValues => {
    const { paramList } = this.state;
    // 验证数据
    const errorData = this.verifyData(checkedValues);
    const { error } = errorData;

    const paramData = {
      paramKey: paramList.paramKey,
      paramValue: error ? '' : JSON.stringify(checkedValues),
      taskModelId: paramList.taskModelId,
    };
    const isVerify = !error;
    const { message } = errorData;
    this.props.getData(paramData, 'checkBox', isVerify, message);
    return false;
  };

  /** 处理获取到的数据 */
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
    // 解析参数值
    let checkedValues = [];
    if (paramList.paramValue) checkedValues = JSON.parse(paramList.paramValue);
    this.setState({ selectList, checkedValues });
  };

  /**
   * 验证数据
   * @param {Array} checkedValues checkBox选中数据
   */
  verifyData = checkedValues => {
    const { paramList } = this.state;
    let error = false;
    let message = '';
    if (paramList.isRequired === 'true') {
      if (checkedValues.length === 0) {
        error = true;
        message = `${paramList.paramName}参数不能为空`;
      }
    }
    const data = { error, message };
    return data;
  };

  /**
   * 获取选中项
   * @param {Array} checkedValues checkBox选中数据
   */
  onChange = checkedValues => {
    this.setState({
      checkedValues,
    });
    this.formatSubmitData(checkedValues);
  };

  render() {
    const { paramList, checkedValues, selectList } = this.state;
    const data = paramList;

    return (
      <Form.Item
        label={data.paramName}
        rules={[
          {
            required: data.isRequired,
            message: data.validDesc || '',
          },
        ]}
      >
        <Checkbox.Group
          options={selectList}
          value={checkedValues}
          disabled={this.props.disabled}
          onChange={this.onChange}
        />
      </Form.Item>
    );
  }
}

export default CheckBoxModel;
