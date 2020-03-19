// 项目管理
module.exports = {
  path: '/project',
  name: 'project',
  icon: 'user',
  routes: [
    {
      name: 'project-management',
      path: '/project/project-management',
      component: './project-management/project-management',
    },
    {
      name: 'task-management',
      path: '/project/task-management',
      component: './project-management/task-management',
    },
    {
      name: 'project-model',
      path: '/project/project-model',
      component: './project-management/project-model',
    },
    {
      name: 'task-model',
      path: '/project/task-model',
      component: './project-management/task-model',
    },
    {
      name: 'project-model-type',
      path: '/project/project-model-type',
      component: './project-management/project-model-type',
    },
    {
      name: 'task-model-type',
      path: '/project/task-model-type',
      component: './project-management/task-model-type',
    },
  ],
};
