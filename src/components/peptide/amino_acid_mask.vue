<template>
  <div v-if="hackReset" class="mask">
    <div class="customer-name-mask" :style="{top: customer_name_top + 'px', left : customer_name_left + 'px', width : small ? '1100px' : '100%', height : small ? '630px' : '100%', position: small ? 'absolute' : '', borderRadius: small ? '5px' : ''}">
      <div class="top">
        <span style="float: left">多肽修饰列表</span>
        <span class="top-icon" style="padding-bottom: 10px" @click="onClose($event)"><a-icon
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
            <a-form-item label="名称 ">
              <a-input v-decorator="['name']" style="width: 190px"/>
            </a-form-item>
            <a-form-item label="状态">
              <a-select v-decorator="['status', {initialValue : '1'}]" style="width: 150px">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">已删除</a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <div style="margin-bottom:10px">
            <a-button type="primary" icon="search" @click="showData">查询</a-button>
            <a-button type="primary" @click="sub" style="float:right">确定</a-button>
          </div>
        </a-form>

      </div>
      <s-table
        ref="table"
        bordered
        size="small"
        :scroll="{ x: 1500, y: 500 }"
        :columns="columns"
        :data="loadData"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
      </s-table>

    </div>
  </div>

</template>

<script>
import STable from '@/components/Table';

export default {
  name: 'CustomerMask',
  components: {
    STable
  },
  data () {
    return {
      form: this.$form.createForm(this),
      small: true,
      customer_name_top: 0,
      customer_name_left: 0,
      rangeOrganization: [],
      rangeChannel: [],
      hackReset: true,
      status: false,
      data: false,
      columns: [
        { title: '编号', dataIndex: 'code', width: '4%' },
        { title: '名称', dataIndex: 'name', width: '5%' },
        { title: '亲水性',
          dataIndex: 'hydrophilic',
          align: 'center',
          width: '4%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '疏水性',
          dataIndex: 'hydrophobic',
          align: 'center',
          width: '4%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '酸性',
          dataIndex: 'acidic',
          align: 'center',
          width: '3%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '碱性',
          dataIndex: 'alkaline',
          align: 'center',
          width: '3%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '是否可做二硫键',
          dataIndex: 'isCanDisulfideBond',
          align: 'center',
          width: '8%',
          customRender: function (value) {
            return value === 1 ? '√' : '';
          }
        },
        {
          title: '分子量', dataIndex: 'molecularWeight', align: 'center', width: '4%'
        },
        {
          title: '等电点', dataIndex: 'isoelectricPoint', align: 'center', width: '4%'
        },
        {
          title: '羧基解离常数', dataIndex: 'carboxylationDissociationConstant', align: 'center', width: '8%'
        },
        {
          title: '氨基解离常数', dataIndex: 'aminoDissociationConstant', align: 'center', width: '8%'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          width: '3%',
          customRender: function (value) {
            return value === 1 ? '正常' : '已删除';
          }
        },
        {
          title: '创建人', dataIndex: 'creatorName', align: 'center', width: '4%'
        },
        {
          title: '创建时间', dataIndex: 'createDate', align: 'center', width: '6%'
        },
        { title: '删除人', dataIndex: 'cancelName', width: '5%' },
        { title: '删除时间', dataIndex: 'cancelDate', width: '6%' },
        { title: '类型', dataIndex: 'aminoAcidType', width: '4%', align: 'center' },
        { title: '长代码', dataIndex: 'longCode', width: '8%', align: 'center' },
        { title: '短代码', dataIndex: 'shortCode', width: '5%', align: 'center' }
      ],
      queryParam: {},
      loadData: parameter => {
        this.queryParam = this.form.getFieldsValue();
        const params = Object.assign(parameter, this.queryParam);
        return this.$api.peptide.getAminoAcid(params).then(res => {
          var map = {}; var dest = [];
          for (let i = 0; i < res.rows.length; i++) {
            var ai = res.rows[i];
            if (!map[ai.code]) {
              dest.push({
                id: ai.id,
                code: ai.code,
                name: ai.name,
                hydrophilic: ai.hydrophilic,
                hydrophobic: ai.hydrophobic,
                acidic: ai.acidic,
                alkaline: ai.alkaline,
                isCanDisulfideBond: ai.isCanDisulfideBond,
                molecularWeight: ai.molecularWeight,
                isoelectricPoint: ai.isoelectricPoint,
                carboxylationDissociationConstant: ai.carboxylationDissociationConstant,
                aminoDissociationConstant: ai.aminoDissociationConstant,
                status: ai.status,
                creatorName: ai.creatorName,
                createDate: ai.createDate,
                cancelName: ai.cancelName,
                cancelDate: ai.cancelDate,
                aminoAcidType: ai.aminoAcidType,
                longCode: ai.longCode,
                shortCode: ai.shortCode
              });
              map[ai.code] = ai;
            } else {
              for (let j = 0; j < dest.length; j++) {
                var dj = dest[j];
                if (dj.code === ai.code) {
                  dj.shortCode = (dj.shortCode ? dj.shortCode : '') + (ai.shortCode ? ' | ' + ai.shortCode : '');
                  dj.longCode = (dj.longCode ? dj.longCode : '') + (ai.longCode ? ' | ' + ai.longCode : '');
                  dj.aminoAcidType = (dj.aminoAcidType ? dj.aminoAcidType : '') + (ai.aminoAcidType ? ' | ' + ai.aminoAcidType : '');
                  dj.cancelDate = (dj.cancelDate ? dj.cancelDate : '') + (ai.cancelDate ? ' | ' + ai.cancelDate : '');
                  dj.cancelName = (dj.cancelName ? dj.cancelName : '') + (ai.cancelName ? ' | ' + ai.cancelName : '');
                  break;
                }
              }
            }
          }
          return {
            data: dest,
            page: params.page,
            total: dest.length * 2
          };
        });
      },
      selectedRowKeys: [],
      selectedRows: []
    };
  },
  mounted () {
    this.selectedRows = [];
    this.selectedRowKeys = [];
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    if (width > 1000) {
      this.customer_name_left = (width - 1100) / 2;
    }
    if (height > 600) {
      this.customer_name_top = (height - 630) / 2;
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
    sub () {
      if (this.selectedRows[0]) {
        this.$emit('aminoAcidData', this.selectedRows);
        this.$emit('Closed');
        this.selectedRows = [];
        this.selectedRowKeys = [];
      } else {
        this.$notification.error({
          message: '错误',
          description: `请选择一条数据`
        });
      }
    },
    onClose (e) {
      this.$emit('Closed');
      this.status = true;
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    handleSearch () {
      this.$refs.table.refresh(true);
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys.slice(-1);
      this.selectedRows = selectedRows.slice(-1);
    },
    onSmall () {
      this.small = !this.small;
    },
    onChange (dates, dateStrings) {
      this.createDateBegin = dateStrings[0];
      this.createDateEnd = dateStrings[1];
    },
    showData () {
      this.data = true;
      this.$refs.table.refresh(true);
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
    z-index: 10;
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
