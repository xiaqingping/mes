import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Select,
  message,
  Popconfirm
} from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import TableSearchForm from '@/components/TableSearchForm';
import EditableCell from '@/components/EditableCell';
import { formatter } from '@/utils/utils';
import api from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 页面根组件
 */
const SampleType = props => {
  const tableSearchFormRef = React.createRef();
  const [form] = Form.useForm();
  // 表格数据
  const [list, setList] = useState([]);
  // 分页参数
  const [pagination, setPagination] = useState({
    // current: 1,
    // pageSize: 10,
    // total: 0,
  });
  // 编辑行
  const [editIndex, setEditIndex] = useState(-1);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 自减ID（新增数据时，提供负数id做为列表的key）
  const [id, setId] = useState(0);
  // 选中行数据
  const [selectedRows, setSelectedRows] = useState([]);

  const initialValues = {
    status: 1,
    page: 1,
    rows: 10,
  }

  // 顶部表单简单搜索
  const simpleForm = () => (
    <>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="编号" name="code">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="名称" name="name">
          <Input />
        </FormItem>
      </Col>
      <Col lg={6} md={8} sm={12}>
        <FormItem label="状态" name="status">
          <Select allowClear>
            {props.basicStatus.map(e =>
              <Option value={e.id} key={e.id}>{e.name}</Option>,
            )}
          </Select>
        </FormItem>
      </Col>
    </>
  )

  // 获取表格数据
  const getTableData = (options = {}) => {

    setLoading(true);
    const formData = tableSearchFormRef.current.getFieldsValue();
    const { current: page, pageSize: rows } = pagination;
    const data = {
      page,
      rows,
      ...formData,
      ...options,
    }

    api.sampletype.getSampleType(data, true).then(res => {
      setPagination({
        current: data.page,
        pageSize: data.rows,
        total: res.total,
      });
      setList(res.rows);
      setLoading(false);
      setEditIndex(-1)
    });
  }

  // 分页
  const handleStandardTableChange = data => {
    getTableData({
      page: data.current,
      rows: data.pageSize,
    });
  }

  // 选择行
  const handleSelectRows = rows => {
    setSelectedRows(rows);
  };

  // 新增
  const handleAdd = () => {
    if (editIndex !== -1) {
      message.warning('请先保存或退出正在编辑的数据');
      return;
    }

    const newId = id - 1;
    form.resetFields();
    setEditIndex(0);
    setId(newId);
    setList([
      { id: newId },
      ...list
    ]);
  }

  // 退出编辑
  const cancelEdit = (row, index) => {
    if (row.id > 0) {
      setEditIndex(index);
    } else {
      setList(list.filter(e => e.id > 0));
      setEditIndex(index);
    }
  }

  // 删除数据
  const deleteRow = row => {
    api.sampletype.cancelSampleType(row.id).then(() => {
      getTableData();
    });
  }

  // 保存和修改之后的保存
  const saveRow = async index => {
    try {
      const row = await form.validateFields();
      const newData = { ...list[index], ...row };

      if (newData.id < 0) {
        api.sampletype.addSampleType(newData).then(() => getTableData());
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTableData(initialValues)
  }, []);

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  let columns = [
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      editable: true,
      inputType: <Input style={{ width: '90%' }}/>,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: '简写',
      dataIndex: 'alias',
      editable: true,
      inputType: <Input />,
      rules: [
        { required: true, message: '必填' },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => formatter(props.basicStatus, text),
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '作废人',
      dataIndex: 'cancelName',
    },
    {
      title: '作废时间',
      dataIndex: 'cancelDate',
    },
    {
      fixed: 'right',
      title: '操作',
      width: 120,
      render: (value, row, index) => {
        const { status } = row;
        let actions;
        if (editIndex !== index && status === 1) {
          actions = (
            <>
              <Popconfirm title="确定作废数据？" onConfirm={() => deleteRow(row)}>
                <a>删除</a>
              </Popconfirm>
            </>
          );
        }
        if (editIndex === index) {
          actions = (
            <>
              <a onClick={() => saveRow(index)}>保存</a>
              <Divider type="vertical" />
              <a onClick={() => cancelEdit(row, -1)}>退出</a>
            </>
          );
        }
        return actions;
      },
    },
  ];

  columns = columns.map(col => {
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
        title: col.title,
        editing: rowIndex === editIndex,
      }),
    };
  });

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <div className="tableList">
          <TableSearchForm
            ref={tableSearchFormRef}
            initialValues={initialValues}
            getTableData={getTableData}
            simpleForm={simpleForm}
          />
          <div className="tableListOperator">
            <Button type="primary" onClick={() => handleAdd()}>
              新建
            </Button>
          </div>
          <Form form={form}>
            <StandardTable
              rowClassName="editable-row"
              selectedRows={selectedRows}
              components={components}
              loading={loading}
              data={{ list, pagination }}
              columns={columns}
              onSelectRow={handleSelectRows}
              onChange={handleStandardTableChange}
            />
          </Form>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ basicCache }) =>({
  basicStatus: basicCache.basicStatus,
}))(SampleType);
