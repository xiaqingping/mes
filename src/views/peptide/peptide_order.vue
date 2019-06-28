<!-- 多肽订单管理-->
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
                <a-input-search v-decorator="['subCustomerCode']" @search="onOpen(2)"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="订货人">
                <a-input-search v-decorator="['contactCode']" @search="onOpen(3)"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售员">
                <a-input-search v-decorator="['salerCode']" @search="onOpen(4)"/>
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
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button type="primary" icon="plus" @click="onOpen(5)">新增</a-button>
          <a-button icon="edit" @click="onOpen(5)">修改</a-button>

          <a-dropdown>
            <a-button icon="minus-square">审核
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
          <a-button icon="minus-square">拒绝</a-button>
          <a-button icon="minus-square">反审核</a-button>
          <a-button icon="minus-square">收货</a-button>
          <a-button icon="minus-square">发货</a-button>
          <a-button icon="minus-square">打印</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? '收起' : '展开' }}
            <a-icon :type="advanced ? 'up' : 'down'"/>
          </a>
        </a-button-group>
      </div>

      <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="orderTable.ref"
        :columns="orderTable.columns"
        :data.sync="orderTable.tableData"
        :loading="orderTable.loading"
        :edit-rules="orderTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="orderTable.pagerConfig"
        @page-change="pagerChange">
        >
      </vxe-grid>
    </div>
    <customer-mask v-show="customer_status" @Closed="onClosed(1)">
    </customer-mask>
    <sub-customer-mask v-show="sub_customer_status" @Closed="onClosed(2)">
    </sub-customer-mask>
    <contact-mask v-show="contact_status" @Closed="onClosed(3)">
    </contact-mask>
    <saler-mask v-show="saler_status" @Closed="onClosed(4)">
    </saler-mask>
    <add-mask v-show="add_status" @Closed="onClosed(5)">
    </add-mask>
  </div>
</template>

<script>
import Zhcn from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import CustomerMask from '@/components/peptide/customer_mask';
import SubCustomerMask from '@/components/peptide/sub_customer_mask';
import ContactMask from '@/components/peptide/contact_mask';
import SalerMask from '@/components/peptide/saler_mask';
import AddMask from '@/components/peptide/order/add_mask';
const tableName = 'orderTable';

export default {
  name: 'PeptideOrder',
  components: {
    CustomerMask,
    SubCustomerMask,
    ContactMask,
    SalerMask,
    AddMask
  },
  data () {
    return {
      Zhcn,
      form: this.$form.createForm(this),
      orderTable: {
        id: 0,
        ref: 'orderTable',
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
      sub_customer_status: false,
      contact_status: false,
      saler_status: false,
      add_status: false,
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
    this.setColumns();
    this.handleSearch();
  },
  methods: {
    moment,
    setColumns () {
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { label: '订单编号', prop: 'code' },
        {
          label: '状态',
          prop: 'status',
          formatter: ({ cellValue }) => {
            return formatter(peptide.orderStatus, cellValue);
          }
        },
        { label: '客户', prop: 'customerName' },
        { label: '负责人', prop: 'subCustomerName' },
        { label: '订货人', prop: 'contactName' },
        { label: '备注', prop: 'remark' },
        { label: '订货人手机', prop: 'contactMobile' },
        { label: '订货人邮箱', prop: 'contactEmail' },
        { label: '销售员', prop: 'salerName' },
        {
          label: '销售组织',
          prop: 'rangeOrganization',
          formatter: ({ cellValue }) => {
            return formatter(peptide.rangeOrganization, cellValue);
          }
        },
        {
          label: '分销渠道',
          prop: 'rangeChannel',
          formatter: ({ cellValue }) => {
            return formatter(peptide.rangeChannel, cellValue);
          }
        },
        { label: '销售大区', prop: 'regionCode' },
        { label: '销售网点', prop: 'officeCode' },
        { label: '交货方式',
          prop: 'deliveryType',
          formatter: ({ cellValue }) => {
            return formatter(peptide.deliveryTypeStatus, cellValue);
          }
        },
        { label: '开票方式', prop: 'invoiceType' },
        { label: '付款方式', prop: 'paymentMethod' },
        { label: '付款条件', prop: 'paymentTerm' },
        { label: 'SAP销售订单号', prop: 'sapOrderCode' },
        { label: 'SAP交货单号', prop: 'sapDeliveryCode' },
        { label: '运费', prop: 'freight' },
        { label: '订单金额', prop: 'amount' },
        { label: '币种', prop: 'currency' },
        { label: '随货开票',
          prop: 'invoiceByGoods',
          formatter: ({ cellValue }) => {
            if (!cellValue) return peptide.invoiceByGoodsStatus[0].name;
            return formatter(peptide.invoiceByGoodsStatus, cellValue);
          }
        },
        { label: '送货地址', prop: 'address' },
        { label: '创建人姓名', prop: 'creatorName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改人姓名', prop: 'changerName' },
        { label: '修改时间', prop: 'changeDate' },
        { label: '发货人姓名', prop: 'sendName' },
        { label: '发货时间', prop: 'sendDate' },
        { label: '作废人姓名', prop: 'cancelName' },
        { label: '作废时间', prop: 'cancelDate' },
        { label: '审核人姓名', prop: 'checkName' },
        { label: '审核时间', prop: 'checkDate' },
        { label: '完成人姓名', prop: 'finishName' },
        { label: '完成时间', prop: 'finishDate' },
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
        if (!e.width) e.width = 110;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    showDrawer () {
      this.visible = true;
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();

      queryParam.createDateBegin = this.createDateBegin;
      queryParam.createDateEnd = this.createDateEnd;
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);
      this.$api.peptide.getOrder(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
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
        case 2 :
          this.sub_customer_status = true;
          break;
        case 3 :
          this.contact_status = true;
          break;
        case 4 :
          this.saler_status = true;
          break;
        case 5 :
          this.add_status = true;
          break;
      }
    },
    onClosed (e) {
      switch (e) {
        case 1 :
          this.customer_status = false;
          break;
        case 2 :
          this.sub_customer_status = false;
          break;
        case 3 :
          this.contact_status = false;
          break;
        case 4 :
          this.saler_status = false;
          break;
        case 5 :
          this.add_status = false;
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  // .vxe-pager-size--select{
  //   z-index: 10;
  // }
</style>
