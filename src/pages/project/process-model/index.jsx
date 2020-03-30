// 流程模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Form, Progress, Col, AutoComplete } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import _ from 'lodash';
import StandardTable from '../components/StandardTable';
// import api from '@/api';
import { InputUI, SelectUI, DateUI } from '../components/AntdSearchUI';
// import { DrawerTool } from '../components/AntdUI';

const FormItem = Form.Item;
class ProcessModel extends Component {
  tableSearchFormRef = React.createRef();

  // 顶部表单默认值
  initialValues = {
    status: 1,
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
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  callParter = value => {
    // api.bp.getBPByCodeOrName({ code_or_name: value }).then(res => {
    //   this.setState({ nameCodeVal: res });
    // });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    // this.setState({ loading: true });
    // const formData = this.tableSearchFormRef.current.getFieldsValue();
    // const { pagination } = this.state;
    // const { current: page, pageSize: rows } = pagination;
    // const data = {
    //   page,
    //   rows,
    //   ...formData,
    //   ...options,
    // };
    // api.peptideBase.getPurity(data, true).then(res => {
    //   this.setState({
    //     list: res.rows,
    //     pagination: {
    //       current: data.page,
    //       pageSize: data.rows,
    //       total: res.total,
    //     },
    //     loading: false,
    //     editIndex: -1,
    //   });
    // });
    const data = this.props.processModel.processModelData;
    this.setState({
      list: data,
      pagination: {
        current: options.page,
        pageSize: options.rows,
        total: data.total,
      },
      loading: false,
    });
    // console.log(this.props.project.projectManage);
  };

  renderOption = item => ({
    value: item.id,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>
          <UserOutlined />
        </span>
        &nbsp;&nbsp;
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
      // </Option>
    ),
  });

  // 筛选值
  inputValue = value => {
    const arr = [];
    if (!value) {
      return false;
    }
    this.callParter(value);
    this.state.nameCodeVal.forEach(item => {
      if (item.name.indexOf(value) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item)) {
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
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  simpleForm = () => {
    const { languageCode } = this.props;
    const { nameCodeVal } = this.state;
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="编号/名称" name="code">
            <AutoComplete
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
        <InputUI
          languageCode={languageCode}
          label="发布人"
          name="publishName"
          placeholder="发布人"
        />
        <DateUI
          languageCode={languageCode}
          label="发布时间"
          name="publishDate"
          placeholder={['开始时间', '结束时间']}
        />
        <SelectUI
          languageCode={languageCode}
          label="状态"
          name="status"
          data={[
            { value: 1, data: '状态一', key: '1' },
            { value: 2, data: '状态二', key: '2' },
            { value: 3, data: '状态三', key: '3' },
          ]}
        />
      </>
    );
  };

  // 新增
  handleAdd = () => {
    console.log('新增');
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleModalVisible = () => {
    router.push('/project/process-model/add');
  };

  // 查看详情
  searchDetails = value => {
    this.setState({
      visible: true,
      detailValue: value,
    });
  };

  render() {
    const { pagination, list, loading, visible, detailValue } = this.state;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        render: (value, row) => (
          <>
            <span>{row.name}</span>
            <br />
            {value}
          </>
        ),
      },
      {
        title: '发布人',
        dataIndex: 'publishName',
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
      },
      {
        title: '版本',
        dataIndex: 'version',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },

      {
        title: '修改人/时间',
        dataIndex: 'changerName',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.changerTime}
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '80px',
        render: value => <Progress percent={value} size="small" />,
      },
      {
        title: '操作',
        width: 200,
        render: value => (
          <>
            <a onClick={() => console.log(111)}>禁用</a>
            <Divider type="vertical" />
            <a onClick={() => console.log(222)}>升级</a>
            <Divider type="vertical" />
            <a onClick={() => this.searchDetails(value)}>查看</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
            />
            <div className="tableListOperator">
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                <PlusOutlined />
                新建
              </Button>
            </div>
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                selectedRows=""
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                // expandable={{
                //   // 用方法创建子table
                //   expandedRowRender: value => expandedRowRender(value.list, sonTablecolumns),
                //   rowExpandable: record => !!record.list,
                // }}
              />
            </Form>
            {/* <DrawerTool visible={visible} onClose={this.onClose} detailValue={detailValue} /> */}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, processModel }) => ({
  languageCode: global.languageCode,
  processModel,
}))(ProcessModel);
