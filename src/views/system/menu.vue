<template>
  <div class="page-content">
    <div class="table-operator">
      <a-button v-action:search icon="search" @click="handleSearch">查询</a-button>
      <a-button icon="plus">新建</a-button>
      <a-button icon="form">审核</a-button>
    </div>

    <s-table
      size="small"
      :scroll="{ x: 1500 }"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
    </s-table>
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
    },
    handleSearch (e) {
      e.preventDefault();
      this.$refs.table.refresh(true);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
