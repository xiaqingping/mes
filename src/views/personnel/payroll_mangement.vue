
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
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button icon="plus" type="primary" @click="handleAddRow">新建</a-button>
      </a-button-group>
    </div>

    <!-- <div class="table-operator">
      <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
      <a-button type="primary" icon="plus" @click="handleIncrease(10)" id="add">新增</a-button>
      <a-button type="primary" icon="delete" @click="handleDelete">作废</a-button>
      <a-button type="primary" icon="edit" @click="handleEdit">保存</a-button>
    </div> -->
    <!-- 表格 -->
    <!-- <s-table
      ref="table"
      bordered
      size="small"
      :columns="columns"
      :data="loadData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
    >
    </s-table> -->
    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="seqtypeTable.ref"
      :loading="seqtypeTable.loading"
      :columns="seqtypeTable.columns"
      :pager-config="seqtypeTable.pagerConfig"
      :data.sync="seqtypeTable.tableData"
      :edit-rules="seqtypeTable.editRules"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @page-change="pagerChange">
    </vxe-grid>
  </div>
</template>

<script>

export default {
  name: 'SeqSampleOrder',
  components: {},
  data () {
    return {
      form: this.$form.createForm(this),
      // columns: [
      //   { title: '编号', dataIndex: 'code' },
      //   { title: '名称', dataIndex: 'name' },
      //   { title: '类型', dataIndex: 'type', customRender: function (text) { if (text === 1) return '工资项目'; else if (text === 2) return '扣款项目'; else if (text === 3) return '代发项目'; else if (text === 4) return '代缴项目'; } },
      //   { title: '排序', dataIndex: 'serial' },
      //   { title: '状态', dataIndex: 'status', customRender: function (text) { if (text === 1) return '正常'; else if (text === 2) return '已删除'; } },
      //   { title: '创建人', dataIndex: 'createName' },
      //   { title: '创建时间', dataIndex: 'createDate' },
      //   { title: '修改人', dataIndex: 'updateName' },
      //   { title: '修改时间', dataIndex: 'updateDate' }
      // ],
      queryParam: {},
      type: [],
      seqtypeTable: {
        id: 0,
        ref: 'seqtypeTable',
        xTable: null,
        editIndex: -1,
        editData: null,
        loading: false,
        tableData: [],
        columns: [],
        editRules: {},
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
      // loadData: parameter => {
      //   const params = Object.assign(parameter, this.queryParam);
      //   return this.$api.pay.getTypepay(params).then(res => {
      //     return {
      //       data: res.rows,
      //       page: params.page,
      //       total: res.total
      //     };
      //   });
      // },
      // selectedRowKeys: [],
      // selectedRows: []
    };
  },
  mounted () {
    this.$api.pay.getTypepay().then(res => {
      this.type = res;
      console.log(res);
    });
    this.setColumn();
    this.handleSearch();
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'seqtypeTable';
      const { formatter } = this.$utils;
      const { basic } = this.$store.state;

      const columns = [
        { width: 40, type: 'index' },
        { label: '编号', prop: 'code' },
        { label: '名称', prop: 'name', editRender: { name: 'input' } },
        { label: '类型', prop: 'type', editRender: { name: 'input' } },
        { label: '排序', prop: 'serial', editRender: { name: 'input' } },
        { label: '状态', prop: 'status', formatter: function ({ cellValue }) { return formatter(basic.status, cellValue); } },
        { label: '创建人', prop: 'createName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '修改人', prop: 'updateName' },
        { label: '修改时间', prop: 'updateDate' },
        {
          label: '操作',
          prop: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              const xTable = this[tableName].xTable;
              const isEdit = xTable.hasActiveRow(row);
              const options = { row, rowIndex, tableName, xTable };

              if (!isEdit && row.status === 1) {
                actions = [
                  <a onClick={() => this.handleCancel(options)}>删除</a>
                ];
              }
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleQuitEdit(options) }>退出</a>
                ];
              }

              return [
                <span class="table-actions" onClick={(event) => event.stopPropagation()}>
                  {actions}
                </span>
              ];
            }
          }
        }
      ];

      columns.forEach(function (e) {
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;

      this[tableName].editRules = {
        name: [
          { required: true, message: '名称不能为空' }
        ],
        alias: [
          { required: true, message: '类型不能为空' }
        ]
      };

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'seqtypeTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: currentPage, rows: pageSize }, queryParam);

      this.$api.pay.getTypepay(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 新增
    handleAddRow () {
      const tableName = 'seqtypeTable';
      if (this[tableName].editIndex !== -1) return this.$message.warning('请保存或退出正在编辑的行');

      const table = this[tableName].xTable;
      const newData = {
        id: --this[tableName].id
      };

      this[tableName].tableData = [newData, ...this[tableName].tableData];
      table.setActiveRow(newData);
      this[tableName].editIndex = 0;
    },
    // 删除
    handleCancel ({ row }) {
      this.$api.pay.deleteTypepays(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row, rowIndex, tableName, xTable }) {
      xTable.validate(row).then(() => {
        if (row.status) {
        // 修改（暂时没有修改功能）
        } else {
        // 新增
          this.$api.pay.increaseTypepay(row).then(() => {
            this.handleSearch();
          });
        }
      }).catch(() => {
        this.$message.warning('表格验证未通过');
      });
    },
    // 退出编辑
    handleQuitEdit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived().then(() => {
        this[tableName].editIndex = -1;
        if (!row.status) {
          this[tableName].tableData.splice(rowIndex, 1);
        } else {
          this.$set(this[tableName].tableData, rowIndex, this[tableName].editData);
          this[tableName].editData = null;
        }
      });
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'seqtypeTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    }
    // 新增
    // handleIncrease (num) {
    //   // console.log(1);
    //   document.getElementById('add').setAttribute('disabled', true);
    //   var tbodyObj = document.getElementsByTagName('tbody')[0];
    //   var trObj = document.createElement('tr');
    //   for (let i = 0; i < num; i++) {
    //     var tdObj = document.createElement('td');
    //     tdObj.style.backgroundColor = 'white';
    //     if (i === 0) {
    //       tdObj.style.backgroundColor = 'white';
    //       tdObj.style.textAlign = 'center';
    //       tdObj.innerHTML = "<input type='radio' id='addValue" + i + "'/>";
    //     } else if (i === 1 || i === 5 || i === 6 || i === 7 || i === 8 || i === 9) {
    //       tdObj.style.backgroundColor = 'white';
    //     } else if (i === 2) {
    //       tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
    //     } else if (i === 4) {
    //       tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
    //     } else if (i === 3) {
    //       // var expData = '';
    //       // for (let j = 0; j < this.type.length; j++) {
    //       //   expData += '<option>' + this.type[j].status + '</option>';
    //       // }
    //       // tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;background-color: #FFF3F3;'>" + expData +
    //       // '</select>';
    //       tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'> '<option> 工资项目 </option>' '<option> 扣款项目 </option>' '<option> 代发项目 </option>' '<option> 代缴项目 </option>'</select>";
    //     }
    //     trObj.appendChild(tdObj);
    //   }
    //   tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
    //   this.$nextTick(() => {
    //     document.getElementById('addValue').focus();
    //   });
    // },
    // 删除
    // handleDelete () {
    //   if (!document.getElementById('addValue')) {
    //     if (this.selectedRowKeys[0] == null) {
    //       this.$notification.error({
    //         message: '错误',
    //         description: `请选择一条数据`
    //       });
    //       return false;
    //     }
    //     this.$api.pay.deleteTypepays(this.selectedRowKeys[0]).then(res => {
    //       this.selectedRowKeys = [];
    //       return this.$refs.table.refresh(true);
    //     });
    //   } else {
    //     this.utils.refresh();
    //   }
    // },
    // 保存
    // handleEdit () {
    //   // console.log(2);
    //   var addVal = document.getElementById('addValue').value;
    //   var addVal3 = document.getElementById('addValue3').option;
    //   var addVal4 = document.getElementById('addValue4').value;
    //   if (addVal === '') {
    //     this.$notification.error({
    //       message: '错误',
    //       description: `数据不能为空！`
    //     });
    //     return false;
    //   }
    //   this.$api.pay.increaseTypepay({ 'name': addVal, 'type': addVal3, 'serial': addVal4 }).then(res => {
    //     console.log('这是' + name.addVal);
    //     if (res.id) {
    //       this.utils.refresh();
    //       return this.$refs.table.refresh(true);
    //     }
    //     return this.$refs.table.refresh(true);
    //   });
    // },
    // onSelectChange (selectedRowKeys, selectedRows) {
    //   this.selectedRowKeys = selectedRowKeys;
    //   this.selectedRows = selectedRows;
    // }

  }
};
</script>
<style lang="scss" scoped></style>
