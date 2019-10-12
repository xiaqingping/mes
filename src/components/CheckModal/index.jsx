import { Modal, Badge, Form } from 'antd';
import React from 'react';
import styles from './index.less';

const FormItem = Form.Item;
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

const dataList = [
  {
    index: 0,
    title: '状态',
    content: '已完成（张三）',
  },
  {
    index: 1,
    title: '操作人',
    content: '李斯',
  },
  {
    index: 2,
    title: '名称',
    content: '王某某',
  },
  {
    index: 3,
    title: '认证类型',
    content: '人员',
  },
  {
    index: 4,
    title: '注册地址',
    content: '上海市松江区向民路6987号',
  },
  {
    index: 5,
    title: '认证说明',
    content: '此处为认证说明此处为认证说明此处为认证说明此处为认证说明',
  },
  {
    index: 6,
    title: '附件',
    content: '已完成',
  },
]

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
          title="认证记录"
          visible = {showList}
          onCancel={closeListForm}>
          <Form>
            <FormItem label="姓名">
              123
            </FormItem>
          </Form>
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
    const { recordMsg, clickType, showList } = this.state;
    let modalTitle;
    let changeData = [];
    const actionResent = <a onClick={e => { this.reSent(e) }}>重发</a>
    const actionFinesh = <Badge status="success" text="已完成" />
    if (recordMsg === undefined) {
      return false;
    }
    if (clickType === '01') { // 查看进来
      if (recordMsg.preType === 0 || recordMsg.preType === 1) {
        modalTitle = '变更已验证手机和邮箱'
        changeData = changeNumber;
      } else if (recordMsg.preType === 2) {
        modalTitle = '认证';
        changeData = idenData;
      } else if (recordMsg.preType === 3) {
        modalTitle = '绑定售达方';
        changeData = saleData;
      } else if (recordMsg.preType === 4 || recordMsg.preType === 5) {
        modalTitle = '验证手机和邮箱';
        changeData = idenPhoneData;
      }
    } else if (clickType === '02') { // 审核进来 下面为模拟不同的认证类型
      if (recordMsg.preType === 0 || recordMsg.preType === 1) { // 个人认证
        modalTitle = '认证（个人）';
        changeData = idenPersonal;
      } else if (recordMsg.preType === 2) {
        modalTitle = '认证';
        changeData = idenData;
      } else if (recordMsg.preType === 3) {
        modalTitle = '绑定售达方';
        changeData = saleData;
      } else if (recordMsg.preType === 4 || recordMsg.preType === 5) {
        modalTitle = '验证手机和邮箱';
        changeData = idenPhoneData;
      }
    }

    if (changeData.length === 0) {
      return false;
    }
    const modelContent = <>
      <Form labelAlign="left">
          {
            changeData.map(mes =>
            <Form.Item
              labelCol={ { span: 7 }}
              wrapperCol={{ span: 15 }}
              label={mes.titel}
              key={mes.id}>{
              mes.id === 16 || mes.id === 115 ? <>{mes.content.map(img => <><img className={styles.imgStyle} key={img.index} src={img.src} alt="认证附件"/></>)}</> : <> {mes.content}</>
            } {
              (mes.id === 4) && <>
              &nbsp;&nbsp;&nbsp;&nbsp; { actionResent }
            </>
            }
            {
              (mes.id === 11) && <>
              &nbsp;&nbsp;&nbsp;&nbsp; { actionFinesh }
              </>
            }
          </Form.Item>)
        }
        {
          ((recordMsg.preType === 0 || recordMsg.preType === 1) && (clickType === '02')) && <>
          <Form.Item>
            <a href="#" className={styles.recoedHis} onClick={this.recordList}>认证记录</a>
          </Form.Item>
          </>
        }
      </Form>
    </>
    return (
      <div style={{ position: 'absolute', right: 0 }} >
        <Modal
          className={styles.xxx}
          title={ modalTitle }
          footer={null}
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
        { modelContent }
        </Modal>
        <RecordListForm showList = {showList} closeListForm= {this.closeListForm}/>
      </div>
    )
  }
}
export default CheckModal;
