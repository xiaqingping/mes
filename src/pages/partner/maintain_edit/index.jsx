import {
  Form,
  Card,
  Button,
} from 'antd';
import React, { Component } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';

import BasicInfo from './components/BasicInfo';
import SalesScope from './components/SalesScope';
import Credit from './components/Credit';
import Authentication from './components/Authentication';
import Address from './components/Address';
import Type1 from './components/Type1';
import Bank from './components/Bank';

class CustomerEdit extends Component {
  state = {
    width: '100%',
    tabActiveKey: 'customer',
    details: {},
  };

  componentDidMount() {
    const details = {
      basicInfo: {
        name: {
          select: 1,
          name: '',
        },
        email: '123@qq.com',
      },
      addressList: [
        {
          id: 1,
          name: 'name',
          telephone: '18735818888',
          postcode: '123456',
          address: '上海市松江区香闵路698号',
        },
        {
          id: 2,
          name: 'name2',
          telephone: '18735818888',
          postcode: '123456',
          address: '上海市松江区香闵路698号',
        },
      ],
    };
    this.setState({ details });
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

  onTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    // 验证表单
    // console.log(this.form.validate());

    validateFieldsAndScroll((error, values) => {
      console.log(values);
      if (!error) {
        //
      }
    });
  }

  // 客户
  renderCustomer = details => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { basicInfo, addressList } = details;

    return (
      <>
        <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
          {getFieldDecorator('basicInfo', {
            initialValue: basicInfo,
          // eslint-disable-next-line no-return-assign
          })(<BasicInfo wrappedComponentRef={form => this.form = form} />)}
        </Card>
        <SalesScope></SalesScope>
        <Credit></Credit>
        <Authentication></Authentication>
        <Card title="收货地址" bordered={false}>
          {getFieldDecorator('addressList', {
            initialValue: { data: addressList },
          })(<Address />)}
        </Card>
      </>
    );
  }

  // 供应商
  renderSupplier = details => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { basicInfo } = details;
    return (
      <>
        <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
          {getFieldDecorator('basicInfo', {
            initialValue: basicInfo,
          // eslint-disable-next-line no-return-assign
          })(<BasicInfo wrappedComponentRef={form => this.form = form} />)}
        </Card>
        <Type1></Type1>
        <Bank></Bank>
      </>
    );
  }

  renderContent = () => {
    const { tabActiveKey, details } = this.state;

    switch (tabActiveKey) {
      case 'customer':
         return this.renderCustomer(details);

      case 'supplier':
        return this.renderSupplier(details);

      default:
          break;
    }

    return null;
  }

  render() {
    const { width, tabActiveKey } = this.state;

    return (
      <PageHeaderWrapper
        title="修改 100001"
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        style={{ paddingBottom: 0 }}
        tabList={[
          {
            key: 'customer',
            tab: '客户',
          },
          {
            key: 'supplier',
            tab: '供应商',
          },
        ]}
      >
        <div style={{ paddingBottom: 50 }}>
          {this.renderContent()}
        </div>
        <FooterToolbar style={{ width }}>
          <Button>取消</Button>
          <Button type="primary" onClick={this.validate}>提交</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CustomerEdit);
