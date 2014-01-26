"use strict";

var
  should  = require("should"),
  fs      = require('fs'),
  path    = require('path'),
  config  = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('Discourse Private Message API', function() {

  var
    Discourse   = require('../lib/discourse'),
    api         = new Discourse(config.url, config.api.key, config.api.username),
    topic_id = '';

  it('creates a private message', function(done) {

    api.createPrivateMessage(config.pm.title, config.pm.body, config.pm.target_usernames, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      var json = JSON.parse(body);

      // make more assertions
      json.should.have.properties('topic_id');
      json.topic_id.should.be.above(0);

      // save for next test
      topic_id = json.topic_id;

      done();

    });
  });

  it('replies to a private message', function(done) {

    // topic_id is set in previous test

    api.replyToPrivateMessage(config.pm.reply.body, topic_id, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      var json = JSON.parse(body);

      // make more assertions
      json.should.have.properties('id');
      json.id.should.be.above(0);

      done();

    });
  });

  it('gets a private message thread', function(done) {

    // topic_id is set in previous test

    api.getPrivateMessageThread(topic_id, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      var json = JSON.parse(body);

      // make more assertions
      json.should.have.properties('id');
      json.id.should.equal(topic_id);

      done();

    });

  });

  it('gets all private messages for a user', function(done) {

    api.getPrivateMessages(config.api.username, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      // todo - check json

      done();

    });
  });

  it('gets private messages sent by a user', function(done) {

    api.getSentPrivateMessages(config.api.username, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      // todo - check json

      done();

    });
  });

  it('gets private messages received by a user', function(done) {

    api.getReceivedPrivateMessages(config.api.username, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      // todo - check json

      done();

    });
  });

});