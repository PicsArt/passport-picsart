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

The PicsArt authentication strategy authenticates users using a PicsArt account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which receives the
access token and corresponding secret as arguments, as well as `profile` which
contains the authenticated user's PicsArt profile.   The `verify` callback must
call `done` providing a user to complete authentication.

In order to identify your application to PicsArt, specify the client ID,
client secret, and callback URL within `options`.  The client ID and secret
are obtained by [creating an application](https://dev.picsart.com/apps) at
PicsArt's [developer](https://dev.picsart.com/) site.

    passport.use(new PicsartStrategy({
        clientId: PICSART_CLIENT_ID,
        clientSecret: PICSART_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/picsart/callback"
      },
      function(accessToken, profile, done) {
        User.findOrCreate({ picsartId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'picsart'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/picsart',
      passport.authenticate('picsart'));
    
    app.get('/auth/picsart/callback', 
      passport.authenticate('picsart', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 PicsArt <[http://www.picsart.com/](http://www.picsart.com/)>
