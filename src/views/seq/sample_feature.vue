<!-- 样品特性 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
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
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">样品特性</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="sampleFeature.ref"
          :loading="sampleFeature.loading"
          :columns="sampleFeature.columns"
          :pager-config="sampleFeature.pagerConfig"
          :data.sync="sampleFeature.tableData"
          :edit-rules="sampleFeature.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClick(options)"
          @page-change="pagerChange">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="300">
        <span style="line-height:32px;">样品特性明细</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus" type="primary">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="sampleFeatureDetailsTable.ref"
          :loading="sampleFeatureDetailsTable.loading"
          :columns="sampleFeatureDetailsTable.columns"
          :pager-config="sampleFeatureDetailsTable.pagerConfig"
          :data.sync="sampleFeatureDetailsTable.tableData"
          :edit-rules="sampleFeatureDetailsTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClick(options)"
          @page-change="pagerChange">
        </vxe-grid>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: 'SeqSampleFeature',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      sampleFeature: {
        id: 0,
        ref: 'sampleFeature',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {
          name: [
            { required: true, message: '名称必填' }
          ]
        }
      },
      sampleFeatureDetailsTable: {
        id: 0,
        ref: 'sampleFeatureDetailsTable',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {
          name: [
            { required: true, message: '名称必填' }
          ]
        }
      }
    };
  },
  mounted () {
    this.setColumn();
    this.setColumnToSampleFeatureDetails();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'sampleFeature';
      const { formatter } = this.$utils;
      const { basic } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name' },
        { title: '状态', field: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
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
      const tableName = 'sampleFeature';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.sampletype.getSampleFeature(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRow () {
      const tableName = 'sampleFeature';
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      const newData = {
        id: --this[tableName].id
      };

      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
      this[tableName].editIndex = 0;
    },
    // 修改
    handleUpdate ({ row, rowIndex, tableName, xTable }) {
      xTable.setActiveRow(row);
      this[tableName].editIndex = rowIndex;
      this[tableName].editData = JSON.parse(JSON.stringify(row));
    },
    // 删除
    handleCancel ({ row }) {
      this.$api.series.cancelSeries(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row }) {
      if (row.status) {
        // 修改
        this.$api.series.updateSeries(row).then(() => {
          this.handleSearch();
        });
      } else {
        // 新增
        this.$api.series.addSeries(row).then(() => {
          this.handleSearch();
        });
      }
    },
    // 退出编辑
    handleQuitEdit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived().then(() => {
        this[tableName].editIndex = -1;
        if (!row.status) {
          this[tableName].tableData.splice(rowIndex, 1);
        } else {
          this.$set(this[tableName].tableData, rowIndex, this[tableName].editData);
          this[tableName].editData = null;
        }
      });
    },
    // 点击表格行时
    handleCellClick ({ row }) {
      const tableName = 'sampleFeatureDetailsTable';
      if (!row.id || row.id < 0) {
        this[tableName].tableData = [];
        return;
      }

      this[tableName].loading = true;
      this.$api.sampletype.getSampleFeatureDetail(row.id).then(res => {
        this[tableName].tableData = res;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'sampleFeature';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },

    /**
     * 特性之明细
     */
    // 为特性之明细设置列
    setColumnToSampleFeatureDetails () {
      const tableName = 'sampleFeatureDetailsTable';
      const columns = [
        { title: '测序点', field: 'seqfactoryName' },
        { title: 'DMSO', field: 'dmso' },
        { title: 'HIDI', field: 'hidi' },
        { title: '酶3.0', field: 'enzymeZero' },
        { title: '酶3.1', field: 'enzymeOne' },
        { title: '5*Buffer', field: 'bufferFive' },
        { title: 'H2O', field: 'htoo' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
