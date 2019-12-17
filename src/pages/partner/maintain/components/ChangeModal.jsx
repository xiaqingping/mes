/* eslint-disable no-nested-ternary */
// 组织是1，PI是2
import {
  Modal,
  Form,
  Input,
  Upload,
  Icon,
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
  Spin,
  Typography,
  Empty,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { TelphoneInput } from '@/components/CustomizedFormControls';
import api from '@/api';
import debounce from 'lodash/debounce';
import './index.less';
import PersonCertificationAddModal from './PersonCertificationAddModal';
import { guid } from '@/utils/utils';

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

// 审核状态
const verifyStatus = {
  1: {
    value: 'warning',
    text: '审核中',
  },
 2: {
    value: 'success',
    text: '已认证',
  },
  3: {
    value: 'default',
    text: '未认证',
  },
}

function isNumber (obj) {
  const t1 = /^\d+(\.\d+)?$/;// 非负浮点数
  if (t1.test(obj)) {
    return true;
  }
    return false;
}

// // 数组去重
// function unique(arr) {
//   return [...new Set(arr)];
// }

// function beforeUpload(file) {
//   const isJpgOrPng = file.type === 'image/jpeg';
//   if (!isJpgOrPng) {
//     message.error('You can only upload JPG/PNG file!');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('Image must smaller than 2MB!');
//   }
//   return isJpgOrPng && isLt2M;
// }

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
    this.props.changGType(changedValue)
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
          onChange={e => this.valueChange({ name: e.target.value })}/>
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

  componentDidMount () {
    console.log(this.props.defaultAddress)
    api.area.byParentIdGetArea(0).then(res => { this.setState({ countryCode: res }) })
  }

  // 选择地区
  // eslint-disable-next-line consistent-return
  selectArea = (v, o) => {
    if (o.length !== 0) {
      this.props.gTypeName(o[0].sapCode)
      if (o[0].level === 1) {
        this.props.defaultAddressCode(o[0].code)
      }
    }
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
        countryCode.forEach((item1, key1) => {
          if (item1.code === v[0]) {
            if (parseInt(item1.level, 10) === 1 && parseInt(res[0].level, 10) === 2) {
              countryCode[key1].children = res;
            }
            if (parseInt(res[0].level, 10) > 2) {
              item1.children.forEach((item2, key2) => {
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
    const { userData, defaultAddress } = this.props;
    return (
      <InputGroup compact>
        <Cascader
          style={{ width: '40%' }}
          onChange={(value, selectedOptions) => this.selectArea(value, selectedOptions)}
          options={countryCode} placeholder="请选择"
          fieldNames={{ label: 'name', value: 'code' }}
          popupVisible={popupVisible}
          onClick={() => { this.setState({ popupVisible: !popupVisible }) }}
          defaultValue={[defaultAddress]}
        />
        <Input style={{ width: '60%' }}
          placeholder="详细地址"
          defaultValue={userData.basic.address}
          onChange={e => this.passVal(e.target.value, 2)}
        />
      </InputGroup>
    )
  }
}

@connect(({ basicCache, user, global }) => {
  const industryCategories = basicCache.industryCategories.filter(
    e => e.languageCode === global.languageCode,
  );
  // const industryCategories = bp.Industry;
   return ({
    industryCategories,
    // industryCategories: basicCache.industryCategories,
    countryDiallingCodes: basicCache.countryDiallingCodes,
    authorization: user.currentUser.authorization,
  })
})
class ChangeModal extends Component {
    constructor (props) {
      super(props);
      this.state = {
        recordMsg: undefined,
        form: this.props.form,
        loading: false,
        personalShow: true,
        groupNameShow: true,
        groupAdressShow: true,
        groupIndustryShow: true,
        name: '',
        userData: [],
        submitNext: 1,
        specialInvoice: false,
        addModalVisible: false,
        area: [],
        address: '',
        bankFetching: false,
        bank: [],
        pic: [],
        newDataList: [],
        userPersonData: [],
        deletePiCertificationIdList: [],
        gtype: 0,
        guuid: guid(),
        changeModal: false,
        defaultAddress: '',
        pageLoading: true,
      }
      this.fetchBank = debounce(this.fetchBank, 500);
    }

    componentDidMount() {
      this.props.onRef(this)
      this.props.dispatch({
        type: 'basicCache/setState',
        payload: { type: 'countryDiallingCodes' },
      })
      // this.props.dispatch({
      //   type: 'basicCache/setState',
      //   payload: { type: 'industryCategories' },
      // })
    }

    /** props更新时调用 */
    visibleShow = (changeModal, recordMsg) => {
      const { gtype, guuid } = this.state;
      this.setState({ changeModal })
      const diskFileIdList = []
      // console.log(this.props.details)
      if (recordMsg) {
        if (recordMsg.type === 1 || gtype === 1) {
          api.bp.getBPPiCertification(recordMsg.id).then(res => {
            this.setState({
              userData: res,
            })
            if (res.piCertificationList.length !== 0) {
                const codeList = [];
                const newData = []
                res.piCertificationList.forEach(item => {
                  codeList.push(item.attachmentCode)
                  newData.push({
                  id: item.billToPartyId,
                  status: item.status,
                  billToPartyName: item.billToPartyName,
                  notes: item.notes,
                  pic: [],
                  attachmentCode: item.attachmentCode,
                  })
                })
                api.disk.getFiles({
                  sourceKey: 'bp_pi_certification',
                  sourceCode: codeList.join(',') }).then(
                    v => {
                      newData.forEach((item, index) => {
                        v.forEach(i => {
                          if (i.sourceCode === item.attachmentCode) {
                            newData[index].pic.push(api.disk.downloadFiles(i.id, { view: true }))
                          }
                        })
                      })
                      this.setState({
                        userPersonData: newData,
                        pageLoading: false,
                      })
                })
            }
          })
        } else {
          api.bp.getBPOrgCertification(recordMsg.id).then(res => {
            if (res.organizationCertification) {
              api.disk.getFiles({
                sourceKey: 'bp_organization_certification',
                sourceCode: res.organizationCertification.attachmentCode }).then(
                  v => {
                    v.forEach(item => {
                      diskFileIdList.push(item.diskFileId)
                    })
                    const newData = {
                      diskFileIdList,
                      sourceCode: guuid,
                      sourceKey: 'bp_organization_certification',
                    };
                    api.disk.copyFiles(newData).then(() => {
                      // 找出copy出来的图片，copy的id不同
                      api.disk.getFiles({
                        sourceKey: 'bp_organization_certification',
                        sourceCode: guuid }).then(
                          v1 => {
                            this.setState({ pic: v1 })
                            v1.forEach(item => {
                              diskFileIdList.push(item.diskFileId)
                            })
                      })
                    })
              })
            }
            this.setState({
              pageLoading: false,
              userData: res,
              address: res.basic.address ? res.basic.address : '',
              specialInvoice: res.organizationCertification ?
              parseInt(res.organizationCertification.specialInvoice, 10) === 1 : false,
            })
          })
        }

        this.setState({
          recordMsg,
          loading: false,
        });
      }
    }

    fetchBank = value => {
      if (!value) {
        this.setState({ bank: [] });
        return;
      }
      api.basic.getBanks({
          codeOrFullName: value,
        })
        .then(bank => {
          this.setState({ bank });
        });
    };

    // 个人提交
    handlePersonOk = e => {
      if (e) e.preventDefault();
      const { newDataList, userData, recordMsg, deletePiCertificationIdList } = this.state;
      const newPiCertificationList = [];
      newDataList.forEach(item => {
        newPiCertificationList.push({
          billToPartyId: item.billToPartyId,
          notes: item.notes,
          attachmentCode: item.attachmentCode,
        })
      })
      const data = {
        basic: {
          name: this.props.form.getFieldValue('pname') ?
                this.props.form.getFieldValue('pname').name : userData.basic.name,
        },
        newPiCertificationList,
        deletePiCertificationIdList,
      }
      this.setState({ deletePiCertificationIdList: [] })
      api.bp.updateBPPiCertificationList(recordMsg.id, data).then(() => {
        this.handleCancel()
        this.props.getData()
      })
    }

    // 组织提交
    handleOrganizationOk = e => {
      if (e) e.preventDefault();
      // eslint-disable-next-line no-shadow
      const {
        address,
        area,
        userData: { basic },
        userData,
        recordMsg,
        gtype,
        guuid } = this.state;
      this.props.form.validateFields((error, row) => {
        if (error) return;
        let data = {};
        data = {
          basic: {
            id: recordMsg.id,
            name: row.msg ? row.msg.name : basic.name,
            countryCode: area[0] ? area[0].code : basic.countryCode,
            provinceCode: area[1] ? area[1].code : basic.provinceCode,
            cityCode: area[2] ? area[2].code : basic.cityCode,
            countyCode: area[3] ? area[3].code : basic.countyCode,
            streetCode: area[4] ? area[4].code : basic.streetCode,
            address: address || basic.address,
          },
          organizationCertification: {
            taxNo: row.taxNo,
            notes: row.notes,
            attachmentCode: guuid,
          },
        }
        if (gtype === 1 || (!gtype && basic.sapCountryCode === 'CN')) {
          Object.assign(data.basic, {
            industryCode: row.industry || basic.industryCode,
            telephoneCountryCode: row.phoneNum.telephoneCountryCode || basic.telephoneCountryCode,
            telephoneAreaCode: row.phoneNum.telephoneAreaCode || basic.telephoneAreaCode,
            telephone: row.phoneNum.telephone || basic.telephone,
            telephoneExtension: row.phoneNum.telephoneExtension || basic.telephoneExtension,
          })
          Object.assign(data.organizationCertification, {
            specialInvoice: row.specialInvoice ? 1 : 2,
            // eslint-disable-next-line no-nested-ternary
            bankCode: row.bankCode ?
                      (
                        isNumber(row.bankCode) ? row.bankCode :
                        userData.organizationCertification.bankCode
                      )
                      : '',
            bankAccount: row.bankAccount || '',
            registeredAddress: row.regisAddress || '',
          })
        }
        api.bp.updateBPOrgCertification(data).then(() => {
          this.setState({ submitNext: 2 })
          this.props.getData()
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

    // 关闭弹框
    handleCancel = () => {
      this.setState({
        recordMsg: null,
        personalShow: true,
        groupNameShow: true,
        groupAdressShow: true,
        groupIndustryShow: true,
        submitNext: 1,
        userData: [],
        address: '',
        pic: [],
        newDataList: [],
        userPersonData: [],
        deletePiCertificationIdList: [],
        gtype: 0,
        pageLoading: true,
      })
    }

    /** 上传和删除图片 */
    handleChange = info => {
      const { pic } = this.state;
      let data = pic;
      if (info.file.status === 'removed') {
          data = pic.filter(item =>
            item.id !== (info.file.response ? info.file.response[0] : info.file.uid),
          )
          api.disk.deleteFiles(info.file.response ? info.file.response[0] : info.file.uid)
        return
      }
      if (info.file.status === 'done') {
            data.push({
              id: info.file.response[0],
              name: Math.random(),
              status: 'done',
            })
            this.setState({
              pic: data,
            })
          // });
        }
    }

    /** person */
    updetaPersonal = e => {
      e.preventDefault();
      this.setState({
        personalShow: false,
        // name: 'leo wang',
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

    changGType = v => {
      if (v.type) {
        if (v.type === 'group') {
          this.setState({
            gtype: 1,
          })
        }
        if (v.type === 'personal') {
          this.setState({
            gtype: 2,
          })
        }
      } else if (v === 'CN') {
        this.setState({
          gtype: 1,
        })
      } else if (v === 'GB') {
        this.setState({
          gtype: 3,
        })
      } else if (v) {
        this.setState({
          gtype: 4,
        })
      }
    }

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
          {getFieldDecorator('pname', {
            rules: [
              {
                required: isNameFinish,
                message: '请填写名称！',
              },
            ],
          })(<NameGroup name={name} changGType={v => this.changGType(v)} type="personal"/>)}
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
              <Icon type="home" />&nbsp;&nbsp;<span>{recordMsg.name}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="#" onClick = {event => this.updetaNameGroup(event, recordMsg)}>修改</a>
            </FormItem>
          </Col>
        )
      }
    }

    defaultAddressCode = v => {
      this.setState({ defaultAddress: v })
    }

    groupNameInput = () => {
      const { form, name } = this.state;
      const { getFieldDecorator } = form;
      return (
      <Col lg={24} md={12} sm={12}>
        <FormItem
        label="名称"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        hasFeedback
        // eslint-disable-next-line no-nested-ternary
        validateStatus={form.getFieldValue('msg') ?
                        (form.getFieldValue('msg').name ? 'success' : 'error') : 'error'}
        // help={form.getFieldValue('msg') ? '' : '请输入信息'}
        >
          {getFieldDecorator('msg')(
          <NameGroup changGType={v => this.changGType(v)} name={name} type="group"/>,
          )}
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
              <span>
                {recordMsg.countryName}&nbsp;
                {recordMsg.provinceName}&nbsp;
                {recordMsg.cityName}&nbsp;
                {recordMsg.countyName}&nbsp;
                {recordMsg.streetName}&nbsp;{recordMsg.address}
              </span>&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="#" onClick = {event => this.updateAdressGroup(event)}>修改</a>
            </FormItem>
          </Col>
        )
      }
    }

    groupAdressInput = () => {
      const { form, area, userData, gtype, address, defaultAddress } = this.state;
      const { getFieldDecorator } = form;
      // console.log(area)
      // console.log(form.getFieldValue('address'))
      console.log(address)
      if (gtype === 1) {
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem
             label="联系地址"
             labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              hasFeedback
              validateStatus={
                area[0] && area[1] && area[2] && area[3] && area[4] && address ? 'success' : 'error'
              }
              // help={form.getFieldValue('msg') ? '' : '请输入信息'}
            >
              {getFieldDecorator('address')(
              <AddressGroup
                addressVal={this.addressVal}
                gTypeName={v => this.changGType(v)}
                userData={userData}
                defaultAddressCode={v => this.defaultAddressCode(v)}
                defaultAddress={defaultAddress}
              />,
              )}
            </FormItem>
          </Col>
        )
      }
      if (gtype === 3 || gtype === 4) {
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem
             label="联系地址"
             labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              hasFeedback
              validateStatus={area[0] && address ? 'success' : 'error'}
              // help={form.getFieldValue('msg') ? '' : '请输入信息'}
            >
              {getFieldDecorator('address')(
                <AddressGroup
                  addressVal={this.addressVal}
                  gTypeName={v => this.changGType(v)}
                  userData={userData}
                  defaultAddressCode={v => this.defaultAddressCode(v)}
                  defaultAddress={defaultAddress}
                />,
              )}
            </FormItem>
          </Col>
        )
      }
      if (userData.basic.sapCountryCode === 'CN') {
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem
             label="联系地址"
             labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              hasFeedback
              validateStatus={
                area[0] && area[1] && area[2] && area[3] && area[4] && address ? 'success' : 'error'
              }
              // help={form.getFieldValue('msg') ? '' : '请输入信息'}
            >
              {getFieldDecorator('address')(
              <AddressGroup
                addressVal={this.addressVal}
                gTypeName={v => this.changGType(v)}
                userData={userData}
                defaultAddressCode={v => this.defaultAddressCode(v)}
                defaultAddress={defaultAddress}
              />,
              )}
            </FormItem>
          </Col>
        )
      }
        return (
          <Col lg={24} md={12} sm={12}>
            <FormItem
             label="联系地址"
             labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              hasFeedback
              validateStatus={area[0] && address ? 'success' : 'error'}
              // help={form.getFieldValue('msg') ? '' : '请输入信息'}
            >
              {getFieldDecorator('address')(
                <AddressGroup
                  addressVal={this.addressVal}
                  gTypeName={v => this.changGType(v)}
                  userData={userData}
                  defaultAddressCode={v => this.defaultAddressCode(v)}
                  defaultAddress={defaultAddress}
                />,
              )}
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
          &nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          {
            industryCategories.filter(v => basic.industryCode === v.code).length !== 0 ?
            industryCategories.filter(v => basic.industryCode === v.code)[0].name : ''
          }
        </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="#" onClick = {event => this.updateIndustryGroup(event)}>修改</a>
          </FormItem>
        </Col>
      )
    }

    groupInstruInput = () => {
      const { form, userData: { basic } } = this.state;
      const { getFieldDecorator } = form;
      const { industryCategories } = this.props;
      return (
      <Col lg={12} md={12} sm={12}>
        <FormItem label="行业类别">
          {getFieldDecorator('industry', {
            initialValue: basic.industryCode,
          })(
            <Select placeholder="请选择">
              {industryCategories.map(item =>
                <Option
                  key={item.code}
                  value={item.code}
                  disabled={item.code === '07'}
                >
                  {item.name}
                </Option>,
              )}
            </Select>)}
        </FormItem>
      </Col>
      )
    }

    // 删除
    removeItem = id => {
      const { newDataList, userPersonData, deletePiCertificationIdList } = this.state;
      // 删除新增数据
      const newData = newDataList.filter(item => item.id !== id);
      this.setState({
        newDataList: newData,
      })
      const deletePiCertificationId = deletePiCertificationIdList;
      userPersonData.forEach(item => {
        if (item.id === id) {
          deletePiCertificationId.push(id)
        }
      })
      const oldData = userPersonData.filter(item => item.id !== id);
      this.setState({
        deletePiCertificationIdList: deletePiCertificationId,
        userPersonData: oldData,
      })
    }

    renderListItem = item => {
      if (item && item.id) {
        return (
          <List.Item key={item.id}>
            <Card
              hoverable
              title={item.billToPartyName}
              extra={ item.status === 1 ? '' :
                <>
                  <a onClick={() => this.removeItem(item.id, item)}>删除</a>
                </>
              }
            >
              <div style={{ marginBottom: '.8em' }}>
                <Badge status={verifyStatus[item.status].value}
                text={verifyStatus[item.status].text}/>
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
                {item.pic.map((v, index) =>
                  <img
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    style={{ width: 90,
                    height: 90,
                    margin: '0 20px 20px 0',
                    border: '1px #ECECEC solid',
                    padding: '5px',
                    borderRadius: '5px' }}
                    src={v}
                    alt=""
                  />,
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

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // 个人添加数据的弹框关闭
    handleModalVisible = flag => {
      this.setState({
        addModalVisible: flag,
      });
    };

    handleAdd = (data, uid) => {
      const { newDataList } = this.state;
      const picArr = [];
      if (data.attachmentList !== 0) {
        data.attachmentList.forEach(item => {
          picArr.push(item.thumbUrl)
        })
      }

      const obj = {
        id: Math.random(),
        type: 1,
        billToPartyId: data.billToPartyId.split(',')[0],
        billToPartyName: data.billToPartyId.split(',')[1],
        status: 3,
        notes: data.notes,
        attachmentCode: uid,
        pic: picArr,
      };

      this.setState({
        newDataList: [...newDataList, obj],
      })
    };

    render () {
      const {
        recordMsg,
        userData,
        submitNext,
        specialInvoice,
        addModalVisible,
        bankFetching,
        bank,
        pic,
        newDataList,
        userPersonData,
        gtype,
        guuid,
        changeModal,
        pageLoading,
      } = this.state;

      const fileList = pic.map(e => ({
        old: true,
        uid: e.id,
        name: e.name.toString(),
        status: 'done',
        url: api.disk.downloadFiles(e.id, { view: true }),
        type: e.type,
      }));
      const { basic } = userData;
      const nullData = {};
      let modelWidth = 970;
      if (!basic) return null;
      const { form } = this.state;
      const { getFieldDecorator } = form;
      const { TextArea } = Input;
      let modelContent;
      const userPersonList = userPersonData.length !== 0 ?
            userPersonData.concat(newDataList) : newDataList;
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">点击上传</div>
        </div>
      );
        // eslint-disable-next-line no-nested-ternary
        // const newGuid = deleteId.length === 0 ? (userData.organizationCertification ?
        // userData.organizationCertification.attachmentCode : guuid) : guuid;
        const uploadUrl = api.disk.uploadMoreFiles(
          'bp_organization_certification',
          guuid,
          );

      const uploadModal =
        <Upload
          name="files"
          multiple
          listType="picture-card"
          // className="avatar-uploader"
          showUploadList
          // fileList={ fileList }
          action={uploadUrl}
          // beforeUpload={beforeUpload}
          onChange={this.handleChange}
          headers={{ Authorization: this.props.authorization }}
          accept=".jpg"
          // onRemove={e => { this.removePic(e) }}
        >
          {uploadButton}
        </Upload>

      if (gtype === 2) {
        modelWidth = 830;

        const parentMethods = {
          handleAdd: this.handleAdd,
          handleModalVisible: this.handleModalVisible,
        };
        modelContent = <>
          <Form {...formItemLayout} onSubmit={this.handlePersonOk}>
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
              dataSource={[...userPersonList, nullData]}
              renderItem={this.renderListItem}
            />
            <PersonCertificationAddModal
              {...parentMethods}
              modalVisible={addModalVisible}
              details={recordMsg}
              handleModalVisible={v => this.handleModalVisible(v)}
              authorization={this.props.authorization}
              handleAdd={(data, uid) => this.handleAdd(data, uid)}
              // eslint-disable-next-line no-nested-ternary
              attachmentCode={userData.piCertificationList ?
                (userData.piCertificationList.attachmentCode ?
                  userData.piCertificationList.attachmentCode : '') : ''}
            />
            <Divider style={{ margin: 0 }}/>
            <Button htmlType="submit" type="primary"
            style={{ float: 'right', margin: '10px 20px' }}>
                提交
            </Button>
            </Row>
          </Form>
        </>
      } else if (gtype === 1) {
          modelWidth = 1130;
          modelContent = <>
            <Form {...formItemLayoutGroup} labelAlign="left" onSubmit={this.handleOrganizationOk}>
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
                    <Switch
                      style={{ marginLeft: '7px' }}
                      checkedChildren="开"
                      unCheckedChildren="关"
                      onChange={() => {
                        this.setState({
                          specialInvoice: !specialInvoice,
                        })
                      }}
                      checked={specialInvoice}
                    />)}
                  </FormItem>
                </Col>

                <Col lg={12} md={12} sm={12}>
                  <FormItem
                    label="统一社会信用代码"
                    hasFeedback
                    // eslint-disable-next-line max-len
                    validateStatus={form.getFieldValue('taxNo') || (userData.organizationCertification ?
                      (!!userData.organizationCertification.taxNo)
                        : '') ? 'success' : 'error'}
                    // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                  >
                    {getFieldDecorator('taxNo', {
                      // eslint-disable-next-line no-nested-ternary
                      initialValue: userData.organizationCertification ?
                      (userData.organizationCertification.taxNo ?
                        userData.organizationCertification.taxNo : '')
                        : '',
                    })(<Input placeholder="请输入"/>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={12}>
                  <FormItem
                    label="基本户开户银行"
                    className="marginLeft7"
                    hasFeedback
                    // eslint-disable-next-line max-len
                    validateStatus={form.getFieldValue('bankCode') || (userData.organizationCertification ?
                      (!!userData.organizationCertification.bankCode)
                        : '') ? 'success' : 'error'}
                    // help={form.getFieldValue('bankCode') ? '' : '请输入信息'}
                  >
                    {getFieldDecorator('bankCode', {
                      // eslint-disable-next-line no-nested-ternary
                      initialValue: userData.organizationCertification ?
                      (userData.organizationCertification.bankName ?
                        userData.organizationCertification.bankName : '') : '',
                    })(<Select
                      showSearch
                      notFoundContent={bankFetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onSearch={this.fetchBank}
                      style={{ marginLeft: '7px' }}
                    >
                      {bank.map(d => (
                        <Option key={d.code} value={d.code} >
                          {d.fullName}
                        </Option>
                      ))}
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={12} md={12} sm={12}>
                  <FormItem
                    label="基本户开户账号"
                    hasFeedback
                    // eslint-disable-next-line max-len
                    validateStatus={form.getFieldValue('bankAccount') || (userData.organizationCertification ?
                      (!!userData.organizationCertification.bankAccount)
                        : '') ? 'success' : 'error'}
                    // help={form.getFieldValue('bankAccount') ? '' : '请输入信息'}
                  >
                    {getFieldDecorator('bankAccount', {
                      // eslint-disable-next-line no-nested-ternary
                      initialValue: userData.organizationCertification ?
                      (userData.organizationCertification.bankAccount ?
                        userData.organizationCertification.bankAccount : '') : '',
                    })(<Input placeholder="请输入"/>)}
                  </FormItem>
                </Col>
                <Col lg={24} md={12} sm={12}>
                    <FormItem
                      label="注册地址"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      hasFeedback
                      // eslint-disable-next-line max-len
                      validateStatus={form.getFieldValue('regisAddress') || (userData.organizationCertification ?
                        (!!userData.organizationCertification.address)
                          : '') ? 'success' : 'error'}
                      // help={form.getFieldValue('regisAddress') ? '' : '请输入信息'}
                    >
                      {getFieldDecorator('regisAddress', {
                      // eslint-disable-next-line no-nested-ternary
                      initialValue: userData.organizationCertification ?
                      (userData.organizationCertification.address ?
                        userData.organizationCertification.address : '') : '',
                    })(<Input placeholder="请输入"/>)}
                    </FormItem>
                </Col>
                <Col lg={24} md={12} sm={12}>
                  <Form.Item
                    label="认证说明"
                    hasFeedback
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    // eslint-disable-next-line max-len
                    validateStatus={form.getFieldValue('notes') || (userData.organizationCertification ?
                      (!!userData.organizationCertification.notes)
                        : '') ? 'success' : 'error'}
                    // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                  >
                    {getFieldDecorator('notes', {
                      // eslint-disable-next-line no-nested-ternary
                      initialValue: userData.organizationCertification ?
                      (userData.organizationCertification.notes ?
                        userData.organizationCertification.notes : '') : '',
                    })(<TextArea rows={2} />)}
                  </Form.Item>
                </Col>
                <Col lg={24} md={12} sm={12}>
                  <Form.Item
                    label="认证图片"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('attachmentList', {
                      initialValue: fileList,
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(uploadModal)}
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
      } else if (gtype === 3) {
        modelWidth = 800;
        modelContent = <>
          <Form {...formItemLayout} onSubmit={this.handleOrganizationOk}>
            <Row gutter={32}>
              { this.renderGroupNameForm() }
              { this.renderAdressForm() }
              <Col lg={24} md={12} sm={12}>
                <FormItem
                label="增值税登记号"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('taxNo') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.taxNo)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                {getFieldDecorator('taxNo', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.taxNo ?
                    userData.organizationCertification.taxNo : '')
                    : '',
                })(<Input placeholder="请输入"/>)}
              </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                label="认证说明"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('notes') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.notes)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.notes ?
                    userData.organizationCertification.notes : '')
                    : '',
                })(<TextArea rows={2} />)}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                    label="认证图片"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('attachmentList', {
                      initialValue: fileList,
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(uploadModal)}
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
      } else if (gtype === 4) {
        modelWidth = 800;
        modelContent = <>
          <Form {...formItemLayout} onSubmit={this.handleOrganizationOk}>
            <Row gutter={32}>
              { this.renderGroupNameForm() }
              { this.renderAdressForm() }
              <Col lg={24} md={12} sm={12}>
                <FormItem
                label="免税认证号"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('taxNo') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.taxNo)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                {getFieldDecorator('taxNo', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.taxNo ?
                    userData.organizationCertification.taxNo : '')
                    : '',
                })(<Input placeholder="请输入"/>)}
              </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                label="认证说明"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('notes') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.notes)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.notes ?
                    userData.organizationCertification.notes : '')
                    : '',
                })(<TextArea rows={2} />)}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                    label="认证图片"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('attachmentList', {
                      initialValue: fileList,
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(uploadModal)}
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
      } else if (recordMsg && recordMsg.type === 1) {
          modelWidth = 830;

          const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
          };
          modelContent = <>
            <Form {...formItemLayout} onSubmit={this.handlePersonOk}>
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
                dataSource={[...userPersonList, nullData]}
                renderItem={this.renderListItem}
              />
              <PersonCertificationAddModal
                {...parentMethods}
                modalVisible={addModalVisible}
                details={recordMsg}
                handleModalVisible={v => this.handleModalVisible(v)}
                authorization={this.props.authorization}
                handleAdd={(data, uid) => this.handleAdd(data, uid)}
                // eslint-disable-next-line no-nested-ternary
                attachmentCode={userData.piCertificationList ?
                  (userData.piCertificationList.attachmentCode ?
                    userData.piCertificationList.attachmentCode : '') : ''}
              />
              <Divider style={{ margin: 0 }}/>
              <Button htmlType="submit" type="primary"
              style={{ float: 'right', margin: '10px 20px' }}>
                  提交
              </Button>
              </Row>
            </Form>
          </>
      } else if (recordMsg && recordMsg.type === 2 &&
        userData.basic.sapCountryCode === 'CN') {
        modelWidth = 1130;
        modelContent = <>
          <Form {...formItemLayoutGroup} labelAlign="left" onSubmit={this.handleOrganizationOk}>
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
                  <Switch
                    style={{ marginLeft: '7px' }}
                    checkedChildren="开"
                    unCheckedChildren="关"
                    onChange={() => {
                      this.setState({
                        specialInvoice: !specialInvoice,
                      })
                    }}
                    checked={specialInvoice}
                  />)}
                </FormItem>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label="统一社会信用代码"
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={form.getFieldValue('taxNo') || (userData.organizationCertification ?
                    (!!userData.organizationCertification.taxNo)
                      : '') ? 'success' : 'error'}
                  // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('taxNo', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.taxNo ?
                      userData.organizationCertification.taxNo : '')
                      : '',
                  })(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label="基本户开户银行"
                  className="marginLeft7"
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={form.getFieldValue('bankCode') || (userData.organizationCertification ?
                    (!!userData.organizationCertification.bankName)
                      : '') ? 'success' : 'error'}
                  // help={form.getFieldValue('bankCode') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('bankCode', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.bankName ?
                      userData.organizationCertification.bankName : '') : '',
                  })(<Select
                    showSearch
                    notFoundContent={bankFetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchBank}
                    style={{ marginLeft: '7px' }}
                  >
                    {bank.map(d => (
                      <Option key={d.code} value={d.code}>
                        {d.fullName}
                      </Option>
                    ))}
                  </Select>)}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label="基本户开户账号"
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={form.getFieldValue('bankAccount') || (userData.organizationCertification ?
                    (!!userData.organizationCertification.bankAccount)
                      : '') ? 'success' : 'error'}
                  // help={form.getFieldValue('bankAccount') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('bankAccount', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.bankAccount ?
                      userData.organizationCertification.bankAccount : '') : '',
                  })(<Input placeholder="请输入"/>)}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                  <FormItem
                    label="注册地址"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    hasFeedback
                    // eslint-disable-next-line max-len
                    validateStatus={form.getFieldValue('regisAddress') || (userData.organizationCertification ?
                      (!!userData.organizationCertification.address)
                        : '') ? 'success' : 'error'}
                    // help={form.getFieldValue('regisAddress') ? '' : '请输入信息'}
                  >
                    {getFieldDecorator('regisAddress', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.address ?
                      userData.organizationCertification.address : '') : '',
                  })(<Input placeholder="请输入"/>)}
                  </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label="认证说明"
                  hasFeedback
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  // eslint-disable-next-line max-len
                  validateStatus={form.getFieldValue('notes') || (userData.organizationCertification ?
                    (!!userData.organizationCertification.notes)
                      : '') ? 'success' : 'error'}
                  // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification ?
                    (userData.organizationCertification.notes ?
                      userData.organizationCertification.notes : '') : '',
                  })(<TextArea rows={2} />)}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label="认证图片"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                >
                  {getFieldDecorator('attachmentList', {
                    initialValue: fileList,
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile,
                  })(uploadModal)}
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
      } else if (recordMsg && recordMsg.type === 2) {
        modelWidth = 800;
        modelContent = <>
          <Form {...formItemLayout} onSubmit={this.handleOrganizationOk}>
            <Row gutter={32}>
              { this.renderGroupNameForm() }
              { this.renderAdressForm() }
              <Col lg={24} md={12} sm={12}>
                <FormItem
                label="免税认证号"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('taxNo') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.taxNo)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                {getFieldDecorator('taxNo', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.taxNo ?
                    userData.organizationCertification.taxNo : '')
                    : '',
                })(<Input placeholder="请输入"/>)}
              </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                label="认证说明"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('notes') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.notes)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.notes ?
                    userData.organizationCertification.notes : '')
                    : '',
                })(<TextArea rows={2} />)}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                    label="认证图片"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('attachmentList', {
                      initialValue: fileList,
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(uploadModal)}
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
      } else if (recordMsg && recordMsg.type === 2 && userData.basic.sapCountryCode === 'GB') {
        modelWidth = 800;
        modelContent = <>
          <Form {...formItemLayout} onSubmit={this.handleOrganizationOk}>
            <Row gutter={32}>
              { this.renderGroupNameForm() }
              { this.renderAdressForm() }
              <Col lg={24} md={12} sm={12}>
                <FormItem
                label="增值税登记号"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('taxNo') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.taxNo)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                {getFieldDecorator('taxNo', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.taxNo ?
                    userData.organizationCertification.taxNo : '')
                    : '',
                })(<Input placeholder="请输入"/>)}
              </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                label="认证说明"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                validateStatus={
                  form.getFieldValue('notes') || (userData.organizationCertification ?
                  (!!userData.organizationCertification.notes)
                    : '') ? 'success' : 'error'}
                // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                  // eslint-disable-next-line no-nested-ternary
                  initialValue: userData.organizationCertification ?
                  (userData.organizationCertification.notes ?
                    userData.organizationCertification.notes : '')
                    : '',
                })(<TextArea rows={2} />)}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                    label="认证图片"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                  >
                    {getFieldDecorator('attachmentList', {
                      initialValue: fileList,
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(uploadModal)}
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
              <Spin spinning={pageLoading}>
                { pageLoading ? (
                    <Empty style={{ padding: 300, background: '#fff' }} description="loading..."/>
                  ) : (submitNext === 1 ? modelContent : passPage) }
              </Spin>
            </Modal>
          </div>
      )
    }
}

export default Form.create()(ChangeModal);
