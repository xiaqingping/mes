<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSearch">
      <div>
        <a-form-item label="编号">
          <a-input v-decorator="['code']" title="" style="width: 190px"/>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['customerName']" style="width: 190px"/>
        </a-form-item>
        <a-form-item label="销售组织">
          <a-input v-decorator="['charge_person']" style="width: 160px"/>
        </a-form-item>
        <a-form-item label="大区">
          <a-select v-decorator="['currency_type']" style="width: 188px;">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="1">关闭</a-select-option>
            <a-select-option value="2">运行中</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="网点">
          <a-select v-decorator="['commercial_network']" style="width: 190px">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="1">关闭</a-select-option>
            <a-select-option value="2">运行中</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="部门">
          <a-input v-decorator="['saler']" style="width: 190px"/>
        </a-form-item>
        <a-form-item label="个人手机">
          <a-input v-decorator="['charge_person']" style="width: 160px"/>
        </a-form-item>
        <a-form-item label="工作手机">
          <a-input v-decorator="['charge_person']" style="width: 160px"/>
        </a-form-item>
      </div>
      <div style="margin-bottom:10px">
        <a-button type="primary" icon="search" @click="showData">查询</a-button>
      </div>
    </a-form>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="salerMask.ref"
      :columns="salerMask.columns"
      :data.sync="salerMask.tableData"
      :loading="salerMask.loading"
      :edit-rules="salerMask.editRules"
      :edit-config="{key: 'id', trigger: 'dblclick', mode: 'row', showIcon: false, autoClear: false}"
      :pager-config="salerMask.pagerConfig"
      @cell-dblclick="(options) => handleCellDblclick(options)"
      @page-change="pagerChange">
      >
    </vxe-grid>
  </div>

</template>

<script>
const tableName = 'salerMask';

export default {
  name: 'PeptideSalerMask',
  data () {
    return {
      form: this.$form.createForm(this),
      salerMask: {
        id: 0,
        ref: 'salerMask',
        xTable: null,
        editIndex: -1,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      small: true,
      customer_name_top: 0,
      customer_name_left: 0,
      rangeOrganization: [],
      rangeChannel: [],
      hackReset: true,
      status: false,
      data: false
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    if (width > 1000) {
      this.customer_name_left = (width - 1100) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 660) / 2;
    }
  },
  watch: {
    status: function () {
      if (this.status) {
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
        this.status = false;
        this.small = true;
        this.data = false;
      }
    }
  },
  methods: {
    setColumns () {
      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '公司', field: 'name' },
        { title: '电话', field: 'telNo' },
        { title: '手机', field: 'mobNo' },
        { title: '邮箱', field: 'email' },
        { title: '分类', field: 'type' },
        { title: '大区', field: 'regionCode' },
        { title: '网点', field: 'officeCode' },
        { title: '币种', field: 'currency' },
        { title: '付款方式', field: 'payMethodCode' },
        { title: '付款条件', field: 'payTermsCode' },
        { title: '销售员名称', field: 'salerName' },
        { title: '销售冻结(当前渠道)', field: 'customerRangeFrozen' },
        { title: '销售冻结(所有渠道)', field: 'customerFrozen' },
        { title: '客户性质', field: 'industryText' }
      ];
      columns.forEach(function (e) {
        if (!e.width) e.width = 130;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();

      queryParam.createDateBegin = this.createDateBegin;
      queryParam.createDateEnd = this.createDateEnd;
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);
      this.$api.peptideorder.getOrder(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    onClose (row = {}) {
      this.$emit('Closed', row, 4);
      this.status = true;
    },
    handleCellDblclick ({ row }) {
      this.onClose(row);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    onSmall () {
      this.small = !this.small;
    },
    onChange (dates, dateStrings) {
      this.createDateBegin = dateStrings[0];
      this.createDateEnd = dateStrings[1];
    },
    showData () {
      this.data = true;
      this.$refs.table.refresh(true);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
