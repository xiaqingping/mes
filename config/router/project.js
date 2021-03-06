// 项目管理
module.exports = {
  path: '/project',
  name: 'project',
  icon: 'user',
  routes: [
    {
      name: 'project-manage',
      path: '/project/project-manage',
      hideChildrenInMenu: true,
      routes: [
        {
          path: '/project/project-manage',
          component: './project/project-manage',
        },
        {
          name: 'detail',
          path: '/project/project-manage/detail/:id',
          component: './project/project-manage/project-manage-detail',
        },
        {
          name: 'detail-add',
          path: '/project/project-manage/detailAdd/:id',
          // path: '/project/project-manage/detailAdd/:type?/:projectId?/:paramsType',
          component: './project/project-manage/project-manage-edit/addflowpath',
        },
        {
          name: 'process-parameter',
          // path:
          //   '/project/project-manage/process-parameter/:type?/:processModelId?/:projectId?/:processId',

          path: '/project/project-manage/process-parameter/:id',

          component: './project/project-manage/project-manage-detail/process-parameter',
        },
        {
          name: 'add',
          path: '/project/project-manage/add',
          component: './project/project-manage/project-manage-edit',
        },
        {
          name: 'addflowpath',
          path: '/project/project-manage/add/addflowpath/:id',
          component: './project/project-manage/project-manage-edit/addflowpath',
        },
        {
          name: 'edit',
          path: '/project/project-manage/edit/:id',
          component: './project/project-manage/project-manage-edit',
        },
      ],
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
        {
          name: 'up',
          path: '/project/process-model/up/:id',
          component: './project/process-model/process-model-edit',
        },
      ],
    },
    {
      name: 'task-model',
      path: '/project/task-model',
      hideChildrenInMenu: true,
      routes: [
        {
          path: '/project/task-model',
          component: './project/task-model',
        },
        {
          name: 'add',
          path: '/project/task-model/add',
          component: './project/task-model/addTaskModel.jsx',
        },
        {
          name: 'edit',
          path: '/project/task-model/edit/:id',
          component: './project/task-model/addTaskModel.jsx',
        },
        {
          name: 'up',
          path: '/project/task-model/up/:id',
          component: './project/task-model/addTaskModel.jsx',
        },
        // {
        //   name: 'group',
        //   path: '/project/task-model/group',
        //   component: './project/components/index.jsx',
        // },
      ],
    },
  ],
};
