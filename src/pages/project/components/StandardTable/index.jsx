import { Table, Pagination } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';

function initTotalList(columns) {
  if (!columns) {
    return [];
  }

  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends Component {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);
    this.state = {
      needTotalList,
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex || 0]), 0),
    }));
    const { onSelectRow } = this.props;

    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({
      needTotalList,
    });
  };

  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  handlePaginationChange = (current, pageSize) => {
    this.handleTableChange({ current, pageSize });
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { data, rowKey, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => {
            const totalPage = Math.ceil(total / (pagination.pageSize || 10));
            const currentPage = Math.ceil(range[0] / (pagination.pageSize || 10));
            return `共 ${total} 条记录 第 ${currentPage}/${totalPage} 页`;
          },
          ...pagination,
        }
      : false;
    return (
      <div className={styles.standardTable}>
        <Table
          size="small"
          rowKey={rowKey || 'id'}
          dataSource={list}
          pagination={false}
          onChange={this.handleTableChange}
          {...rest}
        />
        <Pagination
          className={styles.pagination}
          onChange={this.handlePaginationChange}
          onShowSizeChange={this.handlePaginationChange}
          {...paginationProps}
        />
      </div>
    );
  }
}

export default StandardTable;
