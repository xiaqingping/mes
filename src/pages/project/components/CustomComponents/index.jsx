// 定制组件
import React from 'react';
import { InboxOutlined } from '@ant-design/icons';

// 上传按钮
const UploadButton = props => (
  <>
    <div
      style={{
        width: '100%',
        height: '100%',
        border: '1px dashed #DBDBDB',
        textAlign: 'center',
        background: '#FBFBFB',
      }}
    >
      <InboxOutlined style={{ fontSize: '64px', color: '#1890FF', marginTop: '12px' }} />
      <div style={{ fontSize: '16px' }}>点击或将文件</div>
      <div style={{ fontSize: '16px' }}>拖拽到这里上传</div>
    </div>
    {props.more ? (
      <input
        type="file"
        value=""
        onChange={e => props.handleUpload(e)}
        multiple="multiple"
        style={{
          opacity: 0,
          cursor: 'pointer',
          width: '170px',
          height: '142px',
          outline: 'none',
          position: 'absolute',
          top: '0',
          zIndex: '10',
        }}
      />
    ) : (
      <input
        type="file"
        value=""
        onChange={e => props.handleUpload(e)}
        style={{
          opacity: 0,
          cursor: 'pointer',
          width: '170px',
          height: '142px',
          outline: 'none',
          position: 'absolute',
          top: '0',
          zIndex: '10',
        }}
      />
    )}
  </>
);
export { UploadButton };
