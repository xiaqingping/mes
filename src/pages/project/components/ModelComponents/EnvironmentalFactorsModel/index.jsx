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
    this.state = {
      // 样品选择框 样品列表
      sampleList: [
        {
          colour: 'purple',
          id: '586bf01efbb34d2c9b1911fad3baf174',
          sampleAlias: '别名004',
          sampleCode: '123456789',
          sampleLengthAve: 600,
          sampleLengthMax: 4000,
          sampleLengthMin: 1000,
          sampleLengthTotal: 9000,
          sampleName: '未分组样品',
          sampleSequenceCount: 15,
          sequenceFileCount: 2,
        },
        {
          colour: 'red',
          id: 'b6545cf90ce340d8aa0c464f2fd422b7',
          sampleAlias: '别名002',
          sampleCode: '456',
          sampleLengthAve: 600,
          sampleLengthMax: 4000,
          sampleLengthMin: 1000,
          sampleLengthTotal: 9000,
          sampleName: '样品B',
          sampleSequenceCount: 15,
          sequenceFileCount: 2,
        },
        {
          colour: 'blue',
          id: 'db820c4a2a15401f95943594f58b1084',
          sampleAlias: '别名001',
          sampleCode: '456',
          sampleLengthAve: 600,
          sampleLengthMax: 4000,
          sampleLengthMin: 1000,
          sampleLengthTotal: 9000,
          sampleName: '样品A',
          sampleSequenceCount: 15,
          sequenceFileCount: 2,
        },
        {
          colour: 'gray',
          id: 'f98db018780144c1aec7444bf0a25622',
          sampleAlias: '别名003',
          sampleCode: '456',
          sampleLengthAve: 600,
          sampleLengthMax: 4000,
          sampleLengthMin: 1000,
          sampleLengthTotal: 9000,
          sampleName: '样品C',
          sampleSequenceCount: 15,
          sequenceFileCount: 2,
        },
      ],
      // 表数据
      data: [],
      // 表头
      columns: [],
      // 新增列暂存区
      headers: [],
      // 表头 第一列
      firstColumn: {
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
  }

  componentDidUpdate(props) {
    if (props.submitStatus !== this.props.submitStatus) {
      this.props.getData('testData', '环境因子');
    }
  }

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
        const newItem = JSON.parse(JSON.stringify(item));;
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
      if (item.title === title){
        newKey = item.key;
      }
    })
    const newRow = JSON.parse(JSON.stringify(row));;
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
  }

  // 列显示样式
  formatHeader = headers => {
    const groups = headers.map(item => ({
      title: () => (
        <div className='project_manage_UI_sample_group_title' key={item.id}>
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
        )
    }));

    return groups;
  };

  // 上传
  uploadButton = () => {
    this.setState({ visible: true })
  }

  // 关闭上传
  handleClose = () => {
    this.setState({ visible: false })
  }

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
          <Button type="primary"
          onClick={() => this.uploadButton()}>上传</Button>
        }
      >
        <Table
          scroll={{ x:tableWidth }}
          dataSource={data}
          columns={newColumns}
          pagination={false}
        />
        <UploadSequenceFile
          visible={visible}
          sampleList={sampleList}
          handleClose={this.handleClose}
        />
      </Card>
    );
  }
}

export default EnvironmentalFactorsModel;
