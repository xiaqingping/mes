/**
 * 组织认证查看
 */
import React from 'react';
import { Form, Card, Row, Col, Badge } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

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
    console.log(data);
    return (
      <>
        <Row gutter={32}>
          <Col xxl={15} lg={24}>
            <Row gutter={32}>
              <Col span={8}>
                <FormItem label="认证状态">
                  <Badge status="default" />
                  未认证
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="增值税专用发票资质"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="统一社会信用代码"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="基本户开户银行"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="基本户开户账号"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="电话"></FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="注册地址"></FormItem>
              </Col>
            </Row>
          </Col>
          <Col xxl={9} lg={24}>
            <FormItem label="认证说明"></FormItem>
          </Col>
        </Row>
        <Row>
          <Col>认证图片</Col>
        </Row>
      </>
    );
  };

  renderOther = countryCode => {
    console.log(countryCode);
    const { organizationCertification: data } = this.props;
    console.log(data);
    return (
      <>
        <Row gutter={32}>
          <Col xxl={15} lg={24}>
            <Row gutter={32}>
              <Col span={8}>
                <FormItem label="认证状态">
                  <Badge status="default" />
                  未认证
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="增值税专用发票资质"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="统一社会信用代码"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="基本户开户银行"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="基本户开户账号"></FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="电话"></FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="注册地址"></FormItem>
              </Col>
            </Row>
          </Col>
          <Col xxl={9} lg={24}>
            <FormItem label="认证说明"></FormItem>
          </Col>
        </Row>
        <Row>
          <Col>认证图片</Col>
        </Row>
      </>
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
