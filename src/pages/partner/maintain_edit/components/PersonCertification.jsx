import {
  Button,
  Card,
  Icon,
  List,
  Typography,
  Divider,
  Badge,
} from 'antd';
import React from 'react';

const { Paragraph } = Typography;

class PersonCertification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderListItem = item => {
    if (item && item.id) {
      return (
        <List.Item key={item.id}>
          <Card
            hoverable
            title={item.title}
            extra={
              <>
                <a>变更</a>
                <Divider type="vertical" />
                <a>删除</a>
              </>
            }
          >
            <div style={{ marginBottom: '.8em' }}>
              <Badge status="success" /> 未认证
            </div>
            <Paragraph
              style={{ minHeight: 42 }}
              ellipsis={{
                rows: 2,
              }}
            >
              {item.description}
            </Paragraph>
            <div>
              <img style={{ width: 80, height: 80 }} src="https://blog.maxmeng.top/images/avatar.jpg" alt=""/>
            </div>
          </Card>
        </List.Item>
      );
    }

    return (
      <List.Item>
        <Button type="dashed" style={{ width: '100%', height: 274 }}>
          <Icon type="plus" /> 提交认证
        </Button>
      </List.Item>
    );
  }

  render() {
    const nullData = {};
    const list = [
      {
        id: 1,
        title: '上海交通大学',
        description: '这是上海交通大学的认证说明，这是上海交通大学的认证说明，这是上海交通大学的认证说明，这是上海交通大学的认证说明，这是上海交通大学的认证说明，',
        state: 1,
        picList: [],
      },
      {
        id: 2,
        title: '上海大学',
        description: '这是上海大学认证说明',
        state: 2,
        picList: [],
      },
    ];

    return (
      <Card
        title="PI认证"
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
          dataSource={[...list, nullData]}
          renderItem={this.renderListItem}
        />
      </Card>
    );
  }
}

export default PersonCertification;
