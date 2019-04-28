import T from 'ant-design-vue/es/table/Table';
import { get } from 'lodash';

export default {
  data () {
    return {
      needTotalList: [],

      selectedRows: [],
      selectedRowKeys: [],

      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination)
    };
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    rows: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    }
  }),
  watch: {
    'localPagination.current' (val) {
      this.pageURI && this.$router.push({
        ...this.$route,
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          page: val
        })
      });
    },
    pageNum (val) {
      Object.assign(this.localPagination, {
        current: val
      });
    },
    rows (val) {
      Object.assign(this.localPagination, {
        rows: val
      });
    },
    showSizeChanger (val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      });
    }
  },
  created () {
    const { page } = this.$route.params;
    const localPageNum = this.pageURI && (page && parseInt(page)) || this.pageNum;
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      rows: this.rows,
      showSizeChanger: this.showSizeChanger
    });
    this.needTotalList = this.initTotalList(this.columns);
    this.loadData();
  },
  methods: {
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh (bool = false) {
      bool && (this.localPagination = Object.assign({}, {
        current: 1, rows: this.rows
      }));
      this.loadData();
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData (pagination, filters, sorter) {
      this.localLoading = true;
      const parameter = Object.assign({
        page: (pagination && pagination.current) ||
            this.localPagination.current || this.pageNum,
        rows: (pagination && pagination.rows) ||
            this.localPagination.rows || this.rows
      },
      (sorter && sorter.field && {
        sortField: sorter.field
      }) || {},
      (sorter && sorter.order && {
        sortOrder: sorter.order
      }) || {}, {
        ...filters
      }
      );
      const result = this.data(parameter);
      // 对接自己的通用数据接口需要修改下方代码中的 r.page, r.total, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          this.localPagination = Object.assign({}, this.localPagination, {
            current: r.page, // 返回结果中的当前分页数
            total: r.total, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            rows: (pagination && pagination.rows) ||
              this.localPagination.rows
          });
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.localPagination.current > 1) {
            this.localPagination.current--;
            this.loadData();
            return;
          }

          // 这里用于判断接口是否有返回 r.total 或 this.showPagination = false
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能

          (!this.showPagination || !r.total && this.showPagination === 'auto') && (this.localPagination.hideOnSinglePage = true);
          this.localDataSource = r.data; // 返回结果中的数组数据
          this.localLoading = false;
        });
      }
    },
    initTotalList (columns) {
      const totalList = [];
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          });
        }
      });
      return totalList;
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect (selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows;
      this.selectedRowKeys = selectedRowKeys;
      const list = this.needTotalList;
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex));
            return isNaN(total) ? 0 : total;
          }, 0)
        };
      });
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected () {
      if (this.rowSelection) {
        this.rowSelection.onChange([], []);
        this.updateSelect([], []);
      }
    }
  },

  render () {
    const props = {};
    const localKeys = Object.keys(this.$data);
    const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert;

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`;
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey];
        return props[k];
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows);
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows);
            }
          };
          return props[k];
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null;
          return props[k];
        }
      }
      props[k] = this[k];
      return props[k];
    });

    const table = (
      <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData}>
        { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
      </a-table>
    );

    return (
      <div class="table-wrapper">
        { table }
      </div>
    );
  }
};
