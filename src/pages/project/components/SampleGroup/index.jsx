import React from 'react';
import { Table, Button, Modal, AutoComplete, Popover, message } from 'antd';
import {
  UploadOutlined,
  PlusSquareOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';
import './index.less';
import { connect } from 'dva';
import GroupUpload from '../UploadSequenceFile/index';

const { confirm } = Modal;
const { Option } = AutoComplete;

class SampleGroup extends React.Component {
  state = {
    visible: false,

    tableData: [
      {
        groupSchemeName: '分组方案四',
        sampleList: null,
        groupList: [
          {
            groupName: 'group4',
            color: 'black',
            sampleList: [
              {
                metadataSampleId: 'fef48d6d544b4eda8cceae3690404418',
                sampleAlias: '别名003',
              },
              {
                metadataSampleId: 'c8dc965476874dccb81c066df5a174d9',
                sampleAlias: '别名004',
              },
            ],
          },
          {
            groupName: 'group3',
            color: 'yellow',
            sampleList: [
              {
                metadataSampleId: '39fbe07a8c3546b3bca9801869a58c45',
                sampleAlias: '别名002',
              },
              {
                metadataSampleId: '2a3beac6006a4a54a8cb6b4809ea9dc3',
                sampleAlias: '别名001',
              },
            ],
          },
        ],
      },
      {
        groupSchemeName: '分组方案二',
        sampleList: [
          {
            metadataSampleId: 'c8dc965476874dccb81c066df5a174d9',
            sampleAlias: '别名004',
          },
        ],
        groupList: null,
      },
      {
        groupSchemeName: '分组方案三',
        sampleList: [
          {
            metadataSampleId: 'fef48d6d544b4eda8cceae3690404418',
            sampleAlias: '别名003',
          },
          {
            metadataSampleId: '39fbe07a8c3546b3bca9801869a58c45',
            sampleAlias: '别名002',
          },
          {
            metadataSampleId: '2a3beac6006a4a54a8cb6b4809ea9dc3',
            sampleAlias: '别名001',
          },
          {
            metadataSampleId: 'c8dc965476874dccb81c066df5a174d9',
            sampleAlias: '别名004',
          },
        ],
        groupList: null,
      },
      {
        groupSchemeName: '分组方案one',
        sampleList: null,
        groupList: [
          {
            groupName: 'group1',
            color: 'black',
            sampleList: [
              {
                metadataSampleId: '39fbe07a8c3546b3bca9801869a58c45',
                sampleAlias: '别名002',
              },
              {
                metadataSampleId: '2a3beac6006a4a54a8cb6b4809ea9dc3',
                sampleAlias: '别名001',
              },
            ],
          },
          {
            groupName: 'group2',
            color: 'yellow',
            sampleList: [
              {
                metadataSampleId: 'c8dc965476874dccb81c066df5a174d9',
                sampleAlias: '别名004',
              },
              {
                metadataSampleId: 'fef48d6d544b4eda8cceae3690404418',
                sampleAlias: '别名003',
              },
            ],
          },
        ],
      },
    ],

    sampleList: [
      {
        id: '2a3beac6006a4a54a8cb6b4809ea9dc3',
        sampleCode: '1234',
        sampleName: '样品one',
        sampleAlias: '别名001',
        color: 'purple',
        sampleSequenceCount: 15,
        sampleLengthTotal: 9000,
        sampleLengthAve: 600.0,
        sampleLengthMax: 4000,
        sampleLengthMin: 1000,
        sequenceFileCount: 2,
        sequenceFileList: [
          {
            sequenceFileId: '123',
            sequenceFileName: 'a',
            sampleSequenceCount: 10,
            sampleLengthMin: 2000,
            sampleLengthMax: 4000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 6000,
          },
          {
            sequenceFileId: '1234',
            sequenceFileName: 'b',
            sampleSequenceCount: 5,
            sampleLengthMin: 1000,
            sampleLengthMax: 2000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 3000,
          },
        ],
      },
      {
        id: '39fbe07a8c3546b3bca9801869a58c45',
        sampleCode: '12345',
        sampleName: '样品B',
        sampleAlias: '别名002',
        color: 'red',
        sampleSequenceCount: 15,
        sampleLengthTotal: 9000,
        sampleLengthAve: 600.0,
        sampleLengthMax: 4000,
        sampleLengthMin: 1000,
        sequenceFileCount: 2,
        sequenceFileList: [
          {
            sequenceFileId: '123456',
            sequenceFileName: 'd',
            sampleSequenceCount: 10,
            sampleLengthMin: 2000,
            sampleLengthMax: 4000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 6000,
          },
          {
            sequenceFileId: '12345',
            sequenceFileName: 'c',
            sampleSequenceCount: 5,
            sampleLengthMin: 1000,
            sampleLengthMax: 2000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 3000,
          },
        ],
      },
      {
        id: 'c8dc965476874dccb81c066df5a174d9',
        sampleCode: '1234567',
        sampleName: '样品D',
        sampleAlias: '别名004',
        color: 'gray',
        sampleSequenceCount: 5,
        sampleLengthTotal: 2000,
        sampleLengthAve: 400.0,
        sampleLengthMax: 1500,
        sampleLengthMin: 500,
        sequenceFileCount: 1,
        sequenceFileList: [
          {
            sequenceFileId: '12345679',
            sequenceFileName: 'e',
            sampleSequenceCount: 5,
            sampleLengthMin: 500,
            sampleLengthMax: 1500,
            sampleLengthAve: 400.0,
            sampleLengthTotal: 2000,
          },
        ],
      },
      {
        id: 'fef48d6d544b4eda8cceae3690404418',
        sampleCode: '123456',
        sampleName: '样品C',
        sampleAlias: '别名003',
        color: 'blue',
        sampleSequenceCount: 15,
        sampleLengthTotal: 12000,
        sampleLengthAve: 800.0,
        sampleLengthMax: 6000,
        sampleLengthMin: 500,
        sequenceFileCount: 2,
        sequenceFileList: [
          {
            sequenceFileId: '1234567',
            sequenceFileName: 'e',
            sampleSequenceCount: 5,
            sampleLengthMin: 500,
            sampleLengthMax: 1500,
            sampleLengthAve: 400.0,
            sampleLengthTotal: 2000,
          },
          {
            sequenceFileId: '12345678',
            sequenceFileName: 'f',
            sampleSequenceCount: 10,
            sampleLengthMin: 4000,
            sampleLengthMax: 6000,
            sampleLengthAve: 1000.0,
            sampleLengthTotal: 10000,
          },
        ],
      },
    ],

    groupSchemeData: [], // 分组方案数据
    // 分组方案
    optionList: ['当前样品'],
    columns: [
      {
        id: 1,
        title: '样品',
        dataIndex: 'sampleName',
        key: 'sampleName',
        width: 100,
      },
    ],
  };

  lastColumn = {
    id: 'add',
    title: () => <PlusSquareOutlined onClick={this.handleAdd} />,
    dataIndex: 'add',
    key: 'add',
    width: 80,
  };

  componentDidMount() {
    const { tableData } = this.state;
    this.setState(
      {
        groupSchemeData: tableData,
      },
      () => {
        // 转换分组方案数据
        this.transformGroup(this.state.groupSchemeData);
      },
    );
  }

  // 转换分组方案数据
  transformGroup = data => {
    const { columns } = this.state;
    // const { groupSchemeList, sampleList } = data;
    const { sampleList } = this.state;
    // const list = data;
    const cols = [...columns];
    const titleName = 'groupSchemeName';

    // 取出 表头
    const newColumns = this.getTableHeaderData(data, cols, titleName);

    // // 取出 行数据
    const rowData = this.getRowDataGroup(data, sampleList, newColumns);
    // 填充行数据
    const newData = this.getFillData(data, rowData, newColumns);
    // 将所有的颜色放到仓库里.
    this.pushColorsToStore(newData);

    // 保存 分组 表头数据
    this.setState({
      columns: newColumns,
      groupSchemeData: newData,
    });
  };

  pushColorsToStore = newData => {
    const colorStore = [];
    newData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key.indexOf('color_') !== -1) {
          if (row[key] && !colorStore.includes(row[key])) {
            colorStore.push(row[key]);
          }
        }
      });
    });

    this.setColorStore(colorStore);
  };

  setColorStore = colorStore => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/setColorStore',
      payload: colorStore,
    });
  };

  /**
   * 填充行数据
   * groupList  分组方案数据
   * rowData 行数据 有表头字段但数据为空
   */
  getFillData = (groupList, rowData, columns) => {
    // 分组方案遍历
    groupList.forEach(groupItem => {
      const { groupSchemeName } = groupItem;

      // 行数据遍历
      rowData.forEach(rowItem => {
        // 分组方案下的 分组列表不为空
        if (groupItem.groupList !== null && groupItem.groupList.length !== 0) {
          // 分组列表遍历
          groupItem.groupList.forEach(groItem => {
            // 分组下的样品列表遍历
            groItem.sampleList.forEach(samItem => {
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
        if (groupItem.sampleList !== null && groupItem.sampleList.length !== 0) {
          groupItem.sampleList.forEach(samItem => {
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

    rowData.forEach(rItem => {
      columns.forEach(cItem => {
        Object.keys(rItem).map(key => {
          if (rItem[key] === cItem.dupTitle) {
            rItem[key] = '';
          }
          return false;
        });
      });
    });
    return rowData;
  };

  /**
   * 获取行数据 分组方案
   * groupList 分组方案数据
   * sampleList 样品列表数据
   * groupColumns 分组方案初始列
   */
  getRowDataGroup = (groupList, sampleList, groupColumns) => {
    // 取出全部样品
    const samples = [];
    groupList.forEach(groupItem => {
      // 分组方案下的 样品列表 为空
      if (groupItem.sampleList === null) {
        groupItem.groupList.forEach(groItem => {
          groItem.sampleList.forEach(samItem => {
            samples.push(samItem);
          });
        });
      }
      // 分组方案下的 分组列表 为空
      if (groupItem.groupList === null) {
        groupItem.sampleList.forEach(samItem => {
          samples.push(samItem);
        });
      }
    });

    // 样品去重 排序
    const newData = this.sampleRemoveDuplication(samples, sampleList, groupColumns);

    return newData;
  };

  /**
   * 样品去重 排序
   * list 数据中拿到的样品列表
   * sampleList 样品表中的样品列表
   * columns 初始列数据
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
            newIt[groItem.dataIndex] = groItem.dupTitle;
            // newIt.id = groItem.id;
          });
          newIt.sampleName = it.sampleAlias;
          newData.push(newIt);
        }
      });
    });

    return newData;
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
        width: 100,
        dataIndex: `header_${max + 1}`,
        key: `header_${max + 1}`,
        render: (value, row, index) => {
          const color1 = `color_${max + 1}`;
          return this.columnRender(value, row, index, color1, `header_${max + 1}`);
        },
      };
      newColumns.push(newCol);
    });
    // 获取的columns不能操作改写title， 所以需要在格式化columns之后重新 改写。
    let renderColumns = this.renderColumns(newColumns);
    renderColumns = [...renderColumns, this.lastColumn];
    return renderColumns;
  };

  // 每列的render返回dom结构。
  columnRender = (value, row, index, color1, col) => (
    <div style={{ display: 'flex' }} className="project_components_sample_group_render_wrap">
      {/* <span style={{ marginRight: 10 }}>{value}</span> */}
      {this.selectRender(value, row, index, color1, col)}
      {row[color1] && (
        <Popover
          overlayClassName="project_manage_sample_ui_select"
          overlayStyle={{ padding: 0 }}
          content={
            <SketchPicker
              color={row[color1]}
              onChangeComplete={color => this.handleColorChange(color, value, row, index)}
            />
          }
          trigger="click"
          placement="bottom"
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: row[color1],
              position: 'relative',
            }}
          />
        </Popover>
      )}
    </div>
  );

  // 获取的columns不能操作改写title， 所以需要在格式化columns之后重新 改写。
  renderColumns = newColumns => {
    const columns = newColumns.map((item, index) => {
      if (index) {
        const { title } = item;
        item.dupTitle = title;
        item.title = () => (
          <div className="project_manage_UI_sample_group_title">
            <input defaultValue={title} onBlur={e => this.handleTitleBlur(e, item, index)} />

            <CloseOutlined onClick={() => this.removeColumn(item)} />
          </div>
        );
      }
      return item;
    });
    return columns;
  };

  handleTitleBlur = (e, item, index, id) => {
    const { columns } = this.state;
    const cols = [...columns];
    if (id) {
      let rowIndex = null;
      let row = cols.filter((v, idx) => {
        if (v.id === id) {
          rowIndex = idx;
        }
        return v.id === id;
      });
      row = row[0];
      row.dupTitle = e.target.value;
      cols[rowIndex] = row;
    } else {
      item.dupTitle = e.target.value;

      cols[index] = item;
    }

    this.setState({
      columns: cols,
    });
  };

  removeColumn = (item, id) => {
    const { columns } = this.state;
    let cols = [...columns];
    if (!item) {
      cols = cols.filter(v => v.id !== id);

      this.setState({
        columns: cols,
      });
    } else {
      cols = cols.filter(v => v.id !== item.id);
      // 这里不光删除列， 同时也要删除表格数据，，删除掉每一个行的该分组方案下的组数据；
      const num = item.dataIndex.split('_')[1];
      const { groupSchemeData } = this.state;
      const tableDatas = [...groupSchemeData];
      tableDatas.forEach(item => {
        const prop = `header_${num}`;
        delete item[prop];
        return item;
      });
      this.setState({
        columns: cols,
        groupSchemeData: tableDatas,
      });
    }
  };

  handleColorChange = (color, value, row, index) => {
    // ---------------------首先判断选择的颜色在model里是否有重复---------
    const { colorStore } = this.props.project;
    const colors = [...colorStore];
    let colorhex = color.hex;

    const repeat = colorStore.includes(colorhex);
    if (repeat) {
      colorhex = getrandomColor();
    }
    colors.push(colorhex);
    this.setColorStore(colors);
    Object.keys(row).forEach(key => {
      if (row[key] === value) {
        const num = key.split('_')[1];
        const colorName = `color_${num}`;
        row[colorName] = colorhex;
      }
    });
    const { groupSchemeData } = this.state;
    const groupData = [...groupSchemeData];
    groupData[index] = row;
    this.setState({
      groupSchemeData: groupData,
    });
  };

  // 添加列
  handleAdd = () => {
    const { columns, groupSchemeData } = this.state;
    let cols = columns.slice(0, columns.length - 1);
    const ids = cols.map(item => item.id);
    const max = Math.max.apply(null, ids);
    const newCol = {
      id: max + 1,
      title: () => (
        <div className="project_manage_UI_sample_group_title">
          <input
            defaultValue={`分组方案_${max + 1}`}
            onBlur={e => this.handleTitleBlur(e, null, null, max + 1)}
          />

          <CloseOutlined onClick={() => this.removeColumn(null, max + 1)} />
        </div>
      ),
      dupTitle: `分组方案_${max + 1}`,
      width: 100,
      dataIndex: `header_${max + 1}`,
      key: `header_${max + 1}`,
      render: (value, row, index) => {
        const color1 = `color_${max + 1}`;
        return this.columnRender(value, row, index, color1, `header_${max + 1}`);
      },
      // render:(value, )
    };
    cols = [...cols, newCol, this.lastColumn];
    let soure = [...groupSchemeData];
    const addHeader = `header_${max + 1}`;
    const addColor = `color_${max + 1}`;
    soure = soure.map(item => {
      item[addHeader] = '';
      item[addColor] = '';
      return item;
    });
    this.setState({
      columns: cols,
      groupSchemeData: soure,
    });
  };

  confirmGroupRender = (groupName, preGroupName) => (
    <div>
      <div>
        点击“是”将分组“{preGroupName}”改为“{groupName}”
      </div>
      <div>点击“否”新增分组“{groupName}”</div>
    </div>
  );

  // 选择组，blur 时候保存数据--- 当选择组的时候要加上默认的颜色
  handleGroupSelectBlur = (e, value, row, index, col) => {
    console.log(col);
    const option = e.target.value;
    const { optionList } = this.state;
    let list = [...optionList];

    if (!list.includes(option) && option) {
      list = [...list, option];
    }
    const { groupSchemeData } = this.state;
    const datas = [...groupSchemeData];
    if (!option && value === '当前样品') {
      // eslint-disable-next-line
      row[col] = option;
      datas[index] = row;
      this.setState({
        groupSchemeData: datas,
      });
    }
    if (option && option !== '当前样品' && option !== value) {
      const num = col.split('_')[1];

      const hasSame = datas.some(item => {
        if (item[col] === option) {
          // eslint-disable-next-line
          row[`color_${num}`] = item[`color_${num}`];
        }
        return item[col] === option;
      });
      if (!hasSame) row[`color_${num}`] = getrandomColor();
      //  添加到颜色store
      const { colorStore } = this.props.project;
      const colors = [...colorStore];
      colors.push(row[`color_${num}`]);
      this.setColorStore(colors);
      // eslint-disable-next-line
      row[col] = option;
      datas[index] = row;
      this.setState({
        groupSchemeData: datas,
      });
    }
    // 如果blur时候的值跟原来的值一样， 说明数据没有改变
    if (value !== option && value && option !== '当前样品' && value !== '当前样品') {
      if (option === '当前样品') {
        this.handleUpdateGroup(row, col, option, index);
        return false;
      }
      confirm({
        title: `是否将分组“${value}”改为“${option}”？`,
        icon: <ExclamationCircleOutlined />,
        content: this.confirmGroupRender(option, value),
        cancelText: '否',
        okText: '是',
        onOk: () => {
          // 修改组名
          const { columns } = this.state;
          const tableData = [...groupSchemeData];
          const columns1 = JSON.parse(JSON.stringify(columns));
          const columns2 = [...columns];
          tableData.forEach(item => {
            if (item[col] === value) {
              // eslint-disable-next-line
              item[col] = option;
              return item;
            }
            return item;
          });
          console.log(tableData);
          // TODO: 色块还待解决
          this.setState(
            {
              groupSchemeData: tableData,
              columns: columns1,
            },
            () => {
              this.setState({
                columns: columns2,
              });
            },
          );
        },
        onCancel: () => {
          // 新增组名
          this.handleUpdateGroup(row, col, option, index);
        },
      });
    }

    this.setState({
      optionList: list,
    });
    return true;
  };

  // 修改组名
  handleUpdateGroup = (row, col, option, index) => {
    // eslint-disable-next-line
    row[col] = option;
    const { groupSchemeData } = this.state;
    const source = [...groupSchemeData];
    source[index] = row;
    this.setState({
      groupSchemeData: source,
    });
  };

  selectRender = (value, row, index, color1, col) => {
    const { optionList } = this.state;
    return (
      <AutoComplete
        style={{ width: '60%' }}
        onBlur={e => this.handleGroupSelectBlur(e, value, row, index, col)}
        defaultValue={value}
      >
        {optionList.map(item => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </AutoComplete>
    );
  };

  toggleVis = v => {
    this.setState({
      visible: v,
    });
  };

  uploadGroup = () => {
    this.toggleVis(true);
  };

  handleCloseUpload = () => {
    this.toggleVis(false);
  };

  // 对数据进行校验
  verifyData = () => {
    const { groupSchemeData, columns } = this.state;
    // 1. 一个分组方案里只能是单纯组或者单纯样品
    // 2. 一个分组方案里面不能都是空
    console.log(groupSchemeData);
    console.log(columns);
    const datas = [...groupSchemeData];
    const cols = [...columns];
    const num = cols.length;
    for (let i = 2; i < num; i++) {
      const group = [];
      datas.forEach(item => {
        group.push(item[`header_${i}`]);
      });
      console.log(group);

      const validFalse1 = group.includes('当前样品') && group.includes(!'');
      const validFalse2 = group.every(item => item === '');
      const validFalse = validFalse1 || validFalse2;
      console.log(validFalse);
      if (!validFalse) {
        return message.error('存在空分组方案或者分组方案包含样品和组');
      }
      let formattedData = this.formatSubmitData();
      formattedData = formattedData && JSON.stringify(formattedData);
    }
    return true;
  };

  formatSubmitData = () => {
    const { groupSchemeData, columns } = this.state;
    console.log(columns);
    console.log(groupSchemeData);
    // 数据整理
    let tableHeard = [];
    columns.forEach((item, index) => {
      if (index !== 0 && typeof item.id === 'number') {
        tableHeard = [
          ...tableHeard,
          { groupSchemeName: item.dupTitle, sampleList: [], groupList: [] },
        ];
      }
    });

    for (let i = 2; i < groupSchemeData.length + 2; i++) {
      if (!tableHeard[i - 2]) return false;
      // eslint-disable-next-line no-loop-func
      groupSchemeData.forEach(item => {
        if (item[`header_${i}`] === '') return;
        if (item[`header_${i}`] === '当前样品') {
          tableHeard[i - 2].sampleList.push({
            sampleId: item.metadataSampleId,
            sampleAlias: item.sampleName,
          });
        } else {
          tableHeard[i - 2].groupList.push({
            groupName: item[`header_${i}`],
            color: item[`color_${i}`],
            sampleList: [],
          });
          tableHeard[i - 2].groupList.forEach(gro => {
            if (gro.groupName === item[`header_${i}`]) {
              gro.sampleList.push({
                sampleId: item.metadataSampleId,
                sampleAlias: item.sampleName,
              });
            }
          });
        }
      });
    }

    console.log(tableHeard);
    return tableHeard;
  };

  render() {
    let tableWidth = 0;
    const { groupSchemeData, visible, columns } = this.state;
    console.log(columns);
    console.log(groupSchemeData);

    // 数据整理
    let tableHeard = [];
    columns.forEach((item, index) => {
      if (index !== 0 && typeof item.id === 'number') {
        tableHeard = [
          ...tableHeard,
          { groupSchemeName: item.dupTitle, sampleList: [], groupList: [] },
        ];
      }
    });

    console.log(tableHeard);
    for (let i = 2; i < groupSchemeData.length + 2; i++) {
      if (!tableHeard[i - 2]) return false;
      // eslint-disable-next-line no-loop-func
      groupSchemeData.forEach(item => {
        if (item[`header_${i}`] === '') return;
        if (item[`header_${i}`] === '当前样品') {
          tableHeard[i - 2].sampleList.push({
            sampleId: item.metadataSampleId,
            sampleAlias: item.sampleName,
          });
        } else {
          tableHeard[i - 2].groupList.push({
            groupName: item[`header_${i}`],
            color: item[`color_${i}`],
            sampleList: [],
          });
          tableHeard[i - 2].groupList.forEach(gro => {
            if (gro.groupName === item[`header_${i}`]) {
              gro.sampleList.push({
                sampleId: item.metadataSampleId,
                sampleAlias: item.sampleName,
              });
            }
          });
        }
      });
    }

    console.log(tableHeard);

    columns.map(col => {
      if (!col.width) {
        // eslint-disable-next-line
        col.width = 100;
      }
      tableWidth += col.width;
      return true;
    });
    return (
      <div>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginBottom: 10 }}
        >
          <Button onClick={this.uploadGroup} type="primary">
            <UploadOutlined />
            上传
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={groupSchemeData}
          pagination={false}
          scroll={{ x: tableWidth }}
        />

        <Button onClick={this.verifyData} type="primary">
          提交
        </Button>

        {visible && <GroupUpload closeUpload={this.handleCloseUpload} />}
      </div>
    );
  }
}

export default connect(({ project }) => ({
  project,
}))(SampleGroup);
