import React, { useState } from 'react';
import { Drawer, Card, List, Avatar, Tag } from 'antd';

const DrawerTool = props => {
  console.log(props);

  // const { status = [] } = props;

  const onClose = () => {
    props.onClose();
  };

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ]

  return (
    <div>
      <Drawer
        width="500px"
        title={props.detailValue.name}
        // placement="right"
        closable={false}
        onClose={onClose}
        visible={props.visible}
        // headerStyle={{ fontWeight: "bold", color: "red" }}
      >
        <List
          dataSource={data}
          split={false}
          renderItem={item => (
            <List.Item key={item}>
              <Card hoverable style={{ width: '100%' }} >
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  style={{ float: 'left' }}
                  size="large"
                />
                <div style={{ float: 'left' }}>
                  <div>
                    <div style={{ float: 'left' }}>
                      <div>123123123333333333333</div>
                      <div style={{ width: '255px', height: '20px', wordWrap: 'break-word' }}>
                        肠道菌群宏基因组示例-demo2018-03-06
                      </div>
                    </div>
                    <Tag color="green" style={{ padding: '0 10px', float: 'right' }}>
                      V1.0
                    </Tag>
                  </div>
                  <div style={{ width: '340px', height: 'auto', wordWrap: 'break-word', marginTop: '10px', float: 'left' }}>
                    肠道菌群宏基因组示例 肠道菌群宏基因组示例 肠道菌群宏基因组示例 肠道菌群宏基因组示例
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}

export { DrawerTool };
