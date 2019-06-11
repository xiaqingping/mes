
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
              <a-select v-decorator="['type', {initialValue : '0'}]">
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
      <a-button type="primary" icon="plus" @click="handleIncrease(10)" id="add">新增</a-button>
      <a-button type="primary" icon="delete" @click="handleDelete">作废</a-button>
      <a-button type="primary" icon="edit" @click="handleEdit">保存</a-button>
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
      type: [],
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  mounted () {
    this.$api.pay.getTypepay().then(res => {
      this.type = res;
      console.log(res);
    });
  },
  methods: {
    // 查询
    handleSearch (e) {
      e.preventDefault();
      this.queryParam = this.form.getFieldsValue();
      this.$refs.table.refresh(true);
    },
    // 新增
    handleIncrease (num) {
      // console.log(1);
      document.getElementById('add').setAttribute('disabled', true);
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.backgroundColor = 'white';
        if (i === 0) {
          tdObj.style.backgroundColor = 'white';
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='radio' id='addValue" + i + "'/>";
          // tdObj.innerHTML = "'<span class='ant-table-row-indent indent-level-0 style='padding-left:0px;'/><span <label class='ant-radio-wrapper'/>";
          // tdObj.innerHTML = "<input type='radio' class='ant-radio-input'/>";
        } else if (i === 1 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9) {
          tdObj.style.backgroundColor = 'white';
        } else if (i === 2) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 4) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 3) {
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'> '<option> 工资项目 </option>' '<option> 扣款项目 </option>' '<option> 代发项目 </option>' '<option> 代缴项目 </option>'</select>";
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
      this.$nextTick(() => {
        document.getElementById('addValue').focus();
      });
    },
    // 删除
    handleDelete () {
      if (!document.getElementById('addValue')) {
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
      } else {
        this.utils.refresh();
      }
    },
    // 保存
    handleEdit () {
      // console.log(2);
      var addVal = document.getElementById('addValue').value;
      // var addVal3 = document.getElementById('addValue3').option.value;
      var addVal4 = document.getElementById('addValue4').value;
      if (addVal === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      this.$api.pay.increaseTypepay({ 'name': addVal, 'serial': addVal4 }).then(res => {
        // 'type': addVal3,
        if (res.id) {
          this.utils.refresh();
          console.log(1);
          return this.$refs.table.refresh(true);
        }
      });
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    }

  }
};
</script>
<style lang="scss" scoped></style>
