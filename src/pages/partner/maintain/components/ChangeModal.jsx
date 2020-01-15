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
  message,
} from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { TelphoneInput } from '@/components/CustomizedFormControls';
import { formatMessage } from 'umi/locale';
import api from '@/api';
import debounce from 'lodash/debounce';
import './index.less';
import PersonCertificationAddModal from './PersonCertificationAddModal';
import { guid, formatter, validateEmpty } from '@/utils/utils';

const { confirm } = Modal;
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

function isNumber(obj) {
  const t1 = /^\d+(\.\d+)?$/; // 非负浮点数
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

  constructor(props) {
    super(props);
    const value = props.value || {};
    const { name, type } = props;
    this.state = {
      type: value.type || type,
      name: value.name || name,
    };
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
    this.props.nameChangGType(changedValue);
  };

  render() {
    const { type, name } = this.state;
    return (
      <InputGroup compact>
        <Select
          value={type}
          placeholder="请选择类型"
          style={{ width: '30%' }}
          onChange={val => this.valueChange({ type: val })}
          disabled
        >
          <Option value="personal">
            <Icon type="user" /> 人员
          </Option>
          <Option value="group">
            <Icon type="home" /> 组织
          </Option>
        </Select>
        <Input
          value={name}
          style={{ width: '70%' }}
          placeholder={formatMessage({ id: 'bp.inputHere' })}
          onChange={e => this.valueChange({ name: e.target.value })}
        />
      </InputGroup>
    );
  }
}

@connect(({ areaCache }) => {
  const { countrys } = areaCache;
  return { countrys };
})
class AddressGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: [],
    };
  }

  componentDidMount() {
    const { countrys } = this.props;
    if (countrys.length !== 0) {
      this.setState({ countryCode: countrys });
    } else {
      api.area.byParentIdGetArea(0).then(res => {
        this.setState({ countryCode: res });
      });
    }
  }

  // 选择地区
  selectArea = (v, o) => {
    if (o.length !== 0) {
      this.props.gTypeName(o[0].sapCode, o[o.length - 1].isHaveLow);
      if (o[0].level === 1) {
        this.props.defaultAddressCode(o[0].code);
      }
    }
    if (o.length === 0) return false;
    let obj = v;
    if (Object.keys(v).indexOf('cascader') > -1) {
      const { option } = v;
      obj = {
        countryCode: (option[0] && option[0].code) || '',
        countryName: (option[0] && option[0].name) || '',
        sapCountryCode: (option[0] && option[0].sapCode) || '',
        provinceCode: (option[1] && option[1].code) || '',
        provinceName: (option[1] && option[1].name) || '',
        sapProvinceCode: (option[1] && option[1].sapCode) || '',
        cityCode: (option[2] && option[2].code) || '',
        cityName: (option[2] && option[2].name) || '',
        countyCode: (option[3] && option[3].code) || '',
        countyName: (option[3] && option[3].name) || '',
        streetCode: (option[4] && option[4].code) || '',
        streetName: (option[4] && option[4].name) || '',
      };
    }
    if (o[o.length - 1].isHaveLow === 2) {
      this.passVal(obj, 1);
      return false;
    }
    return null;
  };

  // 传递省市区和详细地址的值
  passVal = (address, type) => {
    this.props.addressVal(address, type);
  };

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.children && targetOption.children[0].id) return null;
    targetOption.loading = true;

    api.area.byParentIdGetArea(targetOption.id).then(res => {
      targetOption.loading = false;
      targetOption.children = res;
      // eslint-disable-next-line react/no-access-state-in-setstate
      const countrys = [...this.state.countryCode];
      this.props.dispatch({
        type: 'areaCache/setCache',
        payload: { type: 'countrys', targetState: countrys },
      });
    });
    return null;
  };

  defaultValueSetting = (oldAddress, defaultAddress) => {
    if (defaultAddress) {
      return [defaultAddress];
    }
    if (oldAddress) {
      return [oldAddress];
    }
    return [];
  };

  render() {
    const { countryCode } = this.state;
    const { userData, defaultAddress } = this.props;
    const { basic } = userData;
    const defaultValue = this.defaultValueSetting(
      basic.length !== 0 ? basic.countryCode : '',
      defaultAddress,
    );
    return (
      <InputGroup compact>
        <Cascader
          style={{ width: '40%' }}
          options={countryCode}
          loadData={this.loadData}
          fieldNames={{ label: 'name', value: 'code' }}
          changeOnSelect
          defaultValue={defaultValue}
          onChange={(value, selectedOptions) => this.selectArea(value, selectedOptions)}
        />
        <Input
          style={{ width: '60%' }}
          placeholder="详细地址"
          defaultValue={userData.basic.address}
          onChange={e => this.passVal(e.target.value, 2)}
        />
      </InputGroup>
    );
  }
}

@connect(({ basicCache, user, global, bpCache, bp }) => {
  const industryCategories = basicCache.industryCategories.filter(
    e => e.languageCode === global.languageCode,
  );
  // const industryCategories = bp.Industry;
  return {
    industryCategories,
    // industryCategories: basicCache.industryCategories,
    countryDiallingCodes: basicCache.countryDiallingCodes,
    authorization: user.currentUser.authorization,
    industryCategoryAll: bpCache.industryCategoryAll,
    PiCertificationStatus: bp.PiCertificationStatus,
  };
})
class ChangeModal extends Component {
  constructor(props) {
    super(props);
    const guuid = guid();
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
      guuid,
      changeModal: false,
      defaultAddress: '',
      pageLoading: true,
      industryCategory: [],
      noHaveLev: false,
      switchCountryName: '',
      buttonLoading: false,
      readOnlyBool: false,
      taxNoEmpty: true,
      bankAccountEmpty: true,
      regisAddressEmpty: true,
      notesEmpty: true,
    };
    this.fetchBank = debounce(this.fetchBank, 500);
  }

  componentDidMount() {
    this.props.onRef(this);
    this.props.dispatch({
      type: 'basicCache/setState',
      payload: { type: 'countryDiallingCodes' },
    });
    this.props.dispatch({
      type: 'bpCache/getCache',
      payload: { type: 'industryCategoryAll' },
    });
  }

  /** props更新时调用 */
  visibleShow = (changeModal, recordMsg) => {
    const { gtype, guuid } = this.state;
    this.setState({ changeModal });
    const diskFileIdList = [];
    if (recordMsg) {
      if (recordMsg.type === 1 || gtype === 2) {
        api.bp.getBPPiCertification(recordMsg.id).then(res => {
          this.setState({
            userData: res,
            pageLoading: false,
          });
          if (res.piCertificationList.length !== 0) {
            const codeList = [];
            const newData = [];
            res.piCertificationList.forEach(item => {
              codeList.push(item.attachmentCode);
              newData.push({
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
                newData.forEach((item, index) => {
                  v.forEach(i => {
                    if (i.sourceCode === item.attachmentCode) {
                      newData[index].pic.push(api.disk.downloadFiles(i.id, { view: true }));
                    }
                  });
                });
                this.setState({
                  userPersonData: newData,
                });
              });
          }
        });
      } else {
        api.bp.getBPOrgCertification(recordMsg.id).then(res => {
          if (res.organizationCertification) {
            api.disk
              .getFiles({
                sourceKey: 'bp_organization_certification',
                sourceCode: res.organizationCertification.attachmentCode,
              })
              .then(v => {
                v.forEach(item => {
                  diskFileIdList.push(item.diskFileId);
                });
                const newData = {
                  diskFileIdList,
                  sourceCode: guuid,
                  sourceKey: 'bp_organization_certification',
                };
                api.disk.copyFiles(newData).then(() => {
                  // 找出copy出来的图片，copy的id不同
                  api.disk
                    .getFiles({
                      sourceKey: 'bp_organization_certification',
                      sourceCode: guuid,
                    })
                    .then(v1 => {
                      this.setState({ pic: v1 });
                      if (v1 instanceof Array) {
                        v1.forEach(item => {
                          diskFileIdList.push(item.diskFileId);
                        });
                      }
                    });
                });
              });
          }
          this.setState({
            pageLoading: false,
            userData: res,
            address: res.basic.address ? res.basic.address : '',
            specialInvoice: res.organizationCertification
              ? parseInt(res.organizationCertification.specialInvoice, 10) === 1
              : false,
          });
        });
      }

      this.setState({
        recordMsg,
        loading: false,
      });
    }
  };

  // 输入银行关键字
  fetchBank = value => {
    const { switchCountryName, userData } = this.state;
    if (!value) {
      this.setState({ bank: [] });
      return;
    }
    api.basic
      .getBanks({
        codeOrFullName: value,
        countryCode: switchCountryName || userData.basic.sapCountryCode,
      })
      .then(bank => {
        this.setState({ bank });
      });
  };

  // 个人提交判断是否修改过名称
  handlePerson = e => {
    if (e) e.preventDefault();
    const {
      userData: { basic },
      personalShow,
    } = this.state;
    if (!personalShow) {
      const nameErr = validateEmpty(
        this.props.form.getFieldValue('pname').name,
        formatMessage({ id: 'bp.maintain_details.name' }),
      );
      if (nameErr) {
        message.error(nameErr);
        return false;
      }
    }
    const self = this;
    if (!personalShow) {
      if (this.props.form.getFieldValue('pname').length === 0) return false;
      if (!this.props.form.getFieldValue('pname').name) return false;
      if (this.props.form.getFieldValue('pname').name !== basic.name) {
        confirm({
          title: '确定要修改名字吗?',
          content: '修改名称认证资料需重新审核，所有售达方及送达方全部清空，信用数据将全部失效',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          onOk() {
            self.handlePersonOk();
          },
          onCancel() {
            return false;
          },
        });
      } else {
        self.handlePersonOk();
      }
    } else {
      self.handlePersonOk();
    }
    return null;
  };

  // 个人提交
  handlePersonOk = () => {
    const { newDataList, userData, recordMsg, deletePiCertificationIdList } = this.state;
    // 验证用户名
    this.setState({
      buttonLoading: true,
    });
    const newPiCertificationList = [];
    newDataList.forEach(item => {
      newPiCertificationList.push({
        billToPartyId: item.billToPartyId,
        notes: item.notes,
        attachmentCode: item.attachmentCode,
      });
    });
    const data = {
      basic: {
        name: this.props.form.getFieldValue('pname')
          ? this.props.form.getFieldValue('pname').name
          : userData.basic.name,
      },
      newPiCertificationList,
      deletePiCertificationIdList,
    };
    this.setState({ deletePiCertificationIdList: [] });
    api.bp
      .updateBPPiCertificationList(recordMsg.id, data)
      .then(() => {
        this.setState({
          buttonLoading: false,
          submitNext: 2,
        });
        this.props.getData();
      })
      .catch(() => {
        this.setState({
          buttonLoading: false,
        });
      });
  };

  // 组织提交判断是否修改过名称
  handleOrganization = e => {
    if (e) e.preventDefault();
    const {
      userData: { basic },
      groupNameShow,
    } = this.state;
    // 验证用户名
    if (!groupNameShow) {
      const nameErr = validateEmpty(
        this.props.form.getFieldValue('msg').name,
        formatMessage({ id: 'bp.maintain_details.name' }),
      );
      if (nameErr) {
        message.error(nameErr);
        return false;
      }
    }
    const self = this;
    this.props.form.validateFields((error, row) => {
      if (!groupNameShow) {
        if (row.msg.name !== basic.name) {
          confirm({
            title: '确定要修改名字吗?',
            content: '修改名称认证资料需重新审核，所有售达方及送达方全部清空，信用数据将全部失效',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            centered: true,
            onOk() {
              self.handleOrganizationOk();
            },
            onCancel() {
              return false;
            },
          });
        } else {
          self.handleOrganizationOk();
        }
      } else {
        self.handleOrganizationOk();
      }
    });
    return null;
  };

  // 组织提交
  handleOrganizationOk = () => {
    const {
      address,
      area,
      userData: { basic },
      userData,
      recordMsg,
      gtype,
      guuid,
      groupAdressShow,
      noHaveLev,
    } = this.state;
    this.props.form.validateFields((error, row) => {
      if (error) return false;

      // 验证联系地址
      if (!groupAdressShow) {
        if (!noHaveLev || area.length === 0) {
          message.error('请选择完整的地址');
          return false;
        }
      }

      const taxNosErr = validateEmpty(row.taxNo, '税号');
      if (taxNosErr) {
        message.error(taxNosErr);
        return false;
      }

      const notesErr = validateEmpty(
        row.notes,
        formatMessage({
          id: 'bp.maintain_details.verification_data.memo',
        }),
      );
      if (notesErr) {
        message.error(notesErr);
        return false;
      }

      if ((groupAdressShow && basic.sapCountryCode === 'CN') || area[0] === '1000000000') {
        // const telephoneCountryCodeErr = validateEmpty(
        //   row.phoneNum.telephoneCountryCode,
        //   '电话国家编号',
        // );
        // if (telephoneCountryCodeErr) {
        //   message.error(telephoneCountryCodeErr);
        //   return false;
        // }

        // const telephoneAreaCodeErr = validateEmpty(row.phoneNum.telephoneAreaCode, '电话区号');
        // if (telephoneAreaCodeErr) {
        //   message.error(telephoneAreaCodeErr);
        //   return false;
        // }

        // const telephoneErr = validateEmpty(row.phoneNum.telephone, '电话');
        // if (telephoneErr) {
        //   message.error(telephoneErr);
        //   return false;
        // }

        // const telephoneExtensionErr = validateEmpty(row.phoneNum.telephoneExtension, '电话分机号');
        // if (telephoneExtensionErr) {
        //   message.error(telephoneExtensionErr);
        //   return false;
        // }

        const taxNoErr = validateEmpty(
          row.taxNo,
          formatMessage({
            id: 'bp.maintain_details.verification_data.VAT_Business',
          }),
        );
        if (taxNoErr) {
          message.error(taxNoErr);
          return false;
        }

        const bankCodeErr = validateEmpty(
          row.bankCode,
          formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' }),
        );
        if (bankCodeErr) {
          message.error(bankCodeErr);
          return false;
        }

        const bankAccountErr = validateEmpty(
          row.bankAccount,
          formatMessage({ id: 'bp.maintain_details.verification_data.account_number' }),
        );
        if (bankAccountErr) {
          message.error(bankAccountErr);
          return false;
        }

        const regisAddressErr = validateEmpty(
          row.regisAddress,
          formatMessage({ id: 'bp.maintain_details.verification_data.address' }),
        );
        if (regisAddressErr) {
          message.error(regisAddressErr);
          return false;
        }
      }

      this.setState({
        buttonLoading: true,
      });

      let data = {};
      // 地址是否变更
      if (groupAdressShow) {
        data = {
          basic: {
            id: recordMsg.id,
            name: row.msg ? row.msg.name : basic.name,
            countryCode: basic.countryCode,
            provinceCode: basic.provinceCode,
            cityCode: basic.cityCode,
            countyCode: basic.countyCode,
            streetCode: basic.streetCode,
            address: basic.address,
          },
          organizationCertification: {
            taxNo: row.taxNo,
            notes: row.notes,
            attachmentCode: guuid,
          },
        };
      } else {
        data = {
          basic: {
            id: recordMsg.id,
            name: row.msg ? row.msg.name : basic.name,
            countryCode: area[0] ? area[0] : '',
            provinceCode: area[1] ? area[1] : '',
            cityCode: area[2] ? area[2] : '',
            countyCode: area[3] ? area[3] : '',
            streetCode: area[4] ? area[4] : '',
            address,
          },
          organizationCertification: {
            taxNo: row.taxNo,
            notes: row.notes,
            attachmentCode: guuid,
          },
        };
      }

      if (gtype === 1 || (!gtype && basic.sapCountryCode === 'CN')) {
        Object.assign(data.basic, {
          industryCode: row.industry || basic.industryCode,
          telephoneCountryCode: row.phoneNum.telephoneCountryCode || basic.telephoneCountryCode,
          telephoneAreaCode: row.phoneNum.telephoneAreaCode || basic.telephoneAreaCode,
          telephone: row.phoneNum.telephone || basic.telephone,
          telephoneExtension: row.phoneNum.telephoneExtension || basic.telephoneExtension,
        });
        Object.assign(data.organizationCertification, {
          specialInvoice: row.specialInvoice ? 1 : 2,
          // eslint-disable-next-line no-nested-ternary
          bankCode: row.bankCode
            ? isNumber(row.bankCode)
              ? row.bankCode
              : userData.organizationCertification.bankCode
            : '',
          bankAccount: row.bankAccount || '',
          registeredAddress: row.regisAddress || '',
        });
      }
      api.bp
        .updateBPOrgCertification(data)
        .then(() => {
          this.setState({ submitNext: 2, buttonLoading: false });
          this.props.getData();
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
      return null;
    });
  };

  addressVal = (address, type) => {
    if (type === 1) {
      this.setState({
        area: address,
      });
    }
    if (type === 2) {
      this.setState({
        address,
      });
    }
  };

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
      defaultAddress: '',
      noHaveLev: false,
      guuid: guid(),
      switchCountryName: '',
      buttonLoading: false,
      industryCategory: [],
      readOnlyBool: false,
      taxNoEmpty: true,
      bankAccountEmpty: true,
      regisAddressEmpty: true,
      notesEmpty: true,
    });
  };

  /** 上传和删除图片 */
  handleChange = info => {
    const { pic } = this.state;
    let data = pic;
    if (info.file.status === 'removed') {
      data = pic.filter(
        item => item.id !== (info.file.response ? info.file.response[0] : info.file.uid),
      );
      api.disk.deleteFiles(info.file.response ? info.file.response[0] : info.file.uid);
      return;
    }
    if (info.file.status === 'done') {
      data.push({
        id: info.file.response[0],
        name: Math.random(),
        status: 'done',
      });
      this.setState({
        pic: data,
      });
      // });
    }
  };

  /** 个人变更 */
  updetaPersonal = e => {
    e.preventDefault();
    this.setState({
      personalShow: false,
      // name: 'leo wang',
    });
  };

  // 个人名称修改
  renderPerform = name => {
    const { personalShow } = this.state;
    return personalShow ? this.personalShow(name) : this.persnalInput(name);
  };

  personalShow = name => (
    <div style={{ marginLeft: '30%' }}>
      <Form.Item label={formatMessage({ id: 'bp.maintain_details.name' })}>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Icon type="user" /> &nbsp;<span>{name}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a onClick={event => this.updetaPersonal(event)}>
          {formatMessage({ id: 'action.change' })}
        </a>
      </Form.Item>
    </div>
  );

  // 名称修改模式
  nameChangeType = v => {
    const {
      userData: {
        basic: { sapCountryCode },
      },
    } = this.state;
    if (v.type === 'group') {
      if (sapCountryCode) {
        this.setState({
          gtype: 4,
        });
      }
      if (sapCountryCode === 'CN' || !sapCountryCode) {
        this.setState({
          gtype: 1,
        });
      }
      if (sapCountryCode === 'GB') {
        this.setState({
          gtype: 3,
        });
      }
    }
    if (v.type === 'personal') {
      this.setState({
        gtype: 2,
      });
    }
  };

  // 国家修改模式
  countryChangeType = (v, noHaveLev) => {
    const {
      userData: { basic },
    } = this.state;
    const { industryCategoryAll } = this.props;
    const industry = industryCategoryAll.filter(item => item.industryCode === basic.industryCode);
    this.setState({
      switchCountryName: v,
      readOnlyBool: false,
    });
    this.props.form.resetFields('bankCode');
    if (noHaveLev === 2) {
      this.setState({
        noHaveLev: true,
      });
    } else {
      this.setState({
        noHaveLev: false,
      });
    }
    if (v === 'CN') {
      if (industry.length !== 0) {
        if (industry[0].repeatTaxNo === 1) {
          this.props.form.setFieldsValue({
            taxNo: industry[0].taxNo,
          });
          this.setState({
            readOnlyBool: true,
          });
        }
      }
      this.setState({
        gtype: 1,
      });
      return;
    }
    if (v === 'GB') {
      this.setState({
        gtype: 3,
      });
      return;
    }
    if (v) {
      this.setState({
        gtype: 4,
      });
    }
  };

  persnalInput = name => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form.Item
        label={formatMessage({ id: 'bp.maintain_details.name' })}
        hasFeedback
        validateStatus={
          form.getFieldValue('pname')
            ? form.getFieldValue('pname').name
              ? 'success'
              : 'error'
            : 'error'
        }
      >
        {getFieldDecorator('pname')(
          <NameGroup name={name} nameChangGType={v => this.nameChangeType(v)} type="personal" />,
        )}
      </Form.Item>
    );
  };

  /** Group */
  renderGroupNameForm = () => {
    const { groupNameShow } = this.state;
    return groupNameShow ? this.groupNameShow() : this.groupNameInput();
  };

  groupNameShow = () => {
    const { recordMsg } = this.state;
    if (recordMsg) {
      return (
        <Col lg={24} md={12} sm={12}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain_details.name' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Icon type="home" />
            &nbsp;&nbsp;<span>{recordMsg.name}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <a onClick={event => this.updetaNameGroup(event, recordMsg)}>
              {formatMessage({ id: 'action.change' })}
            </a>
          </FormItem>
        </Col>
      );
    }
    return null;
  };

  defaultAddressCode = v => {
    this.setState({ defaultAddress: v });
  };

  groupNameInput = () => {
    const { form, name } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Col lg={24} md={12} sm={12}>
        <FormItem
          label={formatMessage({ id: 'bp.maintain_details.name' })}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          hasFeedback
          validateStatus={
            form.getFieldValue('msg')
              ? form.getFieldValue('msg').name
                ? 'success'
                : 'error'
              : 'error'
          }
          // help={form.getFieldValue('msg') ? '' : '请输入信息'}
        >
          {getFieldDecorator('msg')(
            <NameGroup nameChangGType={v => this.nameChangeType(v)} name={name} type="group" />,
          )}
        </FormItem>
      </Col>
    );
  };

  updetaNameGroup = (e, userData) => {
    e.preventDefault();
    if (userData) {
      this.setState({
        groupNameShow: false,
        name: userData.name,
      });
    }
  };

  renderAdressForm = () => {
    const { groupAdressShow } = this.state;
    return groupAdressShow ? this.groupAdressShow() : this.groupAdressInput();
  };

  groupAdressShow = () => {
    const { recordMsg } = this.state;
    if (recordMsg) {
      return (
        <Col lg={24} md={12} sm={12}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.ChangeModal.address' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <span>
              {recordMsg.countryName}&nbsp;
              {recordMsg.provinceName}&nbsp;
              {recordMsg.cityName}&nbsp;
              {recordMsg.countyName}&nbsp;
              {recordMsg.streetName}&nbsp;{recordMsg.address}
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a onClick={event => this.updateAdressGroup(event)}>
              {formatMessage({ id: 'action.change' })}
            </a>
          </FormItem>
        </Col>
      );
    }
    return null;
  };

  groupAdressInput = () => {
    const { form, userData, gtype, address, defaultAddress, noHaveLev } = this.state;
    const { getFieldDecorator } = form;
    if (gtype === 1) {
      return (
        <Col lg={24} md={12} sm={12}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.ChangeModal.address' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            hasFeedback
            validateStatus={noHaveLev && address ? 'success' : 'error'}
            // help={form.getFieldValue('msg') ? '' : '请输入信息'}
          >
            {getFieldDecorator('address')(
              <AddressGroup
                addressVal={this.addressVal}
                gTypeName={(v, lev) => this.countryChangeType(v, lev)}
                userData={userData}
                defaultAddressCode={v => this.defaultAddressCode(v)}
                defaultAddress={defaultAddress}
              />,
            )}
          </FormItem>
        </Col>
      );
    }
    if (gtype === 3 || gtype === 4) {
      return (
        <Col lg={24} md={12} sm={12}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.ChangeModal.address' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            hasFeedback
            validateStatus={noHaveLev && address ? 'success' : 'error'}
            // help={form.getFieldValue('msg') ? '' : '请输入信息'}
          >
            {getFieldDecorator('address')(
              <AddressGroup
                addressVal={this.addressVal}
                gTypeName={(v, lev) => this.countryChangeType(v, lev)}
                userData={userData}
                defaultAddressCode={v => this.defaultAddressCode(v)}
                defaultAddress={defaultAddress}
              />,
            )}
          </FormItem>
        </Col>
      );
    }
    if (userData.basic.sapCountryCode === 'CN') {
      return (
        <Col lg={24} md={12} sm={12}>
          <FormItem
            label={formatMessage({ id: 'bp.maintain.ChangeModal.address' })}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            hasFeedback
            validateStatus={noHaveLev && address ? 'success' : 'error'}
            // help={form.getFieldValue('msg') ? '' : '请输入信息'}
          >
            {getFieldDecorator('address')(
              <AddressGroup
                addressVal={this.addressVal}
                gTypeName={(v, lev) => this.countryChangeType(v, lev)}
                userData={userData}
                defaultAddressCode={v => this.defaultAddressCode(v)}
                defaultAddress={defaultAddress}
              />,
            )}
          </FormItem>
        </Col>
      );
    }
    return (
      <Col lg={24} md={12} sm={12}>
        <FormItem
          label={formatMessage({ id: 'bp.maintain.ChangeModal.address' })}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          hasFeedback
          validateStatus={noHaveLev && address ? 'success' : 'error'}
          // help={form.getFieldValue('msg') ? '' : '请输入信息'}
        >
          {getFieldDecorator('address')(
            <AddressGroup
              addressVal={this.addressVal}
              gTypeName={(v, lev) => this.countryChangeType(v, lev)}
              userData={userData}
              defaultAddressCode={v => this.defaultAddressCode(v)}
              defaultAddress={defaultAddress}
            />,
          )}
        </FormItem>
      </Col>
    );
  };

  updateAdressGroup = e => {
    e.preventDefault();
    this.setState({
      groupAdressShow: false,
    });
  };

  renderIndustryForm = () => {
    const { groupIndustryShow } = this.state;
    return groupIndustryShow ? this.groupInstruShow() : this.groupInstruInput();
  };

  updateIndustryGroup = () => {
    this.setState({
      groupIndustryShow: false,
    });
  };

  groupInstruShow = () => {
    const {
      userData: { basic },
    } = this.state;
    const { industryCategoryAll } = this.props;
    return (
      <Col lg={12} md={12} sm={12}>
        <FormItem label={formatMessage({ id: 'bp.maintain.ChangeModal.businessType' })}>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span>
            {formatter(industryCategoryAll, basic.industryCode, 'industryCode', 'industryName')}
          </span>{' '}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a onClick={event => this.updateIndustryGroup(event)}>
            {formatMessage({ id: 'action.change' })}
          </a>
        </FormItem>
      </Col>
    );
  };

  groupInstruInput = () => {
    const {
      form,
      userData: { basic },
    } = this.state;
    const { getFieldDecorator } = form;
    const { industryCategoryAll } = this.props;
    return (
      <Col lg={12} md={12} sm={12}>
        <FormItem label={formatMessage({ id: 'bp.maintain.ChangeModal.businessType' })}>
          {getFieldDecorator('industry', {
            initialValue: basic.industryCode,
          })(
            <Select
              placeholder={formatMessage({ id: 'bp.pleaseSelect' })}
              onChange={v => {
                this.industryCategoryChange(v);
              }}
            >
              {industryCategoryAll.map(item => (
                <Option
                  key={item.industryCode}
                  value={item.industryCode}
                  disabled={item.industryCode === '07'}
                >
                  {item.industryName}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
      </Col>
    );
  };

  // 行业类别选择
  industryCategoryChange = v => {
    const { industryCategoryAll } = this.props;
    const industryData = industryCategoryAll.filter(item => item.industryCode === v);
    if (industryData.length !== 0) {
      if (industryData[0].repeatTaxNo === 1) {
        this.props.form.setFieldsValue({
          taxNo: industryData[0].taxNo,
        });
      }
    }
    this.setState({
      readOnlyBool: false,
    });
  };

  // 统一社会信用代码只读状态的判断
  readOnlyStatus = v => {
    const { industryCategoryAll } = this.props;
    if (typeof v === 'object' && v.constructor === Array) {
      if (v[0].repeatTaxNo === 1) {
        return true;
      }
    }
    if (typeof v === 'string') {
      const industryData = industryCategoryAll.filter(item => item.taxNo === v);
      if (industryData.length !== 0) {
        if (industryData[0].repeatTaxNo === 1) {
          return true;
        }
      }
    }

    return false;
  };

  // 删除
  removeItem = id => {
    const { newDataList, userPersonData, deletePiCertificationIdList } = this.state;
    // 删除新增数据
    const newData = newDataList.filter(item => item.id !== id);
    this.setState({
      newDataList: newData,
    });
    const deletePiCertificationId = deletePiCertificationIdList;
    userPersonData.forEach(item => {
      if (item.id === id) {
        deletePiCertificationId.push(id);
      }
    });
    const oldData = userPersonData.filter(item => item.id !== id);
    this.setState({
      deletePiCertificationIdList: deletePiCertificationId,
      userPersonData: oldData,
    });
  };

  renderListItem = item => {
    const { PiCertificationStatus } = this.props;
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
                  <a onClick={() => this.removeItem(item.id, item)}>
                    {formatMessage({ id: 'action.delete' })}
                  </a>
                </>
              )
            }
          >
            <div style={{ marginBottom: '.8em' }}>
              <Badge
                status={formatter(PiCertificationStatus, item.status, 'id', 'badge')}
                text={formatter(PiCertificationStatus, item.status, 'id', 'name')}
              />
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

    return (
      <List.Item>
        <Button
          type="dashed"
          style={{ width: '100%', height: 304 }}
          onClick={() => this.handleModalVisible(true)}
        >
          <Icon type="plus" /> {formatMessage({ id: 'bp.newCertifications' })}
        </Button>
      </List.Item>
    );
  };

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
        picArr.push(item.thumbUrl);
      });
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
    });
  };

  // 统一社会信用代码默认数据显示
  taxNoShow = (userData, industryCategory) => {
    if (industryCategory.length !== 0) {
      if (industryCategory[0].taxNo) {
        return industryCategory[0].taxNo;
      }
    }
    if (userData.organizationCertification) {
      if (userData.organizationCertification.taxNo) {
        return userData.organizationCertification.taxNo;
      }
    }
    return '';
  };

  render() {
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
      form,
      industryCategory,
      buttonLoading,
      readOnlyBool,
      taxNoEmpty,
      bankAccountEmpty,
      regisAddressEmpty,
      notesEmpty,
    } = this.state;
    // console.log(userData.constructor === Object);
    if (!userData.basic || !(pic instanceof Array)) return null;
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
    const { getFieldDecorator } = form;
    const { TextArea } = Input;
    let modelContent;
    const userPersonList =
      userPersonData.length !== 0 ? userPersonData.concat(newDataList) : newDataList;
    const userDataTaxNo = userData.organizationCertification
      ? userData.organizationCertification.taxNo
      : '';
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">
          {formatMessage({ id: 'bp.maintain.ChangeModal.clickToUpload' })}
        </div>
      </div>
    );
    const uploadUrl = api.disk.uploadMoreFiles('bp_organization_certification', guuid);

    const uploadModal = (
      <Upload
        name="files"
        multiple
        listType="picture-card"
        showUploadList
        action={uploadUrl}
        onChange={this.handleChange}
        headers={{ Authorization: this.props.authorization }}
        accept=".jpg"
      >
        {uploadButton}
      </Upload>
    );

    if (gtype === 2) {
      modelWidth = 830;

      const parentMethods = {
        handleAdd: this.handleAdd,
        handleModalVisible: this.handleModalVisible,
      };
      modelContent = (
        <>
          <Form {...formItemLayout} onSubmit={this.handlePerson}>
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
                attachmentCode={
                  userData.piCertificationList
                    ? userData.piCertificationList.attachmentCode
                      ? userData.piCertificationList.attachmentCode
                      : ''
                    : ''
                }
              />
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    } else if (gtype === 1) {
      modelWidth = 1130;
      modelContent = (
        <>
          <Form {...formItemLayoutGroup} labelAlign="left" onSubmit={this.handleOrganization}>
            <Row gutter={32}>
              <>
                {this.renderGroupNameForm()}
                {this.renderAdressForm()}
              </>
              <Col lg={12} md={12} sm={12}>
                <FormItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>
                  {getFieldDecorator('phoneNum', {
                    initialValue: {
                      telephoneCountryCode: basic.telephoneCountryCode,
                      telephoneAreaCode: basic.telephoneAreaCode,
                      telephone: basic.telephone,
                      telephoneExtension: basic.telephoneExtension,
                    },
                  })(<TelphoneInput />)}
                </FormItem>
              </Col>
              {this.renderIndustryForm()}
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.special_invoice',
                  })}
                >
                  {getFieldDecorator('specialInvoice')(
                    <Switch
                      style={{ marginLeft: '7px' }}
                      checkedChildren={formatMessage({ id: 'bp.maintain.ChangeModal.on' })}
                      unCheckedChildren={formatMessage({ id: 'bp.maintain.ChangeModal.off' })}
                      onChange={() => {
                        this.setState({
                          specialInvoice: !specialInvoice,
                        });
                      }}
                      checked={specialInvoice}
                    />,
                  )}
                </FormItem>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.VAT_Business',
                  })}
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={
                    taxNoEmpty
                      ? form.getFieldValue('taxNo') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.taxNo
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('taxNo', {
                    initialValue: this.taxNoShow(userData, industryCategory),
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            taxNoEmpty: false,
                          });
                        } else {
                          this.setState({
                            taxNoEmpty: true,
                          });
                        }
                      }}
                      readOnly={
                        readOnlyBool ||
                        this.readOnlyStatus(
                          industryCategory.length !== 0 ? industryCategory : userDataTaxNo,
                        )
                      }
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
                  className="marginLeft7"
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={
                    form.getFieldValue('bankCode') ||
                    (userData.organizationCertification
                      ? !!userData.organizationCertification.bankCode
                      : '')
                      ? 'success'
                      : 'error'
                  }
                  // help={form.getFieldValue('bankCode') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('bankCode', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.bankName
                        ? userData.organizationCertification.bankName
                        : ''
                      : '',
                  })(
                    <Select
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
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.account_number',
                  })}
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={
                    bankAccountEmpty
                      ? form.getFieldValue('bankAccount') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.bankAccount
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('bankAccount') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('bankAccount', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.bankAccount
                        ? userData.organizationCertification.bankAccount
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            bankAccountEmpty: false,
                          });
                        } else {
                          this.setState({
                            bankAccountEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={
                    regisAddressEmpty
                      ? form.getFieldValue('regisAddress') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.address
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                >
                  {getFieldDecorator('regisAddress', {
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.address
                        ? userData.organizationCertification.address
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            regisAddressEmpty: false,
                          });
                        } else {
                          this.setState({
                            regisAddressEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
                  hasFeedback
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  // eslint-disable-next-line max-len
                  validateStatus={
                    notesEmpty
                      ? form.getFieldValue('notes') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.notes
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                >
                  {getFieldDecorator('notes', {
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.notes
                        ? userData.organizationCertification.notes
                        : ''
                      : '',
                  })(
                    <TextArea
                      rows={2}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            notesEmpty: false,
                          });
                        } else {
                          this.setState({
                            notesEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.verification_documents',
                  })}
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
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    } else if (gtype === 3) {
      modelWidth = 800;
      modelContent = (
        <>
          <Form {...formItemLayout} onSubmit={this.handleOrganization}>
            <Row gutter={32}>
              {this.renderGroupNameForm()}
              {this.renderAdressForm()}
              <Col lg={24} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain.ChangeModal.vat' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    taxNoEmpty
                      ? form.getFieldValue('taxNo') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.taxNo
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('taxNo', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.taxNo
                        ? userData.organizationCertification.taxNo
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            taxNoEmpty: false,
                          });
                        } else {
                          this.setState({
                            taxNoEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    notesEmpty
                      ? form.getFieldValue('notes') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.notes
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.notes
                        ? userData.organizationCertification.notes
                        : ''
                      : '',
                  })(
                    <TextArea
                      rows={2}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            notesEmpty: false,
                          });
                        } else {
                          this.setState({
                            notesEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.verification_documents',
                  })}
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
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    } else if (gtype === 4) {
      modelWidth = 800;
      modelContent = (
        <>
          <Form {...formItemLayout} onSubmit={this.handleOrganization}>
            <Row gutter={32}>
              {this.renderGroupNameForm()}
              {this.renderAdressForm()}
              <Col lg={24} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain.ChangeModal.taxExemptID' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    taxNoEmpty
                      ? form.getFieldValue('taxNo') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.taxNo
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('taxNo', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.taxNo
                        ? userData.organizationCertification.taxNo
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            taxNoEmpty: false,
                          });
                        } else {
                          this.setState({
                            taxNoEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    notesEmpty
                      ? form.getFieldValue('notes') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.notes
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.notes
                        ? userData.organizationCertification.notes
                        : ''
                      : '',
                  })(
                    <TextArea
                      rows={2}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            notesEmpty: false,
                          });
                        } else {
                          this.setState({
                            notesEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.verification_documents',
                  })}
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
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    } else if (recordMsg && recordMsg.type === 1) {
      modelWidth = 830;

      const parentMethods = {
        handleAdd: this.handleAdd,
        handleModalVisible: this.handleModalVisible,
      };
      modelContent = (
        <>
          <Form {...formItemLayout} onSubmit={this.handlePerson}>
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
                attachmentCode={
                  userData.piCertificationList
                    ? userData.piCertificationList.attachmentCode
                      ? userData.piCertificationList.attachmentCode
                      : ''
                    : ''
                }
              />
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    } else if (recordMsg && recordMsg.type === 2 && userData.basic.sapCountryCode === 'CN') {
      modelWidth = 1130;
      modelContent = (
        <>
          <Form {...formItemLayoutGroup} labelAlign="left" onSubmit={this.handleOrganization}>
            <Row gutter={32}>
              <>
                {this.renderGroupNameForm()}
                {this.renderAdressForm()}
              </>
              <Col lg={12} md={12} sm={12}>
                <FormItem label={formatMessage({ id: 'bp.maintain_details.phone' })}>
                  {getFieldDecorator('phoneNum', {
                    initialValue: {
                      telephoneCountryCode: basic.telephoneCountryCode,
                      telephoneAreaCode: basic.telephoneAreaCode,
                      telephone: basic.telephone,
                      telephoneExtension: basic.telephoneExtension,
                    },
                  })(<TelphoneInput />)}
                </FormItem>
              </Col>
              {this.renderIndustryForm()}
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.special_invoice',
                  })}
                >
                  {getFieldDecorator('specialInvoice')(
                    <Switch
                      style={{ marginLeft: '7px' }}
                      checkedChildren={formatMessage({ id: 'bp.maintain.ChangeModal.on' })}
                      unCheckedChildren={formatMessage({ id: 'bp.maintain.ChangeModal.off' })}
                      onChange={() => {
                        this.setState({
                          specialInvoice: !specialInvoice,
                        });
                      }}
                      checked={specialInvoice}
                    />,
                  )}
                </FormItem>
              </Col>

              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.VAT_Business',
                  })}
                  hasFeedback
                  validateStatus={
                    taxNoEmpty
                      ? form.getFieldValue('taxNo') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.taxNo
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('taxNo', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: this.taxNoShow(userData, industryCategory),
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            taxNoEmpty: false,
                          });
                        } else {
                          this.setState({
                            taxNoEmpty: true,
                          });
                        }
                      }}
                      readOnly={
                        readOnlyBool ||
                        this.readOnlyStatus(
                          industryCategory.length !== 0 ? industryCategory : userDataTaxNo,
                        )
                      }
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.bank_name' })}
                  className="marginLeft7"
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={
                    form.getFieldValue('bankCode') ||
                    (userData.organizationCertification
                      ? !!userData.organizationCertification.bankName
                      : '')
                      ? 'success'
                      : 'error'
                  }
                  // help={form.getFieldValue('bankCode') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('bankCode', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.bankName
                        ? userData.organizationCertification.bankName
                        : ''
                      : '',
                  })(
                    <Select
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
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12}>
                <FormItem
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.account_number',
                  })}
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={
                    bankAccountEmpty
                      ? form.getFieldValue('bankAccount') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.bankAccount
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('bankAccount') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('bankAccount', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.bankAccount
                        ? userData.organizationCertification.bankAccount
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            bankAccountEmpty: false,
                          });
                        } else {
                          this.setState({
                            bankAccountEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.address' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  hasFeedback
                  // eslint-disable-next-line max-len
                  validateStatus={
                    regisAddressEmpty
                      ? form.getFieldValue('regisAddress') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.address
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('regisAddress') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('regisAddress', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.address
                        ? userData.organizationCertification.address
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            regisAddressEmpty: false,
                          });
                        } else {
                          this.setState({
                            regisAddressEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
                  hasFeedback
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  // eslint-disable-next-line max-len
                  validateStatus={
                    notesEmpty
                      ? form.getFieldValue('notes') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.notes
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.notes
                        ? userData.organizationCertification.notes
                        : ''
                      : '',
                  })(
                    <TextArea
                      rows={2}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            notesEmpty: false,
                          });
                        } else {
                          this.setState({
                            notesEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.verification_documents',
                  })}
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
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    } else if (recordMsg && recordMsg.type === 2) {
      modelWidth = 800;
      modelContent = (
        <>
          <Form {...formItemLayout} onSubmit={this.handleOrganization}>
            <Row gutter={32}>
              {this.renderGroupNameForm()}
              {this.renderAdressForm()}
              <Col lg={24} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain.ChangeModal.taxExemptID' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  required
                  validateStatus={
                    taxNoEmpty
                      ? form.getFieldValue('taxNo') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.taxNo
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('taxNo', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.taxNo
                        ? userData.organizationCertification.taxNo
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            taxNoEmpty: false,
                          });
                        } else {
                          this.setState({
                            taxNoEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    notesEmpty
                      ? form.getFieldValue('notes') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.notes
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.notes
                        ? userData.organizationCertification.notes
                        : ''
                      : '',
                  })(
                    <TextArea
                      rows={2}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            notesEmpty: false,
                          });
                        } else {
                          this.setState({
                            notesEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  className="customLabelStyles"
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.verification_documents',
                  })}
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
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    } else if (recordMsg && recordMsg.type === 2 && userData.basic.sapCountryCode === 'GB') {
      modelWidth = 800;
      modelContent = (
        <>
          <Form {...formItemLayout} onSubmit={this.handleOrganization}>
            <Row gutter={32}>
              {this.renderGroupNameForm()}
              {this.renderAdressForm()}
              <Col lg={24} md={12} sm={12}>
                <FormItem
                  label={formatMessage({ id: 'bp.maintain.ChangeModal.vat' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    taxNoEmpty
                      ? form.getFieldValue('taxNo') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.taxNo
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('taxNo') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('taxNo', {
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.taxNo
                        ? userData.organizationCertification.taxNo
                        : ''
                      : '',
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'bp.inputHere' })}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            taxNoEmpty: false,
                          });
                        } else {
                          this.setState({
                            taxNoEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({ id: 'bp.maintain_details.verification_data.memo' })}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  validateStatus={
                    notesEmpty
                      ? form.getFieldValue('notes') ||
                        (userData.organizationCertification
                          ? !!userData.organizationCertification.notes
                          : '')
                        ? 'success'
                        : 'error'
                      : 'error'
                  }
                  // help={form.getFieldValue('notes') ? '' : '请输入信息'}
                >
                  {getFieldDecorator('notes', {
                    // eslint-disable-next-line no-nested-ternary
                    initialValue: userData.organizationCertification
                      ? userData.organizationCertification.notes
                        ? userData.organizationCertification.notes
                        : ''
                      : '',
                  })(
                    <TextArea
                      rows={2}
                      onChange={e => {
                        if (!e.target.value) {
                          this.setState({
                            notesEmpty: false,
                          });
                        } else {
                          this.setState({
                            notesEmpty: true,
                          });
                        }
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col lg={24} md={12} sm={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'bp.maintain_details.verification_data.verification_documents',
                  })}
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
              <Divider style={{ margin: 0 }} />
              <Button
                htmlType="submit"
                type="primary"
                style={{ float: 'right', margin: '10px 20px' }}
                loading={buttonLoading}
              >
                {formatMessage({ id: 'action.submit' })}
              </Button>
            </Row>
          </Form>
        </>
      );
    }

    // 提交通过页面
    const passPage = (
      <>
        <div style={{ height: '180px', textAlign: 'center', paddingTop: '40px' }}>
          <Icon type="check-circle" style={{ fontSize: '40px', color: '#54C31F' }} />
          <h4 style={{ fontWeight: '600', margin: '30px 0 20px' }}>
            {formatMessage({ id: 'bp.maintain.ChangeModal.newInformation' })}
          </h4>
        </div>
      </>
    );

    return (
      <div>
        <Modal
          width={submitNext === 1 ? modelWidth : 400}
          centered
          title={
            submitNext === 1
              ? formatMessage({
                  id: 'bp.maintain.ChangeModal.changeApprovedData',
                })
              : ''
          }
          visible={changeModal}
          onCancel={this.handleCancel}
          destroyOnClose
          maskClosable={false}
          footer={null}
          className="myModel"
        >
          <Spin spinning={pageLoading}>
            {pageLoading ? (
              <Empty style={{ padding: 300, background: '#fff' }} description="loading..." />
            ) : submitNext === 1 ? (
              modelContent
            ) : (
              passPage
            )}
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(ChangeModal);
