module.exports = {
  presets: ['@vue/app'],
  'plugins': [
    [
      'import',
      {
        'libraryName': 'vxe-table',
        'style': true // 样式是否也按需加载
      }
    ]
  ]
};
