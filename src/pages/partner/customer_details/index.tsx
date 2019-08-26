import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BasicInfo from './components/BasicInfo';
import Type from './components/Type';
import Authentication from './components/Authentication';
import Credit from './components/Credit';
import Bank from './components/Bank';
import Address from './components/Address';


// eslint-disable-next-line react/prefer-stateless-function
class CustomerDetails extends Component {
  render() {
    return (
      <PageHeaderWrapper>
        <BasicInfo></BasicInfo>
        <Type></Type>
        <Credit></Credit>
        <Authentication></Authentication>
        <Bank></Bank>
        <Address></Address>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerDetails;
