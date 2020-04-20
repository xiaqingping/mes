import React from 'react';
import { Table, Popover, Button, Modal, Input, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';
import { connect } from 'dva';
import api from './api/sample';
import SampleChoose from './components/SampleChoose';
import './index.less';

class SampleSelect extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return { processId: nextProps.processId };
  }

  state = {
    visible: false,
    tableData: [],
    sampleId: null, // 样品id   点击'已选择n个'时候, 需要传给后台的样品id和已选取文件的id
    chooseFileIds: null, // 所有已选文件id集合 点击选择样品时候, 需要传给后台所有的已选取文件的id;
    fromChoosedFile: null, // 从已选择n个文件来的
    processId: null, // 流程id， 刚进入页面时候获取表格数据需要传入的id
  };

  componentDidMount() {
    this.getTableData();
  }

  getTableData = () => {
    // TODO 比如修改时候, 获取已有样品选择接口.
    // 这个接口就是 /projects/v1/processes/流程id (需要从外界获取)/parameter
    // const { processId } = this.props;
    // api.getSampleSelectTableData(processId).then(res => {
    //   console.log(res);
    // });

    const { tableData } = this.state;
    let list = [...tableData];
    const colorStore = [];
    list = list.map(item => {
      item.color = getrandomColor();
      colorStore.push(item.color);
      return item;
    });
    // this.setColorStore(colorStore);
    this.setState({
      tableData: list,
    });
  };

  setColorStore = colorStore => {
    const { dispatch } = this.props;
    console.log(colorStore);
    dispatch({
      type: 'project/setColorStore',
      payload: colorStore,
    });
  };

  handleDelete = row => {
    const { tableData } = this.state;
    let list = [...tableData];
    list = list.filter(item => item.id !== row.id);
    const colorStore = [];
    list.forEach(item => {
      colorStore.push(item.color);
    });
    console.log(colorStore);
    this.setColorStore(colorStore);
    console.log(this.props.project);
    this.setState(
      {
        tableData: list,
      },
      () => {
        // TODO将改变返回给父组件
        // this.props.emitData(tableData);
      },
    );
  };

  // 点击选择样品
  chooseSample = () => {
    this.setState({
      visible: true,
      fromChoosedFile: false,
    });
    //-----------------------------------------
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

  handleChange = (color, record, index) => {
    const { tableData } = this.state;
    const row = { ...record };
    row.color = color.hex;
    row.visible = false;
    const datas = [...tableData];
    datas[index] = row;

    this.setState({
      tableData: datas,
    });
  };

  handleOk = data => {
    this.toggleVis(false);
  };

  toggleVis = v => {
    this.setState({
      visible: v,
      sampleId: null,
      chooseFileIds: null,
    });
  };

  handleCancel = () => {
    this.toggleVis(false);
  };

  saveData = (row, index, e) => {
    const { tableData } = this.state;
    const list = [...tableData];
    list[index].alia = e.target.value;
    this.setState({
      tableData: list,
    });
  };

  // 查看已选择的
  viewSelected = record => {
    this.toggleVis(true);

    const checkedFileList = record.sampleProperties.filter(item => item.isChoose);
    let checkedFilesIds = [];
    checkedFileList.forEach(item => {
      checkedFilesIds = [...checkedFilesIds, item.sequenceFileId];
    });

    this.setState(
      {
        sampleId: record.id,
        chooseFileIds: checkedFilesIds,
        fromChoosedFile: true,
      },
      () => {
        console.log(this.state);
      },
    );
    // 当点击时候传样品id以及已选择文件id;
    // api.getSelectedData()
  };

  receiveData = data1 => {
    const { tableData, fromChoosedFile } = this.state;
    const list = [...tableData];
    console.log(data1);

    // 从选择样品进来的
    if (!fromChoosedFile) {
      data1.forEach(item => {
        if (!tableData.length) {
          item.color = getrandomColor();
        }
        tableData.forEach(v => {
          if (item.id === v.id) {
            item.color = v.color ? v.color : getrandomColor();
          } else {
            item.color = getrandomColor();
          }
        });
        return item;
      });

      this.setState({
        tableData: data1,
      });
    } else {
      // 从已选择进来的

      const index = list.findIndex(item => data1[0].id === item.id);
      data1[0].color = list[index].color || getrandomColor();
      list.splice(index, 1, ...data1);
      this.setState({
        tableData: list,
      });
    }
  };

  render() {
    const { tableData, visible, sampleId, chooseFileIds } = this.state;
    console.log(this.props.project);
    const columns = [
      {
        title: '样品',
        dataIndex: 'sampleName',
        key: 'sampleName',
        render: (text, record, index) => (
          <div style={{ display: 'flex' }}>
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
                }}
                onClick={() => {
                  this.handleClick(record, index);
                }}
              />
            </Popover>
            <div style={{ marginLeft: 10 }}>{text}</div>
          </div>
        ),
      },
      {
        title: '别名',
        dataIndex: 'alia',
        key: 'alia',
        render: (text, record, index) => (
          <div className="project_manage_sample_select_table_alia">
            <input
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
        render: (text, row) => (
          <>
            <div>{`${row.sampleSequenceCount} ( ${row.sampleLengthTotal}bp)`}</div>
          </>
        ),
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        render: (text, row) => (
          <>{`${row.sampleLengthMin}-${row.sampleLengthMax} (avg ${row.sampleLengthAve})`}</>
        ),
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
              <a
              // onClick={() => {
              //   this.handleDelete(record);
              // }}
              >
                删除
              </a>
            </Popconfirm>
          </>
        ),
      },
    ];
    // 点击'已选择n个'时候, 需要传给后台的样品id和已选取文件的id
    const ids = { sampleId, chooseFileIds };
    // 点击选择样品时候, 需要传给后台所有的已选取文件的id;

    return (
      <>
        <div className="project_manage_sample_select_table">
          <Table columns={columns} dataSource={tableData} pagination={false} />
        </div>
        <Button
          type="dashed"
          block
          onClick={this.chooseSample}
          style={{ marginTop: 20, position: 'static' }}
        >
          <PlusOutlined /> 选择样品
        </Button>
        {visible && (
          <SampleChoose
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            id={sampleId}
            chooseFileIds={chooseFileIds}
            sendData={this.receiveData}
          />
        )}
      </>
    );
  }
}

export default connect(({ project }) => ({
  project,
}))(SampleSelect);
