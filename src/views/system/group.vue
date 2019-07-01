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
                <a-button type="primary" size="small" icon="plus" @click="handleIncrease(2)" id="add">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save" @click="handleEdit">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              ref="table"
              bordered
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
                <a-button type="primary" size="small" icon="search">刷新</a-button>
                <a-button type="primary" size="small" icon="plus">新建</a-button>
                <a-button type="primary" size="small" icon="delete">删除</a-button>
                <a-button type="primary" size="small" icon="save">保存</a-button>
              </a-button-group>
            </div>

            <s-table
              ref="table1"
              size="small"
              bordered
              :scroll="{ x: 2000, y: 400 }"
              :columns="columnSon"
              :data="loadDataSon"
              :rowSelection="{ selectedRowKeys: selectedRowKeySon, onChange: onSelectChangeSon }"
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
      // table
      columns: [
        { title: '分组名称', dataIndex: 'name' }
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
      selectedRows: [],
      // table1
      columnSon: [
        { title: '名称', dataIndex: 'name', width: '12%' },
        { title: 'Client', dataIndex: 'sourceClient', width: '6%' },
        { title: 'Type', dataIndex: 'sourceType', width: '5%' },
        { title: '资源', dataIndex: 'sourcePath', width: '23%' },
        { title: '资源描述', dataIndex: 'sourceDesc', width: '12%' },
        {
          title: '参数类型',
          dataIndex: 'paramType',
          width: '6%',
          customRender: function (value) {
            if (value === 1) {
              return '参数';
            } else if (value === 2) {
              return '属性';
            } else if (value === 3) {
              return '接口';
            }
          }
        },
        { title: '参数', dataIndex: 'parameterField', width: '8%' },
        { title: '参数描述', dataIndex: 'parameterDesc', width: '8%' },
        { title: 'OP', dataIndex: 'op', width: '5%' },
        { title: '值', dataIndex: 'value', width: '5%' },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: function (value) {
            return value === 0 ? '有效' : '过期';
          }
        }
      ],
      queryParamSon: {},
      loadDataSon: parameter => {
        const params = this.loadDataId;
        return this.$api.system.getGroupRulesList(params).then(res => {
          return {
            data: res.rows,
            page: params.page,
            total: res.total
          };
        });
      },
      selectedRowKeySon: [],
      selectedRowSon: [],
      loadDataId: 10
    };
  },
  watch: {
    loadDataId: function () {
      this.$refs.table1.refresh(true);
    }
  },
  mounted () {},
  methods: {
    // table 选择
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows.slice(-1);
      this.loadDataId = this.selectedRowKeys[0];
    },
    // table-1 选择
    onSelectChangeSon (selectedRowKeySon, selectedRowSon) {
      this.selectedRowKeySon = selectedRowKeySon.slice(-1);
      this.selectedRowSon = selectedRowKeySon.slice(-1);
    },
    // table 查询
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
    // table 新增
    handleIncrease (num) {
      document.getElementById('add').setAttribute('disabled', true);
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        if (i === 1) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else {
          tdObj.style.backgroundColor = 'white';
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='radio' id='addValue" + i + "'/>";
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
    },
    // table 保存
    handleEdit () {
      var addVal = document.getElementById('addValue').value;
      // console.log(addVal);
      if (addVal === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      this.$api.system.inserGroupList({ 'name': addVal }).then(res => {
        if (res.id) {
          this.utils.refresh();
          return this.$refs.table.refresh(true);
        }
      });
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
