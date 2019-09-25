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

} from 'antd';
import React, { Component } from 'react';
import { TelphoneInput } from '@/components/CustomizedFormControls'

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
    xs: { span: 12 },
    sm: { span: 16 },
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

class ChangeModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      changeModal: false,
      recordMsg: undefined,
      getFieldDecorator: undefined,
      loading: false,
      personalShow: true,
    }
  }

  /** props更新时调用 */
  componentWillReceiveProps (props) {
    let { changeModal } = props;
    const { recordMsg, getFieldDecorator } = props;
    if (recordMsg === undefined) {
      changeModal = false
    }
    this.setState({
      changeModal,
      recordMsg,
      getFieldDecorator,
      loading: false,
    });
  }

  /** 关闭Modal */
  setModal1Visible = () => {
    this.setState({
      changeModal: false,
      recordMsg: undefined,
      getFieldDecorator: undefined,
      loading: false,
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

  updetaPersonal = e => {
    e.preventDefault();
    this.setState({
      personalShow: false,
    })
  }

  renderPerform = () => {
    const { personalShow } = this.state;
    return personalShow ? this.personalShow() : this.persnalInput();
  }

  personalShow = () => (
     <>
    <Icon type="user" /> <span>Leo wang</span> <a href="#" onClick = {event => this.updetaPersonal(event)}>修改</a>
    </>
  )

  persnalInput = () => (
    <InputGroup compact>
      <Select defaultValue="Zhejiang" style={{ width: '20%' }}>
        <Option value="Zhejiang"><Icon type="user" /> Zhejiang</Option>
        <Option value="Jiangsu"><Icon type="user" /> Jiangsu</Option>
      </Select>
      <Input style={{ width: '80%' }} defaultValue="Xihu District, Hangzhou" />
    </InputGroup>
    )

  render () {
    const { changeModal, recordMsg, getFieldDecorator } = this.state;

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
          <Form.Item label="名称">
           {this.renderPerform()}
          </Form.Item>
          <Form.Item label="认证说明">
            {getFieldDecorator('idenText')(<TextArea rows={2} />)}
          </Form.Item>
          <Form.Item label="认证图片">
            {getFieldDecorator('idenImg')(uploadModal)}
          </Form.Item>
      </Form>
      </>
    }

    // 组织变更
    if (recordMsg && recordMsg.id === 2) {
      modelContent = <>
        <Form {...formItemLayoutGroup}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <FormItem label="统一社会信用代码">
                {getFieldDecorator('socialCode')(<Input placeholder="请输入"/>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={12}>
              <FormItem label="电话">
                {getFieldDecorator('phoneNum')(<TelphoneInput/>)}
              </FormItem>
            </Col>
            <Col lg={12} md={12} sm={12}>
                <FormItem label="基本户开户银行">
                  {getFieldDecorator('bankName')(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem label="基本户开户账号">
                  {getFieldDecorator('bankCount')(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem label="基本户开户名">
                  {getFieldDecorator('acountName')(<Input placeholder="请输入"/>)}
                </FormItem>
            </Col>
            <Col lg={24} md={12} sm={12}>
                <FormItem label="注册地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('regisAddress')(<Input placeholder="请输入"/>)}
                </FormItem>
            </Col>
            <Col lg={24} md={12} sm={12}>
              <Form.Item label="认证说明" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('idenText')(<TextArea rows={2} />)}
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
    return (
        <div>
          <Modal
            width = {1130}
            destroyOnClose
            centered
            title="变更认证资料"
            visible={changeModal}
            onOk={() => this.setModal1Visible(false)}
            onCancel={() => this.setModal1Visible(false)}
          >
           { modelContent }
          </Modal>
        </div>
    )
  }
}

export default ChangeModal;