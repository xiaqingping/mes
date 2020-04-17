// 项目管理：新建项目
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Card, Form, Tag, Button, DatePicker, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import api from '@/pages/project/api/projectManage';
import BPList from './components/BPList';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;

class ProjectEdit extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const { projectData, labelList } = props.projectManage;
    console.log(projectData);

    this.state = {
      requestType: projectData.requestType || 'addProject', // 请求类型
      selectedlabels: [], // 选中标签
      bpCode: '', // bp编号
      bpName: '', // bp名称
      beginDate: '', // 开始时间
      endDate: '', // 结束时间
      projectData,
      labelList,
    };
  }

  // 组件加载时
  componentDidMount = () => {
    const { projectData } = this.state;
    this.requestTypeInit(projectData);
  };

  // 判断请求类型
  requestTypeInit = data => {
    const { requestType } = this.state;
    if (requestType === 'addProject') {
      this.setState({
        requestType,
      });
    }
    if (requestType === 'editProject') {
      // 设置初始值
      if (!(this.formRef.current === null)) {
        this.formRef.current.setFieldsValue({
          name: data.name,
          describe: data.describe,
          bpName: data.bpName,
        });
      }
      this.setState({
        selectedlabels: data.labelList,
        beginDate: data.beginDate,
        endDate: data.endDate,
      });
    }
    return false;
  };

  // 保存
  handleSave = () => {
    const data = this.saveData();
    const { requestType } = this.state;
    if (requestType === 'addProject') {
      api.addProjects(data).then(() => {
        router.push('/project/project-manage');
      });
    }
    if (requestType === 'editProject') {
      api.updateProjects(data).then(() => {
        router.push('/project/project-manage');
      });
    }
  };

  // 保存时所需数据
  saveData = () => {
    const {
      selectedlabels,
      bpCode,
      bpName,
      endDate,
      beginDate,
      requestType,
      projectData,
    } = this.state;
    const formData = this.formRef.current.getFieldsValue();

    if (formData.name === undefined) {
      message.error('项目名称不能为空！');
      return 1;
    }
    if (formData.describe === undefined) {
      message.error('项目描述不能为空！');
      return 1;
    }
    // 新增项目时
    if (requestType === 'addProject') {
      if (bpName === '') {
        message.error('所有者不能为空！');
        return 1;
      }
      if (beginDate === '') {
        message.error('开始时间不能为空！');
        return 1;
      }
      if (endDate === '') {
        message.error('结束时间不能为空！');
        return 1;
      }
    }

    let data;
    if (requestType === 'addProject') {
      data = {
        name: formData.name,
        describe: formData.describe,
        bpCode,
        bpName,
        endDate,
        beginDate,
        labelList: selectedlabels,
      };
    }
    if (requestType === 'editProject') {
      data = {
        id: projectData.id,
        name: formData.name,
        describe: formData.describe,
        labelList: selectedlabels,
      };
    }
    return data;
  };

  // 时间选中事件
  handleOnChangeTime = (value, dateString) => {
    this.setState({
      beginDate: dateString[0],
      endDate: dateString[1],
    });
  };

  // 标签选中事件
  handleOnChangelabel = (tag, checked) => {
    const { selectedlabels } = this.state;
    // eslint-disable-next-line max-len
    const nextSelectedTags = checked
      ? [...selectedlabels, tag]
      : selectedlabels.filter(t => t !== tag);
    this.setState({ selectedlabels: nextSelectedTags });
  };

  // 获取业务伙伴模态框回传数据
  getBPData = data => {
    this.formRef.current.setFieldsValue({
      bpName: data.name,
    });
    this.setState({
      bpCode: data.code,
      bpName: data.name,
    });
  };

  // 导航列表title样式
  navContent = data => {
    const { requestType } = this.state;
    let titleName;
    if (requestType === 'addProject') {
      titleName = '新建项目';
    }
    if (requestType === 'editProject') {
      titleName = data.name;
    }

    return <div>{titleName}</div>;
  };

  // 跳转到添加流程页面
  handleAdd = () => {
    const data = this.saveData();
    if (data === 1) return;
    this.props.dispatch({
      type: 'projectManage/setProjectInfor',
      payload: data,
    });

    router.push('/project/project-manage/add/addflowpath');
  };

  render() {
    const { requestType, selectedlabels, projectData, labelList } = this.state;
    return (
      <PageHeaderWrapper title={this.navContent(projectData)}>
        <Form ref={this.formRef}>
          <Card bordered={false}>
            <FormItem
              label="名称"
              name="name"
              style={{ paddingRight: '50px', width: '600px', marginBottom: '20px' }}
            >
              <Input placeholder="请输入项目名称" maxLength={20} style={{ marginLeft: '40px' }} />
            </FormItem>
            <FormItem
              label="描述"
              name="describe"
              style={{ paddingRight: '50px', width: '600px', marginBottom: '20px' }}
            >
              <TextArea
                rows={4}
                placeholder="请输入项目描述"
                maxLength="200"
                style={{ marginLeft: '40px' }}
              />
            </FormItem>
            <div style={{ width: '300px', marginBottom: '20px' }}>
              <FormItem label="所有者" name="bpName">
                <Search
                  onSearch={() => this.showBPList.visibleShow(true)}
                  style={{ marginLeft: '26px' }}
                  readOnly
                  disabled={requestType === 'editProject'}
                />
              </FormItem>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <FormItem label="时间" name="time" style={{ paddingRight: '50px' }}>
                {requestType === 'addProject' ? (
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.handleOnChangeTime}
                    style={{ marginLeft: '40px' }}
                  />
                ) : (
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    defaultValue={[
                      moment(projectData.beginDate, 'YYYYMMDD HH:mm:ss'),
                      moment(projectData.endDate, 'YYYYMMDD HH:mm:ss'),
                    ]}
                    onChange={this.handleOnChangeTime}
                    style={{ marginLeft: '40px' }}
                    disabled={requestType === 'editProject'}
                  />
                )}
              </FormItem>
            </div>
            <div style={{ height: '250px' }}>
              <FormItem label="标签" name="label">
                <div style={{ marginLeft: '40px', marginRight: '270px' }}>
                  {/* <span style={{ marginRight: 8 }}>Categories:</span> */}
                  {labelList.map(item => (
                    <CheckableTag
                      key={item.id}
                      checked={selectedlabels.indexOf(item.id) > -1}
                      onChange={checked => this.handleOnChangelabel(item.id, checked)}
                      style={{
                        height: '30px',
                        border: '1px',
                        borderStyle: 'solid',
                        borderColor: '#dcdcdc',
                        lineHeight: '30px',
                        textAlign: 'center',
                      }}
                    >
                      {item.name} {item.text}
                    </CheckableTag>
                  ))}
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
              onClick={() => this.handleSave(true, 'requestType')}
            >
              保存
            </Button>
            {requestType === 'addProject' ? (
              <Button
                type="primary"
                style={{ float: 'right', marginTop: '-16px' }}
                onClick={() => this.handleAdd(true)}
              >
                添加流程
              </Button>
            ) : (
              ''
            )}
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
