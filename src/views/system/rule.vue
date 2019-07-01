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
      <a-button-group>
        <a-button icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="plus" @click="addTr(11)" id="add">新建</a-button>
        <!-- <a-button type="primary" icon="delete" @click="addData">删除</a-button> -->
        <!-- <a-button type="primary" icon="save">保存</a-button> -->
      </a-button-group>
      <a @click="toggleAdvanced" style="margin-left: 8px">
        {{ advanced ? '收起' : '展开' }}
        <a-icon :type="advanced ? 'up' : 'down'"/>
      </a>
    </div>

    <vxe-grid
      highlight-hover-row
      auto-resize
      :ref="carrierTable.ref"
      :loading="carrierTable.loading"
      :columns="carrierTable.columns"
      :pager-config="carrierTable.pagerConfig"
      :data.sync="carrierTable.tableData"

      :edit-config="{key: 'id', trigger: 'manual', mode: 'row', showIcon: false, autoClear: false}"
      @current-page-change="(currentPage) => pagerChange({type: 'currentPage', value: currentPage})"
      @page-size-change="(pageSize) => pagerChange({type: 'pageSize', value: pageSize})"
    >
    </vxe-grid>

  </div>
</template>

<script>
export default {
  name: 'SystemUser',
  components: {
  },
  data () {
    return {
      form: this.$form.createForm(this),
      advanced: true,
      type: [],
      paramType: [],
      status: [],

      carrierTable: {
        ref: 'carrierTable',
        loading: false,
        data: [],
        columns: [],
        // editRules: {},
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
    // this.setEditRules();
    this.handleSearch();

    this.type = this.$store.state.system.type;
    this.paramType = this.$store.state.system.paramType;
    this.status = this.$store.state.system.status;
  },
  methods: {
    // 设置表格列属性
    setColumn () {
      const tableName = 'carrierTable';
      const columns = [
        { width: 40, type: 'index' },
        { label: '规则名称', prop: 'name' },
        { label: 'Client', prop: 'sourceClient' },
        { label: 'Type', prop: 'sourceType' },
        { label: '资源', prop: 'sourcePath' },
        { label: '资源描述', prop: 'sourceDesc' },
        {
          label: '参数类型',
          prop: 'paramType',
          formatter: function ({ cellValue }) {
            if (cellValue === 1) {
              return '参数';
            } else if (cellValue === 2) {
              return '属性';
            } else if (cellValue === 3) {
              return '接口';
            }
          }
        },
        { label: '参数', prop: 'parameterField' },
        { label: '参数描述', prop: 'parameterDesc' },
        { label: 'OP', prop: 'op' },
        { label: '值', prop: 'value' },
        {
          label: '状态',
          prop: 'status',
          formatter: function ({ cellValue }) {
            if (cellValue === 0) {
              return '有效';
            } else if (cellValue === 1) {
              return '无效';
            }
          }
        },
        {
          label: '操作',
          prop: 'actions',
          fixed: 'right',
          slots: {
            default: ({ row, rowIndex }) => {
              let actions = [];
              if (row.status === 0 && this.editIndex !== rowIndex) {
                actions = [
                  <a onClick={() => this.handleCancel(row.id)}>删除</a>,
                  <a onClick={() => this.handleUpdate(row, rowIndex)}>修改</a>
                ];
              }
              if (this.editIndex === rowIndex) {
                actions = [
                  <a>保存</a>,
                  <a onClick={() => this.handleQuitEdit(row, rowIndex)}>退出</a>
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
        if (!e.width) e.width = 100;
      });

      this[tableName].columns = columns;
    },
    // 查询
    handleSearch (params = {}) {
      const tableName = 'carrierTable';
      this[tableName].loading = true;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this[tableName].pagerConfig.currentPage, rows: this[tableName].pagerConfig.pageSize }, params, queryParam);

      this.$api.system.getRulesList(params, true).then((data) => {
        this[tableName].tableData = data.rows;
        this[tableName].pagerConfig.total = data.total;
        this[tableName].pagerConfig.currentPage = params.page;
        this[tableName].pagerConfig.pageSize = params.rows;
      }).finally(() => {
        this[tableName].loading = false;
      });
    },
    // 分页改变时
    pagerChange (change) {
      const tableName = 'carrierTable';
      this[tableName].pagerConfig = Object.assign(this[tableName].pagerConfig, change);
      this.handleSearch();
    },
    // 搜索收起
    toggleAdvanced () {
      this.advanced = !this.advanced;
    }
    // addTr (num) {
    //   document.getElementById('add').setAttribute('disabled', true);
    //   var tbodyObj = document.getElementsByTagName('tbody')[0];
    //   var trObj = document.createElement('tr');
    //   for (let i = 0; i < num; i++) {
    //     var tdObj = document.createElement('td');
    //     tdObj.style.padding = '0';
    //     if (i === 1 || i === 5) {
    //       tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
    //     } else if (i === 2 || i === 3 || i === 4) {
    //       // tdObj.style.backgroundColor = 'blue';
    //       // tdObj.style.textAlign = 'center';
    //       // tdObj.innerHTML = "<input type='checkbox' id='addValue" + i + "'/>";
    //       tdObj.innerHTML = "<input type='selected' value='' disabled style='width: 100%;border: none;text-align:center;background-color: white;' id='addValue" + i + "'/>";
    //     } else if (i === 7 || i === 2 || i === 3 || i === 4) {
    //       tdObj.innerHTML = "<input type='selected' value='' disabled style='width: 100%;border: none;text-align:center;background-color: white;' id='addValue" + i + "'/>";
    //     } else if (i === 8 || i === 9) {
    //       tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
    //     } else if (i === 8 || i === 9) {
    //       tdObj.style.textAlign = 'center';
    //       tdObj.innerHTML = "<input type='radio' id='addValue" + i + "'/>";
    //     } else if (i === 8 || i === 9) {
    //       tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 50%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
    //     } else {
    //       tdObj.style.textAlign = 'center';
    //       tdObj.innerHTML = "<input type='radio' id='addValue" + i + "'/>";
    //     }
    //     trObj.appendChild(tdObj);
    //   }
    //   tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
    // }
  }
};
</script>
