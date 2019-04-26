<template>
  <div>
    <!-- <h1>用户管理</h1> -->
    <a-table
      :rowKey="item => item.id"
      :columns="columns"
      :dataSource="list">
    </a-table>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'SystemUser',
  data () {
    return {
      columns: [
        { title: '员工', dataIndex: 'employeeCode' },
        { title: '编号', dataIndex: 'loginCode' },
        { title: '姓名', dataIndex: 'name' },
        { title: '角色', dataIndex: 'roleID' },
        { title: '大区', dataIndex: 'regionCode' }
      ],
      list: []
    };
  },
  mounted () {
    // api.oldapi.getRole().then(res => console.log(res));
    api.user.getUser({ page: 1, rows: 10 }).then(res => {
      this.list = res.rows;
    });
  }
};
</script>

<style lang="scss" scoped>

</style>
