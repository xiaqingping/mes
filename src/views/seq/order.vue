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
        size="small"
        :scroll="{ x: 5000 }"
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
        { title: '订单编号', dataIndex: 'code' },
        { title: '状态', dataIndex: 'status' },
        { title: '备注', dataIndex: 'remark' },
        { title: '客户', dataIndex: 'customerName' },
        { title: '负责人', dataIndex: 'subcustomerName' },
        { title: '订货人', dataIndex: 'contactName' },
        { title: '订货人邮箱', dataIndex: 'contactEmail' },
        { title: '订货人手机', dataIndex: 'contactMobile' },
        { title: '创建人姓名', dataIndex: 'creatorName' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '审核人姓名', dataIndex: 'checkName' },
        { title: '审核时间', dataIndex: 'checkDate' },
        { title: '产品金额', dataIndex: 'productAmount' },
        { title: '订单金额', dataIndex: 'amount' },
        { title: '销售员', dataIndex: 'salerName' },
        { title: '修改人姓名', dataIndex: 'changerName' },
        { title: '修改时间', dataIndex: 'changeDate' },
        { title: '来源单号', dataIndex: 'sourceCode' },
        { title: '运费', dataIndex: 'freight' },
        { title: '是否拼接', dataIndex: 'isSplice' },
        { title: '样品返还', dataIndex: 'sampleReturn' },
        { title: '币种', dataIndex: 'currency' },
        { title: '订单类型', dataIndex: 'orderType' },
        { title: '测序点', dataIndex: 'seqfactoryId' },
        { title: '测序中心', dataIndex: 'factory' },
        { title: '销售组织', dataIndex: 'rangeOrganization' },
        { title: '分销渠道', dataIndex: 'rangeChannel' },
        { title: '销售大区', dataIndex: 'regionCode' },
        { title: '销售网点', dataIndex: 'officeCode' },
        { title: '开票方式', dataIndex: 'invoiceType' },
        { title: '付款方式', dataIndex: 'paymentMethod' },
        { title: '付款条件', dataIndex: 'paymentTerm' },
        { title: '随货开票', dataIndex: 'invoiceByGoods' },
        { title: 'SAP销售订单号', dataIndex: 'sapOrderCode' },
        { title: 'SAP交货单号', dataIndex: 'sapDeliveryCode' },
        { title: '交货方式', dataIndex: 'deliveryType' },
        { title: '仓库', dataIndex: 'storageCode' },
        { title: '客户订单号', dataIndex: 'customerPocode' },
        { title: '是否有明细', dataIndex: 'isDetails' },
        { title: '收样网点', dataIndex: 'sampleOfficeCode' },
        { title: '送货地址', dataIndex: 'address' },
        { title: '作废人姓名', dataIndex: 'cancelName' },
        { title: '作废时间', dataIndex: 'cancelDate' },
        { title: '完成时间', dataIndex: 'finishDate' },
        { title: '完成人姓名', dataIndex: 'finishName' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.seqorder.getOrderList(params).then(res => {
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
