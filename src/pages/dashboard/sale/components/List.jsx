import { List, Badge } from 'antd';
import React from 'react';

class Lists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.setState({
      data: [
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
        { name: '某某网点', value: '10000' },
      ],
    })
  }


  listItem = (item, index) => (
      <List.Item>
        <Badge
          count={index + 1}
          style={{
            backgroundColor: (index + 1) <= 3 ? '#268EEC' : '#EFF0F2',
            color: (index + 1) <= 3 ? 'white' : '#999',
            zIndex: 0,
          }}
        />
        <span style={{ fontSize: '16px' }}>
          <span style={{
            margin: '0 40px 0 20px',
          }}>{item.name}</span>
          {item.value}
        </span>
      </List.Item>
    )

  render() {
    const { data } = this.state;
    return (
      <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '900px',
        width: '600px',
        height: '480px',
        overflow: 'hidden',
        }}
        >
        <h3 style={{ marginBottom: 16, fontWeight: 'bold' }}>网点销售额排名</h3>
        <List
          split={false}
          dataSource={data}
          renderItem={(item, index) => (this.listItem(item, index))}
        />
      </div>
    )
  }
}
export default Lists;
