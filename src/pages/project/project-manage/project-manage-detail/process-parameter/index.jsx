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
import EnvironmentalFactorsModel from '@/pages/project/components/ModelComponents/EnvironmentalFactorsModel';
import SampleGroupModel from '@/pages/project/components/ModelComponents/SampleGroupModel/index';
import SampleSelectModel from '@/pages/project/components/ModelComponents/SampleSelectModel/index';
import CheckBoxModel from '@/pages/project/components/ModelComponents/CheckBoxModel';
import InputModel from '@/pages/project/components/ModelComponents/InputModel/index';
import InputNumberModel from '@/pages/project/components/ModelComponents/InputNumberModel';
import RadioModel from '@/pages/project/components/ModelComponents/RadioModel';

/** 样式 */
import style from './index.less';

const { Footer } = Layout;

function compare(property) {
  // eslint-disable-next-line func-names
  return function(a, b) {
    const value1 = a[property];
    const value2 = b[property];
    return value1 - value2;
  };
}

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
      paramGroupList: [], // 参数列表
      // 流程模型参数
      processParam: [],
      // 流程参数值
      processParamValue: [],
      // 样品选择框 样品列表
      sampleList: [],
      // 提交的数据
      paramList: [],
    }
    // 判断请求类型
    this.determineTheRequestType();
  }

  // 组件加载时
  componentDidMount = () => {};

  // 判断请求类型
  determineTheRequestType = () => {
    const { requestType, processId, processModelId } = this.state;
    message.success(requestType);

    // 创建项目 添加参数值 / 未保存时修改参数值
    if (requestType === 'add' || requestType === 'update') {
      this.getProcessParam(processModelId); // 查询流程参数
    }

    // 流程参数 修改参数值 / 查看参数
    if (requestType === 'edit' || requestType === 'view') {
      this.getProcessParam(processModelId); // 查询流程参数
      this.getProcessParamValue(processId); // 查询流程参数值
    }
    return false;
  };

  /**
   * 获取数据 执行不同的处理
   * @param {Array} param  流程模型参数
   * @param {Array} paramValue 流程参数值
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
          this.getDefaultParams(newParamData);
          console.log(newParamData);
          const newData = this.compareParams(newParamData, 'sortNo');
          this.setState({ paramGroupList: newData });
        }
      }

      // 修改 未保存的参数值
      if (requestType === 'update') {
        message.success('修改操作');
        // update参数值
        const processParamList = sessionStorage.getItem('processForParams');
        const processParamValue = processParamList.params;

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
          const newData = this.compareParams(data, 'sortNo');

          this.setState({ paramGroupList: newData });
          return false;
        }

        // 未设置参数值时
        if (param.length > 0 && paramValue.length === 0) {
          this.getDefaultParams(newParamData);
          const newData = this.compareParams(newParamData, 'sortNo');
          this.setState({ paramGroupList: newData });
        }
      }

      // 编辑 参数值
      if (requestType === 'edit' || requestType === 'view') {
        message.success('编辑操作');

        // 有参数值时
        if (newParamData.length > 0 && paramValue.length > 0) {
          // 合并参数和参数值
          const data = this.comparedWith(newParamData, paramValue);
          this.getDefaultParams(data);
          const newData = this.compareParams(data, 'sortNo');
          this.setState({ paramGroupList: newData });
          return false;
        }
        // 未设置参数值时
        if (param.length > 0 && paramValue.length === 0) {
          this.getDefaultParams(newParamData);
          const newData = this.compareParams(newParamData, 'sortNo');
          this.setState({ paramGroupList: newData });
        }
      }
    }
    return false;
  };

  /**
   * 参数排序
   * @param {Array} paramGroupList 参数分组数据
   * @param {String} field 排序字段
   */
  compareParams = (paramGroupData, field) => {
    const newData = [];
    paramGroupData.forEach(groItem => {
      const newGroupItem = JSON.parse(JSON.stringify(groItem));
      const { params } = groItem;
      const newParams = params.sort(compare([field]));
      newGroupItem.params = newParams;
      newData.push(newGroupItem);
    });
    return newData;
  };

  /**
   * 获取初始参数列表 提交时作为默认数据
   * @param {Array} paramGroupList 参数分组数据
   */
  getDefaultParams = paramGroupList => {
    let paramList = [];
    let sampleList = [];
    paramGroupList.forEach(groItem => {
      const { params } = groItem;
      paramList = [...paramList, ...params];
      groItem.params.forEach(item => {
        if (item.type === 'sample_select') {
          if (item.paramValue) {
            sampleList = [...sampleList, JSON.parse(item.paramValue)];
          }
          // this.setState({ sampleList: JSON.parse(item.paramValue) });
        }
      });
    });
    this.setState({ paramList, sampleList });
  };

  // edit 设置表单初始值
  /**
   * 编辑状态 设置表单初始值
   * @param {string} data 组件数据
   */
  setInitialFromValues = data => {
    data.forEach(item => {
      const { paramKey } = item;
      if (this.formRef.current) {
        this.formRef.current.setFieldsValue({
          [paramKey]: item.paramValue || item.deafultValue,
        });
      }
    });
  };

  /** 保存提交 */
  onSubmit = () => {
    const { paramList } = this.state;
    const { requestType, processId, processModelId, projectId } = this.state;
    let url;

    // 添加 修改
    if (requestType === 'add' || requestType === 'update') {
      const processParams = JSON.parse(sessionStorage.getItem('processForParams'));
      const newData = { params: paramList, processModelId };
      const list = [];
      if (processParams) {
        list.push([...processParams, newData]);
      } else {
        list.push(newData);
      }

      sessionStorage.setItem('processForParams', JSON.stringify(list));

      if (projectId === '' || projectId === undefined)
        url = `/project/project-manage/add/addflowpath/add/''/1`;
      if (projectId) url = `/project/project-manage/detail/edit/${projectId}/2`;
      return router.push(url);
    }
    // 编辑
    if (requestType === 'edit') {
      api.updateProcessesParameter(processId, paramList).then(() => {
        if (projectId === '') url = `/project/project-manage`;
        if (projectId !== '') url = `/project/project-manage/detail/${projectId}`;
        return router.push(url);
      });
    }
    return false;
  };

  /**
   * 组件返回数据
   * @param {string} data 组件数据
   * @param {string} type 组件类型
   * @param {boolean} isVerify 数据是否通过验证
   */
  getModelData = (data, type, isVerify) => {
    const { paramList } = this.state;
    if (isVerify) {
      const newParams = paramList.filter(item => item.paramKey !== data.paramKey);
      paramList.forEach(item => {
        if (item.paramKey === data.paramKey) {
          const newItem = JSON.parse(JSON.stringify(item));
          newItem.paramValue = data.paramValue;
          newParams.push(newItem);
        }
        return false;
      });

      this.setState({
        paramList: newParams,
      });
      return false;
    }
    return message.warning('数据验证未通过');
  };

  /**
   * 删除参数为空的分组
   * @param {Array} data 流程参数
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
   * @param {Array} data 流程参数
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
        // TODO:
        nParamItem.sortNo = Number(paramItem.sortNo.split('')[0]);

        // 删除 参数属性列表 字段（可不删）
        delete nParamItem.paramProperties;

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
   * @param {Array} paramGroupData 参数分组数据
   * @param {Array} valueData 参数值
   */
  comparedWith = (paramGroupData, valueData) => {
    const list = [];
    paramGroupData.forEach(groupItem => {
      // 保存分组数据
      const groupData = JSON.parse(JSON.stringify(groupItem));
      groupData.params = [];

      const paramList = groupItem.params;
      const newList = [];
      const ids = [];
      paramList.forEach(paramItem => {
        valueData.forEach(valueItem => {
          const newItem = JSON.parse(JSON.stringify(paramItem));
          if (paramItem.paramKey === valueItem.paramKey) {
            if (newList.length === 0) {
              newItem.paramValue = valueItem.paramValue;
              newList.push(newItem);
            } else {
              newList.forEach(listItem => ids.push(listItem.id));
              if (ids.indexOf(paramItem.id) === -1) {
                newItem.paramValue = valueItem.paramValue;
                newList.push(newItem);
              }
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
   * @param {Array} processModelId 流程模型ID
   */
  getProcessParam = processModelId => {
    api.getProcessParam(processModelId).then(res => {
      if (res.length === 0) {
        message.error('未查询到参数！');
        return false;
      }
      this.setState({ processParam: res }, () => {
        this.getParamData(this.state.processParam, this.state.processParamValue);
      })
      return false;
    });
  };

  /**
   * 获取流程参数值
   * @param {Array} processModelId 流程ID
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

  /**
   * 获取样品选择框的实时数据
   * @param {Array} updateData 样品列表数据
   */
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

  /** 返回 */
  goBackLink = () => {
    const { requestType, projectId } = this.state;
    let url;
    if (requestType === 'add' || requestType === 'update') {
      if (projectId) url = `/project/project-manage/detail/edit/${projectId}/2`;
      if (projectId === '' || projectId === undefined)
        url = `/project/project-manage/add/addflowpath/add/''/1`;
    } else {
      if (projectId === '') url = `/project/project-manage`;
      if (projectId !== '') url = `/project/project-manage/detail/${projectId}`;
    }

    return router.push(url);
  };

  render() {
    const { paramGroupList, sampleList, requestType } = this.state;
    const data = paramGroupList;
    if (data.length === 0) return false;
    return (
      <>
        <PageHeaderWrapper style={{ marginBottom: 100 }}>
          <Form name="basic" ref={this.formRef}>
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
                            getData={this.getModelData} // 提交数据
                          />
                        );
                      // // 数值输入框
                      if (it.type === 'number_input') {
                        return (
                          <InputNumberModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            getData={this.getModelData}
                          />
                        );
                      }
                      // 单选
                      if (it.type === 'radio')
                        return (
                          <RadioModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
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
                            getData={this.getModelData}
                          />
                        );
                      // 样品选择框
                      if (it.type === 'sample_select') {
                        return (
                          <SampleSelectModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
                            sampleList={sampleList} // 样品列表
                            getData={this.getModelData}
                            // 当样品选择改变的时候
                            emitData={this.getSelectUpdateData}
                            setSelectState={this.setSelectState}
                          />
                        );
                      }
                      // 样品分组方案
                      if (it.type === 'sample_group') {
                        return (
                          <SampleGroupModel
                            paramList={it}
                            key={newIndex}
                            disabled={requestType === 'view'}
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
                {requestType === 'view' ? (
                  ''
                ) : (
                  <Button type="primary" onClick={this.onSubmit}>
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
