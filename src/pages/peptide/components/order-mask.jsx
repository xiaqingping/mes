// 多肽订单新增弹框
import { Button, Col, Form, Input, Row, Select, Table, Modal, message, Divider } from 'antd';
import React, { Component } from 'react';
import api from '@/api';
import './style.less';
import { connect } from 'dva';
import { PlusOutlined } from '@ant-design/icons';
import AddressMask from './address-mask';
import CustomerMask from '@/pages/peptide/components/customer-mask';
import SubCustomerMask from '@/pages/peptide/components/subCustomer-mask';
import ContactMask from '@/pages/peptide/components/contact-mask';
import SalerMask from '@/pages/peptide/components/saler-mask';
import LoadMask from '@/pages/peptide/components/load-mask';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

class AddPage extends Component {
  tableSearchFormRef = React.createRef();

  state = {
    factorys: [],
    plusStatus: false,
    productAmount: parseFloat(9546.23).toFixed(2),
    // freight: parseFloat(5).toFixed(2),
    amount: (9546.23 + 5.0).toFixed(2),
  };

  initialValues = {
    rangeOrganization: '',
    regionCode: '3100',
    officeCode: '998',
    invoiceType: '20',
    invoiceByGoods: 0,
    deliveryType: '01',
    factory: '3100',
    productAmount: (9546.23).toFixed(2),
    orderTypeStatus: 0,
    freight: (5).toFixed(2),
    currency: 'CNY',
  };

  componentDidMount() {
    api.basic.getPlants().then(data => {
      this.setState({
        factorys: data,
      });
    });
  }

  // 获取批量导入序列
  loadData = v => {
    const val = v.replace(/[\uff0c]/g, ',').split('\n');
    let data = [];
    val.forEach(item => {
      data = [...data, item.split(',')];
    });
    this.props.handleAdd(data);
  };

  getMaskData = (v, type) => {
    if (type === 'customer') {
      this.tableSearchFormRef.current.setFieldsValue({
        customerName: v.name,
      });
    }
    if (type === 'subCustomer') {
      this.tableSearchFormRef.current.setFieldsValue({
        subCustomerName: v.name,
      });
    }
    if (type === 'contact') {
      this.tableSearchFormRef.current.setFieldsValue({
        contactName: v.name,
      });
    }
    if (type === 'saler') {
      this.tableSearchFormRef.current.setFieldsValue({
        salerName: v.name,
      });
    }
  };

  // 修改加号颜色
  changePlusStatus = v => {
    this.setState({
      plusStatus: v,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.handleAdd([], values);
    });
  };

  // 渲染表单
  simpleForm = () => {
    const {
      peptide: { commonData, salesRanges, salesPaymentMethods },
      peptide,
      language,
    } = this.props;
    const { factorys, plusStatus, amount, productAmount } = this.state;
    const regions = peptide.regions.filter(e => e.languageCode === language);
    const offices = peptide.offices.filter(e => e.languageCode === language);
    const currencies = peptide.currencies.filter(e => e.languageCode === language);
    const taxInvoiceTypes = peptide.taxInvoiceTypes.filter(e => e.languageCode === language);
    return (
      // <Form layout="inline" onSubmit={this.handleSubmit} className="myForm">
      //   <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
      <>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="订单编号" name="code">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售类型" name="salesType">
            <Select>
              <Option value="0">全部</Option>
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="客户" name="customerName">
            <Search onSearch={() => this.showCustomer.visibleShow(true)} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售范围" name="rangeOrganization">
            <Select>
              <Option value="">全部</Option>
              {salesRanges.map(item => (
                <Option
                  key={`${item.organization}${item.channel}`}
                  value={`${item.channelName} - ${item.organizationName}`}
                >
                  {`${item.channelName} - ${item.organizationName}`}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="负责人" name="subCustomerName">
            <Search onSearch={() => this.showSubCustomer.visibleShow(true)} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售大区" name="regionCode">
            <Select disabled>
              {regions.map(item => (
                <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="订货人" name="contactName">
            <Search onSearch={() => this.showContact.visibleShow(true)} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售网点" name="officeCode">
            <Select disabled>
              {offices.map(item => (
                <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="配送网点" name="dofficeCode">
            <Select>
              <Option value="0">全部</Option>
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售员" name="salerName">
            <Search onSearch={() => this.showSaler.visibleShow(true)} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="销售部门" name="departmentCode">
            <Select>
              <Option value="0">全部</Option>
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="信用额度" name="credit">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="开票方式" name="invoiceType">
            <Select>
              {taxInvoiceTypes.map(item => (
                <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="信用余额" name="balance">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="付款方式" name="paymentMethod">
            <Select>
              {salesPaymentMethods.map(item => (
                <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="专项经费" name="depositBalance">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="付款条件" name="paymentTerm">
            <Select>
              <Option value="0">全部</Option>
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="SAP销售订单编号" name="sapOrderCode">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="随货开票" name="invoiceByGoods">
            <Select>
              {commonData.invoiceByGoodsStatus.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="SAP交货单号" name="sapDeliveryCode">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="sap采购申请单号" name="sapProcureApplyCode">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="客户订单号" name="customerPoCode">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="客户订单日期" name="customerPoDate">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="交货方式" name="deliveryType">
            <Select disabled>
              {commonData.deliveryTypeStatus.map(item => (
                <Option key={item.id} value={item.id}>{`${item.id}-${item.name}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="仓库" name="storageCode">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="SAP交货单号" name="sapDeliveryCode">
            <Select>
              <Option value="0">全部</Option>
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="工厂" name="factory">
            <Select disabled>
              {factorys.map(item => (
                <Option key={item.code} value={item.code}>{`${item.code}-${item.name}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="产品金额" name="productAmount">
            <Input readOnly />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="订单类型" name="orderTypeStatus">
            <Select>
              {commonData.orderTypeStatus.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="运费" name="freight">
            <Input
              onChange={e => {
                this.tableSearchFormRef.current.setFieldsValue({
                  amount: parseFloat(e.target.value) + parseFloat(productAmount),
                });
              }}
            />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="订单金额" name="amount">
            <Input readOnly defaultValue={amount} value={amount} />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="订货人邮箱" name="contactEmail">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="订货人手机" name="contactMobile">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="币种" name="currency">
            <Select disabled>
              {currencies.map(item => (
                <Option
                  key={item.code}
                  value={item.code}
                >{`${item.code}-${item.shortText}`}</Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="备注" name="remark">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="地址" name="address">
            <Select>
              <Option value="0">全部</Option>
            </Select>
          </FormItem>
          <div
            style={{ position: 'absolute', top: '5px', right: '40px', cursor: 'pointer' }}
            onMouseLeave={() => {
              this.changePlusStatus(false);
            }}
            onMouseEnter={() => {
              this.changePlusStatus(true);
            }}
            onClick={() => this.showAddress.visibleShow(true)}
          >
            <PlusOutlined
              className={plusStatus ? 'select-plus' : ''}
              style={{ color: 'green', opacity: '0.4' }}
            />
          </div>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="创建人" name="creatorName">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="创建日期" name="createDate">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="修改人" name="changerName">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="修改日期" name="changeDate">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="审核人" name="checkName">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="审核日期" name="checkDate">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="完成人" name="finishName">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="完成日期" name="finishDate">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12} style={{ marginTop: '20px' }}>
          <span className="submitButtons">
            <Button onClick={() => this.showLoad.visibleShow(true)}>批量导入序列</Button>
            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
              新增
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </Col>
      </>
      //   </Row>
      // </Form>
    );
  };

  render() {
    return (
      <div className="tableListForm">
        <TableSearchForm
          ref={this.tableSearchFormRef}
          initialValues={this.initialValues}
          getTableData={this.handleSubmit}
          simpleForm={this.simpleForm}
        />
        <CustomerMask
          onRef={ref => {
            this.showCustomer = ref;
          }}
          getData={v => this.getMaskData(v, 'customer')}
        />
        <SubCustomerMask
          onRef={ref => {
            this.showSubCustomer = ref;
          }}
          getData={v => this.getMaskData(v, 'subCustomer')}
        />
        <ContactMask
          onRef={ref => {
            this.showContact = ref;
          }}
          getData={v => this.getMaskData(v, 'contact')}
        />
        <SalerMask
          onRef={ref => {
            this.showSaler = ref;
          }}
          getData={v => this.getMaskData(v, 'saler')}
        />
        <AddressMask
          onRef={ref => {
            this.showAddress = ref;
          }}
        />
        <LoadMask
          onRef={ref => {
            this.showLoad = ref;
          }}
          getData={v => this.loadData(v)}
        />
      </div>
    );
  }
}

class Order extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    formValues: {
      page: 1,
      rows: 10,
    },
    list: [],
    total: 0,
    loading: false,
    visible: false, // 遮罩层的判断
    dataSon: [],
    loadingSon: false,
    id: 0, // 新增数据时，提供负数id
    editIndex: -1,
    purityValue: [],
    modificationType: [],
  };

  componentDidMount() {
    this.props.onRef(this);
    api.peptideBase.getPurity().then(res => {
      this.setState({
        purityValue: res,
      });
    });
    api.peptideBase.getModifications({ modificationPosition: 1, status: 1 }).then(res => {
      this.setState({
        modificationType: res,
      });
    });
  }

  visibleShow = visible => {
    this.setState({ visible });
  };

  handleOk = () => {
    this.handleCancel();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 设置子值
  dataSon = v => {
    this.setState({
      loadingSon: true,
    });
    setTimeout(() => {
      this.setState({
        dataSon: v.stock.storages,
        loadingSon: false,
      });
    }, 500);
  };

  // 分页
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const { formValues } = this.state;
    const query = Object.assign({}, formValues, options);

    this.setState({
      formValues: query,
      loading: true,
    });

    api.peptideBase.getModifications(query, true).then(res => {
      this.setState({
        list: res.rows,
        total: res.total,
        loading: false,
        editIndex: -1,
      });
    });
  };

  // 保存
  saveRow = (val, index) => {
    this.props.form.validateFields((error, row) => {
      // if (error) return;
      const { list } = this.state;
      // const newData = { ...list[index],
      //                   ...row,
      //                   isIndependentModification: row.isIndependentModification ? 1 : 2,
      //                 };
      // if (newData.id > 0) {
      //   // api.peptideBase.updateSeries(newData).then(() => this.getTableData());
      // } else {
      //   api.peptideBase.insertModifications(newData).then(() => this.getTableData());
      // }
      console.log(list[index], error, row);
      // console.log(row)
      // console.log(index)
      this.cancelEdit(val, index);
    });
  };

  // 新增
  handleAdd = data => {
    const { editIndex, id, list } = this.state;
    if (editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }

    const arrData = [];
    let strId = '';
    data.map((item, key) => {
      if (item.length === 1 && item[0] === '') {
        return false;
      }
      arrData.push({
        id: id - key - 1,
        name: item[0],
        providerTotalAmount: item[1],
        isNeedDesalting: item[2] === '是' ? '是' : '否',
        peptidePurityId: item[3],
        sequence: item[4],
        subpackage: item[5],
      });
      strId = `${strId + (id - key - 1)},`;
      return true;
    });
    if (arrData.length === 0) {
      const newId = id - 1;
      this.setState({
        id: newId,
        editIndex: '-1,',
        list: [
          {
            id: newId,
          },
          ...list,
        ],
      });
    } else {
      this.setState({
        id: arrData[0],
        editIndex: strId,
        list: [...arrData, ...list],
      });
    }
  };

  // 删除指定的值
  removeValue = (arr, val) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].toString() === val.toString()) {
        arr.splice(i, 1);
        break;
      }
    }
  };

  // 退出编辑
  cancelEdit = (row, index) => {
    if (row.id > 0) {
      this.setState({ editIndex: -1 });
    } else {
      const { list, editIndex } = this.state;
      let flag = 0;
      const arrEditIndex = editIndex.split(',');
      const deleteIndex = -(index + 1);
      this.removeValue(arrEditIndex, deleteIndex);
      this.setState({
        list: list.filter(e => e.id !== row.id),
        editIndex: arrEditIndex.join(','),
        dataSon: [],
      });
      list.forEach(e => {
        if (e.id < 0) {
          flag++;
        }
      });
      if (flag === 1) {
        this.setState({
          list: list.filter(e => e.id > 0),
          editIndex: -1,
          id: 0,
        });
      }
    }
  };

  // 删除数据
  deleteRow = row => {
    api.peptideBase.deletePurity(row.id).then(() => {
      this.getTableData();
    });
  };

  // 键盘点击回车触发
  keyDownEvent = (e, rowIndex) => {
    if (e.nativeEvent.keyCode === 13) {
      if (
        this.props.form.getFieldValue(`providerTotalAmount${rowIndex}`) &&
        this.props.form.getFieldValue(`peptidePurityId${rowIndex}`)
      ) {
        api.peptideBase
          .getAminoAcid({
            shortCode: this.props.form.getFieldValue(`providerTotalAmount${rowIndex}`),
          })
          .then(data => {
            const map = {};
            const dest = [];
            for (let i = 0; i < data.length; i++) {
              const ai = data[i];
              if (
                ai.shortCode[0] === this.props.form.getFieldValue(`sequence${rowIndex}`) ||
                ai.shortCode[1] === this.props.form.getFieldValue(`sequence${rowIndex}`)
              ) {
                if (!map[ai.id]) {
                  dest.push({
                    id: ai.id,
                    code: ai.code,
                    aminoAcidID: ai.name,
                    hydrophilic: ai.hydrophilic,
                    hydrophobic: ai.hydrophobic,
                    acidic: ai.acidic,
                    alkaline: ai.alkaline,
                    isCanDisulfideBond: ai.isCanDisulfideBond,
                    molecularWeight: ai.molecularWeight,
                    isoelectricPoint: ai.isoelectricPoint,
                    carboxylationDissociationConstant: ai.carboxylationDissociationConstant,
                    aminoDissociationConstant: ai.aminoDissociationConstant,
                    status: ai.status,
                    creatorName: ai.creatorName,
                    createDate: ai.createDate,
                    cancelName: ai.cancelName,
                    cancelDate: ai.cancelDate,
                    aminoAcidType: ai.aminoAcidType,
                    longCode: ai.longCode,
                    shortCode: ai.shortCode,
                  });
                  map[ai.id] = ai;
                } else {
                  for (let j = 0; j < dest.length; j++) {
                    const dj = dest[j];
                    if (dj.id === ai.id) {
                      dj.cancelName =
                        dj.cancelName || ai.cancelName ? [dj.cancelName, ai.cancelName] : '';
                      dj.cancelDate =
                        dj.cancelDate || ai.cancelDate ? [dj.cancelDate, ai.cancelDate] : '';
                      dj.shortCode =
                        dj.shortCode || ai.shortCode ? [dj.shortCode, ai.shortCode] : '';
                      // dj.shortCode = (dj.shortCode ? dj.shortCode : '')
                      // + (ai.shortCode ? ` | ${ai.shortCode}` : '');
                      dj.longCode = dj.longCode || ai.longCode ? [dj.longCode, ai.longCode] : '';
                      // dj.longCode = (dj.longCode ? dj.longCode : '')
                      // + (ai.longCode ? ` | ${ai.longCode}` : '');
                      dj.aminoAcidType =
                        dj.aminoAcidType || ai.aminoAcidType
                          ? [dj.aminoAcidType, ai.aminoAcidType]
                          : '';
                      // dj.aminoAcidType = (dj.aminoAcidType ? dj.aminoAcidType : '')
                      // + (ai.aminoAcidType ? ` | ${ai.aminoAcidType}` : '');
                      break;
                    }
                  }
                }
              }
            }
            this.setState({
              loadingSon: false,
              dataSon: dest,
            });
          });
      }
    }
  };

  /**
   * 选择input
   * @param {string} data 表单的默认数据
   * @param {string} type 表单的类型
   * @param {array} selectList select的默认数据
   * @param {int} widthValue 表单宽度的值
   * @param {int} rowIndex 当前指针位置
   * @param {string} event 事件
   */
  // eslint-disable-next-line consistent-return
  selectType = (data, type, selectList, widthValue, rowIndex, event) => {
    if (type === 'input') {
      if (event === 'onkeydown') {
        return (
          <Input
            style={{ width: `${widthValue}px` }}
            onKeyDown={e => this.keyDownEvent(e, rowIndex)}
          />
        );
      }
      return <Input style={{ width: `${widthValue}px` }} defaultValue={data} />;
    }
    if (type === 'inputReadOnly') {
      return <Input style={{ width: `${widthValue}px` }} defaultValue={data} readOnly />;
    }
    if (type === 'select') {
      return (
        <Select
          style={{ width: `${widthValue}px` }}
          defaultValue={data === '是' || data === '否' ? data : ''}
        >
          {selectList.map(item => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      );
    }
  };

  // 格式化数据
  formatterData = (arr, id = 'id', name = 'name') => {
    const val = [];
    // eslint-disable-next-line array-callback-return
    arr.map(item => {
      val.push({ id: item[id], name: item[name] });
    });
    return val;
  };

  render() {
    const {
      formValues: { page: current, rows: pageSize },
      list,
      total,
      loading,
      visible,
      dataSon,
      loadingSon,
      editIndex,
      purityValue,
      modificationType,
    } = this.state;
    const data = { list, pagination: { current, pageSize, total } };
    let tableWidth = 0;
    let tableWidthSon = 0;
    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: '多肽名称',
        dataIndex: 'name',
        width: 100,
        editable: true,
        inputType: 'input',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '提供总量(mg)',
        dataIndex: 'providerTotalAmount',
        width: 150,
        editable: true,
        inputType: 'input',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '是否脱盐',
        dataIndex: 'isNeedDesalting',
        width: 100,
        editable: true,
        inputType: 'select',
        selectList: [
          { id: 1, name: '是' },
          { id: 2, name: '否' },
        ],
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '纯度',
        dataIndex: 'peptidePurityId',
        width: 100,
        editable: true,
        inputType: 'select',
        selectList: this.formatterData(purityValue, 'id', 'purity'),
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '序列',
        dataIndex: 'sequence',
        width: 150,
        editable: true,
        inputType: 'input',
        event: 'onkeydown',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基酸数',
        dataIndex: 'aminoAcidCount',
        width: 100,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基酸金额',
        dataIndex: 'aminoAcidAmount',
        width: 120,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基端修饰',
        dataIndex: 'aminoModificationName',
        width: 200,
        editable: true,
        inputType: 'select',
        selectList: this.formatterData(modificationType),
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基端修饰金额',
        dataIndex: 'aminoModificationPrice',
        width: 150,
        editable: true,
        inputType: 'input',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基端修饰SAP产品编号',
        dataIndex: 'aminoSapProductCode',
        width: 200,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '氨基端修饰SAP产品名称',
        dataIndex: 'aminoSapProductName',
        width: 200,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '羧基端修饰',
        dataIndex: 'carboxyModificationName',
        width: 120,
        editable: true,
        inputType: 'select',
        selectList: [],
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '羧基端修饰金额',
        dataIndex: 'carboxyModificationPrice',
        width: 170,
        editable: true,
        inputType: 'input',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '羧基端修饰SAP产品编号',
        dataIndex: 'carboxySapProductCode',
        width: 200,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '羧基端修饰SAP产品名称',
        dataIndex: 'carboxySapProductName',
        width: 200,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '中间修饰',
        dataIndex: 'middleModification',
        width: 100,
        editable: true,
        inputType: 'select',
        selectList: [],
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '中间修饰数量',
        dataIndex: 'middleModificationDetailCount',
        width: 150,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '中间修饰金额',
        dataIndex: 'middleModificationDetailAmount',
        width: 150,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '二硫键',
        dataIndex: 'disulfideBond',
        width: 100,
        editable: true,
        inputType: 'select',
        selectList: [],
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '二硫键数量',
        dataIndex: 'disulfideBondDetailCount',
        width: 120,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '二硫键金额',
        dataIndex: 'disulfideBondDetailAmount',
        width: 120,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '分装管数',
        dataIndex: 'subpackage',
        width: 100,
        editable: true,
        inputType: 'input',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '金额',
        dataIndex: 'totalAmount',
        width: 100,
        editable: true,
        inputType: 'inputReadOnly',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '备注',
        dataIndex: 'notes',
        width: 100,
        editable: true,
        inputType: 'input',
        rules: [{ required: true, message: '必填' }],
      },
      {
        title: '操作',
        fixed: 'right',
        className: 'operate',
        width: 150,
        render: (value, row, index) => {
          let actions;
          if (editIndex.toString().indexOf(row.id) !== -1) {
            actions = (
              <>
                <a className="addNewData" onClick={() => this.saveRow(row, index)}>
                  保存
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.cancelEdit(row, index)}>退出</a>
              </>
            );
          }
          return actions;
        },
      },
    ];

    let columnSon = [
      {
        title: '氨基酸',
        dataIndex: 'aminoAcidID',
        width: 100,
      },
      {
        title: '类型',
        dataIndex: 'aminoAcidType',
        width: 80,
      },
      {
        title: '长代码',
        dataIndex: 'longCode',
        width: 100,
      },
      {
        title: '短代码',
        dataIndex: 'shortCode',
        width: 80,
      },
      {
        title: '单价',
        dataIndex: 'price',
        width: 80,
      },
      {
        title: 'SAP产品编号',
        dataIndex: 'sapProductCode',
        width: 130,
      },
      {
        title: 'SAP产品名称',
        dataIndex: 'sapProductName',
        width: 130,
      },
    ];

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    // const rowNum = editIndex.substr(0, editIndex.length - 1).split(',')
    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      const editId =
        editIndex === -1 || editIndex === 0 ? editIndex : editIndex.split(',').length - 2;
      return {
        ...col,
        onCell: (record, rowIndex) => ({
          record,
          rules: col.rules,
          inputType: this.selectType(
            list[rowIndex][col.dataIndex],
            col.inputType,
            col.selectList,
            col.width ? col.width - 10 : 90,
            rowIndex,
            col.event,
          ),
          dataIndex: col.dataIndex + rowIndex,
          title: col.title,
          value: list[rowIndex][col.dataIndex],
          // editing: editId.toString().indexOf((-(rowIndex + 1)).toString()) !== -1,
          editing: rowIndex <= editId || rowIndex === editIndex,
        }),
      };
    });

    columnSon = columnSon.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidthSon += col.width;
      return col;
    });
    return (
      <Modal
        width="100%"
        title="多肽合成订单编辑页面"
        style={{ top: '0', padding: '0', border: 'none' }}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        keyboard={false}
        className="orderMask"
      >
        <div>
          <AddPage
            openAddressMask={this.openAddressMask}
            handleAdd={this.handleAdd}
            peptide={this.props.peptide}
            language={this.props.language}
          />
          <Row>
            <Col span={14}>
              <Form ref={this.tableFormRef}>
                <Table
                  dataSource={data.list}
                  columns={columns}
                  scroll={{ x: tableWidth, y: 300 }}
                  pagination={data.pagination}
                  rowKey="id"
                  loading={loading}
                  onChange={this.handleStandardTableChange}
                  components={components}
                  rowClassName="editable-row"
                />
              </Form>
            </Col>
            <Col span={1} />
            <Col span={9}>
              <Table
                dataSource={dataSon}
                columns={columnSon}
                scroll={{ x: tableWidthSon, y: 300 }}
                loading={loadingSon}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default connect(({ peptide, global }) => ({
  peptide,
  language: global.languageCode,
}))(Order);
