/**
 * 环境因子表
 */
import React from 'react';
import { Table, Card, Input } from 'antd';
import { CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
import EditableCell from '@/components/EditableCell';

class EnvironmentalFactorsTable extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
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

  // save = async e => {
  //   try {
  //     const values = await form.validateFields();
  //     toggleEdit();
  //     this.handleSave({ ...record, ...values });
  //   } catch (errInfo) {
  //     console.log('Save failed:', errInfo);
  //   }
  // };

  // handleSave = row => {
  //   console.log(row);
  //   const { data } = this.state;
  //   const newData = [...data];
  //   const index = newData.findIndex(item => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, { ...item, ...row });
  //   this.setState({
  //     data: newData,
  //   });
  // };

  // 新增列
  addColumn = () => {
    const { headers, firstColumn, lastColumn } = this.state;

    // 设置新增列
    let newHeader;
    if (headers.length > 0) {
      const ids = [];
      headers.forEach(item => {
        ids.push(item.id);
      });
      const max = Math.max.apply(null, ids);
      const num = max + 1;
      newHeader = {
        id: num,
        dataIndex: `header_${num}`,
        title: `分组方案_${num}`,
        editable: true,
        inputType: <Input style={{ width: '90%' }} onPressEnter={this.save} onBlur={this.save} />,
      };
    } else {
      newHeader = {
        id: 2,
        dataIndex: 'header_2',
        title: '分组方案_2',
        editable: true,
        inputType: <Input style={{ width: '90%' }} />,
      };
    }

    this.setState(
      {
        headers: [...headers, newHeader],
      },
      () => {
        const hds = this.state.headers;
        const cls = [firstColumn, ...this.formatHeader(hds), lastColumn];
        console.log(cls);
        const newData = this.setDataSource(newHeader);
        this.setState({ columns: cls, data: newData });
      },
    );
  };

  // 设置表格数据
  setDataSource = newHeader => {
    const { data } = this.state;
    const newData = [];
    data.forEach(item => {
      const newItem = JSON.parse(JSON.stringify(item));
      const key = newHeader.dataIndex;
      newItem[key] = '123';
      newData.push(newItem);
    });
    console.log(newData);
    return newData;
  };

  // 移除列
  removeColumn = e => {
    const { headers, firstColumn, lastColumn } = this.state;
    const headerArr = headers.filter(item => item.id !== e.id);

    this.setState(
      {
        headers: headerArr,
      },
      () => {
        const hds = this.state.headers;
        const columns = [firstColumn, ...this.formatHeader(hds), lastColumn];
        this.setState({ columns });
      },
    );
  };

  // componentDidUpdate(props) {
  //   if (props.sbm !== this.props.sbm) {
  //     this.props.getData('testData', '1');
  //   }
  // }

  // 格式化表头 可编辑Input
  formatHeader = headers => {
    const groups = headers.map(e => {
      console.log(e);
      return {
        title: () => (
          <div className="project_manage_UI_sample_group_title" key={e.id}>
            <input defaultValue={e.title} onBlur={this.handleBlur} />
            <CloseOutlined onClick={() => this.removeColumn(e)} />
          </div>
        ),
        dataIndex: `${e.dataIndex}`,
        key: `${e.key}`,
        width: 100,
      };
    });

    return groups;
  };

  render() {
    const { columns, data } = this.state;
    console.log(columns);
    console.log(data);

    const components = {
      body: {
        // row: EditableRow,
        cell: EditableCell,
      },
    };

    const newColumns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <Card title="环境因子表" style={{ width: '100%', marginTop: 30 }}>
        <Table
          dataSource={data}
          columns={newColumns}
          rowClassName={() => 'editable-row'}
          pagination={false}
          components={components}
        />
      </Card>
    );
  }
}

export default EnvironmentalFactorsTable;
