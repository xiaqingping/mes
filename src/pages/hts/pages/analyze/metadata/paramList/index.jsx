/**
 * 元数据分析 参数页
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import api from '@/pages/hts/api';
import { message } from 'antd';
import { TableModel } from '../components/AntdUI';
import { FieldDrawer } from '../components/ModelUI';

class paramList extends Component {
  constructor(props) {
    super(props);
    const { metadataRow } = this.props.htsCache;
    // console.log(metadataRow);
    this.state = {
      metadataRow,
      loading: false,
      visibleField: false, // 序列文件抽屉是否显示
      rowData: [], // 样品 行数据
      sampleData: [], // 样品数据
      groupSchemeData: [], // 分组方案数据
      environmentalFactorData: [], // 环境因子数据
      // 样品
      sampleColumns: [
        {
          title: '样品',
          dataIndex: 'sampleName',
          key: 'sampleName',
          width: 120,
          render: (value, row) => (
            <>
              <div
                style={{
                  background: row.color,
                  width: 20,
                  height: 20,
                  display: 'inline-block',
                  position: 'relative',
                  top: 5,
                  left: 0,
                }}
              />
              <span style={{ marginLeft: 10 }}>{value}</span>
            </>
          ),
        },
        {
          title: '别名',
          dataIndex: 'sampleAlias',
          key: 'sampleAlias',
          width: 100,
        },
        {
          title: '序列',
          dataIndex: 'sampleSequenceCount',
          key: 'sampleSequenceCount',
          width: 120,
          render: (value, row) => (
            <>
              {value} ({row.sampleLengthTotal}bp)
            </>
          ),
        },
        {
          title: '长度',
          dataIndex: 'sampleLengthAve',
          key: 'sampleLengthAve',
          width: 120,
          render: (value, row) => (
            <>
              {row.sampleLengthMin} - {row.sampleLengthMax} (avg {value})
            </>
          ),
        },
        {
          title: '文件',
          dataIndex: 'sequenceFileCount',
          key: 'sequenceFileCount',
          width: 60,
          render: (value, row) => <a onClick={() => this.searchFieldDrawer(row)}>已选{value}个</a>,
        },
      ],
      // 分组方案
      groupColumns: [
        {
          id: 1,
          title: '样品',
          dataIndex: 'sampleName',
          key: 'sampleName',
          width: 120,
        },
      ],
      // 环境因子表
      environmentalFactorColumns: [
        {
          id: 1,
          title: '样品',
          dataIndex: 'sampleName',
          key: 'sampleName',
          width: 120,
        },
      ],
    };
  }

  componentDidMount() {
    // console.log(this.props);
    const { metadataRow } = this.props.htsCache;
    if (metadataRow.length === 0) {
      message.warning('暂无数据');
      return false;
    }
    this.getTableData();
    return false;
  }

  /** 获取表格数据 */

  getTableData = () => {
    this.setState({ loading: true });
    const { metadataRow } = this.state;

    api.metadata.getMetadataAnalysisParam(metadataRow.id).then(res => {
      // console.log(res);
      if (
        res &&
        res.samples !== undefined &&
        res.groupSchemes !== undefined &&
        res.environmentFactors !== undefined
      ) {
        this.setState({
          sampleData: res.samples,
          groupSchemeData: res.groupSchemes,
          environmentalFactorData: res.environmentFactors,
        });
        // 转换分组方案数据
        this.transformGroup(res);
        // 转换环境因子数据
        this.transformEnvironmentFactor(res);
        this.setState({ loading: false });
        return false;
      }
      return message.warning('暂无样品数据');
    });
    this.setState({ loading: false });
  };

  /**
   * 转换环境因子数据
   * @param {Array} data 环境因子数据
   */
  transformEnvironmentFactor = data => {
    const { environmentalFactorColumns } = this.state;
    const { environmentFactors, samples } = data;

    const list = environmentFactors;
    const columns = environmentalFactorColumns;
    const titleName = 'environmentFactorName';

    // 取出 表头
    const newColumns = this.getTableHeaderData(list, columns, titleName);

    // 取出 行数据
    const rowData = this.getRowDataEnvironment(list, samples, newColumns);

    // 填充行数据
    const newData = this.getFillDataEnvironment(list, rowData);

    // 保存 分组 表头数据
    this.setState({
      environmentalFactorColumns: newColumns,
      environmentalFactorData: newData,
    });
  };

  /**
   * 转换分组方案数据
   * @param {Array} data 分组方案数据
   */
  transformGroup = data => {
    const { groupColumns } = this.state;
    const { groupSchemes, samples } = data;

    const list = groupSchemes;
    const columns = groupColumns;
    const titleName = 'groupSchemeName';

    // 取出 表头
    const newColumns = this.getTableHeaderData(list, columns, titleName);
    // 取出 行数据
    const rowData = this.getRowDataGroup(list, samples, newColumns);
    // 填充行数据
    const newData = this.getFillData(list, rowData, newColumns);

    // 保存 分组 表头数据
    this.setState({
      groupColumns: newColumns,
      groupSchemeData: newData,
    });
  };

  //
  /**
   * 查看序列文件 抽屉
   * @param {Array} row 行数据
   */
  searchFieldDrawer = row => {
    this.setState({ visibleField: true, rowData: row.sampleProperties });
  };

  /** 关闭序列文件抽屉 */
  onCloseFieldDrawer = () => {
    this.setState({ visibleField: false });
  };

  /**
   * 获取表头
   * @param {Array} data 数据列表
   * @param {Object} columns 初始列
   */
  getTableHeaderData = (data, columns, titleName) => {
    const newColumns = JSON.parse(JSON.stringify(columns));

    data.forEach(item => {
      // 获取当前id最大值
      const ids = [];
      newColumns.forEach(cItem => {
        ids.push(cItem.id);
      });
      const max = Math.max.apply(null, ids);

      // 取出表头数据
      const newCol = {
        id: max + 1,
        title: item[titleName],
        dataIndex: `hearder_${max + 1}`,
        key: `hearder_${max + 1}`,
        render: (value, row) => {
          const color = `color_${max + 1}`;
          return (
            <>
              <span style={{ marginRight: 10 }}>
                {value}
                <div
                  style={{
                    background: row[color],
                    width: 20,
                    height: 20,
                    display: 'inline-block',
                    position: 'absolute',
                    top: 17,
                    left: 100,
                    float: 'right',
                    marginRight: 160,
                  }}
                />
              </span>
            </>
          );
        },
      };
      newColumns.push(newCol);
    });
    return newColumns;
  };

  /**
   * 获取行数据 分组方案
   * @param {Array} groupList 分组方案数据
   * @param {Array} sampleList 样品列表数据
   * @param {Object} groupColumns 分组方案初始列
   */
  getRowDataGroup = (groupList, sampleList, groupColumns) => {
    // 取出全部样品
    const samples = [];
    groupList.forEach(groupItem => {
      // 分组方案下的 样品列表 为空
      if (groupItem.samples === null) {
        groupItem.groups.forEach(groItem => {
          groItem.samples.forEach(samItem => {
            samples.push(samItem);
          });
        });
      }
      // 分组方案下的 分组列表 为空
      if (groupItem.groups === null) {
        groupItem.samples.forEach(samItem => {
          samples.push(samItem);
        });
      }
    });

    // 样品去重 排序
    const newData = this.sampleRemoveDuplication(samples, sampleList, groupColumns);

    return newData;
  };

  /**
   * 获取行数据 环境因子
   * @param {Array} list 环境因子数据
   * @param {Array} sampleList 样品列表数据
   * @param {Object} columns 环境因子初始列
   */
  getRowDataEnvironment = (list, sampleList, columns) => {
    const samples = [];
    // 环境因子数据遍历
    list.forEach(item => {
      // 环境因子列表遍历
      item.environmentFactorValues.forEach(it => {
        // 样品列表遍历
        it.samples.forEach(t => {
          samples.push(t);
        });
      });
    });

    // 样品去重 排序
    const newData = this.sampleRemoveDuplication(samples, sampleList, columns);
    return newData;
  };

  /**
   * 填充行数据
   * @param {Array} groupList  分组方案数据
   * @param {Array} rowData 行数据 有表头字段但数据为空
   * @param {Object} columns 表头数据
   */
  getFillData = (groupList, rowData, columns) => {
    // 分组方案遍历
    groupList.forEach(groupItem => {
      const { groupSchemeName } = groupItem;

      // 行数据遍历
      rowData.forEach(rowItems => {
        const rowItem = rowItems;
        // 分组方案下的 分组列表不为空
        if (groupItem.groups !== null && groupItem.groups.length !== 0) {
          // 分组列表遍历
          groupItem.groups.forEach(groItem => {
            // 分组下的样品列表遍历
            groItem.samples.forEach(samItem => {
              // 找到对应的样品行
              if (rowItem.metadataSampleId === samItem.metadataSampleId) {
                Object.keys(rowItem).map(key => {
                  if (rowItem[key] === groupSchemeName) {
                    const num = key.split('_')[1];
                    const color = `color_${num}`;
                    rowItem[color] = groItem.color;
                    rowItem[key] = groItem.groupName;
                  }
                  return false;
                });
              }
            });
          });
        }

        // 分组方案下的 样品列表不为空
        if (groupItem.samples !== null && groupItem.samples.length !== 0) {
          groupItem.samples.forEach(samItem => {
            if (rowItem.metadataSampleId === samItem.metadataSampleId) {
              Object.keys(rowItem).map(key => {
                const num = key.split('_')[1];
                let color;
                if (num !== undefined) color = `color_${num}`;
                rowItem[color] = '' || rowItem[color];
                if (rowItem[key] === groupSchemeName) rowItem[key] = '当前样品';
                return false;
              });
            }
          });
        }
      });
    });

    rowData.forEach(rItems => {
      const rItem = rItems;
      columns.forEach(cItem => {
        Object.keys(rItem).map(key => {
          if (rItem[key] === cItem.title) {
            rItem[key] = '';
          }
          return false;
        });
      });
    });
    return rowData;
  };

  /**
   * 填充行数据 环境因子
   * @param {Array} list  环境因子数据
   * @param {Array} rowData 行数据 有表头字段但数据为空
   */
  getFillDataEnvironment = (list, rowData) => {
    // 环境因子遍历
    list.forEach(item => {
      const { environmentFactorName } = item;

      // 行数据遍历
      rowData.forEach(rowItems => {
        const rowItem = rowItems;
        // 环境因子列表遍历
        item.environmentFactorValues.forEach(valItem => {
          // 环境因子值下的样品列表遍历
          valItem.samples.forEach(samItem => {
            // 找到对应的样品行
            if (rowItem.metadataSampleId === samItem.metadataSampleId) {
              Object.keys(rowItem).map(key => {
                if (rowItem[key] === environmentFactorName) {
                  rowItem[key] = valItem.environmentFactorValue;
                }
                // 删除多余属性
                delete rowItem.sampleColor;
                return false;
              });
            }
          });
        });
      });
    });
    return rowData;
  };

  /**
   * 样品去重 排序
   * @param {Array} list 数据中拿到的样品列表
   * @param {Array} sampleList 样品表中的样品列表
   * @param {Object} columns 初始列数据
   */
  sampleRemoveDuplication = (list, sampleList, columns) => {
    const newSample = [];
    const ids = [];
    list.forEach(samItem => {
      if (newSample.length === 0) {
        newSample.push(samItem);
        ids.push(samItem.metadataSampleId);
      }
      if (ids.indexOf(samItem.metadataSampleId) === -1) {
        newSample.push(samItem);
        ids.push(samItem.metadataSampleId);
      }
    });

    // 第一列样品 排序 与样品列表顺序一致
    const newData = [];
    sampleList.forEach(item => {
      newSample.forEach(it => {
        if (item.id === it.metadataSampleId) {
          // 拼装行
          const newIt = {
            metadataSampleId: it.metadataSampleId,
            sampleColor: '',
          };
          columns.forEach(groItem => {
            newIt[groItem.dataIndex] = groItem.title;
            // newIt.id = groItem.id;
          });
          newIt.sampleName = it.sampleAlias;
          newData.push(newIt);
        }
      });
    });

    return newData;
  };

  render() {
    const {
      loading,
      visibleField,
      rowData,
      sampleColumns,
      groupColumns,
      environmentalFactorColumns,
      sampleData,
      groupSchemeData,
      environmentalFactorData,
    } = this.state;
    let tableWidth = 0;

    const newSampleColumns = sampleColumns.map(cols => {
      const col = cols;
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    const newGroupColumns = groupColumns.map(cols => {
      const col = cols;
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    const newEnvironmentalFactorColumns = environmentalFactorColumns.map(cols => {
      const col = cols;
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <PageHeaderWrapper>
        <TableModel
          title="样品"
          rowkey="id"
          loading={loading}
          data={sampleData}
          columns={newSampleColumns}
          searchFieldDrawer={row => {
            this.searchFieldDrawer(row);
          }}
          tableWidth={tableWidth}
        />
        <TableModel
          title="分组方案"
          rowkey="metadataSampleId"
          loading={loading}
          data={groupSchemeData}
          columns={newGroupColumns}
          tableWidth={tableWidth}
        />
        <TableModel
          title="环境因子表"
          rowkey="metadataSampleId"
          loading={loading}
          data={environmentalFactorData}
          columns={newEnvironmentalFactorColumns}
          tableWidth={tableWidth}
        />

        {/* 序列文件抽屉 */}
        <FieldDrawer visible={visibleField} onClose={this.onCloseFieldDrawer} data={rowData} />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ htsCache }) => ({
  htsCache,
}))(paramList);
