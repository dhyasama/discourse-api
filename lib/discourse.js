"use strict";

var
  request = require('request'),
  requestSync = require('sync-request'),
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

      if (error) {
        callback(error, {}, 500);
      }
      else if (!error && !!body.status && body.status !== 'OK'){
        error = new Error(body.description || body.error_message);
      }

      callback(error, body || {}, response != null ? response.statusCode : null);

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

      callback(error, body || {}, response != null ? response.statusCode : null);

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

      callback(error, body || {}, response != null ? response.statusCode : null);

    });

};

Discourse.prototype.delete = function(url, parameters, callback) {

  var deleteUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  request({
      uri: deleteUrl,
      method: 'DELETE',
      form: parameters
    },
    function (error, response, body) {

      if (!error && !!body.status && body.status !== 'OK') {
        error = new Error(body.description || body.error_message);
      }

      callback(error, body || {}, response != null ? response.statusCode : null);

    });

};

/////////////////////
// USERS
/////////////////////

Discourse.prototype.createUser = function(name, email, username, password, active, callback) {

  var that = this;

  that.post('users',
    {
      'name': name,
      'email': email,
      'username': username,
      'password': password,
      'active': active
    },
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );

};

Discourse.prototype.getUser = function(username, callback) {
  this.get('users/' + username + '.json',
    {},
    function(error, body, httpCode) {

      if (error) return callback(error, null);

      try {
        var json = JSON.parse(body);
        if (json.user.id) return callback(null, json);
        else return callback(null, null);
      }
      catch (err) {
        return callback(err, null);
      }

    }
  );
};

Discourse.prototype.getUserActivity = function(username, offset, callback) {
  this.get('user_actions.json',
    {
      username: username,
      filter: actionTypeEnum.REPLY,
      offset: offset || 0
    },
    function(error, body, httpCode){
      callback(error, body, httpCode);
    }
  );
}

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

Discourse.prototype.getUserEmail = function(username, callback) {
  this.put('users/' + username + '/emails.json',
    {context: '/users/' + username + '/activity'},
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );
};

///////////////////////
// GROUPS
///////////////////////

Discourse.prototype.getGroupMembers = function(groupName, callback) {
  this.get('groups/' + groupName + '/members.json', {}, function (error, body, httpCode) {
    callback(error, body, httpCode);
  });
};

Discourse.prototype.createGroup = function(groupName, aliasLevel, automatic, email_domains, membership_retroactive, trust_level, primary_group, title, visible, callback) {
  this.post('admin/groups',
    {
      'name': groupName,
      'alias_level': aliasLevel || -2,
      'automatic': automatic || false,
      'automatic_membership_email_domains': email_domains || "",
      'automatic_membership_retroactive': membership_retroactive || false,
      'grant_trust_level': trust_level || 1,
      'primary_group': primary_group || false,
      'title': title,
      'visible': visible || true
    },
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

Discourse.prototype.deleteTopic = function(topic_id, callback) {

  this.delete('t/' + topic_id,
    {},
    function(error, body, httpCode) {
      callback(error, body, httpCode);
    }
  );

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

Discourse.prototype.getPost = function(post_id, callback) {

    this.get('posts/' + post_id + '.json',
        {},
        function (error, body, httpCode) {
            callback(error, JSON.parse(body), httpCode);
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

Discourse.prototype.getLastPostId = function(callback) {

  this.get('/posts.json',
    {},
    function (error, body, httpCode) {
      callback(error, JSON.parse(body).latest_posts[0].id, httpCode);
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

///////////////
// CATEGORIES
///////////////

Discourse.prototype.createCategory = function(name, color, text_color, parent_category_id, callback) {

  this.post('categories', {
    name: name,
    color: color || (~~(Math.random()*(1<<24))).toString(16),
    text_color: text_color || 'FFFFFF',
    parent_category_id: parent_category_id || null
  }, function(error, body, httpCode) {
    callback(error, body, httpCode);
  });

};

Discourse.prototype.getCategories = function(parameters, callback) {

  this.get('categories.json', parameters || {}, function(error, body, httpCode) {
    callback(error, body, httpCode);
  });

};



/////////////////////
// Synchronous HELPER
////////////////////

Discourse.prototype.getSync = function(url, parameters) {

  var getUrl = this.url + '/' + url +
    '?api_key=' + this.api_key +
    '&api_username=' + this.api_username +
    '&' + querystring.stringify(parameters);

  return requestSync('GET', getUrl);

};

Discourse.prototype.postSync = function(url, parameters) {
  var postUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  return requestSync('POST', postUrl, {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(parameters)
  });

};

Discourse.prototype.putSync = function(url, parameters, callback) {

  var putUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  return requestSync('PUT', putUrl, {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(parameters)
  });

};

Discourse.prototype.deleteSync = function(url, parameters, callback) {

  var deleteUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  return requestSync('DELETE', deleteUrl, {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(parameters)
  });

};



///////////////////////////////////
// Synchronous TOPICS AND REPLIES
///////////////////////////////////

Discourse.prototype.createTopicSync = function(title, raw, category) {

  return this.postSync('posts', { 'title': title, 'raw': raw, 'category': category, 'archetype': 'regular' });

};

Discourse.prototype.getCreatedTopicsSync = function(username) {

  return this.getSync('topics/created-by/' + (username || this.api_username)+ '.json');

};

Discourse.prototype.getPostSync = function(post_id) {

  return JSON.parse(this.getSync('posts/' + post_id + '.json').body);

};

Discourse.prototype.getLastPostIdSync = function() {

    var body = JSON.parse(this.getSync('/posts.json').body);
    return body.latest_posts[0].id;

};

Discourse.prototype.updatePostSync = function(post_id, raw, edit_reason) {

  return this.putSync('posts/' + post_id, {
    post: {
      raw: raw,
      edit_reason: edit_reason
    }
  });

};
