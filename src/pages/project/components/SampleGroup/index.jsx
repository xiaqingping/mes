import React from 'react';
import { Table, Select, Button, Modal, Input, AutoComplete, Popover } from 'antd';
import { UploadOutlined, PlusSquareOutlined, CloseOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';
import './index.less';
import GroupUpload from '../UploadSequenceFile/index';

const { Option } = AutoComplete;

class SampleSelect extends React.Component {
  state = {
    visible: false,

    tableData: [
      // 第一个分组方案
      {
        groupSchemeName: 'groupingscheme1',
        groupList: [
          {
            groupName: 'group1',
            groupColour: 'blue',
            // 组里面包含的样品列表
            sampleList: [
              {
                metadataSampleId: 'db820c4a2a15401f95943594f58b1084',
                sampleAlias: '别名001',
              },
            ],
          },
          {
            groupName: 'group2',
            groupColour: 'red',
            sampleList: [
              {
                metadataSampleId: 'b6545cf90ce340d8aa0c464f2fd422b7',
                sampleAlias: '别名002',
              },
            ],
          },
          {
            groupName: 'group3',
            groupColour: 'gray',
            sampleList: [
              {
                metadataSampleId: 'f98db018780144c1aec7444bf0a25622',
                sampleAlias: '别名003',
              },
            ],
          },
        ],
      },
      // 第二个分组方案
      {
        groupSchemeName: 'groupingscheme2',
        sampleList: [
          {
            metadataSampleId: 'db820c4a2a15401f95943594f58b1084',
            sampleAlias: '别名001',
          },
          {
            metadataSampleId: 'b6545cf90ce340d8aa0c464f2fd422b7',
            sampleAlias: '别名002',
          },
          {
            metadataSampleId: 'f98db018780144c1aec7444bf0a25622',
            sampleAlias: '别名003',
          },
        ],
        groupList: null,
      },
    ],

    sampleList: [
      {
        id: '586bf01efbb34d2c9b1911fad3baf174',
        sampleCode: '123456789',
        sampleName: '未分组样品',
        sampleAlias: '别名004',
        colour: 'purple',
        sampleSequenceCount: 15,
        sampleLengthTotal: 9000,
        sampleLengthAve: 600.0,
        sampleLengthMax: 4000,
        sampleLengthMin: 1000,
        sequenceFileCount: 2,
        sequenceFileList: [
          {
            sequenceFileId: '123456789987654321',
            sequenceFileName: '123',
            sampleSequenceCount: 5,
            sampleLengthMin: 1000,
            sampleLengthMax: 2000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 3000,
          },
          {
            sequenceFileId: '1234567899876543210',
            sequenceFileName: '3211245',
            sampleSequenceCount: 10,
            sampleLengthMin: 2000,
            sampleLengthMax: 4000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 6000,
          },
        ],
      },
      {
        id: 'b6545cf90ce340d8aa0c464f2fd422b7',
        sampleCode: '456',
        sampleName: '样品B',
        sampleAlias: '别名002',
        colour: 'red',
        sampleSequenceCount: 15,
        sampleLengthTotal: 9000,
        sampleLengthAve: 600.0,
        sampleLengthMax: 4000,
        sampleLengthMin: 1000,
        sequenceFileCount: 2,
        sequenceFileList: [
          {
            sequenceFileId: '1234567899876543210',
            sequenceFileName: 'gfdbhg',
            sampleSequenceCount: 10,
            sampleLengthMin: 2000,
            sampleLengthMax: 4000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 6000,
          },
          {
            sequenceFileId: '123456789987654321',
            sequenceFileName: 'swdff',
            sampleSequenceCount: 5,
            sampleLengthMin: 1000,
            sampleLengthMax: 2000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 3000,
          },
        ],
      },
      {
        id: 'db820c4a2a15401f95943594f58b1084',
        sampleCode: '456',
        sampleName: '样品A',
        sampleAlias: '别名001',
        colour: 'blue',
        sampleSequenceCount: 15,
        sampleLengthTotal: 9000,
        sampleLengthAve: 600.0,
        sampleLengthMax: 4000,
        sampleLengthMin: 1000,
        sequenceFileCount: 2,
        sequenceFileList: [
          {
            sequenceFileId: '1234567899876543210',
            sequenceFileName: 'bacd',
            sampleSequenceCount: 5,
            sampleLengthMin: 1000,
            sampleLengthMax: 2000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 3000,
          },
          {
            sequenceFileId: '123456789987654321',
            sequenceFileName: 'abc',
            sampleSequenceCount: 10,
            sampleLengthMin: 2000,
            sampleLengthMax: 4000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 6000,
          },
        ],
      },
      {
        id: 'f98db018780144c1aec7444bf0a25622',
        sampleCode: '456',
        sampleName: '样品C',
        sampleAlias: '别名003',
        colour: 'gray',
        sampleSequenceCount: 15,
        sampleLengthTotal: 9000,
        sampleLengthAve: 600.0,
        sampleLengthMax: 4000,
        sampleLengthMin: 1000,
        sequenceFileCount: 2,
        sequenceFileList: [
          {
            sequenceFileId: '1234567899876543210',
            sequenceFileName: 'hjdhfjdalja',
            sampleSequenceCount: 10,
            sampleLengthMin: 2000,
            sampleLengthMax: 4000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 6000,
          },
          {
            sequenceFileId: '123456789987654321',
            sequenceFileName: 'hjdhfjdalja',
            sampleSequenceCount: 5,
            sampleLengthMin: 1000,
            sampleLengthMax: 2000,
            sampleLengthAve: 600.0,
            sampleLengthTotal: 3000,
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
    const newData = this.getFillData(data, rowData);

    // 保存 分组 表头数据
    this.setState({
      columns: newColumns,
      groupSchemeData: newData,
    });
  };

  /**
   * 填充行数据
   * groupList  分组方案数据
   * rowData 行数据 有表头字段但数据为空
   */
  getFillData = (groupList, rowData) => {
    // 分组方案遍历
    groupList.forEach(groupItem => {
      const { groupSchemeName } = groupItem;

      // 行数据遍历
      rowData.forEach(rowItem => {
        // 分组方案下的 分组列表不为空
        if (groupItem.groupList && groupItem.groupList.length) {
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
                    rowItem[color] = groItem.groupColour;
                    rowItem[key] = groItem.groupName;
                  }
                  return false;
                });
              }
            });
          });
        }

        // 分组方案下的 样品列表不为空
        if (groupItem.sampleList && groupItem.sampleList.length) {
          groupItem.sampleList.forEach(samItem => {
            if (rowItem.metadataSampleId === samItem.metadataSampleId) {
              Object.keys(rowItem).map(key => {
                if (rowItem[key] === groupSchemeName) {
                  const num = key.split('_')[1];
                  const color = `color_${num}`;
                  rowItem[color] = '';
                  rowItem[key] = '当前样品';
                }
                return false;
              });
            }
          });
        }
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
  columnRender = (value, row, index, color1, col) => {
    return (
      <div style={{ display: 'flex' }} className="project_components_sample_group_render_wrap">
        {/* <span style={{ marginRight: 10 }}>{value}</span> */}
        {this.selectRender(value, row, index, color1, col)}
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
      </div>
    );
  };

  // 获取的columns不能操作改写title， 所以需要在格式化columns之后重新 改写。
  renderColumns = newColumns => {
    const columns = newColumns.map((item, index) => {
      if (index) {
        const { title } = item;
        item.dupTitle = title;
        item.title = () => {
          return (
            <div className="project_manage_UI_sample_group_title">
              <input defaultValue={title} onBlur={e => this.handleTitleBlur(e, item, index)} />

              <CloseOutlined onClick={() => this.removeColumn(item)} />
            </div>
          );
        };
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
      cols = cols.filter(v => {
        return v.id !== id;
      });

      this.setState({
        columns: cols,
      });
    } else {
      cols = cols.filter(v => {
        return v.id !== item.id;
      });
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
    Object.keys(row).forEach(key => {
      if (row[key] === value) {
        const num = key.split('_')[1];
        const colorName = `color_${num}`;
        row[colorName] = color.hex;
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
      title: () => {
        return (
          <div className="project_manage_UI_sample_group_title">
            <input
              defaultValue={`分组方案_${max + 1}`}
              onBlur={e => this.handleTitleBlur(e, null, null, max + 1)}
            />

            <CloseOutlined onClick={() => this.removeColumn(null, max + 1)} />
          </div>
        );
      },
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
      item[addColor]='';
      return item
    });
    this.setState({
      columns: cols,
      groupSchemeData: soure
    });
  };

  // 选择组，blur 时候保存数据--- 当选择组的时候要加上默认的颜色
  handleGroupSelectBlur = (e, value, row, index, col) => {
    console.log(value);
    console.log(row);
    console.log(index);
    console.log(col);
    const option = e.target.value;
    const { optionList } = this.state;
    let list = [...optionList];

    if (!list.includes(option) && option) {
      list = [...list, option];
    }
    // 如果blur时候的值跟原来的值一样， 说明数据没有改变
    if (value !== option) {
      row[col] = option;
      const { groupSchemeData } = this.state;
      const source = [...groupSchemeData];
      source[index] = row;
      this.setState(
        {
          groupSchemeData: source,
        },
        () => {
          console.log(this.state.groupSchemeData);
        },
      );

    }

    this.setState({
      optionList: list,
    });
  };

  selectRender = (value, row, index, color1, col) => {
    const { optionList } = this.state;
    return (
      <AutoComplete
        allowClear
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
  verifyData = ()=>{
    const { groupSchemeData, columns } = this.state;
    // 1. 一个分组方案里只能是单纯组或者单纯样品
    // 2. 一个分组方案里面不能都是空
    
  }

  render() {
    let tableWidth = 0;
    const { groupSchemeData, visible, columns } = this.state;
    console.log(columns);
    console.log(groupSchemeData);
    columns.map(col => {
      if (!col.width) {
        col.width = 100;
      }
      tableWidth += col.width;
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

export default SampleSelect;
