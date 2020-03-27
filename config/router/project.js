// 项目管理
module.exports = {
  path: '/project',
  name: 'project',
  icon: 'user',
  routes: [
    {
      name: 'project-manage',
      path: '/project/project-manage',
      component: './project/project-manage',
    },
    {
      name: 'process-model',
      path: '/project/process-model',
      component: './project/process-model',
    },
    {
      name: 'task-model',
      path: '/project/task-model',
      component: './project/task-model',
    },
  ],
};
