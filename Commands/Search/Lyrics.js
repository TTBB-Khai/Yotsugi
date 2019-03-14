//'use strict';

const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');
const cheerio = require('cheerio');
global.Promise = require('bluebird');

TTBT.registerCommand("lyrics", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "lyrics [SONG HERE]**";
	
	if (typeof(session.genius.user.filter(user => user.id === msg.author.id)[0]) === 'undefined')
		session.genius.user.push({"id": msg.author.id, "session": false});
	
	if (!session.genius.user.filter(user => user.id === msg.author.id)[0].session) {
		let song = args.join(" ").replace(/\s/g, "%20");
		session.genius.user.filter(user => user.id === msg.author.id)[0].session = true;
		loadSongList(song, msg);
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

const loadSongList = (song, msg) => {

	TTBT.sendChannelTyping(msg.channel.id);
		
	fetch('https://api.genius.com/search?q=' + song + '&access_token=' + process.env['GENIUS_ACCESS_TOKEN'])
	.then((response, err) => {
		if (response.ok)
			return response.json();
		else {
			session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
			console.log("No JSON to parse!");
		}
	})
	.then(response => {
		printSongList(response, msg);
		return response;
	})
	.then(response => {
		if (response.response.hits.length !== 0) 
			getSong(response, msg);
		else
			session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
	})
	.catch(err => {
		if (msg.author.id === process.env['CLIENT_OWNERID'])
			TTBT.createMessage(msg.channel.id, "You have not set up this command! To do so, please refer to the README.");
		else
			TTBT.createMessage(msg.channel.id, "The owner of this bot does not have this command enabled yet!");
		throw err;
		session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
	})
}

const printSongList = (songData, msg) => {
	let songs = '```Markdown\n';
	songs += songData.response.hits.length === 0 ? 'No songs found with this search' : ' * Related Songs * \n\n';
		
	for (let i = 0; i <= songData.response.hits.length - 1; i++)
		songs += '[' + (i + 1) + '] ' + songData.response.hits[i].result.full_title + '\n';
	
	if (songData.response.hits.length !== 0)
		songs += '\n' + '> Type the number of your choice into chat OR type "exit" to exit the menu';
	else
		session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
	
	TTBT.createMessage(msg.channel.id, songs + '```');
}

const getSong = (songData, msg) => {
	const waitMessage = (newMsg) => {
		if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0) {
				TTBT.removeListener('messageCreate', waitMessage, true); 
				loadLyrics(songData.response.hits[Number(newMsg.content) - 1], msg);
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(msg.channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitMessage, true); 
				session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitMessage);
		session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
	}, 30 * 1000)
}

const loadLyrics = (song, msg) => {
	const getURL = async() => {
		try {
			let response = await fetch(song.result.url);
			let text = await response.text();
			let $ = cheerio.load(text);
			return $('.lyrics').text().trim();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load genius.com");
			throw err;
		}
	}
		
	TTBT.sendChannelTyping(msg.channel.id);
		
	Promise.resolve(getURL())
	.then(data => printLyrics(data, msg, song))
	.catch(err => {
		ttbt.createmessage(msg.channel.id, "no songs found with this search.");
		session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
	})
}

const printLyrics = (lyricData, msg, song) => {
	let output = (lyricData.length < 2000) ? '```Markdown\n' + lyricData + '\n```' 
	: 'These lyrics are too long to fit in a discord message ):\n**Here is a link to the full lyrics: ' + song.result.url + '**';
	
	TTBT.createMessage(msg.channel.id, output);
	session.genius.user.filter(user => user.id === msg.author.id)[0].session = false;
}

TTBT.registerCommandAlias("lyric", "lyrics");