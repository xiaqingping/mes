<!-- 样品管理 -->
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
      ref="sampleTable"
      :loading="sampleTable.loading"
      :columns="sampleTable.columns"
      :pager-config="sampleTable.pagerConfig"
      :data.sync="sampleTable.tableData"
      @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: sampleTable, callback: handleSearch})">
    </vxe-grid>
  </div>
</template>

<script>
export default {
  name: 'SeqSample',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      sampleTable: {
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
      const tableName = 'sampleTable';
      // const { formatter } = this.$utils;
      // const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'radio', width: 40 },
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name' },
        { title: '类型', field: 'sampleTypeId' },
        { title: '过期时间', field: 'overdueDate' },
        { title: '载体', field: 'carrierName' },
        { title: '抗性', field: 'sampleResistanceName' },
        { title: '特性', field: 'sampleFeatureName' },
        { title: '最小长度', field: 'minLength' },
        { title: '最大长度', field: 'maxLength' },
        { title: '状态', field: 'status' },
        { title: '失效原因', field: 'expireReason' },
        { title: '客户', field: 'customerName' },
        { title: '负责人', field: 'subcustomerName' },
        { title: '订货人', field: 'contactName' },
        { title: '销售员', field: 'salerName' },
        { title: '网点', field: 'officeCode' },
        { title: '大区', field: 'regionCode' },
        { title: '测序点', field: 'seqfactoryName' },
        { title: '收样人', field: 'samplerName' },
        { title: '收样时间', field: 'samplerDate' },
        { title: '创建人', field: 'creatorName' },
        { title: '创建时间', field: 'createDate' },
        { title: '失效人', field: 'expireName' },
        { title: '失效时间', field: 'expireDate' },
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
      const tableName = 'sampleTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.sample.getSample(params, true).then((data) => {
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
