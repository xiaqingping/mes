<!-- 测序仪 -->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="vertical" :form="form" @submit.prevent="handleSearch">
        <a-row :gutter="24">
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue: 1}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.basic.status" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :lg="4" :xl="3">
            <a-form-item label="测序点">
              <a-select v-decorator="['seqfactoryIdList', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="seqfactory in $store.state.seq.seqfactory" :value="seqfactory.id" :key="seqfactory.id">{{ seqfactory.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>
        <!-- <span style="line-height:32px;">测序仪</span> -->
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-hover-row
          auto-resize
          height="600"
          ref="seqdeviceTable"
          :loading="seqdeviceTable.loading"
          :columns="seqdeviceTable.columns"
          :pager-config="seqdeviceTable.pagerConfig"
          :data.sync="seqdeviceTable.tableData"
          :edit-rules="seqdeviceTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="({row}) => handleSearchDetail(row.id)"
          @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: seqdeviceTable, callback: handleSearch})">
        </vxe-grid>
      </a-layout-content>

      <a-layout-sider width="300">
        <span style="line-height:32px;">测序仪明细</span>
        <vxe-grid
          highlight-hover-row
          auto-resize
          height="600"
          ref="seqdeviceDetailsTable"
          :loading="seqdeviceDetailsTable.loading"
          :columns="seqdeviceDetailsTable.columns"
          :pager-config="seqdeviceDetailsTable.pagerConfig"
          :data.sync="seqdeviceDetailsTable.tableData"
          @page-change="({pageSize, currentPage}) => this.$utils.tablePageChange({pageSize, currentPage, table: seqdeviceDetailsTable, callback: handleSearchDetail})">
        </vxe-grid>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: 'SeqDevice',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      queryParam: {},
      seqdeviceTable: {
        id: 0,
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {}
      },
      seqdeviceDetailsTable: {
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
    this.setColumnToSeqdeviceDetails();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'seqdeviceTable';
      const { formatter } = this.$utils;
      const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name' },
        { title: '状态', field: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { title: '测序点', field: 'seqfactoryId', formatter: function ({ cellValue }) { return formatter(seq.seqfactory, cellValue); } },
        { title: '最大上机板数', field: 'ondeviceCount' },
        { title: '平均工作时间', field: 'avgworkhours' },
        { title: '总工作次数', field: 'workcount' },
        { title: '总工作时间', field: 'seqfactoryName' },
        { title: '使用率', field: 'workrate' },
        { title: '创建人', field: 'creatorName' },
        { title: '创建时间', field: 'createDate' },
        { title: '修改人', field: 'changerName' },
        { title: '修改时间', field: 'changeDate' },
        { title: '作废人', field: 'cancelName' },
        { title: '作废时间', field: 'cancelDate' },
        {
          title: '操作',
          field: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };

              if (!isEdit && row.status === 1) {
                actions = [
                  <a onClick={() => this.handleCancel(options)}>作废</a>,
                  <a onClick={() => this.handleUpdate(options)}>修改</a>
                ];
              }

              return [
                <span class="table-actions" onClick={(event) => event.stopPropagation()}>
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

      this[tableName].columns = columns;
      this[tableName].editRules = {
        name: [
          { required: true, message: '名称必填' }
        ]
      };

      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearch (e) {
      const tableName = 'seqdeviceTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.seqdevice.getSeqdevice(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        // 重置明细
        this.handleSearchDetail();
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增一可编辑行
    handleAddRow () {
      console.log('新增');
    },
    // 修改
    handleUpdate ({ row, rowIndex, tableName, xTable }) {
      console.log('修改');
    },
    // 删除
    handleCancel ({ row }) {
      this.$api.series.cancelSeries(row.id).then(() => {
        this.handleSearch();
      });
    },

    /**
     * 测序仪之明细
     */
    // 为测序仪之明细设置列
    setColumnToSeqdeviceDetails () {
      const tableName = 'seqdeviceDetailsTable';
      const { formatter } = this.$utils;
      const { seq } = this.$store.state;

      const columns = [
        { title: '反应板号', field: 'code' },
        { title: '创建人', field: 'creatorName' },
        { title: '创建时间', field: 'createDate' },
        { title: '状态', field: 'status', formatter: function ({ cellValue }) { return formatter(seq.reactionBoardStatus, cellValue); } },
        { title: '上机人姓名', field: 'ondeviceName' },
        { title: '实际上机时间', field: 'ondeviceStartDate' },
        { title: '实际结束时间', field: 'ondeviceEndDate' },
        { title: '预计开始时间', field: 'planStartDatetime' },
        { title: '预计剩余时间', field: 'planEndDatetime' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[tableName].$refs.xTable;
    },
    // 查询
    handleSearchDetail (seqdeviceId) {
      const tableName = 'seqdeviceDetailsTable';

      if (!seqdeviceId || seqdeviceId < 0) {
        this[tableName].tableData = [];
        return;
      }

      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;
      const params = { page: currentPage, rows: pageSize };

      this.$api.seqdevice.getReactioncomposeBySeqdevice(seqdeviceId, params).then(data => {
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
