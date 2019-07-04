<!-- 多肽修饰-->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title=""/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="名称 ">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>

          <a-col :xxl="6" :xl="8" :md="12" :sm="24">
            <a-form-item label="修饰类型">
              <a-select v-decorator="['modificationTypeID', {initialValue : '0'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="item in modificationsType" :key="item.id" :value="item.id">
                  {{ item.modificationType }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue : '1'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">已删除</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">系列</span>
        <div>
          <div class="table-operator">
            <a-button-group>
              <a-button icon="search" @click="handleSearch">查询</a-button>
              <a-button icon="plus" type="primary" @click="handleAddRow">新增</a-button>
            </a-button-group>
          </div>

          <vxe-grid
            highlight-hover-row
            auto-resize
            :ref="modificationsTable.ref"
            :columns="modificationsTable.columns"
            :data.sync="modificationsTable.tableData"
            :loading="modificationsTable.loading"
            :edit-rules="modificationsTable.editRules"
            :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
            :pager-config="modificationsTable.pagerConfig"
            @cell-click="(options) => handleCellClick(options)"
            @page-change="pagerChange"
          >
          </vxe-grid>
        </div>
      </a-layout-content>

      <a-layout-sider width="300">
        <span style="line-height:32px;">修饰适用氨基酸</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="plus" type="primary" @click="handleAddRowSon">新建</a-button>
          </a-button-group>
        </div>
        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="modificationSonTable.ref"
          :loading="modificationSonTable.loading"
          :columns="modificationSonTable.columns"
          :data.sync="modificationSonTable.tableData"
          :edit-rules="modificationSonTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        >
        </vxe-grid>
      </a-layout-sider>
    </a-layout>

    <a-modal
      title="多肽修饰列表"
      width="1000px"
      :visible="aminoAcid.visible"
      :footer="null"
      @cancel="aminoAcid.visible = false">
      <amino-acid-mask v-show="aminoAcid_status" @Closed="closeMask()" @aminoAcidData="aminoAcidData">
      </amino-acid-mask>
    </a-modal>
  </div>
</template>

<script>
import AminoAcidMask from '@/components/peptide/amino_acid_mask';
const tableName = 'modificationsTable';
const tableNameSon = 'modificationSonTable';

export default {
  name: 'PeptideModifications',
  components: {
    AminoAcidMask
  },
  data () {
    return {
      form: this.$form.createForm(this),
      modificationsTable: {
        id: 0,
        ref: 'modificationsTable',
        xTable: null,
        editIndex: -1,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {
          purity: [
            { required: true, message: '名称必填' }
          ]
        }
      },
      modificationSonTable: {
        id: 0,
        ref: 'modificationSonTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      },
      aminoAcid: {
        visible: true,
        formData: {}
      },
      modificationsType: {}, // 修饰类型
      status: {},
      aminoAcid_status: true,
      parentData: {},
      modificationPositionData: {} // 修饰位置
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
    this.init();
  },
  methods: {
    init () {
      this.$api.peptide.getModificationTypes({ 'status': 1 }).then(res => {
        this.modificationsType = res.rows;
      });
    },
    onChange (e) {
      this.isIndependentModification = e.target.checked;
    },
    setColumns () {
      const self = this;
      const { formatter } = this.$utils;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      this.modificationPositionData = peptide.modificationPosition;
      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '修饰名称', field: 'name', editRender: { name: 'AInput' } },
        { title: '修饰代码', field: 'modificationCode', editRender: { name: 'AInput' } },
        {
          title: '修饰位置',
          field: 'modificationPosition',
          formatter: ({ cellValue }) => {
            return formatter(self.modificationPositionData, cellValue);
          }
        },
        {
          title: '独立修饰',
          field: 'isIndependentModification',
          scopedSlots: { customRender: 'isIndependentModification' },
          align: 'center',
          formatter: ({ cellValue }) => {
            return cellValue === 1 ? '√' : '';
          }
        },
        {
          title: '修饰类别',
          field: 'modificationTypeID',
          formatter: ({ cellValue }) => {
            return formatter(self.modificationsType, cellValue, 'id', 'modificationType');
          }
        },
        {
          title: '状态',
          field: 'status',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        { title: '创建人', field: 'creatorName' },
        { title: '创建日期', field: 'createDate' },
        { title: '删除人', field: 'cancelName' },
        { title: '删除时间', field: 'cancelDate' },
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

              if (!isEdit) {
                if (row.status === 1) {
                  actions = [
                    <a onClick={() => this.handleDelete(options)}>删除</a>
                  ];
                } else {
                  actions = [
                    <a onClick={() => this.handleResume(options)}>恢复</a>
                  ];
                }
              }
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleExit(options) }>退出</a>
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
      const columnSon = [
        { title: '编号', field: 'code', editRender: { name: 'AInput' } },
        { title: '名称', field: 'name', editRender: { name: 'AInput' } },
        {
          title: '状态',
          field: 'status',
          align: 'center',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        {
          title: '创建人', field: 'creatorName', align: 'center'
        },
        {
          title: '创建时间', field: 'createDate', align: 'center'
        },
        { title: '删除人', field: 'cancelName' },
        { title: '删除时间', field: 'cancelDate' },
        {
          title: '操作',
          field: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableNameSon].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableNameSon, xTable };

              if (!isEdit) {
                if (row.status === 1) {
                  actions = [
                    <a onClick={() => this.handleDelete(options, 'son')}>删除</a>
                  ];
                } else {
                  actions = [
                    <a onClick={() => this.handleResume(options, 'son')}>恢复</a>
                  ];
                }
              }
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options, 'son') }>保存</a>,
                  <a onClick={() => this.handleExit(options, 'son') }>退出</a>
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

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      columnSon.forEach(function (e) {
        if (!e.width) e.width = 80;
      });

      this[tableName].columns = columns;
      this[tableNameSon].columns = columnSon;
      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
      this[tableNameSon].xTable = this.$refs[this[tableNameSon].ref].$refs.xTable;
    },
    handleCellClick ({ row }) {
      this[tableNameSon].loading = true;
      this.parentData = { row };
      this.$api.peptide.getSuitableAminoAcids(row.id).then((data) => {
        this[tableNameSon].tableData = data;
        this[tableNameSon].editIndex = -1;
      }).finally(() => {
        this[tableNameSon].loading = false;
      });
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.peptide.getModifications(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.current = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    handleAddRow () {
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      var addVal = {
        id: --this[tableName].id
      };
      this[tableName].tableData = [addVal, ...this[tableName].tableData];
      table.setActiveRow(addVal);
      this[tableName].editIndex = 0;
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    changeSon (pagination) {
      this.paginationSon.current = pagination.current;
      this.paginationSon.pageSize = pagination.pageSize;
    },
    aminoAcidData (data) {
      this.amino_acid_data = data;
      this.sonCode = data[0].code;
      this.sonName = data[0].name;
    },
    handleSave () {
      if (this.name === '' || this.modificationCode === '' || this.modificationCode === '' || this.modificationTypeID === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      this.data.name = this.name;
      this.data.modificationCode = this.modificationCode;
      this.data.modificationPosition = this.modificationPosition;
      this.data.isIndependentModification = this.isIndependentModification ? 1 : 2;
      this.data.modificationTypeID = this.modificationTypeID;
      this.data.details = [];
      this.$api.peptide.insertModifications(this.data).then(res => {
        if (res.id) {
          this.handleExit();
        }
      });
    },
    handleDelete ({ row }, type = '') {
      if (type === 'son') {
        this.$api.peptide.deleteSuitableAminoAcids(row.id).then(res => {
          this.handleCellClick(this.parentData);
        });
      } else {
        this.$api.peptide.deletePurity(row.id).then(res => {
          this.handleSearch();
        });
      }
    },
    handleExit ({ row, rowIndex, tableName, xTable }, type = '') {
      // this.name = '';
      // this.modificationCode = '';
      // this.modificationPosition = '';
      // this.isIndependentModification = '';
      // this.modificationTypeID = '';
      // this.editIndex = -1;
      if (type === 'son') {
        xTable.clearActived();
        if (!row.status) {
          this[tableNameSon].tableData.splice(rowIndex, 1);
        }
        this[tableNameSon].editIndex = -1;
      } else {
        xTable.clearActived();
        if (!row.status) {
          this[tableName].tableData.splice(rowIndex, 1);
        }
        this[tableName].editIndex = -1;
      }
    },
    handleResume ({ row }, type = '') {
      if (type === 'son') {
        this.$api.peptide.resumeSuitableAminoAcids(row.id).then(res => {
          this.handleCellClick(this.parentData);
        });
      } else {
        this.$api.peptide.resumePurity(row.id).then(res => {
          this.handleSearch();
        });
      }
    },
    handleAddRowSon () {
      if (this[tableNameSon].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableNameSon].xTable;
      var addVal = {
        id: --this[tableNameSon].id
      };
      this[tableNameSon].tableData = [addVal, ...this[tableNameSon].tableData];
      table.setActiveRow(addVal);
      this[tableNameSon].editIndex = 0;
    },
    openMask () {
      this.aminoAcid_status = true;
      document.addEventListener('mousewheel', function (e) {
        e.preventDefault();
      }, { passive: false });
    },
    closeMask () {
      this.aminoAcid_status = false;
      document.addEventListener('mousewheel', function (e) {
        e.returnValue = true;
      }, { passive: false });
    },
    handleSaveSon () {
      if (this.sonName === '' || this.sonCode === '' || this.selectRow === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var addSonVal = {
        'name': this.sonName,
        'code': this.sonCode,
        'aminoAcidID': this.amino_acid_data[0].id,
        'modificationID': this.selectRow
      };
      this.$api.peptide.insertSuitableAminoAcids(addSonVal).then(res => {
        if (res.id) {
          this.handleExitSon();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
