import React, { useState } from 'react';
import { Avatar, Tag } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from 'dva';

function TitleModel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: '25px', overflow: 'hidden' }}>
      <Avatar
        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        style={{ float: 'left' }}
        size="large"
        shape="circle"
      />
      <div style={{ float: 'left', fontWeight: '900' }}>
        <div style={{ fontWeight: '700' }}>00056841264</div>
        <div style={{ width: '255px', height: '50px', wordWrap: 'break-word' }}>微生物分析流程</div>
      </div>

      <div style={{ float: 'right', marginLeft: '30px', fontSize: '14px' }}>
        <div>
          {open ? (
            <a href="#" onClick={() => setOpen(!open)}>
              收起
              <DownOutlined />
            </a>
          ) : (
            <a href="#" onClick={() => setOpen(!open)}>
              展开
              <UpOutlined />
            </a>
          )}
        </div>
      </div>
      <div style={{ float: 'right' }}>
        <Tag color="green" style={{ padding: '0 10px' }}>
          V1.0
        </Tag>
      </div>
      {open ? (
        <div style={{ marginLeft: '40px', color: '#858585', fontSize: '14px' }}>
          <div style={{ clear: 'both', marginTop: '36px' }}>某某某发布人</div>
          <div style={{ marginBottom: '20px' }}>(2017-01-12 13:55:34)</div>
          <div style={{ width: '400px' }}>
            该任务旨在分析肠道微生物与肥胖之间的关系。本次实验分析共，该任务旨在分析肠道微生物与肥胖之间的关系。
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default connect(taskModel => ({
  taskModel,
}))(TitleModel);
