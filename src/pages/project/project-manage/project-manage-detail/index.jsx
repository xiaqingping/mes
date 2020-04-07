// 项目管理 编辑
import { Card, Tabs, Spin } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { PlusSquareOutlined } from '@ant-design/icons';
import router from 'umi/router';
import api from '@/pages/project/api/projectManageDetail'
import styles from './index.less';
import ProcessList from './components/ProcessList/index'
import FiledList from './components/FiledList/index'
import MemberList from './components/MemberList/index'
// import { expandedRowRender } from '../functions';

const { TabPane } = Tabs;

class ProjectDetail extends Component {
  tableSearchFormRef = React.createRef();

  state = {
    loading: true,
    list: {},       // 基础信息数据
    projectId: 0,   // 项目ID
    selectKey: '1', // Tabs切换
  }

  componentDidMount() {
    // console.log(this.props)
    // console.log(this.props.location)
    // if (!this.props.location.state.projectId) {
    //   router.push('/project/project-manage');
    //   return;
    // }
    const { projectId } = this.props.location.state;
    this.setState({ projectId });
    this.getTableData(projectId);
  }

  // Tabs切换
  callback = key => {
    this.setState({
      selectKey: key
    })
    this.operations();
  }

  // Tabs抬头操作
  operations = () => {
    const { selectKey } = this.state;
    if (selectKey === '1') {
      return (
        <PlusSquareOutlined
          onClick={() => console.log(selectKey)}
          style={{ fontSize: 20, color: '#1890ff' }}
        />
      )
    }
    return '';
  }


  // 获取表格数据
  getTableData = projectId => {
    api.getProjectProcess(projectId).then(res => {
      this.setState({
        list: res,
        loading: false,
      });
    });
  };


  render() {
    const { list, loading, projectId } = this.state;

    if (loading) {
      return (
        <div className="example">
          <Spin size="large" />
        </div>
      )
    }

    return (
      <PageHeaderWrapper>
        <Card className={styles.titleCard}>
          <div className={styles.width}>
            {list.name}
            <span className={styles.textCode}>
              {list.code}
            </span>
          </div>
          <div className={styles.textDesc}>{list.describe}</div>
        </Card>
        <Card>
          <Tabs
            defaultActiveKey="1"
            onChange={key => this.callback(key)}
            style={{height: 480}}
            tabBarExtraContent={this.operations()}
            loading={loading}
          >
            <TabPane tab="流程列表" key="1">
              <ProcessList projectId={projectId}/>
            </TabPane>
            <TabPane tab="文件" key="2">
              <FiledList/>
            </TabPane>
            <TabPane tab="成员" key="3">
              <MemberList projectId={projectId}/>
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(ProjectDetail);
