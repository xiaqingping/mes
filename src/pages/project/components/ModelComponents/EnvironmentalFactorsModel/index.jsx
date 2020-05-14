/**
 * 环境因子表
 */
import React from 'react';
import { Table, Button } from 'antd';
import { CloseOutlined, PlusSquareOutlined, UploadOutlined } from '@ant-design/icons';
import style from './index.less';
import UploadSequenceFile from './UploadSequenceFile';

class EnvironmentalFactorsModel extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return {
      sampleList: nextProps.sampleList || [],
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      // 样品选择框 样品列表
      sampleList: [],
      // 参数列表
      // eslint-disable-next-line react/no-unused-state
      paramList: props.paramList,
      // 表数据
      data: [],
      // 表格全部列
      columns: [],
      // 表格新增列
      headers: [],
      // 表头 第一列
      firstColumn: {
        id: 1,
        title: '样品',
        dataIndex: 'sampleName',
        key: 'sampleName',
        width: 100,
      },
      // 表头 最后一列
      lastColumn: {
        title: () => <PlusSquareOutlined className={style.addButton} onClick={this.addColumn} />,
        dataIndex: 'add',
        key: 'add',
        width: 80,
      },
      // 上传模态框
      visible: false,
    };
  }

  componentDidMount() {
    this.initTable();
    this.getParamData();
    this.props.getFun(this.selectUpdateDataSource);
  }

  // 初始化表格
  initTable = () => {
    // 初始数据
    const { sampleList, headers, firstColumn, lastColumn } = this.state;

    // 获取表头
    const columns = [firstColumn, ...this.formatHeader(headers), lastColumn];

    const newList = [];
    // 获取表格数据
    let i = 1;
    sampleList.forEach(item => {
      const newItem = {};
      newItem.id = i++;
      newItem.sampleName = item.sampleAlias || item.sampleName;
      newItem.add = '';
      newList.push(newItem);
    });

    this.setState({
      data: newList,
      columns,
    });
    return true;
  };

  // 样品列表改变时同步环境因子样品列表
  selectUpdateDataSource = () => {
    const { sampleList, data, headers } = this.state;
    const newData = [];
    sampleList.map(samItem => {
      let newItem = {};
      newItem = {
        sampleId: samItem.id,
        sampleName: samItem.sampleAlias || samItem.sampleName,
      };
      const item = {};
      data.forEach(daItem => {
        item[daItem.sampleId] = daItem;
      });
      if (item[samItem.id]) {
        newItem = item[samItem.id];
        newItem.sampleName = samItem.sampleAlias || samItem.sampleName;
      } else {
        headers.forEach(key => {
          newItem[key] = '';
        });
      }
      newData.push(newItem);
      return false;
    });
    this.formatSubmitData(newData, 'tableData');
    this.setState({
      data: newData,
    });
  };

  /**
   * 提交数据格式化
   * @param {Array} tableSources 表格资源(表头数据或表数据)
   * @param {String} type 资源类型
   */
  formatSubmitData = (tableSources, type) => {
    const { paramList } = this.state;
    let { data, headers } = this.state;
    if (type === 'tableHeader') {
      headers = tableSources;
    } else if (type === 'tableData') {
      data = tableSources;
    }

    let error;
    let errorData;

    // 数据整理
    let tableData = [];
    if (data.length > 0 || headers.length > 0) {
      headers.forEach(item => {
        tableData = [
          ...tableData,
          { environmentFactorName: item.title, environmentFactorValues: [] },
        ];
      });

      for (let i = 2; i < tableData.length + 2; i++) {
        if (!tableData[i - 2]) return false;
        const values = [];
        // eslint-disable-next-line no-loop-func
        data.forEach(item => {
          if (item[`header_${i}`] !== '') {
            const sampleValue = {
              // TODO:
              sampleId: item.sampleId || item.metadataSampleId,
              sampleName: item.sampleName,
            };
            const samples = [];
            samples.push(sampleValue);
            if (values.indexOf(item[`header_${i}`]) === -1) {
              tableData[i - 2].environmentFactorValues.push({
                environmentFactorValue: item[`header_${i}`],
                samples,
              });
            } else {
              tableData[i - 2].environmentFactorValues.forEach(valItem => {
                if (item[`header_${i}`] === valItem.environmentFactorValue) {
                  valItem.samples.push(sampleValue);
                }
              });
            }
            values.push(item[`header_${i}`]);
          }
        });
      }
      // 验证数据
      errorData = this.verifyData(tableData);
      error = errorData.errorSta;
    }

    const paramData = {
      paramKey: paramList.paramKey,
      paramValue: error ? '' : JSON.stringify(tableData),
      taskModelId: paramList.taskModelId,
    };
    const isVerify = !error;
    const { message } = errorData;

    this.props.getData(paramData, 'environmentFactor', isVerify, message);
    return false;
  };

  /**
   * 验证数据
   * @param {Array} tableData 表数据
   */
  verifyData = tableData => {
    const { paramList, sampleList } = this.state;
    // 环境因子下不能全部为空
    let errorSta = false;
    let message = '';
    if (paramList.isRequired === 'true') {
      tableData.forEach(item => {
        if (item.environmentFactorValues.length === 0) {
          errorSta = true;
          message = '环境因子为必须项，请设置环境因子！';
        }
      });
    }
    if (paramList.isRequired === 'false' && sampleList.length === 0) errorSta = false;
    const data = { errorSta, message };
    return data;
  };

  /**
   * 整理表头表数据
   * @param {Array} tableHaed 表头数据
   * @param {Array} tableList 表数据
   */
  getDataDispose = (tableHaed, tableList) => {
    const newHeader = tableHaed.filter(item => item.dataIndex !== 'sampleName');

    // 获取表头
    const { firstColumn, lastColumn } = this.state;

    const disabledIs = this.props.disabled; // 是否禁用
    let newColumns;
    if (disabledIs) newColumns = [firstColumn, ...this.formatHeader(newHeader)];
    else newColumns = [firstColumn, ...this.formatHeader(newHeader), lastColumn];

    this.setState({
      data: tableList,
      columns: newColumns,
      headers: newHeader,
    });
  };

  /**
   * 获取参数数据
   * @param {Array} paramList 父页面传递的 参数数据
   * @param {Array} sampleList 父页面传递的 样品列表
   */
  getParamData = () => {
    const { paramList, sampleList } = this.props;
    const { firstColumn } = this.state;
    if (paramList === undefined) return false;
    if (paramList.paramValue === undefined) return false;

    const paramValue = JSON.parse(paramList.paramValue);

    if (paramList) {
      const list = paramValue;
      const columns = [firstColumn];
      const titleName = 'environmentFactorName';
      if (list) {
        // 取出 表头
        const newColumns = this.getTableHeaderData(list, columns, titleName);
        // 取出 行数据
        const rowData = this.getRowDataEnvironment(list, sampleList, newColumns);
        // 填充行数据
        const newData = this.getFillDataEnvironment(list, rowData, newColumns);

        this.getDataDispose(newColumns, newData);
      }
    }
    return false;
  };

  /**
   * 新增列
   * @param {Array} headers 表头数据
   * @param {Object} firstColumn 第一列表头
   * @param {Object} lastColumn 最后一列表头
   */
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

  /**
   * 移除列
   * @param {Array} data 表数据
   * @param {Array} headers 表头数据
   */
  removeColumn = event => {
    const { data, headers, firstColumn, lastColumn } = this.state;
    const headerArr = headers.filter(item => item.id !== event.id);
    const dataArr = data.filter(item => item[event.dataIndex] !== event.dataIndex);

    this.setState(
      {
        headers: headerArr,
      },
      () => {
        const hds = this.state.headers;
        const columns = [firstColumn, ...this.formatHeader(hds), lastColumn];
        this.setState({ columns, data: dataArr });
        this.formatSubmitData(headerArr, 'tableHeader');
      },
    );
  };

  /**
   * 修改表头
   * @param {Object} row 当前行数据
   */
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
    this.formatSubmitData(newHeader, 'tableHeader');
    this.setState({ headers: newHeader });
  };

  /**
   * 修改数据
   * @param {Object} row 当前行数据
   * @param {String} title 当前列的title
   */
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
      // if (row.metadataSampleId === item.metadataSampleId) {
      if (row.sampleId === item.sampleId) {
        newData.push(newRow);
      } else {
        const newItem = JSON.parse(JSON.stringify(item));
        newData.push(newItem);
      }
    });
    this.formatSubmitData(newData, 'tableData');
    this.setState({ data: newData });
  };

  /**
   * 配置表头
   * @param {Array} headers 表头数据
   */
  formatHeader = headers => {
    const disabledIs = this.props.disabled; // 是否禁用
    const groups = headers.map(item => ({
      title: () => (
        <div className={style.environmentFactorTitle} key={item.id}>
          <input
            defaultValue={item.title}
            onBlur={event => this.handleOnChangeTitle(item, event)}
            disabled={disabledIs}
          />
          {disabledIs ? '' : <CloseOutlined onClick={() => this.removeColumn(item)} />}
        </div>
      ),
      dataIndex: `${item.dataIndex}`,
      key: `${item.key}`,
      width: 150,
      render: (value, row) => (
        <div className={style.editTable} key={item.id}>
          <input
            defaultValue={value}
            onBlur={event => this.handleOnChangeData(row, event, item.title)}
            disabled={disabledIs}
          />
        </div>
      ),
    }));

    return groups;
  };

  /** 上传 */
  uploadButton = () => {
    this.setState({ visible: true });
  };

  /** 关闭上传 */
  handleClose = () => {
    this.setState({ visible: false });
  };

  /**
   * 获取表头
   * @param {Array} data 数据列表
   * @param {Array} columns 初始列
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
   * @param {Array} list 环境因子数据
   * @param {Array} sampleList 样品列表数据
   * @param {Array} columns 环境因子初始列
   */
  getRowDataEnvironment = (list, sampleList, columns) => {
    const newsamples = [];
    // 环境因子数据遍历
    list.forEach(item => {
      // 环境因子列表遍历
      item.environmentFactorValues.forEach(it => {
        // 样品列表遍历
        it.samples.forEach(t => {
          newsamples.push(t);
        });
      });
    });

    // 样品去重 排序
    const newData = this.sampleRemoveDuplication(newsamples, sampleList, columns);
    return newData;
  };

  /**
   * 填充行数据 环境因子
   * @param {Array} list  环境因子数据
   * @param {Array} rowData 行数据 有表头字段但数据为空
   * @param {Array} columns 环境因子初始列
   */
  getFillDataEnvironment = (list, rowData, columns) => {
    const titleList = [];
    columns.forEach(item => {
      titleList.push(item.title);
    });
    // 环境因子遍历
    list.forEach(item => {
      const { environmentFactorName } = item;

      // 行数据遍历
      rowData.forEach(rowItem => {
        // 环境因子列表遍历
        item.environmentFactorValues.forEach(valItem => {
          // 环境因子值下的样品列表遍历
          valItem.samples.forEach(samItem => {
            // 找到对应的样品行
            if (rowItem.sampleId === samItem.sampleId) {
              Object.keys(rowItem).map(key => {
                if (rowItem[key] === environmentFactorName) {
                  // eslint-disable-next-line no-param-reassign
                  rowItem[key] = valItem.environmentFactorValue;
                }
                // 删除多余属性
                // eslint-disable-next-line no-param-reassign
                delete rowItem.sampleColor;
                return false;
              });
            }
          });
        });
      });
    });
    rowData.forEach(rowItem => {
      Object.keys(rowItem).map(key => {
        // eslint-disable-next-line no-param-reassign
        if (titleList.includes(rowItem[key])) rowItem[key] = '';
        return false;
      });
    });

    return rowData;
  };

  /**
   * 样品去重 排序
   * @param {Array} list 数据中拿到的样品列表
   * @param {Array} sampleList 样品表中的样品列表
   * @param {Array} columns 初始列数据
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
          newIt.sampleName = it.sampleName;
          newData.push(newIt);
        }
      });
    });
    return newData;
  };

  render() {
    const { columns, data, visible, sampleList } = this.state;
    const disabledIs = this.props.disabled; // 是否禁用
    let tableWidth = 0;
    const { paramName } = this.props.paramList;
    const newColumns = columns.map(col => {
      // eslint-disable-next-line no-param-reassign
      if (!col.width) col.width = 150;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <div style={{ width: '100%', marginTop: 30, marginBottom: 30 }}>
        <div style={{ float: 'left', marginTop: 10, fontSize: 15, fontWeight: 'bold' }}>
          {paramName}
        </div>
        {!disabledIs && sampleList.length > 0 ? (
          <div
            onClick={() => this.uploadButton()}
            style={{ float: 'right', marginTop: 10, marginBottom: 10 }}
          >
            <Button type="primary">
              <UploadOutlined />
              上传
            </Button>
          </div>
        ) : (
          ''
        )}

        {/* 表格 */}
        <Table
          scroll={{ x: tableWidth }}
          dataSource={data}
          columns={newColumns}
          pagination={false}
          style={{ clear: 'both' }}
        />
        {/* 上传文件 */}
        <UploadSequenceFile
          visible={visible}
          sampleList={sampleList}
          handleClose={this.handleClose}
          getUploadData={this.getDataDispose}
        />
      </div>
    );
  }
}

export default EnvironmentalFactorsModel;
