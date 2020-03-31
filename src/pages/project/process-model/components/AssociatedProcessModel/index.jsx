// 关联流程模型
import React from 'react';
import { Modal, Table, Avatar, Form, Input, Select, Col, Tag, Popconfirm } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

class AssociatedProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  state = { visible: false, pagination: {} };

  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  titleContent = () => <div style={{ fontSize: '16px' }}>关联任务模型</div>;

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

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
      // pagination: {
      //   current: options.page,
      //   pageSize: options.rows,
      //   total: data.total,
      // },
      loading: false,
    });
    // console.log(this.props.project.projectManage);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  simpleForm = () => (
    <>
      <Col lg={8}>
        <FormItem label="名称" name="name">
          <Input placeholder="请输入" />
        </FormItem>
      </Col>
      <Col lg={8}>
        <FormItem label="发布人" name="publisher">
          <Select>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
          </Select>
        </FormItem>
      </Col>
    </>
  );

  confirm = () => {
    console.log(123);
  };

  render() {
    const { onClose } = this.props;
    const { list, loading, pagination } = this.state;
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 220,
        render: (value, row) => (
          <>
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              style={{ float: 'left' }}
            />
            <div style={{ float: 'left' }}>
              <div>123</div>
              <div>123</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        width: 280,
        dataIndex: 'publishDate',
      },
      {
        title: '版本',
        width: 100,
        dataIndex: 'version',
        render: value => <Tag color="green" style={{ padding: '0 10px' }}>{`V${value}`}</Tag>,
      },
      {
        title: '操作',
        width: 100,
        render: value => (
          <>
            <Popconfirm
              placement="topLeft"
              title="有前置任务，无法删除。"
              onConfirm={this.confirm}
              okText="Yes"
              cancelText="No"
            >
              删除
            </Popconfirm>
          </>
        ),
      },
    ];

    return (
      <Modal
        title={this.titleContent()}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={onClose}
        width={747}
      >
        <div className="tableList">
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <span>{this.titleContent()}</span>
          <Table
            columns={columns}
            dataSource={list}
            loading={loading}
            rowKey="id"
            size="small"
            pagination={pagination}
          />
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, processModel }) => ({
  languageCode: global.languageCode,
  processModel,
}))(AssociatedProcessModel);
