"use strict";

var
  should  = require("should"),
  fs      = require('fs'),
  path    = require('path'),
  config  = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('Discourse Topic API', function() {

  var
    Discourse = require('../lib/discourse'),
    api       = new Discourse(config.url, config.api.key, config.api.username),
    topic_id  = '';

  it('creates a topic', function(done) {

    api.createTopic(config.topic.title, config.topic.body, config.topic.category, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);

      httpCode.should.equal(200);

      var json = JSON.parse(body);

      // make more assertions
      json.should.have.properties('topic_id');
      json.topic_id.should.be.above(0);

      // save for subsequent tests
      topic_id = json.topic_id;

      done();

    });
  });

  it('replies to a topic', function(done) {

    // topic_id set in previous test

    api.replyToTopic(config.topic.reply.body, topic_id, function(err, body, httpCode) {

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

  it('replies to a post', function(done) {

    // topic_id set in previous test

    api.replyToPost(config.topic.post.reply.body, topic_id, 1, function(err, body, httpCode) {

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

  it('gets a topic and it\'s replies', function(done) {

    // topic_id set in previous test

    api.getTopicAndReplies(topic_id, function(err, body, httpCode) {

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

});