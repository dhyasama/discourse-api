"use strict";

var
  should  = require("should"),
  fs      = require('fs'),
  path    = require('path'),
  config  = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('Discourse User API', function() {

  var
    Discourse = require('../lib/discourse'),
    api       = new Discourse(config.url, config.api.key, config.api.username),
    user_id   = '',
    username  = '',
    password  = '';

  it('creates a user', function(done) {

    require('crypto').randomBytes(5, function(err, buf) {

      // pick a random username, doesn't have to be humane
      // use that to create a full name (TEST is first name, username is last name)
      // add username to email address so it will be unique. takes advantage of gmail trick of making dhyasama@gmail become dhyasama+[whatevs]@gmail.com
      // password is always the same so you can log in as user if you want to verify via web ui

      var
        random    = buf.toString('hex').toUpperCase(),
        fullName  = 'Test ' + random,
        email     = config.user.new.email.replace('@', '+' + random + '@');

      username = random;
      password = config.user.new.password;

      api.createUser(fullName, email, username, password, function(err, body, httpCode) {

        // make assertions
        should.not.exist(err);
        should.exist(body);
        httpCode.should.equal(200);

        var json = JSON.parse(body);

        //make more assertions
        json.should.have.properties('success');
        json.success.should.equal(true);

        user_id = json.user_id;

        done();

      });

    });
  });

  it('activates a user', function(done) {

    api.activateUser(user_id, username, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      done();

    });

  });

  it('gets a user', function(done) {

    // username is assigned in previous test

    api.getUser(username, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      var json = JSON.parse(body);

      // make more assertions
      json.should.have.properties('user');
      json.user.should.have.properties('id');

      done();

    });
  });

  it('approves a user', function(done) {

    // user_id and username are assigned in previous test

    api.approveUser(user_id, username, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      done();

    });
  });

  it('logs in a user', function(done) {

    // username and password are assigned in previous test

    api.login(username, password, function(err, body, httpCode) {

      // make assertions
      should.not.exist(err);
      should.exist(body);
      httpCode.should.equal(200);

      var json = JSON.parse(body);

      // make more assertions
      json.should.not.have.properties('error'); // todo - should this be in more places?
      json.should.have.properties('user');
      json.user.should.have.properties('username');
      json.user.username.should.equal(username);

      done();

    });
  });

});
