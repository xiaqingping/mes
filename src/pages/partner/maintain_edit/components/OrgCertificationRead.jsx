/**
 * 组织认证查看
 */
import React from 'react';
import { Card, Descriptions } from 'antd';
import { connect } from 'dva';

const { DescriptionsItem } = Descriptions;

@connect(({ bpEdit }) => {
  const details = bpEdit.details || {};
  const organizationCertification = details.organizationCertification || { attachmentList: [] };
  return {
    details,
    organizationCertification,
  };
})
class OrgCertificationRead extends React.Component {
  renderChina = () => {
    const { organizationCertification: data } = this.props;
    return (
      <Descriptions className="s-descriptions" layout="vertical" column={4}>
        <DescriptionsItem label="额度">{data.credit}</DescriptionsItem>
        <DescriptionsItem label="临时额度">{data.tempCreditLimit}</DescriptionsItem>
        <DescriptionsItem label="付款周期">{data.billingCycle}</DescriptionsItem>
        <DescriptionsItem label="账单间隔">{data.billingDay}</DescriptionsItem>
      </Descriptions>
    );
  };

  renderOther = countryCode => {
    console.log(countryCode);
    const { organizationCertification: data } = this.props;
    return (
      <Descriptions className="s-descriptions" layout="vertical" column={4}>
        <DescriptionsItem label="额度">{data.credit}</DescriptionsItem>
        <DescriptionsItem label="临时额度">{data.tempCreditLimit}</DescriptionsItem>
        <DescriptionsItem label="付款周期">{data.billingCycle}</DescriptionsItem>
        <DescriptionsItem label="账单间隔">{data.billingDay}</DescriptionsItem>
      </Descriptions>
    );
  };

  renderContent = () => {
    const {
      details: { basic },
    } = this.props;
    const { countryCode } = basic;
    let form;

    if (!countryCode) form = this.renderChina();
    if (countryCode) form = this.renderOther(countryCode); // 非中国，默认显示英国
    if (countryCode === 'CN') form = this.renderChina();
    if (countryCode === 'US') form = this.renderOther(countryCode);
    if (countryCode === 'GB') form = this.renderChina(countryCode);
    return form;
  };

  render() {
    return (
      <Card title="认证资料" bordered={false} style={{ marginBottom: '24px' }}>
        {this.renderContent()}
      </Card>
    );
  }
}

export default OrgCertificationRead;
