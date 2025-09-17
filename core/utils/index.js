/**
 * 这个函数的功能是给obj新增一个键值对 key: val,并指出其是否可枚举
 * @param {*} obj 待处理的对象
 * @param {*} key 要增加的键
 * @param {*} val 赋给键的值 
 * @param {*} enumerable 该键值对是否可读
 */
export function def(obj, key, val, enumerable = true) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
  }

/**
 * 从指定索引位置item删掉一个array元素
 * @param {Array} arr 待删除的数组
 * @param {Number} item 数组索引
 */
export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}