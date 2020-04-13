// 选择任务模型
import React from 'react';
import { Modal, Table, Avatar, Form, Col, Tag, AutoComplete, Spin } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';
import './index.less';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import { cutString } from '@/utils/utils';
import _ from 'lodash';
import DefaultHeadPicture from '@/assets/imgs/DefaultHeadPicture.jpg';

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
    this.callParter = _.debounce(this.callParter, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  callParter = value => {
    api.getTaskNameAndCode(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  titleContent = () => <div style={{ fontSize: '16px' }}>选择任务模型</div>;

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const { pagination } = this.state;
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    };
    api.getTaskModels(data).then(res => {
      const uuids = res.rows.map(e => e.picture);
      disk
        .getFiles({
          sourceCode: uuids.join(','),
          sourceKey: 'project_task_model',
        })
        .then(v => {
          const newList = res.rows.map(e => {
            const filterItem = v ? v.filter(item => item.sourceCode === e.picture) : [];
            const fileId = filterItem[0] && filterItem[0].id;
            return {
              ...e,
              fileId,
            };
          });
          this.setState({
            list: newList,
            loading: false,
          });
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

  simpleForm = () => {
    const { nameCodeVal } = this.state;
    return (
      <>
        <Col lg={10}>
          <FormItem label="名称" name="code">
            <AutoComplete
              onSearch={this.inputValue}
              options={nameCodeVal.map(this.renderOption)}
              // placeholder={formatMessage({ id: 'bp.inputHere' })}
              // optionLabelProp="text"
            />
          </FormItem>
        </Col>
      </>
    );
  };

  sendData = async id => {
    this.props.onClose();
    const res = await api.getAllPreTasks(id, this.props.ids);
    this.props.getData(res);
  };

  handleStandardTableChange = pagination => {
    this.getTableData({
      page: pagination.current,
      rows: pagination.pageSize,
    });
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
              src={row.fileId ? disk.downloadFiles(row.fileId, { view: true }) : DefaultHeadPicture}
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
          <div
            // className="addEllipsis"
            title={value}
            style={{ width: '250px', height: '50px', wordWrap: 'break-word' }}
          >
            {cutString(value, 65)}
          </div>
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
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={onClose}
        width={747}
        footer={null}
      >
        <div className="tableList buttonStyle table-style-set-little" style={{ marginLeft: '8px' }}>
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={list}
              loading={loading}
              rowKey="id"
              size="small"
              pagination={pagination}
              onChange={this.handleStandardTableChange}
            />
          </Spin>
        </div>
      </Modal>
    );
  }
}

export default connect(({ global, processModel }) => ({
  languageCode: global.languageCode,
  processModel,
}))(AssociatedProcessModel);
