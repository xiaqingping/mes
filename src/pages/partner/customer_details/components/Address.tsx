import {
  Card,
} from 'antd';
import React, { Component } from 'react';

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  render() {
    return (
      <Card title="收货地址" bordered={false} style={{ marginBottom: '24px' }}>
        <div>456</div>
      </Card>
    );
  }
}

export default BasicInfo;
