import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
  Table,
  AutoComplete,
  Drawer,
} from 'antd';
import * as React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import api from '@/api'
import styles from './style.less'

const FormItem = Form.Item;

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
    text: '部分完成',
  },
};

class Details extends React.Component {
  state = {
    visible: this.props.detailsVisible,
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
      align: 'center',
      render(val) {
        return <Badge status={status[val].value} text={status[val].text}/>;
      },
    },
    {
      title: '验证记录编号',
      dataIndex: 'check_code',
    },
  ];

  // componentDidMount() {
  //   // this.getTableData();
  //   this.getData();
  // }

  getData = () => {
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        id: i + 1,
        field: 100000 + (i + 1),
        new_value: this.props.content.huoban,
        old_value: this.props.contant.actionman,
        key: `${Math.ceil((Math.random() + 0.0001) * 10000)}/${Math.ceil((Math.random() + 0.0001) * 100)}`,
        status: Math.ceil((Math.random() + 0.0001) * 3),
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
        >
            <Table className={styles.tableName} dataSource={list} columns={this.columns} size="small"/>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(Details);
