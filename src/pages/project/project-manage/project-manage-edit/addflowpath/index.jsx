// 项目管理：新建项目：添加流程
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  // Input,
  Card,
  Form,
  Divider,
  Tag,
  // Button,
  // Avatar,
  Badge,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import router from 'umi/router';
// import TableSearchForm from '@/components/TableSearchForm';
import { connect } from 'dva';
import StandardTable from '@/components/StandardTable';
import { formatter } from '@/utils/utils';
// import { expandedRowRender } from '../functions';

// const FormItem = Form.Item;

class Test extends Component {
  tableSearchFormRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // pagination: {},
      // loading: false,
    };
    // 异步验证做节流处理
    // this.callParter = _.debounce(this.callParter, 500);
  }

  // 跳转到新建项目页面
  handleAdd = () => {
    // router.push('/project/project-manage/add');
    console.log('跳转到新建项目页面');
  };

  // 获取表格数据
  getTableData = (options = {}) => {
    const data = this.props.project.projectManage;
    this.setState({
      list: data,
      pagination: {
        current: options.page,
        pageSize: options.rows,
        total: data.total,
      },
      loading: false,
    });
    // console.log(this.props.project.projectManage);
  };

  // 分页
  handleStandardTableChange = (pagination, filters) => {
    // 获取搜索值
    console.log(filters);
    // this.getTableData({
    //   page: pagination.current,
    //   rows: pagination.pageSize,
    // });
  };

  render() {
    const { status } = this.props;
    const { pagination, list, loading } = this.state;

    let tableWidth = 0;
    let columns = [
      {
        title: '编号/名称',
        dataIndex: 'code',
        // render: (value, row) => (
        //   <>
        //     <Avatar
        //       src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        //       style={{ float: 'left' }}
        //       size="large"
        //     />
        //     <div style={{ float: 'left' }}>
        //       <div>12312312333</div>
        //       <div>肠道菌群宏</div>
        //     </div>
        //   </>
        // ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
      },
      {
        title: '发布人/时间',
        dataIndex: 'publishName',
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
        render: () => (
          <Tag color="green" style={{ padding: '0 10px' }}>
            V1.0
          </Tag>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: status,
        render: value => (
          <Badge
            status={formatter(status, value, 'value', 'status')}
            text={formatter(status, value, 'value', 'text')}
          />
        ),
      },
      {
        title: '操作',
        width: 200,
        render: value => (
          <>
            <a onClick={() => console.log(111)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.upgrade(value)}>修改</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className="tableList">
            <Form ref={this.tableFormRef}>
              <StandardTable
                scroll={{ x: tableWidth }}
                rowClassName="editable-row"
                selectedRows=""
                loading={loading}
                data={{ list, pagination }}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </Form>
          </div>
          <div className="add">
            <PlusOutlined />
            新建
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global }) => ({
  languageCode: global.languageCode,
}))(Test);
