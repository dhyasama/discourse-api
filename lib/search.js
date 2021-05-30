exports = module.exports = function(Discourse) {

  "use strict";

  Discourse.prototype.searchForUser = function(username, callback) {
    this.get('users/search/users.json', { term: username }, function(error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

  Discourse.prototype.search = function(parameter, callback) {
    this.get('search.json', parameter, function(error, body, httpCode) {
      callback(error, body, httpCode);
    });
  };

};
