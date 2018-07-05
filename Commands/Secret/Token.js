const path = require('path')
const spotify = require(path.join(process.cwd(), 'res', 'data', 'spotify.json'));
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const opn = require("opn");
var express = require("express");
var request = require("request");

var app = express();

const userpass = process.env['SPOTIFY_CLIENT_ID'] + ':' + process.env['SPOTIFY_CLIENT_SECRET'];
const basicAuth = 'Basic ' + Buffer.from(userpass).toString('base64');

var getAccessCommand = TTBT.registerCommand("token", (msg) => {
	
	if (msg.author.id !== process.env['CLIENT_OWNERID'])
		return "This is an owner only command!";
	
	if (session.token === true)
		return "Your access tokens are already being automatically refreshed!";
	
	opn(process.env['SPOTIFY_REDIRECT_URI']);

	app.get("/", (request, response) => {
	  var authUrl = "https://accounts.spotify.com/authorize?" +
		 'client_id=' + process.env['SPOTIFY_CLIENT_ID'] +
		 '&redirect_uri=' + process.env['SPOTIFY_REDIRECT_URI'] +
		 '&response_type=code' +
		 '&scope=user-read-private user-read-email' +
		 '&state=acb';
	  response.redirect(authUrl);
	});
	
	if (process.env['SPOTIFY_REFRESH_TOKEN'].length > 0)
		refreshAccessToken(msg); 
	else
		getRefreshToken(msg); 
	
	app.listen(3000, () => {
		console.log("Getting things ready...\n")
	});
	
});

function getRefreshToken(msg) {
	app.get("/callback", (req, res) => {
	  var options = {
		url: "https://accounts.spotify.com/api/token",
		headers: {
			'Authorization': basicAuth,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
		  grant_type: 'authorization_code',
		  code: req.query.code,
		  redirect_uri: process.env['SPOTIFY_REDIRECT_URI']
		},
		json: true
	  };

	  request.post(options, (error, response) => {
		console.log("Status code:", response.statusCode);
		if (response.statusCode > 399)
		  console.log("ERROR: COULD NOT RETRIEVE REFRESH TOKEN");
		else {
		  console.log(response.statusCode);
		  var body = JSON.parse(response.body);
		  TTBT.createMessage(msg.channel.id, "Your refresh token has been printed to console! Copy and paste it into the .env file!")
		  console.log("Refresh Token: " + body.refresh_token);
		}
	  })
	});
}

function refreshAccessToken(msg) {
	app.get("/callback", (req, res) => {
		var options = {
			url: "https://accounts.spotify.com/api/token",
			headers: {
				'Authorization': basicAuth
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: process.env['SPOTIFY_REFRESH_TOKEN']
			}
		};
		
		request.post(options, (error, response) => {
			console.log("Status code:", response.statusCode);
			if (response.statusCode > 399) {
				console.log("ERROR: COULD NOT REFRESH ACCESS TOKEN");
				TTBT.createMessage(msg.channel.id, "Your refresh token is invalid!")
			}
			else {
				var body = JSON.parse(response.body);
				spotify.accessToken = body.access_token;
				console.log("New Acces Token: " + spotify.accessToken);
				TTBT.createMessage(msg.channel.id, "The spotify command can now be used!");
				session.token = true;
			}
		})
	})
	
	setTimeout(refreshAccessToken, 3600 * 1000);
}

