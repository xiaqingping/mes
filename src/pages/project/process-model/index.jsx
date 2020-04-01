// 流程模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Form, Col, AutoComplete, Avatar, Tag, Badge } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import _ from 'lodash';
import { InputUI, SelectUI, DateUI } from '@/pages/project/components/AntdSearchUI';
import { formatter } from '@/utils/utils';
import api from '@/pages/project/api/processModel/';
import StandardTable from '../components/StandardTable';
import { DrawerTool } from '../components/AntdUI';

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
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };
    api.getProcess(data).then(res => {
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
  handleStandardTableChange = (pagination, filters) => {
    // 获取搜索值
    console.log(filters);
    // this.getTableData({
    //   page: pagination.current,
    //   rows: pagination.pageSize,
    // });
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
      </>
    );
  };

  /** 完整筛选条件 */
  advancedForm = () => {
    const { languageCode } = this.state;
    return (
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

  // 新建
  handleModalVisible = () => {
    router.push('/project/process-model/add');
  };

  // 升级
  upgrade = value => {
    router.push(`/project/process-model/edit/${value.id}`);
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
    const { status } = this.props;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        render: (value, row) => (
          <>
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              style={{ float: 'left' }}
              size="large"
            />
            <div style={{ float: 'left' }}>
              <div>{value}</div>
              <div>{row.name}</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '发布人/时间',
        dataIndex: 'publishName',
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.publishDate}</div>
          </>
        ),
      },
      {
        title: '版本',
        dataIndex: 'version',
        render: () => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            V1.0
          </Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: status,
        render: value => (
          <Badge
            status={formatter(status, value, 'value', 'status')}
            text={formatter(status, value, 'value', 'text')}
          />
        ),
      },
      {
        title: '操作',
        width: 200,
        render: value => (
          <>
            <a onClick={() => console.log(111)}>禁用</a>
            <Divider type="vertical" />
            <a onClick={() => this.upgrade(value)}>升级</a>
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
              advancedForm={this.advancedForm}
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
            <DrawerTool
              visible={visible}
              onClose={this.onClose}
              detailValue={detailValue}
              status={status}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, processModel, project }) => ({
  languageCode: global.languageCode,
  processModel,
  status: project.status,
}))(ProcessModel);
