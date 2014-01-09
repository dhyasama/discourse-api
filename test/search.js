"use strict";

var
  should  = require("should"),
  fs      = require('fs'),
  path    = require('path'),
  config  = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('Discourse Search API', function() {

  var
    Discourse = require('../lib/discourse'),
    api       = new Discourse(config.url, config.api.key, config.api.username);

  it('searches for a term', function(done) {

    api.search(config.search.term, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      // todo - check json

      done();

    });
  });

  it('searches for a user', function(done) {

    api.searchForUser(config.search.username, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      // todo - check json

      done();

    });
  });

});