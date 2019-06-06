<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="规则名称">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="Client">
                <a-input v-decorator="['sourceClient']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="参数">
                <a-input v-decorator="['parameterField']"/>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="Type">
                <a-select v-decorator="['sourceType']">
                  <a-select-option v-for="item in type" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="资源">
                <a-input-search v-decorator="['sourcePath']" />
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="参数类型">
                <a-select v-decorator="['paramType']">
                  <a-select-option v-for="item in paramType" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-decorator="['status']">
                  <a-select-option v-for="item in status" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
      <a-button type="primary" icon="plus" @click="addTr(11)" id="add">新建</a-button>
      <a-button type="primary" icon="delete" @click="addData">删除</a-button>
      <a-button type="primary" icon="save">保存</a-button>
      <a @click="toggleAdvanced" style="margin-left: 8px">
        {{ advanced ? '收起' : '展开' }}
        <a-icon :type="advanced ? 'up' : 'down'"/>
      </a>
    </div>

    <s-table
      ref="table"
      size="small"
      bordered
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
      form: this.$form.createForm(this),
      advanced: true,
      type: [],
      paramType: [],
      status: [],
      columns: [
        { title: '规则名称', dataIndex: 'name' },
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
        return this.$api.system.getRulesList(params).then(res => {
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
  mounted () {
    this.type = this.$store.state.system.type;
    this.paramType = this.$store.state.system.paramType;
    this.status = this.$store.state.system.status;
  },
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
    },
    addTr (num) {
      document.getElementById('add').setAttribute('disabled', true);
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 1 || i === 5) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 2 || i === 3 || i === 4) {
          // tdObj.style.backgroundColor = 'blue';
          // tdObj.style.textAlign = 'center';
          // tdObj.innerHTML = "<input type='checkbox' id='addValue" + i + "'/>";
          tdObj.innerHTML = "<input type='selected' value='' disabled style='width: 100%;border: none;text-align:center;background-color: white;' id='addValue" + i + "'/>";
        } else if (i === 7 || i === 2 || i === 3 || i === 4) {
          tdObj.innerHTML = "<input type='selected' value='' disabled style='width: 100%;border: none;text-align:center;background-color: white;' id='addValue" + i + "'/>";
        } else if (i === 8 || i === 9) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 8 || i === 9) {
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='radio' id='addValue" + i + "'/>";
        } else if (i === 8 || i === 9) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else {
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='radio' id='addValue" + i + "'/>";
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
    }
  }
};
</script>
