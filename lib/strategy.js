/**
 * Module dependencies.
 */
var util = require('util');
var uri	= require('url');
var OAuth2Strategy = require('passport-oauth2');
var Profile = require('./profile');
var APIError = require('./errors/apierror');


/**
 * `Strategy` constructor.
 *
 * The PicsArt authentication strategy authenticates requests by delegating to
 * PicsArt using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`
 * and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`					your PicsArt application's App ID
 *   - `clientSecret`			your PicsArt application's App Secret
 *   - `callbackURL`			URL to which PicsArt will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new PicsartStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/picsart/callback'
 *       },
 *       function(accessToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
	options.authorizationURL = options.authorizationURL || 'https://api.picsart.com/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://api.picsart.com/oauth2/token';
  options.scopeSeparator = options.scopeSeparator || ','; 
  
	OAuth2Strategy.call(this, options, verify);
  this.name = 'picsart';
	this._clientSecret = options.clientSecret;
	this._profileURL = options.profileURL || 'https://api.picsart.com/users/show/me.json'; 
	this._profileFields = options.profileFields || null;
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Authenticate request by delegating to PicsArt using OAuth 2.0.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
	if (req.query && req.query.error) {
		return this.error(new APIError(req.query.error_message, req.query.error_code));
	}
  
  OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
 * Retrieve user profile from PicsArt.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *	 - `provider`			always set to	`picsart`
 *   - `id`						the user's PicsArt ID
 *   - `username`			the user's PicsArt name
 *   - `displayName`	the user's full name
 *   - `photo`				the user's PicsArt profile photo
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
	var url = uri.format(this._profileURL);	
	this._oauth2.useAuthorizationHeaderforGET(true);
	this._oauth2.get(url, accessToken, function(err, body, res) {
		if (err) {
			return done(new APIError(err));
		}
		try {
			var json = JSON.parse(body);
		} catch(ex) {
			return done(new APIError('Failed to parse user profile'));
		}
		var profile = Profile.parse(json);
		profile.provider = 'picsart';
		profile._raw = body;
		profile._json = json;

		done(null, profile);
	});
};

/**
 * Parse error response from PicsArt OAuth 2.0  endpoint.
 *
 * @param {String} body
 * @param {Number} status
 * @return {Error}
 * @api protected
 */
Strategy.prototype.parseErrorResponse = function(body, status) {
	var json = JSON.parse(body);
	if (json.error && typeof json.error == 'object') {
		return new APIError(json.error);
	}
	return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);

};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
