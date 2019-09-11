import {
  Badge,
  Form,
  Table,
  Input,
  Drawer,
} from 'antd';
import * as React from 'react';
// import api from '@/api'
import styles from './style.less'

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
      dataIndex: 'field',
    },
    {
      title: '新值',
      dataIndex: 'new_value',
    },
    {
      title: '旧值',
      dataIndex: 'old_value',
    },
    {
      title: '关键字',
      dataIndex: 'key',
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
      dataIndex: 'check_code',
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
        field: 100000 + (i + 1),
        new_value: detailsValue ? detailsValue.huoban : '',
        old_value: detailsValue ? detailsValue.actionman : '',
        key: `${Math.ceil((Math.random() + 0.0001) * 10000)}/${Math.ceil((Math.random() + 0.0001) * 100)}`,
        status: Math.ceil((Math.random() + 0.0001) * 4),
        check_code: Math.ceil((Math.random() + 0.0001) * 100000000),
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
            <Table dataSource={list} columns={this.columns} size="small" pagination={{ pageSize: 20 }}/>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Details);
