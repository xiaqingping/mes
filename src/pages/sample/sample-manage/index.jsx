/** 样品table页面 */
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
class SampleModel extends Component {
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
    this.callSample = _.debounce(this.callSample, 500);
  }

  /** 加载table */
  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  /**
   * 搜索样品
   * @param {string} value 搜索的值
   */
  callSample = value => {
    api.getSampleCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  /**
   *  获取表格数据
   *  @param {object} options 需要搜索的值(如page,rows)
   */
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

  /**
   *  样品筛选值
   *  @param {string} value input搜索的值
   */
  inputValue = value => {
    const { nameCodeVal } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callSample(value);
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

  /**
   *  分页
   *  @param {object} pagination 分页的对象
   *  @param {object} filters 检索的对象
   */
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

  /** 单行筛选条件 */
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

  /** 打开上传序列文件弹框 */
  handleModalVisible = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 子页面关闭
   * @param {string} status 传入的状态
   */
  handleClose = status => {
    this.setState({
      visible: false,
    });
    if (status) {
      this.getTableData();
    }
  };

  /** 关闭详情 */
  handleDetailClose = () => {
    this.setState({
      detailVisible: false,
    });
  };

  /**
   * 删除
   * @param {string} value 传入的id对象
   */
  handleDelete = value => {
    api.deleteProcess(value.id).then(() => {
      this.getTableData();
    });
  };

  /**
   * 查看详情
   * @param {object} value 传入的详情数据
   * */
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
            <div style={{ float: 'left' }}>
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
            <div style={{ float: 'left' }}>
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
        width: 200,
        render: (value, row) => `${value} (${row.sampleLengthTotal}bp)`,
      },
      {
        title: '长度',
        dataIndex: 'sampleLengthMin',
        width: 300,
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
                style={{
                  margin: '5px 0 20px 8px',
                  fontSize: '14px',
                  color: '#ffffff',
                }}
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
}))(SampleModel);
