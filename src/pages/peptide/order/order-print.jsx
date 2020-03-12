// import { Card, Modal } from 'antd';
import React from 'react';

export default () => {
  const data = JSON.parse(sessionStorage.getItem('orderPrint'));
  console.log(data);
  return (
    // const [visible, setVisible] = useState(false);
    // useEffect(() => {
    //   function visibleShow(v, selectedRows) {
    //     console.log(v, selectedRows);
    //   }
    // });

    <div style={{ position: 'relative', top: '0', zIndex: '1000' }}>123</div>
  );
};

// <Modal visible={showOrderPrint}>
//   <span>123234234</span>
//   <span>aaaaaaaaaaaaa</span>
//   <span>bbbbbbbbbb</span>
//   <span>cccccccccccccccccc</span>
//   <span>123</span>
// </Modal>
// export default page;
