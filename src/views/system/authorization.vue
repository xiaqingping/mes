<template>
  <div class="page-content">
    <!-- 查询搜索 -->
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="ID">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>
    <!-- 中间内容 -->
    <div>
      <a-row :gutter="0">
        <a-col :span="5">
          <a-card title="员工列表">
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="search" @click="handleSearch">查询</a-button>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              style="height:500px"
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 500, y: 400 }"
              :columns="userColumns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
            >
            </s-table>
          </a-card>
        </a-col>
        <a-col :span="5">
          <a-card title="用户权限明细">
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="redo">刷新</a-button>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              style="height:500px"
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 500, y: 400 }"
              :columns="authorityColumns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
            >
            </s-table>
          </a-card>
        </a-col>
        <a-col :span="14">
          <a-card title="明细" >
            <s-table
              style="height:542px"
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 500, y: 424 }"
              :columns="detailColumns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
            >
            </s-table>
          </a-card>
        </a-col>
      </a-row>
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
      form: this.$form.createForm(this),
      // 员工列表
      userColumns: [
        { title: 'ID', dataIndex: 'code' },
        { title: '姓名', dataIndex: 'name' },
        { title: '员工号', dataIndex: 'employeeCode' }
      ],
      // 权限明细
      authorityColumns: [
        { title: '类型', dataIndex: '' },
        { title: '权限', dataIndex: '' }
      ],
      // 明细 - 员工
      detailColumns: [
        { title: '名称', dataIndex: '' },
        { title: 'Client', dataIndex: '' },
        { title: 'Type', dataIndex: '' },
        { title: '资源', dataIndex: '' },
        { title: '资源描述', dataIndex: '' },
        { title: '类型参数', dataIndex: '' },
        { title: '参数', dataIndex: '' },
        { title: '参数描述', dataIndex: '' },
        { title: 'OP', dataIndex: '' },
        { title: '值', dataIndex: '' },
        { title: '状态', dataIndex: '' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.system.getDataAuthList(params).then(res => {
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
  mounted () {},
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      // const params = selectedRowKeys[0];
      // this.$api.system.getAuthorityList(params).then(res => {
      //   console.log(res.rows);
      // });
    },
    toggleAdvanced () {
      this.advanced = !this.advanced;
    },
    handleSearch () {
      this.$refs.table.refresh(true);
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-card-body{
  padding: 3px
}
</style>
