import React from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Popconfirm,
  Select,
  DatePicker,
  Badge,
} from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * input封装
 * @param {String} languageCode 语言
 * @param {String} label label的名称
 * @param {String} name  组件的名称
 * @param {String} placeholder 提示语
 */
const InputUI = props => {
  const { languageCode, label, name, placeholder } = props;
  return (
    <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
      <FormItem label={label} name={name}>
        <Input placeholder={placeholder} />
      </FormItem>
    </Col>
  );
};

/**
 * select的封装
 * @param {String} languageCode 语言
 * @param {String} label label的名称
 * @param {String} name  组件的名称
 * @param {Array} data option里需要的数据
 */
const SelectUI = props => {
  const { languageCode, label, name, data } = props;
  return (
    <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
      <FormItem label={label} name={name}>
        <Select>
          {data.map(item => (
            <Option key={item.key ? item.key : item.value} value={item.value}>
              {item.data}
            </Option>
          ))}
        </Select>
      </FormItem>
    </Col>
  );
};

/**
 * input封装
 * @param {String} languageCode 语言
 * @param {String} label label的名称
 * @param {String} name  组件的名称
 * @param {String} placeholder 提示语
 */
const DataUI = props => {
  const { languageCode, label, name, placeholder } = props;
  return (
    <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
      <FormItem label={label} name={name}>
        <RangePicker placeholder={placeholder} style={{ width: '100%' }} />
      </FormItem>
    </Col>
  );
};

export { InputUI, SelectUI, DataUI };
