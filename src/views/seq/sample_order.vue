<!-- 取样单 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
        <a-row :gutter="24">
          <a-col :md="6" :xl="4">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="别名">
              <a-input v-decorator="['alias']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="系列">
              <a-select v-decorator="['seriesId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="series in $store.state.seq.series" :value="series.id" :key="series.id">{{ series.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button icon="plus" type="primary">新建</a-button>
      </a-button-group>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      height="600"
      ref="sampleOrderTable"
      :loading="sampleOrderTable.loading"
      :columns="sampleOrderTable.columns"
      :pager-config="sampleOrderTable.pagerConfig"
      :data.sync="sampleOrderTable.tableData"
      @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: sampleOrderTable, callback: handleSearch})">
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: 'SeqSampleOrder',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      sampleOrderTable: {
        id: 0,
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
      const tableName = 'sampleOrderTable';
      // const { formatter } = this.$utils;
      // const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'radio', width: 40 },
        { type: 'index', width: 40 },
        { title: '取样单号', field: 'code' },
        { title: '转订单号', field: 'seqorderCode' },
        { title: '状态', field: 'status' },
        { title: '备注', field: 'remark' },
        { title: '客户', field: 'customerName' },
        { title: '负责人', field: 'subcustomerName' },
        { title: '订货人', field: 'contactName' },
        { title: '样品数', field: 'sampleNumber' },
        { title: '引物数', field: 'primerNumber' },
        { title: '订货人手机', field: 'contactMobile' },
        { title: '订货人邮箱', field: 'contactEmail' },
        { title: '创建时间', field: 'createDate' },
        { title: '销售员', field: 'salerName' },
        { title: '销售员电话', field: 'salerMobile' },
        { title: '销售员邮箱', field: 'salerEmail' },
        { title: '销售渠道', field: 'rangeChannel' },
        { title: '销售组织', field: 'rangeOrganization' },
        { title: '销售大区', field: 'regionCode' },
        { title: '销售网点', field: 'officeCode' },
        { title: '收样员', field: 'samplerName' },
        { title: '收样员电话', field: 'samplerMobile' },
        { title: '收样员邮箱', field: 'samplerEmail' },
        { title: '收样网点', field: 'sampleOfficeCode' },
        { title: '取样方式', field: 'sampleMethod' },
        { title: '网点收样人', field: 'officeSamplerName' },
        { title: '网点收样时间', field: 'officeSamplerDate' },
        { title: '部门收样人', field: 'departSamplerName' },
        { title: '部门收样时间', field: 'departSamplerDate' },
        { title: '测序点', field: 'seqfactoryName' },
        { title: '地址', field: 'address' },
        { title: '预约取样时间', field: 'sampleTime' },
        { title: '标准价格', field: 'stdPrice' },
        { title: '样品返还', field: 'sampleReturn' },
        { title: '是否拼接', field: 'isSplice' },
        { title: '币种', field: 'currency' },
        { title: '开票方式', field: 'invoiceType' },
        { title: '付款条件', field: 'paymentTerm' },
        { title: '是否有明细', field: 'isDetail' },
        { title: '测序中心', field: 'factory' },
        { title: '作废原因', field: 'cancelReason' },
        { title: '创建人', field: 'creatorName' },
        { title: '确认人', field: 'toOrderName' },
        { title: '确认时间', field: 'toOrderDate' },
        { title: '修改人', field: 'changerName' },
        { title: '修改时间', field: 'changeDate' },
        { title: '作废人', field: 'cancelName' },
        { title: '作废时间', field: 'cancelDate' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;
      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'sampleOrderTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.sampleorder.getOrderList(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
