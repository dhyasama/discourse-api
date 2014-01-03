"use strict";

var should = require("should");
var fs = require('fs');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.js', 'utf8')));

describe('Discourse API', function() {

  var Discourse = require('../lib/discourse');
  var api = new Discourse(config.url, config.apiKey, config.username);
  var topic_id;
  var pm_topic_id;

//  it('creates a user', function(done) {
//    api.createUser('Toots McGee', config.email, 'toots', 'tootsie', function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      JSON.parse(body).success.should.equal(true);
//      done();
//    });
//  });
//
//  it('logs in a user', function(done) {
//    api.login('toots', 'tootsie', function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      JSON.parse(body).user.username.should.equal('toots');
//      done();
//    });
//  });
//
//  it('creates a topic', function(done) {
//    api.createTopic('Have you heard', 'we are in the news', 'News', function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      var json = JSON.parse(body);
//      topic_id = json.id;
//      topic_id.should.be.above(0);
//      done();
//    });
//  });
//
//  it('replies to a topic', function(done) {
//    api.replyToTopic('this is just a test too', topic_id, function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      JSON.parse(body).id.should.be.above(0);
//      done();
//    });
//  });
//
//  it('replies to a post', function(done) {
//    api.replyToPost('whatevs', topic_id, 1, function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      JSON.parse(body).id.should.be.above(0);
//      done();
//    });
//  });
//
//  it('gets a topic and it\'s replies', function(done) {
//    api.getTopicAndReplies(547, function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      done();
//    });
//  });
//
//  it('creates a private message', function(done) {
//    api.createPrivateMessage('just between you and me', 'i know what you did', 'toots', function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      var json = JSON.parse(body);
//      pm_topic_id = json.id;
//      pm_topic_id.should.be.above(0);
//      done();
//    });
//  });
//
//  it('gets private messages for a user', function(done) {
//    api.getPrivateMessages('toots', function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      done();
//    });
//  });
//
//  it('replies to a private message', function(done) {
//    api.replyToPrivateMessage('or so you think :)', 1084, function(err, body) {
//      should.not.exist(err);
//      should.exist(body);
//      JSON.parse(body).id.should.be.above(0);
//      done();
//    });
//  });

});