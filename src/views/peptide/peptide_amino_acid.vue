<!-- 多肽氨基酸-->
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
          <!--          <div v-show="advanced">-->
          <a-col :md="6" :xl="4">
            <a-form-item label="名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :xl="4">
            <a-form-item label="代码">
              <a-input v-decorator="['aminoAcidCode']"/>
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
          <!--          </div>-->

        </a-row>
        <!-- <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button> -->
      </a-form>
    </div>

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
        :ref="aminoAcidTable.ref"
        :columns="aminoAcidTable.columns"
        :data.sync="aminoAcidTable.tableData"
        :loading="aminoAcidTable.loading"
        :edit-rules="aminoAcidTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="aminoAcidTable.pagerConfig"
        @page-change="pagerChange"
      >
      </vxe-grid>
    </div>
  </div>
</template>

<script>
const tableName = 'aminoAcidTable';

export default {
  name: 'PeptideAminoAcid',
  data () {
    return {
      status: {}, // 状态缓存
      form: this.$form.createForm(this),
      aminoAcidTable: {
        id: 0,
        ref: 'aminoAcidTable',
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
      data: {
        longCodeLeft: '',
        longCodeRight: '',
        shortCodeLeft: '',
        shortCodeRight: ''
      }
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
  },
  methods: {
    setColumns () {
      const self = this;
      const { formatter } = this.$utils;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '名称', field: 'name', editRender: { name: 'AInput' } },
        { title: '亲水性',
          field: 'hydrophilic',
          align: 'center',
          formatter: function ({ cellValue }) {
            if (cellValue === 1) { return '√'; }
          },
          editRender: { name: 'SCheckBox', events: { change: this.changeHydrophilic } }
        },
        {
          title: '疏水性',
          field: 'hydrophobic',
          align: 'center',
          formatter: function ({ cellValue }) {
            if (cellValue === 1) { return '√'; }
          },
          editRender: { name: 'SCheckBox', events: { change: this.changeHydrophobic } }
        },
        {
          title: '酸性',
          field: 'acidic',
          align: 'center',
          formatter: function ({ cellValue }) {
            if (cellValue === 1) { return '√'; }
          },
          editRender: { name: 'SCheckBox', events: { change: this.changeAcidic } }
        },
        {
          title: '碱性',
          field: 'alkaline',
          align: 'center',
          formatter: function ({ cellValue }) {
            if (cellValue === 1) { return '√'; }
          },
          editRender: { name: 'SCheckBox', events: { change: this.changeAlkaline } }
        },
        {
          title: '是否可做二硫键',
          field: 'isCanDisulfideBond',
          align: 'center',
          formatter: function ({ cellValue }) {
            if (cellValue === 1) { return '√'; }
          },
          editRender: { name: 'SCheckBox', events: { change: this.changeIsCanDisulfideBond } }
        },
        { title: '分子量', field: 'molecularWeight', align: 'center', editRender: { name: 'AInput' } },
        { title: '等电点', field: 'isoelectricPoint', align: 'center', editRender: { name: 'AInput' } },
        { title: '羧基解离常数', field: 'carboxylationDissociationConstant', align: 'center', editRender: { name: 'AInput' } },
        { title: '氨基解离常数', field: 'aminoDissociationConstant', align: 'center', editRender: { name: 'AInput' } },
        {
          title: '状态',
          field: 'status',
          formatter: ({ cellValue }) => {
            return formatter(self.status, cellValue);
          }
        },
        { title: '创建人', field: 'creatorName', align: 'center' },
        { title: '创建时间', field: 'createDate', align: 'center' },
        { title: '删除人', field: 'cancelName' },
        { title: '删除时间', field: 'cancelDate' },
        { title: '类型',
          field: 'aminoAcidType',
          align: 'center',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              if (isEdit) {
                actions = [
                  <a-input size="small" style="width:50px;background-color:white;color:black;cursor:text" defaultValue="L" disabled/>,
                  <a-input size="small" style="width:50px;background-color:white;color:black;cursor:text" defaultValue="D" disabled/>
                ];
                return [
                  <span class="table-actions">
                    {actions}
                  </span>
                ];
              } else {
                return row.aminoAcidType;
              }
            }
          }
        },
        { title: '长代码',
          field: 'longCode',
          align: 'center',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              if (isEdit) {
                actions = [
                  <a-input size="small" style="width:50px" onkeyup={ (e) => { self.data.longCodeLeft = e.target.value; }}/>,
                  <a-input size="small" style="width:50px" onkeyup={ (e) => { self.data.longCodeRight = e.target.value; }}/>
                ];
                return [
                  <span class="table-actions">
                    {actions}
                  </span>
                ];
              } else {
                return row.longCode;
              }
            }
          }
        },
        { title: '短代码',
          field: 'shortCode',
          align: 'center',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              if (isEdit) {
                actions = [
                  <a-input size="small" style="width:50px" onkeyup={ (e) => { self.data.shortCodeLeft = e.target.value; }}/>,
                  <a-input size="small" style="width:50px" onkeyup={ (e) => { self.data.shortCodeRight = e.target.value; }}/>
                ];
                return [
                  <span class="table-actions">
                    {actions}
                  </span>
                ];
              } else {
                return row.shortCode;
              }
            }
          }
        },
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
      columns.forEach(function (e) {
        if (!e.width) e.width = 120;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      this.loading = true;
      this.editIndex = -1;
      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);
      this.$api.peptideBase.getAminoAcid(params).then((data) => {
        var map = {}; var dest = [];
        for (let i = 0; i < data.rows.length; i++) {
          var ai = data.rows[i];
          if (!map[ai.id]) {
            dest.push({
              id: ai.id,
              code: ai.code,
              name: ai.name,
              hydrophilic: ai.hydrophilic,
              hydrophobic: ai.hydrophobic,
              acidic: ai.acidic,
              alkaline: ai.alkaline,
              isCanDisulfideBond: ai.isCanDisulfideBond,
              molecularWeight: ai.molecularWeight,
              isoelectricPoint: ai.isoelectricPoint,
              carboxylationDissociationConstant: ai.carboxylationDissociationConstant,
              aminoDissociationConstant: ai.aminoDissociationConstant,
              status: ai.status,
              creatorName: ai.creatorName,
              createDate: ai.createDate,
              cancelName: ai.cancelName,
              cancelDate: ai.cancelDate,
              aminoAcidType: ai.aminoAcidType,
              longCode: ai.longCode,
              shortCode: ai.shortCode
            });
            map[ai.id] = ai;
          } else {
            for (let j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.id === ai.id) {
                dj.shortCode = (dj.shortCode ? dj.shortCode : '') + (ai.shortCode ? ' | ' + ai.shortCode : '');
                dj.longCode = (dj.longCode ? dj.longCode : '') + (ai.longCode ? ' | ' + ai.longCode : '');
                dj.aminoAcidType = (dj.aminoAcidType ? dj.aminoAcidType : '') + (ai.aminoAcidType ? ' | ' + ai.aminoAcidType : '');
                break;
              }
            }
          }
        }
        this[tableName].tableData = dest;
        this[tableName].pagerConfig.total = dest.length * 2;
        this[tableName].pagerConfig.current = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
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
    handleSave (r) {
      // if (this.name === '' || this.molecularWeight === '' || this.isoelectricPoint === '' || this.carboxylationDissociationConstant === '' || this.aminoDissociationConstant === '' || this.leftLongCode === '' || this.leftShortCode === '' || this.rightLongCode === '' || this.rightShortCode === '') {
      //   this.$notification.error({
      //     message: '错误',
      //     description: `数据不能为空！`
      //   });
      //   return false;
      // }
      // if (r.id) {
      //   this.data = r;
      // }
      const data = {
        name: r.row.name,
        hydrophilic: r.row.hydrophilic ? 1 : 0,
        hydrophobic: r.row.hydrophobic ? 1 : 0,
        acidic: r.row.acidic ? 1 : 0,
        alkaline: r.row.alkaline ? 1 : 0,
        isCanDisulfideBond: r.row.isCanDisulfideBond ? 1 : 0,
        molecularWeight: r.row.molecularWeight,
        isoelectricPoint: r.row.isoelectricPoint,
        carboxylationDissociationConstant: r.row.carboxylationDissociationConstant,
        aminoDissociationConstant: r.row.aminoDissociationConstant,
        details: [
          {
            'aminoAcidType': 'L',
            'longCode': this.data.longCodeLeft,
            'shortCode': this.data.longCodeRight
          },
          {
            'aminoAcidType': 'D',
            'longCode': this.data.shortCodeLeft,
            'shortCode': this.data.shortCodeRight
          }
        ]
      };
      this.$api.peptideBase.insertAminoAcid(data).then(res => {
        if (res.id) {
          this.handleSearch();
        }
      });
    },
    changeHydrophilic (e) {
      const table = this[tableName].xTable;
      const primer = {
        hydrophilic: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    changeHydrophobic (e) {
      const table = this[tableName].xTable;
      const primer = {
        hydrophobic: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    changeAcidic (e) {
      const table = this[tableName].xTable;
      const primer = {
        acidic: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    changeAlkaline (e) {
      const table = this[tableName].xTable;
      const primer = {
        alkaline: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    changeIsCanDisulfideBond (e) {
      const table = this[tableName].xTable;
      const primer = {
        isCanDisulfideBond: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    handleExit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
      this[tableName].editIndex = -1;
    },
    handleDelete ({ row }) {
      this.$api.peptideBase.deleteAminoAcid(row.id).then(res => {
        this.handleSearch();
      });
    },
    handleResume ({ row }) {
      if (!row.id) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptideBase.resumeAminoAcid(row.id).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
