import {
  Modal,
  Form,
  Input,
  Upload,
  Icon,
  message,
  Row,
  Col,
  Select,
  Switch,
  Cascader,
} from 'antd';
import React, { Component } from 'react';
import { TelphoneInput } from '@/components/CustomizedFormControls';

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
        <Input style={{ width: '80%' }} defaultValue="Xihu District, Hangzhou" />
      </InputGroup>
    )
  }
}

const ChangeModal = Form.create()(
  class extends Component {
    constructor (props) {
      super(props);
      this.state = {
        changeModal: this.props.changeModal,
        recordMsg: undefined,
        form: this.props.form,
        loading: false,
        personalShow: true,
        groupNameShow: true,
        groupAdressShow: true,
        groupIndustryShow: true,
        groupUsaShow: true,
        name: '',
      }
    }

    /** props更新时调用 */
    componentWillReceiveProps (props) {
      let { changeModal } = props;
      const { recordMsg } = props;
      const { form } = this.state;
      if (recordMsg === undefined) {
        changeModal = false
      }
      this.setState({
        changeModal,
        recordMsg,
        form,
        loading: false,
      });
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
      return personalShow ? this.personalShow() : this.persnalInput(name);
    }

    personalShow = () => (
      <>
        <Form.Item label="名称">
          <Icon type="user" /> <span>Leo wang</span> <a href="#" onClick = {event => this.updetaPersonal(event)}>修改</a>
        </Form.Item>
      </>
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
      const { groupNameShow, name } = this.state;
      return groupNameShow ? this.groupNameShow() : this.groupNameInput(name);
    }

    groupNameShow = () => (
      <Col lg={24} md={12} sm={12}>
        <FormItem label="名称" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Icon type="home" /> <span>上海交通大学附属高中上海交通大学附属高中</span> <a href="#" onClick = {event => this.updetaNameGroup(event)}>修改</a>
        </FormItem>
      </Col>
    )

    groupNameInput = name => {
      const { form } = this.state;
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

    updetaNameGroup = e => {
      e.preventDefault();
      this.setState({
        groupNameShow: false,
        name: '上海交通大学附属高中上海交通大学附属高中',
      })
    }

    renderAdressForm = () => {
      const { groupAdressShow } = this.state;
      return groupAdressShow ? this.groupAdressShow() : this.groupAdressInput();
    }

    groupAdressShow = () => (
      <Col lg={24} md={12} sm={12}>
        <FormItem label="联系地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <span>中国 新疆省 乌鲁木齐市 乌鲁木齐镇 呼伦贝尔村 内蒙古街道 莲花路123号</span> <a href="#" onClick = {event => this.updateAdressGroup(event)}>修改</a>
        </FormItem>
      </Col>
    )

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

    groupInstruShow = () => (
      <Col lg={12} md={12} sm={12}>
        <FormItem label="行业类别">
          <span>军属类</span> <a href="#" onClick = {event => this.updateIndustryGroup(event)}>修改</a>
        </FormItem>
      </Col>
    )

    groupInstruInput = () => {
      const { form } = this.state;
      const { getFieldDecorator } = form;
      return (
      <Col lg={12} md={12} sm={12}>
        <FormItem label="特殊行业类别">
          {getFieldDecorator('industry')(
            <Select placeholder="请选择">
              <Option value="01">军属类</Option>
              <Option value="02">其他</Option>
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

    saveFormRef = formRef => {
      this.formRef = formRef;
    };

    render () {
      const { changeModal, recordMsg, name } = this.state;
      const { form, getValues, closeModal } = this.props;
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
      if (recordMsg && recordMsg.id === 1) {
        modelContent = <>
          <Form {...formItemLayout}>
            {this.renderPerform(name)}
            <Form.Item label="认证说明">
              {getFieldDecorator('notes', {
                rules: [
                  {
                    required: true,
                    message: '请填写认证说明！',
                  },
                ],
              })(<TextArea rows={2}/>)}
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
            </Form.Item>
          </Form>
        </>
      }

      // 组织变更
      if (recordMsg && recordMsg.id === 2) {
        modelContent = <>
          <Form {...formItemLayoutGroup} labelAlign="left">
            <Row gutter={32}>
              <>
                { this.renderGroupNameForm() }
                { this.renderAdressForm() }
              </>
              <Col lg={12} md={12} sm={12}>
                <FormItem label="电话">
                  {getFieldDecorator('phoneNum')(<TelphoneInput/>)}
                </FormItem>
              </Col>
              { this.renderIndustryForm() }
              <Col lg={12} md={12} sm={12}>
                <FormItem label="增值税专用发票资质">
                  {getFieldDecorator('specialInvoice')(<Switch checkedChildren="开" unCheckedChildren="关" checked />)}
                </FormItem>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <FormItem label="统一社会信用代码">
                  {getFieldDecorator('taxNo', {
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
      if (recordMsg && recordMsg.id === 3) {
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
      if (recordMsg && recordMsg.id === 4) {
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
              destroyOnClose
              centered
              title="变更认证资料"
              visible={changeModal}
              onOk={getValues}
              onCancel={closeModal}
            >
             { modelContent }
            </Modal>
          </div>
      )
    }
  },
)


export default ChangeModal;
