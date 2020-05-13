import React from 'react';
import { Table, Popover, Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';
import { connect } from 'dva';
import SampleChoose from './components/SampleChoose';
import './index.less';

/**
 * 样品选择框组件
 */
class SampleSelect extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    let sampleList = [];
    if (nextProps.paramList.paramValue && typeof nextProps.paramList.paramValue === 'string') {
      sampleList = JSON.parse(nextProps.paramList.paramValue);
    } else {
      sampleList = nextProps.paramList.paramValue;
    }
    return {
      tableDatas: sampleList || [],
      // TODO: 提交时一定要修改过来
      disabled: nextProps.disabled,
      // disabled: false,
    };
  }

  state = {
    disabled: false,
    visible: false,
    tableData: [],
    tableDatas: [],
    sampleId: null, // 样品id   点击'已选择n个'时候, 需要传给后台的样品id和已选取文件的id
    chooseFileIds: null, // 所有已选文件id集合 点击选择样品时候, 需要传给后台所有的已选取文件的id;
    fromChoosedFile: null, // 从已选择n个文件来的
    columns: [
      {
        title: '样品',
        dataIndex: 'sampleName',
        key: 'sampleName',
        render: (text, record, index) => (
          <div style={{ display: 'flex' }}>
            {this.state.disabled ? (
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: record.color,
                  position: 'relative',
                  borderRadius: 2,
                }}
                onClick={() => {
                  this.handleClick(record, index);
                }}
              />
            ) : (
              <Popover
                overlayClassName="project_manage_sample_ui_select"
                overlayStyle={{ padding: 0 }}
                content={
                  <SketchPicker
                    color={record.color || this.state.color}
                    onChangeComplete={color => this.handleChange(color, record, index)}
                  />
                }
                trigger="click"
                placement="bottom"
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: record.color,
                    position: 'relative',
                    borderRadius: 2,
                  }}
                  onClick={() => {
                    this.handleClick(record, index);
                  }}
                />
              </Popover>
            )}
            <div style={{ marginLeft: 10 }}>{text}</div>
          </div>
        ),
      },
      {
        title: '别名',
        dataIndex: 'sampleAlias',
        key: 'sampleAlias',
        render: (text, record, index) => (
          <div className="project_manage_sample_select_table_alia">
            <input
              disabled={this.state.disabled}
              type="text"
              defaultValue={text}
              onBlur={e => {
                this.saveData(record, index, e);
              }}
            />
          </div>
        ),
      },
      {
        title: '序列',
        dataIndex: 'sequence',
        key: 'sequence',
        render: (text, row) => {
          const choosedProperties = row.sampleProperties.filter(item => item.isChoose);
          let sampleSequenceCount = 0;
          let sampleLengthTotal = 0;
          choosedProperties.forEach(item => {
            sampleSequenceCount += item.sampleSequenceCount;
            sampleLengthTotal += item.sampleLengthTotal;
          });
          return (
            <>
              <div>{`${sampleSequenceCount} ( ${sampleLengthTotal}bp)`}</div>
            </>
          );
        },
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        render: (text, row) => {
          const choosedProperties = row.sampleProperties.filter(item => item.isChoose);
          let sampleLengthMin = 0;
          const sampleLengthMins = [];
          let sampleLengthMax = 0;
          const sampleLengthMaxs = [];
          let sampleLengthAve = 0;
          let sampleLengthTotal = 0;
          let sampleSequenceCount = 0;
          choosedProperties.forEach(item => {
            sampleLengthMins.push(item.sampleLengthMin);
            sampleLengthMaxs.push(item.sampleLengthMax);
            sampleLengthTotal += item.sampleLengthTotal;
            sampleSequenceCount += item.sampleSequenceCount;
          });
          sampleLengthAve = (sampleLengthTotal / sampleSequenceCount).toFixed(2);
          sampleLengthMin = Math.max.apply(null, sampleLengthMins);
          sampleLengthMax = Math.max.apply(null, sampleLengthMaxs);
          return <>{`${sampleLengthMin}-${sampleLengthMax} (avg ${sampleLengthAve})`}</>;
        },
      },
      {
        title: '文件',
        dataIndex: 'files',
        key: 'files',
        render: (text, record) => {
          const lens = record.sampleProperties.filter(item => item.isChoose).length;
          return (
            <a
              onClick={() => {
                this.viewSelected(record);
              }}
            >
              已选{lens || 0}个
            </a>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <>
            <Popconfirm
              placement="topRight"
              title="确定要删除吗？"
              onConfirm={() => this.handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ],
  };

  /**
   * 是否校验通过
   */
  validPass = null;

  errorMessage = '';

  /**
   *  在这个生命周期中将tableDatas数据复制一份，以防止子组件不能改变父组件传过来的值的问题并实现数据渲染页面
   */
  componentDidMount() {
    const { tableDatas, disabled, columns } = this.state;
    if (disabled) {
      this.setState({
        columns: columns.slice(0, columns.length - 1),
      });
    }
    this.setState({
      tableData: tableDatas,
    });
    this.getTableData(tableDatas);
  }

  // componentDidUpdate(props) {
  // if (props.submitStatus !== this.props.submitStatus) {
  //   const { tableData } = this.state;
  //   let list = [...tableData];
  //   list = list.map(item => {
  //     item.sampleId = item.id;
  //     return item;
  //   });
  //   const { paramKey, taskModelId } = props;
  //   const sendData = {
  //     paramKey,
  //     taskModelId,
  //     paramValue: JSON.stringify(list),
  //   };
  //   this.validPass = !(this.props.paramList.required && list && !list.length);
  //   this.props.getData(sendData, 'sampleSelect', this.validPass);
  // }
  // }

  /**
   * 每次数据发生改变时都将数据传给父组件
   */
  sendDataOnChange = tableData => {
    let list = [...tableData];
    list = list.map(item => {
      item.sampleId = item.id;
      item.sampleProperties = item.sampleProperties.filter(i => i.isChoose);
      return item;
    });
    const { paramKey, taskModelId } = this.props.paramList;
    const sendData = {
      paramKey,
      taskModelId,
      paramValue: JSON.stringify(list),
    };
    this.validPass = !(this.props.paramList.isRequired === 'true' && list && !list.length);
    if (!this.validPass) this.errorMessage = '样品为必选，请选择样品！';
    this.props.getData(sendData, 'sampleSelect', this.validPass, this.errorMessage);
  };

  /**
   * 给原始数据加一个已选择标记
   * @param {Object} tableData 原始样品数据
   */
  getTableData = tableData => {
    let list = [...tableData];
    let colorStore = [];
    list = list.map(item => {
      colorStore = [...colorStore, item.color];
      // colorStore.push(item.color);
      item.sampleProperties.forEach(v => {
        v.isChoose = 1;
        return v;
      });
      return item;
    });
    this.setState({
      tableData: list,
    });
    const storeColor = this.props.project.colorStore;
    // 因为样品选择和分组方案加载完成时都会设置颜色store， 为防止覆盖，所以才这样写
    const colors = [...colorStore, ...storeColor];
    this.setColorStore([...new Set(colors)]);
  };

  /**
   * 设置colorStore
   */
  setColorStore = colorStore => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/setColorStore',
      payload: colorStore,
    });
  };

  /**
   * 删除样品
   * @param {Object} row 每行的样品信息
   */
  handleDelete = row => {
    const { columns, tableData } = this.state;
    const list = [...tableData];
    const columns1 = JSON.parse(JSON.stringify(columns));
    const columns2 = [...columns];
    const list1 = list.filter(item => item.id !== row.id);
    const colorStore = [];
    list1.forEach(item => {
      colorStore.push(item.color);
    });
    this.setColorStore(colorStore);
    this.setState(
      {
        tableData: list1,
        columns: columns1,
      },
      () => {
        this.setState({
          columns: columns2,
        });
      },
    );
    this.props.emitData(list1);
    this.sendDataOnChange(list1);
    // this.props.getData(list1);
  };

  /**
   * 点击选择样品，打开弹框并请求后台数据
   */
  chooseSample = () => {
    this.setState({
      visible: true,
      fromChoosedFile: false,
    });
    const { tableData } = this.state;
    let choosedIds = [];
    tableData.forEach(item => {
      if (item.sampleProperties && item.sampleProperties.length) {
        item.sampleProperties.forEach(v => {
          if (v.isChoose) {
            choosedIds = [...choosedIds, v.sequenceFileId];
          }
        });
      }
    });
    this.setState({
      chooseFileIds: choosedIds,
    });
  };

  /**
   * 点击样品前面的色块， 控制选色器的显示隐藏
   */
  handleClick = (record, index) => {
    const { tableData } = this.state;
    const row = { ...record };
    row.visible = !row.visible;
    const datas = [...tableData];
    datas[index] = row;
    this.setState({
      tableData: datas,
    });
  };

  /**
   * 点击样品前面的色块， 获取颜色
   */
  handleChange = (color, record, index) => {
    const { tableData } = this.state;
    const { colorStore } = this.props.project;
    const row = { ...record };
    const isIncludes = colorStore.includes(color.hex.toUpperCase());
    // colorStore = colorStore.filter(item => item !== color.hex.toUpperCase());
    if (isIncludes) {
      message.warning('存在相同颜色，已为您自动生成一个新颜色！');
      row.color = getrandomColor();
    } else {
      row.color = color.hex.toUpperCase();
    }
    this.setColorStore([...colorStore, row.color]);
    row.visible = false;
    const datas = [...tableData];
    datas[index] = row;
    this.setState({
      tableData: datas,
    });
  };

  /**
   * 点击打开选择样品弹框
   */
  handleOk = () => {
    this.toggleVis(false);
  };

  /**
   * 切换弹框的打开闭合
   */
  toggleVis = v => {
    this.setState({
      visible: v,
      sampleId: null,
      chooseFileIds: null,
    });
  };

  /**
   * 点击取消，关闭弹框
   */
  handleCancel = () => {
    this.toggleVis(false);
  };

  /**
   * 当blur时候给样品修改别名，并重新设置数据并发送给父组件
   */
  saveData = (row, index, e) => {
    const { tableData } = this.state;
    const list = [...tableData];
    list[index].sampleAlias = e.target.value;
    this.setState({
      tableData: list,
    });
    this.sendDataOnChange(list);
    this.props.emitData(list);
  };

  /**
   * 查看已选择的文件信息
   * @param {Object} record 点击查看的那行数据
   */
  viewSelected = record => {
    this.toggleVis(true);

    const checkedFileList = record.sampleProperties.filter(item => item.isChoose);
    let checkedFilesIds = [];
    checkedFileList.forEach(item => {
      checkedFilesIds = [...checkedFilesIds, item.sequenceFileId];
    });

    this.setState({
      sampleId: record.id,
      chooseFileIds: checkedFilesIds,
      fromChoosedFile: true,
    });
  };

  /**
   * 获取从上传序列文件弹框得到的数据
   * @param {Object} data1 从上传序列文件弹框得到的数据
   */
  receiveData = data1 => {
    const { tableData, fromChoosedFile } = this.state;
    const list = [...tableData];
    const colors = this.props.project.colorStore;
    const sampleColors = tableData.map(s => s.color);

    // 从选择样品进来的
    if (!fromChoosedFile) {
      // 如果从选择样品进来，因为是全覆盖， 所以，将之前样品的color全部从store里去掉，之后再统一加上
      colors.forEach((c, idx) => {
        if (sampleColors.includes(c)) {
          colors.splice(idx, 1, '');
        }
      });
      const cols = colors.filter(i => i !== '');
      data1.forEach(item => {
        if (!tableData.length) {
          item.color = getrandomColor();
          item.sampleAlias = '';
        } else {
          const tableDataMap = {};
          tableData.forEach(td => {
            tableDataMap[td.id] = td;
          });
          if (tableDataMap[item.id]) {
            item.color = tableDataMap[item.id].color
              ? tableDataMap[item.id].color
              : getrandomColor();
            item.sampleAlias = tableDataMap[item.id].sampleAlias
              ? tableDataMap[item.id].sampleAlias
              : '';
          } else {
            item.color = getrandomColor();
            item.sampleAlias = '';
          }
        }
        return item;
      });
      this.setState({
        tableData: data1,
      });
      const colorStore = data1.map(i => i.color);
      this.sendDataOnChange(data1);
      this.setColorStore([...colorStore, ...cols]);
      this.props.emitData(data1);
    } else {
      // 从已选择进来的
      const index = list.findIndex(item => data1[0].id === item.id);
      data1[0].color = list[index].color || getrandomColor();
      list.splice(index, 1, ...data1);
      this.setState({
        tableData: list,
      });
      this.sendDataOnChange(list);
      // 将改变返回给父组件
      this.props.emitData(list);
    }
  };

  render() {
    const { visible, sampleId, chooseFileIds, tableData, columns, disabled } = this.state;
    const { paramName } = this.props.paramList;
    if (typeof tableData === 'string') return false;
    return (
      <div className="project_manage_sample_select_table_wrap">
        <div
          style={{ fontSize: 15, color: 'rgba(0,0,0,.65)', fontWeight: 'bold', marginBottom: 18 }}
        >
          {paramName}
        </div>
        <div className="project_manage_sample_select_table">
          <Table columns={columns} dataSource={tableData} pagination={false} />
        </div>
        {!disabled && (
          <Button
            type="dashed"
            block
            onClick={this.chooseSample}
            style={{ marginTop: 20, position: 'static' }}
          >
            <PlusOutlined /> 选择样品
          </Button>
        )}
        {visible && (
          <SampleChoose
            disabled={disabled}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            id={sampleId}
            chooseFileIds={chooseFileIds}
            sendData={v => this.receiveData(v)}
          />
        )}
      </div>
    );
  }
}

export default connect(({ project }) => ({
  project,
}))(SampleSelect);
