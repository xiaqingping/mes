/** 选择任务模型 */
import React from 'react';
import { Modal, Table, Avatar, Form, Col, Tag, AutoComplete, Spin, Button } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';
import './index.less';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import { cutString } from '@/utils/utils';
import _ from 'lodash';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';

const FormItem = Form.Item;

class AssociatedProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  initialValues = {
    page: 1,
    rows: 5,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pagination: {},
      nameCodeVal: [],
      loading: true,
    };
    this.callTask = _.debounce(this.callTask, 500);
  }

  /** 加载table值 */
  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  /**
   * 搜索任务名称的回调
   * @param {string} value 输入内容的值
   */
  callTask = value => {
    api.getTaskNameAndCode(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  /**
   * 标题样式
   */
  titleContent = () => <div style={{ fontSize: '16px' }}>选择任务模型</div>;

  /**
   * 选择了关闭当前页面
   */
  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 搜索table的值
   * @param {object} options 搜索的条件参数
   */
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      ...{ status: 2 },
      page,
      rows,
      ...formData,
      ...options,
    };
    api.getTaskModels(data).then(res => {
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

  /**
   * 自动搜索的下拉框样式
   * @param {object} item 搜索到对象的值
   */
  renderOption = item => ({
    value: item.code,
    label: (
      // <Option key={item.id} text={item.name}>
      <div style={{ display: 'flex' }} key={item.code}>
        <span>{item.code}</span>&nbsp;&nbsp;
        <span>{item.name}</span>
      </div>
      // </Option>
    ),
  });

  /**
   * 筛选值
   * @param {string} value 输入框内的值
   */
  inputValue = value => {
    const { nameCodeVal } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callTask(value);
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
    return true;
  };

  /**
   * 单行搜索框
   */
  simpleForm = () => {
    const { nameCodeVal } = this.state;
    return (
      <>
        <Col xxl={12}>
          <FormItem label="名称" name="code">
            <AutoComplete
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
              style={{ width: '252px' }}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
        <Col xxl={12} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => {
              this.tableSearchFormRef.current.resetFields();
            }}
          >
            重置
          </Button>
        </Col>
      </>
    );
  };

  /**
   * 选择的值传递给父组件
   * @param {Int} id 选择的ID
   */
  sendData = async id => {
    this.props.onClose('close');
    const res = await api.getAllPreTasks(id, this.props.ids);
    this.props.getData(res);
  };

  /**
   * table变更
   * @param {object} pagination 分页
   */
  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
  };

  render() {
    const { onClose } = this.props;
    const { list, loading, pagination, visible } = this.state;
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 220,
        render: (value, row) => (
          <>
            <Avatar
              src={
                row.picture ? disk.downloadFiles(row.picture, { view: true }) : DefaultHeadPicture
              }
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{cutString(value, 16)}</div>
              <div>{cutString(row.name, 16)}</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        width: 280,
        dataIndex: 'describe',
        render: value => (
          <span title={value} style={{ display: 'inline-block', width: '300px' }}>
            {cutString(value, 80)}
          </span>
        ),
      },
      {
        title: '版本',
        width: 100,
        dataIndex: 'version',
        render: value => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            {value}
          </Tag>
        ),
      },
      {
        title: '操作',
        width: 100,
        render: (value, row) => (
          <>
            <a onClick={() => this.sendData(row.id)}>选择</a>
          </>
        ),
      },
    ];

    return (
      <Modal
        title={this.titleContent()}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onClose}
        width={840}
        footer={null}
      >
        <div>
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
            noButton
          />
          <div style={{ marginTop: '10px' }}>
            <Spin spinning={loading}>
              <Table
                columns={columns}
                align="center"
                dataSource={list}
                loading={loading}
                rowKey="id"
                size="small"
                className="tableheader"
                pagination={pagination}
                onChange={this.handleStandardTableChange}
              />
            </Spin>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, processModel }) => ({
  languageCode: global.languageCode,
  processModel,
}))(AssociatedProcessModel);
