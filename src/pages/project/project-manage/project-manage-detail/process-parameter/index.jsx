// 流程参数
import React, { Component } from 'react';
import { Card, List, Form, Layout, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ModelType } from '@/pages/project/components/ModelComponents';
import router from 'umi/router';
import style from './index.less';

const { Footer } = Layout;

class ProcessParameter extends Component {
  formRef = React.createRef();

  state = {}

  componentDidMount = () => {
    if (this.props.location.state === undefined) {
      router.push('/project/project-manage/detail');
      return;
    }
    const { newData } = this.props.location.state;
    this.setInitialFromValues(newData);
  }



  // 设置表单初始值
  setInitialFromValues = data => {
    data.forEach(item => {
      item.params.forEach(it => {
        const { paramKey } = it;
        this.formRef.current.setFieldsValue({
          [paramKey]: it.paramValue || it.deafultValue
        })
      })
    });
  }

  // 排序
  // compare = key => (obj1, obj2) => {
  //   const value1 = obj1[key]
  //   const value2 = obj2[key]
  //   if (value1 > value2) {
  //     return 1;
  //   } if (value1 < value2) {
  //     return -1;
  //   }
  //   return 0;
  // }

  // // 格式化数据（排序）
  // formatData = parameterList => {
  //   parameterList.forEach(item => {
  //     item.params.sort(this.compare('sortNo'));
  //   })
  //   return parameterList;
  // }

  // 保存参数
  saveParam = () => {
    // const { newData } = this.props.location.state;
    const formData = this.formRef.current.getFieldsValue();
    console.log(formData);

    const arr = [];

    // for (key in formData) {
    //   // if ({}.hasOwnProperty.call(formData, key)) {
    //     console.log(`${key}---${formData[key]}`);
    //   // }
    // }

    console.log(arr);

    // var jsonArr = [];
    // formData.for(var i = 0; i < jsonObj.length; i++) {
    //       jsonArr[i] = jsonObj[i];
    // }
    // console.log(formData);
    // formData.forEach(item => {
    //   console.log(item);
    // });
  }


  render() {
    // const list = this.formatData(res);          // 数据排序
    const { newData } = this.props.location.state;
    const list = newData;
    // console.log(list);

    return (
      <>
        <PageHeaderWrapper>
          <Form
            name="basic"
            ref={this.formRef}
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
                          const newIndex = JSON.parse(JSON.stringify(index));
                          return <ModelType data={it} key={newIndex} />;
                        })
                      }
                  </Card>
                </List.Item>
              )}
            />
            <Footer className={style.footer}>
              <div className={style.button}>
                <Button className={style.back} onClick={() => window.history.back(-1)} >返回</Button>
                <Button type="primary" onClick={() => this.saveParam()}>提交</Button>
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
