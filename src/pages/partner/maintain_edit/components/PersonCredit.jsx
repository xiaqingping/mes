import {
  Card,
  Divider,
  List,
} from 'antd';
import React from 'react';

class PersonCredit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderListItem = item => (
      <List.Item key={item.id}>
        <Card
          hoverable
          title={item.title}
          extra={
            <>
              <a>额度调整</a>
              <Divider type="vertical" />
              <a>临时额度</a>
            </>
          }
        >
          <span>2000 CNY 1天后调整</span><br/>
          <span>4000 CNY 25天后到期</span><br/>
          <span>开票后65天到期</span><br/>
          <span>每月5日开票</span>
        </Card>
      </List.Item>
    )

  render() {
    const list = [
      {
        id: 1,
        title: '上海交通大学',
      },
      {
        id: 2,
        title: '上海大学',
      },
    ];

    return (
      <Card
        title="信贷数据"
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        <List
          rowKey="id"
          grid={{
            gutter: 24,
            lg: 3,
            md: 2,
            sm: 1,
            xs: 1,
          }}
          dataSource={list}
          renderItem={this.renderListItem}
        />
      </Card>
    );
  }
}

export default PersonCredit;
