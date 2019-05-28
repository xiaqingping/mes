<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="订单编号">
              <a-input v-decorator="['code']" title=""/>
            </a-form-item>
          </a-col>
          <div v-show="advanced">
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="客户">
                <a-input-search v-decorator="['customerCode']" @search="onOpen(1)"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="负责人">
                <a-input-search v-decorator="['subCustomerCode']" @search="onSearch()"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="订货人">
                <a-input-search v-decorator="['contactCode']" @search="onSearch"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售员">
                <a-input-search v-decorator="['salerCode']" @search="onSearch"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="币种">
                <a-select v-decorator="['currency']">
                  <a-select-option v-for="item in currency" :key="item.id" :value="item.id">{{ item.name }}
                  </a-select-option></a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售网点">
                <a-select v-decorator="['officeCode']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售大区">
                <a-select v-decorator="['regionCode']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售组织">
                <a-select v-decorator="['rangeOrganization', {initialValue : ''}]">
                  <a-select-option v-for="item in rangeOrganization" :key="item.id" :value="item.id">{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售渠道">
                <a-select v-decorator="['rangeChannel', {initialValue : ''}]">
                  <a-select-option v-for="item in rangeChannel" :key="item.id" :value="item.id">{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="12" :md="16" :sm="24">
              <a-form-item label="创建日期">
                <a-range-picker
                  :ranges="{ 今天: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }"
                  :placeholder="['开始日期', '结束日期']"
                  format="YYYY-MM-DD"
                  @change="onChange">
                </a-range-picker>
              </a-form-item>
            </a-col>
          </div>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div>
      <div class="table-operator">
        <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="plus">新增</a-button>
        <a-button type="primary" icon="edit">修改</a-button>

        <a-dropdown>
          <a-button type="primary" icon="minus-square">审核
            <a-icon type="caret-down"/>
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">部门审核</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">折扣审核</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <a-button type="primary" icon="minus-square">拒绝</a-button>
        <a-button type="primary" icon="minus-square">反审核</a-button>
        <a-button type="primary" icon="minus-square">收货</a-button>
        <a-button type="primary" icon="minus-square">发货</a-button>
        <a-button type="primary" icon="minus-square">打印</a-button>
        <a @click="toggleAdvanced" style="margin-left: 8px">
          {{ advanced ? '收起' : '展开' }}
          <a-icon :type="advanced ? 'up' : 'down'"/>
        </a>
      </div>

      <s-table
        ref="table"
        bordered
        size="small"
        :scroll="{ x: 6000 }"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
      </s-table>
    </div>

    <customer-mask :customerName="customerName" v-show="customer_status" @changeCustomerStatus="onClosed(1)">
    </customer-mask>
  </div>
</template>

<script>
import STable from '@/components/Table';
import Zhcn from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import CustomerMask from '@/components/peptide/customer_mask';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable,
    'customer-mask': CustomerMask
  },
  data () {
    var self = this;
    return {
      Zhcn,
      form: this.$form.createForm(this),
      small: true,
      customerName: false,
      advanced: true,
      customer_name_top: 0,
      customer_name_left: 0,
      currency: [],
      createDateBegin: '',
      createDateEnd: '',
      rangeOrganization: [],
      rangeChannel: [],
      customer_status: false,
      columns: [
        { title: '订单编号', dataIndex: 'code' },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: function (text, record, index) {
            var val = self.$store.state.peptide.orderStatus;
            for (let i = 0; i < val.length; i++) {
              if (val[i].id === text) {
                return val[i].name;
              }
            }
          }
        },
        { title: '客户', dataIndex: 'customerName' },
        { title: '负责人', dataIndex: 'subCustomerName' },
        { title: '订货人', dataIndex: 'contactName' },
        { title: '备注', dataIndex: 'remark' },
        { title: '订货人手机', dataIndex: 'contactMobile' },
        { title: '订货人邮箱', dataIndex: 'contactEmail' },
        { title: '销售员', dataIndex: 'salerName' },
        {
          title: '销售组织',
          dataIndex: 'rangeOrganization',
          customRender: function (text, record, index) {
            var val = self.$store.state.peptide.rangeOrganization;
            for (let i = 0; i < val.length; i++) {
              if (val[i].id === parseInt(text)) {
                return val[i].name;
              }
            }
          }
        },
        {
          title: '分销渠道',
          dataIndex: 'rangeChannel',
          customRender: function (text, record, index) {
            var val = self.$store.state.peptide.rangeChannel;
            for (let i = 0; i < val.length; i++) {
              if (val[i].id === parseInt(text)) {
                return val[i].name;
              }
            }
          }
        },
        { title: '销售大区', dataIndex: 'regionCode' },
        { title: '销售网点', dataIndex: 'officeCode' },
        { title: '交货方式',
          dataIndex: 'deliveryType',
          customRender: function (text, record, index) {
            var val = self.$store.state.peptide.deliveryTypeStatus;
            for (let i = 0; i < val.length; i++) {
              if (val[i].id === text) {
                return val[i].id + '-' + val[i].name;
              }
            }
          }
        },
        { title: '开票方式', dataIndex: 'invoiceType' },
        { title: '付款方式', dataIndex: 'paymentMethod' },
        { title: '付款条件', dataIndex: 'paymentTerm' },
        { title: 'SAP销售订单号', dataIndex: 'sapOrderCode' },
        { title: 'SAP交货单号', dataIndex: 'sapDeliveryCode' },
        { title: '运费', dataIndex: 'freight' },
        { title: '订单金额', dataIndex: 'amount' },
        { title: '币种', dataIndex: 'currency' },
        { title: '随货开票',
          dataIndex: 'invoiceByGoods',
          customRender: function (text, record, index) {
            var val = self.$store.state.peptide.invoiceByGoodsStatus;
            for (let i = 0; i < val.length; i++) {
              if (val[i].id === parseInt(text)) {
                return val[i].name;
              }
            }
          }
        },
        { title: '送货地址', dataIndex: 'address' },
        { title: '创建人姓名', dataIndex: 'creatorName' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '修改人姓名', dataIndex: 'changerName' },
        { title: '修改时间', dataIndex: 'changeDate' },
        { title: '发货人姓名', dataIndex: 'sendName' },
        { title: '发货时间', dataIndex: 'sendDate' },
        { title: '作废人姓名', dataIndex: 'cancelName' },
        { title: '作废时间', dataIndex: 'cancelDate' },
        { title: '审核人姓名', dataIndex: 'checkName' },
        { title: '审核时间', dataIndex: 'checkDate' },
        { title: '完成人姓名', dataIndex: 'finishName' },
        { title: '完成时间', dataIndex: 'finishDate' }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        this.queryParam.createDateBegin = this.createDateBegin;
        this.queryParam.createDateEnd = this.createDateEnd;
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getOrder(params).then(res => {
          // console.log(res.rows);
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
    // console.log(this.$store.state);
    this.currency = this.$store.state.peptide.currency;
    this.rangeOrganization = this.$store.state.peptide.rangeOrganization;
    this.rangeChannel = this.$store.state.peptide.rangeChannel;
  },
  methods: {
    moment,
    showDrawer () {
      this.visible = true;
    },
    handleSearch () {
      this.$refs.table.refresh(true);
    },
    // handleSearch1 () {
    //   // this.$refs.table.refresh(true);
    // },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    onSmall () {
      this.small = !this.small;
    },
    toggleAdvanced () {
      this.advanced = !this.advanced;
    },
    onSearch () {
      this.customerName = true;
    },
    onChange (dates, dateStrings) {
      this.createDateBegin = dateStrings[0];
      this.createDateEnd = dateStrings[1];
    },
    onOpen (e) {
      switch (e) {
        case 1 :
          this.customer_status = true;
          break;
      }
    },
    onClosed (e) {
      switch (e) {
        case 1 :
          this.customer_status = false;
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
