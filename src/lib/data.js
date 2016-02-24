var _ = require('lodash');

var GoogleSpreadsheet = require("google-spreadsheet");
var signatures = new GoogleSpreadsheet(process.env.SHEET_ID);

var creds = {
  client_email: process.env.SHEET_EMAIL,
  private_key: process.env.SHEET_PRIVATE_KEY
}

exports.getContractors = function(callback) {

  signatures.useServiceAccountAuth(creds, function(err){
    signatures.getRows(1, function (err, rows) {
      if (err) {
        console.log('Error');
        return callback([]);
      } else {
        return callback(_.pluck(rows,'Github User Name'));
      }
    });
  });
};
