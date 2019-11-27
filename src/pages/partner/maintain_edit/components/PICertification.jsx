import { Button, Card, Icon, List, Typography, Divider, Badge, Modal } from 'antd';
import React from 'react';
import { connect } from 'dva';

import AddPICertification from './PICertificationAddModal';
import disk from '@/api/disk';

const { Paragraph } = Typography;

@connect(({ bpEdit, user }) => ({
  details: bpEdit.details || {},
  piCertificationList: (bpEdit.details && bpEdit.details.piCertificationList) || [],
  authorization: user.currentUser.authorization,
}))
class PersonCertification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 新增PI认证模态框显示状态
      addModalVisible: false,
      // 自增ID
      id: 0,
      // 修改PI认证时传的数据
      updateItemData: {},
    };
  }

  renderListItem = item => {
    if (item && item.id) {
      return (
        <List.Item key={item.id}>
          <Card
            hoverable
            title={item.billToPartyName}
            extra={
              <>
                <a onClick={() => this.updateItem(item)}>变更</a>
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
              {item.attachmentList.map(pic => {
                const url = disk.downloadFiles(pic.code, { view: true });
                return (
                  <img
                    key={pic.code}
                    style={{ width: 80, height: 80, marginRight: 5 }}
                    src={url}
                    alt={pic.name}
                  />
                );
              })}
            </div>
          </Card>
        </List.Item>
      );
    }

    return (
      <List.Item>
        <Button type="dashed" style={{ width: '100%', height: 274 }} onClick={this.addNewItem}>
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

  // 删除项
  removeItem = id => {
    const { details, piCertificationList } = this.props;

    const data = piCertificationList.filter(e => e.id !== id);

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: { ...details, piCertificationList: data },
      },
    });
  };

  addNewItem = () => {
    this.setState({
      updateItemData: {},
    });
    this.handleModalVisible(true);
  };

  // 变更项
  updateItem = data => {
    this.setState({
      updateItemData: data,
    });
    this.handleModalVisible(true);
  };

  okHandle = () => {
    const content = this.PICertificationAddModal.wrappedInstance;
    const { form } = content.props;
    const { billToParty, uuid } = content.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      this.handleAdd({ ...fieldsValue, ...billToParty, uuid });
    });
  };

  handleAdd = data => {
    const { details, piCertificationList } = this.props;
    const { id } = this.state;

    this.handleModalVisible();
    const newId = id - 1;

    this.setState({ id: newId });

    const obj = {
      id: newId,
      uuid: data.uuid,
      billToPartyId: data.billToPartyId,
      billToPartyCode: data.billToPartyCode,
      billToPartyName: data.billToPartyName,
      status: 1,
      notes: data.notes,
      attachmentList: data.attachmentList,
    };

    let newdata = [...piCertificationList, obj];
    if (data.id) {
      newdata = piCertificationList.map(e => {
        if (e.id === data.id) return data;
        return e;
      });
    }

    this.props.dispatch({
      type: 'bpEdit/setState',
      payload: {
        type: 'details',
        data: { ...details, piCertificationList: newdata },
      },
    });
  };

  render() {
    const { piCertificationList } = this.props;
    const { addModalVisible, updateItemData } = this.state;
    const nullData = {};

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      data: updateItemData,
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
          dataSource={[...piCertificationList, nullData]}
          renderItem={this.renderListItem}
        />
        <Modal
          destroyOnClose
          title="PI认证"
          visible={addModalVisible}
          onOk={this.okHandle}
          onCancel={() => this.handleModalVisible(false)}
        >
          <AddPICertification
            {...parentMethods}
            wrappedComponentRef={ref => {
              this.PICertificationAddModal = ref;
            }}
          />
        </Modal>
      </Card>
    );
  }
}

export default PersonCertification;
