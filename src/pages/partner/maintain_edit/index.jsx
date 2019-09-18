import {
  Form,
  Card,
  Button,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FooterToolbar from '@/components/FooterToolbar';

import BasicInfo from './components/BasicInfo';
import SalesScope from './components/SalesScope';
import Credit from './components/Credit';
import Authentication from './components/Authentication';
import Address from './components/Address';
import Type1 from './components/Type1';
import Bank from './components/Bank';

@connect(({ listTableList, loading }) => ({
  listTableList,
  loading: loading.models.rule,
}))
class CustomerEdit extends Component {
  state = {
    width: '100%',
    tabActiveKey: 'customer',
    details: {
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
          name: 'name',
          telephone: '18735818888',
          postcode: '123456',
          address: '上海市松江区香闵路698号',
        },
      ],
    },
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

  onTabChange = tabActiveKey => {
    const { dispatch } = this.props;
    this.setState({
      tabActiveKey,
    });

    dispatch({
      type: 'partner_maintain/setDetails',
      payload: {
        title: '1',
      },
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
  renderCustomer = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { details: { addressList, basicInfo } } = this.state;

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
        <Card title="收货地址" bordered={false} style={{ paddingBottom: '50px' }}>
          {getFieldDecorator('addressList', {
            initialValue: { data: addressList },
          })(<Address />)}
        </Card>
      </>
    );
  }

  // 供应商
  renderSupplier = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { details: { basicInfo } } = this.state;
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

  render() {
    const { width, tabActiveKey } = this.state;
    const contentList = {
      customer: this.renderCustomer(),
      supplier: this.renderSupplier(),
    };

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
        {contentList[tabActiveKey]}
        <FooterToolbar style={{ width }}>
          <Button>取消</Button>
          <Button type="primary" onClick={this.validate}>提交</Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CustomerEdit);
