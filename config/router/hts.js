// 高通量测序
module.exports = {
  path: '/hts',
  name: 'hts',
  icon: 'smile',
  routes: [
    {
      name: 'analyze',
      path: '/hts/analyze',
      routes: [
        {
          name: 'metadata',
          path: '/hts/analyze/metadata',
          hideChildrenInMenu: true,
          routes: [{
              path: '/hts/analyze/metadata',
              component: './hts/pages/analyze/metadata',
            },
            {
              name: 'metadata-paramList',
              path: '/hts/analyze/metadata/paramList',
              component: './hts/pages/analyze/metadata/paramList',
            },
          ],
        },
        {
          name: 'otu',
          path: '/hts/analyze/otu',
          component: './hts/pages/analyze/otu',
        },
        {
          name: 'alpha-diversity',
          path: '/hts/analyze/alpha-diversity',
          component: './hts/pages/analyze/alpha-diversity',
        },
        {
          name: 'beta-diversity',
          path: '/hts/analyze/beta-diversity',
          routes: [
            {
              name: 'sample-level-clustering',
              path: '/hts/analyze/beta-diversity/sample-level-clustering',
              component: './hts/pages/analyze/beta-diversity/sample-level-clustering',
            },
            {
              name: 'pca',
              path: '/hts/analyze/beta-diversity/pca',
              component: './hts/pages/analyze/beta-diversity/pca',
            },
          ],
        },
      ],
    },
  ],
};
