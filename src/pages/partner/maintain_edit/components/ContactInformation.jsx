/**
 * 联系方式
 * 根据传入的数据，格式化 手机、电话、传真 的显示文本
 */
import React from 'react';
import { connect } from 'dva';
// import axios from 'axios';

const ContactInformation = props => {
  const { data, countryDiallingCodes } = props;
  // countryCode 国际编号
  // areaCode 区号
  // code 号码
  // extension 分机号
  let msg = '';
  let country;

  if (data.countryCode) {
    countryDiallingCodes.forEach(e => {
      if (e.countryCode === data.countryCode) {
        // axios.get('/images/country/CN.png').then(res => {
        //   console.log(res);
        // }).catch(err => {
        //   console.log(2);
        // });
        if (data.flag === 'no_use') {
          country = <>{`+${e.diallingCode} `}</>;
        } else {
          country = (
            <>
              <div
                className="select-countryPic-box"
                style={{ backgroundImage: `url(/images/country/${e.countryCode}.png)` }}
              >
                &nbsp;
              </div>
              {`+${e.diallingCode} `}
            </>
          );
        }
      }
    });
  }

  const arr = [];
  if (data.areaCode) arr.push(data.areaCode);
  if (data.code) arr.push(data.code);
  if (data.extension) arr.push(data.extension);
  msg += arr.join('-');

  return (
    <>
      {country}
      {msg}
    </>
  );
};

export default connect(({ basicCache }) => ({
  countryDiallingCodes: basicCache.countryDiallingCodes,
}))(ContactInformation);
