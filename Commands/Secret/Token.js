//'use strict';

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

	app.get("/", (req, res) => {
	  var authUrl = "https://accounts.spotify.com/authorize?" +
		 'client_id=' + process.env['SPOTIFY_CLIENT_ID'] +
		 '&redirect_uri=' + process.env['SPOTIFY_REDIRECT_URI'] +
		 '&response_type=code' +
		 '&scope=user-read-private user-read-email';
	  res.redirect(authUrl);
	});
	
	if (process.env['SPOTIFY_REFRESH_TOKEN'].length > 0)
		refreshAccessToken(msg); 
	else
		getRefreshToken(msg); 
	
	app.listen(process.env['SPOTIFY_REDIRECT_URI'].replace( /[^\d\.]*/g, ''), () => {
		console.log("Getting things ready...");
	});
	
});

function getRefreshToken(msg) {
	app.get("/callback", (req, res) => {
		console.log(req.query);
	  var options = {
		url: "https://accounts.spotify.com/api/token",
		headers: {
			'Authorization': basicAuth
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
		if (response.statusCode > 399) {
		  TTBT.createMessage(msg.channel.id, ":x: | ERROR: COULD NOT LOAD JSON! Check to see if your client_secret, client_id, and redirect_uri are valid!");
		  session.token = false;
		}
		else {
		  console.log(response.statusCode);
		  let body = JSON.parse(response.body);
		  TTBT.createMessage(msg.channel.id, "Your refresh token has been printed to console! Copy and paste it into the .env file!");
		  console.log("Refresh Token: " + body.refresh_token);
		  session.token = true;
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
				TTBT.createMessage(msg.channel.id, ":x: | ERROR: COULD NOT REFRESH ACCESS TOKEN! Your refresh token may be invalid!");
				session.token === false;
			}
			else {
				let body = JSON.parse(response.body);
				spotify.accessToken = body.access_token;
				console.log("New Acces Token: " + spotify.accessToken);
				TTBT.createMessage(msg.channel.id, "The spotify command can now be used!");
				session.token = true;
			}
		})
	})
	
	setTimeout(refreshAccessToken, 3600 * 1000);
}

