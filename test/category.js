"use strict";

var
  should  = require("should"),
  fs      = require('fs'),
  path    = require('path'),
  config  = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('Discourse Category API', function() {
  var
    Discourse = require('../lib/discourse'),
    api = new Discourse(config.url, config.api.key, config.api.username),

  it('creates a category', function(done) {

    require('crypto').randomBytes(5, function(err, buf) {

      api.createCategory(config.category.name + ' ' + buf.toString('hex').toUpperCase(), config.category.color, config.category.text_color, config.category.parent_category_id, function(err, body, httpCode) {

        // make assertions
        should.not.exist(err);
        should.exist(body);

        httpCode.should.equal(200);

        var json = JSON.parse(body);

        // make more assertions
        json.should.have.properties('category');
        json.category.id.should.be.above(0);

        done();

      });

    });

  });

  it('gets category list', function(done) {

    api.getCategories({}, function (err, body, httpCode) {
      // make assertions
      should.not.exist(err);
      should.exist(body);

      httpCode.should.equal(200);


      var json = JSON.parse(body);

      // make more assertions
      json.should.have.properties('category_list');

      done();
    });

  });


});