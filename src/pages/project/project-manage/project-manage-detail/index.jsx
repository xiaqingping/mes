// 项目管理 编辑
import { Card, Avatar, Descriptions, Row, Col, Tabs } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import style from './index.less';
import ProcessList from './components/ProcessList/index'
import FiledList from './components/FiledList/index'
import MemberList from './components/MemberList/index'
// import { expandedRowRender } from '../functions';

const DescriptionsItem = Descriptions.Item;
const { TabPane } = Tabs;

class ProjectDetail extends Component {
  tableSearchFormRef = React.createRef();

  state = {
    list: {
      name: '微生物多样性分析',
      code: '569568542833845550000',
      desc: '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。'
    },
  }

  callback = key => {
    console.log(key);
  }


  render() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const { list } = this.state;

    return (
      <PageHeaderWrapper>
        <Card className={style.titleCard}>
          <Row>
            <Col flex="80px">
              <Avatar src={currentUser.avatar} alt="avatar" style={{height: 60, width: 60}}/>
            </Col>

            <Col flex="90%" >
              <div className="width">
                <DescriptionsItem>{list.name}</DescriptionsItem>
                <span style={{ display: 'inline-block',marginLeft: 50 }}>
                  <DescriptionsItem>{list.code}</DescriptionsItem>
                </span>
              </div>
              <div style={{marginTop: 20}}>
                <DescriptionsItem>{list.desc}</DescriptionsItem>
              </div>
            </Col>
          </Row>
        </Card>
        <Card>
            <Tabs defaultActiveKey="1" onChange={this.callback} style={{height: 480}}>
              <TabPane tab="流程列表" key="1">
                <ProcessList />
              </TabPane>
              <TabPane tab="文件" key="2">
                <FiledList/>
              </TabPane>
              <TabPane tab="成员" key="3">
                <MemberList/>
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
