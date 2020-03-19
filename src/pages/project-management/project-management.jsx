import React, { Component } from 'react';

class ProjectManagement extends Component {
  state = {};

  render() {
    const key = 'a';
    const data = {
      [key]: 1,
      b: 2,
    };
    console.log(data.a);
    return <div>项目管理</div>;
  }
}

export default ProjectManagement;
