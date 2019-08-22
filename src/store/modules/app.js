export default {
  namespaced: true,
  state: {
    sidebar: true,
    device: 'desktop',
    theme: '',
    layout: '',
    contentWidth: '',
    fixedHeader: false,
    fixSiderbar: false,
    autoHideHeader: false,
    color: null,
    weak: false,
    multiTab: true
  },
  mutations: {
    setCache (state, payload) {

    }
  },
  actions: {
    getCache (context, payload = { type: null }) {

    }
  }
};
