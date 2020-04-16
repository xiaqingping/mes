import React from 'react';

import { Form, Button, Spin } from 'antd';
import { connect } from 'dva';
import InputItems from './formItems/inputItems';
import BaseFormItems from './formItems/baseFormItems';
import NumericalInput from './formItems/numericalInput';
import '../index.less';

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
    console.log(editOriginData);
    const otherProperties = editOriginData.paramPropertiesStr
      ? JSON.parse(editOriginData.paramPropertiesStr)
      : editOriginData.paramPropertiesMap;
    if (otherProperties) {
      if (otherProperties.isrequired === 'true') {
        otherProperties.isrequired = true;
      } else {
        otherProperties.isrequired = false;
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

  onFinish = values => {
    // 校验通过， values就是form对象
    const data = JSON.parse(JSON.stringify(values));
    const argumentValues = {};
    argumentValues.paramKey = data.paramKey;
    argumentValues.paramName = data.paramName;
    delete data.paramName;
    delete data.paramKey;
    argumentValues.type = this.props.type;
    data.isrequired = data.isrequired ? 'true' : 'false';
    argumentValues.paramPropertiesStr = JSON.stringify(data);
    argumentValues.paramProperties = [];
    argumentValues.myId = this.props.editOriginData.myId
      ? this.props.editOriginData.myId
      : Date.now();
    console.log(argumentValues);

    this.props.emitArguments(argumentValues);
    // this.props.onClose();
  };

  onFinishFailed = () => {
    // 校验不通过
    return false;
  };

  render() {
    const formItemLayout = null;
    const { loading, viewForm } = this.state;
    console.log(viewForm);
    viewForm.isrequired = viewForm.isrequired ? '是' : '否';
    const { fromView, type } = this.props;
    console.log(type);

    const compGroup = ['sample_select', 'sample_group', 'sample_environment_factor'];
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
        >
          {type === 'input' && <InputItems fromView={fromView} viewForm={viewForm} />}
          {compGroup.includes(type) && <BaseFormItems fromView={fromView} viewForm={viewForm} />}
          {type === 'number_input' && <NumericalInput fromView={fromView} viewForm={viewForm} />}

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
