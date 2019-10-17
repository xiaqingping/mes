import {
  Badge,
  Form,
  Table,
  Drawer,
} from 'antd';
import * as React from 'react';
// import api from '@/api'
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
    text: '验证失败',
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
    },
    {
      title: '新值',
      dataIndex: 'newValue',
    },
    {
      title: '旧值',
      dataIndex: 'oldValue',
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={status[val].value} text={status[val].text}/>;
      },
    },
    {
      title: '验证记录编号',
      dataIndex: 'checkCode',
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
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        id: i + 1,
        fieldName: 100000 + (i + 1),
        newValue: detailsValue ? detailsValue.huoban : '',
        oldValue: detailsValue ? detailsValue.actionman : '',
        keyword: `${Math.ceil((Math.random() + 0.0001) * 10000)}/${Math.ceil((Math.random() + 0.0001) * 100)}`,
        status: Math.ceil((Math.random() + 0.0001) * 4),
        checkCode: Math.ceil((Math.random() + 0.0001) * 100000000),
      });
    }
    this.setState({
        list: data,
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
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
            <Table dataSource={list} columns={this.columns} size="small" pagination={false}/>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Details);
