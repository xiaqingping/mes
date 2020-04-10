// 流程参数
import React, { Component } from 'react';
import { Card, List, Form, Layout, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { ModelType } from '@/pages/project/components/ModelComponents';
import api from '@/pages/project/api/projectManageDetail';
import style from './index.less';

const { Footer } = Layout;

class ProcessParameter extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const { procssesParam } = props.projectDetail;
    console.log(procssesParam);
    this.state = {
      requestType: procssesParam.requestType,
      paramData: procssesParam,
    };
    this.locationUrl(procssesParam);
  }

  // 数据为空时跳转至其他页面
  locationUrl = data => {
    if (data.length === 0) {
      window.history.back(-1);
    }
  };

  // 组件加载时
  componentDidMount = () => {
    const { paramData } = this.state;
    this.setInitialFromValues(paramData);
  };

  // 设置表单初始值
  setInitialFromValues = data => {
    data.forEach(item => {
      item.params.forEach(it => {
        const { paramKey } = it;
        this.formRef.current.setFieldsValue({
          [paramKey]: it.paramValue || it.deafultValue,
        });
      });
    });
  };

  // 保存参数
  saveParam = () => {
    const { paramData } = this.state;
    const data = this.conversionData();
    const { requestType } = this.state;
    if (requestType === 'addParam') {
      const newData = [];
      newData.params = data;
      newData.processesId = paramData[0].id;
      console.log(newData);
      this.props.dispatch({
        type: 'projectDetail/setParamList',
        payload: newData,
      });
      window.history.back(-1);
    }
    if (requestType === 'editParam') {
      const id = paramData.processesId;
      console.log(data);
      api.updateProcessesParameter(id, data).then(() => {
        window.history.back(-1);
      });
    }
  };

  // 参数数据格式转换
  conversionData = () => {
    const { paramData } = this.state;
    const formData = this.formRef.current.getFieldsValue();
    console.log(paramData);
    // 取出键.值
    const dataKeys = Object.keys(formData);
    const dataValues = Object.values(formData);
    // 合并
    const newList = [];
    dataKeys.forEach((key, indexK) => {
      dataValues.forEach((val, indexV) => {
        const newItem = {};
        if (indexK === indexV) {
          newItem.paramKey = key;
          newItem.paramValue = val;
          newList.push(newItem);
        }
      });
    });

    const data = [];
    paramData[0].params.forEach(item => {
      console.log(item);
      newList.forEach(it => {
        const newIt = JSON.parse(JSON.stringify(it));
        if (item.paramKey === it.paramKey) {
          newIt.taskModelId = item.taskModelId;
          data.push(newIt);
        }
      });
    });
    return data;
  };

  render() {
    const { paramData } = this.state;
    const data = paramData;

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
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <Card title={item.groupName} style={{ width: '100%' }}>
                    {item.params.map((it, index) => {
                      const newIndex = JSON.parse(JSON.stringify(index));
                      return <ModelType data={it} key={newIndex} />;
                    })}
                  </Card>
                </List.Item>
              )}
            />
            <Footer className={style.footer}>
              <div className={style.button}>
                <Button className={style.back} onClick={() => window.history.back(-1)}>
                  返回
                </Button>
                <Button type="primary" onClick={() => this.saveParam()}>
                  提交
                </Button>
              </div>
            </Footer>
          </Form>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(ProcessParameter);
