/**
 * 业务伙伴模态框
 */
import {
  Col,
  Form,
  Input,
  Modal,
  Table,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import TableSearchForm from '@/components/TableSearchForm';
import { formatter } from '@/utils/utils';
import { connect } from 'dva';
import { UserOutlined } from '@ant-design/icons';
import api from '@/pages/project/api/bp';

const FormItem = Form.Item;

class BPList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {},
    list: [],       // 表格数据
    loading: true,  // 加载状态
    visible: false, // 遮罩层的判断
  };

  // 顶部表单默认值
  initialValues = {
    page: 1,
    pageSize: 10,
  };

  // 组件挂载时
  componentDidMount() {
    this.props.onRef(this);
    this.getTableData(this.initialValues);
  }

  // 是否显示窗口
  visibleShow = visible => {
    this.setState({ visible });
    this.getTableData(this.initialValues);
  };

  // 回传数据
  handleSelect = rows => {
    this.props.getData(rows);
    this.handleCancel();
  };

  // 关闭窗口
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 分页
  handleStandardTableChange = data => {
    this.getTableData({
      page: data.current,
      pageSize: data.pageSize,
    });
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    this.setState({ loading: true });

    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const { pagination } = this.state;
    const { current: page, pageSize } = pagination;
    const data = {
      page,
      pageSize,
      ...formData,
      ...options,
    };

    api.getBPList(data).then(res => {
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
    </>
  );

  render() {
    const { pagination, list, loading, visible } = this.state;
    const { BpCertificationStatus, SalesOrderBlock } = this.props.projectManage;
    let tableWidth = 0;

    let columns = [
      {
        title: '业务伙伴',
        dataIndex: 'name',
        width: 300,
        render: (value, row) => (
          <>
            <p><UserOutlined /> &nbsp;{value}</p>
            <p>{row.code}</p>
          </>
        )
      },
      {
        title: '认证',
        dataIndex: 'certificationStatus',
        width: 150,
        render: value => {
          const status = formatter(BpCertificationStatus, value, 'id', 'badge')
          const text = formatter(BpCertificationStatus, value,)
          return <Badge status={status} text={text} />
        }
      },
      {
        title: '冻结',
        dataIndex: 'salesOrderBlock',
        width: 150,
        render: value => {
          const status = formatter(SalesOrderBlock, value, 'id', 'badge')
          const text = formatter(SalesOrderBlock, value,)
          return <Badge status={status} text={text} />
        }
      },
      {
        title: '联系方式',
        dataIndex: 'mobilePhone',
        width: 200,
        render: (value, row) => {
          const statusPhone = formatter(
              BpCertificationStatus, row.mobilePhoneVerifyStatus, 'id', 'badge'
            )
          const statusEmail = formatter(
              BpCertificationStatus, row.mobilePhoneVerifyStatus, 'id', 'badge'
            )
          return (
            <>
              <p>{value}&nbsp;&nbsp;&nbsp;<Badge status={statusPhone} text='' /></p>
              <p>{row.email}&nbsp;&nbsp;&nbsp;<Badge status={statusEmail} text='' /></p>
            </>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        width: 100,
        render: (value, row) => <a onClick={() => this.handleSelect(row)}>选择</a>,
      },
    ];

    columns = columns.map(col => {
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      return col;
    });

    return (
      <div>
        <Modal
          width="1200px"
          title="客户列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <div className="tableListOperator" />
          <Table
            scroll={{ x: tableWidth, y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            pagination={pagination}
            columns={columns}
            onChange={this.handleStandardTableChange}
            height={70}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(BPList);
