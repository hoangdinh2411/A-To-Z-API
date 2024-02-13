const requestIp = require('request-ip');
const satelize = require('satelize');
const helpers = {
  getTimeByTimezone: function (ip) {
    let options = {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },
      formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(new Date());
  },
  getIpByRequest: function (req) {
    return requestIp.getClientIp(req);
  },
  getFolderNameByMonth: function () {
    let d = new Date();
    return `${d.getMonth() + 1}-${d.getFullYear()}`;
  },
  generateFileName: async function (originalname) {
    let splitName = originalname.split('.');
    let extension = splitName[splitName.length - 1];
    extension = extension.toLowerCase();
    let unique = Date.now();
    return `${unique}.${extension}`;
  },
  getCurrentTimestamp: function () {
    return Math.round(new Date().getTime() / 1000);
  },

  axios: async function (method, url, headers, data) {
    try {
      let config = {
        method: method,
        url: url,
        headers: headers,
        data: data,
      };
      return (await axios(config)).data;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  generateSlugFrom: function (str = '') {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');
    return str
      .toString()
      .toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/\s+/g, '-')
      .replace(p, (c) => b.charAt(a.indexOf(c)))
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  formatFrom: function (title) {
    return title.toUpperCase().replace(/\s/g, '_');
  },
};

module.exports = helpers;
