// 流程模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Form, Col, AutoComplete, Select } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import _ from 'lodash';
import api from '@/pages/sample/api/sample';
import StandardTable from '@/pages/project/components/StandardTable';
import UploadSequenceFile from '../UploadSequenceFile';
import SampleDetail from '../sample-detail';
import './index.less';

const FormItem = Form.Item;
const { Option } = Select;
class ProcessModel extends Component {
  tableSearchFormRef = React.createRef();

  // 顶部表单默认值
  initialValues = {
    page: 1,
    rows: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      loading: false,
      visible: false,
      detailValue: {},
      nameCodeVal: [],
      filtersData: null,
      sampleCode: '',
      detailVisible: false,
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  callParter = value => {
    api.getSampleCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination, sampleCode } = this.state;
    const { current: page, pageSize: rows } = pagination;
    let newData = [];
    let changePage = false;

    if (formData.name) {
      changePage = true;
      newData = { ...newData, sampleCode };
      delete formData.name;
    }

    const newPage = changePage ? { page: 1 } : page;
    const data = {
      ...newPage,
      rows,
      ...newData,
      ...formData,
      ...options,
    };

    api.getSample(data).then(res => {
      this.setState({
        list: res.rows,
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
      });
    });
  };

  // 流程模型筛选值
  inputValue = value => {
    const { nameCodeVal } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callParter(value);
    if (nameCodeVal.length === 0) {
      return false;
    }

    nameCodeVal.forEach(item => {
      if (item.sampleName.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.sampleCode.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeVal: arr,
      // allowClear: 'ture',
    });
    return true;
  };

  // 分页
  handleStandardTableChange = (pagination, filters) => {
    const { filtersData } = this.state;
    let filterData = {};
    const page = pagination;
    if (filters) {
      if (filters.status && filters.status[0]) {
        filterData.status = filters.status.join(',');
      }
      this.setState({
        filtersData: filterData,
      });
      page.current = 1;
      page.pageSize = 10;
    } else if (filtersData) {
      filterData = filtersData;
    }

    this.getTableData({
      page: page.current,
      rows: page.pageSize,
      ...filterData,
    });
  };

  simpleForm = () => {
    const { languageCode } = this.props;
    const { nameCodeVal } = this.state;
    const children = nameCodeVal.map(item => (
      <Option key={item.sampleCode} value={item.sampleName}>
        <div
          onClick={() => {
            this.setState({
              sampleCode: item.sampleCode,
            });
          }}
        >
          {item.sampleCode} {item.sampleName}
        </div>
      </Option>
    ));
    return (
      <>
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 12}>
          <FormItem label="样品" name="name" style={{ marginTop: '8px' }}>
            <AutoComplete
              onSearch={this.inputValue}
              spellCheck="false"
              onKeyDown={() => {
                this.setState({
                  sampleCode: '',
                });
              }}
            >
              {children}
            </AutoComplete>
          </FormItem>
        </Col>
        <Col span={16} style={{ textAlign: 'right', marginTop: '8px' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => {
              this.tableSearchFormRef.current.resetFields();
            }}
          >
            重置
          </Button>
        </Col>
      </>
    );
  };

  // 打开上传序列文件弹框
  handleModalVisible = () => {
    this.setState({
      visible: true,
    });
  };

  handleClose = v => {
    this.setState({
      visible: false,
    });
    if (v) {
      this.getTableData();
    }
  };

  handleDetailClose = () => {
    this.setState({
      detailVisible: false,
    });
  };

  // 删除
  handleDelete = value => {
    api.deleteProcess(value.id).then(() => {
      this.getTableData();
    });
  };

  // 查看详情
  searchDetails = value => {
    this.setState({
      detailVisible: true,
      detailValue: value,
    });
  };

  render() {
    const { pagination, loading, list, visible, detailVisible, detailValue } = this.state;
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'sampleCode',
        width: 300,
        render: (value, row) => (
          <>
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{value}</div>
              <div style={{ color: '#B9B9B9' }}>{row.sampleName}</div>
            </div>
          </>
        ),
      },
      {
        title: '创建人/时间',
        dataIndex: 'creatorName',
        width: 400,
        render: (value, row) => (
          <>
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{value}</div>
              <div>{new Date(row.createDate).toLocaleDateString()}</div>
            </div>
          </>
        ),
      },
      {
        title: '样品识别号',
        dataIndex: 'sampleIdentificationCode',
        width: 200,
      },
      {
        title: '序列',
        dataIndex: 'sampleSequenceCount',
        width: 140,
        render: (value, row) => `${value} (${row.sampleLengthTotal}bp)`,
      },
      {
        title: '长度',
        dataIndex: 'sampleLengthMin',
        render: (value, row) => `${value}-${row.sampleLengthMax} (${row.sampleLengthAve})`,
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (value, row) => (
          <a
            onClick={() => {
              this.searchDetails(row);
            }}
          >
            序列文件
          </a>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <div className="tableList classSampleManage">
          <Card bordered={false}>
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
              noButton
            />
          </Card>
          <Card bordered={false} style={{ marginTop: '24px' }}>
            <div className="tableListOperator">
              <Button
                type="primary"
                onClick={() => this.handleModalVisible()}
                style={{ marginLeft: '8px' }}
              >
                <UploadOutlined />
                上传序列文件
              </Button>
            </div>
            <Form ref={this.tableFormRef} className="table-style-set classSampleList">
              <StandardTable
                // scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Form>
          </Card>
        </div>
        {visible ? <UploadSequenceFile visible={visible} handleClose={this.handleClose} /> : ''}
        {detailVisible ? (
          <SampleDetail
            visible={detailVisible}
            detailValue={detailValue}
            handleClose={v => this.handleDetailClose(v)}
          />
        ) : (
          ''
        )}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, sample }) => ({
  languageCode: global.languageCode,
  status: sample.status,
}))(ProcessModel);
