import React, { Component } from 'react';
import { InputNumber, List } from 'antd';
import { MarkTool } from '../components/AntdUI';
import UploadUI from '../components/Upload';
import { renderItemList } from '../functions';

const data = [
  {
    title: '',
  },
  {
    src: 'http://img3.imgtn.bdimg.com/it/u=2902356358,688599845&fm=11&gp=0.jpg',
    title: 'test',
    content:
      '防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法',
  },
  {
    src: 'http://img3.imgtn.bdimg.com/it/u=2902356358,688599845&fm=11&gp=0.jpg',
    title: 'test',
    content:
      '防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法',
  },
  {
    src: 'http://img3.imgtn.bdimg.com/it/u=2902356358,688599845&fm=11&gp=0.jpg',
    title: 'test',
    content:
      '防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法',
  },
  {
    src: 'http://img3.imgtn.bdimg.com/it/u=2902356358,688599845&fm=11&gp=0.jpg',
    title: 'test',
    content:
      '防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法',
  },
  {
    src: 'http://img3.imgtn.bdimg.com/it/u=2902356358,688599845&fm=11&gp=0.jpg',
    title: 'test',
    content:
      '防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法发送到防辐射的富士达防守打法发斯蒂芬是的撒旦法',
  },
];

class ProjectManagement extends Component {
  state = {};

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
          renderItem={item => renderItemList(item)}
        />
      </div>
    );
  }
}

export default ProjectManagement;
