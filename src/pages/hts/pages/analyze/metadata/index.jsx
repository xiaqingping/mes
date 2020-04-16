/**
 * 元数据分析
 */
import { Card, Col, Divider, Form, Input, Badge, Select, DatePicker, message   } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/pages/hts/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import api from '@/pages/hts/api';
import { formatter } from '@/utils/utils';
import router from 'umi/router';
import { ParamDrawer } from './components/ModelUI';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class Metadata extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {},
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    // 选中行数据
    selectedRows: [],
    visibleParam: false,  // 显示参数抽屉
    // selectedId: [],       // 选中的状态数组
    originalParam: [],    // 原始参数列表
  };

  // 顶部表单默认值
  initialValues = {
    // status: 1,
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
          <FormItem label="开始时间" name="startTime">
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.onChangeStartTime}
            />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="结束时间" name="endTime">
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.onChangeEndTime}
            />
          </FormItem>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <FormItem label="状态" name="status">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              onChange={this.handleChange}
            >
              {status.map(e => (
                <Option value={e.id} key={e.id}>
                  {e.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    )
  }

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 分页
  handleStandardTableChange = data => {
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
    const data = {
      page,
      pageSize,
      ...formData,
      ...options,
    };

    api.metadata.getMetadatas(data).then(res => {
      this.setState({
        list: res.results,
        pagination: {
          current: options.page,
          pageSize: options.pageSize,
          total: res.total,
        },
        loading: false,
      });
    })
  };

  // 保存和修改之后的保存
  saveRow = async index => {
    const { storages } = this.props;
    try {
      const row = await this.tableFormRef.current.validateFields();
      const storageName = storages.filter(e => e.code === row.storageCode)[0].name;
      const { list } = this.state;
      const newData = { ...list[index], ...row, storageName };
      if (newData.id < 0) {
        api.seqfactory.addSeqfactory(newData).then(() => this.getTableData());
      } else {
        api.seqfactory.updateSeqfactory(newData).then(() => this.getTableData());
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 开始时间 查询条件
  onChangeStartTime = (value, dateString) => {
    const beginDateBefore = dateString[0];
    const beginDateAfter = dateString[1];
    this.initialValues.beginDateBefore = beginDateBefore;
    this.initialValues.beginDateAfter = beginDateAfter;
    console.log(this.initialValues);
  }

  // 结束时间 查询条件
  onChangeEndTime = (value, dateString) => {
    const endDateBefore = dateString[0];
    const endDateAfter = dateString[1];
    this.initialValues.beginDateBefore = endDateBefore;
    this.initialValues.beginDateAfter = endDateAfter;
    console.log(this.initialValues);
  }

  // 选中状态 查询条件
  handleChange = value => {
    console.log(value);
    // this.setState({ selectedId: value })
  }

  // 查看参数列表页
  searchParamList = () => {
    console.log(123)
    router.push('/hts/analyze/metadata/paramList');
  }

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
      return message.warning('暂无参数！')
    })
  }

  // 关闭参数抽屉
  onCloseParamDrawer = () => {
    this.setState({ visibleParam: false });
  }


  render() {
    const {
      pagination,
      selectedRows,
      list,
      loading,
      visibleParam,
      // selectedId,
      originalParam
    } = this.state;
    const { status } = this.props.htsCache;
    let tableWidth = 0;
    // console.log(selectedId);

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        render: value => ( <a onClick={() => this.searchParamList()}>{value}</a> )
      },
      {
        title: '项目编号',
        dataIndex: 'projectCode',
      },
      {
        title: '任务编号',
        dataIndex: 'taskCode',
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
      },
      {
        title: '开始/结束时间',
        dataIndex: 'beginDate',
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
        render: value => {
          const name = formatter(status, value);
          const sta = formatter(status, value, 'id', 'status');
          return <Badge status={sta} text={name} />;
        },
      },
      {
        fixed: 'right',
        title: '操作',
        width: 130,
        render: (value, row) => <a onClick={() => this.searchParamDrawer(row)}>参数</a>
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
            />
          </Card>
          <Card style={{ marginTop: '24px' }}>
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
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
        <ParamDrawer visible={visibleParam} onClose={this.onCloseParamDrawer} data={originalParam}/>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ htsCache }) => ({
  htsCache,
}))(Metadata);
