// 项目管理：新建项目
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Card, Form, Tag, Button, DatePicker, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManage';
import BPList from './components/BPList';

const { CheckableTag } = Tag;

const { RangePicker } = DatePicker;

class ProjectEdit extends Component {
  formRef = React.createRef();

  state = {
    selectedTags: [], // 选中标签
    bpCode: '',       // bp编号
    bpName: '',       // bp名称
    beginDate: '',    // 开始时间
    endDate: '',      // 结束时间
  };

  // 保存时所需数据
  saveData = () => {
    const { selectedTags, bpCode, bpName, endDate, beginDate } = this.state;
    const formData = this.formRef.current.getFieldsValue();

    if (formData.name === undefined) return message.error('项目名称不能为空！');
    if (formData.describe === undefined) return message.error('项目描述不能为空！');
    if (bpName === '') return message.error('所有者不能为空！');
    if (beginDate === '') return message.error('开始时间不能为空！');
    if (endDate === '') return message.error('结束时间不能为空！');

    const data = {
      name: formData.name,
      describe: formData.describe,
      bpCode,
      bpName,
      endDate,
      beginDate,
      labelList: selectedTags
    }
    return data;
  }

  // 跳转到添加流程页面
  handleAdd = () => {
    const data = this.saveData();
    router.push('/project/project-manage/add/addflowpath', { data });
  };

  // 保存
  handleSave = () => {
    const data = this.saveData();
    console.log(data);
    api.addProjects(data).then(() => {
      router.push('/project/project-manage');
    })
  };

  // 选中时间
  onChangeTime = (value, dateString) => {
    this.setState({
      beginDate: dateString[0],
      endDate: dateString[1],
    })
  }

  handleChange = (tag, checked) => {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedTags: nextSelectedTags });
  }

  // 获取业务伙伴模态框回传数据
  getBPData = data => {
    console.log(data);
    this.formRef.current.setFieldsValue({
      bpName: data.name,
    });
    this.setState({
      bpCode: data.code,
      bpName: data.name,
    })
  }

  render() {
    // 文本域
    const { TextArea, Search } = Input;
    // 表单
    const FormItem = Form.Item;
    // 标签
    const { selectedTags } = this.state;
    const { labelList } = this.props.projectManage;

    return (
      <PageHeaderWrapper>
        <Form ref={this.formRef}>
          <Card bordered={false}>
            <FormItem
              label="名称"
              name="name"
              style={{ paddingRight: '50px' }}
              rules={[{ required: true, message: '请输入项目名称！' }]}
            >
              <Input placeholder="请输入项目名称" maxLength={20} style={{ marginLeft: '40px' }} />
            </FormItem>
            <FormItem
              label="描述"
              name="describe"
              style={{ paddingRight: '50px' }}
              rules={[{ required: true, message: '请输入项目描述！' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入项目描述"
                maxLength="200"
                style={{ marginLeft: '40px' }}
              />
            </FormItem>
            <div style={{ width: '300px' }}>
              <FormItem
                label="所有者"
                name="bpName"
                rules={[{ required: true, message: '请选择所有者！' }]}
              >
                <Search
                  onClick={() => this.showBPList.visibleShow(true)}
                  style={{ marginLeft: '26px' }}
                />
              </FormItem>
            </div>
            <div>
              <FormItem
                label="时间"
                name="time"
                style={{ paddingRight: '50px' }}
                rules={[{ required: true, message: '请选择时间！' }]}
              >
                <RangePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  onChange={this.onChangeTime}
                  // onOk={this.onOk}
                  style={{ marginLeft: '40px' }}
                />
              </FormItem>
            </div>
            <div style={{ height: '250px', marginLeft: 10 }}>
              <FormItem label="标签" name="label">
                <div style={{ marginLeft: '40px', marginRight: '270px' }}>
                  {/* <span style={{ marginRight: 8 }}>Categories:</span> */}
                  {labelList.map(item => (
                      <CheckableTag
                        key={item.id}
                        checked={selectedTags.indexOf(item.id) > -1}
                        onChange={checked => this.handleChange(item.id, checked)}
                        style={{
                          height: '30px',
                          border: '1px',
                          borderStyle: 'solid',
                          borderColor: '#dcdcdc',
                          lineHeight: '30px',
                          textAlign: 'center',
                          // backgroundColor: '#F5F5F5',
                        }}
                      >
                        {item.name} {item.text}
                      </CheckableTag>
                    )
                    )
                  }
                </div>
              </FormItem>
            </div>
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
        {/* 业务伙伴模态框 */}
        <BPList
          onRef={ref => {
            this.showBPList = ref;
          }}
          getData={data => {
            this.getBPData(data);
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ global, projectManage }) => ({
  languageCode: global.languageCode,
  projectManage,
}))(ProjectEdit);
