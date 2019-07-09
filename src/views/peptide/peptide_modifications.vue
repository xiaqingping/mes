<!-- 多肽修饰-->
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :md="6" :xl="4">
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title=""/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="名称 ">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>

          <a-col :md="12" :xl="6">
            <a-form-item label="修饰类型">
              <a-select v-decorator="['modificationTypeID', {initialValue : '0'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="item in $store.state.peptide.modificationTypes" :key="item.id" :value="item.id">
                  {{ item.modificationType }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :xl="4">
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
      <amino-acid-mask @Closed="closeMask()" @aminoAcidData="aminoAcidData">
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
        visible: false,
        formData: {}
      },
      status: {},
      parentData: {}
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
  },
  methods: {
    onChange (e) {
      this.isIndependentModification = e.target.checked;
    },
    setColumns () {
      const self = this;
      const { formatter } = this.$utils;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '修饰名称', field: 'name', editRender: { name: 'AInput' } },
        { title: '修饰代码', field: 'modificationCode', editRender: { name: 'AInput' } },
        {
          title: '修饰位置',
          field: 'modificationPosition',
          formatter: ({ cellValue }) => {
            return formatter(peptide.modificationPosition, cellValue);
          },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: peptide.modificationPosition
          }
        },
        {
          title: '独立修饰',
          field: 'isIndependentModification',
          align: 'center',
          formatter: ({ cellValue }) => {
            return cellValue === 1 ? '√' : '';
          },
          editRender: { name: 'SCheckBox', events: { change: this.changeIsIndependentModification } }
        },
        {
          title: '修饰类别',
          field: 'modificationTypeID',
          formatter: ({ cellValue }) => {
            // console.log(self.modificationsType);
            return formatter(peptide.modificationTypes, cellValue, 'id', 'modificationType');
          },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'modificationType' },
            options: peptide.modificationTypes
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
        { title: '编号', field: 'code', editRender: { name: 'SInputSearch', events: { search: this.openMask } } },
        { title: '名称', field: 'name', editRender: { name: 'AInput', props: { 'disabled': true } } },
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
                  <a onClick={() => this.handleSaveSon(options) }>保存</a>,
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
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;
      this[tableNameSon].columns = columnSon;
      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
      this[tableNameSon].xTable = this.$refs[this[tableNameSon].ref].$refs.xTable;
    },
    handleCellClick ({ row }) {
      if (row.id > 0) {
        this[tableNameSon].loading = true;
        this.parentData = { row };
        this.$api.peptideBase.getSuitableAminoAcids(row.id).then((data) => {
          this[tableNameSon].tableData = data;
          this[tableNameSon].editIndex = -1;
        }).finally(() => {
          this[tableNameSon].loading = false;
        });
      }
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.peptideBase.getModifications(params).then((data) => {
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

      table.insert(addVal).then(({ row }) => {
        table.setActiveRow(row);
      });
      this[tableName].editIndex = 0;
    },
    changeIsIndependentModification (e) {
      const table = this[tableName].xTable;
      const primer = {
        isIndependentModification: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
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
      const table = this[tableNameSon].xTable;
      const primer = {
        code: data.code,
        name: data.name,
        aminoAcidID: data.id
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    handleSave (r) {
      // if (this.name === '' || this.modificationCode === '' || this.modificationCode === '' || this.modificationTypeID === '') {
      //   this.$notification.error({
      //     message: '错误',
      //     description: `数据不能为空！`
      //   });
      //   return false;
      // }
      // this.data.name = this.name;
      // this.data.modificationCode = this.modificationCode;
      // this.data.modificationPosition = this.modificationPosition;
      // this.data.isIndependentModification = this.isIndependentModification ? 1 : 2;
      // this.data.modificationTypeID = this.modificationTypeID;
      // this.data.details = [];
      const data = {
        name: r.row.name,
        modificationCode: r.row.modificationCode,
        modificationPosition: r.row.modificationPosition,
        isIndependentModification: r.row.isIndependentModification ? 1 : 2,
        modificationTypeID: r.row.modificationTypeID,
        details: []
      };
      this.$api.peptideBase.insertModifications(data).then(res => {
        if (res.id) {
          this.handleSearch();
        }
      });
    },
    handleDelete ({ row }, type = '') {
      if (type === 'son') {
        this.$api.peptideBase.deleteSuitableAminoAcids(row.id).then(res => {
          this.handleCellClick(this.parentData);
        });
      } else {
        this.$api.peptideBase.deletePurity(row.id).then(res => {
          this.handleSearch();
        });
      }
    },
    handleExit ({ row, rowIndex, tableName, xTable }, type = '') {
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
        this.$api.peptideBase.resumeSuitableAminoAcids(row.id).then(res => {
          this.handleCellClick(this.parentData);
        });
      } else {
        this.$api.peptideBase.resumePurity(row.id).then(res => {
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
      table.insert(addVal).then(({ row }) => {
        table.setActiveRow(row);
      });
      this[tableNameSon].editIndex = 0;
    },
    openMask () {
      this.aminoAcid.visible = true;
      document.addEventListener('mousewheel', function (e) {
        e.preventDefault();
      }, { passive: false });
    },
    closeMask () {
      this.aminoAcid.visible = false;
      document.addEventListener('mousewheel', function (e) {
        e.returnValue = true;
      }, { passive: false });
    },
    handleSaveSon (r) {
      // if (this.sonName === '' || this.sonCode === '' || this.selectRow === '') {
      //   this.$notification.error({
      //     message: '错误',
      //     description: `数据不能为空！`
      //   });
      //   return false;
      // }
      var addSonVal = {
        'name': r.row.name,
        'code': r.row.code,
        'aminoAcidID': r.row.aminoAcidID,
        'modificationID': this.parentData.row.id
      };
      this.$api.peptideBase.insertSuitableAminoAcids(addSonVal).then(res => {
        if (res.id) {
          this.handleCellClick(this.parentData);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
