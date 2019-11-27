/* eslint-disable radix */
import {
  Modal,
  Form,
  Input,
  Upload,
  Icon,
  message,
  Row,
  Col,
  List,
  Select,
  Switch,
  Cascader,
  Card,
  Divider,
  Badge,
  Button,
  Typography,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { TelphoneInput } from '@/components/CustomizedFormControls';
import api from '@/api';
import './index.less';
import disk from '@/api/disk';
import { guid } from '@/utils/utils';
import PersonCertificationAddModal from
'@/pages/partner/maintain_details/components/PersonCertificationAddModal';

const { Paragraph } = Typography;
const FormItem = Form.Item;
const InputGroup = Input.Group;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

const formItemLayoutGroup = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 16 },
  },
};

const renzhengMap = {
  1: {
    value: 'default',
    text: '未认证',
  },
 2: {
    value: 'processing',
    text: '审核中',
  },
  4: {
    value: 'success',
    text: '已认证',
  },
  3: {
    value: 'warning',
    text: '部分认证',
  },
};

const formItemLayoutEng = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 20 },
  },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class NameGroup extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor (props) {
    super(props);
    const value = props.value || {};
    const { name, type } = props;
    this.state = {
      type: value.type || type,
      name: value.name || name,
    }
    this.valueChange({ type: this.state.type });
    this.valueChange({ name: this.state.name });
  }

  valueChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  }

  render () {
    const { type, name } = this.state;
    return (
      <InputGroup compact>
        <Select value={type} placeholder="请选择类型"
        style={{ width: '20%' }} onChange={val => this.valueChange({ type: val })}>
          <Option value="personal"><Icon type="user" /> 人员</Option>
          <Option value="group"><Icon type="home" /> 组织</Option>
        </Select>
        <Input
          value={name}
          style={{ width: '80%' }}
          placeholder="请输入名称"
          onChange={e => this.valueChange({ name: e.target.value })}
          validatestatus="error"
          help="Should be combination of numbers & alphabets"/>
      </InputGroup>
    )
  }
}

class AddressGroup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      countryCode: [],
      popupVisible: false,
    };
  }

  componentWillMount () {
    api.area.byParentIdGetArea(0).then(res => { this.setState({ countryCode: res }) })
  }

  // 选择地区
  // eslint-disable-next-line consistent-return
  selectArea = (v, o) => {
    if (o.length === 0) return false;
    const { countryCode } = this.state;
    if (o[o.length - 1].isHaveLow === 2) {
      this.setState({
        popupVisible: false,
      })
      this.passVal(o, 1);
      return false;
    }
    if (parseInt(o[0].isHaveLow, 10) === 1) {
      api.area.byParentIdGetArea(o[o.length - 1].id).then(res => {
        // eslint-disable-next-line array-callback-return
        countryCode.map((item1, key1) => {
          if (item1.code === v[0]) {
            // countryCode[key].push({ children: res })
            if (parseInt(item1.level, 10) === 1 && parseInt(res[0].level, 10) === 2) {
              countryCode[key1].children = res;
            }
            if (parseInt(res[0].level, 10) > 2) {
              // eslint-disable-next-line array-callback-return
              item1.children.map((item2, key2) => {
                if (item2.code === v[1]) {
                  if (parseInt(item2.level, 10) === 2 && parseInt(res[0].level, 10) === 3) {
                    countryCode[key1].children[key2].children = res;
                  }
                  if (parseInt(res[0].level, 10) > 3) {
                    // eslint-disable-next-line array-callback-return
                    item2.children.map((item3, key3) => {
                      if (item3.code === v[2]) {
                        if (parseInt(item3.level, 10) === 3 && parseInt(res[0].level, 10) === 4) {
                          countryCode[key1].children[key2].children[key3].children = res;
                        }
                        if (parseInt(res[0].level, 10) > 4) {
                          // eslint-disable-next-line array-callback-return
                          item3.children.map((item4, key4) => {
                            if (item4.code === v[3]) {
                              if (parseInt(item4.level, 10) === 4
                              && parseInt(res[0].level, 10) === 5) {
                                countryCode[key1].children[key2].children[key3]
                                .children[key4].children = res;
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
        this.setState({
          countryCode,
        })
      })
    }
  }

  // 传递省市区和详细地址的值
  passVal = (address, type) => {
    this.props.addressVal(address, type)
  }

  render () {
    const { countryCode, popupVisible } = this.state;
    return (
      <InputGroup compact>
        <Cascader style={{ width: '40%' }}
        onChange={(value, selectedOptions) => this.selectArea(value, selectedOptions)}
        options={countryCode} placeholder="请选择" fieldNames={{ label: 'name', value: 'code' }}
        popupVisible={popupVisible}
        onClick={() => { this.setState({ popupVisible: !popupVisible }) }}
        />
        <Input style={{ width: '60%' }}
        placeholder="详细地址"
        onChange={e => this.passVal(e.target.value, 2)}
        />
      </InputGroup>
    )
  }
}

@connect(({ basicCache, user, partnerMaintain, partnerMaintainEdit }) => {
  // const industryCategories = basicCache.industryCategories.filter(
  //   e => e.languageCode === global.languageCode,
  // );
  const industryCategories = partnerMaintainEdit.Industry;
  return {
    industryCategories,
    countryDiallingCodes: basicCache.countryDiallingCodes,
    authorization: user.currentUser.authorization,
    details: partnerMaintain.details,
  };
})
class ChangeModal extends Component {
    constructor (props) {
      super(props);
      this.state = {
        changeModal: false,
        recordMsg: undefined,
        form: this.props.form,
        loading: false,
        personalShow: true,
        groupNameShow: true,
        groupAdressShow: true,
        groupIndustryShow: true,
        groupUsaShow: true,
        name: '',
        userData: [],
        submitNext: 1,
        specialInvoice: false,
        addModalVisible: false,
        area: [],
        address: '',
      }
    }

    componentDidMount() {
      this.props.onRef(this)
      this.props.dispatch({
        type: 'basicCache/setState',
        payload: { type: 'countryDiallingCodes' },
      })
    }

    /** props更新时调用 */
    visibleShow = (changeModal, recordMsg) => {
      if (recordMsg) {
        if (recordMsg.type === 1) {
          api.bp.getBPPiCertification(recordMsg.id).then(res => {
            this.setState({
              userData: res,
            })
          })
        } else {
          api.bp.getBPOrgCertification(recordMsg.id).then(res => {
            this.setState({
              userData: res,
              specialInvoice: res.organizationCertification
              ? parseInt(res.organizationCertification.specialInvoice)
              === 1 : false,
            })
          })
        }
        this.setState({
          changeModal,
          recordMsg,
          loading: false,
        });
      }
    }

    handleOk = e => {
      if (e) e.preventDefault();
      const { address, area, recordMsg } = this.state;
      this.props.form.validateFields((error, row) => {
        if (error) return;
        let data = {};
        data = {
          basic: {
            id: recordMsg.id,
            name: row.msg.name,
            countryCode: area[0] ? area[0].code : '',
            provinceCode: area[1] ? area[1].code : '',
            cityCode: area[2] ? area[2].code : '',
            countyCode: area[3] ? area[3].code : '',
            streetCode: area[4] ? area[4].code : '',
            address,
            industryCode: row.industryCode,
            telephoneCountryCode: row.phoneNum.telephoneCountryCode,
            telephoneAreaCode: row.phoneNum.telephoneAreaCode,
            telephone: row.phoneNum.telephone,
            telephoneExtension: row.phoneNum.telephoneExtension,
          },
          organizationCertification: {
            specialInvoice: row.specialInvoice ? 1 : 2,
            taxNo: row.taxNo,
            bankCode: row.bankCode,
            bankAccount: row.bankAccount,
            address: row.regisAddress,
            notes: row.notes,
            attachmentList: row.idenImg,
          },
        }
        api.bp.updateBPOrgCertification(data).then(res => {
          console.log(res)
        })
      });
    }

    addressVal = (address, type) => {
      if (type === 1) {
        this.setState({
          area: address,
        })
      }
      if (type === 2) {
        this.setState({
          address,
        })
      }
    }

    handleCancel = () => {
      this.setState({
        changeModal: false,
        recordMsg: null,
        personalShow: true,
        groupNameShow: true,
        groupAdressShow: true,
        groupIndustryShow: true,
        groupUsaShow: true,
        submitNext: 1,
        userData: [],
      })
    }

    /** 上传图片 */
    handleChange = info => {
      // const data = [];
      console.log(info)
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrl,
            loading: false,
          }),
        );
        if (info.file.response) {
          // info.fileList.map(e => {
          //   data.push({
          //     code: (e.response && e.response[0]) || '',
          //     name: e.name,
          //     type: e.type,
          //   });
          // });
          // eslint-disable-next-line consistent-return
          this.props.form.setFieldsValue({
            idenImg: {
              code: (info.file.response && info.file.response[0]) || '',
              name: info.file.name,
              type: info.file.type,
            },
          })
        }
      }
    }

    /** person */
    updetaPersonal = e => {
      e.preventDefault();
      this.setState({
        personalShow: false,
        name: 'leo wang',
      })
    }

    renderPerform = name => {
      const { personalShow } = this.state;
      return personalShow ? this.personalShow(name) : this.persnalInput(name);
    }

    personalShow = name => (
      <div style={{ marginLeft: '30%' }}>
        <Form.Item label="名称">
          &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> &nbsp;<span>
            {name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a href="#" onClick = {event => this.updetaPersonal(event)}>修改</a>
        </Form.Item>
      </div>
    )

    persnalInput = name => {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      let isNameFinish = false;
      if (form.getFieldsValue().msg && form.getFieldsValue().msg.name === '') {
        isNameFinish = true;
      } else {
        isNameFinish = false;
      }
      return (
        <Form.Item label="名称">
          {getFieldDecorator('msg', {
            rules: [
              {
                required: isNameFinish,
                message: '请填写名称！',
              },
            ],
          })(<NameGroup name={name} type="personal"/>)}
        </Form.Item>
      )
    }

    /** Group */

    renderGroupNameForm = () => {
      const { groupNameShow } = this.state;
      return groupNameShow ? this.groupNameShow() : this.groupNameInput();
    }

    // eslint-disable-next-line consistent-return
    groupNameShow = () => {
      const { recordMsg } = this.state;
      if (recordMsg) {
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem label="名称" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Icon type="home" /> <span>{recordMsg.name}</span>
              <a href="#" onClick = {event => this.updetaNameGroup(event, recordMsg)}>修改</a>
            </FormItem>
          </Col>
        )
      }
    }

    groupNameInput = () => {
      const { form, name } = this.state;
      const { getFieldDecorator } = form;
      // let isNameFinish = false;
      // if (form.getFieldsValue().msg && form.getFieldsValue().msg.name === '') {
      //   console.log('进来le')
      //   isNameFinish = true;
      // } else {
      //   isNameFinish = false;
      // }
      return (
      <Col lg={24} md={12} sm={12}>
        <FormItem label="名称" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('msg')(<NameGroup name={name} type="group"/>)}
        </FormItem>
      </Col>
      )
    }

    updetaNameGroup = (e, userData) => {
      e.preventDefault();
      if (userData) {
        this.setState({
          groupNameShow: false,
          name: userData.name,
        })
      }
    }

    renderAdressForm = () => {
      const { groupAdressShow } = this.state;
      return groupAdressShow ? this.groupAdressShow() : this.groupAdressInput();
    }

    // eslint-disable-next-line consistent-return
    groupAdressShow = () => {
      const { recordMsg } = this.state;
      if (recordMsg) {
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem label="联系地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <span>{recordMsg.address}</span> <a href="#"
              onClick = {event => this.updateAdressGroup(event)}>修改</a>
            </FormItem>
          </Col>
        )
      }
    }

    groupAdressInput = () => {
      const { form } = this.state;
      const { getFieldDecorator } = form;
      return (
      <Col lg={24} md={12} sm={12}>
        <FormItem label="联系地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          {getFieldDecorator('address')(<AddressGroup addressVal={this.addressVal}/>)}
        </FormItem>
      </Col>
      )
    }

    updateAdressGroup = e => {
      e.preventDefault();
      this.setState({
        groupAdressShow: false,
      })
    }

    renderIndustryForm = () => {
      const { groupIndustryShow } = this.state;
      return groupIndustryShow ? this.groupInstruShow() : this.groupInstruInput();
    }

    updateIndustryGroup = () => {
      this.setState({
        groupIndustryShow: false,
      })
    }

    groupInstruShow = () => {
        const { userData: { basic } } = this.state;
        const { industryCategories } = this.props;
        return (
        <Col lg={12} md={12} sm={12}>
          <FormItem label="行业类别">
        <span>{
          // eslint-disable-next-line consistent-return
          industryCategories.forEach(item => {
            if (item.code === basic.industryCode) {
              return item.name
            }
          })
        }</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#"
        onClick = {event => this.updateIndustryGroup(event)}>修改</a>
          </FormItem>
        </Col>
      )
    }

    groupInstruInput = () => {
      const { form } = this.state;
      const { getFieldDecorator } = form;
      const { industryCategories } = this.props;
      return (
      <Col lg={12} md={12} sm={12}>
        <FormItem label="行业类别">
          {getFieldDecorator('industry')(
            <Select placeholder="请选择">
              {industryCategories.map(item =>
                <Option key={item.id} value={item.id}>{item.name}</Option>,
              )}
            </Select>)}
        </FormItem>
      </Col>
      )
    }

    renderUsaForm = () => {
      const { groupUsaShow } = this.state;
      return groupUsaShow ? this.groupUsaShow() : this.groupUsaInput();
    }

    groupUsaShow = () => (
      <FormItem label="名称">
        <Icon type="home" /> <span>Willian Jafferson Clinton</span>
        <a href="#" onClick = {event => this.updetaUsaGroup(event)}>修改</a>
      </FormItem>
    )

    updetaUsaGroup = () => {
      this.setState({
        groupUsaShow: false,
      })
    }

    groupUsaInput = () => {
      const { form } = this.state;
      const { getFieldDecorator } = form;
      return (
        <FormItem label="名称">
          {getFieldDecorator('name')(<AddressGroup/>)}
        </FormItem>
      )
    }

    removeItem = id => {
      // const { details, piCertification } = this.props;

      console.log(id)
      // const data = piCertification.filter(e => e.id !== id);
      // this.props.dispatch({
      //   type: 'partnerMaintainEdit/setDetails',
      //   payload: { ...details, piCertification: data },
      // });
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
                  <a onClick={() => this.removeItem(item.id)}>删除</a>
                </>
              }
            >
              <div style={{ marginBottom: '.8em' }}>
                <Badge status={renzhengMap[item.invoicePartyCode].value}
                text={renzhengMap[item.invoicePartyCode].text}/>
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
                {item.attachmentList.map(v =>
                  <img
                  style={{ width: 90,
                    height: 90,
                    margin: '0 20px 20px 0',
                    border: '1px #ECECEC solid',
                    padding: '5px',
                    borderRadius: '5px' }} src={v.code} alt=""/>,
                )}
              </div>
            </Card>
          </List.Item>
        );
      }

      return (
        <List.Item>
          <Button
            type="dashed"
            style={{ width: '100%', height: 304 }}
            onClick={() => this.handleModalVisible(true)}
          >
            <Icon type="plus" /> 新增认证
          </Button>
        </List.Item>
      );
    }

    handleModalVisible = flag => {
      this.setState({
        addModalVisible: !!flag,
      });
    };

    // handleAdd = data => {
    //   // const { details, piCertification } = this.props;
    //   const attachmentList = data.attachmentList.map(e => ({
    //     code: e.thumbUrl,
    //     name: e.name,
    //     type: e.type,
    //   }));
    //   this.handleModalVisible();
    //   // const obj = {
    //   //   id: Math.random(),
    //   //   invoicePartyId: 123,
    //   //   invoicePartyCode: 12345,
    //   //   invoicePartyName: data.invoicePartyName,
    //   //   status: 1,
    //   //   notes: data.notes,
    //   //   attachmentList,
    //   // };

    //   // const newdata = [...piCertification, obj];
    //   // this.props.dispatch({
    //   //   type: 'partnerMaintain/setDetails',
    //   //   payload: { ...details, piCertificationList: newdata },
    //   // });
    // };

    render () {
      const { changeModal, recordMsg, userData,
        submitNext, specialInvoice, addModalVisible } = this.state;
      const { piCertificationList } = userData;
      const { basic } = userData;
      const nullData = {};
      const uploadUrl = disk.uploadFiles('bp_organization_certification', guid());
      console.log(uploadUrl)
      let modelWidth = 970;
      if (!basic) return null;
      // const { form, getValues, closeModal } = this.props;
      // console.log(getValues)
      const { form } = this.state;
      const { getFieldDecorator } = form;
      const { TextArea } = Input;
      let modelContent;
      const { imageUrl } = this.state;
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">点击上传</div>
        </div>
      );
      const uploadModal = <>
        <Upload
          multiple
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList
          action={uploadUrl}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          headers={{ Authorization: this.props.authorization }}
          accept=".jpg"
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" width="80" height="80" /> : uploadButton}
        </Upload>
        <div style={{
          color: '#ADADAD',
          marginTop: '-30px',
          marginBottom: '20px' }}>只支持 .jpg 格式</div>
      </>
      // if (recordMsg.code === userData.basic.code) {}
      // 个人变更
      if (recordMsg && recordMsg.type === 1) {
        modelWidth = 830;

        const parentMethods = {
          handleAdd: this.handleAdd,
          handleModalVisible: this.handleModalVisible,
        };
        modelContent = <>
          <Form {...formItemLayout}>
            {this.renderPerform(userData.basic.name)}
            <Row gutter={32}>
            <List
              rowKey="id"
              grid={{
                gutter: 24,
                lg: 2,
                md: 2,
                sm: 1,
                xs: 1,
              }}
              dataSource={[...piCertificationList, nullData]}
              renderItem={this.renderListItem}
            />
            <PersonCertificationAddModal {...parentMethods} modalVisible={addModalVisible}/>
            <Divider style={{ margin: 0 }}/>
            <Button htmlType="submit" type="primary"
            style={{ float: 'right', margin: '10px 20px' }}>
                提交
            </Button>
            </Row>
          </Form>
        </>
      }
      // 组织变更
      if (recordMsg && recordMsg.type === 2 &&
        (recordMsg.countyCode === 'CN' || !recordMsg.countyCode)) {
        modelWidth = 1130;
        modelContent = <>
          <Form {...formItemLayoutGroup} labelAlign="left" onSubmit={this.handleOk}>
            <Row gutter={32}>
              <>
                { this.renderGroupNameForm() }
                { this.renderAdressForm() }
              </>
              <Col lg={12} md={12} sm={12}>
                <FormItem label="电话">
                  {getFieldDecorator('phoneNum', {
                    initialValue: {
                      telephoneCountryCode: basic.telephoneCountryCode,
                      telephoneAreaCode: basic.telephoneAreaCode,
                      telephone: basic.telephone,
                      telephoneExtension: basic.telephoneExtension,
                    },
                  })(<TelphoneInput/>)}
                </FormItem>
              </Col>
              { this.renderIndustryForm() }
              <Col lg={12} md={12} sm={12}>
                <FormItem label="增值税专用发票资质">
                  {getFieldDecorator('specialInvoice')(
                  <Switch checkedChildren="开" unCheckedChildren="关" onChange={() => {
                    this.setState({
                      specialInvoice: !specialInvoice,
                    })
                  }} checked={specialInvoice} />)}
                </FormItem>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <FormItem label="统一社会信用代码">
                  {getFieldDecorator('taxNo', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.taxNo ?
                      userData.organizationCertification.taxNo : '')
                     : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入统一社会信用代码！',
                      },
                    ],
                  })(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem label="基本户开户银行">
                  {getFieldDecorator('bankCode', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.bankCode ?
                      userData.organizationCertification.bankCode : '') : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入开户行',
                      },
                    ],
                  })(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem label="基本户开户账号">
                  {getFieldDecorator('bankAccount', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.bankAccount ?
                      userData.organizationCertification.bankAccount : '') : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入开户行账号',
                      },
                    ],
                  })(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col>
              {/* <Col lg={12} md={12} sm={12}>
                <FormItem label="基本户开户名">
                  {getFieldDecorator('acountName')(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col> */}
              <Col lg={24} md={12} sm={12}>
                  <FormItem label="注册地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    {getFieldDecorator('regisAddress', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.address ?
                      userData.organizationCertification.address : '') : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入注册地址',
                      },
                    ],
                  })(<Input placeholder="请输入"/>)}
                  </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item label="认证说明" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('notes', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.notes ?
                      userData.organizationCertification.notes : '') : '',
                    rules: [
                      {
                        required: true,
                        message: '请输入认证说明',
                      },
                    ],
                  })(<TextArea rows={2} />)}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
              <Form.Item label="认证图片" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('idenImg')(uploadModal)}
               </Form.Item>
              </Col>
              <Divider style={{ margin: 0 }}/>
              <Button htmlType="submit" type="primary"
              style={{ float: 'right', margin: '10px 20px' }}>
                  提交
              </Button>
            </Row>
          </Form>
          </>
      }

      // 美国变更
      if (recordMsg && recordMsg.type === 2 && recordMsg.countyCode === 'US') {
        modelWidth = 800;
        modelContent = <>
          <Form {...formItemLayout}>
             { this.renderUsaForm() }
            <FormItem label="免税认证号">
              {getFieldDecorator('taxNo', {
                rules: [
                  {
                    required: true,
                    message: '请输入免税认证号！',
                  },
                ],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
            <Form.Item label="认证说明">
              {getFieldDecorator('idenText', {
                rules: [
                  {
                    required: true,
                    message: '请输入认证说明！',
                  },
                ],
              })(<TextArea rows={2} />)}
            </Form.Item>
            <Form.Item label="认证图片">
              {getFieldDecorator('idenImg')(uploadModal)}
            </Form.Item>
            <Divider style={{ margin: 0 }}/>
            <Button htmlType="submit" type="primary"
            style={{ float: 'right', margin: '10px 20px 0 0' }}>
                提交
            </Button>
          </Form>
        </>
      }

      // 英国变更
      if (recordMsg && recordMsg.id === 2 && recordMsg.countyCode === 'GB') {
        modelWidth = 800;
        modelContent = <>
          <Form {...formItemLayoutEng} labelAlign="left">
             { this.renderUsaForm() }
            <FormItem label="增值税登记号">
              {getFieldDecorator('taxNo', {
                rules: [
                  {
                    required: true,
                  message: '请输入增值税登记号！',
                  },
                ],
              })(<Input placeholder="请输入"/>)}
            </FormItem>
            <Form.Item label="认证说明">
              {getFieldDecorator('idenText')(<TextArea rows={2} />)}
            </Form.Item>
            <Form.Item label="认证图片">
              {getFieldDecorator('idenImg')(uploadModal)}
            </Form.Item>
            <Divider style={{ margin: 0 }}/>
            <Button htmlType="submit" type="primary"
            style={{ float: 'right', margin: '10px 20px 0 0' }}>
                提交
            </Button>
          </Form>
        </>
      }

      // 提交通过页面
      const passPage = <>
        <div style={{ height: '180px', textAlign: 'center', paddingTop: '40px' }}>
          <Icon type="check-circle" style={{ fontSize: '40px', color: '#54C31F' }}/>
          <h4 style={{ fontWeight: '600', margin: '30px 0 20px' }}>您的资料已提交，请耐心等待审核</h4>
        </div>
      </>
      return (
          <div>
            <Modal
              width = {submitNext === 1 ? modelWidth : 400}
              centered
              title={submitNext === 1 ? '变更认证资料' : ''}
              visible={changeModal}
              onCancel={this.handleCancel}
              destroyOnClose
              maskClosable={false}
              footer={null}
              className="myModel"
            >
             { submitNext === 1 ? modelContent : passPage }
            </Modal>
          </div>
      )
    }
}

export default Form.create()(ChangeModal);
