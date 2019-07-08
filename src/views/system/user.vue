<template>
  <div class="page-content">
    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-decorator="['code']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-decorator="['name']"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="角色">
                <a-select v-decorator="['roleID']">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in roles" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="大区">
                <a-select v-decorator="['regionCode']">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in regions" :key="item.id" :value="item.id">
                    {{ item.id }} - {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="网点">
                <a-select v-decorator="['officeCode']">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in offices" :key="item.id" :value="item.id">
                    {{ item.id }} - {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="员工">
                <a-input-search v-decorator="['employeeCode']" />
              </a-form-item>
            </a-col>
            <a-col :xxl="4" :xl="6" :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-decorator="['isdel']">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in isdel" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xxl="8" :xl="12" :md="16" :sm="24">
              <a-form-item label="登陆时间">
                <a-range-picker
                  :ranges="{ 今天: [moment(), moment()], '本月': [moment(), moment().endOf('month')] }"
                  :placeholder="['开始日期', '结束日期']"
                  format="YYYY-MM-DD">
                </a-range-picker>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="plus">新建</a-button>
      </a-button-group>
      <a @click="toggleAdvanced" style="margin-left: 8px">
        {{ advanced ? '收起' : '展开' }}
        <a-icon :type="advanced ? 'up' : 'down'"/>
      </a>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="userTable.ref"
      :loading="userTable.loading"
      :columns="userTable.columns"
      :pager-config="userTable.pagerConfig"
      :data.sync="userTable.tableData"
      :edit-rules="userTable.editRules"
      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @cell-click="(options) => handleCellClick(options)"
      @page-change="pagerChange">
    </vxe-grid>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'SystemUser',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      advanced: true,
      roles: [],
      regions: [],
      offices: [],
      isdel: [],
      queryParam: {},

      userTable: {
        id: 0,
        ref: 'userTable',
        xTable: null,
        editIndex: -1,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        editRules: {
          loginCode: [
            { required: true, message: '编号必填' }
          ]
        }
      }
    };
  },
  mounted () {
    this.setColumn();
    this.handleSearch();

    this.roles = this.$store.state.system.roles;
    this.regions = this.$store.state.system.regions;
    this.offices = this.$store.state.system.offices;
    this.isdel = this.$store.state.system.isdel;
  },
  methods: {
    moment,
    // 设置表格列属性
    setColumn () {
      const tableName = 'userTable';
      const { formatter } = this.$utils;
      const { system } = this.$store.state;

      const columns = [
        { type: 'index', width: 40 },
        { label: '员工', prop: 'employeeCode' },
        { label: '编号', prop: 'loginCode' },
        { label: '姓名', prop: 'name' },
        { label: '角色', prop: 'roleID', formatter: function ({ cellValue }) { return formatter(system.roles, cellValue); } },
        {
          label: '大区',
          prop: 'regionCode',
          formatter: function ({ cellValue }) {
            const offices = formatter(system.regions, cellValue);
            if (offices) {
              return cellValue + '  -  ' + offices;
            }
          }
        },
        {
          label: '网点',
          prop: 'officeCode',
          formatter: function ({ cellValue }) {
            const offices = formatter(system.offices, cellValue);
            if (offices) {
              return cellValue + '  -  ' + offices;
            }
          }
        },
        { label: '客户', prop: 'customerCode' },
        {
          label: '测序点',
          prop: 'cxPointId',
          formatter: function ({ cellValue }) {
            const offices = formatter(system.cxPointId, cellValue);
            if (cellValue === 0 || cellValue === undefined) return '';
            if (offices === cellValue) return cellValue;
            if (offices) return cellValue + '  -  ' + offices;
          }
        },
        { label: '仓库', prop: 'storageCode' },
        {
          label: '状态',
          prop: 'isdel',
          formatter: function ({ cellValue }) {
            if (cellValue === 0) {
              cellValue = '0';
            }
            return formatter(system.isdel, cellValue);
          }
        },
        { label: '登录时间', prop: 'loginDate' },
        { label: '创建时间', prop: 'createDate' },
        { label: 'ID', prop: 'code' },
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

              if (!isEdit && row.isdel === 0) {
                actions = [
                  <a onClick={() => this.handleUpdate(options)}>修改</a>,
                  <a onClick={() => this.handleCancel(options)}>重置密码</a>
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

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    // 查询
    handleSearch (e) {
      if (e) e.preventDefault();
      const tableName = 'userTable';
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);

      this.$api.user.getUserList(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 分页改变时
    pagerChange (change) {
      const tableName = 'userTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, change);
      this.handleSearch();
    },
    // 搜索收起
    toggleAdvanced () {
      this.advanced = !this.advanced;
    },
    // 删除
    handleCancel ({ row }) {
      alert(row);
      // this.$api.series.cancelSeries(row.id).then(() => {
      //   this.handleSearch();
      // });
    },
    // 退出编辑
    handleQuitEdit ({ row, rowIndex, tableName, xTable }) {
      xTable.clearActived();
      if (!row.status) {
        this[tableName].tableData.splice(rowIndex, 1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
