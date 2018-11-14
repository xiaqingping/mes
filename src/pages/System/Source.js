import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  // Icon,
  Button,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './User.less';

import { getSource } from '@/services/dataauth';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class Order extends PureComponent {
  state = {
    data: [],
    selectedRows: [],
    formValues: {},
    loading: false,
  };

  columns = [
    {
      title: 'client',
      dataIndex: 'client',
    },
    {
      title: 'path',
      dataIndex: 'path',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: 'type',
      dataIndex: 'type',
    },
  ];

  componentDidMount() {
    const params = {
      page: 1,
      rows: 10,
    };
    this.getTableData(params);
  }

  // 获取表格数据
  getTableData = params => {
    this.setState({
      loading: true,
    });
    getSource(params).then(data => {
      this.setState({
        data: data.rows,
        total: data.total,
        loading: false,
      });
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    // const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.getTableData(params);
  };

  // 表单查询
  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      /* eslint-disable */
      for (const key in fieldsValue) {
        if (fieldsValue[key] === '') {
          fieldsValue[key] = undefined;
        }
      }

      const params = {
        page: 1,
        rows: 10,
        ...fieldsValue,
      };

      this.setState({
        formValues: params,
      });

      this.getTableData(params);
    });
  };

  // 渲染查询条件
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex">
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="Client">{getFieldDecorator('client')(<Input />)}</FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <FormItem label="type">
              {getFieldDecorator('type')(
                <Select style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="DELETE">DELETE</Option>
                  <Option value="PUT">PUT</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { selectedRows, data, total, loading } = this.state;

    return (
      <PageHeaderWrapper title="资源">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              size="small"
              rowSelection={{}}
              selectedRows={selectedRows}
              loading={loading}
              rowKey="id"
              dataSource={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
              pagination={{ showSizeChanger: true, showQuickJumper: true, total }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Order;
