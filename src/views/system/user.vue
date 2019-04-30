<template>
  <div class="page">
    <div class="page-head">
      <div class="breadcrumb">
        <span>首页 / </span>
        <span>系统管理 / </span>
        <span>用户管理</span>
      </div>
      <h1 class="page-title">用户管理</h1>
    </div>
    <div class="page-content">
      <s-table
        size="small"
        :scroll="{ x: 1500 }"
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
  name: 'SystemUser',
  components: {
    STable
  },
  data () {
    return {
      columns: [
        { title: '员工', dataIndex: 'employeeCode' },
        { title: '编号', dataIndex: 'loginCode' },
        { title: '姓名', dataIndex: 'name' },
        { title: '角色', dataIndex: 'roleID' },
        { title: '大区', dataIndex: 'regionCode' },
        { title: '网点', dataIndex: 'officeCode' },
        { title: '客户', dataIndex: 'customerCode' },
        { title: '测序点', dataIndex: 'cxPointId' },
        { title: '仓库', dataIndex: 'storageCode' },
        { title: '状态', dataIndex: 'isdel' },
        { title: '登录时间', dataIndex: 'loginDate' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: 'ID', dataIndex: 'code' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.user.getUserList(params).then(res => {
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
