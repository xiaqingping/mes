import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import g2plot from '@antv/g2plot';

// const data = [
//   { year: '1991', value: 3 },
//   { year: '1992', value: 4 },
//   { year: '1993', value: 3.5 },
//   { year: '1994', value: 5 },
//   { year: '1995', value: 4.9 },
//   { year: '1996', value: 6 },
//   { year: '1997', value: 7 },
//   { year: '1998', value: 9 },
//   { year: '1999', value: 13 },
// ];

// const linePlot = new Line('canvas', {
//   data,
//   xField: 'year',
//   yField: 'value',
// });

// linePlot.render();

class Sale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <PageHeaderWrapper>
        <div id="canvas"></div>
      </PageHeaderWrapper>
    );
  }
}
export default Sale;
