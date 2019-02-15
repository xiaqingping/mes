import React, { PureComponent } from 'react';

class Order extends PureComponent {
  state = {
    title: 'seq Order',
  };

  render() {
    const { title } = this.state;
    return <div>{title}</div>;
  }
}

export default Order;
