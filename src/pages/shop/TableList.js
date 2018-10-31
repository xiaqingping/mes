import React, { PureComponent } from 'react';

export default class Shop extends PureComponent {
  state = {
    data: '123',
  };

  render() {
    const { data } = this.state;
    return <div>{data}</div>;
  }
}
