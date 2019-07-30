<!-- 多肽修饰产品-->
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

    <div>
      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" type="primary" @click="handleAddRow" id="add">新增</a-button>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="modificationProductTable.ref"
        :columns="modificationProductTable.columns"
        :data.sync="modificationProductTable.tableData"
        :loading="modificationProductTable.loading"
        :edit-rules="modificationProductTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="modificationProductTable.pagerConfig"
        @page-change="pagerChange">
        >
      </vxe-grid>
    </div>

    <a-modal
      title="产品列表"
      width="1000px"
      :visible="products.visible"
      :footer="null"
      @cancel="products.visible = false">
      <products-mask @Closed="closeMask(1)" @customerData="customerData">
      </products-mask>
    </a-modal>

    <a-modal
      title="多肽修饰列表"
      width="1000px"
      :visible="modifications.visible"
      :footer="null"
      @cancel="modifications.visible = false">
      <modifications-mask @Closed="closeMask(2)" @modificationsData="modificationsData">
      </modifications-mask>
    </a-modal>

  </div>
</template>

<script>
import ProductsMask from '@/components/peptide/products_mask';
import ModificationsMask from '@/components/peptide/modifications_mask';
const tableName = 'modificationProductTable';

export default {
  name: 'PeptideModificationProducts',
  components: {
    ProductsMask,
    ModificationsMask
  },
  data () {
    return {
      status: {},
      form: this.$form.createForm(this),
      aminoAcid: {},
      modificationPositionData: {},
      modificationProductTable: {
        id: 0,
        ref: 'modificationProductTable',
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
      products: {
        visible: false,
        formData: {}
      },
      modifications: {
        visible: false,
        formData: {}
      }
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.$api.peptideBase.getAminoAcid().then((res) => {
        var map = {}; var dest = [];
        for (let i = 0; i < res.rows.length; i++) {
          var ai = res.rows[i];
          if (!map[ai.code]) {
            dest.push({
              id: ai.id,
              name: ai.name,
              code: ai.code
            });
            map[ai.code] = ai;
          }
        }
        this.aminoAcid = dest;
        this.setColumns();
        this.handleSearch();
      });
    },
    setColumns () {
      const { formatter } = this.$utils;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const self = this;
      const columns = [
        { title: '编号', field: 'code' },
        { title: '修饰名称', field: 'modificationName', editRender: { name: 'SInputSearch', events: { search: self.openModificationMask } } },
        {
          title: '修饰位置',
          field: 'modificationPosition',
          formatter: ({ cellValue }) => {
            if (cellValue) { return formatter(peptide.modificationPosition, cellValue); }
          },
          editRender: { name: 'AInput', props: { 'disabled': true } }
        },
        {
          title: '氨基酸',
          field: 'aminoAcidName',
          formatter: function ({ cellValue }) { return formatter(self.aminoAcid, cellValue); },
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'name' },
            options: self.aminoAcid
          }
        },
        {
          title: '氨基酸类型',
          field: 'aminoAcidType',
          align: 'center',
          editRender: {
            name: 'ASelect',
            optionProps: { value: 'id', label: 'id' },
            options: [{ id: 'L' }, { id: 'D' }]
          }
        },
        { title: '提供总量从', field: 'providerTotalAmountBegin', editRender: { name: 'AInput' } },
        { title: '提供总量至', field: 'providerTotalAmountEnd', editRender: { name: 'AInput' } },
        { title: '长度从', field: 'aminoAcidLengthBegin', editRender: { name: 'AInput' } },
        { title: '长度至', field: 'aminoAcidLengthEnd', editRender: { name: 'AInput' } },
        { title: '是否脱盐',
          field: 'isNeedDesalting',
          formatter: ({ cellValue }) => {
            if (cellValue === 1) { return '√'; }
          },
          align: 'center',
          editRender: { name: 'SCheckBox', events: { change: this.changeIsNeedDesalting } }
        },
        { title: '产品编号', field: 'sapProductCode', editRender: { name: 'AInput', props: { 'disabled': true } } },
        { title: '产品名称', field: 'sapProductName', editRender: { name: 'SInputSearch', events: { search: self.openProductMask } } },
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
      columns.forEach(function (e) {
        if (!e.width) e.width = 120;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);
      this.$api.peptideBase.getModificationProducts(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
        this.loading = false;
      });
    },
    changeIsNeedDesalting (e) {
      const table = this[tableName].xTable;
      const primer = {
        isNeedDesalting: e.target.checked
      };
      Object.assign(table.getInsertRecords()[0], primer);
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
    customerData (data) {
      const table = this[tableName].xTable;
      const primer = {
        sapProductName: data.desc,
        sapProductCode: data.code
      };
      Object.assign(table.getInsertRecords()[0], primer);
    },
    modificationsData (data) {
      const table = this[tableName].xTable;
      const { formatter } = this.$utils;
      const { peptide } = this.$store.state;
      const primer = {
        modificationName: data.name,
        modificationPosition: formatter(peptide.modificationPosition, data.modificationPosition)
      };
      this.modificationPositionData = data;
      Object.assign(table.getInsertRecords()[0], primer);
    },
    openModificationMask () {
      this.modifications.visible = true;
      document.addEventListener('mousewheel', function (e) {
        e.preventDefault();
      }, { passive: false });
    },
    openProductMask () {
      this.products.visible = true;
      document.addEventListener('mousewheel', function (e) {
        e.preventDefault();
      }, { passive: false });
    },
    closeMask (num) {
      switch (num) {
        case 1 :
          this.products.visible = false;
          break;
        case 2 :
          this.modifications.visible = false;
          break;
      }
      document.addEventListener('mousewheel', function (e) {
        e.returnValue = true;
      }, { passive: false });
    },
    handleSave (r) {
      // if (this.modificationName === '' || this.modificationPosition === '' || this.providerTotalAmountBegin === '' || this.providerTotalAmountEnd === '' || this.aminoAcidLengthBegin === '' || this.aminoAcidLengthEnd === '' || this.sapProductCode === '' || this.sapProductName === '') {
      //   this.$notification.error({
      //     message: '错误',
      //     description: `数据不能为空！`
      //   });
      //   return false;
      // }

      // if (this.modifications[0].isIndependentModification === 2) {
      //   if (this.aminoAcidName === '' || this.aminoAcidType === '') {
      //     this.$notification.error({
      //       message: '错误',
      //       description: `修饰不是独立修饰，氨基酸和氨基酸类型不能为空`
      //     });
      //     return false;
      //   }
      // }
      var aminoAcidData = [];
      for (let i = 0; i < this.aminoAcid.length; i++) {
        if (parseInt(r.row.aminoAcidName) === parseInt(this.aminoAcid[i].id)) {
          aminoAcidData = this.aminoAcid[i];
        }
      }
      const data = {
        modificationCode: this.modificationPositionData.modificationCode,
        modificationID: this.modificationPositionData.modificationTypeID,
        modificationName: r.row.modificationName,
        modificationPosition: this.modificationPositionData.modificationPosition,
        aminoAcidName: aminoAcidData.name,
        aminoAcidCode: aminoAcidData.code,
        aminoAcidID: aminoAcidData.id,
        aminoAcidType: r.row.aminoAcidType,
        aminoAcidLengthBegin: parseInt(r.row.aminoAcidLengthBegin),
        aminoAcidLengthEnd: parseInt(r.row.aminoAcidLengthEnd),
        providerTotalAmountBegin: parseInt(r.row.providerTotalAmountBegin),
        providerTotalAmountEnd: parseInt(r.row.providerTotalAmountEnd),
        isNeedDesalting: r.row.isNeedDesalting ? 1 : 2,
        sapProductCode: r.row.sapProductCode,
        sapProductName: r.row.sapProductName
      };

      this.$api.peptideBase.insertModificationProducts(data).then(res => {
        if (res.id) {
          this.handleSearch();
        }
      });
    },
    handleExit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
      this[tableName].editIndex = -1;
    },
    handleResume ({ row }) {
      if (!row.id) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptideBase.resumeModificationProducts(row.id).then(res => {
        this.handleSearch();
      });
    },
    handleDelete ({ row }) {
      this.$api.peptideBase.deleteModificationProducts(row.id).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
