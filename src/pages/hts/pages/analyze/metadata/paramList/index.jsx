/**
 * 元数据分析 参数页
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import api from '@/pages/hts/api';
import { TableModel } from '../components/AntdUI';
import { FieldDrawer } from '../components/ModelUI';
import { message } from 'antd';


class paramList extends Component {
  constructor(props) {
    super(props);
    // const { metadataRow } = this.props.htsCache;
    this.state = {
      // metadataRow,
      // loading: false,
      visibleField: false,  // 序列文件抽屉是否显示
      rowData: [],        // 样品 行数据
      sampleData: [],     // 样品数据
      // groupSchemeData: [], // 分组方案数据
      // environmentalFactorData: [], // 环境因子数据
      // 样品
      sampleColumns: [
        {
          title: '样品',
          dataIndex: 'sampleName',
          key: 'sampleName',
          width: 200,
          render: (value, row) => (
            <>
              <div style={{
                background: row.colour,
                width: 20, height: 20,
                display: 'inline-block',
                position: 'relative', top: 5, left: 0
                }}
              />
              <span style={{ marginLeft: 10 }}>{value}</span>
            </>
          )
        },
        {
          title: '别名',
          dataIndex: 'sampleAlias',
          key: 'sampleAlias',
          width: 200,
        },
        {
          title: '序列',
          dataIndex: 'sampleSequenceCount',
          key: 'sampleSequenceCount',
          width: 200,
          render: (value, row) => (
            <>
              {value} ({row.sampleLengthTotal}bp)
            </>
          )
        },
        {
          title: '长度',
          dataIndex: 'sampleLengthAve',
          key: 'sampleLengthAve',
          width: 200,
          render: (value, row) => (
            <>
              {row.sampleLengthMin} - {row.sampleLengthMax} (avg {value})
            </>
          )
        },
        {
          title: '文件',
          dataIndex: 'sequenceFileCount',
          key: 'sequenceFileCount',
          width: 200,
          render: (value, row) => (
            <a onClick={() => this.searchFieldDrawer(row)}>
              已选{value}个
            </a>
          )
        },
      ],
      // 分组方案
      // groupColumns: [
      //   {
      //     title: '样品',
      //     dataIndex: 'sampleName',
      //     width: 200,
      //   },
      //   {
      //     title: '分组方案一',
      //     dataIndex: 'group1',
      //     width: 332,
      //     render: (value, row) => (
      //       <>
      //         <span style={{ marginRight: 10 }}>{value}</span>
      //         <div style={{
      //             background: row.groupColor1,
      //             width: 20, height: 20,
      //             display: 'inline-block',
      //             position: 'relative', top: 5, left: 100,
      //             float: 'right', marginRight: 160
      //           }}
      //         />
      //       </>
      //     )
      //   },
      //   {
      //     title: '分组方案二',
      //     dataIndex: 'group2',
      //     width: 332,
      //     render: (value, row) => (
      //       <>
      //         <span style={{ marginRight: 10 }}>{value}</span>
      //         <div style={{
      //           background: row.groupColor2,
      //           width: 20, height: 20,
      //           display: 'inline-block',
      //           position: 'relative', top: 5, left: 100,
      //           float: 'right', marginRight: 160
      //           }}
      //         />
      //       </>
      //     )
      //   },
      //   {
      //     title: '分组方案三',
      //     dataIndex: 'group3',
      //     width: 332,
      //     render: (value, row) => (
      //       <>
      //         <span style={{ marginRight: 10 }}>{value}</span>
      //         <div style={{
      //           background: row.groupColor3,
      //           width: 20, height: 20,
      //           display: 'inline-block',
      //           position: 'relative', top: 5, left: 100,
      //           float: 'right', marginRight: 160
      //           }}
      //         />
      //       </>
      //     )
      //   },
      //   {
      //     title: '分组方案四',
      //     dataIndex: 'group4',
      //     width: 332,
      //     render: (value, row) => (
      //       <>
      //         <span style={{ marginRight: 10 }}>{value}</span>
      //         <div style={{
      //           background: row.groupColor3,
      //           width: 20, height: 20,
      //           display: 'inline-block',
      //           position: 'relative', top: 5, left: 100,
      //           float: 'right', marginRight: 160
      //           }}
      //         />
      //       </>
      //     )
      //   },
      // ],
      // 环境因子表
      // environmentalFactorColumns: [
      //   {
      //     title: '样品',
      //     dataIndex: 'sampleName',
      //     width: 200,
      //   },
      //   {
      //     title: '因子一',
      //     dataIndex: 'factor1',
      //     width: 200,
      //   },
      //   {
      //     title: '因子二',
      //     dataIndex: 'factor2',
      //     width: 200,
      //   },
      //   {
      //     title: '因子三',
      //     dataIndex: 'factor3',
      //     width: 200,
      //   },
      // ],
      groupColumns: [
        {
          id: 1,
          title: '样品',
          dataIndex: 'sample',
          key: 'sample',
        },
      ]
    }
  }

  componentDidMount() {
    this.getTableData();
  }

  // 获取表格数据
  getTableData = () => {
    // this.setState({ loading: true });
    // const { metadataRow } = this.state;

    const id = 'b6be405791024f1d871f6f21f495f025';

    api.metadata.getMetadataAnalysisParam(id).then(res => {
      console.log(res);
      if (
        res &&
        res.sampleList !== undefined &&
        res.groupSchemeList !== undefined &&
        res.environmentFactorList !== undefined)
      {
        // 转换分组方案数据
        this.transformGroup(res.groupSchemeList);
        this.setState({
          sampleData: res.sampleList,
          // groupSchemeData: res.groupSchemeList,
          // environmentalFactorData: res.environmentFactorList,
        });
        return false;
      }
      return message.warning('暂无样品数据');
    });
  };

  // 转换分组方案数据
  transformGroup = data => {
    console.log(data);
    const { groupColumns, sampleData } = this.state;
    // console.log(sampleData);

    // 取出表头
    const newGroupColumns = this.getTableHeaderData(data, groupColumns);
    // console.log(newGroupColumns)

    this.getSampleData(data, sampleData);

    // 取出数据
    // data.forEach(groupItem => {
    //   console.log(groupItem)

    //   // 取出全部样品
    //   const sampleList = [];
    //   // 分组方案下的 样品列表 为空
    //   if (groupItem.sampleList === null) {
    //     groupItem.groupList.forEach(groItem => {
    //       groItem.sampleList.forEach(samItem => {
    //         sampleList.push(samItem);
    //       })
    //     })
    //   }
    //   // 分组方案下的 分组列表 为空
    //   if (groupItem.groupList === null) {
    //     groupItem.sampleList.forEach(samItem => {
    //       sampleList.push(samItem);
    //     })
    //   }
    //   console.log(sampleList);



    // })

    // 保存 分组 表头数据
    this.setState({
      groupColumns: newGroupColumns
    })
  }

  // 查看序列文件 抽屉
  searchFieldDrawer = row => {
    this.setState({ visibleField: true, rowData: row.sequenceFileList });
  }

  // 关闭序列文件抽屉
  onCloseFieldDrawer = () => {
    this.setState({ visibleField: false });
  }

  /**
   * 取出分组方案的全部样品 并进行排序
   *
   */
  getSampleData = (groupList, sampleList) => {
    console.log(groupList);
    // const newSample = [];
    const samples = [];
    groupList.forEach(groupItem => {
      console.log(groupItem)

      // 取出全部样品

      // 分组方案下的 样品列表 为空
      if (groupItem.sampleList === null) {
        groupItem.groupList.forEach(groItem => {
          groItem.sampleList.forEach(samItem => {
            console.log(samItem);
            samples.push(samItem);
          })
        })
      }
      // 分组方案下的 分组列表 为空
      if (groupItem.groupList === null) {
        groupItem.sampleList.forEach(samItem => {
          console.log(samItem);
          samples.push(samItem);
        })
      }
    })

    // 去重
    const newSample = [];
    samples.forEach(samItem => {
      if (newSample.length === 0) {
        console.log(1111);
        newSample.push(samItem);
      } else {
        newSample.forEach(item => {
          console.log(2222);
          if (item.metadataSampleId === samItem.metadataSampleId) return false;
          newSample.push(samItem);
          return false;
        })
      }
    })
    console.log(newSample);
  }

  /**
   * 获取表头
   * data 数据列表
   * columns 初始列
   */
  getTableHeaderData = (data, columns) => {
    const newColumns = JSON.parse(JSON.stringify(columns));

    data.forEach(groupItem => {
      // 获取当前id最大值
      const ids = [];
      newColumns.forEach(cItem => {
        ids.push(cItem.id);
      })
      const max = Math.max.apply(null,ids);

      // 取出表头数据
      const newCol = {
        id: max + 1,
        title: groupItem.groupSchemeName,
        dataIndex: `hearder_${max+1}`,
        key: `hearder_${max+1}`,
      }
      newColumns.push(newCol);
    })
    return newColumns;
  }

  render() {
    const {
      visibleField,
      rowData,
      sampleColumns,
      // groupColumns,
      // environmentalFactorColumns,
      sampleData,
      // groupSchemeData,
      // environmentalFactorData
    } = this.state;
    // const {
    //   // sampleData,
    //   // groupSchemeData,
    //   // environmentalFactorData
    // } = this.props.htsCache;
    return (
      <PageHeaderWrapper>
        <TableModel
          title='样品'
          rowKey='id'
          data={sampleData}
          columns={sampleColumns}
          searchFieldDrawer={row => {
            this.searchFieldDrawer(row);
          }}
        />
        {/* <TableModel
          title='分组方案'
          data={groupSchemeData}
          columns={groupColumns}
        /> */}
        {/* <TableModel
          title='环境因子表'
          data={environmentalFactorData}
          columns={environmentalFactorColumns}
        /> */}

        {/* 序列文件抽屉 */}
        <FieldDrawer
          visible={visibleField}
          onClose={this.onCloseFieldDrawer}
          data={rowData}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ htsCache }) => ({
  htsCache,
}))(paramList);
