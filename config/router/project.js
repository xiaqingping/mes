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
      hideChildrenInMenu: true,
      routes: [
        {
          path: '/project/process-model',
          component: './project/process-model',
        },
        {
          name: 'add',
          path: '/project/process-model/add',
          component: './project/process-model/process-model-edit',
        },
        {
          name: 'edit',
          path: '/project/process-model/edit/:id',
          component: './project/process-model/process-model-edit',
        },
      ],
    },
    {
      name: 'task-model',
      path: '/project/task-model',
      component: './project/task-model',
    },
  ],
};
