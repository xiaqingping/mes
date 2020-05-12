import React from 'react';

import InputItems from './inputItems';
import BaseFormItems from './baseFormItems';
import NumericalInput from './numericalInput';
import CheckedAndRadio from './checkAndRadio';

/**
 * 任务模型参数配置的工厂组件 统一判断需要展示的组件
 */
class FactoryComponent extends React.Component {
  state = {};

  render() {
    // 样品, 分组, 环境因子组件
    const compGroup = ['sample_select', 'sample_group', 'sample_environment_factor'];
    const checkGroup = ['checkbox', 'radio']; // 单选, 多选的组件
    const { fromView, viewForm, type } = this.props;
    console.log(fromView, viewForm, type);
    if (checkGroup.includes(type) && viewForm.paramKey) {
      this.updateData(viewForm);
    }
    return (
      <>
        {type === 'input' && <InputItems fromView={fromView} viewForm={viewForm} />}
        {compGroup.includes(type) && <BaseFormItems fromView={fromView} viewForm={viewForm} />}
        {type === 'number_input' && <NumericalInput fromView={fromView} viewForm={viewForm} />}
        {checkGroup.includes(type) && (
          <CheckedAndRadio
            fromView={fromView}
            viewForm={viewForm}
            getFun={fun => {
              this.updateData = fun;
            }}
          />
        )}
      </>
    );
  }
}

export default FactoryComponent;
