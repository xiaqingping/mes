const seq = require('./seq');
const personel = require('./personel');
const bp = require('./bp');
const peptide = require('./peptide');
const system = require('./system');
const purchase = require('./purchase');
const hts = require('./hts');
const dashboard = require('./dashboard');
const operation = require('./operation');

module.exports = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/seq',
          },
          dashboard,
          seq,
          bp,
          operation,
          peptide,
          // system,
          // personel,
          // purchase,
          hts,
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
