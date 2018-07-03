const path = require('path')
const spotify = require(path.join(process.cwd(), 'res', 'data', 'spotify.json'));
var express = require("express");
var request = require("request");

var app = express();

const userpass = process.env['SPOTIFY_CLIENT_ID'] + ':' + process.env['SPOTIFY_CLIENT_SECRET'];
const basicAuth = 'Basic ' + Buffer.from(userpass).toString('base64');

var getAccessCommand = TTBT.registerCommand("token", (msg) => {
	
	if (msg.author.id !== config.ownerId)
		return "This is an owner only command!";

	app.get("/", function(request, response) {
	  var authUrl = "https://accounts.spotify.com/authorize?" + process.env['SPOTIFY_CLIENT_ID'] + 
		 '&client_id=' + process.env['SPOTIFY_CLIENT_ID'] +
		 '&redirect_uri=' + process.env['SPOTIFY_REDIRECT_URI'] +
		 '&response_type=code'
	  response.redirect(authUrl);
	});
	
	refreshToken();

	app.listen(3000, function() {
		console.log("Refreshing Access Token...")
	});


	// app.get("/callback", function (req, res) {

	  // var options = {
		// url: "https://accounts.spotify.com/api/token",
		// headers: {
			// 'Authorization': basicAuth
		// },
		// form: {
		  // grant_type: 'authorization_code',
		  // code: req.query.code,
		  // redirect_uri: config.redirectUri
		// }
	  // };

	  // request.post(options, function (error, response) {
		// console.log("Status code:", response.statusCode);
		// if (response.statusCode > 399) {
		  // console.log("Whops. Something weng wrong. What does the status code indiciate? If it is a 401, your client secret is probably invalid");
		// } 
		// else {
		  // console.log(response.statusCode);
		  // var body = JSON.parse(response.body);
		  // console.log(body.access_token);
		  // console.log(body);
		// }
	  // })
	// });

	// app.listen(3000, function() {
		// console.log("Generating Access Token...")
	// });
});

function refreshToken() {
	app.get("/callback", function (req, res) {
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
		
		request.post(options, function (error, response) {
			console.log("Status code:", response.statusCode);
			if (response.statusCode > 399)
				console.log("ERROR: COULD NOT REFRESH ACCESS TOKEN");
			else {
				var body = JSON.parse(response.body);
				spotify.accessToken = body.access_token;
				console.log('New access token: ' + spotify.accessToken + '\n');
			}
		})
	})
	
	setTimeout(refreshToken, 3600 * 1000);
}

