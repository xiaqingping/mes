import React from 'react';
import { Card, Button } from 'antd';
import SampleSelect from '@/pages/project/components/SampleSelect';
import SampleGroup from '@/pages/project/components/SampleGroup';

class Group extends React.Component {
  state = {
    groupSchemeData: [
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
        sampleProperties: [
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
        sampleProperties: [
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
        sampleProperties: [
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
        sampleProperties: [
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
    submitStatus: false,
  };

  // 获取样品选择框的最新state;
  getSelectUpdateData = updateData => {
    console.log(updateData);

    this.setState(
      {
        sampleList: updateData,
      },
      () => {
        this.handleUpdate();
      },
    );
  };

  // // 父组件修改
  // setSelectState = data => {
  //   this.setState(
  //     {
  //       sampleList: data,
  //     },
  //     () => {
  //       this.handleUpdate();
  //     },
  //   );
  // };

  // 传数据
  submitData = (subData, a, b) => {
    console.log(b);
    console.log(subData.paramValue);
  };

  // 点击提交状态改变
  handleSubmit = () => {
    this.setState({
      submitStatus: true,
    });
  };

  render() {
    const { sampleList, groupSchemeData, submitStatus } = this.state;
    return (
      <Card>
        {/* <SampleSelect
          sampleList={sampleList}
          // 当样品选择改变的时候
          emitData={this.getSelectUpdateData}
          // 提交数据
          getData={this.submitData}
          // 提交状态
          submitStatus={submitStatus}
          setSelectState={this.setSelectState}
          disabled={false}
        /> */}
        <SampleGroup
          groupSchemeData={groupSchemeData}
          sampleList={sampleList} // 当样品选择改变的时候
          // 提交数据
          getData={this.submitData}
          // 提交状态
          submitStatus={submitStatus}
          getFun={func => {
            this.handleUpdate = func;
          }}
          disabled={false}
        />
        <Button onClick={this.handleSubmit}>提交</Button>
      </Card>
    );
  }
}

export default Group;
