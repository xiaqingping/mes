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
  static getDerivedStateFromProps(nextProps) {
    return {
      tableData: nextProps.groupSchemeData || [],
      sampleList: nextProps.sampleList || [],
      disabled: nextProps.disabled,
    };
  }

  state = {
    disabled: false,
    visible: false,
    loading: false,
    groupSchemeData: [], // 分组方案数据
    tableData: [],
    sampleList: [],
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

  firstColumn = {
    id: 1,
    title: '样品',
    dataIndex: 'sampleName',
    key: 'sampleName',
    width: 100,
  };

  lastColumn = {
    id: 'add',
    title: () => <PlusSquareOutlined onClick={this.handleAdd} />,
    dataIndex: 'add',
    key: 'add',
    width: 80,
  };

  componentDidMount() {
    // 转换分组方案数据
    const { tableData } = this.state;
    this.setState(
      {
        groupSchemeData: tableData,
      },
      () => {
        this.transformGroup(this.state.groupSchemeData);
      },
    );
    this.props.getFun(this.selectUpdateGroup);
  }

  componentDidUpdate(props) {
    if (props.submitStatus !== this.props.submitStatus) {
      const list = this.verifyData();
      console.log(list);
      const { paramKey, taskModelId } = props;
      const sendData = {
        paramKey,
        paramValue: JSON.stringify(list),
        taskModelId,
      };
      this.props.getData(sendData, 'groupScheme');
    }
  }

  selectUpdateGroup = () => {
    const { sampleList, groupSchemeData, columns } = this.state;
    const selList = [...sampleList];
    const groupList = [...groupSchemeData];
    const columns1 = JSON.parse(JSON.stringify(columns));
    const columns2 = [...columns];
    const cols = columns.map(item => {
      return item.dataIndex;
    });
    const colLen = cols.slice(1, cols.length - 1);
    const groupData = [];
    selList.map(item => {
      let newRow = {};
      newRow = { metadataSampleId: item.id, sampleName: item.sampleAlias || item.sampleName };
      // map一下分组数据
      const mapGro = {};
      groupList.forEach(gro => {
        mapGro[gro.metadataSampleId] = gro;
      });
      if (mapGro[item.id]) {
        newRow = mapGro[item.id];
      } else {
        colLen.forEach(col => {
          newRow[col] = '';
        });
      }
      groupData.push(newRow);

      return newRow;
    });

    this.setState(
      {
        groupSchemeData: groupData,
        columns: columns1,
      },
      () => {
        this.setState({
          columns: columns2,
        });
      },
    );
  };

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
      groupSchemeData: newData,
      columns: newColumns,
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
    const { disabled } = this.state;
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
        width: 150,
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
    if (disabled) {
      renderColumns = [...renderColumns];
    } else {
      renderColumns = [...renderColumns, this.lastColumn];
    }

    return renderColumns;
  };

  // 每列的render返回dom结构。
  columnRender = (value, row, index, color1, col) => (
    <div style={{ display: 'flex' }} className="project_components_sample_group_render_wrap">
      {/* <span style={{ marginRight: 10 }}>{value}</span> */}
      {this.selectRender(value, row, index, color1, col)}
      {row[color1] &&
        (this.state.disabled ? (
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: row[color1],
              position: 'relative',
              marginLeft: 10,
              marginTop: 6,
            }}
          />
        ) : (
          <Popover
            overlayClassName="project_manage_sample_ui_select"
            overlayStyle={{ padding: 0 }}
            content={
              <SketchPicker
                color={row[color1]}
                onChangeComplete={color =>
                  this.handleColorChange(color, value, row, index, col, color1)
                }
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
                marginLeft: 10,
                marginTop: 6,
              }}
            />
          </Popover>
        ))}
    </div>
  );

  // 获取的columns不能操作改写title， 所以需要在格式化columns之后重新 改写。
  renderColumns = newColumns => {
    const { disabled } = this.state;
    const columns = newColumns.map((item, index) => {
      if (index) {
        const { title } = item;
        item.dupTitle = title;
        item.title = () => (
          <div className="project_manage_UI_sample_group_title">
            <input
              style={{ fontWeight: 'bolder', width: '100%' }}
              defaultValue={title}
              onBlur={e => this.handleTitleBlur(e, item, index)}
              disabled={this.state.disabled}
            />

            {!disabled && (
              <span
                className="sample_group_table_title_close"
                onClick={() => this.removeColumn(item)}
                // style={{ position: 'absolute', right: 0, top: 0 }}
              >
                ×
              </span>
            )}
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

  handleColorChange = (color, value, row, index, col, color1) => {
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

    // 修改之后需要将当前列同组的颜色改成一样的
    this.setOtherSame(row, value, value, groupData, col, index, color1);
  };

  // 添加列
  handleAdd = () => {
    const { columns, groupSchemeData, disabled } = this.state;
    let cols = columns.slice(0, columns.length - 1);
    const ids = cols.map(item => item.id);
    const max = Math.max.apply(null, ids);
    const newCol = {
      id: max + 1,
      width: 150,
      title: () => (
        <div className="project_manage_UI_sample_group_title">
          <input
            style={{ fontWeight: 'bolder', width: '100%' }}
            defaultValue={`分组方案_${max + 1}`}
            onBlur={e => this.handleTitleBlur(e, null, null, max + 1)}
          />
          {!disabled && (
            <span
              className="sample_group_table_title_close"
              onClick={() => this.removeColumn(null, max + 1)}
            >
              ×
            </span>
          )}
        </div>
      ),
      dupTitle: `分组方案_${max + 1}`,

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

  // 当前的是个组的时候, 先查看这一列是否有同样的祖名, 如果有则,值和颜色都跟这个组一样的, 并且设置表格数据
  judgeOptionAndColor = (row, option, datas, col, index) => {
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
  };

  setOtherSame = (row, value, option, datas, col, index, color1) => {
    // 先判断这列是否有同名的, 如果有, 则依照原来的, 如果没有就照自己的,
    const num = col.split('_')[1];
    const hasSame = datas.some(item => {
      if (item[col] === option) {
        // eslint-disable-next-line
        row[`color_${num}`] = item[`color_${num}`];
      }
      return item[col] === option;
    });
    // 紧接着把原来所有同名组改成相同组名以及颜色
    datas.forEach(item => {
      if (item[col] === value) {
        const color = row[color1];
        // eslint-disable-next-line
        item[col] = option;
        // eslint-disable-next-line
        item[`color_${num}`] = color;
        return item;
      }
      return item;
    });
    const { columns } = this.state;
    const columns1 = JSON.parse(JSON.stringify(columns));
    const columns2 = [...columns];
    this.setState(
      {
        groupSchemeData: datas,
        columns: columns1,
      },
      () => {
        this.setState({
          columns: columns2,
        });
      },
    );
  };

  handleModalConfirm = (datas, row, option, value, col, index, color1) => {
    confirm({
      title: `是否将分组“${value}”改为“${option}”？`,
      icon: <ExclamationCircleOutlined />,
      content: this.confirmGroupRender(option, value),
      cancelText: '否',
      okText: '是',
      onOk: () => {
        this.setOtherSame(row, value, option, datas, col, index, color1);
      },
      onCancel: () => {
        // 新增组名-- 如果新增的组名在这列存在, 那么颜色值都随之前的颜色随机生成一个,如果不存在颜色随机生成
        this.handleUpdateGroup(row, col, datas, option, index);
      },
    });
  };

  // 设置颜色和组名为空
  setValueAndColorNone = (datas, row, option, value, col, index, color1) => {
    row[col] = option;
    row[color1] = '';
    datas[index] = row;
    this.setState({
      groupSchemeData: datas,
    });
  };

  // 选择组，blur 时候保存数据--- 当选择组的时候要加上默认的颜色
  handleGroupSelectBlur = (e, value, row, index, col, color1) => {
    const option = e.target.value;
    const { optionList } = this.state;
    let list = [...optionList];

    if (!list.includes(option) && option) {
      list = [...list, option];
    }
    const { groupSchemeData } = this.state;
    const datas = [...groupSchemeData];
    if (option !== value) {
      // 当前有值
      if (option) {
        if (option !== '当前样品') {
          if (!value) {
            // 当前是个组, 之前没有值
            this.judgeOptionAndColor(row, option, datas, col, index);
          } else if (value === '当前样品') {
            // 当前是个组, 之前是'当前样品'
            this.judgeOptionAndColor(row, option, datas, col, index);
          } else if (value !== '当前样品') {
            // 当前是个组, 之前也是个组----弹框确认
            this.handleModalConfirm(datas, row, option, value, col, index, color1);
          }
        } else if (option === '当前样品') {
          this.setValueAndColorNone(datas, row, option, value, col, index, color1);
        }
      } else if (!option) {
        this.setValueAndColorNone(datas, row, option, value, col, index, color1);
      }
    }

    this.setState({
      optionList: list,
    });
    return true;
  };

  // 修改组名
  handleUpdateGroup = (row, col, datas, option, index) => {
    this.judgeOptionAndColor(row, option, datas, col, index);
  };

  selectRender = (value, row, index, color1, col) => {
    const { optionList, disabled } = this.state;
    return (
      <AutoComplete
        style={{ width: '60%' }}
        onBlur={e => this.handleGroupSelectBlur(e, value, row, index, col, color1)}
        defaultValue={value}
        disabled={disabled}
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
    let formattedData;
    const datas = [...groupSchemeData];
    const cols = [...columns];
    const num = cols.length;

    for (let i = 2; i < num; i++) {
      const group = [];
      datas.forEach(item => {
        group.push(item[`header_${i}`]);
      });
      const hasOtherValue = group.some(item => {
        return item && item !== '当前样品';
      });
      const validTrue1 = group.includes('当前样品') && hasOtherValue;
      const validTrue2 = group.every(item => item === '');
      const validFalse = validTrue1 || validTrue2;
      if (validFalse) {
        return message.error('存在空分组方案或者分组方案包含样品和组');
      }
    }
    formattedData = this.formatSubmitData();
    formattedData = formattedData && JSON.stringify(formattedData);
    return formattedData;
  };

  // 提交数据格式化,
  formatSubmitData = () => {
    const { groupSchemeData, columns } = this.state;
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

    return tableHeard;
  };

  // 将每个对象的head和header的值拼接为字符串作为map的key用来判断是否出现过相同的head
  getMapKey = (item, head) => {
    return `${head}_${item[head]}`;
  };

  // 根据head找到color
  colorFieldByHead = (item, head) => {
    return `color_${head.split('_')[1]}`;
  };

  // 获取从上传来的数据.
  getDataFromUpload = (data, headData) => {
    const { groupSchemeData } = this.state;
    let cols = [this.firstColumn];
    const dataFromUpload = [...data];
    dataFromUpload.forEach(item => {
      groupSchemeData.forEach(row => {
        if (item[0] === row.sampleName) {
          const num = Object.keys(item).length;
          item.sampleName = row.sampleName;
          item.metadataSampleId = row.metadataSampleId;
          for (let i = 1; i < num; i++) {
            item[`header_${i + 1}`] = item[i];
            item[`color_${i + 1}`] = item[i] === '当前样品' ? '' : getrandomColor();
            // item[`color_${i + 1}`] = getrandomColor();
          }
        }
      });
    });
    const headers = [];
    Object.keys(dataFromUpload[0]).forEach(key => {
      if (key.indexOf('header') !== -1) {
        headers.push(key);
      }
    });
    Object.values(headData).forEach((head, idx) => {
      if (idx > 0) {
        const col = {
          id: idx + 2,
          title: head,
          dupTitle: head,
          width: 150,
          dataIndex: `header_${idx + 1}`,
          key: `header_${idx + 1}`,
          render: (value, row, index) => {
            const color1 = `color_${idx + 1}`;
            return this.columnRender(value, row, index, color1, `header_${idx + 1}`);
          },
        };
        cols.push(col);
      }
    });
    const head2color = new Map();
    // 遍历对象数组
    dataFromUpload.forEach(item => {
      // 遍历对象的每个header
      headers.forEach(head => {
        // 如果head在map中存在 说明有重复的，那么就设定为第一次出现的值
        if (head2color.has(this.getMapKey(item, head))) {
          item[this.colorFieldByHead(item, head)] = head2color.get(this.getMapKey(item, head));
          return;
        }
        // 是map中没出现过的,那么就保存起来
        head2color.set(this.getMapKey(item, head), item[this.colorFieldByHead(item, head)]);
      });
    });

    const renderColumns = this.renderColumns(cols);
    cols = [...renderColumns, this.lastColumn];
    const cols1 = JSON.parse(JSON.stringify(cols));
    this.setState(
      {
        groupSchemeData: dataFromUpload,
        columns: cols1,
      },
      () => {
        this.setState({
          columns: cols,
        });
      },
    );
  };

  render() {
    let tableWidth = 0;
    const { groupSchemeData, visible, columns, loading, disabled } = this.state;
    console.log(columns);
    columns.map(col => {
      if (!col.width) {
        // eslint-disable-next-line
        col.width = 150;
      }
      tableWidth += col.width;
      return true;
    });

    return (
      <div className="project_manage_sample_scheme_table_wrap">
        {!disabled && (
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginBottom: 10 }}
          >
            <Button onClick={this.uploadGroup} type="primary">
              <UploadOutlined />
              上传
            </Button>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={groupSchemeData}
          pagination={false}
          scroll={{ x: tableWidth }}
          loading={loading}
        />
        {visible && (
          <GroupUpload
            closeUpload={this.handleCloseUpload}
            groupTableData={groupSchemeData}
            getData={this.getDataFromUpload}
          />
        )}
      </div>
    );
  }
}

export default connect(({ project }) => ({
  project,
}))(SampleGroup);
