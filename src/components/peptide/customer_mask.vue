<template>
  <div v-if="hackReset" class="mask">
    <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '750px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">客户列表</span>
        <span class="top-icon" style="padding-bottom: 10px" @click="onClose"><a-icon
          type="close"/></span>
        <span class="top-icon" @click="onSmall" v-show="small"><a-icon
          type="plus-square"/></span>
        <span class="top-icon" @click="onSmall" v-show="!small"><a-icon
          type="minus-square"/></span>
      </div>
      <div class="middle-search" style="margin: 0 3%">
        <a-form layout="inline" :form="form" @submit="handleSearch">
          <div>
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title="" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="名称">
              <a-input v-decorator="['customerName']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="电话">
              <a-input v-decorator="['charge_person']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="手机">
              <a-input v-decorator="['order']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-decorator="['saler']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="大区">
              <a-select v-decorator="['currency_type']" style="width: 190px;">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="网点">
              <a-select v-decorator="['commercial_network']" style="width: 190px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="付款方式">
              <a-select v-decorator="['sales_region']" style="width: 163px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="付款条件">
              <a-select v-decorator="['sales_organization']" style="width: 160px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="销售范围">
              <a-select v-decorator="['distribution_channel']" style="width: 165px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="销售员编号">
              <a-input v-decorator="['saler']" style="width: 148px"/>
            </a-form-item>

            <a-form-item label="销售员名称">
              <a-input v-decorator="['saler']" style="width: 148px"/>
            </a-form-item>
          </div>
          <div style="margin-bottom:10px">
            <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
          </div>
        </a-form>

      </div>
      <vxe-grid
        highlight-hover-row
        auto-resize
        :ref="customerMask.ref"
        :columns="customerMask.columns"
        :data.sync="customerMask.tableData"
        :loading="customerMask.loading"
        :edit-rules="customerMask.editRules"
        :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
        :pager-config="customerMask.pagerConfig"
        @page-change="pagerChange">
        >
      </vxe-grid>
    </div>
  </div>

</template>

<script>
const tableName = 'customerMask';

export default {
  name: 'CustomerMask',
  data () {
    return {
      form: this.$form.createForm(this),
      customerMask: {
        id: 0,
        ref: 'customerMask',
        xTable: null,
        editIndex: -1,
        loading: false,
        tableData: [],
        columns: [],
        pagerConfig: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      small: true,
      customer_name_top: 0,
      customer_name_left: 0,
      rangeOrganization: [],
      rangeChannel: [],
      hackReset: true,
      status: false,
      data: false,
      queryParam: {}
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    if (width > 1000) {
      this.customer_name_left = (width - 1100) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 750) / 2;
    }
  },
  watch: {
    status: function () {
      if (this.status) {
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
        this.status = false;
        this.small = true;
        this.data = false;
      }
    }
  },
  methods: {
    setColumns () {
      // const { formatter } = this.$units;
      // const { peptide } = this.$store.state;
      // this.status = peptide.status;
      const columns = [
        { type: 'index', width: 40 },
        { label: '编号', prop: 'code' },
        { label: '公司', prop: 'name' },
        { label: '电话', prop: 'telNo' },
        { label: '手机', prop: 'mobNo' },
        { label: '邮箱', prop: 'email' },
        { label: '分类', prop: 'type' },
        { label: '大区', prop: 'regionCode' },
        { label: '网点', prop: 'officeCode' },
        { label: '币种', prop: 'currency' },
        { label: '付款方式', prop: 'payMethodCode' },
        { label: '付款条件', prop: 'payTermsCode' },
        { label: '销售员名称', prop: 'salerName' },
        { label: '销售冻结(当前渠道)', prop: 'customerRangeFrozen' },
        { label: '销售冻结(所有渠道)', prop: 'customerFrozen' },
        { label: '客户性质', prop: 'industryText' },
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

              if (!isEdit) {
                if (row.status === 1) {
                  actions = [
                    <a onClick={() => this.handleDelete(options)}>删除</a>
                  ];
                } else {
                  actions = [
                    <a onClick={() => this.handleResume(options)}>恢复</a>
                  ];
                }
              }
              if (isEdit) {
                actions = [
                  <a onClick={() => this.handleSave(options) }>保存</a>,
                  <a onClick={() => this.handleExit(options) }>退出</a>
                ];
              }
              return [
                <span class="table-actions">
                  {actions}
                </span>
              ];
            }
          }
        }
      ];
      columns.forEach(function (e) {
        if (!e.width) e.width = 130;
      });

      this[tableName].columns = columns;

      this[tableName].xTable = this.$refs[this[tableName].ref].$refs.xTable;
    },
    onClose () {
      this.$emit('Closed');
      this.status = true;
    },
    handleSearch (e) {
      if (e) e.preventDefault();
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();

      queryParam.createDateBegin = this.createDateBegin;
      queryParam.createDateEnd = this.createDateEnd;
      const params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, queryParam);
      this.$api.peptide.getOrder(params).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;

        this[tableName].editIndex = -1;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    pagerChange ({ pageSize, currentPage }) {
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, { pageSize, currentPage });
      this.handleSearch();
    },
    onSmall () {
      this.small = !this.small;
    },
    onChange (dates, dateStrings) {
      this.createDateBegin = dateStrings[0];
      this.createDateEnd = dateStrings[1];
    }
  }
};
</script>

<style lang="scss" scoped>
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1;
    overflow: hidden;
  }

  .customer-name-mask {
    background: white;
    box-shadow: 2px 2px 4px gray;

    .top {
      height: 40px;
      line-height: 40px;
      margin: 0 2%;
      color: gray;

      .top-icon {
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
        float: right;
      }

      .top-icon:hover {
        color: black;
      }
    }

    .middle-search {
      .ant-row {
        margin-left: 5px;
      }
    }
  }
</style>
