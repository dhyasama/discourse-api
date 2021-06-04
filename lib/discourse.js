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

require('./categories')(Discourse, actionTypeEnum);
require('./groups')(Discourse, actionTypeEnum);
require('./pms')(Discourse, actionTypeEnum);
require('./search')(Discourse, actionTypeEnum);
require('./topics')(Discourse, actionTypeEnum);
require('./users')(Discourse, actionTypeEnum);

//////////////////////////////

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

Discourse.prototype.getSync = function(url, parameters, auth) {

  var qs = auth? {
    api_key: this.api_key,
    api_username: this.api_username
  } : {};
  for (var p in parameters) qs[p] = parameters[p];

  var getUrl = this.url + '/' + url;

  return requestSync('GET', getUrl, {qs: qs});

};

Discourse.prototype.post = function(url, parameters, callback) {

  var postUrl = this.url + '/' + url// + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  let name = parameters.writename || this.api_username;
  
  request.post(
    postUrl,
    {
      headers:{
        'Contents-Type': 'Application/json',
        'Api-Username': name,
        'Api-Key': this.api_key
      },
      formData: parameters
    },
    function (error, response, body) {

      if (!error && !!body.status && body.status !== 'OK') {
        error = new Error(body.description || body.error_message);
      }

      callback(error, body || {}, response != null ? response.statusCode : null);

    });

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

Discourse.prototype.putSync = function(url, parameters, callback) {

  var putUrl = this.url + '/' + url + '?api_key=' + this.api_key + '&api_username=' + this.api_username;

  return requestSync('PUT', putUrl, {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(parameters)
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

Discourse.prototype.deleteSync = function (url, parameters, callback) {

  var deleteUrl = this.url + '/' + url;
  var qs = {
    api_key: this.api_key,
    api_username: this.api_username
  };
  for (var p in parameters) qs[p] = parameters[p];

  return requestSync('DELETE', deleteUrl, {
    headers: {
      'content-type': 'application/json'
    },
    qs: qs
  });
};

//////////////////////////////

module.exports = Discourse;
