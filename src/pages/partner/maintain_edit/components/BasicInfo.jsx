import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
} from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { isEqual } from 'lodash';
import { EmailInput, NameInput, MobileTelephoneInput, TelphoneInput, FoxInput, AddressInput } from '@/components/CustomizedFormControls';

import styles from '../style.less';

console.log(styles);

const FormItem = Form.Item;
const { Option } = Select;

class BasicInfo extends PureComponent {
  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }

    return {
      ...nextProps.value,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      ...props.value,
    };
  }

  checkNameInput = (rule, value, callback) => {
    if (value.name) {
      callback();
      return;
    }
    callback(formatMessage({ id: 'partner.maintain.requireName' }));
  };

  valueChange = (key, value) => {
    if (!('value' in this.props)) {
      this.setState({ [key]: value });
    }
    this.triggerChange({ [key]: value });
  }

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        //
      }
    });
  }

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      const basicInfo = {
        ...this.state,
        ...changedValue,
      };
      onChange(basicInfo);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { name, email } = this.state;

    return (
      <Form layout="vertical" className={styles['sangon-form']}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{ validator: this.checkNameInput }],
              })(<NameInput />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile')(<MobileTelephoneInput />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                initialValue: { email },
              })(<EmailInput />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="电话">
              {getFieldDecorator('tel')(<TelphoneInput />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="传真">
              {getFieldDecorator('chuanzhen')(<FoxInput />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="邮政编码">
              {getFieldDecorator('youbian')(<Input />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="时区">
              {getFieldDecorator('shiqu')(<Input />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="语言">
              {getFieldDecorator('yuyan')(
                <Select>
                  <Option value="1">中文</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="特殊行业类别">
              {getFieldDecorator('hangye')(<Input />)}
            </FormItem>
          </Col>
          <Col md={15} sm={24}>
            <FormItem label="通讯地址">
              {getFieldDecorator('address1')(<AddressInput />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="销售冻结">
              {getFieldDecorator('dongjie', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(BasicInfo);
