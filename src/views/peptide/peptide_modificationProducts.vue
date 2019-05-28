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
          <!--          <div v-show="advanced">-->

          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue : '1'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">已删除</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          </div>-->

        </a-row>
        <a-button type="primary" icon="search" html-type="submit" style="display:none;">查询</a-button>
      </a-form>
    </div>

    <div>
      <div class="table-operator">
        <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
        <a-button type="primary" icon="plus">新增</a-button>
        <a-button type="primary" icon="edit">保存</a-button>
        <a-button type="primary" icon="minus-square" @click="handleDelete">删除</a-button>
        <a-button type="primary" icon="minus-square" @click="handleResume">恢复</a-button>
      </div>

      <s-table
        ref="table"
        bordered
        size="small"
        :scroll="{ x: 1800 }"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio'}"
      >
      </s-table>
    </div>

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
    var self = this;
    return {
      form: this.$form.createForm(this),
      visible: false,
      // advanced: true,
      columns: [
        { title: '编号', dataIndex: 'code' },
        { title: '修饰名称', dataIndex: 'modificationName' },
        {
          title: '修饰位置',
          dataIndex: 'modificationPosition',
          customRender: function (value) {
            for (var i = 0; i < self.$store.state.peptide.modificationPosition.length; i++) {
              if (self.$store.state.peptide.modificationPosition[i].id === value) return self.$store.state.peptide.modificationPosition[i].name;
            }
          }
        },
        { title: '氨基酸', dataIndex: 'aminoAcidName' },
        { title: '氨基酸类型', dataIndex: 'aminoAcidType' },
        { title: '提供总量从', dataIndex: 'providerTotalAmountBegin' },
        { title: '提供总量至', dataIndex: 'providerTotalAmountEnd' },
        { title: '长度从', dataIndex: 'aminoAcidLengthBegin' },
        { title: '长度至', dataIndex: 'aminoAcidLengthEnd' },
        { title: '是否脱盐',
          dataIndex: 'isNeedDesalting',
          align: 'center',
          customRender: function (value) {
            if (value === 1) return '√';
          }
        },
        { title: '产品编号', dataIndex: 'sapProductCode' },
        { title: '产品名称', dataIndex: 'sapProductName' },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: function (text) {
            if (text === 1) {
              return '正常';
            } else if (text === 2) {
              return '已删除';
            }
          }
        },
        { title: '创建人', dataIndex: 'creatorName' },
        { title: '创建日期', dataIndex: 'createDate' },
        { title: '删除人', dataIndex: 'cancelName' },
        { title: '删除时间', dataIndex: 'cancelDate' }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getModificationProducts(params).then(res => {
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
  },
  methods: {
    showDrawer () {
      this.visible = true;
    },
    onClose () {
      this.visible = false;
    },
    handleSearch () {
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    handleDelete () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.deleteModificationProducts(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
    },
    handleResume () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumeModificationProducts(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
