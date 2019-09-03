import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Row,
  Select,
  Cascader,
  AutoComplete,
} from 'antd';
import React from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

// 认证
const renzhengMap = {
  0: {
    value: 'default',
    text: '未认证',
  },
  1: {
    value: 'processing',
    text: '审核中',
  },
  2: {
    value: 'success',
    text: '已认证',
  },
};

// 冻结
const dongjieMap = {
  0: {
    value: 'error',
    text: '冻结',
  },
  1: {
    value: 'success',
    text: '活跃',
  },
};

// 完整
const wanzhengMap = {
  0: {
    value: 'default',
    text: '不完整',
  },
  1: {
    value: 'success',
    text: '完整',
  },
};

// 区域
const quyuoptions = [
  {
    value: 'hudong',
    label: '华东大区',
    children: [
      {
        value: 'anhui',
        label: '安徽分点',
      },
      {
        value: 'shanghai',
        label: '上海分点',
      },
    ],
  },
  {
    value: 'dongbei',
    label: '东北大区',
    children: [
      {
        value: 'changchun',
        label: '长春分点',
      },
    ],
  },
];

function renderOption(item) {
  return (
    <Option key={item.value} text={item.value}>
      <div className="global-search-item">
        <span className="global-search-item-desc">{item.code}</span>
        <span className="global-search-item-count">{item.value}</span>
      </div>
    </Option>
  );
}

class Maintain extends React.Component {
  state = {
    selectedRows: [],
    expandForm: false,
    data: {},
    formValues: {},
    xiaoshuoguishu: [],
    kaipiaofang: [],
  };

  columns = [
    {
      title: '客户编号',
      dataIndex: 'code',
      width: 150,
      render(val) {
        return (
          <Link to={`/partner/maintain/details/${val}`}>
            <Icon type="home" />
            {val}
          </Link>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '认证',
      dataIndex: 'renzheng',
      width: 100,
      filters: [
        {
          value: 'default',
          text: '未认证',
        },
        {
          value: 'processing',
          text: '审核中',
        },
        {
          value: 'success',
          text: '已认证',
        },
      ],
      render(val) {
        return <Badge status={renzhengMap[val].value} text={renzhengMap[val].text} />;
      },
    },
    {
      title: '冻结',
      dataIndex: 'dongjie',
      width: 100,
      filters: [
        {
          value: 'error',
          text: '冻结',
        },
        {
          value: 'success',
          text: '活跃',
        },
      ],
      render(val) {
        return <Badge status={dongjieMap[val].value} text={dongjieMap[val].text} />;
      },
    },
    {
      title: '完整',
      dataIndex: 'wanzheng',
      width: 100,
      filters: [
        {
          value: 'default',
          text: '不完整',
        },
        {
          value: 'success',
          text: '完整',
        },
      ],
      render(val) {
        return <Badge status={wanzhengMap[val].value} text={wanzhengMap[val].text} />;
      },
    },
    {
      title: '移动电话',
      dataIndex: 'mobile',
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 100,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 100,
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 300,
    },
    {
      fixed: 'right',
      title: '操作',
      width: 150,
      render: (text, record) => {
        const { code } = record;
        const menu = (
          <Menu>
            <Menu.Item><a href="">认证</a></Menu.Item>
            <Menu.Item><a href="">冻结</a></Menu.Item>
          </Menu>
        );
        return (
          <>
            <Link to={`/partner/maintain/edit/${code}`}>修改</Link>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                更多操作 <Icon type="down" />
              </a>
            </Dropdown>
          </>
        );
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      this.getData();
    });
  };

  getData = () => {
    const data = [];
    const { formValues } = this.state;
    console.log(formValues);
    for (let i = 0; i < 25; i++) {
      data.push({
        id: i + 1,
        code: 100000 + (i + 1),
        name: `name${i}`,
        renzheng: 1,
        dongjie: 0,
        wanzheng: 1,
        type: 1, // 1人，2组织
        mobile: '18735818888',
        email: '123@qq.com',
        phone: '123456789',
        address: '上海市松江区',
      });
    }
    this.setState({
      data: {
        pagination: {
          pageSize: 10,
        },
        list: data,
      },
    });
  }

  handleModalVisible = () => {
    router.push('/partner/maintain/add');
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = () => {
    console.log(3);
  };

  handleFormReset = () => {
    console.log(3);
  };

  // 查询销售归属
  xiaoshuoguishuSearch = value => {
    this.setState({
      xiaoshuoguishu: [
        {
          id: 1,
          code: 11111,
          value: `第一个${value}`,
        },
        {
          id: 2,
          code: 22222,
          value: `第二个${value}`,
        },
      ],
    });
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderForm = () => {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { xiaoshuoguishu } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="Email">
              {getFieldDecorator('email')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="认证状态">
              {getFieldDecorator('renzheng')(
                <Select placeholder="请选择" mode="multiple">
                  <Option value="0">未认证</Option>
                  <Option value="1">已认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售状态">
              {getFieldDecorator('xiaoshou')(
                <Select placeholder="请选择" mode="multiple">
                  <Option value="0">未认证</Option>
                  <Option value="1">已认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="数据状态">
              {getFieldDecorator('shuju')(
                <Select placeholder="请选择" mode="multiple">
                  <Option value="0">未认证</Option>
                  <Option value="1">已认证</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="区域归属">
              {getFieldDecorator('quyu')(
                <Cascader options={quyuoptions} />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="销售归属">
              {getFieldDecorator('xiaoshouguishu')(
                <AutoComplete
                  dataSource={xiaoshuoguishu.map(renderOption)}
                  onSearch={this.xiaoshuoguishuSearch}
                  optionLabelProp="text"
                />,
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="开票方">
              {getFieldDecorator('kaipiao')(
                <AutoComplete
                  dataSource={xiaoshuoguishu.map(renderOption)}
                  onSearch={this.xiaoshuoguishuSearch}
                  optionLabelProp="text"
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ lg: 24, md: 12, sm: 6 }}>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="编号">
              {getFieldDecorator('code')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <FormItem label="移动电话">
              {getFieldDecorator('mobile')(<Input />)}
            </FormItem>
          </Col>
          <Col lg={6} md={8} sm={12}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { data, selectedRows } = this.state;
    const loading = false;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              scroll={{ x: 1300 }}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Maintain);
