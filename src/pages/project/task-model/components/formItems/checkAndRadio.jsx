import React, { useState } from 'react';
import { Input, Form, Button, Switch } from 'antd';

/**
 * 多选 配置页面
 */
const CheckboxModel = () => {
  const [list, setList] = useState([
    {
      id: 1,
      selectName: '选项 1',
      selectKey: 'select_1',
    },
    {
      id: 2,
      selectName: '选项 2',
      selectKey: 'select_2',
    },
  ]);

  // 新增选项
  const addSelected = () => {
    const ids = [];
    list.forEach(item => ids.push(item.id));
    const max = Math.max.apply(null, ids);
    const newId = max + 1;
    const newName = `选项 ${newId}`;
    const newKey = `select_${newId}`;

    const data = {
      id: newId,
      selectName: newName,
      selectKey: newKey,
    };
    setList([...list, data]);
    console.log(list);
  };

  return (
    <>
      <Form.Item
        label="参数Key："
        name="paramKey"
        rules={[
          {
            required: true,
            message: '请输入参数Key',
          },
        ]}
      >
        <Input placeholder="请输入参数Key " />
      </Form.Item>

      <Form.Item
        label="参数描述："
        name="paramName"
        rules={[
          {
            required: true,
            message: '请输入参数名称',
          },
        ]}
      >
        <Input placeholder="请输入参数名称" />
      </Form.Item>

      <Form.Item label="是否必填：" name="isrequired">
        <Switch />
      </Form.Item>

      <p style={{ fontSize: 16, fontWeight: 'bold' }}>选项：</p>
      {list.map(item => (
        <>
          <div style={{ width: 500, overflow: 'hidden' }}>
            <div style={{ float: 'left' }}>
              <span style={{ position: 'relative', left: 0, top: 5 }}>{item.selectName} :</span>
            </div>
            <div style={{ float: 'right', marginRight: 50, width: 380 }}>
              <Form.Item label="" name={item.selectKey}>
                <Input.Group compact>
                  <Form.Item
                    name={[[item.selectKey], 'selectKey']}
                    noStyle
                    rules={[{ required: true, message: '请输入Key' }]}
                  >
                    <Input style={{ width: '50%' }} placeholder="请输入Key" />
                  </Form.Item>
                  <Form.Item
                    name={[[item.selectKey], 'selectValue']}
                    noStyle
                    rules={[{ required: true, message: '请输入名称' }]}
                  >
                    <Input style={{ width: '50%' }} placeholder="请输入名称" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </div>
          </div>
        </>
      ))}

      <Button type="dashed" block style={{ marginTop: 30 }} onClick={() => addSelected()}>
        新增
      </Button>
    </>
  );
};

export default CheckboxModel;
