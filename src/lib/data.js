var _ = require('lodash');

var GoogleSpreadsheet = require("google-spreadsheet");
var signatures = new GoogleSpreadsheet(process.env.SHEET_ID);

var creds = require('../../'+ process.env.SHEETS_CONFIG);

exports.getContractors = function(callback) {

  signatures.useServiceAccountAuth(creds, function(err){
    signatures.getRows(1, function (err, rows) {
      if (err) {
        console.log('Error');
        return callback([]);
      } else {
        console.log(rows);
        return callback(_.pluck(rows,'githubusername'));
      }
    });
  });
};
