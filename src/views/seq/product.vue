<!-- 测序产品 -->
<template>
  <div class="page">
    <div class="page-content">

      <div class="table-search">
        <a-form layout="inline" :form="form" @submit="handleSearch">
          <a-row :gutter="24">
            <a-col :xxl="4" :xl="6" :md="8">
              <a-form-item label="状态">
                <a-select v-decorator="['status', {initialValue: 1}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8">
              <a-form-item label="SAP产品编号">
                <a-input-search v-decorator="['productCode']" @search="searchProduct"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8">
              <a-form-item label="样品类型">
                <a-select v-decorator="['sampleTypeId', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="status in $store.state.seq.sampleType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8">
              <a-form-item label="测序类型">
                <a-select v-decorator="['seqTypeId', {initialValue: ''}]">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="status in $store.state.seq.seqType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-button icon="search" html-type="submit" style="display:none;">查询</a-button>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" type="primary" @click="handleAddRow()">新增</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        stripe
        highlight-hover-row
        border
        resizable
        auto-resize
        :start-index="(pagerConfig.currentPage - 1) * pagerConfig.pageSize"
        :loading="loading"
        :columns="columns"
        :pager-config="pagerConfig"
        :data.sync="tableData"
        @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
        @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})">
      </vxe-grid>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SeqSampleOrder',
  computed: mapState(['basic', 'seq']),
  data () {
    return {
      form: this.$form.createForm(this),
      loading: false,
      editIndex: -1,
      queryParam: {},
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
    // 设置表格列属性
    setColumn () {
      const { formatter } = this.$units;
      const { basic } = this;

      this.columns = [
        { type: 'index', width: 40 },
        { label: 'SAP产品编号', prop: 'productCode' },
        { label: 'SAP产品名称', prop: 'productName' },
        { label: '样品类型', prop: 'sampleTypeName' },
        { label: '测序类型', prop: 'seqTypeName' },
        { label: '统一附加费', prop: 'surcharge' },
        { label: '状态', prop: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '作废人', prop: 'cancelName' },
        { label: '作废时间', prop: 'cancelDate' },
        { label: '操作',
          prop: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              if (row.status === 1 && this.editIndex !== rowIndex) {
                actions = [
                  <a onClick={() => this.handleCancel(row.id)}>删除</a>
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
    },
    // 查询
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;
      this.selectedRowKeys = [];
      this.selectedRows = [];

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagerConfig.currentPage, rows: this.pagerConfig.pageSize }, params, queryParam);

      this.$api.sampletype.getSeqProduct(params, true).then((data) => {
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
    },
    // 新增一可编辑行
    handleAddRow () {
      const newData = {
        id: --this.id
      };
      this.tableData = [newData, ...this.tableData];
      this.editIndex = 0;
    },
    // 作废
    handleCancel (id) {
      this.$api.sampletype.cancelSeqProduct(id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave (row) {
      //
    },
    searchProduct () {
      console.log('searchProduct');
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
