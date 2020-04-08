// 项目管理：新建项目
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Card, Form, Tag, Button, Row, Col, Modal, DatePicker } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
// import { expandedRowRender } from '../functions';
const { CheckableTag } = Tag;
const tagsFromServer = [
  'Movies',
  'Books',
  'Music',
  'red',
  'pink',
  'yellow',
  'green',
  'gold',
  'cyan',
  'purple',
  'gray',
];

const { RangePicker } = DatePicker;

class Test extends Component {
  tableSearchFormRef = React.createRef();

  // 标签
  state = {
    selectedTags: [],
    visible: false,
  };

  // 跳转到添加流程页面
  handleAdd = () => {
    router.push('/project/project-manage/add/addflowpath');
  };

  handleSave = () => {
    console.log('保存');
  };

  showModal = () => {
    console.log('弹框');
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  onChange = () => {
    console.log(222);
  };

  onOk = () => {
    console.log(3333);
  };

  handleChange(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedTags: nextSelectedTags });
  }

  render() {
    // 文本域
    const { TextArea, Search } = Input;
    // 表单
    const FormItem = Form.Item;
    // 标签
    const { selectedTags } = this.state;

    return (
      <PageHeaderWrapper>
        <Form>
          <Card bordered={false}>
            <FormItem label="名称" name="customerCode" style={{ paddingRight: '50px' }}>
              <Input placeholder="请输入项目名称" maxLength={20} style={{ marginLeft: '40px' }} />
            </FormItem>
            <FormItem label="描述" name="describe" style={{ paddingRight: '50px' }}>
              <TextArea
                rows={4}
                placeholder="请输入项目描述"
                maxLength="200"
                style={{ marginLeft: '40px' }}
              />
            </FormItem>
            <div style={{ width: '300px' }}>
              <FormItem label="所有者" name="owner">
                <Search onClick={this.showModal} style={{ marginLeft: '26px' }} />
              </FormItem>
            </div>
            <div>
              <FormItem label="时间" name="time" style={{ paddingRight: '50px' }}>
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={this.onChange}
                  onOk={this.onOk}
                  style={{ marginLeft: '40px' }}
                />
              </FormItem>
            </div>
            <div style={{ height: '250px' }}>
              <FormItem label="标签" name="label">
                <div style={{ marginLeft: '40px', marginRight: '270px' }}>
                  {/* <span style={{ marginRight: 8 }}>Categories:</span> */}
                  {tagsFromServer.map(tag => (
                    <CheckableTag
                      key={tag}
                      checked={selectedTags.indexOf(tag) > -1}
                      onChange={checked => this.handleChange(tag, checked)}
                      style={{
                        width: '70px',
                        height: '30px',
                        border: '1px',
                        borderStyle: 'solid',
                        borderColor: '#dcdcdc',
                        lineHeight: '30px',
                        textAlign: 'center',
                        // backgroundColor: '#F5F5F5',
                      }}
                    >
                      {tag}
                    </CheckableTag>
                  ))}
                </div>
              </FormItem>
            </div>
            <Modal
              title="业务伙伴-客户"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div className="site-card-wrapper">
                <Row gutter={16}>
                  <Col span={8}>
                    <Card bordered={false} bodyStyle={{ width: '200px', backgroundColor: 'pink' }}>
                      Card content
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card bordered={false}>Card content</Card>
                  </Col>
                  <Col span={8}>
                    <Card bordered={false}>Card content</Card>
                  </Col>
                </Row>
              </div>
            </Modal>
          </Card>
          <Card
            style={{
              height: '60px',
              width: '100%',
              position: 'fixed',
              bottom: '0',
              left: '0',
              lineHeight: '60px',
            }}
          >
            <Button
              type="primary"
              style={{ float: 'right', marginTop: '-16px', marginLeft: '20px' }}
              onClick={() => this.handleSave(true)}
            >
              保存
            </Button>
            <Button
              type="primary"
              style={{ float: 'right', marginTop: '-16px' }}
              onClick={() => this.handleAdd(true)}
            >
              添加流程
            </Button>
          </Card>
        </Form>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global }) => ({
  languageCode: global.languageCode,
}))(Test);
