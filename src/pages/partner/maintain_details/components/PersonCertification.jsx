import { Button, Card, Icon, List, Typography, Divider, Badge } from 'antd';
import React from 'react';
import { connect } from 'dva';

import PersonCertificationAddModal from './PersonCertificationAddModal';

const { Paragraph } = Typography;

@connect(({ partnerMaintainEdit }) => ({
  details: partnerMaintainEdit.details || {},
  piCertification:
    (partnerMaintainEdit.details && partnerMaintainEdit.details.piCertification) || [],
}))
class PersonCertification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
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
              <img style={{ width: 80, height: 80 }} src={item.attachmentList[0].code} alt="" />
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
  };

  handleModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag,
    });
  };

  removeItem = id => {
    const { details, piCertification } = this.props;

    const data = piCertification.filter(e => e.id !== id);
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, piCertification: data },
    });
  };

  handleAdd = data => {
    const { details, piCertification } = this.props;

    const attachmentList = data.attachmentList.map(e => ({
      code: e.thumbUrl,
      name: e.name,
      type: e.type,
    }));
    this.handleModalVisible();
    const obj = {
      id: Math.random(),
      invoicePartyId: 123,
      invoicePartyCode: 12345,
      invoicePartyName: data.invoicePartyName,
      status: 1,
      notes: data.notes,
      attachmentList,
    };

    const newdata = [...piCertification, obj];
    this.props.dispatch({
      type: 'partnerMaintainEdit/setDetails',
      payload: { ...details, piCertification: newdata },
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
      <Card title="PI认证" bordered={false} style={{ marginBottom: '24px' }}>
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
        <PersonCertificationAddModal {...parentMethods} modalVisible={addModalVisible} />
      </Card>
    );
  }
}

export default PersonCertification;
