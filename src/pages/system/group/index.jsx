import {
  Card,
  Form,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Group from './components/Group';
import GroupRule from './components/GroupRule';

class GroupList extends Component {
  state = {}

  constructor (props) {
    super(props);
    this.state = {
      groudId: 0,
    };
  }

  getGroupId = id => {
    this.state({
      groupId: id,
    })
    console.log(this.groudId);
  }

  render() {
    // const { groudId } = this.state;
    return (
      <PageHeaderWrapper>
        <Card>
          <Group getGroupId={this.id}></Group>
          <GroupRule groudId={this.state.groudId}></GroupRule>
        </Card>,
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(GroupList);
