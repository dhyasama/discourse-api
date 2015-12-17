exports = module.exports = function(Discourse, actionTypeEnum) {

  "use strict";

  var actionTypeEnum = actionTypeEnum;

  Discourse.prototype.createPrivateMessage = function(title, raw, target_usernames, callback) {
    this.post('posts',
      {
        'title': title,
        'raw': raw,
        'target_usernames': target_usernames,
        'archetype': 'private_message'
      },
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );
  };

  Discourse.prototype.getPrivateMessages = function(username, callback) {

    this.get(
      'topics/private-messages/' + username + '.json',
      {},
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      });

  };

  Discourse.prototype.getUnreadPrivateMessages = function(username, callback) {

    this.get(
      'topics/private-messages-unread/' + username + '.json',
      {},
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      });

  };

  Discourse.prototype.getPrivateMessageThread = function(topic_id, callback) {

    this.getTopicAndReplies(topic_id, callback);

  };

  Discourse.prototype.getSentPrivateMessages = function(username, callback) {

    this.get('user_actions.json',
      {
        username: username,
        filter: actionTypeEnum.NEW_PRIVATE_MESSAGE
      },
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.getReceivedPrivateMessages = function(username, callback) {

    this.get('user_actions.json',
      {
        username: username,
        filter: actionTypeEnum.GOT_PRIVATE_MESSAGE
      },
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  };

  Discourse.prototype.replyToPrivateMessage = function(raw, topic_id, callback) {
    this.post('posts', { 'raw': raw, 'topic_id': topic_id }, function(error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

};
