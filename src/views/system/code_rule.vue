<template>
  <div class="page-content">
    <!-- 搜索 -->
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="2">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="Client">
              <a-input v-decorator="['client']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>
    <!-- 表格内容 -->
    <div>
      <a-row :gutter="0">
        <a-col :span="6">
          <!-- 编号规则 -->
          <a-card title="编号规则">
            <a href="#" slot="extra" @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
            </a>
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="search" @click="handleSearch">查询</a-button>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 1000 , y: 400 }"
              :columns="columns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
            </s-table>
          </a-card>
        </a-col>
        <!-- 编号规则内容 -->
        <a-col :span="6">
          <a-card title="编号规则内容">
            <a href="#" slot="extra" @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
            </a>
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 300 , y: 400 }"
              :columns="contentsColumns"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
            </s-table>
          </a-card>
        </a-col>
        <!-- 编号规则取值 -->
        <a-col :span="6">
          <a-card title="编号规则取值">
            <a href="#" slot="extra" @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
            </a>
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 300 , y: 400 }"
              :columns="detailsColums"
              :data="loadData"
              :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
            </s-table>
          </a-card>
        </a-col>
        <!-- 编号规则条件 -->
        <a-col :span="6">
          <a-card title="编号规则条件">
            <a href="#" slot="extra" @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? '收起' : '展开' }}
              <a-icon :type="advanced ? 'up' : 'down'"/>
            </a>
            </a>
            <div class="table-operator">
              <a-button-group>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              ref="table"
              size="small"
              bordered
              :scroll="{ x: 400 , y: 400 }"
              :columns="conditionsColums"
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
  names: 'SystemUser',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      advanced: true,
      // 编号规则
      columns: [
        { title: 'Client', dataIndex: 'client', width: '30%' },
        { title: '规则', dataIndex: 'rule', width: '10%', align: 'center' },
        {
          title: '覆盖旧编号',
          dataIndex: 'cover',
          align: 'center',
          width: '10%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        { title: '开始日期', dataIndex: 'dateBegin', width: '25%' },
        { title: '结束日期', dataIndex: 'dateEnd' }
      ],
      // 编号规则内容
      contentsColumns: [
        { title: '位置', dataIndex: 'place', width: '40%', align: 'center' },
        { title: '默认值', dataIndex: 'level', align: 'center' }
      ],
      // 编号规则取值
      detailsColums: [
        { title: '值', dataIndex: 'value', width: '60%', align: 'center' },
        { title: '优先级', dataIndex: 'value', align: 'center' }
      ],
      // 编号规则条件
      conditionsColums: [
        { title: '字段', dataIndex: 'field', width: '30%', align: 'center' },
        { title: 'OP', dataIndex: 'op', width: '30%', align: 'center' },
        { title: '文本', dataIndex: 'text', align: 'center' }
      ],
      queryParam: {},
      loadData: parameter => {
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.system.getCodeRuleList(params).then(res => {
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced () {
      this.advanced = !this.advanced;
    }
  }
};
</script>

<style lang='scss' scoped>

</style>
