import React from 'react';
import { Table, Select, Button, Modal, Input, AutoComplete, Popover } from 'antd';
import { PlusOutlined, CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getrandomColor } from '@/utils/utils';
import './index.less';
import GroupUpload from './components/groupUpload';

const { Option } = AutoComplete;
let inputValue = '';
let select = null;
class SampleSelect extends React.Component {
  state = {
    visible: false,

    tableData: [
      {
        key: '1',
        sample: '样品1',
        name: 'John Brown',
        age: '好的哈',
        address: 'New York No. 1 Lake Park',
        // length: 3000 - 7000,
      },
      {
        key: '2',
        sample: '样品2',
        name: 'Jim Green',
        age: '好的哈1',
        address: 'New York No. 1 Lake Park1',
        // length: 3444 - 7000,
      },
      {
        key: '3',
        sample: '样品3',
        name: 'Joe Black',
        age: '好的哈2',
        address: 'New York No. 1 Lake Park2',
        // length: 5000 - 7000,
      },
    ],

    headers: [],
    columns: [],
    optionList: ['当前样品'],
  };

  componentDidMount() {
    const headers = [
      {
        field: 'name',
        title: '姓名',
      },
      {
        field: 'age',
        title: '年龄',
      },
      {
        field: 'address',
        title: '地址',
      },
    ];

    this.setState({
      headers,
    });

    const firstColumn = {
      title: '样品',
      dataIndex: 'sample',
      key: 'sample',
      width: 100,
    };
    const lastColumn = {
      title: () => {
        return <PlusSquareOutlined onClick={this.add} />;
      },
      dataIndex: 'add',
      key: 'add',
      width: 100,
    };

    const columns = [firstColumn, ...this.formatHeader(headers), lastColumn];
    this.setState({
      columns,
    });

    const { tableData } = this.state;
    let data = [...tableData];
    data = data.map(item => {
      item.color = getrandomColor();
      return item;
    });
  }

  removeColumn = e => {
    const { headers } = this.state;
    const headerArr = headers.filter(item => {
      return item.field !== e.field;
    });

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
          title: () => {
            return <PlusSquareOutlined onClick={this.add} />;
          },
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
    console.log(e);
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
        {optionList.map(item => {
          return (
            <Option key={Date.now()} value={item}>
              {item}
            </Option>
          );
        })}
      </AutoComplete>
    );
  };

  handleColorChange = (color, text, record, index) => {
    console.log(object);
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
    const groups = headers.map(e => {
      return {
        title: () => {
          return (
            <div className="project_manage_UI_sample_group_title">
              <input defaultValue={e.title} onBlur={this.handleBlur} />

              <CloseOutlined onClick={() => this.removeColumn(e)} />
            </div>
          );
        },
        dataIndex: `${e.field}`,
        key: `${e.field}`,
        width: 100,
        render: (text, record, index) => {
          return (
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
          );
        },
      };
    });

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
          title: () => {
            return <PlusSquareOutlined onClick={this.add} />;
          },
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
    const { tableData, visible, headers, columns } = this.state;

    return (
      <>
        <Button onClick={this.uploadGroup}>上传</Button>
        <Table columns={columns} dataSource={tableData} pagination={false} />

        <Modal
          title="上传分组方案"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={820}
        >
          <GroupUpload />
        </Modal>
      </>
    );
  }
}

export default SampleSelect;
