<template>
  <div v-if="hackReset" class="mask">
    <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '700px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">产品列表</span>
        <span class="top-icon" style="padding-bottom: 10px" @click="onClose($event)"><a-icon
          type="close"/></span>
        <span class="top-icon" @click="onSmall" v-show="small"><a-icon
          type="plus-square"/></span>
        <span class="top-icon" @click="onSmall" v-show="!small"><a-icon
          type="minus-square"/></span>
      </div>
      <div class="middle-search" style="margin: 0 3%">
        <a-form layout="inline" :form="form" @submit="handleSearch">
          <div>
            <a-form-item label="编号">
              <a-input v-decorator="['code']" style="width: 193px"/>
            </a-form-item>
            <a-form-item label="产品名称">
              <a-input v-decorator="['desc']" style="width: 162px"/>
            </a-form-item>
            <a-form-item label="英文名称">
              <a-input v-decorator="['edesc']" style="width: 165px"/>
            </a-form-item>
            <a-form-item label="旧物料号">
              <a-input v-decorator="['oldCode']" style="width: 165px"/>
            </a-form-item>
            <a-form-item label="客户编号">
              <a-input v-decorator="['customerCode']" style="width: 165px"/>
            </a-form-item>
            <a-form-item label="负责人编号">
              <a-input v-decorator="['subcustomerCode']" style="width: 148px"/>
            </a-form-item>
            <a-form-item label="销售大区">
              <a-input v-decorator="['regionCode']" style="width: 165px"/>
            </a-form-item>
            <a-form-item label="销售网点">
              <a-input v-decorator="['officeCode']" style="width: 165px"/>
            </a-form-item>
            <a-form-item label="销售范围">
              <a-select v-decorator="['range_area', {initialValue : '10-3110'}]" style="width: 165px;">
                <a-select-option v-for="item in rangeArea" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="工厂">
              <a-select v-decorator="['stock_factory', {initialValue : '3100'}]" style="width: 193px" >
                <a-select-option value="3100">3100-生工上海工厂</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="品牌">
              <a-select v-decorator="['brandCode', {initialValue : ''}]" style="width: 190px">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="item in brands" :key="item.code" :value="item.code">{{ item.code }}-{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div>
            <a-button icon="search" @click="showData">查询</a-button>
            <a-button @click="sub" style="float:right">确定</a-button>
          </div>
        </a-form>

      </div>
      <div style="height:100%;position: relative;">
        <s-table
          ref="table"
          style="width:78%;"
          bordered
          size="small"
          :scroll="{ x: 1900, y: 400}"
          :columns="columns"
          :data="loadData"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
        </s-table>
        <div style="width:20%;position: absolute; left:79%; top:0">
          <h4>库存</h4>
          <a-table
            :columns="columnSon"
            :dataSource="dataSon"
            bordered
            rowKey="id"
            ref="table1"
            size="small"
            :scroll="{ x: 200, y: 400}"/>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'CustomerMask',
  components: {
    STable
  },
  data () {
    // var self = this;
    return {
      form: this.$form.createForm(this),
      small: true,
      customer_name_top: 0,
      customer_name_left: 0,
      rangeOrganization: [],
      rangeChannel: [],
      hackReset: true,
      status: false,
      data: false,
      rangeArea: [],
      brands: [],
      columnSon: [
        { title: '仓库', dataIndex: 'storageName', width: '120px' },
        { title: '数量', dataIndex: 'saleCount', width: '80px' }
      ],
      dataSon: [],
      columns: [
        { title: '编号', dataIndex: 'code', width: '120px' },
        { title: '产品名称', dataIndex: 'desc', width: '200px' },
        { title: '英文名称', dataIndex: 'edesc', width: '200px' },
        { title: '旧物料号', dataIndex: 'oldCode', width: '120px' },
        { title: '品牌', dataIndex: 'brand', width: '80px' },
        { title: '包装', dataIndex: 'packing', width: '80px' },
        {
          title: '温度条件',
          dataIndex: 'temperatureCode',
          width: '160px',
          customRender: function (value, record, index) {
            if (value) {
              return `${record.temperatureCode}-${record.temperature}`;
            }
          }
        },
        {
          title: '危险品标识',
          dataIndex: 'cas',
          width: '120px',
          customRender: function (value) {
            return value ? value.w7_nam : '';
          }
        },
        { title: '产品价格', dataIndex: 'listPrice', align: 'right', width: '100px' },
        { title: '客户折扣', dataIndex: 'custDiscount', align: 'right', width: '100px' },
        { title: '客户价格', dataIndex: 'custPrice', align: 'right', width: '100px' },
        { title: '促销价格', dataIndex: 'promPrice', align: 'right', width: '100px' },
        {
          title: '库存',
          dataIndex: 'stock',
          width: '100px',
          align: 'right',
          customRender: function (value) {
            return value.saleCount;
          }
        },
        {
          title: '到货周期',
          dataIndex: 'deliPeriod',
          width: '100px',
          customRender: function (value, record, index) {
            if (record.deliPeriod === 0 && record.prodPeriod === 0) {
              if (record.stock.saleCount > 0) {
                return '现货';
              } else {
                return '无货';
              }
            } else {
              return '预计' + Math.max(record.deliPeriod, record.prodPeriod) + '天到货';
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'saleStatus',
          width: '100px',
          customRender: function (value) {
            switch (value) {
              case 'Z1':
                return '暂停销售';
              case 'GE':
                return '状态异常(促销)';
            }
          }
        }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        this.queryParam['range.channel'] = this.queryParam.range_area.split('-')[0] ? this.queryParam.range_area.split('-')[0] : '';
        this.queryParam['range.organization'] = this.queryParam.range_area.split('-')[1] ? this.queryParam.range_area.split('-')[1] : '';
        this.queryParam['stock.factory'] = '3100';
        var params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getProductList(params).then(res => {
          if (!this.data) {
            res = [];
            res.length = 0;
          }
          return {
            data: res,
            page: params.page,
            total: res.length
          };
        });
      },
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  mounted () {
    this.selectedRows = [];
    this.selectedRowKeys = [];
    this.rangeArea = this.$store.state.peptide.rangeArea;
    this.brands = this.$store.state.basic.brands;
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    if (width > 1000) {
      this.customer_name_left = (width - 1100) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 700) / 2;
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
    sub () {
      if (this.selectedRows[0].saleStatus === 'Z1') {
        this.$notification.error({
          message: '错误',
          description: `不能选择暂停销售产品`
        });
        return false;
      }
      if (this.selectedRows[0]) {
        this.$emit('customerData', this.selectedRows);
        this.$emit('Closed');
        this.selectedRows = [];
        this.selectedRowKeys = [];
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
    handleSearch () {
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows.slice(-1);
      if (this.selectedRows[0]) {
        for (let i = 0; i < this.selectedRows[0].stock.storages.length; i++) {
          this.selectedRows[0].stock.storages[i]['id'] = i + 1;
        }
        this.dataSon = this.selectedRows[0].stock.storages;
      } else {
        this.dataSon = [];
      }
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
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow: hidden;
  }

  .customer-name-mask {
    background: white;
    box-shadow: 2px 2px 4px gray;

    .top {
      height: 40px;
      line-height: 40px;
      margin: 0 2%;
      color: gray;

      .top-icon {
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
        float: right;
      }

      .top-icon:hover {
        color: black;
      }
    }

    .middle-search {
      .ant-row {
        margin-left: 5px;
      }
    }
  }
</style>
