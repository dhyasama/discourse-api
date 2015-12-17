exports = module.exports = function(Discourse) {

  "use strict";

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

  Discourse.prototype.getCategoryLatestTopic = function(category_slug, params, callback) {
    var url = 'c/' + category_slug + '/l/latest.json';
    this.get(url, params || {}, function(error, body,httpCode) {
      callback(error, body, httpCode);
    });

  }

};
