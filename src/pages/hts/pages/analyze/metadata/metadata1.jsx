/**
 * 元数据分析
 */
import React, { Component } from 'react';
import {
  Badge
} from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import api from '@/pages/hts/api';
// import { ParamDrawer } from './components/ModelUI';
import './index.less';

class Metadata extends Component {
  tableFormRef = React.createRef();

  state = {
    // pagination: {}, // 分页参数
    // list: [], // 表格数据
    // loading: true, // 加载状态
    // selectedRows: [], // 选中行数据
    // visibleParam: false, // 显示参数抽屉
    // originalParam: [], // 原始参数列表
  };

  // componentDidMount() {
  //   this.getTableData()
  // }

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
    console.log(newObj)
    Object.getOwnPropertyNames(newObj).forEach(key => {
      if (!newObj[key]) {
        delete newObj[key];
      }
    });

    return newObj;
  };

  render() {

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
        render: (value, row) => {
          const name = formatter(status, value);
          const sta = formatter(status, value, 'id', 'status');
          return <Badge status={sta} text={name} key={row.id} />;
        },
      },
      {
        fixed: 'right',
        title: '操作',
        width: 70,
        render: (value, row) => <a onClick={() => this.searchParamDrawer(row)}>参数</a>,
      },
    ];

    columns = columns.map(col => {
      const colWidth = col.width || 100;
      return {
        ...col,
        width: colWidth,
      };
    });

    return (
      <PageHeaderWrapper>
        <ProTable
          actionRef={this.tableFormRef}
          rowKey="id"
          request={params =>
            api.getProcess(this.getParamData(params)).then(res =>
            ({ data: res.rows, total: res.total, success: true }))}
          // request={params => {
          //   console.log(params)
          //   api.metadata.getMetadatas(params).then(res => {
          //     console.log(res)
          //     return ({ data: res.rows, total: res.total, success: true })
          //   })
          // }
          // }
          columns={columns}
          options={false}
          pagination={{
            defaultPageSize: 10,
          }}
        />
        {/* <ParamDrawer
          visible={visibleParam}
          onClose={this.onCloseParamDrawer}
          data={originalParam}
        /> */}
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ htsCache }) => ({
  htsCache,
}))(Metadata);
