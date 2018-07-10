const path = require('path')
const session = require(path.join(process.cwd(), 'res', 'data', 'session.json'));
const fetch = require('node-fetch');
const cheerio = require('cheerio');

var lyricsCommand = TTBT.registerCommand("lyrics", (msg, args) => {
	if(args.length === 0)
		return "Incorrect usage. Correct usage: **" + process.env['CLIENT_PREFIX'] + "lyrics [SONG HERE]**";
	
	if (typeof(session.genius.user.filter((user) => {return user.id === msg.author.id})[0]) === 'undefined')
		session.genius.user.push({"id": msg.author.id, "session": false});
	
	if (!session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session) {
		let song = args.join(" ").replace(/\s/g, "%20");
		session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session = true;
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

function loadSongList(song, msg) {
	async function getURL() {
		try {
			let response = await fetch('https://api.genius.com/search?q=' + song + '&access_token=' + process.env['GENIUS_ACCESS_TOKEN']);
			return await response.json();
		}
		catch (err) {
			TTBT.createMessage(msg.channel.id, "Failed to load genius.com");
			throw err;
		}
	}
		
	TTBT.sendChannelTyping(msg.channel.id);
		
	Promise.resolve(getURL())
	.then(data => {
		printSongList(data, msg);
		return data;
	})
	.then(data => {
		if (data.response.hits.length !== 0) 
			getSong(data, msg);
	})
	.catch(err => {
		if (msg.author.id === process.env['CLIENT_OWNERID'])
			TTBT.createMessage(msg.channel.id, "You have not set up this command! To do so, please refer to the README.");
		throw err;
		session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	})
}

function printSongList(songData, msg) {
	let songs = '```Markdown\n';
	songs += songData.response.hits.length === 0 ? 'No songs found with this search' : ' * Related Songs * \n\n';
		
	for (let i = 0; i <= songData.response.hits.length - 1; i++)
		songs += '[' + (i + 1) + '] ' + songData.response.hits[i].result.full_title + '\n';
	
	if (songData.response.hits.length !== 0)
		songs += '\n' + '> Type the number of your choice into chat OR type "cancel" to exit the menu';
	else
		session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	
	TTBT.createMessage(msg.channel.id, songs + '```');
}

function getSong(songData, msg) {
	function waitForYourMessage (newMsg) {
		if (newMsg.author.id === msg.author.id && newMsg.channel.id === msg.channel.id) {
			if (!isNaN(newMsg.content) && newMsg.content != 0) {
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				loadLyrics(songData.response.hits[Number(newMsg.content) - 1], msg);
			}
			else if (newMsg.content === 'exit') { 
				TTBT.createMessage(msg.channel.id, 'You have exited the menu');
				TTBT.removeListener('messageCreate', waitForYourMessage, true); 
				session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
			}
		}
	}	
	
	TTBT.on('messageCreate', waitForYourMessage);
	
	setTimeout(() => {
		TTBT.removeListener('messageCreate', waitForYourMessage);
		session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	}, 30 * 1000)
}

function loadLyrics(song, msg) {
	async function getURL() {
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
		TTBT.createMessage(msg.channel.id, "No songs found with this search.");
		session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
	})
}

function printLyrics(lyricData, msg, song) {
	let output = (lyricData.length < 2000) ? '```Markdown\n' + lyricData + '\n```' 
	: 'These lyrics are too long to fit in a discord message ):\n **Here is a link to the full lyrics: ' + song.result.url + '**';
	
	TTBT.createMessage(msg.channel.id, output);
	session.genius.user.filter((user) => {return user.id === msg.author.id})[0].session = false;
}

TTBT.registerCommandAlias("lyric", "lyrics");