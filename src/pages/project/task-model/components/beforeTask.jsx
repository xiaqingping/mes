// 选择任务模型
import React from 'react';
import { Modal, Table, Avatar, Form, Col, Tag, Select, Spin } from 'antd';
import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';
import DefaultHeadPicture from '@/assets/imgs/upload_middle.png';
import api from '@/pages/project/api/taskmodel';
// import { cutString } from '@/utils/utils';
import _ from 'lodash';
import disk from '@/pages/project/api/disk';

const { Option } = Select;

const FormItem = Form.Item;
/**
 * 前置任务列表  任务模型选择前置任务
 */
class BeforeTask extends React.Component {
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
      // nameCodeVal: [],
      value: [],
      children: [],
    };
    this.fetchData = _.debounce(this.fetchData, 500);
  }

  componentDidMount() {
    this.getTableData(this.initialValues);
  }

  /**
   * modal表title
   */
  titleContent = () => <div style={{ fontSize: '16px' }}>选择任务模型</div>;

  /**
   * Modal点击确认操作
   */
  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 获取表格数据
   * @param {Object} option 外部传入的props
   */
  getTableData = (options = {}) => {
    this.setState({ loading: true });
    const { pagination, value } = this.state;
    const formData = this.tableSearchFormRef.current
      ? this.tableSearchFormRef.current.getFieldsValue()
      : '';
    const { current: page, pageSize: rows } = pagination;

    const data = {
      page,
      rows,
      code: formData.code && value,
      // ...formData,
      ...options,
      status: 2,
    };
    api
      .getTaskModels(data)
      .then(res => {
        const uuids = (res.rows || []).map(e => e.picture);
        disk
          .getFiles({
            sourceCode: uuids.join(','),
            sourceKey: 'project_task_model',
          })
          .then(v => {
            const newList = (res.rows || []).map(e => {
              const filterItem = v ? v.filter(item => item.sourceCode === e.picture) : [];
              const fileId = filterItem[0] && filterItem[0].id;
              return {
                ...e,
                fileId,
              };
            });
            this.setState({
              list: newList,
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
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
        });
      });
  };

  /**
   * 获取模糊搜索的数据
   * @param {String} 用户输入在input框中的值
   */
  fetchData = value => {
    api.getTaskNameAndCode(value).then(res => {
      this.setState({
        children: res,
      });
    });
  };

  /**
   * 更新value
   * @param {Object} value 用户选中的值
   */
  handleSelectChange = value => {
    const { pagination } = this.state;
    const page = {
      current: 1,
      pageSize: pagination.pageSize,
    };
    // debugger;
    this.setState({
      value: value && value.value,
      pagination: page,
    });
  };

  /**
   * 简单模式下的DOM
   */
  simpleForm = () => {
    const { children } = this.state;
    return (
      <>
        <Col lg={10}>
          <FormItem label="名称" name="code">
            <Select
              allowClear
              // mode="tag"
              showSearch
              showArrow={false}
              labelInValue
              // value={value} // 有值的话就会展示
              // placeholder="Select users"
              filterOption={false}
              onSearch={this.fetchData}
              onChange={this.handleSelectChange}
              style={{ width: '100%' }}
              optionFilterProp="children" // 对子元素--option进行筛选
              optionLabelProp="label" // 回填的属性
            >
              {children.map(d => (
                <Option key={d.code} value={d.code} label={d.name}>
                  {d.code}&nbsp;&nbsp;{d.name}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </>
    );
  };

  /**
   * 获取前置任务数据
   *  @param {String}} 用户选中的id
   */
  sendData = async id => {
    this.setState({
      loading: true,
    });
    const res = await api.getAllPreTasks(id, this.props.ids).catch(err => {
      console.log(err);
      this.setState({
        loading: false,
      });
    });
    this.setState({
      loading: false,
    });
    this.props.getData(res);
    this.props.onClose();
  };

  /**
   * 表格点击页码，筛选的回调
   */
  handleChange = p => {
    const page = p.current;
    const rows = p.pageSize;
    const pagination = { page, rows };
    this.setState({
      pagination,
    });
    this.getTableData(pagination);
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
            <div style={{ display: 'flex' }}>
              <div style={{ width: 40 }}>
                <Avatar
                  src={
                    row.picture
                      ? disk.downloadFiles(row.picture, { view: true })
                      : DefaultHeadPicture
                  }
                  style={{ float: 'left', width: '40px', height: '40px' }}
                />
              </div>

              <div style={{ float: 'left', marginLeft: '10px' }}>
                <div>{value}</div>
                <div>{row.name}</div>
              </div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        width: 280,
        dataIndex: 'describe',
        ellipsis: true,
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
        width={840}
        height={570}
        footer={null}
        className="classBeforeTask"
      >
        <Spin spinning={loading}>
          <div className="tableList buttonStyle setTitleColor">
            <div>
              <TableSearchForm
                ref={this.tableSearchFormRef}
                initialValues={this.initialValues}
                getTableData={this.getTableData}
                simpleForm={this.simpleForm}
              />
            </div>
            <Table
              columns={columns}
              dataSource={list}
              rowKey="id"
              size="small"
              pagination={pagination}
              onChange={this.handleChange}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ global, taskModel }) => ({
  languageCode: global.languageCode,
  taskModel,
}))(BeforeTask);
