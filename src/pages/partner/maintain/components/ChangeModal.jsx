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
  Typography,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { TelphoneInput } from '@/components/CustomizedFormControls';
import api from '@/api';
import authorize from '@/components/Authorized/Secured';

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
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
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
        <Select value={type} placeholder="请选择类型" style={{ width: '20%' }} onChange={val => this.valueChange({ type: val })}>
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
    this.state = {};
  }

  render () {
    const options = [
      {
        value: 'zhejiang',
        label: '中国',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: '美国',
        children: [
          {
            value: '密歇根州',
            label: '德州',
            children: [
              {
                value: '北海',
                label: '纽约',
              },
            ],
          },
        ],
      },
    ];
    return (
      <InputGroup compact>
        {/* <Select defaultValue="中国" style={{ width: '20%' }}>
          <Option value="中国">中国</Option>
          <Option value="美国"> 美国</Option>
        </Select> */}
        <Cascader style={{ width: '20%' }} options={options} placeholder="请选择" />
        <Input style={{ width: '80%' }} placeholder="详细地址" />
      </InputGroup>
    )
  }
}

@connect(({ global, basicCache }) => {
  const industryCategories = basicCache.industryCategories.filter(
    e => e.languageCode === global.languageCode,
  );
  return {
    industryCategories,
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
      }
    }

    componentDidMount() {
      this.props.onRef(this)
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

    handleOk = () => {

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
      })
    }

    /** 上传图片 */
    handleChange = info => {
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
      }
    };

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
          &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="user" /> &nbsp;<span>{name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="#" onClick = {event => this.updetaPersonal(event)}>修改</a>
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

    groupNameShow = () => {
      const { recordMsg } = this.state;
      if (recordMsg) {
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem label="名称" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Icon type="home" /> <span>{recordMsg.name}</span> <a href="#" onClick = {event => this.updetaNameGroup(event, recordMsg)}>修改</a>
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

    groupAdressShow = () => {
      const { recordMsg } = this.state;
      if (recordMsg) {
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem label="联系地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <span>{recordMsg.address}</span> <a href="#" onClick = {event => this.updateAdressGroup(event)}>修改</a>
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
          {getFieldDecorator('address')(<AddressGroup/>)}
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
          industryCategories.forEach(item => {
            if (item.code === basic.industryCode) {
              return item.name
            }
          })
        }</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onClick = {event => this.updateIndustryGroup(event)}>修改</a>
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
                <Option key={item.code} value={item.code}>{item.name}</Option>,
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
        <Icon type="home" /> <span>Willian Jafferson Clinton</span> <a href="#" onClick = {event => this.updetaUsaGroup(event)}>修改</a>
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

    renderListItem = item => {
      console.log(item)
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
                  <img style={{ width: 90, height: 90, margin: '0 20px 20px 0', border: '1px #ECECEC solid', padding: '5px', borderRadius: '5px' }} src={v.code} alt=""/>,
                )}
              </div>
            </Card>
          </List.Item>
        );
      }
    }

    render () {
      const { changeModal, recordMsg, userData } = this.state;
      const { basic } = userData;
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
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </>
      // 个人变更
      if (recordMsg && recordMsg.type === 1) {
        modelContent = <>
          <Form {...formItemLayout}>
            {this.renderPerform(userData.basic.name)}
            {/* <Form.Item label="认证说明">
              {getFieldDecorator('notes', {
                rules: [
                  {
                    required: true,
                    message: '请填写认证说明！',
                  },
                ],
              })(<TextArea rows={2} style={{ resize: 'none' }}/>)}
            </Form.Item>
            <Form.Item label="认证图片">
              {getFieldDecorator('idenImg', {
                rules: [
                  {
                    required: true,
                    message: '请上传认证图片！',
                  },
                ],
              })(uploadModal)}
            </Form.Item> */}
                    <List
                      rowKey="id"
                      grid={{
                        gutter: 24,
                        lg: 3,
                        md: 2,
                        sm: 1,
                        xs: 1,
                      }}
                      dataSource={ userData.piCertificationList}
                      renderItem={this.renderListItem}
                    />
          </Form>
        </>
      }
      // 组织变更
      if (recordMsg && recordMsg.type === 2 && (recordMsg.countyCode === 'CN' || !recordMsg.countyCode)) {
        modelContent = <>
          <Form {...formItemLayoutGroup} labelAlign="left">
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
                  {getFieldDecorator('specialInvoice')(<Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={userData.organizationCertification ? (parseInt(userData.organizationCertification.specialInvoice) === 1) : false} />)}
                </FormItem>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <FormItem label="统一社会信用代码">
                  {getFieldDecorator('taxNo', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ? (userData.organizationCertification.taxNo ? userData.organizationCertification.taxNo : '') : '',
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
                    initialValue: userData.organizationCertification ? (userData.organizationCertification.bankCode ? userData.organizationCertification.bankCode : '') : '',
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
                    initialValue: userData.organizationCertification ? (userData.organizationCertification.bankAccount ? userData.organizationCertification.bankAccount : '') : '',
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
                    initialValue: userData.organizationCertification ? (userData.organizationCertification.address ? userData.organizationCertification.address : '') : '',
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
                  {getFieldDecorator('idenText', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ? (userData.organizationCertification.notes ? userData.organizationCertification.notes : '') : '',
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
            </Row>
          </Form>
          </>
      }

      // 美国变更
      if (recordMsg && recordMsg.type === 2 && recordMsg.countyCode === 'US') {
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
          </Form>
        </>
      }

      // 英国变更
      if (recordMsg && recordMsg.id === 2 && recordMsg.countyCode === 'GB') {
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
          </Form>
        </>
      }
      return (
          <div>
            <Modal
              width = {1130}
              centered
              title="变更认证资料"
              visible={changeModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              destroyOnClose
            >
             { modelContent }
            </Modal>
          </div>
      )
    }
}

export default Form.create()(ChangeModal);
