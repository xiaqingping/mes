<template>
  <div>
    <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
      <a-row :gutter="24">
        <a-col :xxl="4" :xl="6" :md="8">
          <a-form-item label="编号">
            <a-input v-decorator="['code']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
      </a-button-group>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="primerTable.ref"
      :loading="primerTable.loading"
      :columns="primerTable.columns"
      :pager-config="primerTable.pagerConfig"
      :data.sync="primerTable.tableData"
      @cell-click="(options) => handleCellClick(options)"
      @page-change="pagerChange">
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: 'ChoosePrimer',
  props: {},
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      primerTable: {
        ref: 'primerTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
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
      const tableName = 'primerTable';
      const { formatter } = this.$utils;
      const { seq } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name' },
        { title: '状态', field: 'status', formatter: function ({ cellValue }) { return formatter(seq.primerStatus, cellValue); } },
        { title: '失效原因', field: 'expireReason' },
        { title: '过期时间', field: 'overdueDate' },
        { title: '浓度', field: 'concentration' },
        { title: '类型', field: 'type' },
        { title: '序列', field: 'sequence' },
        { title: '碱基数', field: 'base' },
        { title: '测序点', field: 'seqfactoryName' },
        { title: '客户', field: 'customerName' },
        { title: '负责人', field: 'subcustomerName' },
        { title: '订货人', field: 'contactName' },
        { title: '销售员', field: 'salerName' },
        { title: '网点', field: 'officeCode' },
        { title: '大区', field: 'regionCode' },
        { title: '备注', field: 'remark' },
        { title: '合成引物SAP产品编号', field: 'primerProductCode' },
        { title: '合成引物SAP生产订单', field: 'primerProductionCode' },
        { title: 'sapDNA产品编号', field: 'sapDNAProductCode' },
        { title: 'sapCH产品编号', field: 'sapCHProductCode' },
        { title: '收样人', field: 'samplerName' },
        { title: '收样时间', field: 'samplerDate' },
        { title: '创建人', field: 'creatorName' },
        { title: '创建时间', field: 'createDate' },
        { title: '作废人', field: 'cancelName' },
        { title: '作废时间', field: 'cancelDate' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'primerTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.primer.getPrimer(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 点击表格行时
    handleCellClick ({ row }) {
      this.$emit('callback', row);
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'primerTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
