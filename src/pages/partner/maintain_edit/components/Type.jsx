import {
  Card,
} from 'antd';
import React, { Component } from 'react';

const tabListNoTitle = [
  {
    key: '1',
    tab: '生工国内电商',
  },
  {
    key: '2',
    tab: '生工国外电商',
  },
  {
    key: '3',
    tab: '生工国内直销',
  },
  {
    key: '4',
    tab: '生工国外直销',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    noTitleKey: '1',
  }

  onTabChange = key => {
    this.setState({
      noTitleKey: key,
    });
  }

  render() {
    return (
      <Card
        bordered={false}
        style={{ width: '100%', marginBottom: '24px' }}
        tabList={tabListNoTitle}
        activeTabKey={this.state.noTitleKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        <div>456</div>
      </Card>
    );
  }
}

export default BasicInfo;
