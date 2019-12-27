import { List, Badge } from 'antd';
import React from 'react';
import { connect } from 'dva';

function addVal(arr, keyVal) {
  const newfood = [];
  const temp = {};
  for (const i in arr) {
    const key = arr[i][keyVal];
    if (temp[key]) {
      temp[key][keyVal] = temp[key][keyVal];
      temp[key].amount = temp[key].amount + arr[i].amount;
    } else {
      temp[key] = {};
      temp[key][keyVal] = arr[i][keyVal];
      temp[key].amount = arr[i].amount;
    }
    temp[key].ItemType = arr[i].ItemType;
  }
  for (const k in temp) {
    newfood.push(temp[k]);
  }
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

@connect(({ dashboard }) => ({
  chartData: dashboard.chartData,
}))
class Lists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  listItem = (item, index) => {
    const { selectType } = this.props;
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
            {parseInt(selectType, 10) === 1 ? item.regionCode : item.officeCode}
          </span>
          {item.amount}
        </span>
      </List.Item>
    );
  };

  render() {
    const { chartData, selectType } = this.props;
    return (
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '1300px',
          width: '600px',
          height: '480px',
          overflow: 'hidden',
        }}
      >
        <h3 style={{ marginBottom: 16, fontWeight: 'bold' }}>网点销售额排名</h3>
        <List
          split={false}
          dataSource={addVal(
            chartData,
            parseInt(selectType, 10) === 1 ? 'regionCode' : 'officeCode',
          )}
          renderItem={(item, index) => this.listItem(item, index)}
        />
      </div>
    );
  }
}
export default Lists;
