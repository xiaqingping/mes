// 详情二级抽屉
import React, { Component } from 'react';
import { Drawer, Avatar, Tag, List, Card, Badge, Spin, Empty } from 'antd';
import { formatter, cutString } from '@/utils/utils';
import './index.less';
import api from '@/pages/project/api/taskmodel';
import disk from '@/pages/project/api/disk';
import { connect } from 'dva';

class SampleDetail extends Component {
  state = {
    loading: false,
    errorPage: false,
  };

  componentDidMount() {}

  render() {
    const { loading, errorPage } = this.state;
    const { detailValue } = this.props;
    console.log(detailValue);
    return (
      <div>
        <Drawer
          width={500}
          closable={false}
          onClose={this.onClose}
          visible={this.props.visible}
          className="drawer-style"
        >
          {errorPage ? (
            <Empty />
          ) : (
            <Spin spinning={loading}>
              <h3>
                {detailValue.name}样品序列文件({detailValue.code})
              </h3>
            </Spin>
          )}
        </Drawer>
      </div>
    );
  }
}

export default SampleDetail;
