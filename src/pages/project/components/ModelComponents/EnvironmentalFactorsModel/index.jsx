/**
 * 环境因子表
 */
import React from 'react';
import { Table, Card, Button } from 'antd';
import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import style from './index.less';
import UploadSequenceFile from './UploadSequenceFile';

class EnvironmentalFactorsModel extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      // 样品选择框 样品列表
      sampleList: props.sampleList || [],
      // 表数据
      data: [],
      // 表头
      columns: [],
      // 新增列暂存区
      headers: [],
      // 表头 第一列
      firstColumn: {
        id: 1,
        title: '样品',
        dataIndex: 'sampleAlias',
        key: 'sampleAlias',
        width: 100,
      },
      // 表头 最后一列
      lastColumn: {
        title: () => <PlusSquareOutlined onClick={this.addColumn} />,
        dataIndex: 'add',
        key: 'add',
        width: 100,
      },
      // 上传模态框
      visible: false,
    };
  }

  componentDidMount() {
    this.initTable();
    this.getParamData();
  }

  componentDidUpdate(props) {
    if (props.submitStatus !== this.props.submitStatus) {
      const data = this.handleSave();
      console.log(data);
      // this.props.getData('testData', '环境因子');
    }
  }

  // 初始化表格
  initTable = () => {
    // 初始数据
    const { sampleList, headers, firstColumn, lastColumn } = this.state;

    // 获取表头
    const columns = [firstColumn, ...this.formatHeader(headers), lastColumn];

    // 获取表格数据
    const newList = [];
    let i = 1;
    sampleList.forEach(item => {
      const newItem = {};
      newItem.id = i++;
      newItem.sampleAlias = item.sampleAlias;
      newItem.add = '';
      newList.push(newItem);
    });

    this.setState({
      data: newList,
      columns,
    });
  };

  // 获取数据 整理显示
  getDataDispose = (tableHaed, tableList) => {
    const newHeader = tableHaed.filter(item => item.dataIndex !== 'sampleAlias');

    // 获取表头
    const { firstColumn, lastColumn } = this.state;
    const newColumns = [firstColumn, ...this.formatHeader(newHeader), lastColumn];

    this.setState({
      data: tableList,
      columns: newColumns,
      headers: newHeader,
    });
  };

  // 获取参数数据
  getParamData = () => {
    const { paramList, sampleList } = this.props;
    const { firstColumn } = this.state;
    const paramValue = JSON.parse(paramList.paramValue);

    console.log(paramValue);

    // const newColumns = [];
    // paramValue.environmentFactorList.forEach((item, index) => {
    //   console.log(item);
    //   console.log(index);
    //   // 表头
    //   const newCol = {
    //     id: index + 1,
    //     title: item.environmentFactorName,
    //     dataIndex: index + 1,
    //     key: index + 1,
    //   };
    //   newColumns.push(newCol);
    // })
    // console.log(newColumns);

    if (paramList) {
      const list = paramValue.environmentFactorList;
      const columns = [firstColumn];
      const titleName = 'environmentFactorName';

      // 取出 表头
      const newColumns = this.getTableHeaderData(list, columns, titleName);

      // 取出 行数据
      const rowData = this.getRowDataEnvironment(list, sampleList, newColumns);
      console.log(rowData);

      // 填充行数据
      const newData = this.getFillDataEnvironment(list, rowData);

      this.getDataDispose(newColumns, newData);
    }
  };

  // 提交数据
  handleSave = () => {
    const { data, headers } = this.state;
    console.log(data);

    if (data.length === 0 || headers.length === 0) return false;

    // let tableHeard = [];
    // headers.forEach((item, index) => {

    //     tableHeard = [
    //       ...tableHeard,
    //       { groupSchemeName: item.dupTitle, sampleList: [], groupList: [] },
    //     ];

    // });

    // console.log(headers);
    // console.log(tableHeard);
    // for (let i = 2; i < headers.length + 2; i++) {
    //   if (!tableHeard[i - 2]) return false;
    //   // eslint-disable-next-line no-loop-func
    //   data.forEach(item => {
    //     // if (item[`header_${i}`] === '') return;
    //     // if (item[`header_${i}`] === '当前样品') {
    //     //   tableHeard[i - 2].sampleList.push({
    //     //     metadataSampleId: item[`header_${i}`],
    //     //     sampleAlias: item.sampleName,
    //     //   });
    //     // } else {
    //       tableHeard[i - 2].groupList.push({
    //         groupName: item[`header_${i}`],
    //         // color: item[`color_${i}`],
    //       });
    //     // }
    //   });
    // }

    // return tableHeard

    // 数据整理
    let tableHeard = [];
    headers.forEach(item => {
      tableHeard = [
        ...tableHeard,
        { environmentFactorName: item.title, environmentFactorValueList: [] },
      ];
    });

    // console.log(tableHeard);

    for (let i = 2; i < tableHeard.length + 2; i++) {
      if (!tableHeard[i - 2]) return false;
      const values = [];
      // eslint-disable-next-line no-loop-func
      data.forEach(item => {
        if (item[`header_${i}`] !== '') {
          const sampleValue = {
            sampleId: item.sampleId,
            sampleAlias: item.sampleAlias,
          };
          const sampleList = [];
          sampleList.push(sampleValue);
          if (values.indexOf(item[`header_${i}`]) === -1) {
            tableHeard[i - 2].environmentFactorValueList.push({
              environmentFactorValue: item[`header_${i}`],
              sampleList,
            });
          } else {
            tableHeard[i - 2].environmentFactorValueList.forEach(valItem => {
              if (item[`header_${i}`] === valItem.environmentFactorValue) {
                valItem.sampleList.push(sampleValue);
              }
            });
          }
          values.push(item[`header_${i}`]);
        }
      });
    }

    return tableHeard;
  };

  // 新增列
  addColumn = () => {
    const { headers, firstColumn, lastColumn } = this.state;

    // 设置新增列
    let num;
    if (headers.length > 0) {
      const ids = [];
      headers.forEach(item => {
        ids.push(item.id);
      });
      const max = Math.max.apply(null, ids);
      num = max + 1;
    } else {
      num = 2;
    }

    const newHeader = {
      id: num,
      dataIndex: `header_${num}`,
      key: `header_${num}`,
      title: `环境因子_${num}`,
    };
    const hds = [...headers, newHeader];
    const cls = [firstColumn, ...this.formatHeader(hds), lastColumn];

    // 设置表格数据
    const { data } = this.state;
    const newData = [];
    data.forEach(item => {
      const newItem = JSON.parse(JSON.stringify(item));
      const key = newHeader.dataIndex;
      newItem[key] = '';
      newData.push(newItem);
    });

    this.setState({
      headers: hds,
      columns: cls,
      data: newData,
    });
  };

  // 移除列
  removeColumn = e => {
    const { data, headers, firstColumn, lastColumn } = this.state;
    const headerArr = headers.filter(item => item.id !== e.id);
    const dataArr = data.filter(item => item[e.dataInde] !== e.dataIndex);

    this.setState(
      {
        headers: headerArr,
      },
      () => {
        const hds = this.state.headers;
        const columns = [firstColumn, ...this.formatHeader(hds), lastColumn];
        this.setState({ columns, data: dataArr });
      },
    );
  };

  // 修改表头
  handleOnChangeTitle = (row, event) => {
    const { headers } = this.state;
    const newHeader = [];
    headers.forEach(item => {
      if (row.id === item.id) {
        const newItem = JSON.parse(JSON.stringify(item));
        newItem.title = event.target.value;
        newHeader.push(newItem);
      }
    });
    this.setState({ headers: newHeader });
  };

  // 修改数据
  handleOnChangeData = (row, event, title) => {
    const { data, headers } = this.state;
    let newKey;
    headers.forEach(item => {
      if (item.title === title) {
        newKey = item.key;
      }
    });
    const newRow = JSON.parse(JSON.stringify(row));
    newRow[newKey] = event.target.value;

    const newData = [];
    data.forEach(item => {
      if (row.id === item.id) {
        newData.push(newRow);
      } else {
        const newItem = JSON.parse(JSON.stringify(item));
        newData.push(newItem);
      }
    });
    this.setState({ headers: newData });
  };

  // 配置表头
  formatHeader = headers => {
    const groups = headers.map(item => ({
      title: () => (
        <div className="project_manage_UI_sample_group_title" key={item.id}>
          <input
            defaultValue={item.title}
            onChange={event => this.handleOnChangeTitle(item, event)}
          />
          <CloseOutlined onClick={() => this.removeColumn(item)} />
        </div>
      ),
      dataIndex: `${item.dataIndex}`,
      key: `${item.key}`,
      width: 170,
      render: (value, row) => (
        <div className={style.editTable} key={item.id}>
          <input
            defaultValue={value}
            onChange={event => this.handleOnChangeData(row, event, item.title)}
          />
        </div>
      ),
    }));

    return groups;
  };

  // 上传
  uploadButton = () => {
    this.setState({ visible: true });
  };

  // 关闭上传
  handleClose = () => {
    this.setState({ visible: false });
  };

  /**
   * 获取表头
   * data 数据列表
   * columns 初始列
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
        dataIndex: `header_${max + 1}`,
        key: `header_${max + 1}`,
      };
      newColumns.push(newCol);
    });
    return newColumns;
  };

  /**
   * 获取行数据 环境因子
   * list 环境因子数据
   * sampleList 样品列表数据
   * columns 环境因子初始列
   */
  getRowDataEnvironment = (list, sampleList, columns) => {
    const samples = [];
    // 环境因子数据遍历
    list.forEach(item => {
      // 环境因子列表遍历
      item.environmentFactorValueList.forEach(it => {
        // 样品列表遍历
        it.sampleList.forEach(t => {
          samples.push(t);
        });
      });
    });

    // 样品去重 排序
    const newData = this.sampleRemoveDuplication(samples, sampleList, columns);
    return newData;
  };

  /**
   * 填充行数据 环境因子
   * list  环境因子数据
   * rowData 行数据 有表头字段但数据为空
   */
  getFillDataEnvironment = (list, rowData) => {
    // 环境因子遍历
    list.forEach(item => {
      const { environmentFactorName } = item;

      // 行数据遍历
      rowData.forEach(rowItem => {
        // 环境因子列表遍历
        item.environmentFactorValueList.forEach(valItem => {
          // 环境因子值下的样品列表遍历
          valItem.sampleList.forEach(samItem => {
            // 找到对应的样品行
            if (rowItem.sampleId === samItem.sampleId) {
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
   * list 数据中拿到的样品列表
   * sampleList 样品表中的样品列表
   * columns 初始列数据
   */
  sampleRemoveDuplication = (list, sampleList, columns) => {
    // 去重
    const newSample = [];
    const ids = [];
    list.forEach(samItem => {
      if (newSample.length === 0) {
        newSample.push(samItem);
        ids.push(samItem.sampleId);
      }
      if (ids.indexOf(samItem.sampleId) === -1) {
        newSample.push(samItem);
        ids.push(samItem.sampleId);
      }
    });

    // 第一列样品 排序 与样品列表顺序一致
    const newData = [];
    sampleList.forEach(item => {
      newSample.forEach(it => {
        if (item.id === it.sampleId) {
          // 拼装行
          const newIt = {
            sampleId: it.sampleId,
            sampleColor: '',
          };
          columns.forEach(groItem => {
            newIt[groItem.dataIndex] = groItem.title;
          });
          newIt.sampleAlias = it.sampleAlias;
          newData.push(newIt);
        }
      });
    });
    return newData;
  };

  render() {
    const { columns, data, visible, sampleList } = this.state;
    let tableWidth = 0;

    const newColumns = columns.map(col => {
      if (!col.width) col.width = 100;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <Card
        title="环境因子表"
        style={{ width: '100%', marginTop: 30, marginBottom: 100 }}
        extra={
          <Button type="primary" onClick={() => this.uploadButton()}>
            上传
          </Button>
        }
      >
        {/* 表格 */}
        <Table
          scroll={{ x: tableWidth }}
          dataSource={data}
          columns={newColumns}
          pagination={false}
        />
        {/* 上传文件 */}
        <UploadSequenceFile
          visible={visible}
          sampleList={sampleList}
          handleClose={this.handleClose}
          getUploadData={this.getDataDispose}
        />
      </Card>
    );
  }
}

export default EnvironmentalFactorsModel;
