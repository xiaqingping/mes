import { Card, Descriptions, Table, Tabs, Badge, Empty } from 'antd';
import React, { Component } from 'react';
import { formatter } from '@/utils/utils';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi/locale';
import './style.less';
import { connect } from 'dva';

const { TabPane } = Tabs;

const DescriptionsItem = Descriptions.Item;

@connect(({ partnerMaintainEdit, global, basicCache, bp }) => {
  const salesOrganizations = basicCache.salesOrganizations.filter(
    e => e.languageCode === global.languageCode,
  );
  const distributionChannels = basicCache.distributionChannels.filter(
    e => e.languageCode === global.languageCode,
  );
  const regions = basicCache.regions.filter(e => e.languageCode === global.languageCode);
  const offices = basicCache.offices.filter(e => e.languageCode === global.languageCode);
  const salesPaymentMethods = basicCache.salesPaymentMethods.filter(
    e => e.languageCode === global.languageCode,
  );
  const currencies = basicCache.currencies.filter(e => e.languageCode === global.languageCode);
  return {
    distributionChannels,
    salesOrganizations,
    regions,
    offices,
    currencies,
    salesPaymentMethods,
    details: partnerMaintainEdit.details,
    SalesOrderBlock: bp.SalesOrderBlock,
    status: bp.VerifyRecordStatus,
    DefaultInvoiceType: bp.DefaultInvoiceType,
    DefaultInvoiceTypeOther: bp.DefaultInvoiceTypeOther,
  };
})
// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    noTitleKey: 1,
  };

  componentDidMount() {
    const { details } = this.props;
    // dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'distributionChannels' },
    // });
    // dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'salesOrganizations' },
    // });
    // dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'regions' },
    // });
    // dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'offices' },
    // });
    // dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'salesPaymentMethods' },
    // });
    // dispatch({
    //   type: 'basicCache/getCache',
    //   payload: { type: 'currencies' },
    // });
    if (details.customer) {
      if (details.customer.salesAreaList.length !== 0) {
        this.setState({
          noTitleKey:
            details.customer.salesAreaList[0].salesOrganizationCode +
            details.customer.salesAreaList[0].distributionChannelCode,
        });
      }
    }
  }

  // 销售范围TABS
  tabListNoTitle = () => {
    const {
      details: {
        customer: { salesAreaList },
      },
    } = this.props;
    const data = [];
    salesAreaList.forEach(item => {
      data.push({
        key: item.salesOrganizationCode + item.distributionChannelCode,
        tab: this.tabName(item.salesOrganizationCode, item.distributionChannelCode),
      });
    });
    return data;
  };

  tabName = (salesOrganizationCode, distributionChannelCode) => {
    const { distributionChannels, salesOrganizations } = this.props;
    let firstName = '';
    let lastName = '';
    distributionChannels.forEach(item => {
      if (item.code === distributionChannelCode) {
        lastName = item.name;
      }
    });
    salesOrganizations.forEach(item => {
      if (item.code === salesOrganizationCode) {
        firstName = item.name;
      }
    });
    return firstName + lastName;
  };

  onTabChange = key => {
    this.setState({
      noTitleKey: key,
    });
  };

  render() {
    const { noTitleKey } = this.state;
    const {
      details: {
        basic: { sapCountryCode },
      },
      details: { customer },
      regions,
      offices,
      salesPaymentMethods,
      currencies,
      status,
      DefaultInvoiceType,
      DefaultInvoiceTypeOther,
      SalesOrderBlock,
    } = this.props;
    const salesAreaList = customer ? customer.salesAreaList : '';

    const columns1 = [
      {
        title: formatMessage({ id: 'bp.maintain_details.name' }),
        width: 500,
        dataIndex: 'name',
        className: 'tableFirstPadding',
        render(text, record) {
          return (
            <>
              {record.type === 2 ? <HomeOutlined /> : <UserOutlined />} {text}
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.sales_distribution.sold_to_party' }),
        width: 500,
        dataIndex: 'soldToPartyName',
        render(text, record) {
          return (
            <>
              {record.type === 2 ? <HomeOutlined /> : <UserOutlined />} {text}
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.status' }),
        width: 400,
        dataIndex: 'verifyStatus',
        render(text) {
          // return <Badge status={status[text].value} text={status[text].text}/>;
          return (
            <Badge
              status={formatter(status, text, 'value', 'status')}
              text={formatMessage({ id: formatter(status, text, 'value', 'i18n') })}
            />
          );
        },
      },
      // {
      //   title: '操作',
      //   render: (text, record) => (
      //       <a>删除</a>
      //     ),
      // },
    ];

    const columns2 = [
      {
        title: formatMessage({ id: 'bp.maintain_details.name' }),
        width: 500,
        dataIndex: 'name',
        className: 'tableFirstPadding',
        render(text, record) {
          return (
            <>
              {record.type === 2 ? <HomeOutlined /> : <UserOutlined />} {text}
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.status' }),
        width: 600,
        dataIndex: 'linkVerifyStatus',
        render(text) {
          return (
            <Badge
              status={formatter(status, text, 'value', 'status')}
              text={formatMessage({ id: formatter(status, text, 'value', 'i18n') })}
            />
          );
        },
      },
      // {
      //   title: '操作',
      //   render: (text, record) => (
      //       <a>删除</a>
      //     ),
      // },
    ];

    const columns3 = [
      {
        title: formatMessage({ id: 'bp.maintain_details.name' }),
        width: 700,
        dataIndex: 'name',
        className: 'tableFirstPadding',
        render(text, record) {
          return (
            <>
              {record.type === 2 ? <HomeOutlined /> : <UserOutlined />} {text}
            </>
          );
        },
      },
      {
        title: formatMessage({ id: 'bp.maintain_details.status' }),
        width: 400,
        dataIndex: 'verifyStatus',
        render(text) {
          return (
            <Badge
              status={formatter(status, text, 'value', 'status')}
              text={formatMessage({ id: formatter(status, text, 'value', 'i18n') })}
            />
          );
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

    const columns4 = [
      {
        title: formatMessage({ id: 'bp.maintain_details.name' }),
        width: 1200,
        dataIndex: 'name',
        className: 'tableFirstPadding',
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

    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.sales_distribution' })}
        className="check-tabs"
        bordered={false}
        style={{ width: '100%', marginBottom: '24px' }}
        tabList={salesAreaList ? this.tabListNoTitle() : ''}
        activeTabKey={noTitleKey.toString()}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {salesAreaList ? (
          salesAreaList.map(item => {
            if (
              parseInt(item.salesOrganizationCode + item.distributionChannelCode, 10) ===
              parseInt(noTitleKey, 10)
            ) {
              return (
                <div key={item.regionCode}>
                  <Descriptions
                    className="s-descriptions"
                    layout="vertical"
                    column={5}
                    key={item.regionCode}
                    style={{ marginBottom: '20px' }}
                  >
                    <DescriptionsItem
                      label={formatMessage({
                        id: 'bp.maintain_details.sales_distribution.sales_area',
                      })}
                    >
                      {formatter(regions, item.regionCode, 'code', 'name')}/
                      {formatter(offices, item.officeCode, 'code', 'name')}
                    </DescriptionsItem>
                    <DescriptionsItem
                      label={formatMessage({
                        id: 'bp.maintain_details.sales_distribution.default_payment_menthod',
                      })}
                    >
                      {formatter(
                        salesPaymentMethods,
                        item.defaultPaymentMethodCode,
                        'code',
                        'name',
                      )}
                    </DescriptionsItem>
                    <DescriptionsItem
                      label={formatMessage({
                        id: 'bp.maintain_details.sales_distribution.currency',
                      })}
                    >
                      {formatter(currencies, item.currencyCode, 'code', 'shortText')}
                    </DescriptionsItem>
                    <DescriptionsItem
                      label={
                        sapCountryCode !== 'CN' && sapCountryCode
                          ? formatMessage({
                              id: 'bp.maintain_details.sales_distribution.tax_classification',
                            })
                          : formatMessage({
                              id: 'bp.maintain_details.sales_distribution.invoice_type',
                            })
                      }
                    >
                      {sapCountryCode !== 'CN' && sapCountryCode
                        ? formatMessage({
                            id: formatter(
                              DefaultInvoiceTypeOther,
                              item.taxClassificCode,
                              'id',
                              'i18n',
                            ),
                          })
                        : formatMessage({
                            id: formatter(
                              DefaultInvoiceType,
                              item.defaultInvoiceTypeCode,
                              'id',
                              'i18n',
                            ),
                          })}
                    </DescriptionsItem>
                    <DescriptionsItem
                      label={formatMessage({
                        id: 'bp.maintain_details.sales_distribution.sales_block',
                      })}
                    >
                      {/* {item.salesOrderBlock === 1 ? <span><Badge status="error"/>冻结</span> :
                    <span><Badge status="success"/>活跃</span>} */}
                      <span>
                        <Badge
                          status={formatter(SalesOrderBlock, item.salesOrderBlock, 'id', 'badge')}
                          text={formatMessage({
                            id: formatter(SalesOrderBlock, item.salesOrderBlock, 'id', 'i18n'),
                          })}
                        />
                      </span>
                    </DescriptionsItem>
                  </Descriptions>
                  <div style={{ border: '1px solid #E6E6E6', width: '100%', height: '100%' }}>
                    <Tabs defaultActiveKey="1" className="tabs">
                      <TabPane
                        tab={formatMessage({
                          id: 'bp.maintain_details.sales_distribution.bill_to_party',
                        })}
                        key="1"
                      >
                        <Table
                          dataSource={item.billToPartyList}
                          columns={columns1}
                          size="small"
                          pagination={false}
                          rowKey={(r, i) => i}
                        />
                      </TabPane>
                      <TabPane
                        tab={formatMessage({
                          id: 'bp.maintain_details.sales_distribution.sold_to_party',
                        })}
                        key="2"
                      >
                        <Table
                          dataSource={item.soldToPartyList}
                          columns={columns2}
                          size="small"
                          pagination={false}
                          rowKey={(r, i) => i}
                        />
                      </TabPane>
                      <TabPane
                        tab={formatMessage({
                          id: 'bp.maintain_details.sales_distribution.ship_to_party',
                        })}
                        key="3"
                      >
                        <Table
                          dataSource={item.shipToPartyList}
                          columns={columns3}
                          size="small"
                          pagination={false}
                          rowKey={(r, i) => i}
                        />
                      </TabPane>
                      <TabPane
                        tab={formatMessage({
                          id: 'bp.maintain_details.sales_distribution.sales_rep',
                        })}
                        key="4"
                      >
                        <Table
                          dataSource={item.salerList}
                          columns={columns4}
                          size="small"
                          pagination={false}
                          rowKey={(r, i) => i}
                        />
                      </TabPane>
                    </Tabs>
                  </div>
                </div>
              );
            }
            return '';
          })
        ) : (
          <Empty />
        )}
      </Card>
    );
  }
}

export default BasicInfo;
