import {
  // Button,
  Card,
  // Col,
  Form,
  // Input,
  // Row,
  // Select,
  // Divider,/
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Group from './components/Group';
import GroupRule from './components/GroupRule';

const gridStyle2 = {
  width: '65%',
  textAlign: 'center',
};
class GroupList extends Component {
  state = {
  }

  render() {
    return (
      <PageHeaderWrapper>
        <Card>
          <Group></Group>
          <GroupRule></GroupRule>
        </Card>,
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(GroupList);
