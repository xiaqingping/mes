/**
 * 元数据分析 参数页
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { TableModel } from '../components/AntdUI';
import { FieldDrawer } from '../components/ModelUI';


class paramList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleField: false,  // 序列文件抽屉是否显示
      rowData: [],        // 样品 行数据
      // 样品
      sampleColumns: [
        {
          title: '样品',
          dataIndex: 'name',
          width: 200,
          render: (value, row) => (
            <>
              <div style={{
                background: row.color,
                width: 20, height: 20,
                display: 'inline-block',
                position: 'relative', top: 5, left: 0
                }}
                // className={style.nameColor}
              />
              <span style={{ marginLeft: 10 }}>{value}</span>
            </>
          )
        },
        {
          title: '别名',
          dataIndex: 'otherName',
          width: 200,
        },
        {
          title: '序列',
          dataIndex: 'sequence',
          width: 200,
        },
        {
          title: '长度',
          dataIndex: 'length',
          width: 200,
        },
        {
          title: '文件',
          dataIndex: 'fieldList',
          width: 200,
          render: (value, row) => (
            <a onClick={() => this.searchFieldDrawer(row)}>
              已选{value.length}个
            </a>
          )
        },
      ],
      // 分组方案
      groupColumns: [
        {
          title: '样品',
          dataIndex: 'sampleName',
          width: 200,
        },
        {
          title: '分组方案一',
          dataIndex: 'group1',
          width: 332,
          render: (value, row) => (
            <>
              <span style={{ marginRight: 10 }}>{value}</span>
              <div style={{
                  background: row.groupColor1,
                  width: 20, height: 20,
                  display: 'inline-block',
                  position: 'relative', top: 5, left: 100,
                  float: 'right', marginRight: 160
                }}
              />
            </>
          )
        },
        {
          title: '分组方案二',
          dataIndex: 'group2',
          width: 332,
          render: (value, row) => (
            <>
              <span style={{ marginRight: 10 }}>{value}</span>
              <div style={{
                background: row.groupColor2,
                width: 20, height: 20,
                display: 'inline-block',
                position: 'relative', top: 5, left: 100,
                float: 'right', marginRight: 160
                }}
              />
            </>
          )
        },
        {
          title: '分组方案三',
          dataIndex: 'group3',
          width: 332,
          render: (value, row) => (
            <>
              <span style={{ marginRight: 10 }}>{value}</span>
              <div style={{
                background: row.groupColor3,
                width: 20, height: 20,
                display: 'inline-block',
                position: 'relative', top: 5, left: 100,
                float: 'right', marginRight: 160
                }}
              />
            </>
          )
        },
        {
          title: '分组方案四',
          dataIndex: 'group4',
          width: 332,
          render: (value, row) => (
            <>
              <span style={{ marginRight: 10 }}>{value}</span>
              <div style={{
                background: row.groupColor3,
                width: 20, height: 20,
                display: 'inline-block',
                position: 'relative', top: 5, left: 100,
                float: 'right', marginRight: 160
                }}
              />
            </>
          )
        },
      ],
      // 环境因子表
      environmentalFactorColumns: [
        {
          title: '样品',
          dataIndex: 'sampleName',
          width: 200,
        },
        {
          title: '因子一',
          dataIndex: 'factor1',
          width: 200,
        },
        {
          title: '因子二',
          dataIndex: 'factor2',
          width: 200,
        },
        {
          title: '因子三',
          dataIndex: 'factor3',
          width: 200,
        },
      ],
    }
  }

  // 查看序列文件 抽屉
  searchFieldDrawer = row => {
    this.setState({ visibleField: true, rowData: row });
  }

  // 关闭序列文件抽屉
  onCloseFieldDrawer = () => {
    this.setState({ visibleField: false });
  }

  render() {
    const {
      visibleField,
      rowData,
      sampleColumns,
      groupColumns,
      environmentalFactorColumns,
    } = this.state;
    const { sampleData, groupSchemeData, environmentalFactorData } = this.props.htsCache;
    return (
      <PageHeaderWrapper>
        <TableModel
          title='样品'
          data={sampleData}
          columns={sampleColumns}
          searchFieldDrawer={row => {
            this.searchFieldDrawer(row);
          }}
        />
        <TableModel
          title='分组方案'
          data={groupSchemeData}
          columns={groupColumns}
        />
        <TableModel
          title='环境因子表'
          data={environmentalFactorData}
          columns={environmentalFactorColumns}
        />

        {/* 序列文件抽屉 */}
        <FieldDrawer
          visible={visibleField}
          onClose={this.onCloseFieldDrawer}
          data={rowData.fieldList}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ htsCache }) => ({
  htsCache,
}))(paramList);
