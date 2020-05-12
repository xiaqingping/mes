import React from 'react';

import { Form, Button, Spin } from 'antd';
import { connect } from 'dva';

import FactoryComponent from './formItems';
import '../index.less';

/**
 * 参数表单  任务模型参数新增修改升级查看时的每条参数的具体信息
 */
class ArgumentForm extends React.Component {
  constructor() {
    super();
    this.myRef = React.createRef();
  }

  state = {
    loading: false,
    viewForm: {}, // 当是查看的时候, 表单数据
  };

  componentDidMount() {
    const { editOriginData } = this.props;
    const otherProperties = editOriginData.paramPropertiesStr
      ? JSON.parse(editOriginData.paramPropertiesStr)
      : editOriginData.paramPropertiesMap;
    if (otherProperties) {
      if (otherProperties.isRequired === 'true') {
        otherProperties.isRequired = true;
      } else {
        otherProperties.isRequired = false;
      }
    }

    const viewForm = {
      paramKey: editOriginData.paramKey,
      paramName: editOriginData.paramName,
      myId: editOriginData.myId,
      ...otherProperties,
    };
    this.setState({
      viewForm,
    });

    this.myRef.current.setFieldsValue(viewForm);
  }

  /**
   * 数据提交
   * @param {Object} values 校验通过，form对象
   */
  onFinish = values => {
    // 校验通过， values就是form对象
    const data = JSON.parse(JSON.stringify(values));
    const argumentValues = {};
    argumentValues.paramKey = data.paramKey;
    argumentValues.paramName = data.paramName;
    delete data.paramName;
    delete data.paramKey;
    argumentValues.type = this.props.type;
    data.isRequired = data.isRequired ? 'true' : 'false';
    argumentValues.paramPropertiesStr = JSON.stringify(data);
    argumentValues.paramProperties = [];
    argumentValues.myId = this.props.editOriginData.myId
      ? this.props.editOriginData.myId
      : Date.now();
    this.props.emitArguments(argumentValues);
  };

  /**
   * 校验不通过
   */
  onFinishFailed = () => false;

  render() {
    const formItemLayout = null;
    const { loading, viewForm } = this.state;
    viewForm.isRequired = viewForm.isRequired ? '是' : '否';
    const { fromView, type } = this.props;
    return loading ? (
      <div style={{ textAlign: 'center', marginTop: 15 }}>
        <Spin />
      </div>
    ) : (
      <div>
        <Form
          {...formItemLayout}
          layout="vertical"
          ref={this.myRef}
          onFinishFailed={this.onFinishFailed}
          onFinish={this.onFinish}
          hideRequiredMark="true"
        >
          <FactoryComponent fromView={fromView} viewForm={viewForm} type={type} />
          <div style={{ width: '100%' }}>
            <div className="task_model_argu_form_submit">
              <Form.Item>
                {!fromView && (
                  <Button type="primary" htmlType="submit">
                    确认
                  </Button>
                )}
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(({ taskModel }) => ({
  taskModel,
}))(ArgumentForm);
