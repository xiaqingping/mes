import {
  Card,
} from 'antd';
import React, { Component } from 'react';

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    return (
      <Card title="基础信息" bordered={false} style={{ marginBottom: '24px' }}>
        <div>123</div>
      </Card>
    );
  }
}

export default BasicInfo;
