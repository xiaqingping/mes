import {
  Card,
} from 'antd';
import React, { Component } from 'react';

const tabListNoTitle = [
  {
    key: '1',
    tab: '开票银行',
  },
  {
    key: '2',
    tab: '付款银行',
  },
];

// eslint-disable-next-line react/prefer-stateless-function
class Bank extends Component {
  state = {
    noTitleKey: '1',
  }

  onTabChange = (key: string) => {
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

export default Bank;
