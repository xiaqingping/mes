import React from 'react';
import { Form } from 'antd';

/**
 * 表格编辑组件
 */
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  rules,
  ...restProps
}) => (
  <td {...restProps}>
    {editing ? (
      <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules} >
        {inputType}
      </Form.Item>
    ) : (
      children
    )}
  </td>
);

export default EditableCell;
