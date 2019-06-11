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
  refresh () {
    var childList = document.getElementsByTagName('tbody')[0].childNodes;
    document.getElementsByTagName('tbody')[0].removeChild(childList[0]);
    document.getElementById('add').removeAttribute('disabled');
  },
  isValue () {
    var isValue = document.getElementsByClassName('isValue');
    for (let i = 0; i < isValue.length; i++) {
      isValue[i].onkeyup = function () {
        if (this.value) {
          this.style.backgroundColor = 'white';
          this.style.borderColor = 'grey';
        } else {
          this.style.backgroundColor = '#FFF3F3';
          this.style.borderColor = '#FFA8A8';
        }
      };
    }
  },
  isValueMask (data) {
    for (let i = 0; i < data.length; i++) {
      document.getElementById(`${data[i]}`).style.backgroundColor = 'white';
      document.getElementById(`${data[i]}`).style.borderColor = 'grey';
    }
  }
};
