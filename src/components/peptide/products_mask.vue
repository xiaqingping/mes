<template>
  <div>
    <!-- <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '700px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">产品列表</span>
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
            <a-input v-decorator="['code']" style="width: 163px"/>
          </a-form-item>
          <a-form-item label="产品名称">
            <a-input v-decorator="['desc']" style="width: 132px"/>
          </a-form-item>
          <a-form-item label="英文名称">
            <a-input v-decorator="['edesc']" style="width: 135px"/>
          </a-form-item>
          <a-form-item label="旧物料号">
            <a-input v-decorator="['oldCode']" style="width: 135px"/>
          </a-form-item>
          <a-form-item label="客户编号">
            <a-input v-decorator="['customerCode']" style="width: 135px"/>
          </a-form-item>
          <a-form-item label="负责人编号">
            <a-input v-decorator="['subcustomerCode']" style="width: 118px"/>
          </a-form-item>
          <a-form-item label="销售大区">
            <a-input v-decorator="['regionCode']" style="width: 135px"/>
          </a-form-item>
          <a-form-item label="销售网点">
            <a-input v-decorator="['officeCode']" style="width: 135px"/>
          </a-form-item>
          <a-form-item label="销售范围">
            <a-select v-decorator="['range_area', {initialValue : '10-3110'}]" style="width: 135px;">
              <a-select-option v-for="item in rangeArea" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="工厂">
            <a-select v-decorator="['stock_factory', {initialValue : '3100'}]" style="width: 163px" >
              <a-select-option value="3100">3100-生工上海工厂</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="品牌">
            <a-select v-decorator="['brandCode', {initialValue : ''}]" style="width: 160px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="item in brands" :key="item.code" :value="item.code">{{ item.code }}-{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div>
          <a-button icon="search" @click="showData">查询</a-button>
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
            :ref="productTable.ref"
            :columns="productTable.columns"
            :data.sync="productTable.tableData"
            :loading="productTable.loading"
            :edit-rules="productTable.editRules"
            :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
            :pager-config="productTable.pagerConfig"
            @cell-click="(options) => handleCellClick(options)"
            @cell-dblclick="(options) => sub(options)"
            @page-change="pagerChange"
          >
          </vxe-grid>
        </div>
      </a-layout-content>

      <a-layout-sider width="300" style="background-color:white;margin-left:10px">
        <span style="line-height:32px;">库存</span>
        <div class="table-operator">
        </div>
        <vxe-grid
          highlight-hover-row
          auto-resize
          :ref="productSonTable.ref"
          :loading="productSonTable.loading"
          :columns="productSonTable.columns"
          :data.sync="productSonTable.tableData"
          :edit-rules="productSonTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        >
        </vxe-grid>
      </a-layout-sider>
    </a-layout>

  </div>
  <!-- </div> -->

</template>

<script>
const tableName = 'productTable';
const tableNameSon = 'productSonTable';

export default {
  name: 'PeptideProductsMask',
  data () {
    return {
      form: this.$form.createForm(this),
      productTable: {
        id: 0,
        ref: 'productTable',
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
      productSonTable: {
        id: 0,
        ref: 'productSonTable',
        xTable: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {}
      },
      small: true,
      loading: false,
      status: false,
      data: false,
      rangeArea: [],
      brands: []
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
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      this.modificationPositionData = peptide.modificationPosition;
      const columns = [
        { type: 'index', width: 40 },
        { title: '编号', field: 'code' },
        { title: '产品名称', field: 'desc' },
        { title: '英文名称', field: 'edesc' },
        { title: '旧物料号', field: 'oldCode' },
        { title: '品牌', field: 'brand' },
        { title: '包装', field: 'packing' },
        {
          title: '温度条件',
          field: 'temperatureCode',
          formatter: ({ cellValue, row }) => {
            return `${row.temperatureCode}-${row.temperature}`;
          }
        },
        {
          title: '危险品标识',
          field: 'cas',
          formatter: ({ cellValue }) => {
            return cellValue ? cellValue.w7_nam : '';
          }
        },
        { title: '产品价格', field: 'listPrice', align: 'right' },
        { title: '客户折扣', field: 'custDiscount', align: 'right' },
        { title: '客户价格', field: 'custPrice', align: 'right' },
        { title: '促销价格', field: 'promPrice', align: 'right' },
        {
          title: '库存',
          field: 'stock',
          align: 'right',
          formatter: ({ cellValue }) => {
            return cellValue.saleCount;
          }
        },
        {
          title: '到货周期',
          field: 'deliPeriod',
          formatter: ({ cellValue, row }) => {
            if (row.deliPeriod === 0 && row.prodPeriod === 0) {
              if (row.stock.saleCount > 0) {
                return '现货';
              } else {
                return '无货';
              }
            } else {
              return '预计' + Math.max(row.deliPeriod, row.prodPeriod) + '天到货';
            }
          }
        },
        {
          title: '状态',
          field: 'saleStatus',
          formatter: ({ cellValue }) => {
            switch (cellValue) {
              case 'Z1':
                return '暂停销售';
              case 'GE':
                return '状态异常(促销)';
            }
          }
        }
      ];
      const columnSon = [
        { title: '仓库', field: 'storageName', columnKey: 'storage' },
        { title: '数量', field: 'saleCount' }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;
      this[tableNameSon].columns = columnSon;
      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
      this[tableNameSon].xTable = this.$refs[this[tableNameSon].ref].$refs.xTable;
    },
    handleCellClick ({ row }) {
      this[tableNameSon].tableData = row.stock.storages.map((value, index, array) => {
        return Object.assign({ id: value.storage }, value);
      });
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      queryParam['range.channel'] = queryParam.range_area.split('-')[0] ? queryParam.range_area.split('-')[0] : '';
      queryParam['range.organization'] = queryParam.range_area.split('-')[1] ? queryParam.range_area.split('-')[1] : '';
      queryParam['stock.factory'] = '3100';
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.basic.getProductList(params).then((data) => {
        this[tableName].tableData = data;
        this[tableName].pagerConfig.total = data.length;
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
      if (o.row.saleStatus === 'Z1') {
        this.$notification.error({
          message: '错误',
          description: `不能选择暂停销售产品`
        });
        return false;
      }
      if (o.row) {
        this.$emit('customerData', o.row);
        this.$emit('Closed');
      }
    },
    onClose (e) {
      this.$emit('Closed');
      this.status = true;
      this.selectedRows = [];
      this.selectedRowKeys = [];
      this.dataSon = [];
    },
    onSmall () {
      this.small = !this.small;
    },
    showData () {
      this.data = true;
      this.handleSearch();
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
