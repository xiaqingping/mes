import {
  Badge,
  Form,
  Table,
  Drawer,
} from 'antd';
import * as React from 'react';
import api from '@/api'
import { formatMessage } from 'umi-plugin-react/locale';
import './style.less'

// 状态
const status = {
  1: {
    value: 'default',
    text: '未完成',
  },
  2: {
    value: 'success',
    text: '已完成',
  },
  3: {
    value: 'warning',
    text: '待验证',
  },
  4: {
    value: 'error',
    text: '已拒绝',
  },
};

class Details extends React.Component {
  state = {
    visible: false,
    list: [],
  };

  columns = [
    {
      title: '字段',
      dataIndex: 'fieldName',
      render: text => <div className="addEllipsis"
      style={{ width: '100px' }} title={text}>{text}</div>,
    },
    {
      title: '新值',

      dataIndex: 'newValue',
      render: text => <div className="addEllipsis"
      style={{ width: '50px' }} title={text}>{text}</div>,
    },
    {
      title: '旧值',
      dataIndex: 'oldValue',
      render: text => <div className="addEllipsis"
      style={{ width: '50px' }} title={text}>{text}</div>,
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      render: text => <div className="addEllipsis"
      style={{ width: '50px' }} title={text}>{text}</div>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return <Badge className="addEllipsis"
        style={{ width: '80px' }} status={status[val].value} text={status[val].text}/>;
      },
    },
    {
      title: '验证记录编号',
      dataIndex: 'verifyRecordList',
      render(val) {
        let data = '';
        if (val) {
          // eslint-disable-next-line array-callback-return
          val.map((item, index) => {
              if (item.code) {
                if (index < 2) {
                  data += `${item.code}<br/>`
                } else {
                  data += '……'
                }
              }
            },
          )
        }
        return <span className="addEllipsis"
         // eslint-disable-next-line react/no-danger
         style={{ width: '80px' }} dangerouslySetInnerHTML={{ __html: data }} />
      },
    },
  ];

  componentWillReceiveProps (nextProps) {
    const { detailsVisible } = nextProps;
    const { detailsValue } = nextProps;
    this.setState({
      visible: detailsVisible,
    })
    this.getData(detailsValue);
  }

  getData = detailsValue => {
    if (detailsValue) {
      api.bp.getOperationItems(detailsValue.id).then(res => {
        // eslint-disable-next-line array-callback-return
        res.map((item, index) => {
          res[index].fieldName = formatMessage({ id: item.fieldName })
        })
        this.setState({
          list: res,
        })
      })
    }
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.props.detailsVisibleClose(false)
    this.setState({
      visible: false,
    });
  };

  render() {
    const { list, visible } = this.state;
    return (
      <div>
        <Drawer
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={visible}
          width= "600"
          className="myTables"
        >
            <Table dataSource={list} rowKey={(record, index) => index}
            columns={this.columns} size="small" pagination={false}/>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Details);
