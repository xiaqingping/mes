import {
  Modal,
  Badge,
  Form,
  Row,
  Col,
} from 'antd';
import React from 'react';
import styles from './index.less';

const FormItem = Form.Item;
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
/** 变更手机号和邮箱数据 */
const changeNumber = [
  {
    id: 1,
    titel: '变更类型',
    content: '验证手机',
  },
  {
    id: 2,
    titel: '变更渠道',
    content: '自助验证',
  },
  {
    id: 12,
    titel: '验证方式',
    content: '登录验证',
  },
  {
    id: 3,
    titel: '原手机',
    content: '19822666358',
  },
  {
    id: 4,
    titel: '验证码',
    content: '123456',
    action: '重发',
  },
  {
    id: 5,
    titel: '验证码过期时间',
    content: '2019-6-20 13：00：00',
  },
  {
    id: 6,
    titel: '最后发送时间',
    content: '2019-6-20 12：00：00',
  },
  {
    id: 7,
    titel: '新手机',
    content: '1530077524',
  },
  {
    id: 8,
    titel: '验证码',
    content: '2019613',
  },
  {
    id: 9,
    titel: '验证码过期时间',
    content: '2019-6-20 13：00：00',
  },
  {
    id: 10,
    titel: '最后发送时间',
    content: '2019-6-20 13：00：00',
  },
  {
    id: 11,
    titel: '验证码',
    content: '159687',
    action: '完成',
  },
]

/** 认证数据 */
const idenData = [
  {
    id: 13,
    titel: '认证类型',
    content: '人员',
  },
  {
    id: 14,
    titel: '注册地址',
    content: '上海市松江区向民路6987号',
  },
  {
    id: 15,
    titel: '认证说明',
    content: '此处是认证说明此处是认证说明此处是认证说明此处是认证说明此处是认证说明',
  },
  {
    id: 16,
    titel: '附件',
    content: [
      {
        src: '/favicon.png',
        index: 111111111,
      }, {
        src: '/icons/icon-128x128.png',
        index: 222222222222,
      },
    ],
  },
]

/** 绑定售达方数据 */
const saleData = [
  {
    id: 17,
    titel: '售达方编号',
    content: '89666588554',
  },
  {
    id: 18,
    titel: '售达方名称',
    content: '某某某某某',
  },
  {
    id: 19,
    titel: '验证类型',
    content: '手机',
  },
  {
    id: 20,
    titel: '手机',
    content: '19500772581',
  },
  {
    id: 11,
    titel: '验证码',
    content: '159687',
    action: '完成',
  },
  {
    id: 9,
    titel: '验证码过期时间',
    content: '2019-6-20 13：00：00',
  },
  {
    id: 10,
    titel: '最后发送时间',
    content: '2019-6-20 13：00：00',
  },
];

/** 验证手机和邮箱 */
const idenPhoneData = [
  {
    id: 1,
    titel: '验证类型',
    content: '验证邮箱',
  },
  {
    id: 2,
    titel: '验证渠道',
    content: '登录验证',
  },
  {
    id: 20,
    titel: '手机',
    content: '19500772581',
  },
  {
    id: 21,
    titel: '邮箱',
    content: '65495887@qq.com',
  },
  {
    id: 11,
    titel: '验证码',
    content: '159687',
    action: '完成',
  },
  {
    id: 9,
    titel: '验证码过期时间',
    content: '2019-6-20 13：00：00',
  },
  {
    id: 10,
    titel: '最后发送时间',
    content: '2019-6-20 13：00：00',
  },
]

/** 个人认证 */
const idenPersonal = [
  {
    id: 111,
    titel: '名称',
    content: '王某某',
  },
  {
    id: 112,
    titel: '认证类型',
    content: '人员',
  },
  {
    id: 113,
    titel: '注册地址',
    content: '上海市松江区向民路6987号',
  },
  {
    id: 114,
    titel: '认证说明',
    content: '此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明此处为认证说明',
  },
  {
    id: 115,
    titel: '附件',
    content: [
      {
        src: '/favicon.png',
        index: 312,
      }, {
        src: '/icons/icon-128x128.png',
        index: 313,
      },
    ],
  },
]

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
      code: '123',
      name: '这里是图片',
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
          className={styles.xxx}
          title="认证历史（PI）"
          visible = {showList}
          onCancel={closeListForm}>
          <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={4}>状态：</Col>
                <Col span={20}>{dataList.status}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>操作人：</Col>
                <Col span={20}>{dataList.operatorName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>名称：</Col>
                <Col span={20}>{dataList.approverName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>收票方：</Col>
                <Col span={20}>{dataList.piCertification.invoicePartyName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>认证说明：</Col>
                <Col span={20}>{dataList.piCertification.note}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>附件：</Col>
                <Col span={20}>{dataList.attachmentList[0].name}</Col>
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

  /** props更新事调用 */
  componentWillReceiveProps (props) {
    let { showModal } = props;
    const { recordMsg, clickType } = props;
    if (recordMsg === undefined) {
      showModal = false;
    }
    this.setState({
      modal1Visible: showModal,
      recordMsg,
      clickType,
    });
  }

  /** 控制模态框状态 */
  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
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
    const changeData = [];
    let modelContent;
    const actionResent = <a onClick={e => { this.reSent(e) }}>重发</a>
    const actionFinesh = <Badge status="success" text="已完成" />
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
                <Col span={8}>变更类型：</Col>
                <Col span={16}>{changePhoneData.type}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>变更渠道：</Col>
                <Col span={16}>{changePhoneData.channel}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证方式：</Col>
                <Col span={16}>{changePhoneData.verifyType}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>原手机：</Col>
                <Col span={16}>{changePhoneData.oldMobilePhone}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码：</Col>
                <Col span={16}>
                  {changePhoneData.oldContactInfoVerifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                  <Badge
                    status={verifyData[changePhoneData.oldContactInfoVerifyStatus].value}
                    text={verifyData[changePhoneData.oldContactInfoVerifyStatus].text} />
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码过期时间：</Col>
                <Col span={16}>{changePhoneData.oldContactInfoVerifyCodeExpireDate}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>最后发送时间：</Col>
                <Col span={16}>{changePhoneData.oldContactInfoVerifyCodeLastSendDate}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>新手机：</Col>
                <Col span={16}>{changePhoneData.newMobilePhone}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码：</Col>
                <Col span={16}>
                  {changePhoneData.newContactInfoVerifyCode}&nbsp;&nbsp;
                    <a onClick={e => { this.reSent(e) }}>重发</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a onClick={e => { this.reSent(e) }}>完成验证</a>
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码过期时间：</Col>
                <Col span={16}>{changePhoneData.newContactInfoVerifyCodeExpireDate}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>最后发送时间：</Col>
                <Col span={16}>{changePhoneData.newContactInfoVerifyCodeLastSendDate}</Col>
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
              name: '这里是图片',
            },
          ],
        }

        modelContent = <>
          <ul className={styles.contenList}>
            <li>
              <Row>
                <Col span={4}>名称：</Col>
                <Col span={20}>{piData.organizationCertification.name}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>收票方：</Col>
                <Col span={20}>{piData.piCertification.invoicePartyName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>认证说明：</Col>
                <Col span={20}>{piData.piCertification.notes}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>附件：</Col>
                <Col span={20}>{piData.attachmentList[0].name}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={4}>
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
                <Col span={8}>送达方：</Col>
                <Col span={16}>{bindingData.shipToPartyCode} {bindingData.shipToPartyName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>售达方：</Col>
                <Col span={16}>{bindingData.soldToPartyCode} {bindingData.soldToPartyName}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证类型：</Col>
                <Col span={16}>{bindingData.type}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码：</Col>
                <Col span={16}>
                  {bindingData.verifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                  <Badge
                    status={verifyData[bindingData.status].value}
                    text={verifyData[bindingData.status].text} />
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码过期时间：</Col>
                <Col span={16}>{bindingData.expireDate}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>最后发送时间：</Col>
                <Col span={16}>{bindingData.lastSendDate}</Col>
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
                <Col span={8}>验证类型：</Col>
                <Col span={16}>{checkPhoneData.type}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证渠道：</Col>
                <Col span={16}>{checkPhoneData.channel}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>手机：</Col>
                <Col span={16}>{checkPhoneData.mobilePhone}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>邮箱：</Col>
                <Col span={16}>
                  {checkPhoneData.email}
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码：</Col>
                <Col span={16}>
                  {checkPhoneData.verifyCode}&nbsp;&nbsp;&nbsp;&nbsp;
                  <Badge
                    status={verifyData[checkPhoneData.status].value}
                    text={verifyData[checkPhoneData.status].text} />
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>验证码过期时间：</Col>
                <Col span={16}>{checkPhoneData.expireDate}</Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={8}>最后发送时间：</Col>
                <Col span={16}>{checkPhoneData.lastSendDate}</Col>
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
