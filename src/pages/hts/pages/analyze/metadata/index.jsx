/**
 * 元数据分析
 */
import React, { Component } from 'react';
import {
  Badge,
  message,
  Select
} from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import api from '@/pages/hts/api';
import router from 'umi/router';
import { formatter } from '@/utils/utils';
import { ParamDrawer } from './components/ModelUI';
import './index.less';

const { Option } = Select

class Metadata extends Component {
  tableFormRef = React.createRef();

  state = {
    visibleParam: false, // 显示参数抽屉
    originalParam: [], // 原始参数列表
  }

  /**
   * 获取列表数据
   * @param {Object} params 回调数据
   */
  getTableData = params => api.metadata.getMetadatas(this.getParamData(params))
    .then(res => ({ data: res.results, total: res.total, success: true }))


  /**
   * 列表查询数据的处理
   * @param {object} params request返回的数据
   */
  getParamData = params => {
    let selectStatus = ''
    if (params.status) selectStatus = params.status.join(',')

    const newObj = {
      page: params.current,
      pageSize: params.pageSize,
      status: selectStatus,
      beginDateBefore: params.beginDate ? params.beginDate[0] : '',
      beginDateAfter: params.beginDate ? params.beginDate[1] : '',
      endDateBefore: params.endDateBefore,
      endDateAfter: params.endDateAfter,
      code: params.code,
      projectCode: params.projectCode,
      taskCode: params.taskCode,
      userCode: params.userCode
    }

    Object.getOwnPropertyNames(newObj).forEach(key => {
      if (!newObj[key]) {
        delete newObj[key]
      }
    })

    return newObj;
  }

  /** 查看参数列表页 */
  searchParamList = data => router.push(`/hts/analyze/metadata/paramList/${data.id}`)

  /** 查看参数 抽屉 */
  searchParamDrawer = data => {
    api.metadata.getMetadataOriginalParam(data.id).then(res => {
      if (res && res.length > 0) {
        this.setState({
          visibleParam: true,
          originalParam: res,
        });
        return false;
      }
      return message.warning('暂无参数！');
    });
  };

  /**
   * 关闭参数抽屉
   */
  onCloseParamDrawer = () => {
    this.setState({ visibleParam: false });
  }

  /**
   * 设置状态颜色
   * @param {String} value 状态
   */
  setColor = value => {
    const reColor = {
      '进行中': '#1890ff',
      '已失败': '#ff4d4f',
      '已完成': '#52c41a'
    }
    return value ? reColor[value] : '#eee'
  }

  /**
   * 设置table数据格式
   */
  setcolumns = () => {
    const { status } = this.props.htsCache;
    let columns = [
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
        width: 120,
        render: (value, row) => <a onClick={() => this.searchParamList(row)}>{value}</a>,
      },
      {
        title: '项目编号',
        dataIndex: 'projectCode',
        key: 'projectCode',
      },
      {
        title: '任务编号',
        dataIndex: 'taskCode',
        key: 'taskCode',
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '开始/结束时间',
        dataIndex: 'beginDate',
        key: 'beginDate',
        valueType: 'dateRange',
        render: (text, row) => (
          <>
            {row.beginDate}
            <br />
            {row.endDate}
          </>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        renderFormItem: (items, { onChange }) => {
          const { status: statusType } = this.props.htsCache
          return (
            <Select
              mode="multiple"
              maxTagCount={2}
              maxTagTextLength={3}
              onChange={onChange}
              className='setSelectMultipleType'
              allowClear
            >
              {
                statusType.map(item =>
                  <Option key={item.id} value={item.id}>{item.name}</Option>)
              }
            </Select>
          )
        },
        render: (value, row) => {
          const name = formatter(status, value);
          const sta = formatter(status, value, 'id', 'status');
          return <Badge color={this.setColor(name)} status={sta} text={name} key={row.id} />;
        },
      },
      {
        fixed: 'right',
        title: '操作',
        width: 70,
        render: (value, row) => <a onClick={() => this.searchParamDrawer(row)}>参数</a>,
      },
    ]

    columns = columns.map(col => {
      const colWidth = col.width || 100;
      return {
        ...col,
        width: colWidth,
      };
    })

    return columns
  }

  render() {
    const { visibleParam, originalParam } = this.state;
    return (
      <PageHeaderWrapper>
        <ProTable
          className="setNoTableToolbar"
          actionRef={this.tableFormRef}
          rowKey="id"
          request={parmas => this.getTableData(parmas)}
          columns={this.setcolumns()}
          options={false}
          pagination={{
            defaultPageSize: 10,
          }}
        />
        <ParamDrawer
          visible={visibleParam}
          onClose={this.onCloseParamDrawer}
          data={originalParam}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ htsCache }) => ({
  htsCache,
}))(Metadata);
