/** 流程模型  渲染table页面 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Divider,
  AutoComplete,
  Avatar,
  Tag,
  Badge,
  Select,
  Dropdown,
  Menu,
  Modal,
} from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import router from 'umi/router';
import { connect } from 'dva';
import _ from 'lodash';
import { formatter, getOperates, cutString } from '@/utils/utils';
import api from '@/pages/project/api/processModel/';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import ProTable from '@ant-design/pro-table';
import ProcessDetail from './process-model-detail';
import './index.less';

const { Option } = Select;
class ProcessModel extends Component {
  ref = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      detailValue: {},
      nameCodeVal: [],
      nameCodeValPublish: [],
      processCode: '',
    };
    // 异步验证做节流处理
    this.callParter = _.debounce(this.callParter, 500);
    this.callPublish = _.debounce(this.callPublish, 500);
  }

  /**
   *  搜索流程模型
   *  @param {string} value 需要搜索的值
   */
  callParter = value => {
    api.getProcessCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  /**
   *  搜索发布人
   *  @param {string} value 需要搜索的值
   */
  callPublish = value => {
    api.getProcessPublisherCodeAndName(value).then(res => {
      this.setState({ nameCodeValPublish: res });
    });
  };

  /**
   *  流程模型筛选值
   *  @param {string} value input搜索的值
   */
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

  /**
   *  发布人筛选值
   *  @param {string} value input搜索的值
   */
  inputValuePublish = value => {
    const { nameCodeValPublish } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callPublish(value);
    if (nameCodeValPublish.length === 0) {
      return false;
    }
    nameCodeValPublish.forEach(item => {
      console.log(arr);
      if (item.publisherName.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.publisherCode.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeValPublish: arr,
      // allowClear: 'ture',
    });
    return true;
  };

  /** 关闭详情抽屉 */
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  /** 新建 */
  handleModalVisible = () => {
    router.push('/project/process-model/add');
  };

  /**
   * 升级
   * @param {string} value 传入的id对象
   */
  handleUpgrade = value => {
    router.push(`/project/process-model/up/${value.id}-up`);
    // });
  };

  /**
   * 修改
   * @param {string} value 传入的id对象
   */
  handleChange = value => {
    router.push(`/project/process-model/edit/${value.id}`);
  };

  /**
   * 删除
   * @param {string} value 传入的id对象
   */
  handleDelete = value => {
    api.deleteProcess(value.id).then(() => {
      this.ref.current.reload();
    });
  };

  /**
   * 发布
   * @param {string} value 传入的id对象
   */
  handlePublish = value => {
    api.publishment(value.id).then(() => {
      this.ref.current.reload();
    });
  };

  /**
   * 禁用
   * @param {string} value 传入的id对象
   */
  handleUnPublish = value => {
    api.unPublishment(value.id).then(() => {
      this.ref.current.reload();
    });
  };

  /**
   * 查看详情
   * @param {object} value 传入的详情数据
   * */
  searchDetails = value => {
    this.setState({
      visible: true,
      detailValue: value,
    });
  };

  /**
   * 查看详情
   * @param {string} value 传入的id
   */
  confirm = value => {
    Modal.confirm({
      title: '删除流程模型',
      content: '是否确定删除当前流程模型?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(value),
    });
  };

  /**
   * 获取按钮信息
   * @param {string} item 传入的按钮名称
   * @param {object} row 操作的对象
   */
  getButton = (item, row) => {
    if (item === '查看') {
      return this.searchDetails(row);
    }
    if (item === '修改') {
      return this.handleChange(row);
    }
    if (item === '升级') {
      return this.handleUpgrade(row);
    }
    if (item === '删除') {
      return this.confirm(row);
    }
    if (item === '发布') {
      return this.handlePublish(row);
    }
    if (item === '禁用') {
      return this.handleUnPublish(row);
    }
    return true;
  };

  /**
   * 列表查询数据的处理
   * @param {object} params request返回的数据
   */
  getParamData = params => {
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

  /**
   * 状态的值处理
   */
  statusValue = () => {
    const { status } = this.props;
    // 状态的值
    let statusValue = {};
    status.forEach(item => {
      statusValue = { ...statusValue, [item.value]: { text: item.text, status: item.status } };
    });
    return statusValue;
  };

  /**
   * 设置表格的colums
   */
  columns = () => {
    const { nameCodeVal, nameCodeValPublish } = this.state;
    const { status } = this.props;
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
    const publishChildren = nameCodeValPublish.map(item => (
      <Option key={item.publisherCode} value={item.publisherName}>
        <div
          // style={{ display: 'flex' }}
          onClick={() => {
            this.setState({
              publisherCode: item.publisherCode,
            });
          }}
        >
          <span>{item.publisherName}</span>
        </div>
      </Option>
    ));
    return [
      {
        title: '编号/名称',
        dataIndex: 'code',
        width: 300,
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
              <div>{cutString(row.name, 15)}</div>
              <div style={{ color: '#B9B9B9' }}>{value}</div>
            </div>
          </>
        ),
      },
      {
        title: '流程模型',
        dataIndex: 'name',
        hideInTable: true,
        renderFormItem: (item, { onChange }) => (
          <AutoComplete onSearch={this.inputValue} spellCheck="false" onChange={onChange}>
            {children}
          </AutoComplete>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 400,
        ellipsis: true,
        // render: value => <div title={value}>{cutString(value, 115)}</div>,
        hideInSearch: true,
      },
      {
        title: '发布人/时间',
        dataIndex: 'publisherName',
        width: 200,
        hideInSearch: true,
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
        hideInSearch: true,
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
        valueEnum: this.statusValue(),
        render: value => (
          <Badge
            status={formatter(status, value, 'value', 'status')}
            text={formatter(status, value, 'value', 'text')}
          />
        ),
      },
      {
        title: '发布人',
        dataIndex: 'publisherName',
        width: 200,
        renderFormItem: (item, { onChange }) => (
          <AutoComplete
            onSearch={this.inputValuePublish}
            placeholder="发布人"
            spellCheck="false"
            onChange={onChange}
          >
            {publishChildren}
          </AutoComplete>
        ),
        hideInTable: true,
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.publishDate}</div>
          </>
        ),
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        width: 200,
        hideInTable: true,
        valueType: 'dateRange',
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.publishDate}</div>
          </>
        ),
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (value, row) => {
          const text = row.status;
          const operaList = getOperates(text);
          const menu = (
            <Menu>
              {operaList.map(
                (item, index) =>
                  index && (
                    <Menu.Item key={item}>
                      <a
                        className="process_model_add_argument_list"
                        onClick={() => this.getButton(item, row)}
                      >
                        {item}
                      </a>
                    </Menu.Item>
                  ),
              )}
            </Menu>
          );

          return (
            <>
              <a onClick={() => this.getButton(operaList[0], row)}>{operaList[0]}</a>
              <Divider type="vertical" />
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多
                </a>
              </Dropdown>
            </>
          );
        },
      },
    ];
  };

  render() {
    const { visible, detailValue } = this.state;
    const { status } = this.props;

    return (
      <PageHeaderWrapper>
        <ProTable
          actionRef={this.ref}
          headerTitle={
            <Button type="primary" onClick={() => this.handleModalVisible()}>
              <PlusOutlined />
              新建
            </Button>
          }
          rowKey="id"
          request={params =>
            api
              .getProcess(this.getParamData(params))
              .then(res => ({ data: res.rows, total: res.total, success: true }))
          }
          columns={this.columns()}
          options={false}
          pagination={{
            defaultPageSize: 10,
          }}
        />

        {visible ? (
          <ProcessDetail
            visible={visible}
            // visible
            onClose={this.onClose}
            detailId={detailValue.id}
            status={status}
            handleChangeVersion={v => this.handleChangeVersion(v)}
            handleUnPublish={row => this.handleUnPublish(row)}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, project }) => ({
  languageCode: global.languageCode,
  status: project.status,
}))(ProcessModel);
