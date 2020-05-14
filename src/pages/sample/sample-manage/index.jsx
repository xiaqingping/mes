/** 样品table页面 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, AutoComplete, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import _ from 'lodash';
import api from '@/pages/sample/api/sample';
import ProTable from '@ant-design/pro-table';
import UploadSequenceFile from '../UploadSequenceFile';
import SampleDetail from '../sample-detail';
import './index.less';

const { Option } = Select;
class SampleModel extends Component {
  tableSearchFormRef = React.createRef();

  // 顶部表单默认值
  initialValues = {
    page: 1,
    rows: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      detailValue: {},
      nameCodeVal: [],
      sampleCode: '',
      detailVisible: false,
    };
    // 异步验证做节流处理
    this.callSample = _.debounce(this.callSample, 500);
  }

  /** 加载table */
  componentDidMount() {
    this.getSampleData(this.initialValues);
  }

  /**
   * 搜索样品
   * @param {string} value 搜索的值
   */
  callSample = value => {
    api.getSampleCodeAndName(value).then(res => {
      this.setState({ nameCodeVal: res });
    });
  };

  /**
   *  获取表格数据
   *  @param {object} options 需要搜索的值(如page,rows)
   */
  getSampleData = params => {
    const { sampleCode } = this.state;

    const newObj = {
      page: params ? params.current : 1,
      rows: params ? params.pageSize : 10,
      sampleCode: params && params.sampleCode ? sampleCode : '',
    };
    Object.getOwnPropertyNames(newObj).forEach(key => {
      if (!newObj[key]) {
        delete newObj[key];
      }
    });

    return newObj;
  };

  /**
   *  样品筛选值
   *  @param {string} value input搜索的值
   */
  inputValue = value => {
    const { nameCodeVal } = this.state;
    const arr = [];
    if (!value) {
      return false;
    }
    this.callSample(value);
    if (nameCodeVal.length === 0) {
      return false;
    }

    nameCodeVal.forEach(item => {
      if (item.sampleName.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
      if (item.sampleCode.indexOf(value) !== -1 && arr.indexOf(item) !== -1) {
        arr.push(item);
      }
    });
    this.setState({
      nameCodeVal: arr,
    });
    return true;
  };

  /** 打开上传序列文件弹框 */
  handleModalVisible = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 子页面关闭
   * @param {string} status 传入的状态
   */
  handleClose = status => {
    this.setState({
      visible: false,
    });
    if (status) {
      this.getSampleData();
    }
  };

  /** 关闭详情 */
  handleDetailClose = () => {
    this.setState({
      detailVisible: false,
    });
  };

  /**
   * 查看详情
   * @param {object} value 传入的详情数据
   * */
  searchDetails = value => {
    this.setState({
      detailVisible: true,
      detailValue: value,
    });
  };

  columns = () => {
    const { nameCodeVal } = this.state;
    const children = nameCodeVal.map(item => (
      <Option key={item.sampleCode} value={item.sampleName}>
        <div
          onClick={() => {
            this.setState({
              sampleCode: item.sampleCode,
            });
          }}
        >
          {item.sampleCode} {item.sampleName}
        </div>
      </Option>
    ));
    return [
      {
        title: '编号/名称',
        dataIndex: 'sampleCode',
        width: 300,
        renderFormItem: (item, { onChange }) => (
          <AutoComplete onSearch={this.inputValue} spellCheck="false" onChange={onChange}>
            {children}
          </AutoComplete>
        ),
      },
      {
        title: '创建人/时间',
        dataIndex: 'creatorName',
        width: 400,
        hideInSearch: true,
        render: (value, row) => (
          <>
            <div style={{ float: 'left' }}>
              <div>{value}</div>
              <div>{new Date(row.createDate).toLocaleDateString()}</div>
            </div>
          </>
        ),
      },
      {
        title: '样品识别号',
        dataIndex: 'sampleIdentificationCode',
        width: 200,
        hideInSearch: true,
      },
      {
        title: '序列',
        dataIndex: 'sampleSequenceCount',
        width: 200,
        hideInSearch: true,
        render: (value, row) => `${value} (${row.sampleLengthTotal}bp)`,
      },
      {
        title: '长度',
        dataIndex: 'sampleLengthMin',
        width: 300,
        hideInSearch: true,
        render: (value, row) => `${value}-${row.sampleLengthMax} (${row.sampleLengthAve})`,
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (value, row) => (
          <a
            onClick={() => {
              this.searchDetails(row);
            }}
          >
            序列文件
          </a>
        ),
      },
    ];
  };

  render() {
    const { visible, detailVisible, detailValue } = this.state;

    return (
      <PageHeaderWrapper>
        <ProTable
          actionRef={this.tableSearchFormRef}
          headerTitle={
            <Button type="primary" onClick={() => this.handleModalVisible()}>
              <UploadOutlined />
              上传序列文件
            </Button>
          }
          rowKey="id"
          request={params =>
            api
              .getSample(this.getSampleData(params))
              .then(res => ({ data: res.rows, total: res.total, success: true }))
          }
          columns={this.columns()}
          options={false}
          pagination={{
            defaultPageSize: 10,
          }}
        />
        {visible ? <UploadSequenceFile visible={visible} handleClose={this.handleClose} /> : ''}
        {detailVisible ? (
          <SampleDetail
            visible={detailVisible}
            detailValue={detailValue}
            handleClose={v => this.handleDetailClose(v)}
          />
        ) : (
          ''
        )}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, sample }) => ({
  languageCode: global.languageCode,
  status: sample.status,
}))(SampleModel);
