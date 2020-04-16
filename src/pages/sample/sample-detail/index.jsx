// 详情二级抽屉
import React, { Component } from 'react';
import { Drawer, Spin, Empty, Table } from 'antd';
import { connect } from 'dva';
import api from '@/pages/sample/api/sample';
import './index.less';

class SampleDetail extends Component {
  state = {
    loading: false,
    errorPage: false,
    detailValue: [],
  };

  componentDidMount() {
    const { detailValue } = this.props;
    console.log(detailValue);
    api
      .getSampleDetail(detailValue.id)
      .then(res => {
        this.setState({
          detailValue: res,
        });
      })
      .catch(() => {
        this.setState({
          errorPage: true,
        });
      });
  }

  render() {
    const { loading, errorPage } = this.state;
    const { detailValue } = this.state;
    console.log(detailValue);
    const columns = [
      {
        title: '原始文件',
        dataIndex: 'sequenceFileName',
      },
      {
        title: '序列',
        dataIndex: 'sampleSequenceCount',
      },
      {
        title: '长度',
        dataIndex: 'sampleLengthMin',
        render: (value, row) => `${value}-${row.sampleLengthMax} (${row.sampleLengthAve})`,
      },
    ];

    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={this.props.handleClose}
          visible={this.props.visible}
          className="drawer-style"
        >
          {errorPage ? (
            <Empty />
          ) : (
            <Spin spinning={loading}>
              <h3>
                {detailValue.sampleName}样品序列文件({detailValue.sampleCode})
              </h3>
              <div style={{ marginTop: '35px' }}>{detailValue.sampleIdentificationCode}</div>
              <div
                style={{ margin: '15px 0' }}
              >{`${detailValue.sampleSequenceCount} (${detailValue.sampleLengthTotal}bp)`}</div>
              <div
                style={{ marginBottom: '50px' }}
              >{`${detailValue.sampleLengthMin}-${detailValue.sampleLengthMax} (${detailValue.sampleLengthAve})`}</div>
              <Table
                rowKey="id"
                dataSource={detailValue.sampleProperties}
                columns={columns}
                loading={loading}
                onChange={this.tableChange}
                pagination={false}
              />
            </Spin>
          )}
        </Drawer>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  languageCode: global.languageCode,
}))(SampleDetail);
