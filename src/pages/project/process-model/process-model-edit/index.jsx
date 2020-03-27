// 项目管理
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import { connect } from 'dva';
// import { expandedRowRender } from '../functions';

class Test extends Component {
  tableSearchFormRef = React.createRef();

  render() {
    return (
      <PageHeaderWrapper>
        <Card>123312312312333333333333333333</Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, project }) => ({
  languageCode: global.languageCode,
  project,
}))(Test);
