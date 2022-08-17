/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * /^[a-zA-Z]{1}[A-Z|a-z|0-9]{5,29}/ 由一个字母开头和4-9位的数字字母组成用户名
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor'];
  return valid_map.indexOf(str.trim()) >= 0 || /^[a-zA-Z]{1}[A-Z|a-z|0-9]{4,9}/.test(str);
}
