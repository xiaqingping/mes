import {
  Form,
  Row,
  Col,
  Select,
  Switch,
  Radio,
  Tabs,
  Card,
  Cascader,
  Icon,
  Empty,
} from 'antd';
import React, { Component } from 'react';
import BillToParty from './BillToParty';
import SoldToParty from './SoldToParty';
import ShipToParty from './ShipToParty';
import Salesperson from './Salesperson';

import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

class Basic extends Component {
  state = {
    tabKey: '',
    tabsData: [],
  }

  renderTabPane = obj => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <>
        <Form>
          <Row gutter={32}>
            <Col span={5}>
              <FormItem label="网点归属">
                {getFieldDecorator('wangdian')(
                  <Select>
                    <Option value="1">上海</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="默认付款方式">
                {getFieldDecorator('paytype')(
                  <Select>
                    <Option value="1">网银</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem label="币种">
                {getFieldDecorator('currency')(
                  <Select>
                    <Option value="1">人民币</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={2}>
              <FormItem label="销售冻结">
                {getFieldDecorator('dongj', { valuePropName: 'checked' })(<Switch />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem label="默认开票类型">
                {getFieldDecorator('kaipiao', { initialValue: 'a' })(
                  <Radio.Group>
                    <Radio.Button value="a">增值税专用发票</Radio.Button>
                    <Radio.Button value="b">增值税普通发票</Radio.Button>
                  </Radio.Group>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Tabs className={styles.internalTab}>
          <TabPane tab="开票方" key="BillToParty">
            <BillToParty />
          </TabPane>
          <TabPane tab="售达方" key="SoldToParty">
            <SoldToParty />
          </TabPane>
          <TabPane tab="送达方" key="ShipToParty">
            <ShipToParty />
          </TabPane>
          <TabPane tab="销售员" key="Salesperson">
            <Salesperson />
          </TabPane>
        </Tabs>
      </>
    );
  }

  onTabChange = tabKey => {
    if (tabKey === 'select') return;
    this.setState({
      tabKey,
    });
  }

  // 级联选泽销售范围时
  onCascaderChange = obj => {
    const { tabsData } = this.state;
    const index = obj.length - 1;

    tabsData.push({
      title: obj[index],
    });
    this.setState({ tabsData, tabKey: obj[index] });
  }

  renderCascader = () => {
    const { tabsData } = this.state;
    const cascaderTitle = tabsData.map(e => e.title);
    const options = [
      {
        value: '生工生物',
        label: '生工生物',
        children: [
          {
            value: '生工国内直销',
            label: '生工国内直销',
          },
          {
            value: '生工国内电商',
            label: '生工国内电商',
          },
          {
            value: '生工国外直销',
            label: '生工国外直销',
          },
          {
            value: '生工国外电商',
            label: '生工国外电商',
          },
        ],
      },
      {
        value: 'BBI',
        label: 'BBI',
        children: [
          {
            value: 'BBI国内直销',
            label: 'BBI国内直销',
          },
          {
            value: 'BBI国内电商',
            label: 'BBI国内电商',
          },
          {
            value: 'BBI国外直销',
            label: 'BBI国外直销',
          },
          {
            value: 'BBI国外电商',
            label: 'BBI国外电商',
          },
        ],
      },
    ];
    options.forEach(e => {
      e.children.forEach(e1 => {
        if (cascaderTitle.indexOf(e1.value) > -1) {
          e1.disabled = true;
        } else {
          e1.disabled = false;
        }
      });
    });
    return (
      <Cascader options={options} onChange={this.onCascaderChange}>
        <a style={{ fontSize: 14, marginLeft: -16 }} href="#">销售范围 <Icon type="down" style={{ fontSize: 12 }} /></a>
      </Cascader>
    );
  }

  closeTab = tabKey => {
    let index = -1;
    let key = '';
    const { tabsData } = this.state;

    // 过滤掉关闭的销售范围
    const newTabsData = tabsData.filter((e, i) => {
      if (e.title !== tabKey) return true;
      index = i;
      return false;
    });

    // 根据index决定选中哪个Tab
    if (newTabsData.length > 0) {
      // 关闭第一个
      if (index === 0) {
        key = newTabsData[0].title;
      }
      // 关闭最后一个
      if (index === tabsData.length - 1) {
        key = newTabsData[index - 1].title;
      }
      // 关闭中间的Tab
      if (index > 0 && index < tabsData.length - 1) {
        key = newTabsData[index].title;
      }
    } else {
      key = '';
    }

    this.setState({
      tabsData: newTabsData,
      tabKey: key,
    });
  }

  render() {
    const { tabsData, tabKey } = this.state;
    let tabList = tabsData.map(e => ({ key: e.title, tab: e.title }));
    tabList = tabList.concat({
      key: 'select',
      tab: this.renderCascader(),
    });
    tabList.forEach(e => {
      if (e.key === tabKey) {
        e.tab = (
          <>{e.tab} <Icon type="close" style={{ fontSize: 12 }} onClick={() => this.closeTab(e.key)} /></>
        );
      } else {
        e.tab = (
          <>{e.tab} <Icon type="close" style={{ fontSize: 12, visibility: 'hidden' }} /></>
        );
      }
    });

    return (
      <Card
        title="销售范围"
        bordered={false}
        style={{ marginBottom: '24px' }}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={key => {
          this.onTabChange(key);
        }}
      >
        {tabKey ? this.renderTabPane() : <Empty description="暂无销售范围" />}
      </Card>
    );
  }
}

export default Form.create()(Basic);
