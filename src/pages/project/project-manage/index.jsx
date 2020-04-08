// 项目列表
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  // Divider,
  Form,
  Select,
  Popconfirm,
  Col,
  AutoComplete,
  Badge,
  Input,
  // Progress,
  // Tag,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import _ from 'lodash';
import router from 'umi/router';
import StandardTable from '../components/StandardTable';
import { formatter } from '@/utils/utils';
import api from '@/pages/project/project-manage/api/projectManageModel/';
import {
  // InputUI,
  // SelectUI,
  DateUI,
} from '../components/AntdSearchUI';

const { Option } = Select;
const FormItem = Form.Item;

class ProjectManagement extends Component {
  tableSearchFormRef = React.createRef();
  // tableFormRef = React.createRef();

  // state = {
  //   pagination: {},
  //   loading: false,
  //   list: [],
  // };

  // 顶部表单默认值
  initialValues = {
    // status: 1,
    page: 1,
    pageSize: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      loading: false,
      // visible: false,
      // detailValue: {},
      list: [],
      nameCodeVal: [],
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  callParter = name => {
    api.gettProjectManageCodeAndName({ codeOrName: name }).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    // console.log(formData);
    const { pagination } = this.state;
    const { current: page, pageSize } = pagination;

    let newData = [];
    if (formData.statusList) {
      newData = { ...newData, statusList: formData.statusList.join(',') };
      delete formData.statusList;
    }

    // 创建时间
    if (formData.createDate) {
      newData = {
        ...newData,
        beginDate: formData.createDate[0].format('YYYY-MM-DD'),
        endDate: formData.createDate[1].format('YYYY-MM-DD'),
      };
      delete formData.createDate;
    }

    const data = {
      page,
      pageSize,
      ...newData,
      ...formData,
      ...options,
    };
    api.getProjectManage(data, true).then(res => {
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
    // console.log(list);
  };

  // 项目名称联想
  renderOption = codeOrName => ({
    value: codeOrName.name,
    label: (
      <div style={{ display: 'flex' }}>
        <span>{codeOrName.name}</span>&nbsp;&nbsp;
        <span>{codeOrName.code}</span>
      </div>
      // </Option>
    ),
  });

  // 筛选值
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
      pageSize: page.pageSize,
      ...filterData,
    });
  };

  simpleForm = () => {
    const { languageCode, statusList } = this.props;
    const { nameCodeVal } = this.state;
    // console.log(this.props);
    return (
      <>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="项目" name="name">
            <AutoComplete
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
              placeholder="请输入项目名称"
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="状态" name="statusList">
            <Select
              mode="multiple"
              maxTagCount={2}
              maxTagTextLength={3}
              style={{ width: '200px' }}
              allowClear
              placeholder="请选择状态"
            >
              {statusList.map(e => (
                <Option value={e.value} key={e.value}>
                  {e.text}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 8}>
          <FormItem label="创建人" name="creatorName">
            <Input placeholder="请输入创建人" />
          </FormItem>
        </Col>
      </>
    );
  };

  // 完整查询条件
  advancedForm = () => {
    const { languageCode } = this.state;
    return (
      <DateUI
        languageCode={languageCode}
        label="创建时间"
        name="createDate"
        placeholder={['开始时间', '结束时间']}
      />
    );
  };

  // 新增
  handleAdd = () => {
    // console.log(123);
    router.push('/project/project-manage/add');
  };

  // 项目管理详情页面
  searchDetails = row => {
    const projectId = row.id;
    router.push('/project/project-manage/detail', { projectId });
  };

  // 删除数据
  deleteRow = row => {
    api.deleteProjectManage(row.id).then(() => {
      this.getTableData();
    });
    // console.log(row);
  };

  render() {
    const { pagination, list, loading } = this.state;
    const { statusList } = this.props;
    let tableWidth = 0;

    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: '200px',
        render: (value, row) => (
          <>
            <div>{row.name}</div>
            <div>
              <a onClick={() => this.searchDetails(row)}>{value}</a>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: '200px',
      },
      {
        title: '创建人/时间',
        dataIndex: 'creatorName',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.creatorTime}
          </>
        ),
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
        width: '100px',
        filters: statusList,
        render: value => (
          <Badge
            status={formatter(statusList, value, 'value', 'status')}
            text={formatter(statusList, value, 'value', 'text')}
          />
        ),
      },
      {
        title: '标签',
        dataIndex: 'label',
        // render: value => (
        //   <>
        //     {value.map(item => (
        //       <Tag key={item} color={item}>
        //         {item}
        //       </Tag>
        //     ))}
        //   </>
        // ),
      },
      {
        title: '成员数',
        dataIndex: 'memberCount',
      },
      {
        title: '开始-截止时间',
        dataIndex: 'beginDate',
        width: '200px',
        render: (value, row) => (
          <>
            {value}
            <br />
            {row.endDate}
          </>
        ),
      },
      {
        fixed: 'right',
        title: '操作',
        // render: () => (
        //   <>
        //     {/* <a onClick={() => console.log(111)}>修改</a>
        //     <Divider type="vertical" /> */}
        //     <a onClick={() => this.deleteRow(results)}>删除</a>
        //     <Divider type="vertical" />
        //     {/* <a onClick={() => console.log(333)}>开始</a> */}
        //   </>
        // ),
        render: (value, row, index) => {
          const { editIndex } = this.state;
          let actions;
          if (editIndex !== index) {
            if (row.status === 1) {
              actions = (
                <Popconfirm title="确定删除数据？" onConfirm={() => this.deleteRow(row)}>
                  <a>删除</a>
                </Popconfirm>
              );
            } else {
              actions = (
                <Popconfirm title="确定恢复数据？" onConfirm={() => this.resumeRow(row)}>
                  <a>恢复</a>
                </Popconfirm>
              );
            }
          }
          return actions;
        },
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
              <Button type="primary" onClick={() => this.handleAdd()}>
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
              />
            </Form>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, projectManage }) => ({
  languageCode: global.languageCode,
  projectManage,
  statusList: projectManage.statusList,
}))(ProjectManagement);
