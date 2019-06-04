
<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="员工编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="14">
            <a-form-item label="员工名称">
              <a-input v-decorator="['staffName']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="类型：">
              <a-select v-decorator="['type']">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">工资项目</a-select-option>
                <a-select-option value="2">扣款项目</a-select-option>
                <a-select-option value="3">代发项目</a-select-option>
                <a-select-option value="4">代缴项目</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="状态：">
              <a-select v-decorator="['status', {initialValue : '1'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">已删除</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
      <a-button type="primary" icon="plus" @click="handleIncrease">新增</a-button>
      <a-button type="primary" icon="delete" @click="handleDelete">作废</a-button>
      <a-button type="primary" icon="edit">保存</a-button>
    </div>
    <!-- 表格 -->
    <s-table
      ref="table"
      bordered
      size="small"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
    >
    </s-table>
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
      columns: [
        { title: '编号', dataIndex: 'code' },
        { title: '名称', dataIndex: 'name' },
        { title: '类型', dataIndex: 'type', customRender: function (text) { if (text === 1) return '工资项目'; else if (text === 2) return '扣款项目'; else if (text === 3) return '代发项目'; else if (text === 4) return '代缴项目'; } },
        { title: '排序', dataIndex: 'serial' },
        { title: '状态', dataIndex: 'status', customRender: function (text) { if (text === 1) return '正常'; else if (text === 2) return '已删除'; } },
        { title: '创建人', dataIndex: 'createName' },
        { title: '创建时间', dataIndex: 'createDate' },
        { title: '修改人', dataIndex: 'updateName' },
        { title: '修改时间', dataIndex: 'updateDate' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.pay.getTypepay(params).then(res => {
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
    // 查询
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
    // 新增
    handleIncrease () {
      this.$api.pay.increaseTypepay(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
      // console.log(1);
    },
    // 删除
    handleDelete () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.pay.deleteTypepays(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
      // console.log(1);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    }
  }
};
</script>
<style lang="scss" scoped></style>
