var express = require('express');
var data = require('./lib/data');
var validate = require('./lib/validate');

// Setup clabot
var app = require('clabot').createApp({
  getContractors: data.getContractors,
  token: process.env.GITHUB_TOKEN,
  templateData: {
    link: process.env.CLA_LINK,
    maintainer: process.env.MAINTAINER
  },
  secrets: {
    'ushahidi': {
      'platform': process.env.HUB_SECRET,
      'platform-client': process.env.HUB_SECRET,
    }
  },
  skipCollaborators: true,
  skipContributors: true
});

// Serve assets
app.use(require('connect-assets')());

app.use(express.compress());

app.get('/', function (req, res) {
  return res.redirect(req.clabotOptions.templateData.link);
});

port = process.env.PORT || 1337;

app.listen(port);
console.log("Listening on " + port);
