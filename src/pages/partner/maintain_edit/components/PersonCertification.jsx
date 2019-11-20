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
import { connect } from 'dva';

import PersonCertificationAddModal from './PersonCertificationAddModal';
import disk from '@/api/disk';

const { Paragraph } = Typography;

@connect(({ bpEdit, user }) => ({
  details: bpEdit.details || {},
  // eslint-disable-next-line max-len
  piCertification: (bpEdit.details && bpEdit.details.piCertification) || [],
  authorization: user.currentUser.authorization,
}))
class PersonCertification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      id: 0,
    };
  }

  renderListItem = item => {
    if (item && item.id) {
      return (
        <List.Item key={item.id}>
          <Card
            hoverable
            title={item.invoicePartyName}
            extra={
              <>
                <a>变更</a>
                <Divider type="vertical" />
                <a onClick={() => this.removeItem(item.id)}>删除</a>
              </>
            }
          >
            <div style={{ marginBottom: '.8em' }}>
              <Badge status="default" text="未认证" />
            </div>
            <Paragraph
              style={{ minHeight: 42 }}
              ellipsis={{
                rows: 2,
              }}
            >
              {item.notes}
            </Paragraph>
            <div>
              {
                item.attachmentList.map(pic => {
                  const url = disk.downloadFiles(pic.code, { view: true });
                  return <img
                    key={pic.code}
                    style={{ width: 80, height: 80, marginRight: 5 }}
                    src={url}
                    alt={pic.name}
                  />;
                })
              }
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
    const { details, piCertification } = this.props;

    const data = piCertification.filter(e => e.id !== id);

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: { ...details, piCertification: data },
      },
    });
  }

  handleAdd = data => {
    const { details, piCertification } = this.props;
    const { id } = this.state;

    const attachmentList = data.attachmentList.map(e => ({
      code: (e.response && e.response[0]) || '',
      name: e.name,
      type: e.type,
    }));
    this.handleModalVisible();
    const newId = id - 1;

    this.setState({ id: newId });

    const obj = {
      id: newId,
      invoicePartyId: 123,
      invoicePartyCode: 12345,
      invoicePartyName: data.invoicePartyName,
      status: 1,
      notes: data.notes,
      attachmentList,
    };

    const newdata = [...piCertification, obj];

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: { ...details, piCertification: newdata },
      },
    });
  };

  render() {
    const { piCertification } = this.props;
    const { addModalVisible } = this.state;
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
          dataSource={[...piCertification, nullData]}
          renderItem={this.renderListItem}
        />
        <PersonCertificationAddModal {...parentMethods} modalVisible={addModalVisible}/>
      </Card>
    );
  }
}

export default PersonCertification;
