/**
 * 元数据分析
 */
import { Card, Col, Form, Input, Badge, Select, DatePicker, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/pages/hts/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import api from '@/pages/hts/api';
import { formatter } from '@/utils/utils';
import router from 'umi/router';
import EnvironmentalFactorsModel from
  '@/pages/project/components/ModelComponents/EnvironmentalFactorsModel';
import CheckBoxModel from '@/pages/project/components/ModelComponents/CheckBoxModel';
import { ParamDrawer } from './components/ModelUI';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Metadata extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    pagination: {}, // 分页参数
    list: [], // 表格数据
    loading: true, // 加载状态
    selectedRows: [], // 选中行数据
    visibleParam: false, // 显示参数抽屉
    originalParam: [], // 原始参数列表
  };

  // 顶部表单默认值
  initialValues = {
    page: 1,
    pageSize: 10,
  };

  // 组件挂载时
  componentDidMount() {
    this.getCacheData();
    this.getTableData(this.initialValues);
  }

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="编号" name="code">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="项目编号" name="projectCode">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="任务编号" name="taskCode">
          <Input />
        </FormItem>
      </Col>
    </>
  );

  // 顶部表单复杂搜索
  advancedForm = () => {
    const { status } = this.props.htsCache;
    return (
      <>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="操作人" name="userCode">
            <Input />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="开始时间" name="beginDate">
            <RangePicker format="YYYY-MM-DD" />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="结束时间" name="endDate">
            <RangePicker format="YYYY-MM-DD" />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="状态" name="statusList">
            <Select mode="multiple" style={{ width: '100%' }}>
              {status.map(e => (
                <Option value={e.id} key={e.id}>
                  {e.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 分页
  handleStandardTableChange = data => {
    console.log(data);
    this.getTableData({
      page: data.current,
      pageSize: data.pageSize,
    });
  };

  // 选择行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });

    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize } = pagination;

    let newData = [];

    // 状态
    if (formData.statusList) {
      newData = { ...newData, statusList: formData.statusList.join(',') };
      console.log(newData);
      delete formData.statusList;
    }

    // 开始时间
    if (formData.beginDate) {
      newData = {
        ...newData,
        beginDateBefore: formData.beginDate[0].format('YYYY-MM-DD'),
        beginDateAfter: formData.beginDate[1].format('YYYY-MM-DD'),
      };
      delete formData.beginDate;
    }

    // 结束时间
    if (formData.endDate) {
      newData = {
        ...newData,
        endDateBefore: formData.endDate[0].format('YYYY-MM-DD'),
        endDateAfter: formData.endDate[1].format('YYYY-MM-DD'),
      };
      delete formData.endDate;
    }

    const data = {
      page,
      pageSize,
      ...newData,
      ...formData,
      ...options,
    };

    api.metadata.getMetadatas(data).then(res => {
      this.setState({
        list: res.results,
        pagination: {
          current: data.page,
          pageSize: data.pageSize,
          total: res.total,
        },
        loading: false,
      });
    });
  };

  // 查看参数列表页
  searchParamList = data => {
    this.props.dispatch({
      type: 'htsCache/setMetadataRow',
      payload: data,
    });
    return router.push('/hts/analyze/metadata/paramList');
  };

  // 查看参数 抽屉
  searchParamDrawer = data => {
    api.metadata.getMetadataOriginalParam(data.id).then(res => {
      if (res && res.length > 0) {
        this.setState({
          visibleParam: true,
          originalParam: res,
        });
        return false;
      }
      return message.warning('暂无参数！');
    });
  };

  // 关闭参数抽屉
  onCloseParamDrawer = () => {
    this.setState({ visibleParam: false });
  };

  render() {
    const { pagination, selectedRows, list, loading, visibleParam, originalParam } = this.state;
    const { status } = this.props.htsCache;
    let tableWidth = 0;

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
        render: (value, row) => <a onClick={() => this.searchParamList(row)}>{value}</a>,
      },
      {
        title: '项目编号',
        dataIndex: 'projectCode',
        key: 'projectCode',
      },
      {
        title: '任务编号',
        dataIndex: 'taskCode',
        key: 'taskCode',
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '开始/结束时间',
        dataIndex: 'beginDate',
        key: 'beginDate',
        render: (text, row) => (
          <>
            {row.beginDate}
            <br />
            {row.endTime}
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (value, row) => {
          const name = formatter(status, value);
          const sta = formatter(status, value, 'id', 'status');
          return <Badge status={sta} text={name} key={row.id} />;
        },
      },
      {
        fixed: 'right',
        title: '操作',
        width: 130,
        render: (value, row) => <a onClick={() => this.searchParamDrawer(row)}>参数</a>,
      },
    ];

    columns = columns.map(col => {
      const colWidth = col.width || 100;
      tableWidth += colWidth;
      return {
        ...col,
        width: colWidth,
      };
    });

    return (
      <PageHeaderWrapper>
        <div className="tableList">
          <Card bordered={false}>
            <TableSearchForm
              ref={this.tableSearchFormRef}
              initialValues={this.initialValues}
              getTableData={this.getTableData}
              simpleForm={this.simpleForm}
              advancedForm={this.advancedForm}
              rowKey="id"
            />
          </Card>
          <Card style={{ marginTop: '24px' }}>
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                rowKey="id"
                selectedRows={selectedRows}
                components={components}
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                style={{ marginTop: 40, marginLeft: 24 }}
              />
            </Form>
          </Card>
        </div>
        <ParamDrawer
          visible={visibleParam}
          onClose={this.onCloseParamDrawer}
          data={originalParam}
        />
        <EnvironmentalFactorsModel data={123} />
        <CheckBoxModel />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ htsCache }) => ({
  htsCache,
}))(Metadata);
