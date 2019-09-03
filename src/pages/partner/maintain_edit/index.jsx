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
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';
import BasicInfo from './components/BasicInfo';
import Type from './components/Type';
import Credit from './components/Credit';
import Authentication from './components/Authentication';
import Bank from './components/Bank';
import Address from './components/Address';

@connect(
  ({
    listTableList,
    loading,
  }) => ({
    listTableList,
    loading: loading.models.rule,
  }),
)
class CustomerDetails extends Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  render() {
    const { width } = this.state;
    return (
      <PageHeaderWrapper
        title="修改 100001"
      >
        <BasicInfo></BasicInfo>
        <Type></Type>
        <Credit></Credit>
        <Authentication></Authentication>
        <Bank></Bank>
        <Address></Address>
        <FooterToolbar style={{ width }}>
          {/* {this.getErrorInfo()} */}
          <Button>取消</Button>
          <Button type="primary">提交</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerDetails;
