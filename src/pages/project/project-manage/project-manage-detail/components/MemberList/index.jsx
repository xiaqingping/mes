// 流程列表
import { Form, Table, Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail'

// import StandardTable from '@/components/StandardTable';
// import EditableCell from '@/components/EditableCell';
// import { formatter } from '@/utils/utils';

const { Option } = Select;

class MemberList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  state = {
    // 分页参数
    pagination: {},
    // 表格数据
    list: [],
    // 加载状态
    loading: true,
    // 选中行数据
    // selectedRows: [],
    // 编辑行
    // editIndex: -1,
    // 自减ID（新增数据时，提供负数id做为列表的key）
    // id: 0,
  };

  // 组件挂载时
  componentDidMount() {
    const { projectId } = this.props;
    this.getCacheData();
    this.getTableData(projectId);
  }

  // 获取此页面需要用到的基础数据
  getCacheData = () => {};

  // 获取表格数据
  getTableData = projectId => {
    this.setState({ loading: true });

    console.log(projectId);
    const data = { projectId }
    api.getProjectMember(data).then(res => {
      console.log(res);
      this.setState({
        list: res,
        loading: false,
      });
    })

  };

  render() {
    const {
      pagination,
      // selectedRows,
      list, loading
    } = this.state;
    const { jurisdiction } = this.props.projectDetail;
    let tableWidth = 0;

    // const components = {
    //   body: {
    //     cell: EditableCell,
    //   },
    // };

    let columns = [
      {
        title: '用户名',
        dataIndex: 'creatorName',
        width: 150,
        // render: (value, row) => (
        render: value => (
          <div style={{display:"flex"}}>
            {/* <img
              src={row.path}
              alt=""
              height='30'
              width="30"
              style={{borderRadius: '100%' }}
            /> */}
            <div style={{marginLeft:10}}>
              <p>{value}</p>
            </div>

          </div>
        )
      },
      {
        title: '加入时间',
        dataIndex: 'createDate',
        width: 350,
      },
      {
        title: '权限',
        dataIndex: 'jurisdictionValue',
        width: 150,
        render: value => {
          // formatter(jurisdiction, value);
          if (value === 1) {
            return (
              <Select style={{ width: 100 }} disabled defaultValue={value} bordered={false}>
                {jurisdiction.map(e => (
                  <Option value={e.id} key={e.name}>
                    {e.name}
                  </Option>
                ))}
              </Select>
            )
          }
          return (
            <Select style={{ width: 100 }} defaultValue={value} bordered={false}>
              {jurisdiction.map(e => (
                <Option value={e.id} key={e.name}>
                  {e.name}
                </Option>
              ))}
            </Select>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'jurisdictionValue',
        width: 150,
        render: value => {
          if (value === 2 || value === 3) {
            return <a onClick={() => console.log('退出')}>退出</a>
          }
        }
      },
    ];

    columns = columns.map(col => {
      // if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <>
        <Form ref={this.tableFormRef}>
          <Table
            scroll={{ x: tableWidth, y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            // selectedRows={selectedRows}
            pagination={pagination}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Form>
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(MemberList);
