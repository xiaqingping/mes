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
            <a-form-item label="纯度">
              <a-select v-decorator="['purityID', {initialValue : '0'}]">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option v-for="item in purity" :key="item.id" :value="item.id">{{ item.purity}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xxl="4" :xl="6" :md="8" :sm="24">
            <a-form-item label="类型">
              <a-select v-decorator="['aminoAcidType', {initialValue : ''}]">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="L">L</a-select-option>
                <a-select-option value="D">D</a-select-option>
              </a-select>
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
        <!--        <a @click="toggleAdvanced" style="margin-left: 8px">-->
        <!--          {{ advanced ? '收起' : '展开' }}-->
        <!--          <a-icon :type="advanced ? 'up' : 'down'"/>-->
        <!--        </a>-->
      </div>

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

    <!--    <div>-->
    <!--      <div type="primary" @click="showDrawer">-->
    <!--        <div style="width: 20px;height: 100%;background-color: black">-->
    <!--          12312312312-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <a-drawer-->
    <!--        title="Basic Drawer"-->
    <!--        placement="right"-->
    <!--        :closable="false"-->
    <!--        @close="onClose"-->
    <!--        :visible="visible"-->
    <!--      >-->
    <!--        <p>Some contents...</p>-->
    <!--        <p>Some contents...</p>-->
    <!--        <p>Some contents...</p>-->
    <!--      </a-drawer>-->
    <!--    </div>-->

  </div>
</template>

<script>
  import STable from '@/components/Table';
  import peptide from '@/cache/index'

  export default {
    name: 'SeqSampleOrder',
    components: {
      STable
    },
    data() {
      return {
        form: this.$form.createForm(this),
        visible: false,
        // advanced: true,
        columns: [
          {title: '编号', dataIndex: 'code'},
          {title: '提供总量从', dataIndex: 'providerTotalAmountBegin'},
          {title: '提供总量至', dataIndex: 'providerTotalAmountEnd'},
          {title: '纯度', dataIndex: 'purityID', customRender: function (text) {
              let val = peptide.peptide.purity;
              for (var i = 0; i < val.length; i++)
                if (val[i].id == text) return val[i].value + '%';
            }},
          {title: '长度从', dataIndex: 'aminoAcidLengthBegin'},
          {title: '长度至', dataIndex: 'aminoAcidLengthEnd'},
          {title: '是否脱盐', dataIndex: 'isNeedDesalting', align: 'center', customRender: function (text) {
              if (text == 1) return '√';
              else if (text == 2) return '';
            }},
          {title: '氨基酸类型', dataIndex: 'aminoAcidType', align: 'center'},
          {title: '产品编号', dataIndex: 'sapProductCode'},
          {title: '产品名称', dataIndex: 'sapProductName'},
          {title: '状态', dataIndex: 'status', customRender: function (text) {
              if (text == 1) return '正常';
              else if (text == 2) return '已删除';
            }},
          {title: '创建人', dataIndex: 'creatorName'},
          {title: '创建时间', dataIndex: 'createDate'},
          {title: '删除人', dataIndex: 'cancelName'},
          {title: '删除时间', dataIndex: 'cancelDate'},
        ],
        queryParam: {},
        loadData: parameter => {
          this.queryParam = this.form.getFieldsValue();
          const params = Object.assign(parameter, this.queryParam);
          return this.$api.peptide.getProduct(params).then(res => {
            return {
              data: res.rows,
              page: params.page,
              total: res.total
            };
          });
        },
        selectedRowKeys: [],
        selectedRows: [],
        purity: []
      };
    },
    mounted() {
      this.$api.peptide.getPurityAll().then(res => {
        this.purity = res;
      })
    },
    methods: {
      showDrawer() {
        this.visible = true
      },
      onClose() {
        this.visible = false
      },
      handleSearch() {
        this.$refs.table.refresh(true);
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      // toggleAdvanced() {
      //   this.advanced = !this.advanced;
      // },
      handleDelete() {
        if (this.selectedRowKeys[0] == null) {
          this.$notification.error({
            message: '错误',
            description: `请选择一条数据`
          });
          return false;
        }
        this.$api.peptide.deleteProduct(this.selectedRowKeys[0]).then(res => {
          this.selectedRowKeys = [];
          return this.$refs.table.refresh(true);
        })
      },
      handleResume() {
        if (this.selectedRowKeys[0] == null) {
          this.$notification.error({
            message: '错误',
            description: `请选择一条数据`
          });
          return false;
        }
        this.$api.peptide.resumeProduct(this.selectedRowKeys[0]).then(res => {
          this.selectedRowKeys = [];
          return this.$refs.table.refresh(true);
        })
      },
    }
  };
</script>

<style lang="scss" scoped>

</style>
