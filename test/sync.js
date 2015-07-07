"use strict";

var
  should  = require("should"),
  fs      = require('fs'),
  path    = require('path'),
  config  = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));


describe('Discourse Sync API', function() {

  var
    Discourse = require('../lib/discourse'),
    api = new Discourse(config.url, config.api.key, config.api.username);

  it('gets site.json synchronously', function(done) {

    var res = api.getSync('/site.json');
    res.statusCode.should.equal(200);

    done();

  });

});
