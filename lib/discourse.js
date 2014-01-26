"use strict";

var request     = require('request'),
    querystring = require('querystring');

var actionTypeEnum = {
  LIKE: 1,
  WAS_LIKED: 2,
  BOOKMARK: 3,
  NEW_TOPIC: 4,
  REPLY: 5,
  RESPONSE: 6,
  MENTION: 7,
  QUOTE: 9,
  STAR: 10,
  EDIT: 11,
  NEW_PRIVATE_MESSAGE: 12,
  GOT_PRIVATE_MESSAGE: 13
};

var Discourse = function(url, api_key, api_username) {

  this.url = url;
  this.api_key = api_key;
  this.api_username = api_username;

};

module.exports = Discourse;



/////////////////////
// HELPERS
/////////////////////

Discourse.prototype.get = function(url, parameters, callback) {

  var getUrl = this.url + '/' + url +
    '?api_key=' + this.api_key +
    '&api_username=' + this.api_username +
    '&' + querystring.stringify(parameters);

  request.get({
      url: getUrl
    },
    function(error, response, body) {

      if(!error && !!body.status && body.status !== 'OK'){
        error = new Error(body.description || body.error_message);
      }

      callback(error, body || {}, response.statusCode);

    }
  );
};

Discourse.prototype.post = function(url, parameters, callback) {

  var postUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  request({
    uri: postUrl,
    method: 'POST',
    form: parameters
  },
  function (error, response, body) {

    if (!error && !!body.status && body.status !== 'OK') {
      error = new Error(body.description || body.error_message);
    }

    callback(error, body || {}, response.statusCode);

  });

};

Discourse.prototype.put = function(url, parameters, callback) {

  var putUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  request({
      uri: putUrl,
      method: 'PUT',
      form: parameters
    },
    function (error, response, body) {

      if (!error && !!body.status && body.status !== 'OK') {
        error = new Error(body.description || body.error_message);
      }

      callback(error, body || {}, response.statusCode);

    });

};

Discourse.prototype.delete = function(url, parameters, callback) {

  var deleteUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  request({
      uri: deleteUrl,
      method: 'POST',
      form: parameters
    },
    function (error, response, body) {

      if (!error && !!body.status && body.status !== 'OK') {
        error = new Error(body.description || body.error_message);
      }

      callback(error, body || {}, response.statusCode);

    });

};



/////////////////////
// USERS
/////////////////////

Discourse.prototype.createUser = function(name, email, username, password, callback) {

  var that = this;

  this.fetchConfirmationValue(function(error, body) {

    var json = JSON.parse(body);

    that.post('users',
      {
        'name': name,
        'email': email,
        'username': username,
        'password': password,
        'password_confirmation': json.value,
        'challenge': json.challenge.split("").reverse().join("") // reverse the string - boo! security via obscurity
      },
      function(error, body, httpCode) {
        callback(error, body, httpCode);
      }
    );

  });

};

Discourse.prototype.getUser = function(username, callback) {
  this.get('users/' + username + '.json',
    {},
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );
};

Discourse.prototype.approveUser = function(id, username, callback) {
  this.put('admin/users/' + id + '/approve',
    { context: 'admin/users/' + username },
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );
};

Discourse.prototype.activateUser = function(id, username, callback) {
  this.put('admin/users/' + id + '/activate',
    { context: 'admin/users/' + username },
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );
};

Discourse.prototype.deleteUser = function(id, username, callback) {
  this.delete(id + '.json',
    { context: 'admin/users/' + username },
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );
};

Discourse.prototype.login = function(username, password, callback) {
  this.post('session', { 'login': username, 'password': password }, function(error, body, httpCode) {
    callback(error, body, httpCode);
  });
};

Discourse.prototype.logout = function(username, callback) {
  this.delete('session/' + username, {}, function(error, body, httpCode) {
    callback(error, body, httpCode);
  });
};

Discourse.prototype.fetchConfirmationValue = function(callback) {

  // discourse api should bypass the honeypot since it is a trusted user (confirmed via api key)

  this.get('users/hp.json',
    {},
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );

};



///////////////////////
// TOPICS AND REPLIES
///////////////////////

Discourse.prototype.createTopic = function(title, raw, category, callback) {
  this.post('posts', { 'title': title, 'raw': raw, 'category': category, 'archetype': 'regular' }, function(error, body, httpCode) {
    callback(error, body, httpCode);
  });
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



/////////////////////
// PRIVATE MESSAGES
/////////////////////

// NOTE - It appears as though private messages are really just topics with a private flag. The original pm is assigned
// a topic_id (and a post_id) and each reply is given a post_id.

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
    'topics/private-messages/' + 'quincy' + '.json',
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



/////////////////////
// SEARCH
/////////////////////

Discourse.prototype.searchForUser = function(username, callback) {
  this.get('users/search/users.json', { term: username }, function(error, body, httpCode) {
    callback(error, body, httpCode);
  });
};

Discourse.prototype.search = function(term, callback) {
  this.get('search.json', { term: term }, function(error, body, httpCode) {
    callback(error, body, httpCode);
  });
};

