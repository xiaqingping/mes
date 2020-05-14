/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Table, Button, Modal, AutoComplete, Popover, message } from 'antd';
import { UploadOutlined, PlusSquareOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';
import './index.less';
import { connect } from 'dva';
import classnames from 'classnames';
import GroupUpload from '../UploadSequenceFile/index';

const { confirm } = Modal;
const { Option } = AutoComplete;
/**
 * 样品分组组件 渲染样品分组table
 */
class SampleGroup extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    let tableDatas = [];
    let sampleLists = [];
    if (nextProps.paramList.paramValue && typeof nextProps.paramList.paramValue === 'string') {
      tableDatas = JSON.parse(nextProps.paramList.paramValue);
    } else {
      tableDatas = nextProps.paramList.paramValue;
    }
    if (nextProps.sampleList && typeof nextProps.sampleList === 'string') {
      sampleLists = JSON.parse(nextProps.sampleList);
    } else {
      sampleLists = nextProps.sampleList;
    }
    return {
      tableData: tableDatas || [],
      sampleList: sampleLists || [],
      // TODO: 提交时一定要记得改过来
      disabled: nextProps.disabled,
      // disabled: false,
    };
  }

  state = {
    disabled: false,
    visible: false,
    modalVisible: false, // 确认框的显示和隐藏
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

  /**
   * 组件校验是否通过
   */
  validPass = null;

  /**
   * 组件校验校验失败信息
   */
  errMessage = null;

  /**
   * table第一列
   */
  firstColumn = {
    id: 1,
    title: '样品',
    dataIndex: 'sampleName',
    key: 'sampleName',
    width: 100,
  };

  /**
   * table最后一列
   */
  lastColumn = {
    id: 'add',
    title: () => <PlusSquareOutlined onClick={this.handleAdd} />,
    dataIndex: 'add',
    key: 'add',
    width: 80,
  };

  /**
   * 转换分组方案数据， 因为数据是从父组件传过来的， 不好更改， 所以重新定义一个变量接收
   * 同时在挂载时抛出数据更新的方法给父组件。
   */
  componentDidMount() {
    const { tableData } = this.state;
    this.setState({
      groupSchemeData: tableData,
    });
    this.transformGroup(tableData);
    this.props.getFun(this.selectUpdateGroup);
  }

  /**
   * 每次数据改变时都将数据发送给父组件。防止点击提交时各组件提交数据冲突
   */
  sendDataOnChange = (groupSchemeData, columns) => {
    const list = this.verifyData(groupSchemeData, columns);
    const { paramKey, taskModelId } = this.props.paramList;
    const sendData = {
      paramKey,
      paramValue: JSON.stringify(list),
      taskModelId,
    };
    this.validPass = !!list;
    console.log(list, this.validPass, this.errMessage);
    this.props.getData(sendData, 'groupScheme', this.validPass, this.errMessage);
  };

  /**
   *  当样品改变时更新分组组件
   * @param {String} fromDidMount 一个从didMount出来的标识，如果有，则不触发校验，一进来只是为了同步样品，而不需要校验。
   * @param {Object} datas 分组方案表格数据
   * @param {Array} colus 分组方案列数据
   */
  selectUpdateGroup = (fromDidMount, datas, colus) => {
    // if (this.state.disabled) return; // 如果是查看的化就不需要做任何操作
    const { sampleList } = this.state;
    let groupSchemeData;
    let columns;
    if (datas) {
      groupSchemeData = datas;
      columns = colus;
    } else {
      groupSchemeData = this.state.groupSchemeData;
      columns = this.state.columns;
    }
    const selList = [...sampleList];
    const groupList = [...groupSchemeData];
    const columns1 = JSON.parse(JSON.stringify(columns));
    const columns2 = [...columns];
    const cols = columns.map(item => item.dataIndex);
    const colLen = cols.slice(1, cols.length - 1);
    const groupData = [];
    selList.map(item => {
      let newRow = {};
      newRow = {
        sampleId: item.id,
        sampleName: item.sampleAlias || item.sampleName,
        sampleAlias: item.sampleAlias,
      };
      // map一下分组数据
      const mapGro = {};
      groupList.forEach(gro => {
        mapGro[gro.sampleId] = gro;
      });
      if (mapGro[item.id]) {
        // 这里当样品选择框修改别名时候， 分组数据并没有刷新，因为这边是直接copy过来的。
        newRow = mapGro[item.id];
        // 添加这行就可以解决上面的问题
        newRow.sampleName = item.sampleAlias || item.sampleName;
        newRow.sampleAlias = item.sampleAlias;
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
    console.log(groupData);
    if (!fromDidMount) {
      this.sendDataOnChange(groupData, columns2);
    }
  };

  /**
   * 转换分组方案数据
   */
  transformGroup = data => {
    const { columns } = this.state;
    const { sampleList } = this.state;
    const cols = [...columns];
    const titleName = 'groupSchemeName';
    // 取出 表头
    const newColumns = this.getTableHeaderData(data, cols, titleName);
    // // 取出 行数据
    const rowData = this.getRowDataGroup(data, sampleList, newColumns);
    // // 填充行数据
    const newData = this.getFillData(data, rowData, newColumns);
    // 将所有的颜色放到仓库里.
    this.pushColorsToStore(newData);
    // 保存 分组 表头数据
    this.setState(
      {
        groupSchemeData: newData,
        columns: newColumns,
      },
      // () => {
      //   this.selectUpdateGroup('fromDidMount');
      // },
    );
    console.log(newData);
    console.log(newColumns);
    this.selectUpdateGroup('fromDidMount', newData, newColumns);
  };

  /**
   * 将颜色放到model里
   * @param {Object} newData 转换成的横向数据
   */
  pushColorsToStore = newData => {
    const { sampleList } = this.state;
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
    // 因为样品选择和分组方案加载完成时都会设置颜色store， 为防止覆盖，所以才这样写
    const sampleColors = [];
    sampleList.forEach(item => {
      sampleColors.push(item.color);
    });
    this.setColorStore([...colorStore, ...sampleColors]);
  };

  /**
   * 更新model颜色数据
   * @param {Array} colorStore 新的color集合
   */
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
        if (groupItem.groups !== null && groupItem.groups.length !== 0) {
          // 分组列表遍历
          groupItem.groups.forEach(groItem => {
            // 分组下的样品列表遍历
            groItem.samples.forEach(samItem => {
              // 找到对应的样品行
              if (rowItem.sampleId === samItem.sampleId) {
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
            if (rowItem.sampleId === samItem.sampleId) {
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
      if (groupItem.samples === null || (groupItem.samples && !groupItem.samples.length)) {
        groupItem.groups.forEach(groItem => {
          groItem.samples.forEach(samItem => {
            samples.push(samItem);
          });
        });
      }
      // 分组方案下的 分组列表 为空
      if (groupItem.groups === null || (groupItem.groups && !groupItem.groups.length)) {
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
            newIt[groItem.dataIndex] = groItem.dupTitle;
            // newIt.id = groItem.id;
          });
          newIt.sampleName = it.sampleAlias || it.sampleName;
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

  /**
   * 每列的render返回dom结构。
   * @param {String} value 当前列的值
   * @param {Object} row 当前行数据
   * @param {Number} index 当前行号
   * @param {String} color1 当前列的color号比如：color_1
   * @param {String} col 当前列的列， 比如header_1
   */
  columnRender = (value, row, index, color1, col) => (
    <div
      style={{ display: 'flex' }}
      className={classnames('project_components_sample_group_render_wrap', {
        sample_select_input_disabled: this.state.disabled,
      })}
    >
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
              borderRadius: 2,
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
                borderRadius: 2,
              }}
            />
          </Popover>
        ))}
    </div>
  );

  /**
   * 获取的columns不能操作改写title， 所以需要在格式化columns之后重新 改写。
   * @param {Object} newColumns 之前生成的列
   */
  renderColumns = newColumns => {
    const { disabled } = this.state;
    const columns = newColumns.map((item, index) => {
      if (index) {
        const { title } = item;
        item.dupTitle = title;
        item.title = () => (
          <div className="project_manage_UI_sample_group_title" key={item.id}>
            <input
              style={{ width: '100%' }}
              defaultValue={title}
              onBlur={e => this.handleTitleBlur(e, item, index)}
              disabled={this.state.disabled}
            />

            {!disabled && (
              <span
                className="sample_group_table_title_close"
                onClick={() => this.removeColumn(item)}
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

  /**
   * 表头blur事件，修改表头， 更新columns数据
   * @param {Object} e blur事件对象
   * @param {Object} item 每列（column）对象
   * @param {Number} index 行号
   * @param {String} id 列的id
   */
  handleTitleBlur = (e, item, index, id) => {
    const { groupSchemeData, columns } = this.state;
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
    this.sendDataOnChange(groupSchemeData, cols);
  };

  /**
   * 删除列
   * @param {Object} item 每列（column）对象
   * @param {String} id 每列（column）的id
   */
  removeColumn = (item, id) => {
    const { groupSchemeData, columns } = this.state;
    let cols = [...columns];
    if (!item) {
      cols = cols.filter(v => v.id !== id);

      this.setState(
        {
          columns: cols,
        },
        // () => {
        //   this.sendDataOnChange();
        // },
      );
      this.sendDataOnChange(groupSchemeData, cols);
    } else {
      cols = cols.filter(v => v.id !== item.id);
      // 这里不光删除列， 同时也要删除表格数据，，删除掉每一个行的该分组方案下的组数据；
      const num = item.dataIndex.split('_')[1];
      const tableDatas = [...groupSchemeData];
      tableDatas.forEach(v => {
        const prop = `header_${num}`;
        delete v[prop];
        return v;
      });
      this.setState(
        {
          columns: cols,
          groupSchemeData: tableDatas,
        },
        // () => {
        //   this.sendDataOnChange();
        // },
      );
      this.sendDataOnChange(tableDatas, cols);
    }
  };

  /**
   * 选取颜色值
   * @param {String} color 回调的颜色对象
   * @param {String} value 当前单元格值
   * @param {Object} row 当前行数据
   * @param {Number} index 当前行下标
   * @param {String} col 当前列的列 header_xx
   * @param {String} color1 当前列的color号比如：color_1
   */
  handleColorChange = (color, value, row, index, col, color1) => {
    // ---------------------首先判断选择的颜色在model里是否有重复---------
    const { colorStore } = this.props.project;
    let colors = [...colorStore];
    let colorhex = color.hex.toUpperCase();
    console.log(colorStore);
    const repeat = colorStore.includes(colorhex);
    if (repeat) {
      message.warning('存在重复颜色，已为您随机生成一个颜色！');
      colorhex = getrandomColor();
    }
    colors.push(colorhex);
    Object.keys(row).forEach(key => {
      if (row[key] === value) {
        // const num = key.split('_')[1];
        // const colorName = `color_${num}`;
        // console.log(colorName);
        // debugger;
        colors = colors.filter(i => i !== row[color1]);
        row[color1] = colorhex;
      }
    });
    this.setColorStore(colors);
    const { groupSchemeData } = this.state;
    const groupData = [...groupSchemeData];
    groupData[index] = row;

    // 修改之后需要将当前列同组的颜色改成一样的
    this.setOtherSame(row, value, value, groupData, col, color1);
  };

  /**
   * 点击加号添加列
   */
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
            style={{ width: '100%' }}
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
    this.setState(
      {
        columns: cols,
        groupSchemeData: soure,
      },
      // () => {
      //   this.sendDataOnChange();
      // },
    );
    this.sendDataOnChange(soure, cols);
  };

  /**
   * 修改组名时的渲染内容
   */
  confirmGroupRender = (groupName, preGroupName) => (
    <div style={{ fontFamily: 'PingFangSC-Regular', fontSize: 14, color: 'rgba(0,0,0,.65)' }}>
      <div>
        点击“是”将分组“{preGroupName}”改为“{groupName}”
      </div>
      <div>点击“否”新增分组“{groupName}”</div>
    </div>
  );

  /**
   * 当前的是个组的时候, 先查看这一列是否有同样的祖名, 如果有则,值和颜色都跟这个组一样的, 并且设置表格数据
   * @param {Object} row 当前行的数据
   * @param {String} option blur之后的值， 即需要添加在select里的新的option
   * @param {Object} datas 分组的表格数据
   * @param {String} col 当前列的列 header_xx
   * @param {Number} index 当前行下标
   */
  judgeOptionAndColor = (row, option, datas, col, index) => {
    const { columns } = this.state;
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
    this.setState(
      {
        groupSchemeData: datas,
      },
      // () => {
      //   this.sendDataOnChange();
      // },
    );
    this.sendDataOnChange(datas, columns);
  };

  /**
   *  判断当前分组方案里是否有同名的组， 设置组名及颜色
   * @param {Object} row 当前行的数据
   * @param {String} value 当前单元格值
   * @param {String} option blur之后的值， 即需要添加在select里的新的option
   * @param {Object} datas 分组的表格数据
   * @param {String} col 当前列的列 header_xx
   * @param {String} color1 当前列的color号比如：color_1
   */
  setOtherSame = (row, value, option, datas, col, color1) => {
    // 先判断这列是否有同名的, 如果有, 则依照原来的, 如果没有就照自己的,
    const num = col.split('_')[1];
    datas.some(item => {
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
        // this.sendDataOnChange();
      },
    );
    this.sendDataOnChange(datas, columns2);
  };

  /**
   * 修改组名的弹框相关操作（点击是和否时的两中操作）
   * @param {Object} row 当前行的数据
   * @param {String} value 当前单元格值
   * @param {String} option blur之后的值， 即需要添加在select里的新的option
   * @param {Object} datas 分组的表格数据
   * @param {String} col 当前列的列 header_xx
   * @param {String} color1 当前列的color号比如：color_1
   * @param {Number} index 当前行下标
   */
  handleModalConfirm = (datas, row, option, value, col, index, color1) => {
    const confirm1 = confirm({
      title: (
        <div className="project_manage_group_scheme_modal_confirm_title">
          是否将分组“{value}”改为“{option}”？
          <a
            onClick={() =>
              this.destroyConfirm(confirm1, datas, row, option, value, col, index, color1)
            }
            className="modal_confirm_close"
          >
            ×
          </a>
        </div>
      ),
      className: 'project_manage_group_scheme_modal_confirm_title_wrap',
      bodyStyle: { paddingTop: 10 },
      icon: <QuestionCircleOutlined />,
      content: this.confirmGroupRender(option, value),
      cancelText: '否',
      okText: '是',
      onOk: () => {
        this.setOtherSame(row, value, option, datas, col, color1);
      },
      onCancel: () => {
        // 新增组名-- 如果新增的组名在这列存在, 那么颜色值都随之前的颜色随机生成一个,如果不存在颜色随机生成
        this.handleUpdateGroup(row, col, datas, option, index);
      },
    });
  };

  /**
   * 点击确认框的x 取消分组名的修改
   * @param {Object} confirm1 当前确认框对象
   */
  destroyConfirm = confirm1 => {
    confirm1.destroy();
    const { columns } = this.state;
    const columns1 = JSON.parse(JSON.stringify(columns));
    const columns2 = [...columns];
    this.setState(
      {
        columns: columns1,
      },
      () => {
        this.setState({
          columns: columns2,
        });
      },
    );
  };

  /**
   * 设置颜色和组名为空
   * @param {Object} row 当前行的数据
   * @param {String} value 当前单元格值
   * @param {String} option blur之后的值， 即需要添加在select里的新的option
   * @param {Object} datas 分组的表格数据
   * @param {String} col 当前列的列 header_xx
   * @param {String} color1 当前列的color号比如：color_1
   * @param {Number} index 当前行下标
   */
  setValueAndColorNone = (datas, row, option, col, index, color1) => {
    const { columns } = this.state;
    row[col] = option;
    row[color1] = '';
    datas[index] = row;
    this.setState(
      {
        groupSchemeData: datas,
      },
      // () => {
      //   this.sendDataOnChange();
      // },
    );
    this.sendDataOnChange(datas, columns);
  };

  /**
   * 选择组，blur 时候保存数据--- 当选择组的时候要加上默认的颜色
   * @param {String} e blur时的事件对象
   * @param {Object} row 当前行的数据
   * @param {String} value 当前单元格值
   * @param {Object} datas 分组的表格数据
   * @param {String} col 当前列的列 header_xx
   * @param {String} color1 当前列的color号比如：color_1
   * @param {Number} index 当前行下标
   */
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
          this.setValueAndColorNone(datas, row, option, col, index, color1);
        }
      } else if (!option) {
        this.setValueAndColorNone(datas, row, option, col, index, color1);
      }
    }

    this.setState({
      optionList: list,
    });
    return true;
  };

  /**
   * 修改组名
   */
  handleUpdateGroup = (row, col, datas, option, index) => {
    this.judgeOptionAndColor(row, option, datas, col, index);
  };

  /**
   * 修改组名时的下来框
   * @param {Object} row 当前行的数据
   * @param {String} value 当前单元格值
   * @param {String} col 当前列的列 header_xx
   * @param {String} color1 当前列的color号比如：color_1
   * @param {Number} index 当前行下标
   */
  selectRender = (value, row, index, color1, col) => {
    const { optionList, disabled } = this.state;
    return (
      <AutoComplete
        style={{ width: '70%' }}
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

  /**
   * 设置上传modal的visible
   * @param {Boolean} v 是否开启
   */
  toggleVis = v => {
    this.setState({
      visible: v,
    });
  };

  /**
   * 上传分组方案
   */
  uploadGroup = () => {
    this.toggleVis(true);
  };

  /**
   * 关闭上传分组方案弹框
   */
  handleCloseUpload = () => {
    this.toggleVis(false);
  };

  /**
   * 对数据进行校验
   */

  verifyData = (groupSchemeData, columns) => {
    // const { groupSchemeData, columns } = this.state;
    const { isRequired } = this.props.paramList;
    // 1. 一个分组方案里只能是单纯组或者单纯样品
    // 2. 一个分组方案里面不能都是空

    const datas = [...groupSchemeData];
    const cols = [...columns];
    const num = cols.length;
    if ((isRequired === 'true' && num === 2) || (isRequired === 'true' && !datas.length)) {
      this.errMessage = '分组方案为必须项，请设置分组方案！';
      // message.error('分组方案为必须，请设置分组方案！');
      return false;
    }
    for (let i = 2; i < num; i++) {
      const group = [];
      datas.forEach(item => {
        group.push(item[`header_${i}`]);
      });
      const hasOtherValue = group.some(item => item && item !== '当前样品');
      const validTrue1 = group.includes('当前样品') && hasOtherValue;
      const validTrue2 = group.every(item => item === '');
      const validFalse = validTrue1 || validTrue2;
      this.validPass = !validFalse;
      if (validTrue1) this.errMessage = '分组方案中同时包含当前样品和组';
      if (validTrue2) this.errMessage = '存在空的分组方案';
      if (validFalse) {
        // message.error('分组方案包含样品和组');
        return false;
      }
    }
    const formattedData = this.formatSubmitData(groupSchemeData, columns);
    return formattedData;
  };

  /**
   * 提交数据格式化
   */
  formatSubmitData = (groupSchemeData, columns) => {
    // const { groupSchemeData, columns } = this.state;
    console.log(groupSchemeData);
    // 数据整理
    let tableHeard = [];
    columns.forEach((item, index) => {
      if (index !== 0 && typeof item.id === 'number') {
        tableHeard = [...tableHeard, { groupSchemeName: item.dupTitle, samples: [], groups: [] }];
      }
    });

    for (let i = 2; i < tableHeard.length + 2; i++) {
      if (!tableHeard[i - 2]) return false;
      // eslint-disable-next-line no-loop-func
      groupSchemeData.forEach(item => {
        if (item[`header_${i}`] === '') return;
        if (item[`header_${i}`] === '当前样品') {
          tableHeard[i - 2].samples.push({
            sampleId: item.sampleId,
            sampleAlias: item.sampleAlias || null,
            sampleName: item.sampleName,
          });
        } else {
          const groNameList = tableHeard[i - 2].groups.map(g => g.groupName);
          if (!groNameList.includes(item[`header_${i}`])) {
            // 如果没有相同组名的话, 就push进groupList里,
            tableHeard[i - 2].groups.push({
              groupName: item[`header_${i}`],
              color: item[`color_${i}`],
              samples: [],
            });

            tableHeard[i - 2].groups.forEach(gro => {
              if (gro.groupName === item[`header_${i}`]) {
                gro.samples.push({
                  sampleId: item.sampleId,
                  sampleAlias: item.sampleAlias || null,
                  sampleName: item.sampleName,
                });
              }
            });
          } else {
            // 如果是相同组名的话, 应该将sample的信息push到 samples 里面
            tableHeard[i - 2].groups.forEach(group => {
              if (group.groupName === item[`header_${i}`]) {
                group.samples.push({
                  sampleId: item.sampleId,
                  sampleAlias: item.sampleAlias || null,
                  sampleName: item.sampleName,
                });
              }
            });
          }
        }
      });
    }

    return tableHeard;
  };

  /**
   *  将每个对象的head和header的值拼接为字符串作为map的key用来判断是否出现过相同的head
   * @param {Object} item 从上传获取来的每一条数据对象
   * @param {String} head 获取到的header_xx
   */
  getMapKey = (item, head) => `${head}_${item[head]}`;

  /**
   *  根据head找到color
   *  @param {String} head 获取到的header_xx
   */
  colorFieldByHead = head => `color_${head.split('_')[1]}`;

  /**
   * 获取从上传来的数据.
   * @param {Object} data 获取到的表格信息
   * @param {Object} headData 获取到的表头信息
   */
  getDataFromUpload = (data, headData) => {
    const { groupSchemeData } = this.state;
    const { colorStore } = this.props.project;
    let cols = [this.firstColumn];
    const dataFromUpload = [...data];
    dataFromUpload.forEach(item => {
      groupSchemeData.forEach(row => {
        if (item[0] === row.sampleName) {
          const num = Object.keys(item).length;
          item.sampleName = row.sampleName;
          item.sampleId = row.sampleId;
          for (let i = 1; i < num; i++) {
            item[`header_${i + 1}`] = item[i];
            const color = getrandomColor();
            if (item[i] === '当前样品' || item[i] === '') {
              item[`color_${i + 1}`] = '';
            } else {
              item[`color_${i + 1}`] = color;
              this.setColorStore([...colorStore, color]);
            }
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
          item[this.colorFieldByHead(head)] = head2color.get(this.getMapKey(item, head));
          return;
        }
        // 是map中没出现过的,那么就保存起来
        head2color.set(this.getMapKey(item, head), item[this.colorFieldByHead(head)]);
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
        this.setState(
          {
            columns: cols,
          },
          // 增加这行就可以实现，上传分组方案后， 样品里有但分组方案里没有的样品也会在分组方案表格里，(以后有整个需求可以加上)
          // () => this.selectUpdateGroup(),
        );

        // this.sendDataOnChange();
      },
    );
    this.selectUpdateGroup(dataFromUpload, cols);
    this.sendDataOnChange(dataFromUpload, cols);
  };

  render() {
    let tableWidth = 0;
    const { groupSchemeData, visible, columns, loading, disabled, modalVisible } = this.state;
    const { paramName } = this.props.paramList;
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
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 'bold', marginTop: 5 }}>{paramName}</div>
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
        {modalVisible && (
          <Modal title="Basic Modal" visible onOk={this.handleOk} onCancel={this.handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        )}
      </div>
    );
  }
}

export default connect(({ project }) => ({
  project,
}))(SampleGroup);
