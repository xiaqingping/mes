/* eslint-disable no-nested-ternary */
import { Modal, Badge, Row, Col, Empty, Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import api from '@/api';

import { formatter } from '@/utils/utils';

class RecordListForm extends React.Component {
  tableFormRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      historyRecord: [],
      pic: [],
      picHas: false,
      SpecialInvoice: [],
      recordMsg: [],
      pageLoading: true,
      errPage: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  closeListForm = () => {
    this.setState({
      showList: false,
      historyRecord: [],
      pic: [],
      picHas: false,
      SpecialInvoice: [],
      recordMsg: [],
    });
  };

  // props更新时调用
  passData(showList, recordMsg, SpecialInvoice) {
    this.setState({ pageLoading: true, errPage: false, showList });
    const typeName =
      parseInt(recordMsg.type, 10) === 1 ? 'organizationCertification' : 'piCertification';
    if (showList) {
      if (recordMsg) {
        // eslint-disable-next-line consistent-return
        api.bp
          .getLastFinishVerifyRecords(recordMsg.bpId)
          .then(res => {
            const newData = [];
            if (!res) return null;
            if (res[typeName].attachmentCode) {
              api.disk
                .getFiles({
                  sourceKey:
                    parseInt(recordMsg.type, 10) === 1
                      ? 'bp_organization_certification'
                      : 'bp_pi_certification',
                  sourceCode: [res[typeName].attachmentCode].join(','),
                })
                .then(v => {
                  // sourceCode: '85c951942daa05a83a55655efdd557eb' }).then(v => {
                  // eslint-disable-next-line array-callback-return
                  v.map(item => {
                    if (item.id) {
                      newData.push(api.disk.downloadFiles(item.id, { view: true }));
                      this.setState({ pageLoading: false, picHas: true });
                    }
                  });
                })
                .catch(() => {
                  this.setState({
                    errPage: true,
                  });
                });
            }
            this.setState({
              showList,
              historyRecord: res,
              pic: newData,
              SpecialInvoice,
              recordMsg,
            });
            return true;
          })
          .catch(() => {
            this.setState({
              errPage: true,
            });
          });
      }
    }
  }

  render() {
    const {
      recordMsg: { bpType },
      showList,
      historyRecord,
      picHas,
      pic,
      SpecialInvoice,
      pageLoading,
      errPage,
    } = this.state;
    const { VerifyRecordStatus, industryCategories } = this.props;
    const typeName = parseInt(bpType, 10) === 2 ? 'organizationCertification' : 'piCertification';
    // if (!historyRecord && !picHas) return false;
    // if (!bpType) return false;
    return (
      <Modal
        destroyOnClose
        footer={null}
        width="430px"
        className={styles.xxxs}
        title={formatMessage({
          id: 'bp.verification.organizationVerification.verificationHistory',
        })}
        visible={showList}
        onCancel={this.closeListForm}
      >
        {errPage ? (
          <Empty />
        ) : (
          <Spin spinning={pageLoading}>
            {pageLoading ? (
              <Empty />
            ) : historyRecord.length === 0 ? (
              <Empty />
            ) : (
              <ul className={styles.contenList}>
                <li>
                  <Row>
                    <Col span={8} className={styles.labelName}>
                      {formatMessage({
                        id: 'bp.verification.organizationVerification.status',
                      })}
                    </Col>
                    <Col span={16} className={styles.labelVal}>
                      <Badge
                        style={{ color: '#999' }}
                        status={formatter(
                          VerifyRecordStatus,
                          historyRecord.status,
                          'value',
                          'status',
                        )}
                        text={formatMessage({
                          id: formatter(VerifyRecordStatus, historyRecord.status, 'value', 'i18n'),
                        })}
                      />
                      {typeName === 'piCertification'
                        ? `(${historyRecord.piCertification.billToPartyName})`
                        : ''}
                      <br />
                      {/* {historyRecord.status}<br/> */}
                      {historyRecord.finishDate}
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col span={8} className={styles.labelName}>
                      {formatMessage({
                        id: 'bp.verification.organizationVerification.operator',
                      })}
                    </Col>
                    <Col span={16} className={styles.labelVal}>
                      {historyRecord.operatorName}
                      <br />
                      {historyRecord.operationDate}
                    </Col>
                  </Row>
                </li>
                {parseInt(bpType, 10) === 1 ? (
                  <>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.name',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.piCertification.name}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.PIVerification.billToParty',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.piCertification.billToPartyName}
                        </Col>
                      </Row>
                    </li>
                  </>
                ) : historyRecord.organizationCertification.countryCode === '1000000000' ? (
                  <>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.country',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.organizationCertification.countryName}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.contactPhone',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.organizationCertification.telephoneAreaCode
                            ? `+${historyRecord.organizationCertification.telephoneAreaCode} `
                            : ''}
                          {historyRecord.organizationCertification.telephone}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={10} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.businessType',
                          })}
                        </Col>
                        <Col span={14} className={styles.labelVal}>
                          {industryCategories.filter(
                            item => historyRecord.industryCode === item.code,
                          ).length !== 0 && industryCategories.length !== 0
                            ? industryCategories.filter(
                                item => historyRecord.industryCode === item.code,
                              )[0].name
                            : ''}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.taxInvoice',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {/* {detailsValue.specialInvoice} */}
                          {historyRecord.organizationCertification.specialInvoice
                            ? SpecialInvoice.filter(
                                item =>
                                  item.id ===
                                  historyRecord.organizationCertification.specialInvoice,
                              )[0].name
                            : ''}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.vatBusiness',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.organizationCertification.taxNo}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.bankName',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.organizationCertification.bankCode}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.bankAccount',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.organizationCertification.bankAccount}
                        </Col>
                      </Row>
                    </li>
                    <li>
                      <Row>
                        <Col span={8} className={styles.labelName}>
                          {formatMessage({
                            id: 'bp.verification.organizationVerification.address',
                          })}
                        </Col>
                        <Col span={16} className={styles.labelVal}>
                          {historyRecord.organizationCertification.registeredAddress}
                        </Col>
                      </Row>
                    </li>
                  </>
                ) : (
                  <li>
                    <Row>
                      <Col span={8} className={styles.labelName}>
                        {historyRecord.organizationCertification.countryCode === 'US'
                          ? formatMessage({
                              id: 'bp.verification.organizationVerification.taxExemptID',
                            })
                          : formatMessage({
                              id: 'bp.verification.organizationVerification.vat',
                            })}
                      </Col>
                      <Col span={16} className={styles.labelVal}>
                        {historyRecord.organizationCertification.taxNo}
                      </Col>
                    </Row>
                  </li>
                )}

                <li>
                  <Row>
                    <Col span={8} className={styles.labelName}>
                      {formatMessage({
                        id: 'bp.verification.PIVerification.memo',
                      })}
                    </Col>
                    <Col span={16} className={styles.labelVal}>
                      {historyRecord[typeName].notes}
                    </Col>
                  </Row>
                </li>
                <li>
                  <Row>
                    <Col span={8} className={styles.labelName}>
                      {formatMessage({
                        id: 'bp.verification.organizationVerification.attachment',
                      })}
                    </Col>
                    <Col span={16} className={styles.labelVal}>
                      {picHas ? (
                        <ul style={{ padding: '0' }}>
                          {pic.length !== 0
                            ? pic.map((item, index) => {
                                if (index < 12) {
                                  return (
                                    <li
                                      // eslint-disable-next-line react/no-array-index-key
                                      key={index}
                                      style={{
                                        width: '90px',
                                        height: '90px',
                                        border: '1px solid #D9D9D9',
                                        textAlign: 'center',
                                        lineHeight: '84px',
                                        borderRadius: '5px',
                                        float: 'left',
                                        marginRight: '30px',
                                      }}
                                    >
                                      <img
                                        src={item}
                                        alt=""
                                        style={{
                                          width: 'auto',
                                          height: 'auto',
                                          maxWidth: '91%',
                                          maxHeight: '100%',
                                        }}
                                      />
                                    </li>
                                  );
                                }
                                return '';
                              })
                            : ''}
                        </ul>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </li>
              </ul>
            )}
          </Spin>
        )}
      </Modal>
    );
  }
}

export default connect(({ bp, basicCache, global }) => {
  const industryCategories = basicCache.industryCategories.filter(
    e => e.languageCode === global.languageCode,
  );
  return {
    VerifyRecordStatus: bp.VerifyRecordStatus,
    industryCategories: industryCategories.length !== 0 ? industryCategories : [],
  };
})(RecordListForm);
