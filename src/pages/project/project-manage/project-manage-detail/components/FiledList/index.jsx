/** 项目 文件列表 */
import { Form, Table, Col, Input, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import TableSearchForm from '@/components/TableSearchForm';
// import ProTable from '@ant-design/pro-table';
import excel from '@/assets/imgs/excel.png';
import pdf from '@/assets/imgs/pdf.png';
import file from '@/assets/imgs/file.png';
import word from '@/assets/imgs/word.png';

const FormItem = Form.Item;
const { Search } = Input;

class FiledList extends Component {
  tableSearchFormRef = React.createRef();

  tableFormRef = React.createRef();

  ref = React.createRef();

  state = {
    list: [], // 表格数据
    loading: true, // 加载状态
    // pagination: {},
  };

  // 顶部表单默认值
  initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  };

  /** 组件挂载时 */
  componentDidMount() {
    this.getCacheData();
    this.getTableData(this.initialValues);
  }

  /** 获取此页面需要用到的基础数据 */
  getCacheData = () => {};

  /** 获取表格数据 */
  getTableData = () => {
    const data = this.props.projectDetail.filedList;
    this.setState({
      list: data,
      loading: false,
    });
  };

  /** 顶部表单简单搜索 */
  simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="" name="fieldName">
          <Search />
        </FormItem>
      </Col>
      <Col className="classdownBtn" lg={6} md={8} sm={12}>
        <FormItem label="" name="">
          <Button>下载</Button>
        </FormItem>
      </Col>
    </>
  );

  /**
   * 设置img icon类型
   * @param {string} type 文件类型
   */
  imgtype = type => {
    let res = word;
    if (type === 'excel') {
      res = excel;
    } else if (type === 'word') {
      res = word;
    } else if (type === 'pdf') {
      res = pdf;
    } else {
      res = file;
    }
    return res;
  };

  /**
   * 设置表格的colums
   */
  // columns = () => {
  //   return [
  //     {
  //       title: '文件名称',
  //       dataIndex: 'name',
  //       width: 150,
  //       hideInSearch: true,
  //       render: (value, item) => (
  //         <>
  //           <img src={this.imgtype(item.type)} alt="" />
  //           <span style={{ marginLeft: 10 }}>{value}</span>
  //         </>
  //       ),
  //     },
  //     {
  //       title: '描述',
  //       dataIndex: 'decs',
  //       hideInSearch: true,
  //       width: 350,
  //     },
  //     {
  //       title: '来源',
  //       dataIndex: 'processName',
  //       hideInSearch: true,
  //       width: 150,
  //     },
  //     {
  //       title: '修改时间',
  //       dataIndex: 'changerTime',
  //       hideInSearch: true,
  //       width: 150,
  //     },
  //     {
  //       title: '大小',
  //       dataIndex: 'size',
  //       hideInSearch: true,
  //       width: 100,
  //       render: text => `${text}kb`,
  //     },
  //     {
  //       title: '',
  //       dataIndex: 'fieldName',
  //       hideInTable: true,
  //       width: 100,
  //       renderFormItem: (item, index) => <Input key={index} />,
  //     },
  //     {
  //       title: '操作',
  //       width: 150,
  //       hideInSearch: true,
  //       render: () => <a onClick={() => console.log('删除')}>删除</a>,
  //     },
  //   ];
  // };

  render() {
    const { list, loading } = this.state;
    // let tableWidth = 0;
    let columns = [
      {
        title: '文件名称',
        dataIndex: 'name',
        width: 150,
        render: (value, item) => (
          <>
            <img src={this.imgtype(item.type)} alt="" />
            <span style={{ marginLeft: 10 }}>{value}</span>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'decs',
        width: 350,
      },
      {
        title: '来源',
        dataIndex: 'processName',
        width: 150,
      },
      {
        title: '修改时间',
        dataIndex: 'changerTime',
        width: 150,
      },
      {
        title: '大小',
        dataIndex: 'size',
        width: 100,
        render: text => `${text}kb`,
      },
      {
        title: '操作',
        width: 150,
        render: () => (
          <>
            <a onClick={() => console.log('删除')}>删除</a>
          </>
        ),
      },
    ];

    columns = columns.map(col => {
      // if (!col.width) col.width = 100;

      // tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, rowIndex) => ({
          record,
          rules: col.rules,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          // title: [col.title, col.type],
          title: col.title,
          editing: rowIndex === this.state.editIndex,
        }),
      };
    });

    return (
      <>
        {/* <ProTable
          actionRef={this.ref}
          headerTitle=""
          rowKey="id"
          dataSource={list}
          columns={this.columns()}
          options={false}
          pagination={{
            defaultPageSize: 10,
          }}
        /> */}
        <div className="classTableSearchForm">
          <TableSearchForm
            ref={this.tableSearchFormRef}
            initialValues={this.initialValues}
            getTableData={this.getTableData}
            simpleForm={this.simpleForm}
          />
        </div>
        <Form ref={this.tableFormRef}>
          <Table
            // scroll={{ x: tableWidth, y: 400 }}
            rowKey="id"
            loading={loading}
            dataSource={list}
            rowSelection="checkbox"
            pagination={false}
            columns={columns}
          />
        </Form>
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(FiledList);
