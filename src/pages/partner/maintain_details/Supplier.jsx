import React from 'react';
import BasicInfo from './components/BasicInfo';
import Type from './components/Type1';
import Bank from './components/Bank';
import Authentication from './components/Authentication';

class Supplier extends React.Component {
  state = {

  };

  render() {
    return (
      <>
        <BasicInfo></BasicInfo>
        <Type></Type>
        <Bank></Bank>
        <Authentication></Authentication>
      </>
    );
  }
}

export default Supplier;
