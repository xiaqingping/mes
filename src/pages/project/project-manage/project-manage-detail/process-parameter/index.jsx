// 流程参数
import React, { Component } from 'react';
import { Card, List, Form, Layout, Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import InputModel from '@/pages/project/components/ModelComponents/InputModel';
import api from '@/pages/project/api/projectManageDetail';
// import EnvironmentalFactorsModel from
//   '@/pages/project/components/ModelComponents/EnvironmentalFactorsModel/index';
import style from './index.less';

const { Footer } = Layout;

class ProcessParameter extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    const data = id.split(',');
    console.log(data);
    this.state = {
      // 参数页面前置数据
      requestType: data[2] || '',     // 请求类型
      processId: data[0] || '',       // 流程ID
      processModelId: data[1] || '',  // 流程模型ID
      projectId: data[3] || '',       // 项目ID
      paramList: [],                  // 参数列表
      processParam: [],               // 流程模型参数
      processParamValue: [],          // 流程参数值
      // submitStatus: false,            // 是否提交
      // // 样品选择框 样品列表
      // sampleList: [
      //   {
      //     colour: 'purple',
      //     id: '1234567',
      //     sampleAlias: '别名004',
      //     sampleCode: '1234567',
      //     sampleLengthAve: 600,
      //     sampleLengthMax: 4000,
      //     sampleLengthMin: 1000,
      //     sampleLengthTotal: 9000,
      //     sampleName: '未分组样品',
      //     sampleSequenceCount: 15,
      //     sequenceFileCount: 2,
      //   },
      //   {
      //     colour: 'red',
      //     id: '12345',
      //     sampleAlias: '别名002',
      //     sampleCode: '456',
      //     sampleLengthAve: 600,
      //     sampleLengthMax: 4000,
      //     sampleLengthMin: 1000,
      //     sampleLengthTotal: 9000,
      //     sampleName: '样品B',
      //     sampleSequenceCount: 15,
      //     sequenceFileCount: 2,
      //   },
      //   {
      //     colour: 'blue',
      //     id: '1234',
      //     sampleAlias: '别名001',
      //     sampleCode: '456',
      //     sampleLengthAve: 600,
      //     sampleLengthMax: 4000,
      //     sampleLengthMin: 1000,
      //     sampleLengthTotal: 9000,
      //     sampleName: '样品A',
      //     sampleSequenceCount: 15,
      //     sequenceFileCount: 2,
      //   },
      //   {
      //     colour: 'gray',
      //     id: '123456',
      //     sampleAlias: '别名003',
      //     sampleCode: '456',
      //     sampleLengthAve: 600,
      //     sampleLengthMax: 4000,
      //     sampleLengthMin: 1000,
      //     sampleLengthTotal: 9000,
      //     sampleName: '样品C',
      //     sampleSequenceCount: 15,
      //     sequenceFileCount: 2,
      //   },
      // ],
      // // 环境因子参数
      // paramData: {
      //   id: "8dc20f4338484a348b0ddd94bf3516bc",
      //   projectId: "cdf36f8403e644249fa4f6788456134c",
      //   processId: "1831fd04c1cd450f9aefc3d77f3725c2",
      //   processModelId: "85a9c0452b1e47ca909a30c753d5d820",
      //   taskId: "10b85cce64034418b66642f3f19f76b9",
      //   taskModelId: "f04bf8a80c6b4a7097f2c15b817df820",
      //   paramKey: "environmentalFactor",
      //   // eslint-disable-next-line max-len
      // eslint-disable-next-line max-len
      //   paramValue: "{\"environmentFactorList\":[{\"environmentFactorName\": \"环境因子一\",\"environmentFactorValueList\" :[{\"environmentFactorValue\": \"10\",\"sampleList\": [{\"sampleId\" : \"1234\",\"sampleAlias\": \"别名001\"},{\"sampleId\" : \"123456\",\"sampleAlias\": \"别名003\"}]},{\"environmentFactorValue\": \"15\",\"sampleList\": [{\"sampleId\" : \"1234567\",\"sampleAlias\": \"别名004\"},{\"sampleId\" : \"12345\",\"sampleAlias\": \"别名002\"}]}]},{\"environmentFactorName\": \"环境因子二\",\"environmentFactorValueList\" :[{\"environmentFactorValue\": \"8\",\"sampleList\": [{\"sampleId\" : \"1234\",\"sampleAlias\": \"别名001\"},{\"sampleId\" : \"12345\",\"sampleAlias\": \"别名002\"},{\"sampleId\" : \"123456\",\"sampleAlias\": \"别名003\"},{\"sampleId\" : \"1234567\",\"sampleAlias\": \"别名004\"}]}]},{\"environmentFactorName\": \"环境因子三\",\"environmentFactorValueList\" :[{\"environmentFactorValue\": \"9\",\"sampleList\": [{\"sampleId\" : \"1234\",\"sampleAlias\": \"别名001\"}]},{\"environmentFactorValue\": \"12\",\"sampleList\": [{\"sampleId\" : \"12345\",\"sampleAlias\": \"别名002\"},{\"sampleId\" : \"123456\",\"sampleAlias\": \"别名003\"},{\"sampleId\" : \"1234567\",\"sampleAlias\": \"别名004\"}]}]}]}"
      // },
    };
    // 判断请求类型
    this.determineTheRequestType();
  }

  // 组件加载时
  componentDidMount = () => {};

  // 是否提交
  // setSubmit = () => {
  //   this.setState({ submitStatus: true });
  // }

  // 判断请求类型
  determineTheRequestType = () => {
    const { requestType, processId, processModelId } = this.state;
    // 创建项目 添加参数值
    if (requestType === 'add') {
      message.success('add');
      this.getProcessParam(processModelId); // 查询流程参数
    }
    // 流程参数 修改参数值
    if (requestType === 'edit') {
      message.success('edit');
      this.getProcessParam(processModelId); // 查询流程参数
      this.getProcessParamValue(processId); // 查询流程参数值
    }
    // 创建项目 未保存时修改参数值
    if (requestType === 'update') {
      message.success('update');
      this.getProcessParam(processModelId); // 查询流程参数
    }
    return false;
  };

  // 获取参数 参数值
  getParamData = (param, paramValue) => {
    const { requestType  } = this.state;


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
        const { params } = paramList;

        const processParamValue = params;
        // 有参数值时
        if (newParamData.length > 0 && processParamValue.length > 0) {
          // 合并参数和参数值
          const data = this.comparedWith(newParamData, processParamValue);
          this.setState({ paramList: data });
          return false;
        }
        // 未设置参数值时
        if (param.length > 0 && paramValue.length === 0) {
          this.setState({ paramList: newParamData });
        }
      }

      // 编辑 参数值
      if (requestType === 'edit') {
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

  // 保存
  getFromData = values => {
    const data = this.conversionData(values);
    const { requestType, processId, processModelId } = this.state;


    // 添加 修改
    if (requestType === 'add' || requestType === 'updateParam') {
      const paramsList = sessionStorage.getItem('processForParams');
      const arr = [...paramsList.params, ...data];
      const newData = [];
      newData.params = arr;
      newData.processModelId = processModelId;

      sessionStorage.setItem("processForParams", newData);
      return router.push('/project/project-manage/add/addflowpath');
    }

    // 修改
    // if (requestType === 'updateParam') {}

    // 编辑
    if (requestType === 'edit') {
      const { projectId } = this.state;
      api.updateProcessesParameter(processId, data).then(() => {
        if (projectId === '') return router.push(`/project/project-manage`);
        router.push(`/project/project-manage/detail/${projectId}`);
        return false;
      });
    }
    return false;
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
    if (requestType === 'add' || requestType === 'update') {
      return router.push('/project/project-manage/add/addflowpath');
    }
    if (projectId === '') return router.push(`/project/project-manage`);
    return router.push(`/project/project-manage/detail/${projectId}`);
  }

  render() {
    const {
      paramList,
      // sampleList,
      // paramData,
      // submitStatus,
    } = this.state;
    const data = paramList;

    return (
      <>
        <PageHeaderWrapper>
          <Form
            name="basic"
            ref={this.formRef}
            onFinish={this.getFromData}
            onFinishFailed={this.onFinishFailed}
          >
            <List
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <Card title={item.groupName} style={{ width: '100%' }}>
                    {item.params.map((it, index) => {
                      const newIndex = JSON.parse(JSON.stringify(index));

                      if (it.type === 'txtShuRuKuang')
                        return <InputModel data={it} key={newIndex} />;
                      if (it.type === 'input') return <InputModel data={it} key={newIndex} />;
                      return false;
                    })}
                  </Card>
                </List.Item>
              )}
            />
            {/* 环境因子 */}
            {/* <EnvironmentalFactorsModel
              sampleList={sampleList}
              paramList={paramData}
              submitStatus={submitStatus}
            /> */}

            <Footer className={style.footer}>
              <div className={style.button}>
                {/* <Button type="primary" onClick={() => this.setSubmit()}>
                  组件提交
                </Button> */}
                <Button
                  className={style.back}
                  onClick={() => this.goBackLink()}
                >
                  返回
                </Button>
                {/* <Button type="primary" htmlType="submit" onClick={() => this.saveParam()}> */}
                <Button type="primary" htmlType="submit">
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
