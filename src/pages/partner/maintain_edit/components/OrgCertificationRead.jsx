/**
 * 组织认证查看
 */
import React from 'react';
import { Form, Card, Row, Col, Badge, Upload, Modal } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import diskAPI from '@/api/disk';
import ChangeCertification from './ChangeCertification';

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
  state = {
    modalVisible: false,
  };

  handleOk = () => {
    this.setState({ modalVisible: false });
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  // 取消认证
  cancelCertification = () => {
    console.log('取消认证');
  };

  // 认证状态
  renderStatus = () => {
    const { details, basic } = this.props;
    let status = null;
    switch (basic.certificationStatus) {
      case 1:
        status = (
          <>
            <Badge status="default" text="未认证" />
            &nbsp;&nbsp;
            <a>认证</a>
            <ChangeCertification details={details} />
          </>
        );
        break;
      case 2:
        status = (
          <>
            <Badge status="warning" text="审核中" />
            &nbsp;&nbsp;
            <a>查看</a>
          </>
        );
        break;
      case 4:
        status = (
          <>
            <Badge status="success" text="已认证" />
            &nbsp;&nbsp;
            <a onClick={this.showModal}>变更</a>
            &nbsp;&nbsp;
            <a onClick={this.cancelCertification}>取消认证</a>
            <Modal
              title="变更认证资料"
              visible={this.state.modalVisible}
              okText="提交"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <ChangeCertification details={details} />
            </Modal>
          </>
        );
        break;
      default:
    }
    return status;
  };

  renderChina = () => {
    const { organizationCertification: data } = this.props;
    const fileList = data.attachmentList.map(e => ({
      uid: e.id,
      name: e.name,
      status: 'done',
      url: diskAPI.downloadFiles(e.id, { view: true }),
    }));

    return (
      <>
        <Row gutter={32}>
          <Col xxl={15} lg={24}>
            <Row gutter={32}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
                >
                  {this.renderStatus()}
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
              <Upload listType="picture-card" fileList={fileList} />
            </FormItem>
          </Col>
        </Row>
      </>
    );
  };

  renderOther = sapCountryCode => {
    const { organizationCertification: data } = this.props;
    const fileList = [];

    return (
      <Row gutter={64}>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <FormItem
                label={formatMessage({ id: 'bp.maintain_details.verification_data.status' })}
              >
                {this.renderStatus()}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label={sapCountryCode === 'US' ? '免税认证号' : '增值税登记号'}>
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
          >
            <Upload listType="picture-card" fileList={fileList} />
          </FormItem>
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
    const { sapCountryCode } = basic;
    let form;

    if (!sapCountryCode) form = this.renderChina();
    if (sapCountryCode) form = this.renderOther(sapCountryCode); // 非中国，默认显示英国
    if (sapCountryCode === 'CN') form = this.renderChina();
    if (sapCountryCode === 'US') form = this.renderOther(sapCountryCode);
    if (sapCountryCode === 'GB') form = this.renderChina(sapCountryCode);
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
