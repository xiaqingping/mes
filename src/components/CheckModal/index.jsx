import {
  Modal,
  Badge,
  Form,
  Row,
  Col,
} from 'antd';
import React from 'react';
import styles from './index.less';

// const FormItem = Form.Item;
/** verify state */
const verifyData = {
  0: {
    value: 'erroer',
    text: '未验证',
  },
  1: {
    value: 'success',
    text: '已完成',
  },
}
// /** 变更手机号和邮箱数据 */
// const changeNumber = [
//   {
//     id: 1,
//     titel: '变更类型',
//     content: '验证手机',
//   },
//   {
//     id: 2,
//     titel: '变更渠道',
//     content: '自助验证',
//   },
//   {
//     id: 12,
//     titel: '验证方式',
//     content: '登录验证',
//   },
//   {
//     id: 3,
//     titel: '原手机',
//     content: '19822666358',
//   },
//   {
//     id: 4,
//     titel: '验证码',
//     content: '123456',
//     action: '重发',
//   },
//   {
//     id: 5,
//     titel: '验证码过期时间',
//     content: '2019-6-20 13：00：00',
//   },
//   {
//     id: 6,
//     titel: '最后发送时间',
//     content: '2019-6-20 12：00：00',
//   },
//   {
//     id: 7,
//     titel: '新手机',
//     content: '1530077524',
//   },
//   {
//     id: 8,
//     titel: '验证码',
//     content: '2019613',
//   },
//   {
//     id: 9,
//     titel: '验证码过期时间',
//     content: '2019-6-20 13：00：00',
//   },
//   {
//     id: 10,
//     titel: '最后发送时间',
//     content: '2019-6-20 13：00：00',
//   },
//   {
//     id: 11,
//     titel: '验证码',
//     content: '159687',
//     action: '完成',
//   },
// ]

// /** 认证数据 */
// const idenData = [
//   {
//     id: 13,
//     titel: '认证类型',
//     content: '人员',
//   },
//   {
//     id: 14,
//     titel: '注册地址',
//     content: '上海市松江区向民路6987号',
//   },
//   {
//     id: 15,
//     titel: '认证说明',
//     content: '此处是认证说明此处是认证说明此处是认证说明此处是认证说明此处是认证说明',
//   },
//   {
//     id: 16,
//     titel: '附件',
//     content: [
//       {
//         src: '/favicon.png',
//         index: 111111111,
//       }, {
//         src: '/icons/icon-128x128.png',
//         index: 222222222222,
//       },
//     ],
//   },
// ]

// /** 绑定售达方数据 */
// const saleData = [
//   {
//     id: 17,
//     titel: '售达方编号',
//     content: '89666588554',
//   },
//   {
//     id: 18,
//     titel: '售达方名称',
//     content: '某某某某某',
//   },
//   {
//     id: 19,
//     titel: '验证类型',
//     content: '手机',
//   },
//   {
//     id: 20,
//     titel: '手机',
//     content: '19500772581',
//   },
//   {
//     id: 11,
//     titel: '验证码',
//     content: '159687',
//     action: '完成',
//   },
//   {
//     id: 9,
//     titel: '验证码过期时间',
//     content: '2019-6-20 13：00：00',
//   },
//   {
//     id: 10,
//     titel: '最后发送时间',
//     content: '2019-6-20 13：00：00',
//   },
// ];

// /** 验证手机和邮箱 */
// const idenPhoneData = [
//   {
//     id: 1,
//     titel: '验证类型',
//     content: '验证邮箱',
//   },
//   {
//     id: 2,
//     titel: '验证渠道',
//     content: '登录验证',
//   },
//   {
//     id: 20,
//     titel: '手机',
//     content: '19500772581',
//   },
//   {
//     id: 21,
//     titel: '邮箱',
//     content: '65495887@qq.com',
//   },
//   {
//     id: 11,
//     titel: '验证码',
//     content: '159687',
//     action: '完成',
//   },
//   {
//     id: 9,
//     titel: '验证码过期时间',
//     content: '2019-6-20 13：00：00',
//   },
//   {
//     id: 10,
//     titel: '最后发送时间',
//     content: '2019-6-20 13：00：00',
//   },
// ]

// /** 个人认证 */
// const idenPersonal = [
//   {
//     id: 111,
//     titel: '名称',
//     content: '王某某',
//   },
//   {
//     id: 112,
//     titel: '认证类型',
//     content: '人员',
//   },
//   {
//     id: 113,
//     titel: '注册地址',
//     content: '上海市松江区向民路6987号',
//   },
//   {
//     id: 114,
//     titel: '认证说明',
//     content: '此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明',
//   },
//   {
//     id: 115,
//     titel: '附件',
//     content: [
//       {
//         src: '/favicon.png',
//         index: 312,
//       }, {
//         src: '/icons/icon-128x128.png',
//         index: 313,
//       },
//     ],
//   },
// ]

// 个人认证记录
const dataList = {
  status: '已完成（张三）',
  operatorName: '李斯',
  approverName: '王某某',
  type: '人员',
  piCertification: {
    invoicePartyName: '上海复旦大学',
    note: '此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明',
  },
  attachmentList: [
    {
      type: 'image',
      name: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718%2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg',
    },
    {
      type: 'image',
      name: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718%2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg',
    },
  ],
}


const RecordListForm = Form.create()(
  class extends React.Component {
    constructor(props) {
      super(props);
      console.log(this.props);
      this.state = {
        showList: this.props.showList,
      };
    }

    // props更新时调用
    componentWillReceiveProps (props) {
      this.setState({
        showList: props.showList,
      });
    }

    render () {
      const { showList } = this.state;
      const { closeListForm } = this.props;
      return (
        <Modal
          destroyOnClose
          footer={null}
          width="410px"
          className={styles.xxx}
          title="认证历史（PI）"
          visible = {showList}
          onCancel={closeListForm}>
          <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>状态：</Col>
                <Col span={20} className={styles.labelVal}>{dataList.status}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>操作人：</Col>
                <Col span={20} className={styles.labelVal}>{dataList.operatorName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>名称：</Col>
                <Col span={20} className={styles.labelVal}>{dataList.approverName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>收票方：</Col>
                <Col
                  span={20}
                  className={styles.labelVal}>
                    {dataList.piCertification.invoicePartyName}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>认证说明：</Col>
                <Col span={20} className={styles.labelVal}>{dataList.piCertification.note}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>附件：</Col>
                <Col span={20} className={styles.labelVal}>
                  <ul style={{ padding: '0' }}>
                    {dataList.attachmentList.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={index} style={{ width: '100px', height: '100px', border: '1px solid #D9D9D9', textAlign: 'center', lineHeight: '94px', borderRadius: '5px', float: 'left', marginRight: '30px' }}>{item.type === 'image' ? <img src={item.name} alt="" width="90" height="90"/> : ''}</li>
                      ))}
                  </ul>
                </Col>
              </Row>
            </li>
          </ul>
        </Modal>
      )
    }
  },
)

class CheckModal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modal1Visible: false,
      recordMsg: undefined,
      clickType: '',
      showList: false,
    }
  }

  // /** props更新事调用 */
  // componentWillReceiveProps (props) {
  //   let { showModal } = props;
  //   const { recordMsg, clickType } = props;
  //   if (recordMsg === undefined) {
  //     showModal = false;
  //   }
  //   this.setState({
  //     modal1Visible: showModal,
  //     recordMsg,
  //     clickType,
  //   });
  // }

  componentDidMount() {
    this.props.onRef(this)
  }


  /** 控制模态框状态 */
  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
  }


  visibleShow = (recordMsg, clickType, visible) => {
    this.setState({
      modal1Visible: recordMsg ? visible : false,
      recordMsg,
      clickType,
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
    let piData;
    const { recordMsg, clickType, showList } = this.state;
    let modalTitle;
    // const changeData = [];
    let modelContent;
    // const actionResent = <a onClick={e => { this.reSent(e) }}>重发</a>
    // const actionFinesh = <Badge status="success" text="已完成" />
    if (recordMsg === undefined) {
      return false;
    }
    if (clickType === '01') { // 查看进来
      if (recordMsg.type === 0 || recordMsg.type === 1) {
        modalTitle = '变更已验证手机和邮箱'
        const changePhoneData = {
          type: '验证手机',
          channel: '自助验证',
          verifyType: '手机',
          oldMobilePhone: '+86 15968749968',
          oldContactInfoVerifyCode: '1****6',
          oldContactInfoVerifyCodeExpireDate: '2019-06-12 13：00：00',
          oldContactInfoVerifyCodeLastSendDate: '2019-06-12 13：00：00',
          newMobilePhone: '+86 15968749966',
          newContactInfoVerifyCode: '1*****3',
          newContactInfoVerifyCodeExpireDate: '2019-06-12 13：00：00',
          newContactInfoVerifyCodeLastSendDate: '2019-06-12 13：00：00',
          oldContactInfoVerifyStatus: 1,
          newContactInfoVerifyStatus: 1,
        }
        modelContent = <>
          <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>变更类型：</Col>
                <Col span={16} className={styles.labelVal}>{changePhoneData.type}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>变更渠道：</Col>
                <Col span={16} className={styles.labelVal}>{changePhoneData.channel}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证方式：</Col>
                <Col span={16} className={styles.labelVal}>{changePhoneData.verifyType}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>原手机：</Col>
                <Col span={16} className={styles.labelVal}>{changePhoneData.oldMobilePhone}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码：</Col>
                <Col span={16} className={styles.labelVal}>
                  {changePhoneData.oldContactInfoVerifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                  <Badge
                    status={verifyData[changePhoneData.oldContactInfoVerifyStatus].value}
                    text={verifyData[changePhoneData.oldContactInfoVerifyStatus].text} />
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {changePhoneData.oldContactInfoVerifyCodeExpireDate}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>最后发送时间：</Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {changePhoneData.oldContactInfoVerifyCodeLastSendDate}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>新手机：</Col>
                <Col span={16} className={styles.labelVal}>{changePhoneData.newMobilePhone}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码：</Col>
                <Col span={16} className={styles.labelVal}>
                  {changePhoneData.newContactInfoVerifyCode}&nbsp;&nbsp;
                    <a onClick={e => { this.reSent(e) }}>重发</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a onClick={e => { this.reSent(e) }}>完成验证</a>
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {changePhoneData.newContactInfoVerifyCodeExpireDate}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>最后发送时间：</Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {changePhoneData.newContactInfoVerifyCodeLastSendDate}
                </Col>
              </Row>
            </li>
          </ul>
        </>
      } else if (recordMsg.type === 2) {
        modalTitle = '认证';
        // get PI data
        piData = {
          organizationCertification: {
            name: '王某某',
          },
          piCertification: {
            invoicePartyName: '上海复旦大学',
            notes: '此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明',
          },
          attachmentList: [
            {
              type: 'image',
              name: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718%2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg',
            },
            {
              type: 'image',
              name: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571310110031&di=c5c3557d5172db919d831cca34586e4c&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170718%2Fdc7a88ed8b5146368b068fc71c8c8533.jpeg',
            },
          ],
        }

        modelContent = <>
          <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>名称：</Col>
                <Col
                  span={20}
                  className={styles.labelVal}>
                    {piData.organizationCertification.name}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>收票方：</Col>
                <Col
                  span={20}
                  className={styles.labelVal}>
                    {piData.piCertification.invoicePartyName}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>认证说明：</Col>
                <Col span={20} className={styles.labelVal}>{piData.piCertification.notes}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4} className={styles.labelName}>附件：</Col>
                {/* <Col span={20} className={styles.labelVal}>
                {piData.attachmentList[0].name}</Col> */}
                <Col span={20} className={styles.labelVal}>
                  <ul style={{ padding: '0' }}>
                    {piData.attachmentList.map((item, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <li key={index} style={{ width: '100px', height: '100px', border: '1px solid #D9D9D9', textAlign: 'center', lineHeight: '94px', borderRadius: '5px', float: 'left', marginRight: '30px' }}>{item.type === 'image' ? <img src={item.name} alt="" width="90" height="90"/> : ''}</li>
                      ))}
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
      } else if (recordMsg.type === 3) {
        modalTitle = '绑定售达方';
        const bindingData = {
          shipToPartyName: '某某某',
          shipToPartyCode: '0564555',
          soldToPartyName: '某某某',
          soldToPartyCode: '0564555',
          type: '手机',
          status: '1',
          mobilePhone: '15968674996',
          verifyCode: '159686',
          expireDate: '2019-06-12 13:00:00',
          lastSendDate: '2019-06-12 13:00:00',
        }
        modelContent = <>
          <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>送达方：</Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {bindingData.shipToPartyCode} {bindingData.shipToPartyName}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>售达方：</Col>
                <Col
                  span={16}
                  className={styles.labelVal}>
                    {bindingData.soldToPartyCode}
                    {bindingData.soldToPartyName}
                  </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证类型：</Col>
                <Col span={16} className={styles.labelVal}>{bindingData.type}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码：</Col>
                <Col span={16} className={styles.labelVal}>
                  {bindingData.verifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                  <Badge
                    status={verifyData[bindingData.status].value}
                    text={verifyData[bindingData.status].text} />
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
                <Col span={16} className={styles.labelVal}>{bindingData.expireDate}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>最后发送时间：</Col>
                <Col span={16} className={styles.labelVal}>{bindingData.lastSendDate}</Col>
              </Row>
            </li>
          </ul>
         </>
      } else if (recordMsg.type === 4 || recordMsg.type === 5) {
        modalTitle = '验证手机和邮箱';
        const checkPhoneData = {
          type: '邮箱验证',
          channel: '登录验证',
          mobilePhone: '15968749966',
          email: '540595443@qq.com',
          verifyCode: '159686',
          status: 1,
          expireDate: '2019-06-12 13:00:00',
          lastSendDate: '2019-06-12 13:00:00',
        }
        modelContent = <>
          <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证类型：</Col>
                <Col span={16} className={styles.labelVal}>{checkPhoneData.type}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证渠道：</Col>
                <Col span={16} className={styles.labelVal}>{checkPhoneData.channel}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>手机：</Col>
                <Col span={16} className={styles.labelVal}>{checkPhoneData.mobilePhone}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>邮箱：</Col>
                <Col span={16} className={styles.labelVal}>
                  {checkPhoneData.email}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码：</Col>
                <Col span={16} className={styles.labelVal}>
                  {checkPhoneData.verifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                  <Badge
                    status={verifyData[checkPhoneData.status].value}
                    text={verifyData[checkPhoneData.status].text} />
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>验证码过期时间：</Col>
                <Col span={16} className={styles.labelVal}>{checkPhoneData.expireDate}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8} className={styles.labelName}>最后发送时间：</Col>
                <Col span={16} className={styles.labelVal}>{checkPhoneData.lastSendDate}</Col>
              </Row>
            </li>
          </ul>
         </>
      }
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
          cancelText="拒绝"
          okText="审核"
        >
        { modelContent }
        </Modal>
        <RecordListForm showList = {showList} closeListForm= {this.closeListForm}/>
      </div>
    )
  }
}
export default CheckModal;
