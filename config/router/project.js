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
      name: 'task-manage',
      path: '/project/task-manage',
      component: './project/task-manage',
    },
    {
      name: 'project-model',
      path: '/project/project-model',
      component: './project/project-model',
    },
    {
      name: 'task-model',
      path: '/project/task-model',
      component: './project/task-model',
    },
    {
      name: 'project-model-type',
      path: '/project/project-model-type',
      component: './project/project-model-type',
    },
    {
      name: 'task-model-type',
      path: '/project/task-model-type',
      component: './project/task-model-type',
    },
  ],
};
