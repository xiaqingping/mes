<!-- 样品用量 -->
<template>
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
            <a-form-item label="样品类型">
              <a-select v-decorator="['sampleTypeId', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.seq.sampleType" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="样品用量">
              <a-input v-decorator="['sampleDose']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8">
            <a-form-item label="测序点">
              <a-select v-decorator="['seqfactoryIdList', {initialValue: ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in $store.state.seq.seqfactory" :value="status.id" :key="status.id">{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch({page: 1})">查询</a-button>
        <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
      </a-button-group>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="sampleDoseTable.ref"
      :loading="sampleDoseTable.loading"
      :columns="sampleDoseTable.columns"
      :pager-config="sampleDoseTable.pagerConfig"
      :data.sync="sampleDoseTable.tableData"
      :edit-rules="sampleDoseTable.editRules"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @page-change="pagerChange">
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
      sampleDoseTable: {
        id: 0,
        ref: 'sampleDoseTable',
        xTable: null,
        editIndex: -1,
        editData: null,
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
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'sampleDoseTable';
      const { formatter } = this.$units;
      const { basic, seq } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        {
          label: '样品类型',
          prop: 'sampleTypeId',
          formatter: function ({ cellValue }) { return formatter(seq.sampleType, cellValue); },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.sampleType
          }
        },
        { label: '最小长度', prop: 'minSampleLength', editRender: { name: 'AInputNumber' } },
        { label: '最大长度', prop: 'maxSampleLength', editRender: { name: 'AInputNumber' } },
        {
          label: '浓度',
          prop: 'concentration',
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.concentration
          }
        },
        {
          label: '样品特性',
          prop: 'sampleFeatureId',
          formatter: function ({ cellValue, row }) {
            if (!cellValue) return row.sampleFeatureName;
            return formatter(seq.sampleFeature, cellValue);
          },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.sampleFeature
          }
        },
        { label: '样品用量', prop: 'sampleDose', editRender: { name: 'AInputNumber' } },
        { label: '测序点',
          prop: 'seqfactoryId',
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: seq.seqfactory
          }
        },
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
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };

              if (!isEdit && row.status === 1) {
                actions = [
                  <a onClick={() => this.handleCancel(options)}>删除</a>,
                  <a onClick={() => this.handleUpdate(options)}>修改</a>
                ];
              }
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleQuitEdit(options) }>退出</a>
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

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'sampleDoseTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.sampleprepare.getSampleDose(params, true).then((data) => {
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
      const tableName = 'sampleDoseTable';
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
      this.$api.sampleprepare.cancelSampleDose(row.id).then(() => {
        this.handleSearch();
      });
    },
    /**
     * 保存
     * status字段有值代表是修改，否则是新增
     */
    handleSave ({ row }) {
      if (row.status) {
        this.$api.sampleprepare.updateSampleDose(row).then(() => {
          this.handleSearch();
        });
      } else {
        this.$api.sampleprepare.addSampleDose(row).then(() => {
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
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'sampleDoseTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
