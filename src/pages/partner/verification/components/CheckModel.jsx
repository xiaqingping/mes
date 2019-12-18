/* eslint-disable no-nested-ternary */
import {
  Modal,
  Badge,
  Form,
  Row,
  Col,
  Empty,
  Button,
  Icon,
  Spin,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.less';
import api from '@/api';
import CheckEmail from '@/pages/partner/maintain_details/components/CheckEmail';
import CheckPhone from '@/pages/partner/maintain_details/components/CheckPhone';

// const FormItem = Form.Item;
/** verify state */
const verifyData = {
  1: {
    value: 'warning',
    text: formatMessage({ id: 'bp.verification.verfication' }),
  },
  2: {
    value: 'success',
    text: formatMessage({ id: 'bp.verification.completed' }),
  },
  3: {
    value: 'error',
    text: formatMessage({ id: 'bp.verification.rejected' }),
  },
  4: {
    value: 'error',
    text: formatMessage({ id: 'bp.verification.expired' }),
  },
}

const verifyType = {
  1: {
    text: '手机',
  },
  2: {
    text: '邮箱',
  },
  3: {
    text: '用户',
  },
  4: {
    text: '人工审核',
  },
}

// 变更渠道
const verifyChannel = {
  1: { text: '登录验证' },
  2: { text: '自助验证' },
}

// 变更类型
const verifyChangeType = {
  1: {
    text: '验证手机',
  },
  2: {
    text: '验证邮箱',
  },
}

// 验证方式
const verifyTest = {
  1: {
    text: '手机',
  },
  2: {
    text: '邮箱',
  },
  3: {
    text: '问题',
  },
}


@Form.create()
@connect(({ bp, basicCache, global }) => {
  const industryCategories = basicCache.industryCategories.filter(
    e => e.languageCode === global.languageCode,
  );
  return ({
  VerifyRecordStatus: bp.VerifyRecordStatus,
  industryCategories: industryCategories.length !== 0 ? industryCategories : [],
})
})
class RecordListForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showList: false,
      historyRecord: [],
      pic: [],
      picHas: false,
    };
  }

  // props更新时调用
  componentWillReceiveProps (props) {
    const { recordMsg: { type } } = this.props;
    const typeName = parseInt(type, 10) === 1 ? 'organizationCertification' : 'piCertification';
    if (props.showList) {
      if (props.recordMsg) {
        // eslint-disable-next-line consistent-return
        api.bp.getLastFinishVerifyRecords(props.recordMsg.bpId).then(res => {
          const newData = [];
          if (!res) return null
          if (res[typeName].attachmentCode) {
            api.disk.getFiles({
              sourceKey: parseInt(type, 10) === 1 ?
                        'bp_organization_certification' : 'bp_pi_certification',
              sourceCode: [res[typeName].attachmentCode].join(',') }).then(v => {
              // sourceCode: '85c951942daa05a83a55655efdd557eb' }).then(v => {
              // eslint-disable-next-line array-callback-return
              v.map(item => {
                if (item.id) {
                  newData.push(api.disk.downloadFiles(item.id, { view: true }))
                  this.setState({ picHas: true })
                }
              })
            })
          }
          this.setState({
            showList: props.showList,
            historyRecord: res,
            pic: newData,
          });
        })
      }
    }
  }

  closeListForm = () => {
    this.props.closeListForm();
    this.setState({
      showList: false,
      picHas: false,
      pic: [],
    })
  }

  render () {
    const { showList, historyRecord, picHas, pic } = this.state;
    const {
      recordMsg: { type },
      SpecialInvoice,
      VerifyRecordStatus,
      industryCategories } = this.props;
    const typeName = parseInt(type, 10) === 1 ? 'organizationCertification' : 'piCertification';
    if (!historyRecord && !picHas) return null
    return (
      <Modal
        destroyOnClose
        footer={null}
        width="410px"
        className={styles.xxx}
        title= {
          formatMessage({
           id: 'bp.verification.organizationVerification.verificationHistory',
          })
        }
        visible = {showList}
        onCancel={this.closeListForm}>
          {historyRecord.length === 0 ? <Empty /> : <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                  id: 'bp.verification.organizationVerification.status',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                <Badge
                style={{ color: '#999' }}
                status={VerifyRecordStatus.filter(
                          item => item.value === historyRecord.status)[0].status}
                text={
                  VerifyRecordStatus.filter(item => item.value === historyRecord.status)[0].text}/>
                 {typeName === 'piCertification' ?
                 `(${historyRecord.piCertification.billToPartyName})` : ''}
                 <br/>
                {/* {historyRecord.status}<br/> */}
                {historyRecord.finishDate}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                  id: 'bp.verification.organizationVerification.operator',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {historyRecord.operatorName}<br/>
                {historyRecord.operationDate}
              </Col>
            </Row>
          </li>
          { parseInt(type, 10) === 2 ?
          <>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                    id: 'bp.verification.organizationVerification.name',
                    })
                  }
                </Col>
                <Col span={16} className={styles.labelVal}>
                  {historyRecord.piCertification.name}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                    id: 'bp.verification.PIVerification.billToParty',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {historyRecord.piCertification.billToPartyName}
                </Col>
              </Row>
            </li>
          </>
          :
          (historyRecord.organizationCertification.countryCode === '1000000000' ?
          <>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                    id: 'bp.verification.organizationVerification.country',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {historyRecord.organizationCertification.countryName}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                    id: 'bp.verification.organizationVerification.contactPhone',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {historyRecord.organizationCertification
                    .telephoneAreaCode ? `+${historyRecord.organizationCertification
                    .telephoneAreaCode} ` : ''}{historyRecord.organizationCertification.telephone}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.businessType',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {
                      industryCategories.filter(
                        item => historyRecord.industryCode === item.code,
                      ).length !== 0 && industryCategories.length !== 0 ? industryCategories.filter(
                        item => historyRecord.industryCode === item.code,
                      )[0].name : ''
                    }
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.taxInvoice',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {/* {detailsValue.specialInvoice} */}
                    {historyRecord.organizationCertification.specialInvoice ?
                    SpecialInvoice.filter(item =>
                    item.id === historyRecord.organizationCertification
                    .specialInvoice)[0].name : ''}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.vatBusiness',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {historyRecord.organizationCertification.taxNo}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.bankName',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {historyRecord.organizationCertification.bankCode}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.bankAccount',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {historyRecord.organizationCertification.bankAccount}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.address',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {historyRecord.organizationCertification.registeredAddress}
                </Col>
              </Row>
            </li>
          </>
          :
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {historyRecord.organizationCertification.countryCode === 'US' ?
                formatMessage({
                  id: 'bp.verification.organizationVerification.taxExemptID',
                }) : formatMessage({
                  id: 'bp.verification.organizationVerification.vat',
                })}
              </Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {historyRecord.organizationCertification.taxNo}
              </Col>
            </Row>
          </li>)
          }

          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.organizationVerification.memo',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {historyRecord[typeName].notes}
                </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.organizationVerification.attachment',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                { picHas ? <ul style={{ padding: '0' }}>
                {pic.length !== 0 ? pic.map((item, index) => {
                  if (index < 12) {
                    console.log(index)
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{
                        width: '90px',
                        height: '90px',
                        border: '1px solid #D9D9D9',
                        textAlign: 'center',
                        lineHeight: '84px',
                        borderRadius: '5px',
                        float: 'left',
                        marginRight: '30px' }}>
                        <img src={item} alt="" width="80" height="80"/>
                      </li>
                      )
                  }
                  return ''
                }) : ''}
                  </ul> : ''}
              </Col>
            </Row>
          </li>
        </ul>}

      </Modal>
    )
  }
}


@connect(({ bp, basicCache, global }) => {
  const industryCategories = basicCache.industryCategories.filter(
    e => e.languageCode === global.languageCode,
  );
  return ({
  SpecialInvoice: bp.SpecialInvoice,
  countryDiallingCodes: basicCache.countryDiallingCodes,
  industryCategories: industryCategories.length !== 0 ? industryCategories : [],
  })
})
class CheckModel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modal1Visible: false,
      recordMsg: undefined,
      clickType: '',
      showList: false,
      detailsValue: undefined,
      pageVisble: false,
      picHas: false,
      emailShow: false,
      phoneShow: false,
      emailAccount: '',
      phoneAccount: '',
      approvedLoading: false,
      pageLoading: true,
    }
  }

  componentDidMount() {
    this.props.onRef(this)
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'countryDiallingCodes' },
    });
    this.props.dispatch({
      type: 'basicCache/getCache',
      payload: { type: 'industryCategories' },
    });
  }

  /** 控制模态框状态 */
  setModal1Visible = (modal1Visible, type = false) => {
    if (type) {
      this.setState({ pageVisble: false });
    } else {
      this.setState({ modal1Visible, detailsValue: undefined, pageVisble: false, picHas: false });
    }
  }


  visibleShow = (recordMsg, clickType, visible) => {
    // 组织认证
    if (clickType === 1) {
      api.bp.getOrgCertificationVerifyRecords(recordMsg.id).then(res => {
        let newData = res;
        newData = { ...newData, pic: [] };
        if (res.attachmentCode) {
          api.disk.getFiles({
            sourceKey: 'bp_organization_certification',
            sourceCode: [res.attachmentCode].join(',') }).then(v => {
            // sourceCode: res.attachmentCode }).then(v => {
            // eslint-disable-next-line array-callback-return
            v.map(item => {
              if (item.id) {
                newData.pic.push(api.disk.downloadFiles(item.id, { view: true }))
                this.setState({ picHas: true })
              }
            })
          })
        }
        this.setState({
          pageLoading: false,
          detailsValue: newData,
        })
      })
    }
    // 人员认证
    if (clickType === 2) {
      api.bp.getPiCertificationVerifyRecords(recordMsg.id).then(res => {
        let newData = res;
        newData = { ...newData, pic: [] };
        if (res.attachmentCode) {
          api.disk.getFiles({
            sourceKey: 'bp_pi_certification',
            sourceCode: [res.attachmentCode].join(',') }).then(v => {
            // sourceCode: res.attachmentCode }).then(v => {
            // eslint-disable-next-line array-callback-return
            v.map(item => {
              if (item.id) {
                newData.pic.push(api.disk.downloadFiles(item.id, { view: true }))
                this.setState({ picHas: true })
              }
            })
          })
        }
        this.setState({
          pageLoading: false,
          detailsValue: newData,
        })
      })
    }
    // 绑定售达方
    if (clickType === 3) {
      api.bp.getSoldToPartyVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          pageLoading: false,
          detailsValue: res,
        })
      })
    }
    // 验证手机或者邮箱
    if (clickType === 4 || clickType === 5) {
      api.bp.getContactInfoVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          pageLoading: false,
          detailsValue: res,
        })
      })
    }
    // 变更手机或者邮箱
    if (clickType === 6 || clickType === 7) {
      api.bp.getChangeContactInfoVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          pageLoading: false,
          detailsValue: res,
        })
      })
    }
    this.setState({
      recordMsg,
      clickType,
    })
    this.setState({
      modal1Visible: recordMsg ? visible : false,
    });
  }

  closeListForm = () => {
    this.setState({
      showList: false,
    })
  }

  /** 重发验证码 */
  reSent = (event, detailsValue) => {
    event.preventDefault();
    if (parseInt(detailsValue.type, 10) === 1) {
      this.checkPhone(true);
      this.setState({
        phoneAccount: detailsValue,
      })
    } else if (parseInt(detailsValue.type, 10) === 2) {
      this.checkEmail(true);
      this.setState({
        emailAccount: detailsValue.newEmail,
      })
    }
  }

  recordList = e => {
    e.preventDefault();
    this.setState({
      showList: true,
    })
  }

  checkPhone = v => {
    this.setState({
      phoneShow: v,
    })
  }

  checkEmail = v => {
    this.setState({
      emailShow: v,
    })
  }

  // pageVisble 1 审核 ，2 拒绝
  openPage = (id, pageVisble) => {
    if (pageVisble === 1) {
      this.setState({
        approvedLoading: true,
      })
      api.bp.approvalVerifyRecords(id).then(() => {
        this.setState({
          pageVisble,
          modal1Visible: false,
          approvedLoading: false,
        })
        this.props.getData()
      })
    }
    if (pageVisble === 2) {
      api.bp.refuseVerifyRecords(id).then(() => {
        this.setState({
          pageVisble,
          modal1Visible: false,
        })
        this.props.getData()
      })
    }
  }

  render () {
    const {
      recordMsg,
      showList,
      detailsValue,
      clickType,
      pageVisble,
      picHas,
      phoneShow,
      phoneAccount,
      emailShow,
      approvedLoading,
      pageLoading,
      emailAccount } = this.state;
    const { SpecialInvoice, countryDiallingCodes, industryCategories } = this.props;
    if (!detailsValue && !picHas) return null
    let modalTitle;
    let modelContent;
    if (recordMsg === undefined) {
      return false;
    }
    if (clickType === 6 || clickType === 7) {
      modalTitle = formatMessage({ id: 'bp.verification.changeVerifiedPhoneAndEmail' })
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {formatMessage({ id: 'bp.verification.changeVerifiedPhoneAndEmail.changeType' })}
                </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.type ? verifyChangeType[detailsValue.type].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
              {formatMessage({ id: 'bp.verification.changeVerifiedPhoneAndEmail.changeMethod' })}
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.channel ? verifyChannel[detailsValue.channel].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.changeVerifiedPhoneAndEmail.verificationMethod',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.verifyType ? verifyTest[detailsValue.verifyType].text : ''}
              </Col>
            </Row>
          </li>
          {
          parseInt(detailsValue.verifyType, 10) === 3 ? '' : <>
            <li>
              {
              parseInt(detailsValue.verifyType, 10) === 1 ?
                <Row>
                  <Col span={8} className={styles.labelName}>
                    {
                      formatMessage({
                        id: 'bp.verification.changeVerifiedPhoneAndEmail.previousMobilePhone',
                      })
                    }
                  </Col>
                  <Col span={16} className={styles.labelVal}>
                    {
                    detailsValue.oldMobilePhoneCountryCode &&
                    detailsValue.oldMobilePhoneCountryCode !== 'NULL' ?
                    `+${countryDiallingCodes.filter(
                      v => v.countryCode === detailsValue.oldMobilePhoneCountryCode,
                      )[0].diallingCode} `
                    : ''}{detailsValue.oldMobilePhone}</Col>
                </Row>
                :
                <Row>
                  <Col span={8} className={styles.labelName}>
                    {
                      formatMessage({
                        id: 'bp.verification.changeVerifiedPhoneAndEmail.previousEmail',
                      })
                    }
                  </Col>
                  <Col span={16} className={styles.labelVal}>{detailsValue.oldEmail}</Col>
                </Row>
              }
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.changeVerifiedPhoneAndEmail.verificationCode',
                    })
                  }
                </Col>
                <Col span={16} className={styles.labelVal}>
                  {detailsValue.oldContactInfoVerifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                  {detailsValue.oldContactInfoVerifyStatus ? <Badge
                    status={verifyData[detailsValue.oldContactInfoVerifyStatus].value}
                    text={verifyData[detailsValue.oldContactInfoVerifyStatus].text} /> : ''}

                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.changeVerifiedPhoneAndEmail.verificationCodeExpiryDate',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {detailsValue.oldContactInfoVerifyCodeExpireDate}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.changeVerifiedPhoneAndEmail.lastSentDate',
                    })
                  }
                </Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {detailsValue.oldContactInfoVerifyCodeLastSendDate}
                </Col>
              </Row>
            </li>
            </>
          }
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  parseInt(detailsValue.verifyType, 10) === 1
                  ?
                  formatMessage({
                    id: 'bp.verification.changeVerifiedPhoneAndEmail.newMobilePhone',
                    })
                  :
                  formatMessage({
                    id: 'bp.verification.changeVerifiedPhoneAndEmail.newEmail',
                    })
                  }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {
                  parseInt(detailsValue.verifyType, 10) === 1
                  ?
                  (
                    detailsValue.newMobilePhoneCountryCode &&
                    detailsValue.newMobilePhoneCountryCode !== 'NULL'
                    ?
                    `+${countryDiallingCodes.filter(
                      v => v.countryCode === detailsValue.newMobilePhoneCountryCode,
                    )[0].diallingCode} `
                    :
                    ''
                  )
                  :
                  (detailsValue.newEmail ? detailsValue.newEmail : '')
                }
                {detailsValue.newMobilePhone}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.changeVerifiedPhoneAndEmail.verificationCode',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.newContactInfoVerifyCode}&nbsp;&nbsp;
                {parseInt(recordMsg.status, 10) === 1 ?
                <>
                  <a onClick={e => { this.reSent(e, detailsValue) }} >
                    {formatMessage({ id: 'bp.verification.changeVerifiedPhoneAndEmail.reSend' })}
                  </a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <a>
                    {formatMessage({ id: 'bp.verification.changeVerifiedPhoneAndEmail.completed' })}
                  </a>
                </>
                :
                (detailsValue.newContactInfoVerifyStatus ? <Badge
                  status={verifyData[detailsValue.newContactInfoVerifyStatus].value}
                  text={verifyData[detailsValue.newContactInfoVerifyStatus].text} />
                : '')
                }
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                   id: 'bp.verification.changeVerifiedPhoneAndEmail.verificationCodeExpiryDate',
                  })
                }
              </Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.newContactInfoVerifyCodeExpireDate}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {formatMessage({ id: 'bp.verification.changeVerifiedPhoneAndEmail.lastSentDate' })}
              </Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.newContactInfoVerifyCodeLastSendDate}
              </Col>
            </Row>
          </li>
        </ul>
      </>
    } else if (clickType === 2) {
      modalTitle = formatMessage({ id: 'bp.verification.PIVerification' });
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {formatMessage({ id: 'bp.verification.PIVerification.name' })}
              </Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.bpName}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {formatMessage({ id: 'bp.verification.PIVerification.billToParty' })}
              </Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.billToPartyName}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {formatMessage({ id: 'bp.verification.PIVerification.memo' })}
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.notes}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {formatMessage({ id: 'bp.verification.PIVerification.attachment' })}
              </Col>
              {/* <Col span={20} className={styles.labelVal}>
              {piData.attachmentList[0].name}</Col> */}
              <Col span={16} className={styles.labelVal}>
                <ul style={{ padding: '0' }}>
                {detailsValue.pic.length !== 0 ? detailsValue.pic.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{
                        width: '90px',
                        height: '90px',
                        border: '1px solid #D9D9D9',
                        textAlign: 'center',
                        lineHeight: '84px',
                        borderRadius: '5px',
                        float: 'left',
                        marginRight: '30px' }}>
                        <img src={item} alt="" width="80" height="80"/>
                      </li>
                    )) : ''}
                </ul>
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={16}>
                <a href="#" className={styles.recoedHis} onClick={this.recordList}>
                  {formatMessage({ id: 'bp.verification.PIVerification.verificationHistory' })}
                </a>
              </Col>
            </Row>
          </li>
        </ul>
        </>
    } else if (clickType === 3) {
      modalTitle = formatMessage({ id: 'bp.verification.defaultShipToParty' });
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.defaultShipToParty.shipToParty' })
                }
              </Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.shipToPartyCode} {detailsValue.shipToPartyName}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.defaultShipToParty.soldToParty' })
                }
              </Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.soldToPartyCode}
                  {detailsValue.soldToPartyName}
                </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.defaultShipToParty.verificationType' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.type}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.defaultShipToParty.mobilePhone' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.mobilePhone}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.defaultShipToParty.verificationCode' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.verifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                {detailsValue.status ? <Badge
                  status={verifyData[detailsValue.status].value}
                  text={verifyData[detailsValue.status].text} /> : ''}

              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.defaultShipToParty.verificationCodeExpiryDate',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.expireDate}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.defaultShipToParty.lastSentDate',
                  })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.lastSendDate}</Col>
            </Row>
          </li>
        </ul>
        </>
    } else if (clickType === 4 || clickType === 5) {
      modalTitle = formatMessage({ id: 'bp.verification.verification' });
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.verification.verificationType' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.type ? verifyType[detailsValue.type].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.verification.verificationMethod' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.channel ? verifyChannel[detailsValue.channel].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.verification.mobilePhone' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.mobilePhone}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.verification.email' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.email}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.verification.verificationCode' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.verifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                {detailsValue.status ? <Badge
                  status={verifyData[detailsValue.status].value}
                  text={verifyData[detailsValue.status].text} /> : ''}

              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.verification.verificationCodeExpiryDate' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.expireDate}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({ id: 'bp.verification.verification.lastSentDate' })
                }
              </Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.lastSendDate}</Col>
            </Row>
          </li>
        </ul>
        </>
    } else if (clickType === 1) {
      modalTitle = formatMessage({
        id: 'bp.verification.organizationVerification',
      });
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
          <Col span={10} className={styles.labelName}>
            {
              formatMessage({
                id: 'bp.verification.organizationVerification.name',
              })
            }
          </Col>
              <Col
                span={14}
                className={styles.labelVal}>
                  {detailsValue.bpName}
              </Col>
            </Row>
          </li>
          {detailsValue.countryCode.toString() === '1000000000' ?
          <>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.country',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.countryName}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.contactPhone',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.telephoneAreaCode ? `+${detailsValue.telephoneAreaCode} ` : ''}
                    {detailsValue.telephone}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.businessType',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {
                      industryCategories.filter(
                        item => detailsValue.industryCode === item.code,
                      ).length !== 0 && industryCategories.length !== 0 ? industryCategories.filter(
                        item => detailsValue.industryCode === item.code,
                      )[0].name : ''
                    }
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.taxInvoice',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {/* {detailsValue.specialInvoice} */}
                    {detailsValue.specialInvoice ? SpecialInvoice.filter(item =>
                      item.id === detailsValue.specialInvoice)[0].name : ''}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.vatBusiness',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.taxNo}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.bankName',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.bankCode}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.bankAccount',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.bankAccount}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.address',
                    })
                  }
                </Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.registeredAddress}
                </Col>
              </Row>
            </li>
          </>
          :
          <li>
            <Row>
              <Col span={10} className={styles.labelName}>
                {detailsValue.countryCode === 'US' ? formatMessage({
                      id: 'bp.verification.organizationVerification.taxExemptID',
                    }) : formatMessage({
                      id: 'bp.verification.organizationVerification.vat',
                    })}：
              </Col>
              <Col
                span={14}
                className={styles.labelVal}>
                  {detailsValue.taxNo}
              </Col>
            </Row>
          </li>
          }
          <li>
            <Row>
              <Col span={10} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.organizationVerification.memo',
                  })
                }
              </Col>
              <Col span={14} className={styles.labelVal}>{detailsValue.notes}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>
                {
                  formatMessage({
                    id: 'bp.verification.organizationVerification.attachment',
                  })
                }
              </Col>
              {/* <Col span={20} className={styles.labelVal}>
              {piData.attachmentList[0].name}</Col> */}
              <Col span={16} className={styles.labelVal}>
                <ul style={{ padding: '0' }}>
                  {detailsValue.pic.length !== 0 ? detailsValue.pic.map((item, index) => {
                    if (index < 12) {
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={index} style={{
                          width: '90px',
                          height: '90px',
                          border: '1px solid #D9D9D9',
                          textAlign: 'center',
                          lineHeight: '84px',
                          borderRadius: '5px',
                          float: 'left',
                          marginRight: '30px' }}>
                          <img src={item} alt="" width="80" height="80"/>
                        </li>
                      )
                    }
                    return ''
                  }) : ''}
                </ul>
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={12}>
                <a href="#" className={styles.recoedHis} onClick={this.recordList}>
                  {
                    formatMessage({
                      id: 'bp.verification.organizationVerification.verificationHistory',
                    })
                  }
                </a>
              </Col>
            </Row>
          </li>
        </ul>
        </>
    }

    // 审核通过页面
    const passPage = <>
      <Modal
        width="500px"
        centered
        visible={pageVisble === 1}
        footer={null}
        onCancel={() => this.setModal1Visible(false, true)}
      >
        <div style={{ height: '180px', textAlign: 'center', paddingTop: '40px' }}>
          <Icon type="check-circle" style={{ fontSize: '40px', color: '#54C31F' }}/>
          <h4 style={{ fontWeight: '600', margin: '30px 0 20px' }}>
            {
              formatMessage({
                id: 'bp.verification.approvedPage',
              })
            }
          </h4>
        </div>
      </Modal>
    </>

    // 拒绝页面
    const refusePage = <>
    <Modal
      width="500px"
      centered
      visible={pageVisble === 2}
      footer={null}
      onCancel={() => this.setModal1Visible(false, true)}
    >
      <div style={{ height: '180px', textAlign: 'center', paddingTop: '40px' }}>
        <Icon type="close-circle" style={{ fontSize: '40px', color: 'red' }}/>
        <h4 style={{ fontWeight: '600', margin: '30px 0 20px' }}>
          {
            formatMessage({
              id: 'bp.verification.rejectPage',
            })
          }
        </h4>
      </div>
    </Modal>
    </>

    return (
      <div style={{ position: 'absolute', right: 0 }} >
        {passPage}
        {refusePage}
        <Modal
          className={styles.xxx}
          width="410px"
          title={ modalTitle }
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
          destroyOnClose
          footer={
            (clickType === 1 || clickType === 2 || clickType === 3) && recordMsg.status === 1 ? [
            <Button key="back" onClick={() => this.openPage(recordMsg.id, 2)}>
              {formatMessage({ id: 'bp.verification.reject' })}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => this.openPage(recordMsg.id, 1)}
              loading={approvedLoading}
            >
              {formatMessage({ id: 'bp.verification.approved' })}
            </Button>,
          ] : null}
        >
          <Spin spinning={pageLoading}>
            {pageLoading ? (
              <Empty />
              ) : modelContent
            }
          </Spin>
        </Modal>
        <RecordListForm
        showList = {showList}
        recordMsg={recordMsg}
        closeListForm= {this.closeListForm}
        SpecialInvoice= {SpecialInvoice}
        />
        <CheckPhone
          phoneShow={phoneShow}
          proceed="true"
          phoneAccount={phoneAccount}
          checkPhone={v => { this.checkPhone(v) }}
        />
        <CheckEmail
          emailShow={emailShow}
          proceed="true"
          emailAccount={emailAccount}
          checkEmail={v => { this.checkEmail(v) }}
        />
      </div>
    )
  }
}
export default CheckModel;
