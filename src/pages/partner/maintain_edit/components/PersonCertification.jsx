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

import PersonCertificationAddModal from './PersonCertificationAddModal';

const { Paragraph } = Typography;

class PersonCertification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      list: [
        {
          id: 1,
          title: '上海交通大学',
          description: '这是上海交通大学的认证说明，这是上海交通大学的认证说明，这是上海交通大学的认证说明，这是上海交通大学的认证说明，这是上海交通大学的认证说明，',
          state: 1,
          picList: [
            'https://blog.maxmeng.top/images/avatar.jpg',
          ],
        },
        {
          id: 2,
          title: '上海大学',
          description: '这是上海大学认证说明',
          state: 2,
          picList: [
            'https://blog.maxmeng.top/images/avatar.jpg',
          ],
        },
      ],
    };
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
                <a onClick={() => this.removeItem(item.id)}>删除</a>
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
              <img style={{ width: 80, height: 80 }} src={item.picList[0]} alt=""/>
            </div>
          </Card>
        </List.Item>
      );
    }

    return (
      <List.Item>
        <Button
          type="dashed"
          style={{ width: '100%', height: 274 }}
          onClick={() => this.handleModalVisible(true)}
        >
          <Icon type="plus" /> 提交认证
        </Button>
      </List.Item>
    );
  }

  handleModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag,
    });
  };

  removeItem = id => {
    const { list } = this.state;
    this.setState({
      list: list.filter(e => e.id !== id),
    });
  }

  handleAdd = data => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'listTableList/add',
    //   payload: {
    //     desc: fields.desc,
    //   },
    // });

    this.handleModalVisible();
    const obj = {
      id: Math.random(),
      title: data.shoupiaofang,
      description: data.shuoming,
      state: 2,
      picList: data.fujian.map(e => e.thumbUrl),
    };
    const { list } = this.state;
    this.setState({
      list: [...list, obj],
    });
  };

  render() {
    const { list, addModalVisible } = this.state;
    const nullData = {};

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

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
        <PersonCertificationAddModal {...parentMethods} modalVisible={addModalVisible}/>
      </Card>
    );
  }
}

export default PersonCertification;
