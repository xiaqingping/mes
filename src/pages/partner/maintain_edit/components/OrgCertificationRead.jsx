/**
 * 组织认证查看
 */
import React from 'react';
import { Form, Card, Row, Col, Badge, Upload, Modal, Popconfirm } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import api from '@/api';
import ChangeCertification from './ChangeCertification';
// import ContactInformation from './ContactInformation';
import styles from '../style.less';

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
    const { details, basic } = this.props;
    const { id } = basic;

    api.bp.cancelBPOrgCertification(id).then(() => {
      const newBasic = { ...basic, certificationStatus: 1 };
      const newDetails = { ...details, basic: newBasic, organizationCertification: {} };

      this.props.dispatch({
        type: 'bpEdit/setState',
        payload: {
          type: 'details',
          data: newDetails,
        },
      });
    });
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
            <a className={styles.changeButton}>认证</a>
            <ChangeCertification details={details} />
          </>
        );
        break;
      case 2:
        status = (
          <>
            <Badge status="warning" text="审核中" />
            <a className={styles.changeButton}>查看</a>
          </>
        );
        break;
      case 4:
        status = (
          <>
            <Badge status="success" text="已认证" />
            <a className={styles.changeButton} onClick={this.showModal}>
              变更
            </a>
            <Popconfirm
              title="确认取消认证？"
              onConfirm={this.cancelCertification}
              okText="确认"
              cancelText="取消"
            >
              <a className={styles.changeButton}>取消认证</a>
            </Popconfirm>
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
    const { basic, organizationCertification: data } = this.props;
    const attachmentList = data.attachmentList || [];
    const fileList = attachmentList.map(e => ({
      uid: e.id,
      name: e.name,
      status: 'done',
      url: api.disk.downloadFiles(e.id, { view: true }),
    }));

    let telphone = '';
    if (basic.certificationStatus === 4) {
      telphone = (
        <>
          <span>{basic.telephoneCountryCode} </span>
          {`${basic.telephoneAreaCode}-${basic.telephone}-${basic.telephoneExtension}`}
        </>
      );
    }

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
                  {data.specialInvoice || <span>&nbsp;</span>}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.VAT_Business',
                  })}
                >
                  {data.taxNo || <span>&nbsp;</span>}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={8}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
                >
                  {data.bankName || <span>&nbsp;</span>}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.account_number',
                  })}
                >
                  {data.bankAccount || <span>&nbsp;</span>}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>
                  {telphone || <span>&nbsp;</span>}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={24}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
                >
                  {data.address || <span>&nbsp;</span>}
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col xxl={9} lg={24}>
            <FormItem label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}>
              {data.notes ? data.notes : <span>&nbsp;</span>}
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
    const attachmentList = data.attachmentList || [];
    const fileList = attachmentList.map(e => ({
      uid: e.id,
      name: e.name,
      status: 'done',
      url: api.disk.downloadFiles(e.id, { view: true }),
    }));

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
                {data.taxNo || ' '}
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
