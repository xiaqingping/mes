<template>
  <div class="page">
    <div class="page-head">
      <div class="breadcrumb">
        <span>首页 / </span>
        <span>测序管理 / </span>
        <span>取样单</span>
      </div>
      <h1 class="page-title">取样单</h1>
    </div>
    <div class="page-content">
      <s-table
        bordered
        size="small"
        :scroll="{ x: 6000 }"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
      </s-table>
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
      columns: [
        { title: '取样单号', dataIndex: 'code' },
        { title: '转订单号', dataIndex: 'seqorderCode' },
        { title: '状态', dataIndex: 'status', customRender: function (text, record, index) { return text + 'x'; } },
        { title: '备注', dataIndex: 'remark' },
        { title: '客户', dataIndex: 'customerName' },
        { title: '负责人', dataIndex: 'subcustomerName' },
        { title: '订货人', dataIndex: 'contactName' },
        { title: '样品数', dataIndex: 'sampleNumber' },
        { title: '引物数', dataIndex: 'primerNumber' },
        { title: '订货人手机', dataIndex: 'contactMobile' },
        { title: '订货人邮箱', dataIndex: 'contactEmail' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '销售员', dataIndex: 'salerName' },
        { title: '销售员电话', dataIndex: 'salerMobile' },
        { title: '销售员邮箱', dataIndex: 'salerEmail' },
        { title: '销售渠道', dataIndex: 'rangeChannel' },
        { title: '销售组织', dataIndex: 'rangeOrganization' },
        { title: '销售大区', dataIndex: 'regionCode' },
        { title: '销售网点', dataIndex: 'officeCode' },
        { title: '收样员', dataIndex: 'samplerName' },
        { title: '收样员电话', dataIndex: 'samplerMobile' },
        { title: '收样员邮箱', dataIndex: 'samplerEmail' },
        { title: '收样网点', dataIndex: 'sampleOfficeCode' },
        { title: '取样方式', dataIndex: 'sampleMethod' },
        { title: '网点收样人', dataIndex: 'officeSamplerName' },
        { title: '网点收样时间', dataIndex: 'officeSamplerDate' },
        { title: '部门收样人', dataIndex: 'departSamplerName' },
        { title: '部门收样时间', dataIndex: 'departSamplerDate' },
        { title: '测序点', dataIndex: 'seqfactoryName' },
        { title: '地址', dataIndex: 'address' },
        { title: '预约取样时间', dataIndex: 'sampleTime' },
        { title: '标准价格', dataIndex: 'stdPrice' },
        { title: '样品返还', dataIndex: 'sampleReturn' },
        { title: '是否拼接', dataIndex: 'isSplice' },
        { title: '币种', dataIndex: 'currency' },
        { title: '开票方式', dataIndex: 'invoiceType' },
        { title: '付款条件', dataIndex: 'paymentTerm' },
        { title: '是否有明细', dataIndex: 'isDetail' },
        { title: '测序中心', dataIndex: 'factory' },
        { title: '作废原因', dataIndex: 'cancelReason' },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '确认人', dataIndex: 'toOrderName' },
        { title: '确认时间', dataIndex: 'toOrderDate' },
        { title: '修改人', dataIndex: 'changerName' },
        { title: '修改时间', dataIndex: 'changeDate' },
        { title: '作废人', dataIndex: 'cancelName' },
        { title: '作废时间', dataIndex: 'cancelDate' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.sampleorder.getOrderList(params).then(res => {
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
  mounted () {},
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
