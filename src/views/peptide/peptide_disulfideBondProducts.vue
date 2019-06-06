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
        <a-button type="primary" icon="plus" @click="addTr(16)" id="add">新增</a-button>
        <a-button type="primary" icon="edit" @click="addData">保存</a-button>
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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
      </s-table>
    </div>

    <products-mask v-show="products_status" @Closed="closeMask()">
    </products-mask>

  </div>
</template>

<script>
import STable from '@/components/Table';
// import peptide from '@/cache/index';
import ProductsMask from '@/components/peptide/products_mask';

export default {
  name: 'PeptideDisulfideBondProducts',
  components: {
    STable,
    ProductsMask
  },
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      products_status: false,
      columns: [
        { title: '编号', dataIndex: 'code', width: '3%' },
        { title: '氨基酸类型1', dataIndex: 'aminoAcidTypeLeft', width: '7%' },
        { title: '氨基酸类型2', dataIndex: 'aminoAcidTypeRight', width: '7%' },
        { title: '提供总量从', dataIndex: 'providerTotalAmountBegin', width: '6%' },
        { title: '提供总量至', dataIndex: 'providerTotalAmountEnd', width: '6%' },
        { title: '长度从', dataIndex: 'aminoAcidLengthBegin', width: '4%' },
        { title: '长度至', dataIndex: 'aminoAcidLengthEnd', width: '4%' },
        {
          title: '是否脱盐',
          dataIndex: 'isNeedDesalting',
          align: 'center',
          width: '5%',
          customRender: function (value) {
            if (value === 1) return '√';
          }
        },
        { title: '产品编号', dataIndex: 'sapProductCode', width: '8%' },
        { title: '产品名称', dataIndex: 'sapProductName', width: '21%' },
        {
          title: '状态',
          dataIndex: 'status',
          width: '4%',
          customRender: function (text) {
            if (text === 1) return '正常';
            else if (text === 2) return '已删除';
          }
        },
        { title: '创建人', dataIndex: 'creatorName', width: '4%' },
        { title: '创建日期', dataIndex: 'createDate', width: '10%' },
        { title: '删除人', dataIndex: 'cancelName', width: '5%' },
        { title: '删除时间', dataIndex: 'cancelDate', width: '10%' }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        // else this.queryParam = {'status': parseInt(this.form.getFieldsValue().status)};
        var params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getdisulfideBondProducts(params).then(res => {
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
    var selectDrop = document.getElementsByClassName('ant-checkbox')[0];
    selectDrop.style.display = 'none';
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
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      // console.log(this.selectedRowKeys[0]);
      this.selectedRows = selectedRows;
    },
    addTr (num) {
      var self = this;
      document.getElementById('add').setAttribute('disabled', true);
      var tbodyObj = document.getElementsByTagName('tbody')[0];
      var trObj = document.createElement('tr');
      for (let i = 0; i < num; i++) {
        var tdObj = document.createElement('td');
        tdObj.style.padding = '0';
        if (i === 4 || i === 5 || i === 6 || i === 7) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/>";
        } else if (i === 8) {
          tdObj.style.backgroundColor = 'blue';
          tdObj.style.textAlign = 'center';
          tdObj.innerHTML = "<input type='checkbox' id='addValue" + i + "'/>";
        } else if (i === 2 || i === 3) {
          tdObj.innerHTML = "<select title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'><option value='L'>L</option><option value='D'>D</option></select>";
        } else if (i === 9) {
          tdObj.innerHTML = "<input type='text' title='该输入项为必输入项' disabled id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: white;'/>";
        } else if (i === 10) {
          tdObj.innerHTML = "<div style='position: relative;width: 100%;height: 100%'><input type='text' readonly title='该输入项为必输入项' id='addValue" + i + "' style='width: 100%;height: 100%;border: 1px solid #FFA8A8;outline: none;background-color: #FFF3F3;'/><span class='iconfont icon-suosou' id='openMask' style='position: absolute;right:0;top:0;cursor:pointer;font-weight:bold;color:#8C8C8C'></span></div>";
        } else {
          tdObj.style.backgroundColor = 'blue';
        }
        trObj.appendChild(tdObj);
      }
      tbodyObj.insertBefore(trObj, tbodyObj.firstElementChild);
      this.$nextTick(() => {
        document.getElementById('openMask').onmouseover = function () {
          this.style.color = 'black';
        };
        document.getElementById('openMask').onmouseout = function () {
          this.style.color = '#8C8C8C';
        };
        document.getElementById('openMask').onclick = function () {
          self.openMask();
        };
      });
    },
    openMask () {
      this.products_status = true;
    },
    closeMask () {
      this.products_status = false;
    },
    addData () {
      var addVal = document.getElementById('addValue').value;
      if (addVal === '') {
        this.$notification.error({
          message: '错误',
          description: `数据不能为空！`
        });
        return false;
      }
      this.$api.peptide.insertPurity({ 'purity': addVal }).then(res => {
        if (res.id) {
          this.utils.refresh();
          return this.$refs.table.refresh(true);
        }
      });
    },
    handleDelete () {
      if (!document.getElementById('addValue2')) {
        if (this.selectedRowKeys[0] == null) {
          this.$notification.error({
            message: '错误',
            description: `请选择一条数据`
          });
          return false;
        }
        this.$api.peptide.deletedisulfideBondProducts(this.selectedRowKeys[0]).then(res => {
          this.selectedRowKeys = [];
          return this.$refs.table.refresh(true);
        });
      } else {
        this.utils.refresh();
      }
    },
    handleResume () {
      if (this.selectedRowKeys[0] == null) {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
        return false;
      }
      this.$api.peptide.resumedisulfideBondProducts(this.selectedRowKeys[0]).then(res => {
        this.selectedRowKeys = [];
        return this.$refs.table.refresh(true);
      });
    }
  }

};
</script>

<style lang="scss" scoped>
</style>
