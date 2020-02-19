import {
  Button,
  Col,
  Form,
  Row,
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styles from './index.less';

/**
 * 表格查询表单
 * @param {Object} props
 * @param {Function} props.getTableData 表单onFinish时执行的方法（根据Form values查询表格数据）
 * @param {ReactDOM} props.simpleForm 简单表单
 * @param {ReactDOM} props.advancedForm 复杂表单
 * @param {Object} props.initialValues 表单默认值
 */
const TableSearchForm = props => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  // 查询
  const onFinish = values => {
    props.getTableData({ page: 1, ...values})
  };

  return (
    <Form
      form={form}
      name="表格搜索表单"
      className={styles['table-search-form']}
      onFinish={onFinish}
      initialValues={props.initialValues}
    >
      <Row gutter={24}>
        {props.simpleForm()}
        {expand && props.advancedForm ? props.advancedForm() : null}
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => { form.resetFields() }}
          >
            重置
          </Button>
          {
            props.advancedForm ? (
              <a
                style={{ marginLeft: 8, fontSize: 12 }}
                onClick={() => { setExpand(!expand) }}
              >
                { expand ? <>收起<UpOutlined /></> : <>展开<DownOutlined /></> }
              </a>
            ) : null
          }
        </Col>
      </Row>
    </Form>
  );
}

export default TableSearchForm;
