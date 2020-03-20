import React, { Component } from 'react';
import { InputNumber, List, Card, Avatar, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MarkTool } from '../components/AntdUI';
import UploadUI from '../components/Upload';

const data = [
  {
    title: '',
  },
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 5',
  },
  {
    title: 'Title 6',
  },
];
const { Meta } = Card;

class ProjectManagement extends Component {
  state = {};

  renderItemList = item => (
    <List.Item>
      {item.title ? (
        <Card hoverable style={{ width: '300px', height: '200px ' }}>
          <Meta
            avatar={
              <Avatar
                size={50}
                src="http://img3.imgtn.bdimg.com/it/u=2902356358,688599845&fm=11&gp=0.jpg"
              />
            }
            title={
              <>
                <div>123</div>
                <Tag color="success">success</Tag>
              </>
            }
          />
          <br />
          <div>
            防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法
          </div>
        </Card>
      ) : (
        <Card
          hoverable
          onClick={() => {
            console.log(123);
          }}
          style={{
            width: '300px',
            height: '200px ',
            borderImage: 'border-image-source slice-width{1,4}',
            border: '1px dashed #E1E1E1',
            textAlign: 'center',
            lineHeight: '150px',
            fontSize: '18px',
          }}
        >
          <PlusOutlined />
          &nbsp;&nbsp;自定义
        </Card>
      )}
    </List.Item>
  );

  render() {
    return (
      <div style={{ width: '1000px' }}>
        <InputNumber min={0} max={15} defaultValue={3} />
        <UploadUI />
        <MarkTool title="测试问号作用" size="20px" />
        <List
          grid={{
            xl: 3,
            lg: 2,
            sm: 1,
          }}
          dataSource={data}
          renderItem={item => this.renderItemList(item)}
        />
      </div>
    );
  }
}

export default ProjectManagement;
