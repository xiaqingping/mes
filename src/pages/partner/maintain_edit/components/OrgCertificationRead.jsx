/**
 * 组织认证查看
 */
import React from 'react';
import { Form, Card, Row, Col, Badge, Upload, Popconfirm } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import ChangeModal from '@/pages/partner/maintain/components/ChangeModal';
import api from '@/api';
import { formatter } from '@/utils/utils';
import ContactInformation from './ContactInformation';
import CertificationPopover from './CertificationPopover';
import styles from '../style.less';

const FormItem = Form.Item;

@connect(({ bp, bpEdit }) => {
  const { SpecialInvoice } = bp;
  const details = bpEdit.details || {};
  const { basic } = details;
  const organizationCertification = details.organizationCertification || { attachmentList: [] };
  return {
    SpecialInvoice,
    details,
    basic,
    organizationCertification,
  };
})
class OrgCertificationRead extends React.Component {
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
    const { basic } = this.props;
    let status = null;

    switch (basic.certificationStatus) {
      case 1:
        status = (
          <>
            <Badge status="default" text="未认证" />
            <CertificationPopover basic={basic}>
              <a
                className={styles.changeButton}
                onClick={() => {
                  this.showChange.visibleShow(true, basic);
                }}
              >
                认证
              </a>
            </CertificationPopover>
          </>
        );
        break;
      case 2:
        status = (
          <>
            <Badge status="warning" text="审核中" />
            <CertificationPopover basic={basic}>
              <a className={styles.changeButton}>查看</a>
            </CertificationPopover>
          </>
        );
        break;
      case 4:
        status = (
          <>
            <Badge status="success" text="已认证" />
            <CertificationPopover basic={basic}>
              <a
                className={styles.changeButton}
                onClick={() => {
                  this.showChange.visibleShow(true, this.props.details.basic);
                }}
              >
                变更
              </a>
            </CertificationPopover>
            <Popconfirm
              title="确认取消认证？"
              onConfirm={this.cancelCertification}
              okText="确认"
              cancelText="取消"
            >
              <a className={styles.changeButton}>取消认证</a>
            </Popconfirm>
          </>
        );
        break;
      default:
    }
    return status;
  };

  renderChina = () => {
    const { SpecialInvoice, basic, organizationCertification: data } = this.props;
    const attachmentList = data.attachmentList || [];
    const fileList = attachmentList.map(e => ({
      uid: e.id,
      name: e.name,
      status: 'done',
      url: api.disk.downloadFiles(e.id, { view: true }),
    }));

    let telphone = '';
    if (basic.certificationStatus === 4) {
      const phoneData = {
        countryCode: basic.telephoneCountryCode,
        areaCode: basic.telephoneAreaCode,
        code: basic.telephone,
        extension: basic.telephoneExtension,
      };
      telphone = <ContactInformation data={phoneData} />;
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
                  {formatter(SpecialInvoice, data.specialInvoice) || <span>&nbsp;</span>}
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
              <Upload
                listType="picture-card"
                fileList={fileList}
                showUploadList={{
                  showRemoveIcon: false,
                  showDownloadIcon: false,
                }}
              />
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
            <Upload
              listType="picture-card"
              fileList={fileList}
              showUploadList={{
                showRemoveIcon: false,
                showDownloadIcon: false,
              }}
            />
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })} />
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
    return <Form layout="vertical">{form}</Form>;
  };

  // 修改审核状态，如果v等于true,说明已经提交变更，状态改为审核中
  changeCertificationStatus = v => {
    const { details } = this.props;
    if (v) {
      const { basic } = details;
      basic.certificationStatus = 2;
      this.props.dispatch({
        type: 'bpEdit/setState',
        payload: {
          type: 'details',
          data: {
            ...details,
            basic,
          },
        },
      });
    }
  };

  render() {
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.verification_data' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <ChangeModal
          onRef={ref => {
            this.showChange = ref;
          }}
          getData={v => {
            this.changeCertificationStatus(v);
          }}
        />
        {this.renderContent()}
      </Card>
    );
  }
}

export default OrgCertificationRead;
