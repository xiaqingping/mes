/**
 * PI认证
 */
import { Button, Card, Icon, List, Typography, Divider, Badge, Upload, Empty } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import CertificationPopover from './CertificationPopover';
import PICertificationAddModal from './PICertificationAddModal';
import api from '@/api';

const { Paragraph } = Typography;

@connect(({ bpEdit, user }) => ({
  details: bpEdit.details || {},
  editType: bpEdit.editType,
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
      // id: 0,
      // 修改PI认证时传的数据
      updateItemData: {},
    };
  }

  renderListItem = item => {
    const { editType, details } = this.props;
    const { basic } = details;
    let fileList = [];
    if (item && item.attachmentList) {
      fileList = item.attachmentList.map(e => ({
        uid: e.id,
        name: e.name,
        status: 'done',
        url: api.disk.downloadFiles(e.id, { view: true }),
      }));
    }

    if (item && item.billToPartyId) {
      return (
        <List.Item key={item.billToPartyId}>
          <Card
            hoverable
            title={item.billToPartyName}
            extra={
              <>
                {editType === 'add' ? (
                  <>
                    <a onClick={() => this.updateItem(item)}>
                      <FormattedMessage id="bp.maintain_details.change" />
                    </a>
                    <Divider type="vertical" />
                  </>
                ) : null}
                {item.status !== 1 ? (
                  <a onClick={() => this.removeItem(item)}>
                    <FormattedMessage id="action.delete" />
                  </a>
                ) : null}
              </>
            }
          >
            <div style={{ marginBottom: '.8em' }}>
              {item.status === 1 ? (
                <CertificationPopover
                  id={basic.id}
                  type={basic.type}
                  billToPartyId={item.billToPartyId}
                >
                  <Badge status="warning" text="审核中" />
                </CertificationPopover>
              ) : null}
              {item.status === 2 ? (
                <CertificationPopover
                  id={basic.id}
                  type={basic.type}
                  billToPartyId={item.billToPartyId}
                >
                  <Badge status="success" text="已认证" />
                </CertificationPopover>
              ) : null}
              {item.status === 3 ? <Badge status="default" text="未认证" /> : null}
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
              <Upload
                listType="picture-card"
                fileList={fileList}
                showUploadList={{
                  showRemoveIcon: false,
                  showDownloadIcon: false,
                }}
              />
            </div>
          </Card>
        </List.Item>
      );
    }

    // BP审核中，editType=update时，不可提交新认证
    if (editType === 'update' && details.basic.certificationStatus === 2) return <></>;

    return (
      <List.Item>
        <Button type="dashed" style={{ width: '100%', height: 274 }} onClick={this.addNewItem}>
          <Icon type="plus" />
          <FormattedMessage id="bp.maintain_details.PI_verification.submit_certification" />
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
  // editType=add 直接删除
  // editType=update 接口单个删除
  removeItem = async item => {
    const { id, billToPartyId } = item;
    const { details, piCertificationList, editType } = this.props;
    let flag = true;

    if (editType === 'update') {
      try {
        await api.bp.cancelBPPiCertification({ id: details.basic.id, billToPartyId });
      } catch (error) {
        flag = false;
      }
    }

    if (!flag) return;

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

  handleAdd = async data => {
    this.handleModalVisible();
    const { details, piCertificationList, editType } = this.props;

    const obj = {
      uuid: data.uuid,
      billToPartyId: data.billToPartyId,
      billToPartyCode: data.billToPartyCode,
      billToPartyName: data.billToPartyName,
      status: 3,
      notes: data.notes,
      attachmentList: data.attachmentList,
    };
    if (editType === 'update') {
      try {
        await api.bp.addBPPiCertification(details.basic.id, {
          attachmentCode: data.uuid,
          billToPartyId: data.billToPartyId,
          name: details.basic.name,
          notes: data.notes,
        });
        obj.status = 1;
      } catch (error) {
        return;
      }
    }

    const has = piCertificationList.some(e => e.billToPartyId === obj.billToPartyId);
    let newdata = [];

    if (!has) {
      newdata = [...piCertificationList, obj];
    } else {
      newdata = piCertificationList.map(e => {
        if (e.billToPartyId === data.billToPartyId) return data;
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
    const { piCertificationList, details } = this.props;
    const { addModalVisible, updateItemData } = this.state;
    const nullData = {};
    const { basic } = details;

    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.PI_verification' })}
        bordered={false}
        style={{ marginBottom: '24px' }}
      >
        {basic.id && piCertificationList.length === 0 && true ? (
          <Empty />
        ) : (
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
        )}
        {addModalVisible ? (
          <PICertificationAddModal
            details={details}
            visible={addModalVisible}
            onOk={this.okHandle}
            onCancel={() => this.handleModalVisible(false)}
            data={updateItemData}
            wrappedComponentRef={ref => {
              this.PICertificationAddModal = ref;
            }}
          />
        ) : null}
      </Card>
    );
  }
}

export default PersonCertification;
