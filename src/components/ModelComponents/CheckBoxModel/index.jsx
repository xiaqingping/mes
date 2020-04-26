import React from 'react';
import { Checkbox, Form } from 'antd';

class CheckBoxModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: props.data,
    };
  }

  onChange = checkedValues => {
    console.log('checked = ', checkedValues);
  };

  render() {
    // const { data } = this.state;
    const data = {
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' },
        { label: '123', value: '123' },
        { label: '名称', value: 'name' },
      ],
      paramName: '多选框',
      paramKey: 'checkBox',
      required: false,
      defaultValue: 'Apple',
      value: 'Pear',
    };

    return (
      <Form.Item
        label={data.paramName}
        name={data.paramKey}
        rules={[
          {
            required: !!data.isRequired,
            pattern: data.validRules || '',
            message: data.validDesc || '',
          },
        ]}
      >
        <Checkbox.Group
          options={data.options}
          defaultValue={data.defaultValue}
          value={data.value}
          onChange={this.onChange}
        />
      </Form.Item>
    );
  }
}

export default CheckBoxModel;
