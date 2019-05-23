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
                <a-input-search v-decorator="['customerName']" @search="onSearch(1)"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="负责人">
                <a-input-search v-decorator="['charge_person']" @search="onSearch()"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="订货人">
                <a-input-search v-decorator="['order']" @search="onSearch"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售员">
                <a-input-search v-decorator="['saler']" @search="onSearch"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="币种">
                <a-select v-decorator="['currency_type']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售网点">
                <a-select v-decorator="['commercial_network']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售大区">
                <a-select v-decorator="['sales_region']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售组织">
                <a-select v-decorator="['sales_organization']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="销售渠道">
                <a-select v-decorator="['distribution_channel']">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="12" :md="16" :sm="24">
              <a-form-item label="创建日期">
                <a-range-picker></a-range-picker>
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

    <div class="mask" v-show="customerName">
      <div
        class="customer-name-mask"
        :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1000px' : '100%', height : small ? '600px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
        <div class="top">
          <span style="float: left">客户列表</span>
          <span class="top-icon" style="padding-bottom: 10px" @click="onClose(1)"><a-icon
            type="close"/></span>
          <span class="top-icon" @click="onSmall" v-show="small"><a-icon
            type="plus-square"/></span>
          <span class="top-icon" @click="onSmall" v-show="!small"><a-icon
            type="minus-square"/></span>
        </div>
        <div class="middle-search" style="margin: 0 3%">
          <a-form layout="inline" :form="form" @submit="handleSearch">
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title="" style="width: 160px"/>
            </a-form-item>
            <a-form-item label="名称">
              <a-input-search v-decorator="['customerName']" style="width: 160px"/>
            </a-form-item>
            <a-form-item label="电话">
              <a-input-search v-decorator="['charge_person']" style="width: 160px"/>
            </a-form-item>
            <a-form-item label="手机">
              <a-input-search v-decorator="['order']" style="width: 160px"/>
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input-search v-decorator="['saler']" @search="onSearch" style="width: 160px"/>
            </a-form-item>
            <a-form-item label="大区">
              <a-select v-decorator="['currency_type']" style="width: 160px;">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="网点">
              <a-select v-decorator="['commercial_network']" style="width: 160px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="付款方式">
              <a-select v-decorator="['sales_region']" style="width: 133px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="付款条件">
              <a-select v-decorator="['sales_organization']" style="width: 130px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="销售范围">
              <a-select v-decorator="['distribution_channel']" style="width: 130px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="销售员编号">
              <a-input-search v-decorator="['saler']" @search="onSearch" style="width: 120px"/>
            </a-form-item>

            <a-form-item label="销售员名称">
              <a-input-search v-decorator="['saler']" @search="onSearch" style="width: 120px"/>
            </a-form-item>
            <a-button type="primary" icon="search">查询</a-button>
          </a-form>

        </div>

        <s-table
          ref="table"
          bordered
          size="small"
          :scroll="{ x: 1000}"
          :columns="columnss"
          :data="loadData"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
        </s-table>
      </div>

    </div>
  </div>
</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'SeqSampleOrder',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      small: true,
      customerName: false,
      advanced: true,
      customer_name_top: 0,
      customer_name_left: 0,
      columns: [
        { title: '订单编号', dataIndex: 'code' },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: function (text) {
            switch (text) {
              case 1 :
                return '未审核';
                break;
              case 2 :
                return '部门审核';
                break;
              case 3 :
                return '已审核';
                break;
              case 4 :
                return '已转申请';
                break;
              case 5 :
                return '已收货';
                break;
              case 6 :
                return '已发货';
                break;
              case 7 :
                return '已作废';
                break;
              case 8 :
                return '部分收货';
                break;
              case 9 :
                return '部分发货';
                break;
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
        { title: '销售组织', dataIndex: 'rangeOrganization' },
        { title: '分销渠道', dataIndex: 'rangeChannel' },
        { title: '销售大区', dataIndex: 'regionCode' },
        { title: '销售网点', dataIndex: 'officeCode' },
        { title: '交货方式', dataIndex: 'deliveryType' },
        { title: '开票方式', dataIndex: 'invoiceType' },
        { title: '付款方式', dataIndex: 'paymentMethod' },
        { title: '付款条件', dataIndex: 'paymentTerm' },
        { title: 'SAP销售订单号', dataIndex: 'sapOrderCode' },
        { title: 'SAP交货单号', dataIndex: 'sapDeliveryCode' },
        { title: '运费', dataIndex: 'freight' },
        { title: '订单金额', dataIndex: 'amount' },
        { title: '币种', dataIndex: 'currency' },
        { title: '随货开票', dataIndex: 'invoiceByGoods' },
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
      columnss: [
        { title: '编号', dataIndex: 'code' },
        { title: '公司', dataIndex: 'name' },
        { title: '电话', dataIndex: 'telNo' },
        { title: '手机', dataIndex: 'mobNo' },
        { title: '邮箱', dataIndex: 'email' },
        { title: '分类', dataIndex: 'type' },
        { title: '大区', dataIndex: 'regionCode' },
        { title: '网点', dataIndex: 'officeCode' },
        { title: '币种', dataIndex: 'currency' },
        { title: '付款方式', dataIndex: 'payMethodCode' },
        { title: '付款条件', dataIndex: 'payTermsCode' },
        { title: '销售员名称', dataIndex: 'salerName' },
        { title: '销售冻结(当前渠道)', dataIndex: 'customerRangeFrozen' },
        { title: '销售冻结(所有渠道)', dataIndex: 'customerFrozen' },
        { title: '客户性质', dataIndex: 'industryText' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getOrder(params).then(res => {
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
    console.log(this.$ls.get('TOKEN'));
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    if (width > 1000) {
      this.customer_name_left = (width - 1000) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 600) / 2;
    }
  },
  methods: {
    showDrawer () {
      this.visible = true;
    },
    onClose (e) {
      switch (e) {
        case 1 :
          this.customerName = false;
          break;
      }
    },
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
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
    onSearch (e) {
      switch (e) {
        case 1 :
          this.customerName = true;
          break;
      }
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
