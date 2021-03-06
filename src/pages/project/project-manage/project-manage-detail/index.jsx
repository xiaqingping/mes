/** 项目管理 编辑页面 */
import { Card, Tabs } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { PlusSquareOutlined } from '@ant-design/icons';
import router from 'umi/router';
import api from '@/pages/project/api/projectManageDetail';
import styles from './index.less';
import ProcessList from './components/ProcessList/index';
import FiledList from './components/FiledList/index';
import MemberList from './components/MemberList/index';

const { TabPane } = Tabs;

class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    const projectId = this.props.match.params.id;
    this.state = {
      loading: true,
      list: {}, // 基础信息数据
      projectId, // 项目ID
      selectKey: '1', // Tabs切换
    };
  }

  /** 组件加载时 */
  componentDidMount() {
    const projectId = this.props.match.params.id;
    // 加载table数据
    this.getTableData(projectId);
  }

  /**
   * Tabs切换
   * @param {string} key Tabs 参数
   */
  callback = key => {
    this.setState({
      selectKey: key,
    });
    this.operations();
  };

  /** Tabs抬头操作 */
  operations = () => {
    const { selectKey, list } = this.state;
    if (selectKey === '1') {
      return (
        <PlusSquareOutlined
          onClick={() => this.handleAddProcesses(list)}
          style={{ fontSize: 20, color: '#1890ff', paddingRight: 30, paddingTop: 20 }}
        />
      );
    }
    return '';
  };

  /**
   * 添加流程
   * @param {object} data 基础信息数据list
   */
  handleAddProcesses = data => {
    const type = 'edit';
    const projectId = data.id;
    router.push(`/project/project-manage/detailAdd/${type}_${projectId}`);
  };

  /**
   * 获取表格数据
   * @param {string} projectId 查询字符串guid
   */
  getTableData = projectId => {
    this.setState({ loading: true });
    api.getProjectProcess(projectId).then(res => {
      this.setState({ list: res });
    });
    this.setState({ loading: false });
  };

  /**
   * 导航列表title样式
   * @param {string} list 基础信息数据list
   */
  navContent = list => {
    if (list) {
      return <div>{list.name}</div>;
    }
    return '';
  };

  render() {
    const { list, loading, projectId } = this.state;
    if (JSON.stringify(list) === '{}') return false;
    return (
      <PageHeaderWrapper title={this.navContent(list)}>
        <div className="classPageHeaderWrapper ">
          <Card className={styles.titleCard}>
            <div className={styles.width}>
              {list.name}
              <span className={styles.textCode}>{list.code}</span>
            </div>
            <div className={styles.textDesc}>{list.describe}</div>
          </Card>
        </div>
        <Card className="classTabPane">
          <Tabs
            defaultActiveKey="1"
            onChange={key => this.callback(key)}
            tabBarExtraContent={this.operations()}
            loading={loading}
          >
            <TabPane tab="流程列表" key="1" width="120px">
              <div className="classProcessList">
                <ProcessList projectId={projectId} data={list} />
              </div>
            </TabPane>
            <TabPane tab="文件" key="2">
              <div className="classFile">
                <FiledList />
              </div>
            </TabPane>
            <TabPane tab="成员" key="3">
              <div className="classMemberList">
                <MemberList projectId={projectId} />
              </div>
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
