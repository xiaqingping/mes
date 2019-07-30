<template>
  <div>
    <!-- <div v-if="hackReset" class="mask">
    <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '630px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">多肽修饰列表</span>
        <span class="top-icon" style="padding-bottom: 10px" @click="onClose($event)"><a-icon
          type="close"/></span>
        <span class="top-icon" @click="onSmall" v-show="small"><a-icon
          type="plus-square"/></span>
        <span class="top-icon" @click="onSmall" v-show="!small"><a-icon
          type="minus-square"/></span>
      </div> -->
    <div class="middle-search" style="margin: 0 3%">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <div>
          <a-form-item label="编号">
            <a-input v-decorator="['code']" title="" style="width: 190px"/>
          </a-form-item>
          <a-form-item label="名称 ">
            <a-input v-decorator="['name']" style="width: 190px"/>
          </a-form-item>
          <a-form-item label="修饰类型">
            <a-select v-decorator="['modificationTypeID', {initialValue : '0'}]" style="width: 185px">
              <a-select-option value="0">全部</a-select-option>
              <a-select-option v-for="item in modificationsType" :key="item.id" :value="item.id">
                {{ item.modificationType }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', {initialValue : '1'}]" style="width: 150px">
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">正常</a-select-option>
              <a-select-option value="2">已删除</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div>
          <a-button icon="search" @click="showData">查询</a-button>
        <!-- <a-button @click="sub" style="float:right">确定</a-button> -->
        </div>
      </a-form>

    </div>

    <a-layout style="background-color:white;">
      <a-layout-content>
        <div>
          <div class="table-operator">
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
            @cell-dblclick="(options) => sub(options)"
            @page-change="pagerChange"
          >
          </vxe-grid>
        </div>
      </a-layout-content>
    </a-layout>

  </div>

</template>

<script>
const tableName = 'modificationsTable';

export default {
  name: 'PeptideModificationsMask',
  data () {
    var self = this;
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
        }
      },
      small: true,
      customer_name_top: 0,
      customer_name_left: 0,
      rangeOrganization: [],
      rangeChannel: [],
      hackReset: true,
      status: false,
      data: false,
      modificationsType: [],
      columns: [
        { title: '编号', dataIndex: 'code', width: '5%' },
        { title: '修饰名称', dataIndex: 'name', width: '18%' },
        { title: '修饰代码', dataIndex: 'modificationCode', width: '5%' },
        {
          title: '修饰位置',
          dataIndex: 'modificationPosition',
          width: '8%',
          customRender: function (value) {
            for (var i = 0; i < self.$store.state.peptide.modificationPosition.length; i++) {
              if (self.$store.state.peptide.modificationPosition[i].id === value) return self.$store.state.peptide.modificationPosition[i].name;
            }
          }
        },
        {
          title: '独立修饰',
          dataIndex: 'isIndependentModification',
          align: 'center',
          width: '6%',
          customRender: function (value) {
            if (value === 1) return '√';
          }
        },
        {
          title: '修饰类别',
          dataIndex: 'modificationTypeID',
          width: '18%',
          customRender: function (value) {
            for (var i = 0; i < self.modificationsType.length; i++) {
              if (self.modificationsType[i].id === value) {
                return self.modificationsType[i].modificationType;
              }
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '5%',
          customRender: function (value) {
            if (value === 1) {
              return '正常';
            } else if (value === 2) {
              return '已删除';
            }
          }
        },
        { title: '创建人', dataIndex: 'creatorName', width: '5%' },
        { title: '创建日期', dataIndex: 'createDate', width: '10%' },
        { title: '删除人', dataIndex: 'cancelName', width: '5%' },
        { title: '删除时间', dataIndex: 'cancelDate', width: '10%' }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptideBase.getModifications(params).then(res => {
          if (!this.data) {
            res.rows = [];
            res.total = 0;
          }
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
      },
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
    this.rangeArea = this.$store.state.peptide.rangeArea;
    this.brands = this.$store.state.basic.brands;
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
        { title: '修饰名称', field: 'name' },
        { title: '修饰代码', field: 'modificationCode' },
        {
          title: '修饰位置',
          field: 'modificationPosition',
          formatter: ({ cellValue }) => {
            return formatter(peptide.modificationPosition, cellValue);
          }
        },
        {
          title: '独立修饰',
          field: 'isIndependentModification',
          align: 'center',
          formatter: ({ cellValue }) => {
            return cellValue === 1 ? '√' : '';
          }
        },
        {
          title: '修饰类别',
          field: 'modificationTypeID',
          formatter: ({ cellValue }) => {
            return formatter(peptide.modificationTypes, cellValue, 'id', 'modificationType');
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
        { title: '删除时间', field: 'cancelDate' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
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
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    sub (o) {
      if (o.row) {
        this.$emit('modificationsData', o.row);
        this.$emit('Closed');
      } else {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
      }
    },
    onClose (e) {
      this.$emit('Closed');
      this.status = true;
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows.slice(-1);
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
  // .mask {
  //   position: fixed;
  //   width: 100%;
  //   height: 100%;
  //   top: 0;
  //   left: 0;
  //   background: rgba(0, 0, 0, 0.1);
  //   z-index: 10;
  //   overflow: hidden;
  // }

  // .customer-name-mask {
  //   background: white;
  //   box-shadow: 2px 2px 4px gray;

  //   .top {
  //     height: 40px;
  //     line-height: 40px;
  //     margin: 0 2%;
  //     color: gray;

  //     .top-icon {
  //       font-size: 14px;
  //       cursor: pointer;
  //       margin-left: 10px;
  //       float: right;
  //     }

  //     .top-icon:hover {
  //       color: black;
  //     }
  //   }

  //   .middle-search {
  //     .ant-row {
  //       margin-left: 5px;
  //     }
  //   }
  // }
</style>
