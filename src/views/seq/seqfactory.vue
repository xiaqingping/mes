<!-- 测序点 -->
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
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="测序工厂">
              <a-select v-decorator="['factory', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="factory in $store.state.basic.factorys" :value="factory.code" :key="factory.code">{{ factory.name }}</a-select-option>
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
        <a-button icon="plus">新建</a-button>
        <a-button icon="form">修改</a-button>
        <a-button icon="delete">删除</a-button>
        <a-button icon="save">保存</a-button>
      </a-button-group>
    </div>

    <s-table
      :ref="seqfactoryTable.ref"
      :loading="seqfactoryTable.loading"
      :columns="seqfactoryTable.columns"
      :data="seqfactoryTable.tableData"
      :pager-config="seqfactoryTable.pagerConfig"
      @pager-change="pagerChange"
    >
    </s-table>
  </div>
</template>

<script>
import STable from '@/components/STable.js';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      seqfactoryTable: {
        editIndex: -1,
        ref: 'seqfactory',
        loading: false,
        tableData: [],
        columns: [],
        editRules: {},
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
    // this.setEditRules();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'seqfactoryTable';
      const { formatter } = this.$units;
      const { basic } = this.$store.state;

      const columns = [
        { width: 40, type: 'index' },
        { label: '编号', prop: 'code' },
        { label: '名称', prop: 'name' },
        { label: 'SAP工厂', prop: 'factory', formatter: function ({ cellValue }) { return formatter(basic.factorys, cellValue, 'code', 'text'); } },
        { label: '仓库', prop: 'storageCode', formatter: function ({ cellValue }) { return formatter(basic.storages, cellValue, 'code', 'text'); } },
        { label: '状态', prop: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { label: '创建人', prop: 'creatorName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改人', prop: 'changerName' },
        { label: '修改时间', prop: 'changeDate' },
        { label: '作废人', prop: 'cancelName' },
        { label: '作废时间', prop: 'cancelDate' }
      ];

      this[tableName].columns = columns;
    },
    // 查询
    handleSearch (params = {}) {
      const tableName = 'seqfactoryTable';
      this[tableName].loading = true;
      this[tableName].editIndex = -1;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, params, queryParam);

      this.$api.seqfactory.getSeqfactory(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 分页改变时
    pagerChange (change) {
      const tableName = 'seqfactoryTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, change);
      this.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
