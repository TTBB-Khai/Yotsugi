const path = require('path')
const spotify = require(path.join(process.cwd(), 'res', 'data', 'spotify.json'));
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');
var express = require("express");
var request = require("request");

var app = express();

const userpass = process.env['SPOTIFY_CLIENT_ID'] + ':' + process.env['SPOTIFY_CLIENT_SECRET'];
const basicAuth = 'Basic ' + Buffer.from(userpass).toString('base64');

var spotifyCommand = TTBT.registerCommand("spotify", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "spotify [ARTIST HERE]**";
	
	if (typeof(session.spotify.user.filter(function (user) {return user.id === msg.author.id})[0]) === 'undefined')
		session.spotify.user.push({"id": msg.author.id, "session": false});
	
	if (!session.spotify.user.filter(function (user) {return user.id === msg.author.id})[0].session) {
		let artist = args.join(" ").replace(/\s/g, "%20");
		session.spotify.user.filter(function (user) {return user.id === msg.author.id})[0].session = true;
		loadArtistList(artist, msg);
	}
	else
		return ":x: | You already have a menu open! Type 'exit' to cancel it.";

},	{
		cooldown: 5000,
		caseInsensitive: true,
		cooldownMessage: "Slow down buddy! This command has a **5 second cooldown!**",
		requirements: {
			"manageMessages": true
		}
	}
);

function loadArtistList(artist, msg) {
	async function getURL() {
		try {
			let response = await fetch('https://api.spotify.com/v1/search?type=artist&q=' + artist,
			{
				method: 'GET', 
				headers: {
					'Authorization': 'Bearer ' + spotify.accessToken
				}
			});
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load spotify.com");
			throw err;
		}
	}
		
	TTBT.sendChannelTyping(msg.channel.id);
		
	Promise.all([
		Promise.resolve(getURL()),
		Promise.resolve(msg)
	])
	.then(data => {
		printArtistList(data);
		return data;
	})
	.then(data => {
		if (data[0].artists.items.length !== 0) 
			getArtistId(data);
	})
	.catch(err => {
		TTBT.createMessage(msg.channel.id, "If you are the owner, to set up this command, please refer to the README.")
		session.spotify.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false
	})
}

function printArtistList(promiseData) {
	let artists = '```Markdown\n';
	artists += promiseData[0].artists.items.length === 0 ? 'No artists found with this search' : ' * Related Artists * \n\n';
		
	for (let i = 0; i <= promiseData[0].artists.items.length - 1; i++)
		artists += '[' + (i + 1) + '] ' + promiseData[0].artists.items[i].name + ' (Genre: ' + promiseData[0].artists.items[i].genres[0] + ')\n';
	
	if (promiseData[0].artists.items.length !== 0)
		artists += '\n' + '> Type the number of your choice into chat OR "exit" else to exit the menu';
	
	TTBT.createMessage(promiseData[1].channel.id, artists + '```');
	
	delete(promiseData);
}

function getArtistId(promiseData) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === promiseData[1].author.id && newMsg.channel.id === promiseData[1].channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 

				Promise.all([
					Promise.resolve(promiseData[0].artists.items[Number(newMsg.content) - 1]),
					Promise.resolve(promiseData[1])
				])
				.then(data => loadArtistInfo(data))
				.catch(err => TTBT.createMessage(promiseData[1].channel.id, 'You entered something invalid. The menu has been cancelled.'))
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(promiseData[1].channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.spotify.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.spotify.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
	}, 30 * 1000)
	
	delete(promiseData);
}

function loadArtistInfo(promiseData) {
	TTBT.createMessage(promiseData[1].channel.id, promiseData[0].external_urls.spotify);
	session.spotify.user.filter(function (user) {return user.id === promiseData[1].author.id})[0].session = false;
}
