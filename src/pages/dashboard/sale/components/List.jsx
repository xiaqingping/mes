import { List, Badge } from 'antd';
import React from 'react';
import { connect } from 'dva';

// function addVal(arr, keyVal) {
//   const newfood = [];
//   const temp = [];
//   for (const i in arr) {
//     const key = arr[i][keyVal];
//     console.log(key)
//     if (temp[key]) {
//       temp[key][keyVal] = temp[key][keyVal];
//       temp[key].amount = temp[key].amount + arr[i].amount;
//     } else {
//       temp[key] = {};
//       temp[key][keyVal] = arr[i][keyVal];
//       temp[key].amount = arr[i].amount;
//     }
//     // temp[key].ItemType = arr[i].ItemType;
//   }
//   for (const k in temp) {
//     newfood.push(temp[k]);
//   }
//   return newfood.sort(compare('amount'));
// }

function addVal(arr, keyVal) {
  const temp = {};
  arr.forEach(item => {
    const key = item[keyVal];
    if (temp[key]) {
      temp[key][keyVal] = temp[key][keyVal];
      temp[key].amount += item.amount;
    } else {
      temp[key] = {};
      temp[key][keyVal] = item[keyVal];
      temp[key].amount = item.amount;
    }
  });
  // for (const k in temp) {
  //   if (temp[k]) {
  //     newfood.push(temp[k]);
  //   }
  // }
  const newfood = Object.values(temp);
  return newfood.sort(compare('amount'));
}

function compare(property) {
  // eslint-disable-next-line func-names
  return function(a, b) {
    const value1 = a[property];
    const value2 = b[property];
    return value2 - value1;
  };
}

class Lists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectType: '',
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  passData = selectType => {
    this.setState({
      selectType,
    });
  };

  listItem = (item, index) => {
    const { selectType } = this.state;
    return (
      <List.Item>
        <Badge
          count={index + 1}
          style={{
            backgroundColor: index + 1 <= 3 ? '#268EEC' : '#EFF0F2',
            color: index + 1 <= 3 ? 'white' : '#999',
            zIndex: 0,
          }}
        />
        <span style={{ fontSize: '16px' }}>
          <span
            style={{
              margin: '0 40px 0 20px',
            }}
          >
            {parseInt(selectType, 10) === 2 ? item.officeCode : item.regionCode}
          </span>
          {item.amount.toFixed(2)}
        </span>
      </List.Item>
    );
  };

  render() {
    const { chartData } = this.props;
    const { selectType } = this.state;
    return (
      <div
        style={
          document.body.clientWidth < 1600
            ? { width: '600px', height: '480px', overflow: 'hidden' }
            : {
                position: 'absolute',
                top: '20px',
                left: '1100px',
                width: '600px',
                height: '480px',
                overflow: 'hidden',
              }
        }
      >
        <h3 style={{ marginBottom: 16, fontWeight: 'bold' }}>
          {parseInt(selectType, 10) === 2 ? '网点' : '大区'}销售额排名
        </h3>
        <List
          split={false}
          dataSource={addVal(
            chartData,
            parseInt(selectType, 10) === 2 ? 'officeCode' : 'regionCode',
          )}
          renderItem={(item, index) => this.listItem(item, index)}
        />
      </div>
    );
  }
}
export default connect(({ dashboard }) => ({
  chartData: dashboard.chartData || [],
}))(Lists);
