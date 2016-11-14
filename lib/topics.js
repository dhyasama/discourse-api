exports = module.exports = function(Discourse, actionTypeEnum) {

  "use strict";

  var actionTypeEnum = actionTypeEnum;

   Discourse.prototype.createTopic = function(title, raw, category, unlist_topic, tag_array, callback) {
    var params = { 'title': title, 'raw': raw, 'category': category, 'unlist_topic': unlist_topic, 
      'archetype': 'regular' };
    if (tag_array.length > 0) {
        params['tags[]'] =  tag_array;
    }
    this.post('posts', params, function(error, body, httpCode) {
        callback(error, body, httpCode);
      });
  };

  Discourse.prototype.createTopicSync = function(title, raw, category, unlist_topic, tag_array) {
    var params = { 'title': title, 'raw': raw, 'category': category, 'unlist_topic': unlist_topic, 
      'archetype': 'regular' };
    if (tag_array.length > 0) {
        params['tags[]'] =  tag_array;
    }
    return this.postSync('posts', params);

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

  Discourse.prototype.getPostsInTopic = function(topic_id, post_id_array, callback) {
    var params = {};
    if (post_id_array.length > 0) {
      params['post_ids[]'] = post_id_array;
    }
    this.get('t/' + topic_id + '/posts.json', params,
      function (error, body, httpCode) {
        callback(error, JSON.parse(body), httpCode);
      }); 

  };

  Discourse.prototype.getPostSync = function(post_id) {

    return JSON.parse(this.getSync('posts/' + post_id + '.json', {}, true).body);

  };

  Discourse.prototype.createPost = function(raw, topic_id, reply_to_post_number, callback) {
    var params = { 'raw': raw, 'topic_id': topic_id };
    if(typeof reply_to_post_number === 'number' && reply_to_post_number !== 0) {
      params.reply_to_post_number = reply_to_post_number;
    }
    this.post('posts', params, function(error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

  /*
    # Post Action Type IDs
    # 1 - Bookmark
    # 2 - Like
    # 3 - Flag: Off-topic
    # 4 - Flag: Inappropriate
    # 5 - Vote
    # 6 - Notify User
    # 7 - Flag: Notify Moderators
    # 8 - Flag: Spam
  */
  Discourse.prototype.createPostAction = function(post_id, post_action_type_id, callback) {
    this.post('post_actions', { 'id': post_id, 'post_action_type_id': post_action_type_id }, 
      function(error, body, httpCode) {
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

  Discourse.prototype.getInfoForTaggedTopics = function(tag, pageNumber, callback) {

    this.get('tags/' + tag + '.json',
      {page: pageNumber},
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

  Discourse.prototype.deletePost = function(post_id, callback) {

    this.delete(
      'posts/' + post_id, {},
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.updateTopic = function(topic_id, title, category, callback) {
    var params = { 'topic_id': topic_id, title: title };
    if (typeof category === 'string') {
      params.category = category;
    }
    this.put(
      't/' + topic_id, params,
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.uploadImage = function(username, data, callback) {
    this.postMultipart('uploads', {
      username: username,
      type: 'image',
      file: data,
      synchronous: 'true',
    }, function (error, body, httpCode) {
        callback(error, body, httpCode);
      });
  };

};
