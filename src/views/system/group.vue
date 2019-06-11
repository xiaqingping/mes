<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="2">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="分组名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>
    <div>
      <a-row :gutter="0">
        <a-col :span="6">
          <a-card title="分组">
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="search" @click="handleSearch">查询</a-button>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              size="small"
              :scroll="{ x: 300, y: 400 }"
              :columns="columns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
            </s-table>
          </a-card>
        </a-col>
        <a-col :span="18">
          <a-card title="规则分组">
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="search" @click="handleSearch">查询</a-button>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 500, y: 400 }"
              :columns="rulegroupcolumns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
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
      advanced: true,
      columns: [
        { title: '分组名称', dataIndex: 'name' }
      ],
      rulegroupcolumns: [
        { title: '名称', dataIndex: '' },
        { title: 'Client', dataIndex: 'sourceClient' },
        { title: 'Type', dataIndex: 'sourceType' },
        { title: '资源', dataIndex: 'sourcePath' },
        { title: '资源描述', dataIndex: 'sourceDesc' },
        { title: '参数类型', dataIndex: 'paramType' },
        { title: '参数', dataIndex: 'parameterField' },
        { title: '参数描述', dataIndex: 'parameterDesc' },
        { title: 'OP', dataIndex: 'op' },
        { title: '值', dataIndex: 'value' },
        { title: '状态', dataIndex: 'status' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.system.getGroupsList(params).then(res => {
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
      const params = selectedRowKeys[0];
      this.$api.system.getAuthorityList(params).then(res => {
        console.log(res.rows);
      });
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

<style>
#components-button-demo-button-group h4 {
  margin: 16px 0;
  font-size: 14px;
  line-height: 1;
  font-weight: normal;
}
#components-button-demo-button-group h4:first-child {
  margin-top: 0;
}
#components-button-demo-button-group .ant-btn-group {
  margin-right: 8px;
}
</style>
