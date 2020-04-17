import React from 'react';

import InputItems from './inputItems';
import BaseFormItems from './baseFormItems';
import NumericalInput from './numericalInput';

class FactoryComponent extends React.Component {
  state = {};

  render() {
    const compGroup = ['sample_select', 'sample_group', 'sample_environment_factor'];
    const { fromView, viewForm, type } = this.props;
    return (
      <>
        {type === 'input' && <InputItems fromView={fromView} viewForm={viewForm} />}
        {compGroup.includes(type) && <BaseFormItems fromView={fromView} viewForm={viewForm} />}
        {type === 'number_input' && <NumericalInput fromView={fromView} viewForm={viewForm} />}
      </>
    );
  }
}

export default FactoryComponent;
