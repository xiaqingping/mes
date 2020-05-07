/**
 * 业务伙伴模态框
 */
import { Input, Modal, Table, Badge, Button, AutoComplete, Col, Form } from 'antd';
import React, { Component } from 'react';
import { formatter } from '@/utils/utils';
import { connect } from 'dva';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import api from '@/pages/project/api/bp';
import _ from 'lodash';
import './index.less';

const FormItem = Form.Item;

class BPList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  // 顶部表单默认值
  initialValues = {
    page: 1,
    pageSize: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 分页参数
      pagination: {},
      list: [], // 表格数据
      loading: true, // 加载状态
      visible: false, // 遮罩层的判断
      nameOrCodeList: [], // 名称编号 模糊查询前十条数据
      bpCode: '', // 查询条件bpCode
    };
    // 异步验证做节流处理
    this.searchNameOrCode = _.debounce(this.searchNameOrCode, 500);
  }

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
    const { pagination, bpCode } = this.state;
    const { current: page, pageSize } = pagination;

    const data = {
      page,
      pageSize,
      ...formData,
      ...options,
      code: bpCode,
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
      this.initialValues.email = '';
      this.initialValues.mobilePhone = '';
    });
  };

  // 名称编号 搜索
  searchNameOrCode = value => {
    if (!value) {
      this.setState({ nameOrCodeList: [] });
      return;
    }
    api.getOrgCustomerByCodeOrName({ code_or_name: value }).then(res => {
      this.setState({ nameOrCodeList: res, bpCode: '' });
    });
  };


/**
 * 联系方式 搜索
 * @param {Array} row 当前数据
 * @param {object} type 类型
 * */
  searchPhoneOrEmail = selectedKeys => {
    const type = this.visibleEmial(selectedKeys);
    // console.log(type);
    if (type) {
      this.initialValues.email = selectedKeys;
    } else {
      this.initialValues.mobilePhone = selectedKeys;
    }
    this.getTableData(this.initialValues);
  };

  // 验证邮箱
  visibleEmial = value => {
    // eslint-disable-next-line max-len
    const data = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      value,
    );
    return data;
  };

  // 名称编号 表头搜索 显示样式
  renderNameOrCodeList = item => (
    <AutoComplete.Option key={item.name} text={item.name}>
      <div
        style={{ display: 'flex' }}
        onClick={() => {
          this.setState({ bpCode: item.code });
        }}
      >
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    </AutoComplete.Option>
  );

  // 名称编号 表头查询条件
  getColumnSearchPropsNameOrCode = () => {
    const { nameOrCodeList } = this.state;
    return {
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <AutoComplete
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            dataSource={nameOrCodeList.map(this.renderNameOrCodeList)}
            onSearch={this.searchNameOrCode}
            optionLabelProp="text"
            value={selectedKeys}
            onChange={value => setSelectedKeys(value)}
          />
          <Button
            type="primary"
            onClick={confirm}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            <SearchOutlined />
            搜索
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </div>
      ),
    };
  };

  // 联系方式 表头查询条件
  getColumnSearchPropsPhoneOrEmail = () => ({
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          value={selectedKeys}
          onChange={e => setSelectedKeys(e.target.value)}
        />
        <Button
          type="primary"
          // onClick={confirm}
          onClick={() => this.searchPhoneOrEmail(selectedKeys, confirm)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <SearchOutlined />
          搜索
        </Button>
        <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
  });

  simpleForm = () => {
    const { list } = this.state;
    return (
      <>
        <Col lg={10}>
          <FormItem label="名称" name="code">
            <AutoComplete
              onSearch={this.inputValue}
              options={list.map(this.renderOption)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
      </>
    );
  };

  renderOption = item => ({
    value: item.code,
    label: (
      <div style={{ display: 'flex' }} key={item.code}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
    ),
  });

  render() {
    const { pagination, list, loading, visible } = this.state;
    const { BpCertificationStatus, SalesOrderBlock } = this.props.projectManage;
    // let tableWidth = 0;

    let columns = [
      {
        title: '业务伙伴',
        dataIndex: 'name',
        width: 200,
        render: (value, row) => (
          <>
              <div
              style={{paddingLeft:'30px'}}
              >
                <p style={{paddingTop:'8px',marginBottom:'0'}}>
                  <UserOutlined /> &nbsp;{value}
                </p>
                <p style={{paddingBottom:'8px',marginBottom:'0'}}>{row.code}</p>
              </div>
          </>
        ),
        ...this.getColumnSearchPropsNameOrCode(),
      },
      {
        title: '认证',
        dataIndex: 'certificationStatus',
        width: 100,
        render: value => {
          const status = formatter(BpCertificationStatus, value, 'id', 'badge');
          const text = formatter(BpCertificationStatus, value);
          return <Badge status={status} text={text} />;
        },
      },
      {
        title: '冻结',
        dataIndex: 'salesOrderBlock',
        width: 100,
        render: value => {
          const status = formatter(SalesOrderBlock, value, 'id', 'badge');
          const text = formatter(SalesOrderBlock, value);
          return <Badge status={status} text={text} />;
        },
      },
      {
        title: '联系方式',
        dataIndex: 'mobilePhone',
        width: 170,
        ...this.getColumnSearchPropsPhoneOrEmail(),
        render: (value, row) => {
          const statusPhone = formatter(
            BpCertificationStatus,
            row.mobilePhoneVerifyStatus,
            'id',
            'badge',
          );
          const statusEmail = formatter(
            BpCertificationStatus,
            row.emailVerifyStatus,
            'id',
            'badge',
          );
          return (
            <>
              {value ? (
                <p style={{marginBottom:'0'}}>
                  {value}&nbsp;&nbsp;&nbsp;
                  <Badge status={statusPhone} />
                </p>
              ) : (
                ''
              )}
              {row.email ? (
                <p style={{marginBottom:'0'}}>
                  {row.email}&nbsp;&nbsp;&nbsp;
                  <Badge status={statusEmail} />
                </p>
              ) : (
                ''
              )}
            </>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'actions',
        fixed: 'right',
        width: 100,
        render: (value, row) => <a onClick={() => this.handleSelect(row)}>选择</a>,
      },
    ];

    // columns = columns.map(col => {
    //   // if (!col.width) col.width = 100;
    //   // tableWidth += col.width;
    //   return col;
    // });
    columns = columns.map(col => col);

    return (
      <div>
        <Modal
          width="1000px"
          title="业务伙伴 - 客户"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          className="classBOList"
        >
          <Table
            className="classTableList"
            scroll={{ y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            pagination={pagination}
            columns={columns}
            onChange={this.handleStandardTableChange}
            // height={70}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(BPList);
