const GlobalModel = {
  namespace: 'global',
  state: {
    languageCode: 'ZH',
    collapsed: true,
    clientWidth: '1960',
    notices: [],
    commonStatus: [
      { id: 1, name: '正常' },
      { id: 2, name: '已删除' },
    ],
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    changeLanguageCode(state, { payload }) {
      const languageCode = payload.split('-')[0].toUpperCase();
      return { ...state, languageCode };
    },

    setClientWidth(state, { payload }) {
      return { ...state, clientWidth: payload };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
