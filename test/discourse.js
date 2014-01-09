"use strict";

var should = require("should");
var fs = require('fs');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('Discourse API', function() {

  var Discourse = require('../lib/discourse');
  var api = new Discourse(config.url, config.apiKey, config.apiUsername);
  var user_id, username, password = 'testtoot', topic_id, pm_topic_id;

  it('creates a user', function(done) {
    require('crypto').randomBytes(5, function(err, buf) {
      username = buf.toString('hex').toUpperCase();
      api.createUser('TEST ' + username, config.email.username + '+' + username + '@' + config.email.domain, username, password, function(err, body, httpCode) {
        should.not.exist(err);
        should.exist(body);
        httpCode.should.equal(200);
        if (httpCode == 200) {
          JSON.parse(body).success.should.equal(true);
        }
        done();
      });
    });
  });

  it('gets new user', function(done) {
    api.getUser(username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      if (httpCode == 200) {
        var json = JSON.parse(body);
        json.should.have.properties('user');
        json.user.should.have.properties('id');
        user_id = json.user.id;
        username = json.user.username;
      }
      done();
    });
  });

  it('approves a user', function(done) {
    api.approveUser(user_id, username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      done();
    });
  });

  it('activates a user', function(done) {
    api.activateUser(user_id, username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      console.log(user_id);
      console.log(username);
      console.log(httpCode);
      console.log(body);
      httpCode.should.equal(200);
      if (httpCode == 200) {
        JSON.parse(body).success.should.equal(true);
      }
      done();
    });
  });

  username = config.existingUsername;
  password = config.existingPassword;

  it('logs in an activated user', function(done) {
    api.login(username, password, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      if (httpCode == 200) {
        var json = JSON.parse(body);
        json.should.not.have.properties('error');
        json.should.have.properties('user');
        json.user.should.have.properties('username');
        json.user.username.should.equal(username);
      }
      done();
    });
  });

  it('gets existing user', function(done) {
    api.getUser(username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      if (httpCode == 200) {
        var json = JSON.parse(body);
        json.should.have.properties('user');
        json.user.should.have.properties('id');
        user_id = json.user.id;
      }
      done();
    });
  });

  it('creates a topic', function(done) {
    api.createTopic('TEST - Have you heard', 'we are in the news', 'News', function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      var json = JSON.parse(body);
      topic_id = json.topic_id;
      topic_id.should.be.above(0);
      done();
    });
  });

  it('replies to a topic', function(done) {
    api.replyToTopic('TEST - this is just a test too', topic_id, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      JSON.parse(body).id.should.be.above(0);
      done();
    });
  });

  it('replies to a post', function(done) {
    api.replyToPost('TEST - whatevs', topic_id, 1, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      JSON.parse(body).id.should.be.above(0);
      done();
    });
  });

  it('gets a topic and it\'s replies', function(done) {
    api.getTopicAndReplies(topic_id, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      done();
    });
  });

  it('creates a private message', function(done) {
    api.createPrivateMessage('TEST - just between you and me', 'TEST - i know what you did', config.username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      var json = JSON.parse(body);
      pm_topic_id = json.topic_id;
      pm_topic_id.should.be.above(0);
      done();
    });
  });

  it('replies to a private message', function(done) {
    api.replyToPrivateMessage('TEST - or so you think :)', pm_topic_id, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      JSON.parse(body).id.should.be.above(0);
      done();
    });
  });

  it('gets private messages sent by a user', function(done) {
    api.getSentPrivateMessages(config.username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      done();
    });
  });

  it('gets private messages received by a user', function(done) {
    api.getReceivedPrivateMessages(config.username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      done();
    });
  });

  it('searches for a query', function(done) {
    api.search('lorem ipsum', function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      done();
    });
  });

  it('searches for a user', function(done) {
    api.searchForUser(username, function(err, body, httpCode) {
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);
      done();
    });
  });

});