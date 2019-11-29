/**
 * 组织认证查看
 */
import React from 'react';
import { Form, Card, Row, Col, Badge } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

const FormItem = Form.Item;

@connect(({ bpEdit }) => {
  const details = bpEdit.details || {};
  const { basic } = details;
  const organizationCertification = details.organizationCertification || { attachmentList: [] };
  return {
    details,
    basic,
    organizationCertification,
  };
})
class OrgCertificationRead extends React.Component {
  renderChina = () => {
    const { organizationCertification: data, basic } = this.props;
    console.log(basic);
    return (
      <>
        <Row gutter={32}>
          <Col xxl={15} lg={24}>
            <Row gutter={32}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
                >
                  <Badge status="default" />
                  未认证
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.special_invoice',
                  })}
                >
                  {data.specialInvoice}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.VAT_Business',
                  })}
                >
                  {data.taxNo}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
                >
                  {data.bankName}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.account_number',
                  })}
                >
                  {data.bankAccount}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>电话</FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
                >
                  {data.address}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xxl={9} lg={24}>
            <FormItem label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}>
              {data.notes}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem
              label={formatMessage({
                id: 'bp.maintain_details.verification_data.verification_documents',
              })}
            >
              {data.attachmentCode}
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  renderOther = countryCode => {
    const { organizationCertification: data } = this.props;
    return (
      <Row gutter={64}>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <FormItem
                label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
              >
                <Badge status="default" />
                未认证
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label={countryCode === 'US' ? '免税认证号' : '增值税登记号'}>
                {data.taxNo}
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <FormItem
            label={formatMessage({
              id: 'bp.maintain_details.verification_data.verification_documents',
            })}
          ></FormItem>
        </Col>
        <Col span={10}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
          ></FormItem>
        </Col>
      </Row>
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
      <Card
        title={formatMessage({ id: 'bp.maintain_details.verification_data' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        {this.renderContent()}
      </Card>
    );
  }
}

export default OrgCertificationRead;
