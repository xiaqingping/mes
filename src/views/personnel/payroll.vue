
<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit.prevent="handleSearch">
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
            <a-form-item label="年：">
              <a-select v-decorator="['year', {initialValue : ''}]">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="year in $store.state.pay.year"
                  :value="year.id"
                  :key="year.id"
                >{{ year.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="月：">
              <a-select v-decorator="['month', {initialValue : ''}]">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="month in $store.state.pay.month"
                  :value="month.id"
                  :key="month.id"
                >{{ month.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="4" :md="4" :sm="24">
            <a-form-item label="状态：">
              <a-select v-decorator="['status', {initialValue : ''}]">
                <a-select-option value>全部</a-select-option>
                <a-select-option
                  v-for="status in $store.state.pay.status"
                  :value="status.id"
                  :key="status.id"
                >{{ status.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>
    <a-layout>
      <a-layout-content>
        <span style="line-height:32px;">工资明细</span>
        <div class="table-operator">
          <a-button-group>
            <a-button icon="search" @click="handleSearch">查询</a-button>
            <a-button icon="plus" @click="handleAddRow">新建</a-button>
            <a-upload :multiple="true" :fileList="fileList" @change="handleChange">
              <a-button type="primary" icon="file-excel">
                <a-icon type="primary" icon="file-excel"/>上传
              </a-button>
            </a-upload>
          </a-button-group>
        </div>

        <vxe-grid
          highlight-current-row
          highlight-hover-row
          auto-resize
          height="570"
          :ref="payTable.ref"
          :loading="payTable.loading"
          :columns="payTable.columns"
          :pager-config="payTable.pagerConfig"
          :data.sync="payTable.tableData"
          :edit-rules="payTable.editRules"
          :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
          @cell-click="(options) => handleCellClick(options)"
          @page-change="pagerChange"
        ></vxe-grid>
      </a-layout-content>
    </a-layout>
    <div class="content-center" style="position: relative;height:100%;">
      <!-- <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" @click="handleAddRow">新建</a-button>
          <a-upload :multiple="true" :fileList="fileList" @change="handleChange">
            <a-button type="primary" icon="file-excel">
              <a-icon type="primary" icon="file-excel"/>上传
            </a-button>
          </a-upload>
        </a-button-group>
      </div> -->
      <!-- 表格 -->
      <!-- <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="payTable.ref"
        :loading="payTable.loading"
        :columns="payTable.columns"
        :pager-config="payTable.pagerConfig"
        :data.sync="payTable.tableData"
        :edit-rules="payTable.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        @cell-click="(options) => handleCellClick(options)"
        @page-change="pagerChange"
      ></vxe-grid>
      <div class="content-right" style="width:35%;position: absolute; left:66%; top:0">
        <h3>工资明细</h3>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  // name: 'payroll',
  components: {},
  data () {
    return {
      form: this.$form.createForm(this),
      fileList: [
        // {
        // uid: '-1',
        // name: 'xxx.png',
        // status: 'done',
        // url: 'https://588ku.com/sucai/0-default-0-0-0-0-1/?h=bd&sem=1'
        // }
      ],
      queryParam: {},
      payTable: {
        id: 0,
        ref: 'payTable',
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
    };
  },
  mounted () {
    this.setColumn();
    this.handleSearch();
    // this.$api.pay.getPay().then(res => {
    //   console.log(res);
    // });
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'payTable';
      const { formatter } = this.$utils;
      const { pay } = this.$store.state;

      const columns = [
        { width: 40, type: 'index' },
        { label: '员工编号', prop: 'employeeCode' },
        {
          label: '员工名称',
          prop: 'employeeName',
          editRender: { name: 'input' }
        },
        { label: '总额', prop: 'amount', editRender: { name: 'input' } },
        { label: '时间', prop: 'year', editRender: { name: 'input' } },
        {
          label: '状态',
          prop: 'status',
          formatter: function ({ cellValue }) {
            return formatter(pay.status, cellValue);
          }
        },
        { label: '创建人', prop: 'createName' },
        { label: '创建时间', prop: 'createDate' },
        { label: '删除人', prop: 'cancelName' },
        { label: '删除时间', prop: 'cancelDate' },
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
                  <a onClick={() => this.handleSave(options)}>保存</a>,
                  <a onClick={() => this.handleQuitEdit(options)}>退出</a>
                ];
              }

              return [
                <span
                  class="table-actions"
                  onClick={event => event.stopPropagation()}
                >
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
        name: [{ required: true, message: '名称不能为空' }],
        alias: [{ required: true, message: '类型不能为空' }]
      };

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch () {
      const tableName = 'payTable';
      this[tableName].loading = true;
      const { currentPage, pageSize } = this[tableName].pagerConfig;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign(
        { page: currentPage, rows: pageSize },
        queryParam
      );

      this.$api.pay
        .getPay(params, true)
        .then(data => {
          this[tableName].tableData = data.rows;
          this[tableName].pagerConfig.total = data.total;
          this[tableName].pagerConfig.currentPage = params.page;
          this[tableName].pagerConfig.pageSize = params.rows;

          this[tableName].editIndex = -1;
        })
        .finally(() => {
          this[tableName].loading = false;
        });
    },
    // 新增
    handleAddRow () {
      const tableName = 'payTable';
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
      this.$api.pay.deletepays(row.id).then(() => {
        this.handleSearch();
      });
    },
    // 保存
    handleSave ({ row, rowIndex, tableName, xTable }) {
      xTable
        .validate(row)
        .then(() => {
          if (row.status) {
            // 修改（暂时没有修改功能）
          } else {
            // 新增
            this.$api.pay.increasepay(row).then(() => {
              this.handleSearch();
            });
          }
        })
        .catch(() => {
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
          this.$set(
            this[tableName].tableData,
            rowIndex,
            this[tableName].editData
          );
          this[tableName].editData = null;
        }
      });
    },
    // 分页改变时
    pagerChange ({ pageSize, currentPage }) {
      const tableName = 'payTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, {
        pageSize,
        currentPage
      });
      this.handleSearch();
    },
    // 点击表格行时
    handleCellClick ({ row }) {
      const tableName = 'payTable';
      if (!row.id || row.id < 0) {
        this[tableName].tableData = [];
        return;
      }

      this[tableName].loading = true;
      this.$api.pay
        .getPay(row.id)
        .then(res => {
          this[tableName].tableData = res;
        })
        .finally(() => {
          this[tableName].loading = false;
        });
    },
    // 上传excel
    handleChange () {
      // let fileList = [...info.fileList];
      // // 1.限制上传文件的数量，只显示最近上传的两个文件，旧文件将被新文件替换
      // fileList = fileList.slice(-2);
      // // 2. 读取响应并显示文件链接
      // fileList = fileList.map((file) => {
      //   if (file.response) {
      //     // 组件将显示文件。url链接
      //     file.url = file.response.url;
      //     console.log('这是url的' + file.response.url);
      //   }
      //   return file;
      // });
      // this.fileList = fileList;
      const data = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      this.$api.pay
        .uploadpays(data, config)
        .then(res => {
          console.log('这是' + data);
          // return this.$refs.table.refresh(true);
        })
        .then(res => {
          // this.fileList.status = 'success';
          console.log('成功了');
        })
        .catch(res => {
          // this.fileList.status = 'fail';
          console.log('失败了');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
