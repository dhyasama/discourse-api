exports = module.exports = function(Discourse, actionTypeEnum) {

  "use strict";

  var actionTypeEnum = actionTypeEnum;

  Discourse.prototype.createTopic = function (params, callback) {
    this.post('posts', { 'writename': params.name, 'title': params.title, 'raw': params.raw, 'category': params.category, 'archetype': params.archetype || 'regular', 'tags[]': params.tag }, (error, body, httpCode) => {
      callback(error, body, httpCode);
    });
  };

  Discourse.prototype.createTopicSync = function(title, raw, category) {

    return this.postSync('posts', { 'title': title, 'raw': raw, 'category': category, 'archetype': 'regular' });

  };

  Discourse.prototype.getCreatedTopics = function(username, callback) {

    var that = this;

    this.get('user_actions.json',
      {
        username: username,
        filter: that.actionTypeEnum.NEW_TOPIC
      },
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.getCreatedTopicsSync = function(username) {

    return this.getSync('topics/created-by/' + (username || this.api_username)+ '.json', {}, true);

  };

  Discourse.prototype.getLastPostId = function(callback) {

    this.get('/posts.json',
      {},
      function (error, body, httpCode) {
        callback(error, JSON.parse(body).latest_posts[0].id, httpCode);
      }
    );

  };

  Discourse.prototype.getLastPostIdSync = function() {

    var response = this.getSync('posts.json', {}, true);
    if (response.statusCode === 200) {
      var body = JSON.parse(response.body);
      return body.latest_posts[0].id;
    } else {
      throw new Error(response.headers.status);
    }

  };

  Discourse.prototype.getPost = function(post_id, callback) {

    this.get('posts/' + post_id + '.json',
      {},
      function (error, body, httpCode) {
        callback(error, JSON.parse(body), httpCode);
      }
    );

  };

  Discourse.prototype.getPostSync = function(post_id) {

    return JSON.parse(this.getSync('posts/' + post_id + '.json', {}, true).body);

  };

  Discourse.prototype.replyToTopic = function(raw, topic_id, callback) {
    this.post('posts', { 'raw': raw, 'topic_id': topic_id }, function(error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

  Discourse.prototype.replyToPost = function(raw, topic_id, reply_to_post_number, callback) {
    this.post('posts', { 'raw': raw, 'topic_id': topic_id, 'reply_to_post_number': reply_to_post_number }, function(error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

  Discourse.prototype.getTopicAndReplies = function(topic_id, callback) {

    this.get('t/' + topic_id + '.json',
      {},
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.deleteTopic = function(topic_id, callback) {

    this.delete('t/' + topic_id,
      {},
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.updatePost = function(post_id, raw, edit_reason, callback) {

    this.put(
      'posts/' + post_id,
      { 'post[raw]': raw, 'post[edit_reason]': edit_reason },
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.updatePostSync = function(post_id, raw, edit_reason) {

    return this.putSync('posts/' + post_id, {
      post: {
        raw: raw,
        edit_reason: edit_reason
      }
    });

  };

  Discourse.prototype.updateTopic = function(slug, topic_id, title, category, callback) {

    this.put(
      't/' + slug + '/' + topic_id,
      { title: title, category: category },
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

};
