var express = require('express');
var data = require('./lib/data');
var validate = require('./lib/validate');

// Setup clabot
var app = require('clabot').createApp({
  getContractors: data.getContractors,
  token: process.env.GITHUB_TOKEN,
  templateData: {
    link: '$http://your-cla-webform.com',
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

app.get('/form/:project/:kind?', function(req, res) {
  var kind, project;
  project = req.params.project;
  // Makes no sense, yet. Extensible in the future.
  if (project !== 'platform') { project = 'platform'; }

  // Format kind as Uppercasefirstchar
  kind = req.params.kind;
  kind = (kind != null) ? kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase() : '';
  if (kind !== 'Entity') { kind = 'Individual'; }

  // Render the form
  return res.render('form.hjs', {
    agreement: "" + project + " " + kind + " Contributors License Agreement",
    kind: kind,
    layout: false,
    project: project,
    url: req.clabotOptions.templateData.link
  });
});

app.post('/form', validate, data.save);

port = process.env.PORT || 1337;

app.listen(port);
console.log("Listening on " + port);
