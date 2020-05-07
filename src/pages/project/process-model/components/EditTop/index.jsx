/** 编辑页面的上部分 */
import React from 'react';
import { Upload, message, Input, Form } from 'antd';

/**
 * 编辑页面的上传和2个输入框
 * @param {object} props 父页面传的对象
 */
const Pages = props => {
  /**
   * 图片上传时候判断
   * @param {object} file 图片
   */
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  return (
    <>
      <div style={{ float: 'left', marginLeft: '1%' }}>
        <Upload
          name="files"
          listType="picture-card"
          showUploadList={false}
          action={props.uploadUrl}
          headers={{ Authorization: props.authorization }}
          beforeUpload={beforeUpload}
          onChange={props.handleChange}
          style={{ width: '60px', height: '60px' }}
        >
          {props.imageUrl ? (
            <img
              src={props.imageUrl}
              alt="avatar"
              style={{ width: '56px', height: '56px', borderRadius: '50%' }}
            />
          ) : (
            props.uploadButton
          )}
        </Upload>
      </div>
      <div
        style={{
          float: 'left',
          marginLeft: '20px',
          width: '62%',
          minWidth: '500px',
        }}
      >
        <Form.Item name="name">
          <Input placeholder="请输入流程名称" />
        </Form.Item>
        <Form.Item name="describe">
          <Input.TextArea placeholder="请输入流程描述" rows={4} />
        </Form.Item>
      </div>
    </>
  );
};

export default Pages;
