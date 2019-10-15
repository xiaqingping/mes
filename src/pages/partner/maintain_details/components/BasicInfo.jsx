import {
  Card,
  Descriptions,
  Icon,
  Badge,
} from 'antd';
import React, { Component } from 'react';
import CheckPhone from './CheckPhone'
import CheckEmail from './CheckEmail'
import './style.less'

const DescriptionsItem = Descriptions.Item;

// eslint-disable-next-line react/prefer-stateless-function
class BasicInfo extends Component {
  state = {
    phoneShow: false,
    emailShow: false,
  }

  checkPhone = v => {
    this.setState({
      phoneShow: v,
      emailShow: false,
    })
  }

  checkEmail = v => {
    this.setState({
      emailShow: v,
      phoneShow: false,
    })
  }

  render() {
    const { phoneShow, emailShow } = this.state;
    return (
      <Card
        title="基础信息"
        className="check-tabs"
        bordered={false}
        style={{ marginBottom: '24px' }}>
        <Descriptions
          className="s-descriptions"
          layout="vertical"
          column={8}
        >
          <DescriptionsItem span={2} label="名称"><Icon type="home" />&nbsp;&nbsp;张三&nbsp;&nbsp;&nbsp;<a>变更</a></DescriptionsItem>
          <DescriptionsItem span={2} label="移动电话"><Badge status="error"/>&nbsp;&nbsp;+866&nbsp;&nbsp;18735818888&nbsp;&nbsp;&nbsp;<a onClick={() => { this.checkPhone(true) }}>变更</a></DescriptionsItem>
          <DescriptionsItem span={2} label="邮箱">123@qq.com&nbsp;&nbsp;&nbsp;<a onClick={() => { this.checkEmail(true) }}>变更</a></DescriptionsItem>
          <DescriptionsItem span={2} label="电话"><Badge status="error"/>&nbsp;&nbsp;+866&nbsp;&nbsp;18735818888&nbsp;&nbsp;&nbsp;<a>变更</a></DescriptionsItem>
          <DescriptionsItem span={2} label="传真"><Badge status="error"/>&nbsp;&nbsp;+866&nbsp;&nbsp;021-57777777-6661</DescriptionsItem>
          <DescriptionsItem span={1} label="邮政编码">000000</DescriptionsItem>
          <DescriptionsItem span={1} label="时区">UTC+1</DescriptionsItem>
          <DescriptionsItem span={2} label="语言">中文</DescriptionsItem>
          <DescriptionsItem span={2} label="特性行业类别">行业类别123&nbsp;&nbsp;&nbsp;<a>变更</a></DescriptionsItem>
          <DescriptionsItem span={6} label="通讯地址">上海市松江区上海市松江区上海市松江区</DescriptionsItem>
          <DescriptionsItem span={2} label="销售冻结"><Badge status="error"/>&nbsp;&nbsp;冻结</DescriptionsItem>
        </Descriptions>
        <CheckPhone phoneShow={phoneShow} checkPhone={v => { this.checkPhone(v) }}/>
        <CheckEmail emailShow={emailShow} checkEmail={v => { this.checkEmail(v) }}/>
        {/* <CheckEmail emailShow={emailShow} proceed="true" emailAccount="123456@qq.com" />
            checkEmail={v => { this.checkEmail(v) }} */}
      </Card>
    );
  }
}

export default BasicInfo;
