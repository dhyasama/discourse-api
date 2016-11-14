"use strict";

var
  should  = require("should"),
  fs      = require('fs'),
  path    = require('path'),
  config  = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('Discourse Topic API', function() {

  var
    Discourse = require('../lib/discourse'),
    api = new Discourse(config.url, config.api.key, config.api.username),
    topic_id = '',
    postIdToReplyTo = null,
    post_id = '';

  it('creates a topic', function(done) {

    // append random string to title because discourse has a setting to prevent duplicate titles
    // alternatively, turn off the setting :)

    require('crypto').randomBytes(5, function(err, buf) {

      api.createTopic(config.topic.title + ' ' + buf.toString('hex').toUpperCase(), 
        config.topic.body, 
        config.topic.category,
        true,
        config.topic.tag_array, 
        function(err, body, httpCode) {

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

  });

  it('updates a topic', function(done) {

    // topic_id set in previous test

    // append random string to title because discourse has a setting to prevent duplicate titles

    require('crypto').randomBytes(5, function(err, buf) {

      api.updateTopic(slug, topic_id, config.topic.title + ' UPDATE ' + buf.toString('hex').toUpperCase(), 'uncategorized', function(err, body, httpCode) {

        // make assertions
        should.not.exist(err);
        should.exist(body);
        httpCode.should.equal(200);

        var json = JSON.parse(body);

        // make more assertions
        json.should.have.properties('basic_topic');
        json.basic_topic.id.should.be.above(0);

        done();

      });

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

      post_id = json.id;

      done();

    });
  });

  it('updates a post', function(done) {

    // topic_id set in previous test

    api.updatePost(post_id, 'i updated my post! horray!', 'testing', function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      var json = JSON.parse(body);

      // make more assertions
      json.should.have.properties('post');
      //json.basic_topic.id.should.be.above(0);

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

  it('gets a topic and its replies', function(done) {

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

//  it('deletes a topic', function(done) {
//
//    // topic_id set in previous test
//
//    api.deleteTopic(topic_id, function(err, body, httpCode) {
//
//      // make assertions
//      should.not.exist(err);
//      should.exist(body);
//      httpCode.should.equal(200);
//
//      // todo - check body
//
//      done();
//
//    });
//
//  });

});
