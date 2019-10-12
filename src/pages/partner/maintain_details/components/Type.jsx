import {
  Card,
  Descriptions,
  Table,
  Tabs,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import './style.less'

const { TabPane } = Tabs;

const DescriptionsItem = Descriptions.Item;

const tabListNoTitle = [
  {
    key: '1',
    tab: '生工国内电商',
  },
  {
    key: '2',
    tab: '生工国外电商',
  },
  {
    key: '3',
    tab: '生工国内直销',
  },
  {
    key: '4',
    tab: '生工国外直销',
  },
];

// 状态
const status = {
  1: {
    value: 'warning',
    text: '验证中',
  },
  2: {
    value: 'success',
    text: '已验证',
  },
};

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    noTitleKey: '1',
    list: [],
  }

  columns1 = [
    {
      title: '名称',
      width: 500,
      dataIndex: 'name',
    },
    {
      title: '售达方',
      width: 500,
      dataIndex: 'saler_name',
    },
    {
      title: '状态',
      width: 400,
      dataIndex: 'status',
      render(val) {
        return <Badge status={status[val].value} text={status[val].text}/>;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
          <a>删除</a>
        ),
    },
  ];

  columns2 = [
    {
      title: '名称',
      width: 500,
      dataIndex: 'name',
    },
    {
      title: '状态',
      width: 600,
      dataIndex: 'status',
      render(val) {
        return <Badge status={status[val].value} text={status[val].text}/>;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
          <a>删除</a>
        ),
    },
  ];

  columns3 = [
    {
      title: '名称',
      width: 700,
      dataIndex: 'name',
    },
    {
      title: '状态',
      width: 400,
      dataIndex: 'status',
      render(val) {
        return <Badge status={status[val].value} text={status[val].text}/>;
      },
    },
    {
      align: 'center',
      title: '操作',
      render: (text, record) => (
          <a>删除</a>
        ),
    },
  ];

  columns4 = [
    {
      title: '名称',
      width: 1200,
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: '操作',
      render: (text, record) => (
          <a>变更</a>
        ),
    },
  ];

  componentWillMount () {
    this.getData()
  }

  getData = () => {
    const data = [];
    for (let i = 0; i < 5; i++) {
      data.push({
        name: `${Math.ceil((Math.random() + 0.0001) * 100000000)} 上海复旦大学`,
        saler_name: `${Math.ceil((Math.random() + 0.0001) * 100000000)} 交通大学售达方`,
        status: Math.ceil((Math.random() + 0.0001) * 2),
      });
    }
    this.setState({
        list: data,
    });
  };

  onTabChange = key => {
    this.setState({
      noTitleKey: key,
    });
  }

  render() {
    const { list } = this.state;
    return (
      <Card
        title="销售范围"
        className="check-tabs"
        bordered={false}
        style={{ width: '100%', marginBottom: '24px' }}
        tabList={tabListNoTitle}
        activeTabKey={this.state.noTitleKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={5}
        >
          <DescriptionsItem label="网点归属">华东大区/山东网点</DescriptionsItem>
          <DescriptionsItem label="默认付款方式">银行付款</DescriptionsItem>
          <DescriptionsItem label="币种">意大利里拉</DescriptionsItem>
          <DescriptionsItem label="销售冻结">活跃</DescriptionsItem>
          <DescriptionsItem label="默认开票类型">增值税专用发票</DescriptionsItem>
        </Descriptions>
        <div style={{ border: '1px solid #E6E6E6', width: '100%', height: '100%' }}>
          <Tabs defaultActiveKey="1" className="tabs">
            <TabPane tab="收票方" key="1">
              <Table dataSource={list} columns={this.columns1} size="small" pagination={false} rowKey={(r, i) => (i)}/>
            </TabPane>
            <TabPane tab="售达方" key="2">
            <Table dataSource={list} columns={this.columns2} size="small" pagination={false} rowKey={(r, i) => (i)}/>
            </TabPane>
            <TabPane tab="送达方" key="3">
            <Table dataSource={list} columns={this.columns3} size="small" pagination={false} rowKey={(r, i) => (i)}/>
            </TabPane>
            <TabPane tab="销售员" key="4">
            <Table dataSource={list} columns={this.columns4} size="small" pagination={false} rowKey={(r, i) => (i)}/>
            </TabPane>
          </Tabs>
        </div>


      </Card>
    );
  }
}

export default BasicInfo;
