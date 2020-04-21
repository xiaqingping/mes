import React from 'react';
import { Modal } from 'antd';

const { confirm } = Modal;

const DeleteConfirm = props => {
  console.log(123);
  return <></>;

  // confirm({
  //   content: '你确定要删除吗？',
  //   onOk() {
  //     props.handleDelete();
  //   },
  //   onCancel() {},
  // });
};

export default DeleteConfirm;
