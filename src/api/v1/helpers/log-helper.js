const fs = require('fs');
const moment = require('moment');

const logHelper = {
  logEvent: function (message) {
    try {
      let folderName = `${__appRoot}/logs`;
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName, { recursive: true });
      }

      let fileName = `${folderName}/${moment().format('DD/MM/YYYY').replaceAll('/', '-')}.log`;
      let timeLog = moment().format('hh:mm:ss A');
      let content = `${timeLog} --> ${message}\n`;
      fs.appendFileSync(fileName, content);
    } catch (error) {
      console.log('logEvent error:::', error);
    }
  },
  adjustErrorMessageWhenObjectIdInvalid: function (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return 'id-invalid';
    }
    return error.message;
  },
};

module.exports = logHelper;
