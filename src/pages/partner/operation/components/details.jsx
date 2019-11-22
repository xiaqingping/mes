import {
  Badge,
  Form,
  Table,
  Drawer,
} from 'antd';
import * as React from 'react';
import api from '@/api'
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
      width: 200,
      dataIndex: 'fieldName',
    },
    {
      title: '新值',
      width: 100,
      dataIndex: 'newValue',
    },
    {
      title: '旧值',
      width: 100,
      dataIndex: 'oldValue',
    },
    {
      title: '关键字',
      width: 100,
      dataIndex: 'keyword',
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'status',
      render(val) {
        return <Badge status={status[val].value} text={status[val].text}/>;
      },
    },
    {
      title: '验证记录编号',
      dataIndex: 'verifyRecordList',
      width: 140,
      render(val) {
        let data = '';
        // eslint-disable-next-line array-callback-return
        if (val) {
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
        // eslint-disable-next-line react/no-danger
        return <span dangerouslySetInnerHTML={{ __html: data }} />
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
            <Table dataSource={list} rowKey={(record, index) => index} columns={this.columns} size="small" pagination={false}/>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Details);
