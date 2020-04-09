// 流程模型
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Divider,
  Form,
  Col,
  AutoComplete,
  Avatar,
  Tag,
  Badge,
  Select,
  Dropdown,
  Menu,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { PlusOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import _ from 'lodash';
import { DateUI } from '@/pages/project/components/AntdSearchUI';
import { formatter, getOperates } from '@/utils/utils';
import api from '@/pages/project/api/processModel/';
import disk from '@/pages/project/api/disk';
import StandardTable from '../components/StandardTable';
import ProcessDetail from './process-model-detail';
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
      nameCodeValPublish: [],
      filtersData: null,
      // processList: [],
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
    this.callPublish = _.debounce(this.callPublish, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  callParter = value => {
    api.getProcessCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  callPublish = value => {
    api.getProcessPublisherCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current.getFieldsValue();
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;

    let newData = [];
    if (formData.status) {
      newData = { ...newData, status: formData.status.join(',') };
      delete formData.status;
    }

    if (formData.publishDate) {
      newData = {
        ...newData,
        publishBeginDate: formData.publishDate[0].format('YYYY-MM-DD'),
        publicEndDate: formData.publishDate[1].format('YYYY-MM-DD'),
      };
      delete formData.publishDate;
    }
    const data = {
      page,
      rows,
      ...newData,
      ...formData,
      ...options,
    };

    api.getProcess(data).then(res => {
      const uuids = res.rows.map(e => e.picture);
      disk
        .getFiles({
          sourceCode: uuids.join(','),
          sourceKey: 'project_process_model',
        })
        .then(v => {
          if (v) {
            const newList = res.rows.map(e => {
              const filterItem = v.filter(item => item.sourceCode === e.picture);
              const fileId = filterItem[0] && filterItem[0].id;
              return {
                ...e,
                fileId,
              };
            });
            this.setState({
              list: newList,
            });
          } else {
            const newList = res.rows.map(e => {
              const fileId = '';
              return {
                ...e,
                fileId,
              };
            });
            this.setState({
              list: newList,
            });
          }
        });

      this.setState({
        pagination: {
          current: data.page,
          pageSize: data.rows,
          total: res.total,
        },
        loading: false,
      });
    });
  };

  // 流程模型选择样式
  renderOption = item => ({
    value: item.code,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex', marginLeft: '14px', padding: '6px 0' }}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
      // </Option>
    ),
  });

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
      if (item.name.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeVal: arr,
      // allowClear: 'ture',
    });
    // return true;
  };

  // 发布人选择样式
  renderOptionPublish = item => ({
    value: item.publisherCode,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }}>
        <span>{item.publisherName}</span>
      </div>
      // </Option>
    ),
  });

  // 发布人筛选值
  inputValuePublish = value => {
    const { nameCodeValPublish } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callPublish(value);
    if (nameCodeValPublish.length === 0) {
      return false;
    }
    nameCodeValPublish.forEach(item => {
      if (item.name.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.code.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeValPublish: arr,
      // allowClear: 'ture',
    });
    // return true;
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
    const { languageCode, status } = this.props;
    const { nameCodeVal } = this.state;
    return (
      <>
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 12}>
          <FormItem label="流程模型" name="code">
            <AutoComplete
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
        <Col xxl={6} xl={8} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem label="状态" name="status">
            <Select mode="multiple" maxTagCount={2} maxTagTextLength={3}>
              {status.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.text}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
        <Col xxl={6} lg={languageCode === 'EN' ? 12 : 0}>
          <FormItem label="发布人" name="publisherCode">
            <AutoComplete
              onSearch={this.inputValuePublish}
              options={nameCodeVal.map(this.renderOptionPublish)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              placeholder="发布人"
            />
          </FormItem>
        </Col>
      </>
    );
  };

  /** 完整筛选条件 */
  advancedForm = () => {
    const { languageCode } = this.state;
    return (
      <DateUI
        languageCode={languageCode}
        label="发布时间"
        name="publishDate"
        placeholder={['开始时间', '结束时间']}
      />
    );
  };

  // 关闭详情抽屉
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // 更换版本
  handleChangeVersion = v => {
    api.getProcessChangeVersion(v).then(res => {
      let newData = {};
      if (res.picture) {
        disk.getFiles({ sourceCode: res.picture, sourceKey: 'project_process_model' }).then(i => {
          const picId = i[0].id;
          newData = { ...res, picId };
          this.setState({
            detailValue: newData,
          });
          if (res.taskModels.length !== 0) {
            res.taskModels.map((item, index) => {
              if (item.picture) {
                disk
                  .getFiles({ sourceCode: item.picture, sourceKey: 'project_process_model' })
                  .then(r => {
                    const listId = r[0].id;
                    newData.taskModels[index].listId = listId;
                    this.setState({
                      detailValue: newData,
                    });
                  });
              }
              return true;
            });
          }
        });
      } else {
        this.setState({
          detailValue: res,
        });
      }
    });
  };

  // 新建
  handleModalVisible = () => {
    router.push('/project/process-model/add');
  };

  // 升级
  handleUpgrade = value => {
    api.getProcessDetail(value.id).then(res => {
      this.props.dispatch({
        type: 'processModel/setProcessDetail',
        payload: {
          ...res,
        },
      });
      router.push(`/project/process-model/up/${value.id}-up`);
    });
  };

  // 修改
  handleChange = value => {
    router.push(`/project/process-model/edit/${value.id}`);
  };

  // 删除
  handleDelete = value => {
    api.deleteProcess(value.id).then(() => {
      this.getTableData();
    });
  };

  // 发布
  handlePublish = value => {
    api.publishment(value.id).then(() => {
      this.getTableData();
    });
  };

  // 禁用
  handleUnPublish = value => {
    api.unPublishment(value.id).then(() => {
      this.getTableData();
    });
  };

  // 查看详情
  searchDetails = value => {
    this.setState({
      visible: true,
      detailValue: value,
    });
  };

  render() {
    const { pagination, loading, visible, detailValue, list } = this.state;

    const { status } = this.props;
    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 300,
        render: (value, row) => (
          <>
            <Avatar
              src={row.fileId ? disk.downloadFiles(row.fileId, { view: true }) : ''}
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{value}</div>
              <div style={{ color: '#B9B9B9' }}>{row.name}</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 400,
      },
      {
        title: '发布人/时间',
        dataIndex: 'publisherName',
        width: 200,
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
        width: 140,
        render: value => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            {value}
          </Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
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
        fixed: 'right',
        render: (value, row) => {
          const text = row.status;
          const operaList = getOperates(text);
          const menu = (
            <Menu>
              {operaList.map(
                (item, index) =>
                  index && (
                    <Menu.Item key={item}>
                      <a
                        className="task_model_add_argument_list"
                        onClick={() => {
                          if (item === '查看') {
                            return this.searchDetails(row);
                          }
                          if (item === '修改') {
                            return this.handleChange(row);
                          }
                          if (item === '升级') {
                            return this.handleUpgrade(row);
                          }
                          if (item === '删除') {
                            return this.handleDelete(row);
                          }
                          if (item === '发布') {
                            return this.handlePublish(row);
                          }
                          if (item === '禁用') {
                            return this.handleUnPublish(row);
                          }
                          return true;
                        }}
                      >
                        {item}
                      </a>
                    </Menu.Item>
                  ),
              )}
            </Menu>
          );
          return (
            <>
              <a
                onClick={() => {
                  if (operaList[0] === '查看') {
                    return this.searchDetails(row);
                  }
                  if (operaList[0] === '修改') {
                    return this.handleChange(row);
                  }
                  if (operaList[0] === '升级') {
                    return this.handleUpgrade(row);
                  }
                  if (operaList[0] === '删除') {
                    return this.handleDelete(row);
                  }
                  if (operaList[0] === '发布') {
                    return this.handlePublish(row);
                  }
                  if (operaList[0] === '禁用') {
                    return this.handleUnPublish(row);
                  }
                  return true;
                }}
              >
                {operaList[0]}
              </a>
              <Divider type="vertical" />
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多
                </a>
              </Dropdown>
            </>
          );
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
            <div className="tableListOperator">
              <Button
                type="primary"
                onClick={() => this.handleModalVisible()}
                style={{ marginLeft: '8px' }}
              >
                <PlusOutlined />
                新建
              </Button>
            </div>
            <Form ref={this.tableFormRef} className="table-style-set">
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Form>
          </Card>
          {visible ? (
            <ProcessDetail
              visible={visible}
              // visible
              onClose={this.onClose}
              detailId={detailValue.id}
              status={status}
              handleChangeVersion={v => this.handleChangeVersion(v)}
              handleUnPublish={row => this.handleUnPublish(row)}
            />
          ) : null}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, processModel, project }) => ({
  languageCode: global.languageCode,
  processModel,
  status: project.status,
  processList: project.processList,
}))(ProcessModel);
