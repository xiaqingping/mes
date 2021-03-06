// 个人认证
import { Button, Card, List, Typography, Badge } from 'antd';
import React from 'react';
import { connect } from 'dva';
import api from '@/api';
import { formatter } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import { PlusOutlined } from '@ant-design/icons';
import CertificationPopover from '@/pages/partner/maintain_edit/components/CertificationPopover';
import PersonCertificationAddModal from './PersonCertificationAddModal';

const { Paragraph } = Typography;

@connect(({ partnerMaintainEdit, user, bp }) => ({
  details: partnerMaintainEdit.details || {},
  authorization: user.currentUser.authorization,
  PiCertificationStatus: bp.PiCertificationStatus,
}))
class PersonCertification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 新增PI认证模态框显示状态
      addModalVisible: false,
      editType: 'update',
      updateItemData: {},
      attachmentList: [],
      review: false,
    };
  }

  componentDidMount() {
    const { details } = this.props;
    if (details.piCertificationList.length !== 0) {
      const codeList = [];
      const attachmentList = [];
      details.piCertificationList.forEach(item => {
        codeList.push(item.attachmentCode);
        attachmentList.push({
          id: item.billToPartyId,
          status: item.status,
          billToPartyName: item.billToPartyName,
          notes: item.notes,
          pic: [],
          attachmentCode: item.attachmentCode,
        });
      });
      api.disk
        .getFiles({
          sourceKey: 'bp_pi_certification',
          sourceCode: codeList.join(','),
        })
        .then(v => {
          attachmentList.forEach((item, index) => {
            v.forEach(i => {
              if (i.sourceCode === item.attachmentCode) {
                attachmentList[index].pic.push(api.disk.downloadFiles(i.id, { view: true }));
              }
            });
          });
          this.setState({
            attachmentList,
          });
          // this.props.dispatch({
          //   type: 'partnerMaintainEdit/setDetails',
          //   payload: { ...details, attachmentList },
          // });
        });
    }
  }

  renderListItem = item => {
    const { details, PiCertificationStatus } = this.props;
    if (item && item.id) {
      return (
        <List.Item key={item.id}>
          <Card
            hoverable
            title={item.billToPartyName}
            extra={
              item.status === 1 ? (
                ''
              ) : (
                <>
                  <a onClick={() => this.removeItem(item)}>
                    {formatMessage({ id: 'action.delete' })}
                  </a>
                </>
              )
            }
          >
            <div style={{ marginBottom: '.8em' }}>
              <CertificationPopover basic={details.basic} billToPartyId={item.billToPartyId}>
                {/* <Badge
                  status={verifyStatus[item.status].value}
                  text={verifyStatus[item.status].text}
                /> */}
                <Badge
                  status={formatter(PiCertificationStatus, item.status, 'id', 'badge')}
                  text={formatMessage({
                    id: formatter(PiCertificationStatus, item.status, 'id', 'i18n'),
                  })}
                />
              </CertificationPopover>
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
              {item.pic.map((v, index) => (
                <img
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  style={{
                    width: 90,
                    height: 90,
                    margin: '0 20px 20px 0',
                    border: '1px #ECECEC solid',
                    padding: '5px',
                    borderRadius: '5px',
                  }}
                  src={v}
                  alt=""
                />
              ))}
            </div>
          </Card>
        </List.Item>
      );
    }

    if (details.basic.certificationStatus !== 2 && !this.state.review) {
      return (
        <List.Item>
          <Button
            type="dashed"
            style={{ width: '100%', height: 304 }}
            onClick={() => this.handleModalVisible(true)}
          >
            <PlusOutlined /> {formatMessage({ id: 'bp.newCertifications' })}
          </Button>
        </List.Item>
      );
    }
    return <List.Item />;
  };

  handleModalVisible = flag => {
    this.setState({
      addModalVisible: !!flag,
    });
  };

  // 删除项
  removeItem = item => {
    const { details } = this.props;
    const { attachmentList } = this.state;
    api.bp.cancelBPPiCertification({ id: details.basic.id, billToPartyId: item.id }).then(() => {
      const attachmentListData = attachmentList.filter(e => e.id !== item.id);

      const piCertificationList = details.piCertificationList.filter(
        e => e.billToPartyId !== item.id,
      );
      const creditList = details.creditList.filter(e => e.billToPartyId !== item.id);
      this.props.dispatch({
        type: 'partnerMaintainEdit/setDetails',
        payload: { ...details, piCertificationList, creditList },
      });

      this.setState({
        attachmentList: attachmentListData,
      });
    });
  };

  addNewItem = () => {
    this.setState({
      updateItemData: {},
    });
    this.handleModalVisible(true);
  };

  // 变更项
  // updateItem = data => {
  //   this.setState({
  //     updateItemData: data,
  //   });
  //   this.handleModalVisible(true);
  // };

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
    const { details } = this.props;
    const { editType, attachmentList } = this.state;

    // const has = details.attachmentList.filter(e => e.billToPartyId === data.billToPartyId);
    let newdata = [];
    const picList = [];
    if (data.attachmentList.length !== 0) {
      data.attachmentList.forEach(item => {
        picList.push(api.disk.downloadFiles(item.id, { view: true }));
      });
    }
    // if (has.length === 0) {
    const obj = {
      id: data.uuid,
      billToPartyId: data.billToPartyId,
      billToPartyCode: data.billToPartyCode,
      billToPartyName: data.billToPartyName,
      status: 3,
      notes: data.notes,
      pic: picList,
    };
    if (editType === 'update') {
      try {
        await api.bp.addBPPiCertification(details.basic.id, {
          attachmentCode: data.uuid,
          billToPartyId: data.billToPartyId,
          name: details.basic.name,
          notes: data.notes,
        });
        this.setState({
          review: true,
        });
        obj.status = 1;
      } catch (error) {
        return;
      }
    }
    newdata = [...attachmentList, obj];
    // } else {
    //   newdata = details.attachmentList.map(e => {
    //     if (e.billToPartyId === data.billToPartyId) return data;
    //     return e;
    //   });
    // }
    // const piCertificationListData = details.piCertificationList;
    // piCertificationListData.push({ id: 'new' })
    // this.props.dispatch({
    //   type: 'partnerMaintainEdit/setDetails',
    //   payload: {
    //     ...details,
    //     attachmentList: newdata,
    //     piCertificationList: piCertificationListData,
    //   },
    // });

    this.setState({
      attachmentList: newdata,
    });
  };

  render() {
    const { addModalVisible, updateItemData, attachmentList } = this.state;
    const nullData = {};
    return (
      <Card
        title={formatMessage({ id: 'bp.maintain_details.PI_verification' })}
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
          dataSource={[...attachmentList, nullData]}
          renderItem={this.renderListItem}
        />
        {addModalVisible ? (
          <PersonCertificationAddModal
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
