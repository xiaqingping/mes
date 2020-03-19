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
          component: './hts/analyze/metadata',
        },
        {
          name: 'otu',
          path: '/hts/analyze/otu',
          component: './hts/analyze/otu',
        },
        {
          name: 'alpha-diversity',
          path: '/hts/analyze/alpha-diversity',
          component: './hts/analyze/alpha-diversity',
        },
        {
          name: 'beta-diversity',
          path: '/hts/analyze/beta-diversity',
          routes: [
            {
              name: 'sample-level-clustering',
              path: '/hts/analyze/beta-diversity/sample-level-clustering',
              component: './hts/analyze/beta-diversity/sample-level-clustering',
            },
            {
              name: 'pca',
              path: '/hts/analyze/beta-diversity/pca',
              component: './hts/analyze/beta-diversity/pca',
            },
          ],
        },
      ],
    },
  ],
};
