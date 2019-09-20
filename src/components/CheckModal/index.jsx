import { Modal, Badge } from 'antd';
import React from 'react';
import styles from './index.less';

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
        key: 111111111,
      }, {
        src: '/icons/icon-128x128.png',
        key: 222222222222,
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
class CheckModal extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modal1Visible: false,
      recordMsg: undefined,
    }
  }

  /** props更新事调用 */
  componentWillReceiveProps (props) {
    let { showModal } = props;
    const { recordMsg } = props;
    if (recordMsg === undefined) {
      showModal = false
    }
    this.setState({
      modal1Visible: showModal,
      recordMsg,
    });
  }

  /** 控制模态框状态 */
  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
  }

    /** 重发验证码 */
    reSent = event => {
      event.preventDefault();
    }

  render () {
    const { recordMsg } = this.state;
    let modalTitle;
    let changeData = [];
    const actionResent = <a onClick={e => { this.reSent(e) }}>重发</a>
    const actionFinesh = <Badge status="success" text="已完成" />
    if (recordMsg === undefined) {
      return false;
    }
    if (recordMsg.preType === 0 || recordMsg.preType === 1) {
      modalTitle = '变更已验证手机和邮箱'
      changeData = changeNumber;
    } else if (recordMsg.preType === 2) {
      modalTitle = '认证';
      changeData = idenData
    } else if (recordMsg.preType === 3) {
      modalTitle = '绑定售达方';
      changeData = saleData;
    } else if (recordMsg.preType === 4 || recordMsg.preType === 5) {
      modalTitle = '验证手机和邮箱';
      changeData = idenPhoneData;
    }

    if (changeData.length === 0) {
      return false;
    }
   const modelContent = <>
    <ul className={styles.contenList}>
      {
        changeData.map(mes => <li key={mes.id}>{mes.titel}：{
          mes.id === 16 ? <>{mes.content.map(img => <><img className={styles.imgStyle} key={img.key} src={img.src} alt="认证附件"/></>)}</> : <> {mes.content}</>
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
      </li>)
      }
    </ul>
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
      </div>
    )
  }
}
export default CheckModal;
