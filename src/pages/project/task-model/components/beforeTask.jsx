// 关联流程模型
import React from 'react';
import {
  Modal,
  Table,
  Avatar,
  Form,
  AutoComplete,
  Input,
  Select,
  Col,
  Tag,
  Button,
  Spin,
} from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';
import api from '@/pages/project/api/taskmodel';

const FormItem = Form.Item;
const { Option } = Select;

class BeforeTask extends React.Component {
  tableSearchFormRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  state = { visible: false, pagination: {}, fetching: false, data: [], code: '', value: '' };

  initialValues = {
    page: 1,
    rows: 10,
  };

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  titleContent = () => <div style={{ fontSize: '16px' }}>关联任务模型</div>;

  getTableData = (options = {}) => {
    const { code } = this.state;
    this.setState({ loading: true });
    const { page, rows } = this.state;
    const formData =
      this.tableSearchFormRef.current && this.tableSearchFormRef.current.getFieldsValue();
    console.log(formData);
    const data = {
      page,
      rows,
      ...code,
      ...options,
    };
    console.log(data);
    api.getTaskModels(data).then(res => {
      this.setState({
        loading: false,
        list: res.rows,
      });
    });

    // console.log(this.tableSearchFormRef);
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
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  // 被选中的model
  selectModel = row => {
    this.props.onClose(row, 'select');
  };

  handleSearch = v => {
    api.getTaskNameAndCode(v).then(res => {
      console.log(res);
      this.setState({
        data: res,
      });
    });
  };

  handleChange = v => {
    this.setState({
      code: { code: v.join(',') },
      value: v,
    });
  };

  simpleForm = () => {
    const { fetching, data, value } = this.state;
    return (
      <>
        <Col lg={10}>
          <FormItem label="名称" name="code">
            <Select
              value={value}
              mode="multiple"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              optionFilterProp="children"
              optionLabelProp="name"
              onSearch={this.handleSearch}
              onChange={this.handleChange}
              style={{ width: '100%' }}
            >
              {data.map(d => (
                <Option key={d.code} value={d.code} name={d.name}>
                  {d.code} &nbsp;{d.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

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
        render: (value, row) => {
          return (
            <>
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                style={{ float: 'left' }}
              />
              <div style={{ float: 'left' }}>
                <div>{row.code}</div>
                <div>{row.name}</div>
              </div>
            </>
          );
        },
      },
      {
        title: '描述',
        width: 280,
        dataIndex: 'describe',
      },
      {
        title: '版本',
        width: 100,
        dataIndex: 'version',
        render: value => <>{value && <Tag color="green">{value}</Tag>}</>,
      },
      {
        title: '操作',
        // width: 100,
        render: (value, row) => (
          <Button
            type="link"
            block
            onClick={() => {
              this.selectModel(row);
            }}
          >
            选择
          </Button>
        ),
      },
    ];

    return (
      <Modal
        destroyOnClose
        title={this.titleContent()}
        visible={this.state.visible}
        width={747}
        footer={null}
        onCancel={onClose}
      >
        <div className="tableList">
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
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
}))(BeforeTask);
