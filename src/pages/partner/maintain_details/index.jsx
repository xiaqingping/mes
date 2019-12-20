import { Icon, Spin, Empty } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom';
import { formatMessage } from 'umi/locale';
import PersonCertification from './components/PersonCertification';
import PersonCredit from './components/PersonCredit';
import BasicInfo from './components/BasicInfo';
import Type from './components/Type';
import Credit from './components/Credit';
import HomeAuthentication from './components/HomeAuthentication';
import AbroadAuthentication from './components/AbroadAuthentication';
import Address from './components/Address';
import Bank from './components/Bank';
import PurchasingOrg from './components/PurchasingOrg';
import api from '@/api';

@connect(({ partnerMaintainEdit, basicCache }) => ({
  customer: partnerMaintainEdit.details,
  type: partnerMaintainEdit.type,
  supplier: partnerMaintainEdit.supplier,
  countryDiallingCodes: basicCache.countryDiallingCodes,
}))
class CustomerDetails extends Component {
  state = {
    width: '100%',
    tabActiveKey: 'customer',
    pageLoading: true,
  };

  componentDidMount() {
    const activeKey = this.props.location.query.tabActiveKey ?
                      this.props.location.query.tabActiveKey : '';
    // this.props.dispatch({
    //   type: 'partnerMaintainEdit/setDetails',
    //   payload: null,
    // });
    api.bp.getBPCustomer(this.props.match.params.id).then(res => {
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: res,
      });
      this.setState({
        pageLoading: false,
      });
    });
    api.bp.getBPVendor(this.props.match.params.id).then(res => {
      this.props.dispatch({
        type: 'partnerMaintainEdit/setSupplier',
        payload: res,
      });
    });
    this.props.dispatch({
      type: 'basicCache/setState',
      payload: { type: 'countryDiallingCodes' },
    });

        // 判断是客户还是供应商
    if (activeKey) {
      if (activeKey === 'vendor') {
        this.props.dispatch({
          type: 'partnerMaintainEdit/setType',
          payload: 'supplier',
        });
        this.setState({
          tabActiveKey: 'supplier',
        })
      }
    } else if ((parseInt(this.props.location.query.customerDataStatus, 10) === 2 &&
      parseInt(this.props.location.query.vendorDataStatus, 10) === 1)) {
      this.props.dispatch({
        type: 'partnerMaintainEdit/setType',
        payload: 'supplier',
      });
      this.setState({
        tabActiveKey: 'supplier',
      })
    } else {
      this.props.dispatch({
        type: 'partnerMaintainEdit/setType',
        payload: 'customer',
      });
    }


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
    this.props.dispatch({
      type: 'partnerMaintainEdit/setType',
      payload: tabActiveKey,
    });
    this.setState({
      tabActiveKey,
    });
  };

  title = v => {
    const { location, match } = this.props;
    const {
      params: { id },
    } = match;
    const { query } = location;
    const { customerDataStatus, vendorDataStatus, type } = query;
    return (
      <div>
        <span>{formatMessage({ id: 'menu.bp.maintain.details' })} {v}</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <Link
          // eslint-disable-next-line max-len
          to={`/bp/maintain/edit/${id}?type=${type}&customerDataStatus=${customerDataStatus}&vendorDataStatus=${vendorDataStatus}&tabActiveKey=${this.props.type === 'customer' ? 'customer' : 'vendor'}`}
          onClick={() => {
            this.props.dispatch({
              type: 'partnerMaintainEdit/setDetails',
              payload: null,
            });
            this.props.dispatch({
              type: 'partnerMaintainEdit/setType',
              payload: null,
            });
            this.props.dispatch({
              type: 'partnerMaintainEdit/setSupplier',
              payload: null,
            });
          }}
        >
          <Icon type="edit" style={{ color: 'black' }} />
        </Link>
      </div>
    );
  };

  render() {
    const { tabActiveKey, pageLoading } = this.state;
    const { customer } = this.props;
    return (
      <PageHeaderWrapper
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        title={this.title(customer ? customer.basic.code : '')}
        style={{ paddingBottom: 0 }}
        tabList={[
          {
            key: 'customer',
            tab: formatMessage({ id: 'bp.maintain_details.customer' }),
          },
          {
            key: 'supplier',
            tab: formatMessage({ id: 'bp.maintain_details.vendor' }),
          },
        ]}
      >
        <Spin spinning={pageLoading}>
          {pageLoading ? (
            <Empty style={{ padding: 300, background: '#fff' }} description="loading..."></Empty>
          ) : (
            {
              customer: (
                <>
                  <BasicInfo />
                  <Type />
                  {customer.basic.type === 1 ? (
                    <>
                      <PersonCredit />
                      <PersonCertification />
                    </>
                  ) : (
                    <>
                      <Credit />
                      {customer.basic.sapCountryCode === 'CN' ? (
                        <HomeAuthentication />
                      ) : (
                        <AbroadAuthentication />
                      )}
                    </>
                  )}
                  <Address />
                </>
              ),
              supplier: (
                <>
                  <BasicInfo />
                  <PurchasingOrg />
                  <Bank />
                  {customer.basic.type === 2 ? (
                    <>
                      {customer.basic.countryCode === 'CN' ? (
                        <HomeAuthentication />
                      ) : (
                        <AbroadAuthentication abroadType={customer.basic.telephoneCountryCode} />
                      )}
                    </>
                  ) : (
                    ''
                  )}
                </>
              ),
            }[tabActiveKey]
          )}
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default CustomerDetails;
