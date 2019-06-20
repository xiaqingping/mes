<!-- 载体系列 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="状态">
              <a-select v-decorator="['seriesId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">系列</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="plus">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          stripe
          highlight-hover-row
          border
          resizable
          auto-resize
          min-height="400"
          :loading="loading"
          :columns="columns"
          :pager-config="pagerConfig"
          :data.sync="tableData"
          @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
          @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="250">
        <span style="line-height:32px;">引物</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus">新建</a-button>
            <a-button icon="save">保存</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          stripe
          highlight-hover-row
          border
          resizable
          auto-resize
          :loading="table2.loading"
          :columns="table2.columns"
          :data.sync="table2.tableData">
        </vxe-grid>
      </a-layout-sider>
    </a-layout>

  </div>
</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      editIndex: -1,
      queryParam: {},
      table1: {
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      table2: {
        loading: false,
        tableData: [{
          id: 1,
          name: 123
        }],
        columns: [
          { label: '引物编号', prop: 'code' },
          { label: '引物名称', prop: 'name' },
          { label: '引物类型', prop: 'type' }
        ],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      loading: false,
      tableData: [],
      columns: [],
      pagerConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  mounted () {
    this.setColumn();
    this.handleSearch();
  },
  methods: {
    setColumn () {
      const { formatter } = this.$units;
      const { basic } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { label: '编号', prop: 'code' },
        { label: '名称', prop: 'name' },
        { label: '状态', prop: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改人', prop: 'changerName' },
        { label: '修改时间', prop: 'changeDate' },
        { label: '作废人', prop: 'cancelName' },
        { label: '作废时间', prop: 'cancelDate' },
        {
          label: '操作',
          prop: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              if (row.status === 1 && this.editIndex !== rowIndex) {
                actions = [
                  <a>删除</a>,
                  <a>修改</a>
                ];
              }
              if (this.editIndex === rowIndex) {
                actions = [
                  <a>保存</a>,
                  <a>退出</a>
                ];
              }
              return [
                <span class="table-actions">
                  {actions}
                </span>
              ];
            }
          }
        }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this.columns = columns;
    },
    // 查询
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;
      this.selectedRowKeys = [];
      this.selectedRows = [];

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagerConfig.currentPage, rows: this.pagerConfig.pageSize }, params, queryParam);

      this.$api.series.getSeries(params, true).then((data) => {
        this.tableData = data.rows;
        this.pagerConfig.total = data.total;
        this.pagerConfig.currentPage = params.page;
        this.pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 分页改变时
    pagerChange (change) {
      if (change.type === 'pageSize') {
        //
      }
      this.pagerConfig[change.type] = change.value;
      this.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
