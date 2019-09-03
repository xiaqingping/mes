import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import * as React from 'react';
import { PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';

const FormItem = Form.Item;
const { Option } = Select;

class Verification extends React.Component {
  render() {
    return (
      <PageHeaderWrapper
        title="123456"
      >
        <Card bordered={false}>
          <div>验证记录</div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Verification);
