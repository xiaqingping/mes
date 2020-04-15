// 详情二级抽屉
import React, { Component } from 'react';
import { Drawer, Spin, Empty, Table } from 'antd';
import { connect } from 'dva';
import './index.less';

class SampleDetail extends Component {
  state = {
    loading: false,
    errorPage: false,
  };

  componentDidMount() {}

  render() {
    const { loading, errorPage } = this.state;
    const { detailValue } = this.props;
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
              <div style={{ margin: '15px 0' }}>{detailValue.sampleIdentificationCode}</div>
              <div style={{ marginBottom: '50px' }}>{detailValue.sampleIdentificationCode}</div>
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

export default connect(({ global, sample }) => ({
  languageCode: global.languageCode,
  detailValue: sample.detailValue,
}))(SampleDetail);
