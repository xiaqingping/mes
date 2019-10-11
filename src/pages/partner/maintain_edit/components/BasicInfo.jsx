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
import { EmailInput, NameInput, MobileTelephoneInput, TelphoneInput, FaxInput, AddressInput } from '@/components/CustomizedFormControls';

import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;

class BasicInfo extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
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

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      console.log(values);
      if (!error) {
        //
      }
    });
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

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { name, email } = this.state;
    const MobileDisabled = name && name.type === 2;

    return (
      <Form layout="vertical" className={styles.sangonForm}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{ validator: this.checkNameInput }],
              })(<NameInput onChange={value => this.valueChange('name', value)} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile', {
                initialValue: { disabled: MobileDisabled },
              })(<MobileTelephoneInput onChange={value => this.valueChange('mobile', value)} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                initialValue: { email },
              })(<EmailInput onChange={value => this.valueChange('email', value)} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="电话">
              {getFieldDecorator('tel')(<TelphoneInput onChange={value => this.valueChange('tel', value)} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="传真">
              {getFieldDecorator('fax')(<FaxInput onChange={value => this.valueChange('fax', value)} />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="邮政编码">
              {getFieldDecorator('postCode')(<Input onChange={e => this.valueChange('postCode', e.target.value)} />)}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem label="时区">
              {getFieldDecorator('timeZoneCode')(<Input onChange={e => this.valueChange('timeZoneCode', e.target.value)} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="语言">
              {getFieldDecorator('languageCode')(
                <Select onChange={value => this.valueChange('languageCode', value)} >
                  <Option value="1">中文</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={12}>
            <FormItem label="特殊行业类别">
              {getFieldDecorator('industryCode')(
                <Select onChange={value => this.valueChange('industryCode', value)} >
                  <Option value="1">军队</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={18} sm={24}>
            <FormItem label="通讯地址">
              {getFieldDecorator('address')(<AddressInput onChange={value => this.valueChange('address', value)} />)}
            </FormItem>
          </Col>
          <Col md={6} sm={6}>
            <FormItem label="销售冻结">
              {getFieldDecorator('salesBan', { valuePropName: 'checked' })(<Switch onChange={value => this.valueChange('salesBan', value)} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(BasicInfo);
