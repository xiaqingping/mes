const seq = require('./seq');
const personel = require('./personel');
const bp = require('./bp');
const peptide = require('./peptide');
const system = require('./system');
const purchase = require('./purchase');
const hts = require('./hts');
const dashboard = require('./dashboard');
const operation = require('./operation');
const project = require('./project');
const sample = require('./sample');

const { DEFAULT_ROUTE } = process.env;

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
            redirect: DEFAULT_ROUTE || '/bp/maintain',
          },
          dashboard,
          seq,
          bp,
          operation,
          peptide,
          project,
          system,
          sample,
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
