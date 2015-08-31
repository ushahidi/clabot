var _ = require('lodash');
var cradle = require('cradle');

cradle.setup({
  host: process.env.CLOUDANT_URL.replace('https://', ''),
  cache: true,
  raw: false,
  auth: { username: process.env.CLOUDANT_USER, password: process.env.CLOUDANT_PASS }
});

var db = (new cradle.Connection).database('clabot');

exports.save = function(req, res) {
  var form = req.form;
  res.header('Access-Control-Allow-Origin', 'localhost');

  if (!form.isValid) {
    console.log('Invalid form data received');
    return res.send(400, form.errors || 'Invalid form data received');
  } else {
    form = req.form;
    return db.view('contractors/github', function(err, docs) {
      var update;
      update = _.find(docs, function(doc) {
        if (doc.key === form.github) {
          return true;
        }
      });
      if (update) {
        return db.save(update.id, _.extend(update.value, form), function(err, dbres) {
          if (err) {
            console.log(err);
            console.log('Database Error');
            return res.send(500, 'Database Error');
          } else {
            console.log('Submission Saved');
            return res.send(200, 'Submission Saved');
          }
        });
      } else {
        return db.save(form, function(err, dbres) {
          if (err) {
            console.log(err);
            console.log('Database Error');
            return res.send(500, 'Database Error');
          } else {
            console.log('Submission Saved');
            return res.send(200, 'Submission Saved');
          }
        });
      }
    });
  }
};

exports.getContractors = function(callback) {
  return db.view('contractors/github', function(err, docs) {
    if (err) {
      console.log('Database Error');
      return callback([]);
    } else {
      return callback(_.pluck(docs, 'key'));
    }
  });
};
