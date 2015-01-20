# passport-picsart

[![Build](https://travis-ci.org/PicsArt/passport-picsart.png)](http://travis-ci.org/PicsArt/passport-picsart)
[![Dependencies](https://david-dm.org/PicsArt/passport-picsart.png)](http://david-dm.org/PicsArt/passport-picsart)


[Passport](http://passportjs.org/) strategy for authenticating with [PicsArt](http://www.picsart.com/)
using the OAuth 2.0 API.

This module lets you authenticate using PicsArt in your Node.js applications.
By plugging into Passport, PicsArt authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-picsart

## Usage

#### Configure Strategy

The Twitter authentication strategy authenticates users using a Twitter account
and OAuth tokens.  The strategy requires a `verify` callback, which receives the
access token and corresponding secret as arguments, as well as `profile` which
contains the authenticated user's Twitter profile.   The `verify` callback must
call `done` providing a user to complete authentication.

In order to identify your application to Twitter, specify the consumer key,
consumer secret, and callback URL within `options`.  The consumer key and secret
are obtained by [creating an application](https://dev.twitter.com/apps) at
Twitter's [developer](https://dev.twitter.com/) site.

    passport.use(new TwitterStrategy({
        consumerKey: TWITTER_CONSUMER_KEY,
        consumerSecret: TWITTER_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ twitterId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'twitter'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/twitter',
      passport.authenticate('twitter'));
    
    app.get('/auth/twitter/callback', 
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [signin example](https://github.com/PicsArt/passport-picsart/tree/master/examples/signin).

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 PicsArt <[http://www.picsart.com/](http://www.picsart.com/)>
