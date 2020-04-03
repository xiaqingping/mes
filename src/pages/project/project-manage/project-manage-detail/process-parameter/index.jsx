// 流程参数
import React, { Component } from 'react';
import { Card, List, Form, Layout, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { InputModel } from '@/pages/project/components/ModelComponents';
import style from './index.less';
// import { OriginalParameter, EnvironmentalFactorTable } from './components/ParamUI'

const { Footer } = Layout;

class ProcessParameter extends Component {

  state = {};

  // 排序
  compare = key => (obj1, obj2) => {
    const value1 = obj1[key]
    const value2 = obj2[key]
    if (value1 > value2) {
      return 1;
    } if (value1 < value2) {
      return -1;
    }
    return 0;
  }

  // 格式化数据（排序）
  formatData = parameterList => {
    parameterList.forEach(item => {
      item.params.sort(this.compare('sortNo'));
    })
    return parameterList;
  }

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };


  render() {
    const { res } = this.props.location.state;
    const list = this.formatData(res);          // 数据排序
    // console.log(list);

    return (
      <>
        <PageHeaderWrapper>
          <Form
            name="basic"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <List
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <Card title={item.groupName} style={{width: '100%'}}>
                      {
                        item.params.map((it, index) => {
                          const newIt = JSON.parse(JSON.stringify(it));
                          newIt.index = JSON.parse(JSON.stringify(index));
                          newIt.paramProperties.forEach(ie => {
                            newIt[ie.paramPropertyKey] = ie.paramPropertyValue
                          })
                          return <InputModel key={newIt.index} data={newIt}/>;
                          // if (it.type === 'input') return <InputModel key={newIt.index} data={newIt}/>;
                          // return 123;
                        })
                      }
                  </Card>
                </List.Item>
              )}
            />
            <Footer className={style.footer}>
              <div className={style.button}>
                <Button className={style.back} onClick={() => window.history.back(-1)} >返回</Button>
                <Button type="primary">提交</Button>
              </div>
            </Footer>
          </Form>
        </PageHeaderWrapper>


      </>
    );
  };
};

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(ProcessParameter);
