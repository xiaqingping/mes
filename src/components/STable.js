import T from 'vxe-table/packages/grid';
// console.log(T.props);

export default {
  name: 'STable',
  data () {
    return {};
  },
  props: Object.assign({}, T.props, {
    stripe: {
      type: Boolean,
      default: true
    },
    highlightHoverRow: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      default: []
    },
    editRules: {
      type: Object
    },
    editConfig: {
      type: Object,
      default () {
        return {
          key: 'id',
          trigger: 'manual',
          mode: 'row',
          showIcon: false,
          autoClear: false
        };
      }
    },
    pagerConfig: {
      type: Object,
      default () {
        return {
          currentPage: 1,
          pageSize: 10,
          total: 0
        };
      }
    }
  }),
  methods: {
    pagerChange (change) {
      const { currentPage, pageSize } = this.pagerConfig;
      const pager = {
        currentPage,
        pageSize
      };
      pager[change.type] = change.value;
      if (change.type === 'pageSize') {
        //
      }

      this.$emit('pager-change', pager);
    }
  },
  render () {
    // const props = {};
    return (
      <vxe-grid
        ref="s-table"
        stripe
        highlight-hover-row
        border
        resizable
        auto-resize
        columns={this.columns}
        data={this.data}
        pagerConfig={this.pagerConfig}
        edit-config={this.editConfig}
        on-current-page-change={(currentPage) => this.pagerChange({ type: 'currentPage', value: currentPage })}
        on-page-size-change={(pageSize) => this.pagerChange({ type: 'pageSize', value: pageSize })}
      >
      </vxe-grid>
    );
  }
};
