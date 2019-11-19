// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable consistent-return */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable array-callback-return */
import {
  Card,
  Descriptions,
  Table,
  Tabs,
  Badge,
  Icon,
  Empty,
} from 'antd';
import React, { Component } from 'react';
import './style.less'
import { connect } from 'dva';


const { TabPane } = Tabs;

const DescriptionsItem = Descriptions.Item;

// 状态
const status = {
  1: {
    value: 'warning',
    text: '验证中',
  },
  2: {
    value: 'success',
    text: '已验证',
  },
  3: {
    value: 'error',
    text: '已拒绝',
  },
};

@connect(({ partnerMaintainEdit, global, basicCache }) => {
  const salesOrganizations = basicCache.salesOrganizations.filter(
    e => e.languageCode === global.languageCode,
  );
   const distributionChannels = basicCache.distributionChannels.filter(
    e => e.languageCode === global.languageCode,
  );
  const regions = basicCache.regions.filter(
    e => e.languageCode === global.languageCode,
  );
  const offices = basicCache.offices.filter(
    e => e.languageCode === global.languageCode,
  );
  return {
    distributionChannels,
    salesOrganizations,
    regions,
    offices,
    details: partnerMaintainEdit.details,
  };
})
// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    noTitleKey: 1,
  }

  columns1 = [
    {
      title: '名称',
      width: 500,
      dataIndex: 'name',
      render(text, record) {
          return <><Icon type={record.type === 2 ? 'home' : 'user'}/> {text}</>
      },
    },
    {
      title: '售达方',
      width: 500,
      dataIndex: 'soldToPartyName',
      render(text, record) {
        return <><Icon type={record.type === 2 ? 'home' : 'user'}/> {text}</>
      },
    },
    {
      title: '状态',
      width: 400,
      dataIndex: 'verifyStatus',
      render(text) {
        return <Badge status={status[text].value} text={status[text].text}/>;
      },
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //       <a>删除</a>
    //     ),
    // },
  ];

  columns2 = [
    {
      title: '名称',
      width: 500,
      dataIndex: 'name',
      render(text, record) {
        return <><Icon type={record.type === 2 ? 'home' : 'user'}/> {text}</>
      },
    },
    {
      title: '状态',
      width: 600,
      dataIndex: 'linkVerifyStatus',
      render(text) {
        return <Badge status={status[text].value} text={status[text].text}/>;
      },
    },
    // {
    //   title: '操作',
    //   render: (text, record) => (
    //       <a>删除</a>
    //     ),
    // },
  ];

  columns3 = [
    {
      title: '名称',
      width: 700,
      dataIndex: 'name',
      render(text, record) {
        return <><Icon type={record.type === 2 ? 'home' : 'user'}/> {text}</>
      },
    },
    {
      title: '状态',
      width: 400,
      dataIndex: 'verifyStatus',
      render(text) {
        return <Badge status={status[text].value} text={status[text].text}/>;
      },
    },
    // {
    //   align: 'center',
    //   title: '操作',
    //   render: (text, record) => (
    //       <a>删除</a>
    //     ),
    // },
  ];

  columns4 = [
    {
      title: '名称',
      width: 1200,
      dataIndex: 'name',
      // render(text, record) {
      //   return <><Icon type={record.type === 1 ? 'home' : 'user'}/> {text}</>
      // },
    },
    // {
    //   align: 'center',
    //   title: '操作',
    //   render: (text, record) => (
    //       <a>变更</a>
    //     ),
    // },
  ];

  componentDidMount () {
    const { dispatch, details } = this.props;
    dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'distributionChannels' },
    });
    dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'salesOrganizations' },
    });
    dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'regions' },
    });
    dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'offices' },
    });
    if (details.customer.salesAreaList.length !== 0) {
      this.setState({
        noTitleKey: details.customer.salesAreaList[0].salesOrganizationCode
        + details.customer.salesAreaList[0].distributionChannelCode,
      })
    }
  }

  // 销售范围TABS
  tabListNoTitle = () => {
    const { details: { customer: { salesAreaList } } } = this.props;
    const data = [];
    salesAreaList.map(item => {
      data.push({
        key: item.salesOrganizationCode + item.distributionChannelCode,
        tab: this.tabName(item.salesOrganizationCode, item.distributionChannelCode),
      })
    })
    return data
  }

  tabName = (salesOrganizationCode, distributionChannelCode) => {
    const { distributionChannels, salesOrganizations } = this.props;
    let firstName = '';
    let lastName = '';
    distributionChannels.map(item => {
      if (item.code === distributionChannelCode) {
        lastName = item.name;
      }
    })
    salesOrganizations.map(item => {
      if (item.code === salesOrganizationCode) {
        firstName = item.name;
      }
    })
    return firstName + lastName
  }

  onTabChange = key => {
    this.setState({
      noTitleKey: key,
    });
  }

  render() {
    const { noTitleKey } = this.state;
    // const { details: { customer: { salesAreaList } } } = this.props;
    const { details: { customer }, regions, offices } = this.props;
    const salesAreaList = customer ? customer.salesAreaList : '';
    return (
      <Card
        title="销售范围"
        className="check-tabs"
        bordered={false}
        style={{ width: '100%', marginBottom: '24px' }}
        tabList={salesAreaList ? this.tabListNoTitle() : ''}
        activeTabKey={noTitleKey.toString()}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {salesAreaList ? salesAreaList.map(item => {
          if (parseInt(item.salesOrganizationCode + item.distributionChannelCode, 10)
           === parseInt(noTitleKey, 10)) {
            return (
              <div key={item.regionCode}>
                <Descriptions
                className="s-descriptions"
                layout="vertical"
                column={5}
                key={item.regionCode}
                style={{ marginBottom: '20px' }}
                >
                  <DescriptionsItem label="网点归属">
                    {regions.map(v => { if (item.regionCode === v.code) return v.name })}/
                    {offices.map(v => { if (item.officeCode === v.code) return v.name })}
                  </DescriptionsItem>
                  <DescriptionsItem label="默认付款方式">{item.defaultPaymentMethodCode}</DescriptionsItem>
                  <DescriptionsItem label="币种">{item.currencyCode}</DescriptionsItem>
                  <DescriptionsItem label="默认开票类型">{item.defaultnvoiceTypeCode}</DescriptionsItem>
                  <DescriptionsItem label="销售冻结">{item.salesOrderBlock === 1 ? <span><Badge status="error"/>冻结</span> : <span><Badge status="success"/>活跃</span>} </DescriptionsItem>
                </Descriptions>
                <div style={{ border: '1px solid #E6E6E6', width: '100%', height: '100%' }}>
                  <Tabs defaultActiveKey="1" className="tabs">
                    <TabPane tab="收票方" key="1">
                      <Table dataSource={item.billToPartyList} columns={this.columns1} size="small" pagination={false} rowKey={(r, i) => (i)}/>
                    </TabPane>
                    <TabPane tab="售达方" key="2">
                    <Table dataSource={item.soldToPartyList} columns={this.columns2} size="small" pagination={false} rowKey={(r, i) => (i)}/>
                    </TabPane>
                    <TabPane tab="送达方" key="3">
                    <Table dataSource={item.shipToPartyList} columns={this.columns3} size="small" pagination={false} rowKey={(r, i) => (i)}/>
                    </TabPane>
                    <TabPane tab="销售员" key="4">
                    <Table dataSource={item.salerList} columns={this.columns4} size="small" pagination={false} rowKey={(r, i) => (i)}/>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            )
          }
        })
        : <Empty />
      }
      </Card>
    );
  }
}

export default BasicInfo;
