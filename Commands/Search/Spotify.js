//'use strict';

const path = require('path')
const spotify = require(path.join(process.cwd(), 'res', 'data', 'spotify.json'));
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');
global.Promise = require('bluebird');

const userpass = process.env['SPOTIFY_CLIENT_ID'] + ':' + process.env['SPOTIFY_CLIENT_SECRET'];
const basicAuth = 'Basic ' + Buffer.from(userpass).toString('base64');

TTBT.registerCommand("spotify", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "spotify [ARTIST HERE]**";
	
	if (typeof(session.spotify.user.filter(user => user.id === msg.author.id)[0]) === 'undefined')
		session.spotify.user.push({"id": msg.author.id, "session": false});
	
	if (!session.spotify.user.filter(user => user.id === msg.author.id)[0].session) {
		let artist = args.join(" ").replace(/\s/g, "%20");
		session.spotify.user.filter(user => user.id === msg.author.id)[0].session = true;
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

const loadArtistList = (artist, msg) => {

	TTBT.sendChannelTyping(msg.channel.id);
		
	fetch('https://api.spotify.com/v1/search?type=artist&q=' + artist, {
		method: 'GET', 
		headers: {
			'Authorization': 'Bearer ' + spotify.accessToken
		}
	})
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else {
			session.spotify.user.filter(user => user.id === msg.author.id)[0].session = false;
			throw new TypeError("No JSON to parse!");
		}
	})
	.then(response => {
		printArtistList(response, msg);
		return response;
	})
	.then(response => {
		if (response.artists.items.length !== 0) 
			getArtistId(response, msg);
		else
			session.spotify.user.filter(user => user.id === msg.author.id)[0].session = false;
	})
	.catch(err => {
		if (msg.author.id === process.env['CLIENT_OWNERID'])
			TTBT.createMessage(msg.channel.id, "You have not set up this command! To do so, please refer to the README.");
		else
			TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
		throw err;
		session.spotify.user.filter(user => user.id === msg.author.id)[0].session = false;
	})
}

const printArtistList = (spotifyData, msg) => {
	let artists = '```Markdown\n';
	artists += spotifyData.artists.items.length === 0 ? 'No artists found with this search' : ' * Related Artists * \n\n';
		
	for (let i = 0; i <= spotifyData.artists.items.length - 1; i++)
		artists += '[' + (i + 1) + '] ' + spotifyData.artists.items[i].name + ' (Genre: ' + spotifyData.artists.items[i].genres[0] + ')\n';
	
	if (spotifyData.artists.items.length !== 0)
		artists += '\n' + '> Type the number of your choice into chat OR type "exit" to exit the menu';
	else
		session.spotify.user.filter(user => user.id === msg.author.id)[0].session = false
	
	TTBT.createMessage(msg.channel.id, artists + '```');
}

const getArtistId = (spotifyData, msg) => {
	const waitMessage = (newMsg) => {
		if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0) {
				TTBT.removeListener('messageCreate', waitMessage, true); 
				loadArtistInfo(spotifyData.artists.items[Number(newMsg.content) - 1], msg);
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(msg.channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitMessage, true); 
				session.spotify.user.filter(user => user.id === msg.author.id)[0].session = false
			}
		}
	}	
	
	TTBT.on('messageCreate', waitMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitMessage);
		session.spotify.user.filter(user => user.id === msg.author.id)[0].session = false
	}, 30 * 1000)
}

const loadArtistInfo = (artistData, msg) => {
	TTBT.createMessage(msg.channel.id, artistData.external_urls.spotify);
	session.spotify.user.filter(user => user.id === msg.author.id)[0].session = false
}
