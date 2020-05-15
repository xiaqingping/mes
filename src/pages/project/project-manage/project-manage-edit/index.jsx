// 项目管理：新建项目
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Card, Form, Tag, Button, DatePicker, message } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import api from '@/pages/project/api/projectManage';
// import classNames from 'classnames';
import BPList from './components/BPList';
import './index.less';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;

class ProjectEdit extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const projectId = this.props.match.params;
    const { projectData, labels } = props.projectManage;
    // console.log(this.props);

    this.state = {
      requestType: projectData.requestType || 'addProject', // 请求类型
      selectedlabels: [], // 选中标签
      bpCode: '', // bp编号
      bpName: '', // bp名称
      beginDate: '', // 开始时间
      endDate: '', // 结束时间
      projectData,
      labels,
      projectId,
    };
  }

  // 组件加载时
  componentDidMount = () => {
    // const { projectData ,projectId,requestType} = this.state;
    // this.requestTypeInit(projectData);
    const { projectId, requestType } = this.state;
    const modifyProject = JSON.parse(sessionStorage.getItem('ModifyProject'));
    if (JSON.stringify(projectId) === '{}') {
      this.setState(
        {
          requestType,
        },
        () => {
          // console.log(this.state);
        },
      );
    }
    if (JSON.stringify(projectId) !== '{}') {
      // 设置初始值
      if (!(this.formRef.current === null)) {
        this.formRef.current.setFieldsValue({
          name: modifyProject.name,
          describe: modifyProject.describe,
          bpName: modifyProject.bpName,
        });
      }
      this.setState({
        selectedlabels: modifyProject.labels,
        beginDate: modifyProject.beginDate,
        endDate: modifyProject.endDate,
      });
    }
    return false;
  };

  // 保存
  handleSave = () => {
    const data = this.saveData();
    const { projectId } = this.state;
    // 新建
    if (JSON.stringify(projectId) === '{}') {
      api.addProjects(data).then(() => {
        router.push('/project/project-manage');
      });
    }
    // 修改
    if (JSON.stringify(projectId) !== '{}') {
      api.updateProjects(data).then(() => {
        router.push('/project/project-manage');
      });
    }
    sessionStorage.removeItem('ModifyProject');
  };

  // 保存时所需数据
  saveData = () => {
    const { selectedlabels, bpCode, bpName, endDate, beginDate, projectId } = this.state;
    // console.log(this.state);
    const formData = this.formRef.current.getFieldsValue();
    // console.log(formData);

    if (formData.name === undefined) {
      message.error('项目名称不能为空！');
      return false;
    }
    if (formData.describe === undefined) {
      message.error('项目描述不能为空！');
      return false;
    }

    // 新增项目
    let data;
    if (JSON.stringify(projectId) === '{}') {
      // console.log('新建项目')
      if (bpName === '') {
        message.error('所有者不能为空！');
        return false;
      }
      if (beginDate === '') {
        message.error('开始时间不能为空！');
        return false;
      }
      if (endDate === '') {
        message.error('结束时间不能为空！');
        return false;
      }
      if (selectedlabels.length === 0) {
        message.error('标签不能为空！');
        return false;
      }
      data = {
        name: formData.name,
        describe: formData.describe,
        bpCode,
        bpName,
        endDate,
        beginDate,
        labels: selectedlabels,
      };
    }

    // 修改项目
    if (JSON.stringify(projectId) !== '{}') {
      data = {
        id: projectId.id,
        name: formData.name,
        describe: formData.describe,
        labels: selectedlabels,
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
  navContent = () => {
    // console.log(data);
    const modifyProject = JSON.parse(sessionStorage.getItem('ModifyProject'));
    // console.log(modifyProject)
    const { projectId } = this.state;
    let titleName;
    if (JSON.stringify(projectId) === '{}') {
      titleName = '新建项目';
    }
    if (JSON.stringify(projectId) !== '{}') {
      titleName = modifyProject.name;
    }

    return <div>{titleName}</div>;
  };

  // 跳转到添加流程页面
  handleAdd = () => {
    const data = this.saveData();
    console.log(data);
    if (data === false) {
      this.props.dispatch({
        type: 'projectManage/setProjectInfor',
        payload: data,
      });
    } else {
      data.requestType = 'add';
      this.props.dispatch({
        type: 'projectManage/setProjectInfor',
        payload: data,
      });

      router.push('/project/project-manage/add/addflowpath/add');
    }
  };

  render() {
    const { selectedlabels, projectData, labels, projectId } = this.state;
    console.log(this.state);
    return (
      <PageHeaderWrapper title={this.navContent(projectData)}>
        <Form ref={this.formRef} className="classPageHeaderWrapper">
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
                  disabled={JSON.stringify(projectId) !== '{}'}
                />
              </FormItem>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <FormItem label="时间" name="time" style={{ paddingRight: '50px' }}>
                {JSON.stringify(projectId) === '{}' ? (
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
                    // defaultValue={[
                    //   moment(projectData.beginDate, 'YYYYMMDD HH:mm:ss'),
                    //   moment(projectData.endDate, 'YYYYMMDD HH:mm:ss'),
                    // ]}
                    initialValues={[
                      moment(projectData.beginDate, 'YYYYMMDD HH:mm:ss'),
                      moment(projectData.endDate, 'YYYYMMDD HH:mm:ss'),
                    ]}
                    onChange={this.handleOnChangeTime}
                    style={{ marginLeft: '40px' }}
                    disabled={JSON.stringify(projectId) !== '{}'}
                  />
                )}
              </FormItem>
            </div>
            <div style={{ height: '250px' }}>
              <FormItem label="标签" name="label">
                <div style={{ marginLeft: '40px', marginRight: '270px' }}>
                  {labels.map(item => (
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
                        cursor: 'pointer',
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
              height: '56px',
              width: '100%',
              position: 'fixed',
              bottom: '0',
              left: '0',
            }}
            className="classPageHeaderWrapperFooter"
          >
            <Button type="default" onClick={() => this.handleSave()}>
              保存
            </Button>
            {JSON.stringify(projectId) === '{}' ? (
              <Button type="primary" onClick={() => this.handleAdd(true)}>
                添加流程
              </Button>
            ) : (
              <Button type="primary" onClick={() => this.handleAdd(true)} className="isShow">
                添加流程
              </Button>
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
