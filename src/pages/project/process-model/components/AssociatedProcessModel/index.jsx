/** 选择任务模型 */
import React from 'react';
import { Modal, Avatar, Tag, AutoComplete, Select } from 'antd';
import { connect } from 'dva';
import './index.less';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import { cutString } from '@/utils/utils';
import _ from 'lodash';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import ProTable from '@ant-design/pro-table';

const { Option } = Select;

class AssociatedProcessModel extends React.Component {
  tableSearchFormRef = React.createRef();

  static getDerivedStateFromProps(nextProps) {
    return { visible: nextProps.visible || false };
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      nameCodeVal: [],
    };
    this.callTask = _.debounce(this.callTask, 500);
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
   * 选择的值传递给父组件
   * @param {Int} id 选择的ID
   */
  sendData = async id => {
    this.props.onClose('close');
    const res = await api.getAllPreTasks(id, this.props.ids);
    this.props.getData(res);
  };

  /**
   * 列表查询数据的处理
   * @param {object} params request返回的数据
   */
  getParamData = params => {
    console.log(params);
    const { processCode, publisherCode } = this.state;
    const newObj = {
      page: params.current,
      rows: params.pageSize,
      status: params.status ? params.status : '',
      code: params.name ? processCode : '',
      publisherCode: params.publisherName ? publisherCode : '',
      publishBeginDate: params.publishDate ? params.publishDate[0] : '',
      publicEndDate: params.publishDate ? params.publishDate[1] : '',
    };
    Object.getOwnPropertyNames(newObj).forEach(key => {
      if (!newObj[key]) {
        delete newObj[key];
      }
    });
    // this.ref.current.reload();
    return newObj;
  };

  render() {
    const { onClose } = this.props;
    const { visible, nameCodeVal } = this.state;
    const children = nameCodeVal.map(item => (
      <Option key={item.code} value={item.name}>
        <div
          onClick={() => {
            this.setState({
              processCode: item.code,
            });
          }}
        >
          {item.code} {item.name}
        </div>
      </Option>
    ));
    const columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 220,
        hideInSearch: true,
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
              <div title={row.name}>{cutString(row.name, 16)}</div>
            </div>
          </>
        ),
      },
      {
        title: '描述',
        width: 280,
        dataIndex: 'describe',
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '版本',
        width: 100,
        hideInSearch: true,
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
      {
        title: '名称',
        dataIndex: 'name',
        hideInTable: true,
        renderFormItem: (item, { onChange }) => (
          <AutoComplete onSearch={this.inputValue} spellCheck="false" onChange={onChange}>
            {children}
          </AutoComplete>
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
        className="associatedProcessModel"
      >
        <ProTable
          className="setNoTableToolbar"
          columns={columns}
          rowKey="id"
          options={false}
          search={{ span: 11 }}
          request={params =>
            api
              .getTaskModels(this.getParamData(params))
              .then(res => ({ data: res.rows, total: res.total, success: true }))
          }
          pagination={{
            defaultPageSize: 4,
            showSizeChanger: false,
          }}
        />
      </Modal>
    );
  }
}

export default connect(({ global, processModel }) => ({
  languageCode: global.languageCode,
  processModel,
}))(AssociatedProcessModel);
