/** 任务执行记录参数 */
import React, { Component } from 'react';
import { Drawer, List, Form, message } from 'antd';
import api from '@/pages/project/api/projectManageDetail';
/** 参数组件引用 */
// eslint-disable-next-line max-len
import EnvironmentalFactorsModel from '@/pages/project/components/ModelComponents/EnvironmentalFactorsModel';
import SampleGroupModel from '@/pages/project/components/ModelComponents/SampleGroupModel/index';
import SampleSelectModel from '@/pages/project/components/ModelComponents/SampleSelectModel/index';
import CheckBoxModel from '@/pages/project/components/ModelComponents/CheckBoxModel';
import InputModel from '@/pages/project/components/ModelComponents/InputModel/index';
import InputNumberModel from '@/pages/project/components/ModelComponents/InputNumberModel';
import RadioModel from '@/pages/project/components/ModelComponents/RadioModel';

class TaskExecRecordParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 接收的参数列表
      paramList: this.props.paramList,
      // 任务模型参数
      params: [],
      // 任务执行记录参数值
      paramValues: this.props.paramList.paramValues,
      // 参数渲染数据
      paramData: [],
      // 样品列表
      sampleList: [],
    };
  }

  /** 组件加载时 */
  componentDidMount() {
    const { taskModelId } = this.state.paramList;
    this.getTaskModelParamData(taskModelId);
  }

  /**
   * 获取参数数据
   * @param {Array} param  任务模型参数
   */
  getTaskParamData = param => {
    console.log(param);
    if (!param) return message.warning('当前任务暂无参数');

    const { paramValues } = this.state;
    let newParamData;
    if (paramValues) {
      const newParam = this.disposeTaskData(param);
      newParamData = this.disposeParamData(newParam, paramValues);
    } else {
      newParamData = this.disposeTaskData(param);
    }
    // 去除样品列表数据
    let sampleList = [];
    param.forEach(item => {
      // TODO:
      if (item.type === 'sample_select' || item.type === 'sample') {
        if (item.paramValue) {
          sampleList = [...sampleList, ...JSON.parse(item.paramValue)];
        }
      }
    });
    this.setState({ paramData: newParamData, sampleList });
    return false;
  };

  /**
   * 处理任务模型参数列表
   * @param {Array} param  任务模型参数
   */
  disposeTaskData = param => {
    const newData = [];
    param.forEach(item => {
      const newItem = JSON.parse(JSON.stringify(item));
      delete newItem.paramProperties;
      delete newItem.paramPropertiesMap;
      item.paramProperties.forEach(e => {
        newItem[e.paramPropertyKey] = e.paramPropertyValue;
      });
      newData.push(newItem);
    });
    return newData;
  };

  /**
   * 合并参数列表和参数值
   * @param {Array} paramData  任务模型参数
   * @param {Array} valueData  任务执行记录参数
   */
  disposeParamData = (paramData, valueData) => {
    const newData = [];
    paramData.forEach(paramItem => {
      valueData.forEach(valueItem => {
        const newItem = JSON.parse(JSON.stringify(paramItem));
        if (paramItem.paramKey === valueItem.paramKey) {
          newItem.paramValue = valueItem.paramValue;
          newData.push(newItem);
        }
      });
    });
    return newData;
  };

  /**
   * 获取任务模型参数
   * @param {String} taskModelId 任务模型ID
   */
  getTaskModelParamData = taskModelId => {
    api.getTaskModelParam(taskModelId).then(res => {
      this.setState({ params: res }, () => {
        this.getTaskParamData(this.state.params, this.state.paramValues);
      });
    });
  };

  render() {
    const { paramData, sampleList } = this.state;
    return (
      <Drawer
        title="参数"
        width={320}
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Form>
          <List
            dataSource={paramData}
            split={false}
            renderItem={(item, index) => {
              // 单行输入框
              if (item.type === 'input') {
                return (
                  <List.Item>
                    <InputModel paramList={item} key={index} disabled />
                  </List.Item>
                );
              }

              // 数值输入框
              if (item.type === 'number_input') {
                return <InputNumberModel paramList={item} key={index} disabled />;
              }
              // 单选
              if (item.type === 'radio') {
                return <RadioModel paramList={item} key={index} disabled />;
              }

              // 多选
              if (item.type === 'checkbox') {
                return <CheckBoxModel paramList={item} key={index} disabled />;
              }

              // 样品选择框
              if (item.type === 'sample_select') {
                return <SampleSelectModel paramList={item} key={index} disabled />;
              }

              // 样品分组方案
              if (item.type === 'sample_group') {
                return (
                  <SampleGroupModel
                    paramList={item}
                    key={index}
                    sampleList={sampleList}
                    getFun={func => {
                      this.handleUpdateSampleGroup = func;
                    }}
                    disabled
                  />
                );
              }
              // 样品环境因子
              if (item.type === 'sample_environment_factor') {
                return (
                  <EnvironmentalFactorsModel
                    paramList={item}
                    key={index}
                    sampleList={sampleList}
                    getFun={func => {
                      this.handleUpdateEnvironmentFactor = func;
                    }}
                    disabled
                  />
                );
              }
              return false;
            }}
          />
        </Form>
      </Drawer>
    );
  }
}

export default TaskExecRecordParam;
