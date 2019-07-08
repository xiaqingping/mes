<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="Client">
              <a-input v-decorator="['client']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="Type">
              <a-select v-decorator="['type']">
                <a-select-option v-for="item in type" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
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
      </a-button-group>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="carrierTable.ref"
      :loading="carrierTable.loading"
      :columns="carrierTable.columns"
      :pager-config="carrierTable.pagerConfig"
      :data.sync="carrierTable.tableData"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @page-change="pagerChange"
    >
    </vxe-grid>

  </div>
</template>

<script>
export default {
  name: 'SystemSources',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),

      carrierTable: {
        ref: 'carrierTable',
        loading: false,
        tableData: [],
        data: [],
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
    // 缓存
    this.type = this.$store.state.system.type;
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'carrierTable';
      // const { formatter } = this.$utils;
      // const { basic } = this.$store.state;

      const columns = [
        { width: 40, type: 'index' },
        { title: 'client', field: 'client' },
        { title: 'path', field: 'path' },
        { title: '描述', field: 'desc' },
        { title: 'type', field: 'type' }
      ];

      this[tableName].columns = columns;
    },
    // 查询
    handleSearch (params = {}) {
      const tableName = 'carrierTable';
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, params, queryParam);

      this.$api.system.getSourcesList(params, true).then((data) => {
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
      const tableName = 'ruleTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, change);
      this.handleSearch();
    }
  }
};
</script>
