export default {
  /**
   * 数据格式化(在某个数组中根据传入的value，查找对应的文本（如name或title等），key 和 title 可以自定义)
   * @param {Array} arr 数组
   * @param {Any} value 值
   * @param {String} key 自定义key值
   * @param {String} title 自定义value值
   */
  formatter (arr, value, key, title) {
    if (!arr || !(arr instanceof Array)) return value;
    if (!value) return value;
    key = key || 'id';
    title = title || 'name';
    for (var i = 0; i < arr.length; i++) {
      // eslint-disable-next-line
      if (arr[i][key] == value) {
        return arr[i][title];
      }
    }
    return value;
  },
  /**
   * 表格退出编辑
   *   status 有值，退出修改操作，还原数据
   *          无值，退出新增操作，删除新增的行
   * @param {Object} row 退出编辑行的数据
   * @param {Object} xTable vxe-table组件
   */
  tableQuitEdit ({ row, xTable }) {
    xTable.clearActived().then(() => {
      if (typeof row.status === 'number') {
        xTable.revert(row);
      } else {
        xTable.remove(row);
      }
    });
  }
};
