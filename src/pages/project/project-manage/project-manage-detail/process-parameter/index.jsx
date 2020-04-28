// 流程参数
import React, { Component } from 'react';
import { Card, List, Form, Layout, Button, message, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import api from '@/pages/project/api/projectManageDetail';
import { QuestionCircleOutlined } from '@ant-design/icons';

/** 参数组件引用 */
// eslint-disable-next-line max-len
import EnvironmentalFactorsModel from '@/components/ModelComponents/EnvironmentalFactorsModel';
import SampleGroupModel from '@/components/ModelComponents/SampleGroupModel/index';
import SampleSelectModel from '@/components/ModelComponents/SampleSelectModel/index';
import CheckBoxModel from '@/components/ModelComponents/CheckBoxModel/index';
import InputModel from '@/components/ModelComponents/InputModel/index';
import InputNumberModel from '@/components/ModelComponents/InputNumberModel';

/** 样式 */
import style from './index.less';

const { Footer } = Layout;

class ProcessParameter extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const { type, processModelId, processId, projectId } = this.props.match.params;
    this.state = {
      // 参数页面前置数据
      requestType: type, // 请求类型
      processId, // 流程ID
      processModelId, // 流程模型ID
      projectId, // 项目ID
      paramList: [], // 参数列表
      // 流程模型参数
      processParam: [],
      // 流程参数值
      processParamValue: [],
      // 是否提交
      submitStatus: false,
      // 样品选择框 样品列表
      sampleList: [],
      // 提交的数据
      submitData: [],
    };
    // 判断请求类型
    this.determineTheRequestType()
  }

  // 组件加载时
  componentDidMount = () => {
  };

  // 判断请求类型
  determineTheRequestType = () => {
    const { requestType, processId, processModelId } = this.state;
    // 创建项目 添加参数值
    if (requestType === 'add') {
      message.success('add');
      this.getProcessParam(processModelId); // 查询流程参数
    }
    // 创建项目 未保存时修改参数值
    if (requestType === 'update') {
      message.success('update');
      this.getProcessParam(processModelId); // 查询流程参数
    }

    // 流程参数 修改参数值
    if (requestType === 'edit') {
      message.success('edit');
      this.getProcessParam(processModelId); // 查询流程参数
      this.getProcessParamValue(processId); // 查询流程参数值
    }
    // 查看参数
    if (requestType === 'view') {
      message.success('view');
      this.getProcessParam(processModelId); // 查询流程参数
      this.getProcessParamValue(processId); // 查询流程参数值
    }
    return false;
  };

  /**
   * 获取数据 执行不同的处理
   * param  流程模型参数
   * paramValue 流程参数值
   */
  getParamData = (param, paramValue) => {
    const { requestType } = this.state;
    if (param.length > 0) {
      // 处理参数数据
      const newParam = this.deleteNullGroup(param); // 删除参数为空的分组
      // 无参数
      if (newParam.length === 0) {
        message.error('暂无参数列表！');
        return false;
      }
      const newParamData = this.disposeParamAttribute(newParam); // 处理参数属性

      // 添加 参数值
      if (requestType === 'add') {
        message.success('添加操作');
        if (param.length > 0) {
          this.setState({ paramList: newParamData });
        }
      }

      // 修改 未保存的参数值
      if (requestType === 'update') {
        message.success('修改操作');
        // update参数值
        const paramList = sessionStorage.getItem('processForParams');

        const processParamValue = paramList.params;
        // 有参数值时
        if (
          newParamData.length > 0 &&
          !(
            processParamValue === null ||
            processParamValue === undefined ||
            processParamValue === ''
          )
        ) {
          // 合并参数和参数值
          const data = this.comparedWith(newParamData, paramValue);
          this.setState({ paramList: data });
          return false;
        }
        // 未设置参数值时
        if (param.length > 0 && paramValue.length === 0) {
          this.setState({ paramList: newParamData });
        }
      }

      // 编辑 参数值
      if (requestType === 'edit' || requestType === 'view') {
        message.success('编辑操作');

        // 有参数值时
        if (newParamData.length > 0 && paramValue.length > 0) {
          // 合并参数和参数值
          const data = this.comparedWith(newParamData, paramValue);
          this.setState({ paramList: data });
          return false;
        }
        // 未设置参数值时
        if (param.length > 0 && paramValue.length === 0) {
          this.setState({ paramList: newParamData });
        }
      }
    }
    return false;
  };

  // edit 设置表单初始值
  setInitialFromValues = data => {
    data.forEach(item => {
      const { paramKey } = item;
      this.formRef.current.setFieldsValue({
        [paramKey]: item.paramValue || item.deafultValue,
      });
    });
  };

  // 保存提交
  onFinish = values => {
    this.setState({ submitStatus: true });
    const data = this.conversionData(values);
    const { requestType, processId, processModelId, projectId } = this.state;
    let url;

    // 添加 修改
    if (requestType === 'add' || requestType === 'update') {
      const paramsList = JSON.parse(sessionStorage.getItem('processForParams'));
      console.log(paramsList);
      const newData = { params: data, processModelId };
      const list = [];
      if (paramsList === '' || paramsList === null) {
        list.push(newData);
      } else {
        list.push([...paramsList, newData]);
      }

      sessionStorage.setItem('processForParams', JSON.stringify(list));
      // sessionStorage.removeItem('processForParams');
      if (projectId === '' || projectId === undefined)
        url = `/project/project-manage/add/addflowpath`;
      if (projectId) url = `/project/project-manage/add/addflowpath/edit/${projectId}`;
      return router.push(url);
    }
    // 编辑
    if (requestType === 'edit') {

      api.updateProcessesParameter(processId, data).then(() => {
        if (projectId === '') url = `/project/project-manage`;
        if (projectId !== '') url = `/project/project-manage/detail/${projectId}`;
        return router.push(url);
      });
    }
    return false;
  };

  // 提交指令 组件返回数据
  getModelData = data => {
    const { submitData } = this.state;
    // console.log(submitData);
    // console.log(data);
    const newData = [...submitData, data];
    // console.log(newData);
    this.setState({ submitData: newData });
  };

  // 保存时 参数数据格式转换
  conversionData = formData => {
    // 删除参数为空的分组
    const { processParam } = this.state;
    const newProcessParam = this.deleteNullGroup(processParam);
    // 获取所有参数
    const paramData = [];
    newProcessParam.forEach(groupItem => {
      groupItem.params.forEach(paramItem => {
        paramData.push(paramItem);
      });
    });
    // 参数和属性合并为一层数据
    const nParamData = this.manageAttribute(paramData);

    // 拆分键值对
    const newFormData = this.splitFormData(formData);
    // 获取参数的任务模型ID
    const data = this.getParamTaskModelId(nParamData, newFormData);

    // 将默认值的赋值到已提交的数据中
    const newData = [];
    data.forEach(item => {
      const newItem = JSON.parse(JSON.stringify(item));
      if (item.paramValue === undefined || item.paramValue === '') {
        newItem.paramValue = item.defaultValue;
      }
      delete newItem.defaultValue;
      newData.push(newItem);
    });

    return data;
  };

  /**
   * 拆分form表单的值
   * formData 表单的值 input
   */
  splitFormData = formData => {
    // 取出键.值
    const dataKeys = Object.keys(formData);
    const dataValues = Object.values(formData);
    // 合并
    const data = [];
    dataKeys.forEach((key, indexK) => {

      dataValues.forEach((val, indexV) => {
        const newItem = {};
        if (indexK === indexV) {
          newItem.paramKey = key;
          newItem.paramValue = val;
          data.push(newItem);
        }
      });
    });
    return data;
  };

  /**
   * 获取参数的任务模型ID
   * params 参数列表
   * values 参数值列表
   */
  getParamTaskModelId = (params, values) => {
    const data = [];
    params.forEach(paramItem => {
      values.forEach(valItem => {
        const newIt = JSON.parse(JSON.stringify(valItem));
        if (paramItem.paramKey === valItem.paramKey) {
          newIt.taskModelId = paramItem.taskModelId;
          newIt.defaultValue = paramItem.defaultValue || paramItem.deafultValue;
          data.push(newIt);
        }
      });
    });
    return data;
  };

  /**
   * 参数和属性合并为一层数据
   * params 参数列表
   */
  manageAttribute = params => {
    const nparam = [];
    params.forEach(paramItem => {
      const nParamItem = JSON.parse(JSON.stringify(paramItem));
      // 遍历参数属性列表
      const propertyList = paramItem.paramProperties;
      propertyList.forEach(proItem => {
        // key：value
        nParamItem[proItem.paramPropertyKey] = proItem.paramPropertyValue;
      });

      // 删除 参数属性列表和排序 字段（可不删）
      delete nParamItem.paramProperties;
      delete nParamItem.sortNo;

      // 保存处理好的参数
      nparam.push(nParamItem);
    });
    return nparam;
  };

  /**
   * 删除参数为空的分组
   * paramData 参数
   */
  deleteNullGroup = data => {
    const newData = [];
    data.forEach(item => {
      if (item.params.length > 0) {
        newData.push(item);
      }
    });
    return newData;
  };

  /**
   * 处理参数属性
   * paramData 参数
   */
  disposeParamAttribute = data => {
    const newData = [];
    // 遍历分组
    data.forEach(groupItem => {
      // 保留分组信息 分组参数设置为空 以便新的参数列表赋值
      const groupData = JSON.parse(JSON.stringify(groupItem));
      groupData.params = [];

      // 遍历参数列表
      const paramList = groupItem.params;
      const nparam = [];
      paramList.forEach(paramItem => {
        const nParamItem = JSON.parse(JSON.stringify(paramItem));
        // 遍历参数属性列表
        const propertyList = paramItem.paramProperties;
        propertyList.forEach(proItem => {
          // key：value
          nParamItem[proItem.paramPropertyKey] = proItem.paramPropertyValue;
        });

        // 删除 参数属性列表和排序 字段（可不删）
        delete nParamItem.paramProperties;
        delete nParamItem.sortNo;

        // 保存处理好的参数
        nparam.push(nParamItem);
        if (groupData.id === nParamItem.groupId) {
          groupData.params = nparam;
        }
      });

      // 每个分组数据重新push到新数组中
      newData.push(groupData);
    });
    return newData;
  };

  /**
   * 合并参数列表和参数值
   * paramData 参数分组数据
   * valueData 参数值
   */
  comparedWith = (paramGroupData, valueData) => {
    const list = [];
    paramGroupData.forEach(groupItem => {
      // 保存分组数据
      const groupData = JSON.parse(JSON.stringify(groupItem));
      groupData.params = [];

      const paramList = groupItem.params;
      const newList = [];
      paramList.forEach(paramItem => {
        valueData.forEach(valueItem => {
          const newItem = JSON.parse(JSON.stringify(paramItem));
          if (paramItem.paramKey === valueItem.paramKey) {
            if (newList.length > 0) {
              const ids = [];
              newList.forEach(listItem => {
                ids.push(listItem.id);
              });
              if (ids.indexOf(paramItem.id) === -1) {
                newItem.paramValue = valueItem.paramValue;
                newList.push(newItem);
              }
            } else {
              newItem.paramValue = valueItem.paramValue;
              newList.push(newItem);
            }
          }
        });
      });
      groupData.params = newList;
      list.push(groupData);
    });

    return list;
  };

  /**
   * 获取流程参数
   * processModelId 流程模型ID
   */
  getProcessParam = processModelId => {
    api.getProcessParam(processModelId).then(res => {
      if (res.length === 0) {
        message.error('未查询到参数！');
        return false;
      }
      this.setState({ processParam: res }, () => {
        this.getParamData(this.state.processParam, this.state.processParamValue);
      });
      return false;
    });
  };

  /**
   * 获取流程参数值
   * processModelId 流程ID
   */
  getProcessParamValue = processId => {
    api.getProcessParamValue(processId).then(res => {
      this.setState({ processParamValue: res }, () => {
        this.getParamData(this.state.processParam, this.state.processParamValue);
        // 设置默认值
        this.setInitialFromValues(res);
      });
    });
  };

  // 返回
  goBackLink = () => {
    const { requestType, projectId } = this.state;
    let url;
    if (requestType === 'add' || requestType === 'update') {
      if (projectId) url = `/project/project-manage/add/addflowpath/edit/${projectId}`;
      if (projectId === '' || projectId === undefined)
        url = `/project/project-manage/add/addflowpath`;
    } else {
      if (projectId === '') url = `/project/project-manage`;
      if (projectId !== '') url = `/project/project-manage/detail/${projectId}`;
    }

    return router.push(url);
  };

  // 获取样品选择框的实时数据
  getSelectUpdateData = updateData => {
    this.setState(
      {
        sampleList: updateData,
      },
      () => {
        this.handleUpdateSampleGroup();
        this.handleUpdateEnvironmentFactor();
      },
    );
  };

  render() {
    const { paramList, sampleList, submitStatus, requestType } = this.state;
    const data = paramList
    return (
      <>
        <PageHeaderWrapper style={{ marginBottom: 100 }}>
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
                  <Card
                    title={
                      <>
                        <span style={{ display: 'inline-block' }}>{item.groupName}</span>
                        <span style={{ display: 'inline-block', marginLeft: 30 }}>
                          <Tooltip placement="right" title={<span>{item.groupDescribe}</span>}>
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </span>
                      </>
                    }
                    style={{ width: '100%' }}
                  >
                    {item.params.map((it, index) => {
                      const newIndex = JSON.parse(JSON.stringify(index));
                      // this.getModelType(it, newIndex);
                      if (it.type === 'input')
                        return (
                          <InputModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'} // 禁用
                            submitStatus={submitStatus} // 是否提交
                            getData={this.getModelData} // 提交数据
                          />
                        );
                      // 数值输入框
                      if (it.type === 'number_input') {
                        return (
                          <InputNumberModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            submitStatus={submitStatus}
                            getData={this.getModelData}
                          />
                        );
                      }
                      // 单选
                      if (it.type === 'radio')
                        return (
                          <InputModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            submitStatus={submitStatus}
                            getData={this.getModelData}
                          />
                        );
                      // 多选
                      if (it.type === 'checkbox')
                        return (
                          <CheckBoxModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            submitStatus={submitStatus}
                            getData={this.getModelData}
                          />
                        );
                      // 样品选择框
                      if (it.type === 'sample_select')
                        return (
                          <SampleSelectModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            submitStatus={submitStatus}
                            sampleList={sampleList} // 样品列表
                            getData={this.getModelData}
                            // 当样品选择改变的时候
                            emitData={this.getSelectUpdateData}
                            setSelectState={this.setSelectState}
                          />
                        );
                      // 样品分组方案
                      if (it.type === 'sample_group') {
                        return (
                          <SampleGroupModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            submitStatus={submitStatus}
                            sampleList={sampleList}
                            getData={this.getModelData}
                            // 样品列表改变执行事件
                            getFun={func => {
                              this.handleUpdateSampleGroup = func;
                            }}
                          />
                        );
                      }
                      // 样品环境因子
                      if (it.type === 'sample_environment_factor') {
                        return (
                          <EnvironmentalFactorsModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            submitStatus={submitStatus}
                            sampleList={sampleList}
                            getData={this.getModelData}
                            // 样品列表改变执行事件
                            getFun={func => {
                              this.handleUpdateEnvironmentFactor = func;
                            }}
                          />
                        );
                      }
                      return false;
                    })}
                  </Card>
                </List.Item>
              )}
            />

            <Footer className={style.footer}>
              <div className={style.button}>
                <Button className={style.back} onClick={() => this.goBackLink()}>
                  返回
                </Button>
                {/* <Button type="primary" htmlType="submit" onClick={() => this.saveParam()}> */}
                {requestType === 'view' ? (
                  ''
                ) : (
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  )}
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
