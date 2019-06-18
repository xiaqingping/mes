<template>
  <div class="page-content">

    <div class="table-search">
      <a-form layout="inline" :form="form" @submit="handleSearch">
        <a-row :gutter="24">
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-decorator="['code']" title=""/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="修饰类型 ">
              <a-input v-decorator="['modificationType']"/>
            </a-form-item>
          </a-col>
          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="状态">
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

    <div>
      <div class="table-operator">
        <a-button-group>
          <a-button icon="search" @click="handleSearch">查询</a-button>
          <a-button icon="plus" @click="handleAdd">新增</a-button>
        </a-button-group>
      </div>

      <a-table
        ref="table"
        bordered
        size="small"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="change"
      >
        <template slot="modificationType" slot-scope="value, row, index">
          <div
            :key="value">
            <a-input
              size="small"
              v-if="editIndex === index"
              style="width:200px;"
              :class="[modificationType ? '' : 'isValue']"
              v-model="modificationType"
            />
            <template v-else>{{ value }}</template>
          </div>
        </template>

        <template slot="actions" slot-scope="value, row, index">
          <div :key="value">
            <template v-if="row.status === 1 && editIndex !== index">
              <a @click="handleDelete(row.id)">删除 </a>
            </template>
            <template v-if="row.status === 2 && editIndex !== index">
              <a @click="handleResume(row.id)">恢复</a>
            </template>
            <template v-if="editIndex === index">
              <a @click="handleSave(row)">保存 </a>
              <a @click="handleExit()">退出 </a>
            </template>
          </div>
        </template>
      </a-table>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PeptideModificationsType',
  data () {
    return {
      status: {},
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true
      },
      columns: [],
      loading: false,
      dataSource: [],
      id: 0,
      editIndex: -1,
      modificationType: ''
    };
  },
  mounted () {
    this.setColumns();
    this.handleSearch();
  },
  methods: {
    setColumns () {
      const self = this;
      const { formatter } = this.$units;
      const { peptide } = this.$store.state;
      this.status = peptide.status;
      this.columns = [
        { title: '编号', dataIndex: 'code' },
        { title: '修饰类型', dataIndex: 'modificationType', scopedSlots: { customRender: 'modificationType' } },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text) => {
            return formatter(self.status, text);
          }
        },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '创建日期', dataIndex: 'createDate' },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' },
        { title: '操作', width: 80, dataIndex: 'actions', fixed: 'right', scopedSlots: { customRender: 'actions' }, align: 'center' }
      ];
    },
    change (pagination) {
      const params = {
        page: pagination.current,
        rows: pagination.pageSize
      };
      this.handleSearch(params);
    },
    handleSearch (params = {}) {
      this.loading = true;
      this.editIndex = -1;

      const queryParam = this.form.getFieldsValue();
      params = Object.assign({ page: this.pagination.current, rows: this.pagination.pageSize }, params, queryParam);

      this.$api.peptide.getModificationTypes(params).then((data) => {
        this.dataSource = data.rows;
        this.pagination.total = data.total;
        this.pagination.current = params.page;
        this.pagination.pageSize = params.rows;
      }).finally(() => {
        this.loading = false;
      });
    },
    handleAdd () {
      if (this.editIndex === 0) {
        return false;
      }
      var addVal = {
        id: this.id,
        modificationType: ''
      };
      this.dataSource = [ addVal, ...this.dataSource ];
      this.editIndex = 0;
    },
    handleSave (r) {
      if (this.modificationType === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      var data = {};
      if (r.id) {
        data = r;
      }
      data.modificationType = this.modificationType;
      this.$api.peptide.insertModificationTypes(data).then(res => {
        if (res.id) {
          this.handleExit();
        }
      });
    },
    handleDelete (i) {
      if (i) {
        this.$api.peptide.deleteModificationTypes(i).then(res => {
          this.handleSearch();
        });
      }
    },
    handleExit () {
      this.modificationType = '';
      this.handleSearch();
    },
    handleResume (i) {
      if (!i) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeModificationTypes(i).then(res => {
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
