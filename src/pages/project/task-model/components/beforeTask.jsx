/* eslint-disable consistent-return */
// 选择任务模型
import React from 'react';
import { Modal, Avatar, Tag, Select, message } from 'antd';
import { connect } from 'dva';
import DefaultHeadPicture from '@/assets/imgs/upload_middle.png';
import api from '@/pages/project/api/taskmodel';
import { cutString } from '@/utils/utils';
import ProTable from '@ant-design/pro-table';
import _ from 'lodash';
import disk from '@/pages/project/api/disk';

const { Option } = Select;

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
      children: [],
      loading: false,
    };
    this.fetchData = _.debounce(this.fetchData, 500);
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
   * 获取前置任务数据
   *  @param {String}} 用户选中的id
   */
  sendData = async id => {
    let typeList = []; // 每次点击时先清空
    this.setState({
      loading: true,
    });
    const res = await api.getAllPreTasks(id, this.props.ids).catch(err => {
      console.log(err);
    });
    this.setState({
      loading: false,
    });
    const { allPreTaskParamsType, argumentList } = this.props.taskModel;
    const argumentTypeList = (argumentList || []).map(item => item.type);
    let pass = true;
    typeList = [...allPreTaskParamsType, ...argumentTypeList];
    const noDoubleParamType = ['sample_select', 'sample_group', 'sample_environment_factor'];
    const resTypeList = [];
    (res || []).forEach(item => {
      if (item.params && item.params.length) {
        item.params.forEach(p => {
          resTypeList.push(p.type);
        });
      }
    });

    resTypeList.forEach(item => {
      if (noDoubleParamType.includes(item)) {
        if (typeList.includes(item)) {
          pass = false;
          return false;
        }
      }
    });

    if (!pass) return message.error('样品选择框，环境因子，分组方案不能重复添加');
    this.setParamsTypeStore([...allPreTaskParamsType, ...resTypeList]);
    this.props.getData(res);
    this.props.onClose();
  };

  /**
   * 设置参数type store
   * @param {Arrary} pretaskParamsType 所有前置任务参数的type
   */
  setParamsTypeStore = pretaskParamsType => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskModel/setAllPreTaskParamsType',
      payload: pretaskParamsType,
    });
  };

  /**
   * 列表查询数据的处理
   * @param {object} params request返回的数据
   */
  getParamData = params => {
    const newObj = {
      page: params.current,
      rows: params.pageSize,
      status: params.status ? params.status : '',
      code: params.name ? params.name.value : '',
      publisherCode: params.publisherName ? params.publisherName.value : '',
      publishBeginDate: params.publishDate ? params.publishDate[0] : '',
      publicEndDate: params.publishDate ? params.publishDate[1] : '',
    };
    Object.getOwnPropertyNames(newObj).forEach(key => {
      if (!newObj[key]) {
        delete newObj[key];
      }
    });
    return newObj;
  };

  /**
   * 表格columns
   */
  columns = () => {
    const { children } = this.state;
    return [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 220,
        hideInSearch: true,
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
                <div title={row.name}>{cutString(row.name, 18)}</div>
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
        hideInSearch: true, // 在form里隐藏
      },
      {
        title: '版本',
        width: 100,
        dataIndex: 'version',
        hideInSearch: true,
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
      {
        title: '名称',
        dataIndex: 'name',
        width: 220,
        hideInTable: true, // 在表格里隐藏这列
        renderFormItem: (item, { onChange }) => (
          <Select
            allowClear
            showSearch
            showArrow={false}
            labelInValue
            filterOption={false}
            onSearch={this.fetchData}
            onChange={onChange}
            style={{ width: '100%' }}
            optionFilterProp="children" // 对子元素--option进行筛选
            optionLabelProp="label" // 回填的属性
          >
            {(children || []).map(d => (
              <Option key={d.code} value={d.code} label={d.name}>
                {d.code}&nbsp;&nbsp;{d.name}
              </Option>
            ))}
          </Select>
        ),
      },
    ];
  };

  render() {
    const { onClose } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        bodyStyle={{ paddingTop: 0 }}
        title={this.titleContent()}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={onClose}
        width={840}
        height={570}
        footer={null}
        className="classBeforeTask"
      >
        <ProTable
          actionRef={this.tableSearchFormRef}
          rowKey="id"
          className="setNoTableToolbar"
          loading={loading}
          search={{ span: 11 }}
          request={params =>
            api
              .getTaskModels(this.getParamData(params))
              .then(res => ({ data: res.rows, total: res.total, success: true }))
          }
          columns={this.columns()}
          options={false}
          pagination={{
            defaultPageSize: 5,
          }}
        />
      </Modal>
    );
  }
}

export default connect(({ global, taskModel }) => ({
  languageCode: global.languageCode,
  taskModel,
}))(BeforeTask);
