// 项目管理：新建项目
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Input,
  Card,
  Form,
  // Tag,
  Button,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
// import { expandedRowRender } from '../functions';

class Test extends Component {
  tableSearchFormRef = React.createRef();

  // 跳转到添加流程页面
  handleAdd = () => {
    router.push('/project/project-manage/add/addflowpath');
    // console.log(1234);
  };

  handleSave = () => {
    console.log('保存');
  };

  render() {
    // 文本域
    const { TextArea, Search } = Input;
    // 表单
    const FormItem = Form.Item;
    // 标签
    // const { CheckableTag } = Tag;
    // state = { checked: true };

    // handleChange = checked => {
    //   this.setState({ checked });
    // };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          {/* <div className="tableList">
            <div className="tableListOperator">
              <FormItem label="名称" name="customerCode">
                <Input placeholder="请输入项目名称" maxLength={20} />
              </FormItem>
              <FormItem label="描述" name="describe">
                <TextArea rows={4} placeholder="请输入项目描述" maxLength="200" />
              </FormItem>
              <FormItem label="所有人" name="owner">
                <Search onSearch={() => this.showCustomer.visibleShow(true)} />
              </FormItem>
              标签：<CheckableTag {...this.props} checked={this.state.checked}
              onChange={this.handleChange} />
              <Button type="primary" onClick={() => this.handleAdd(true)}>
                确定
              </Button>
              <Button type="primary" onClick={() => this.handleSave(true)}>
                保存
              </Button>
            </div>
          </div> */}
          <FormItem label="名称" name="customerCode">
            <Input placeholder="请输入项目名称" maxLength={20} />
          </FormItem>
          <FormItem label="描述" name="describe">
            <TextArea rows={4} placeholder="请输入项目描述" maxLength="200" />
          </FormItem>
          <FormItem label="所有人" name="owner">
            <Search onSearch={() => this.showCustomer.visibleShow(true)} />
          </FormItem>
          {/* 标签：<CheckableTag {...this.props} checked={this.state.checked}
              onChange={this.handleChange} /> */}
          <Button type="primary" onClick={() => this.handleAdd(true)}>
            确定
          </Button>
          <Button type="primary" onClick={() => this.handleSave(true)}>
            保存
          </Button>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global }) => ({
  languageCode: global.languageCode,
}))(Test);
