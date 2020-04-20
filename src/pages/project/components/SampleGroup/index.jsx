import React from 'react';
import { Table, Select, Button, Modal, Input, AutoComplete, Popover } from 'antd';
import { PlusOutlined, CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';
import './index.less';
import GroupUpload from '../UploadSequenceFile/index';

const { Option } = AutoComplete;
let inputValue = '';
let select = null;
class SampleSelect extends React.Component {
  state = {
    visible: false,

    tableData: [
      {
        name: '样品',
        groupList: [
          {
            id: 'aaaaa',
            name: '样品1',
            type: 'sample',
          },
          {
            id: 'bbb',
            name: '样品2',
            type: 'sample',
          },
          {
            id: 'ccccc',
            name: '样品3',
            type: 'sample',
          },
        ],
      },
      {
        name: '分组方案一',
        groupList: [
          {
            id: 'aaaaa',
            name: '当前样品1',
            type: 'sample',
          },
          {
            id: 'bbb',
            name: '当前样品',
            type: 'sample',
          },
          {
            id: 'ccccc',
            name: '当前样品',
            type: 'sample',
          },
        ],
      },
      {
        name: '分组方案二',
        groupList: [
          {
            id: 'aaaaa',
            name: 'con2',
            type: 'group',
            color: 'AAFFGG',
            sampleList: [
              {
                id: 'aaaaa',
                name: '别名1',
              },
            ],
          },
          {
            id: 'bbb',
            name: 'con3',
            type: 'group',
            color: 'AAFFBB',
            sampleList: [
              {
                id: 'bbbb',
                name: '别名2',
              },
            ],
          },
          {
            id: 'ccccc',
            name: 'con4',
            type: 'group',
            color: 'AAFFCC',
            sampleList: [
              {
                id: 'ccccc',
                name: '别名3',
              },
            ],
          },
        ],
      },
      {
        name: '分组方案三',
        groupList: [
          {
            id: 'bbbbbbb',
            name: 'con3',
            type: 'group',
            color: 'AAFFdd',
            sampleList: [
              {
                id: 'aaaaa',
                name: '别名1',
              },
              {
                id: 'bbbb',
                name: '别名2',
              },
              {
                id: 'cccc',
                name: '别名3',
              },
            ],
          },
        ],
      },
    ],

    data: [],
    columns: [],
    optionList: ['当前样品'],
  };

  componentDidMount() {
    const { tableData } = this.state;
    const columnsList = tableData.map((item, index) => ({
      title: item.name,
      dataIndex: index,
      editable: index !== 0,
      width: 100,
    }));
    const data = [];
    tableData.map((item, index) => {
      item.groupList.map((i, ind) => data.push(tableData[index].groupList[ind]));
    });
    console.log(columnsList);
    console.log(data);
    this.setState({
      columns: columnsList,
      data,
    });
  }

  removeColumn = e => {
    const { headers } = this.state;
    const headerArr = headers.filter(item => item.field !== e.field);

    this.setState(
      {
        headers: headerArr,
      },
      () => {
        const hds = this.state.headers;
        const firstColumn = {
          title: '样品',
          dataIndex: 'sample',
          key: 'sample',
          width: 100,
        };
        const lastColumn = {
          title: () => <PlusSquareOutlined onClick={this.add} />,
          dataIndex: 'add',
          key: 'add',
          width: 100,
        };
        const columns = [firstColumn, ...this.formatHeader(hds), lastColumn];
        this.setState({
          columns,
        });
      },
    );
  };

  handleBlur = () => {
    // alert(111);
  };

  onInputBlur = e => {
    if (!select) {
      const { optionList } = this.state;
      const list = [...optionList];
      list.push(inputValue);
      this.setState({
        optionList: list,
      });
    }
  };

  onInputChange = v => {
    inputValue = v;
  };

  handleSelect = () => {
    select = true;
  };

  selectRender = () => {
    const { optionList } = this.state;
    return (
      <AutoComplete style={{ width: '80%' }} onBlur={this.onInputBlur}>
        {optionList.map(item => (
          <Option key={Date.now()} value={item}>
            {item}
          </Option>
        ))}
      </AutoComplete>
    );
  };

  handleColorChange = (color, text, record, index) => {
    const { tableData } = this.state;
    const row = { ...record };
    row.color = color.hex;
    const datas = [...tableData];
    datas[index] = row;

    this.setState({
      tableData: datas,
    });
  };

  formatHeader = headers => {
    const groups = headers.map(e => ({
      title: () => (
        <div className="project_manage_UI_sample_group_title">
          <input defaultValue={e.title} onBlur={this.handleBlur} />

          <CloseOutlined onClick={() => this.removeColumn(e)} />
        </div>
      ),
      dataIndex: `${e.field}`,
      key: `${e.field}`,
      width: 100,
      render: (text, record, index) => (
        <div style={{ display: 'flex' }}>
          {this.selectRender()}
          <Popover
            overlayClassName="project_manage_sample_ui_select"
            overlayStyle={{ padding: 0 }}
            content={
              <SketchPicker
                color={record.color || this.state.color}
                onChangeComplete={color => this.handleColorChange(color, text, record, index)}
              />
            }
            trigger="click"
            placement="bottom"
          >
            <div
              style={{
                width: 20,
                height: 20,
                marginLeft: 15,
                marginTop: 6,
                backgroundColor: record.color,
              }}
            />
          </Popover>
        </div>
      ),
    }));

    return groups;
  };

  setTitle = () => {};

  add = () => {
    const { columns, headers } = this.state;
    const addheader = { field: Date.now(), title: '分组方案' };
    this.setState(
      {
        // columns: cls,
        headers: [...headers, addheader],
      },
      () => {
        const hds = this.state.headers;
        const firstColumn = {
          title: '样品',
          dataIndex: 'sample',
          key: 'sample',
          width: 100,
        };
        const lastColumn = {
          title: () => <PlusSquareOutlined onClick={this.add} />,
          dataIndex: 'add',
          key: 'add',
          width: 100,
        };
        const cls = [firstColumn, ...this.formatHeader(hds), lastColumn];
        this.setState({
          columns: cls,
        });
      },
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

  handleOk = () => {
    this.toggleVis(false);
  };

  handleCancel = () => {
    this.toggleVis(false);
  };

  render() {
    const { tableData, visible, data, columns } = this.state;

    return (
      <>
        <Button onClick={this.uploadGroup}>上传</Button>
        <Table columns={columns} dataSource={data} pagination={false} />

        {visible && <GroupUpload />}
      </>
    );
  }
}

export default SampleSelect;
