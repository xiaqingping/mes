import { Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Customer from './Customer';
import Supplier from './Supplier';


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
    tabActiveKey: 'customer',
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
    this.setState({
      tabActiveKey,
    });
  };

  title = () => (
      <div>
        <span>查看 123</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <a title="编辑"><Icon type="edit" style={{ color: 'black' }} /></a>
      </div>
    )

  render() {
    const { tabActiveKey } = this.state;
    const contentList = {
      customer: (
        <Customer type={tabActiveKey} />
      ),
      supplier: (
        <Supplier type={tabActiveKey} />
      ),
    };
    return (
      <PageHeaderWrapper
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        title={this.title()}
        style={{ paddingBottom: '0px' }}
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
      </PageHeaderWrapper>
    );
  }
}

export default CustomerDetails;
