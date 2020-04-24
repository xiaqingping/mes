/**
 * 计算时差 精确到时、分、秒
 * @param {String} beginDate 开始时间
 * @param {String} endDate   结束时间
 */
const calculateTimeDifference = (beginDate, endDate) => {
  if (beginDate === undefined || endDate === undefined) return false;
  // 时间差的毫秒数
  const date = new Date(endDate).getTime() - new Date(beginDate).getTime();
  // 计算出小时数
  const leave1 = date % (24 * 3600 * 1000);
  const hours = Math.floor(date / (3600 * 1000));
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000));
  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000);
  if (hours === 0) {
    return `${minutes}m${seconds}s`;
  }
  if (hours === 0 && minutes === 0) {
    return `${seconds}s`;
  }
  return `${hours}h${minutes}m${seconds}s`;
};

export { calculateTimeDifference };
