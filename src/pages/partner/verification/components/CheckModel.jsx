/* eslint-disable no-nested-ternary */
import {
  Modal,
  Badge,
  Form,
  Row,
  Col,
  Empty,
} from 'antd';
import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import api from '@/api';

// const FormItem = Form.Item;
/** verify state */
const verifyData = {
  1: {
    value: 'warning',
    text: '验证中',
  },
  2: {
    value: 'success',
    text: '已完成',
  },
  3: {
    value: 'error',
    text: '已拒绝',
  },
  4: {
    value: 'error',
    text: '已取消',
  },
  5: {
    value: 'error',
    text: '已过期',
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

const RecordListForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        showList: false,
        historyRecord: [],
      };
    }

    // props更新时调用
    componentWillReceiveProps (props) {
      if (props.showList) {
        if (props.recordMsg) {
          api.bp.getLastFinishVerifyRecords(props.recordMsg.id).then(res => {
            this.setState({
              showList: props.showList,
              historyRecord: res,
            });
          })
        }
      }
    }

    closeListForm = () => {
      this.props.closeListForm();
      this.setState({
        showList: false,
      })
    }

    render () {
      const { showList, historyRecord } = this.state;
      const { recordMsg: { type } } = this.props;
      const typeName = parseInt(type, 10) === 1 ? 'organizationCertification' : 'piCertification';
      // console.log(historyRecord, showList)
      // if (historyRecord.length === 0) return null
      return (
        <Modal
          destroyOnClose
          footer={null}
          width="410px"
          className={styles.xxx}
          title="认证历史"
          visible = {showList}
          onCancel={this.closeListForm}>
            {historyRecord.length === 0 ? <Empty /> : <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>状态：</Col>
                <Col span={20} className={styles.labelVal}>
                  {historyRecord.status}<br/>
                  {historyRecord.finishDate}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>操作人：</Col>
                <Col span={20} className={styles.labelVal}>
                  {historyRecord.operatorName}<br/>
                  {historyRecord.operationDate}
                </Col>
              </Row>
            </li>
            { parseInt(type, 10) === 2 ?
            <>
              <li>
                <Row>
                  <Col span={4} className={styles.labelName}>名称：</Col>
                  <Col span={20} className={styles.labelVal}>
                    {historyRecord.piCertification.name}</Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={4} className={styles.labelName}>收票方：</Col>
                  <Col
                    span={20}
                    className={styles.labelVal}>
                      {historyRecord.piCertification.billToPartyName}
                  </Col>
                </Row>
              </li>
            </>
            :
            (historyRecord.organizationCertification.countryCode === 'CN' ?
            <>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>国家：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {historyRecord.organizationCertification.countryName}
                  </Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>联系电话：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {historyRecord.organizationCertification
                      .telephoneAreaCode ? `+${historyRecord.organizationCertification
                      .telephoneAreaCode} ` : ''}{historyRecord.organizationCertification.telephone}
                  </Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>行业类别：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {historyRecord.organizationCertification.industryCode}
                  </Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>增值税专用发票资质：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {/* {detailsValue.specialInvoice} */}
                      {historyRecord.organizationCertification.specialInvoice ?
                      historyRecord.organizationCertification.filter(item =>
                      item.id === historyRecord.organizationCertification
                      .specialInvoice)[0].name : ''}
                  </Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>统一社会信用代码：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {historyRecord.organizationCertification.taxNo}
                  </Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>基本户开户银行：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {historyRecord.organizationCertification.bankCode}
                  </Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>基本户开户账号：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {historyRecord.organizationCertification.bankAccount}
                  </Col>
                </Row>
              </li>
              <li>
                <Row>
                  <Col span={10} className={styles.labelName}>注册地址：</Col>
                  <Col
                    span={14}
                    className={styles.labelVal}>
                      {historyRecord.organizationCertification.registeredAddress}
                  </Col>
                </Row>
              </li>
            </>
            :
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>
                  {historyRecord.organizationCertification.countryCode === 'US' ?
                  '免税认证号' : '增值税登记号'} ：</Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {historyRecord.organizationCertification.taxNo}
                </Col>
              </Row>
            </li>)
            }

            <li>
              <Row>
                <Col span={4} className={styles.labelName}>认证说明：</Col>
                <Col span={20} className={styles.labelVal}>
                  {historyRecord.piCertification.notes}
                  </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>附件：</Col>
                <Col span={20} className={styles.labelVal}>
                  <ul style={{ padding: '0' }}>
                    {historyRecord[typeName].attachmentList.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={index} style={{
                          width: '100px',
                          height: '100px',
                          border: '1px solid #D9D9D9',
                          textAlign: 'center',
                          lineHeight: '94px',
                          borderRadius: '5px',
                          float: 'left',
                          marginRight: '30px' }}>{item.type === 'image' ?
                          <img src={item.name} alt="" width="90" height="90"/> : ''}</li>
                      ))}
                  </ul>
                </Col>
              </Row>
            </li>
          </ul>}

        </Modal>
      )
    }
  },
)

@connect(({ partnerMaintainEdit }) => ({
  SpecialInvoice: partnerMaintainEdit.SpecialInvoice,
}))
class CheckModel extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modal1Visible: false,
      recordMsg: undefined,
      clickType: '',
      showList: false,
      detailsValue: undefined,
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillReceiveProps(props) {
    const clickType = props.type;
    const recordMsg = props.record;
    // 组织认证
    if (clickType === 1) {
      api.bp.getOrgCertificationVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          detailsValue: res,
        })
      })
    }
    // 人员认证
    if (clickType === 2) {
      api.bp.getPiCertificationVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          detailsValue: res,
        })
      })
    }
    // 绑定售达方
    if (clickType === 3) {
      api.bp.getSoldToPartyVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          detailsValue: res,
        })
      })
    }
    // 验证手机或者邮箱
    if (clickType === 4 || clickType === 5) {
      api.bp.getContactInfoVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          detailsValue: res,
        })
      })
    }
    // 变更手机或者邮箱
    if (clickType === 6 || clickType === 7) {
      api.bp.getChangeContactInfoVerifyRecords(recordMsg.id).then(res => {
        this.setState({
          detailsValue: res,
        })
      })
    }
    this.setState({
      recordMsg,
      clickType,
    })
  }

  /** 控制模态框状态 */
  setModal1Visible = modal1Visible => {
    this.setState({ modal1Visible, detailsValue: undefined });
  }


  visibleShow = (recordMsg, clickType, visible) => {
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
  reSent = event => {
    event.preventDefault();
  }

  recordList = e => {
    e.preventDefault();
    this.setState({
      showList: true,
    })
  }

  render () {
    const { recordMsg, showList, detailsValue, clickType } = this.state;
    const { SpecialInvoice } = this.props;
    if (!detailsValue) return null
    let modalTitle;
    // const changeData = [];
    let modelContent;
    // const actionResent = <a onClick={e => { this.reSent(e) }}>重发</a>
    // const actionFinesh = <Badge status="success" text="已完成" />
    if (recordMsg === undefined) {
      return false;
    }
    if (clickType === 6 || clickType === 7) {
      modalTitle = '变更已验证手机和邮箱'
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>变更类型：</Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.type ? verifyChangeType[detailsValue.type].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>变更渠道：</Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.channel ? verifyChannel[detailsValue.channel].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>验证方式：</Col>
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
                  <Col span={8} className={styles.labelName}>原手机：</Col>
                  <Col span={16} className={styles.labelVal}>
                    {detailsValue.oldMobilePhoneCountryCode ?
                    `+${detailsValue.oldMobilePhoneCountryCode} `
                    : ''}{detailsValue.oldMobilePhone}</Col>
                </Row>
                :
                <Row>
                  <Col span={8} className={styles.labelName}>原邮箱：</Col>
                  <Col span={16} className={styles.labelVal}>{detailsValue.oldEmail}</Col>
                </Row>
              }
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码：</Col>
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
                <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {detailsValue.oldContactInfoVerifyCodeExpireDate}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>最后发送时间：</Col>
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
              <Col span={8} className={styles.labelName}>新手机：</Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.newMobilePhoneCountryCode ?
                `+${detailsValue.newMobilePhoneCountryCode} ` : ''}
                {detailsValue.newMobilePhone}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>验证码：</Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.newContactInfoVerifyCode}&nbsp;&nbsp;
                {parseInt(detailsValue.verifyType, 10) === 1 ?
                <>
                  <a onClick={e => { this.reSent(e) }}>重发</a>&nbsp;&nbsp;&nbsp;&nbsp;
                  <a onClick={e => { this.reSent(e) }}>完成验证</a>
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
              <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.newContactInfoVerifyCodeExpireDate}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>最后发送时间：</Col>
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
      modalTitle = '认证';
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={4} className={styles.labelName}>名称：</Col>
              <Col
                span={20}
                className={styles.labelVal}>
                  {detailsValue.bpName}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={4} className={styles.labelName}>收票方：</Col>
              <Col
                span={20}
                className={styles.labelVal}>
                  {detailsValue.invoicePartyName}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={4} className={styles.labelName}>认证说明：</Col>
              <Col span={20} className={styles.labelVal}>{detailsValue.notes}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={4} className={styles.labelName}>附件：</Col>
              {/* <Col span={20} className={styles.labelVal}>
              {piData.attachmentList[0].name}</Col> */}
              <Col span={20} className={styles.labelVal}>
                <ul style={{ padding: '0' }}>
                  {detailsValue.attachmentList ? detailsValue.attachmentList.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{
                        width: '100px',
                        height: '100px',
                        border: '1px solid #D9D9D9',
                        textAlign: 'center',
                        lineHeight: '94px',
                        borderRadius: '5px',
                        float: 'left',
                        marginRight: '30px' }}>{item.type === 'image' ?
                        <img src={item.name} alt="" width="90" height="90"/> : ''}</li>
                    )) : ''}
                </ul>
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={6}>
                <a href="#" className={styles.recoedHis} onClick={this.recordList}>认证历史</a>
              </Col>
            </Row>
          </li>
        </ul>
        </>
    } else if (clickType === 3) {
      modalTitle = '绑定售达方';
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>送达方：</Col>
              <Col
                span={16}
                className={styles.labelVal}>
                  {detailsValue.shipToPartyCode} {detailsValue.shipToPartyName}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>售达方：</Col>
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
              <Col span={8} className={styles.labelName}>验证类型：</Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.type}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>验证码：</Col>
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
              <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.expireDate}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>最后发送时间：</Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.lastSendDate}</Col>
            </Row>
          </li>
        </ul>
        </>
    } else if (clickType === 4 || clickType === 5) {
      modalTitle = '验证手机和邮箱';
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>验证类型：</Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.type ? verifyType[detailsValue.type].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>验证渠道：</Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.channel ? verifyChannel[detailsValue.channel].text : ''}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>手机：</Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.mobilePhone}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>邮箱：</Col>
              <Col span={16} className={styles.labelVal}>
                {detailsValue.email}
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>验证码：</Col>
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
              <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.expireDate}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={8} className={styles.labelName}>最后发送时间：</Col>
              <Col span={16} className={styles.labelVal}>{detailsValue.lastSendDate}</Col>
            </Row>
          </li>
        </ul>
        </>
    } else if (clickType === 1) {
      modalTitle = '组织认证';
      modelContent = <>
        <ul className={styles.contenList}>
          <li>
            <Row>
              <Col span={10} className={styles.labelName}>名称：</Col>
              <Col
                span={14}
                className={styles.labelVal}>
                  {detailsValue.bpName}
              </Col>
            </Row>
          </li>
          {detailsValue.countryCode === 'CN' ?
          <>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>国家：</Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.countryName}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>联系电话：</Col>
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
                <Col span={10} className={styles.labelName}>行业类别：</Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.industryCode}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>增值税专用发票资质：</Col>
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
                <Col span={10} className={styles.labelName}>统一社会信用代码：</Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.taxNo}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>基本户开户银行：</Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.bankCode}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>基本户开户账号：</Col>
                <Col
                  span={14}
                  className={styles.labelVal}>
                    {detailsValue.bankAccount}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={10} className={styles.labelName}>注册地址：</Col>
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
              <Col span={10} className={styles.labelName}>{detailsValue.countryCode === 'US' ?
              '免税认证号' : '增值税登记号'}：</Col>
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
              <Col span={10} className={styles.labelName}>认证说明：</Col>
              <Col span={14} className={styles.labelVal}>{detailsValue.notes}</Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={9} className={styles.labelName}>附件：</Col>
              {/* <Col span={20} className={styles.labelVal}>
              {piData.attachmentList[0].name}</Col> */}
              <Col span={15} className={styles.labelVal}>
                <ul style={{ padding: '0' }}>
                  {detailsValue.attachmentList ? detailsValue.attachmentList.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index} style={{
                        width: '100px',
                        height: '100px',
                        border: '1px solid #D9D9D9',
                        textAlign: 'center',
                        lineHeight: '94px',
                        borderRadius: '5px',
                        float: 'left',
                        marginRight: '30px' }}>{item.type === 'image' ?
                        <img src={item.name} alt="" width="90" height="90"/> : ''}</li>
                    )) : ''}
                </ul>
              </Col>
            </Row>
          </li>
          <li>
            <Row>
              <Col span={6}>
                <a href="#" className={styles.recoedHis} onClick={this.recordList}>认证历史</a>
              </Col>
            </Row>
          </li>
        </ul>
        </>
    }

    return (
      <div style={{ position: 'absolute', right: 0 }} >
        <Modal
          className={styles.xxx}
          width="410px"
          title={ modalTitle }
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
          destroyOnClose
        >
        { modelContent }
        </Modal>
        <RecordListForm showList = {showList} recordMsg={recordMsg}
        closeListForm= {this.closeListForm}/>
      </div>
    )
  }
}
export default CheckModel;
