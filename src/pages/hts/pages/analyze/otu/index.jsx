/**
 * OTU分析
 */
import { Card, Col, Divider, Form, Input, Avatar, Badge, Tag, Button } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import EditableCell from '@/components/EditableCell';
import api from '@/pages/project/api/processModel/';
import disk from '@/pages/project/api/disk';
import ProTable from '@ant-design/pro-table';
import { formatter, getOperates, cutString } from '@/utils/utils';

const FormItem = Form.Item;

class OTU extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {
      // current: 1,
      // pageSize: 10,
      // total: 0,
    },
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    // 选中行数据
    selectedRows: [],
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  // 组件挂载时
  // componentDidMount() {
  //   this.getCacheData();
  //   // this.getTableData(this.initialValues);
  // }

  // 顶部表单简单搜索
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="编号" name="code">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="名称" name="name">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="移动电话" name="mobile">
          <Input />
        </FormItem>
      </Col>
    </>
  );

  // 顶部表单复杂搜索
  advancedForm = () => <></>;

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 分页
  // handleStandardTableChange = data => {
  //   this.getTableData({
  //     page: data.current,
  //     rows: data.pageSize,
  //   });
  // };

  // 选择行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    // const formData = this.tableSearchFormRef.current.getFieldsValue();
    // console.log(options);
    const { pagination, processCode, publisherCode } = this.state;
    const { pageSize: rows = 10 } = pagination;
    const newData = [];
    const changePage = false;
    // if (formData.status) {
    //   changePage = true;
    //   newData = { ...newData, status: formData.status.join(',') };
    //   delete formData.status;
    // }

    // if (formData.publishDate) {
    //   changePage = true;
    //   newData = {
    //     ...newData,
    //     publishBeginDate: formData.publishDate[0].format('YYYY-MM-DD'),
    //     publicEndDate: formData.publishDate[1].format('YYYY-MM-DD'),
    //   };
    //   delete formData.publishDate;
    // }

    // if (formData.name) {
    //   changePage = true;
    //   newData = { ...newData, code: processCode };
    //   delete formData.name;
    // }
    // if (formData.publisherName) {
    //   changePage = true;
    //   newData = { ...newData, publisherCode };
    //   delete formData.publisherName;
    // }
    const newPage = changePage ? { page: 1 } : { page: options.current };
    const data = {
      ...newPage,
      rows,
      ...newData,
      // ...formData,
      ...options,
    };
    console.log(data);
    api.getProcess(data).then(res => {
      this.setState({
        list: res.rows,
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

  // 保存和修改之后的保存
  // saveRow = async index => {
  //   const { storages } = this.props;
  //   try {
  //     const row = await this.tableFormRef.current.validateFields();
  //     const storageName = storages.filter(e => e.code === row.storageCode)[0].name;
  //     const { list } = this.state;
  //     const newData = { ...list[index], ...row, storageName };
  //     if (newData.id < 0) {
  //       api.seqfactory.addSeqfactory(newData).then(() => this.getTableData());
  //     } else {
  //       api.seqfactory.updateSeqfactory(newData).then(() => this.getTableData());
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  render() {
    const { pagination, selectedRows, list, loading } = this.state;
    const { status } = this.props;
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 300,
        renderFormItem: item => {
          console.log(item);
          return <Input placeholder="123" />;
        },
        render: (value, row) => (
          <>
            <Avatar
              src={
                row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
              }
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
        render: value => <div title={value}>{cutString(value, 115)}</div>,
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
    ];

    return (
      <PageHeaderWrapper>
        {/* <Card bordered={false}> */}
        {/* <Form ref={this.tableFormRef}> */}
        <ProTable
          headerTitle={
            <Button
              type="primary"
              // onClick={() => this.handleModalVisible()}
              // style={{ marginBottom: '35px' }}
            >
              <PlusOutlined />
              新建
            </Button>
          }
          rowKey="id"
          request={params =>
            api
              .getProcess({ page: params.current, rows: params.pageSize, status: params.status })
              .then(res => ({ data: res.rows, total: res.total, success: true }))
          }
          columns={columns}
          options={false}
          // search={false}
          pagination={{
            defaultPageSize: 10,
          }}
        />
        {/* </Form> */}
        {/* </Card> */}
      </PageHeaderWrapper>
    );
  }
}

export default OTU;
